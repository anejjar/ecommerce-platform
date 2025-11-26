import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST /api/cart/items/[id]/customizations
 * Add or update customizations for a cart item
 */
export async function POST(request: NextRequest, context: RouteParams) {
  try {
    // Check authentication - session required
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { id: cartItemId } = await context.params;
    const body = await request.json();
    const { customizations } = body; // Array of { fieldId, value, fileUrl?, fileName? }

    // Validate input
    if (!customizations || !Array.isArray(customizations)) {
      return NextResponse.json(
        { error: 'Customizations must be an array' },
        { status: 400 }
      );
    }

    // Check if cart item exists and belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: {
          userId: user.id,
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            published: true,
          },
        },
        customizations: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found or does not belong to you' },
        { status: 404 }
      );
    }

    if (!cartItem.product.published) {
      return NextResponse.json(
        { error: 'Product is no longer available' },
        { status: 400 }
      );
    }

    // Get all customization fields for this product
    const fields = await prisma.productCustomizationField.findMany({
      where: { productId: cartItem.product.id },
      include: {
        options: true,
      },
    });

    // Create a map for quick field lookup
    const fieldsMap = new Map(fields.map((field) => [field.id, field]));

    // Validate all customizations
    const validationErrors: string[] = [];
    const customizationsToCreate: any[] = [];

    for (const customization of customizations) {
      const { fieldId, value, fileUrl, fileName } = customization;

      // Check if field exists
      const field = fieldsMap.get(fieldId);
      if (!field) {
        validationErrors.push(`Field ${fieldId} not found`);
        continue;
      }

      // Check required fields
      if (field.required && !value && !fileUrl) {
        validationErrors.push(`Field "${field.label}" is required`);
        continue;
      }

      // Validate based on field type
      let priceModifier = Number(field.priceModifier) || 0;

      switch (field.type) {
        case 'TEXT':
        case 'TEXTAREA':
          if (value) {
            if (field.minLength && value.length < field.minLength) {
              validationErrors.push(
                `Field "${field.label}" must be at least ${field.minLength} characters`
              );
            }
            if (field.maxLength && value.length > field.maxLength) {
              validationErrors.push(
                `Field "${field.label}" must be at most ${field.maxLength} characters`
              );
            }
            if (field.pattern) {
              try {
                const regex = new RegExp(field.pattern);
                if (!regex.test(value)) {
                  validationErrors.push(
                    `Field "${field.label}" does not match the required pattern`
                  );
                }
              } catch (e) {
                console.error('Invalid regex pattern:', field.pattern);
              }
            }
          }
          break;

        case 'NUMBER':
          if (value) {
            const numValue = parseFloat(value);
            if (isNaN(numValue)) {
              validationErrors.push(`Field "${field.label}" must be a valid number`);
            } else {
              if (field.minValue !== null && numValue < Number(field.minValue)) {
                validationErrors.push(
                  `Field "${field.label}" must be at least ${field.minValue}`
                );
              }
              if (field.maxValue !== null && numValue > Number(field.maxValue)) {
                validationErrors.push(
                  `Field "${field.label}" must be at most ${field.maxValue}`
                );
              }
            }
          }
          break;

        case 'DROPDOWN':
        case 'RADIO':
          if (value) {
            // Validate that the selected value exists in options
            const option = field.options.find((opt) => opt.value === value);
            if (!option) {
              validationErrors.push(
                `Invalid option selected for field "${field.label}"`
              );
            } else {
              // Use option-specific price modifier if available
              if (option.priceModifier !== null) {
                priceModifier = Number(option.priceModifier);
              }
            }
          }
          break;

        case 'CHECKBOX':
          if (value) {
            try {
              // Value should be a JSON array of selected values
              const selectedValues = JSON.parse(value);
              if (!Array.isArray(selectedValues)) {
                validationErrors.push(
                  `Field "${field.label}" must be an array of values`
                );
              } else {
                // Validate each selected value
                const validOptions = field.options.map((opt) => opt.value);
                const invalidValues = selectedValues.filter(
                  (val) => !validOptions.includes(val)
                );
                if (invalidValues.length > 0) {
                  validationErrors.push(
                    `Invalid options selected for field "${field.label}": ${invalidValues.join(', ')}`
                  );
                }

                // Calculate combined price modifier for selected options
                priceModifier = selectedValues.reduce((sum, val) => {
                  const option = field.options.find((opt) => opt.value === val);
                  if (option && option.priceModifier !== null) {
                    return sum + Number(option.priceModifier);
                  }
                  return sum;
                }, 0);

                // If no option-specific modifiers, use field modifier
                if (priceModifier === 0 && field.priceModifier) {
                  priceModifier = Number(field.priceModifier);
                }
              }
            } catch (e) {
              validationErrors.push(
                `Field "${field.label}" must be a valid JSON array`
              );
            }
          }
          break;

        case 'FILE':
          if (!fileUrl && field.required) {
            validationErrors.push(`File upload is required for field "${field.label}"`);
          }
          break;

        case 'COLOR':
          if (value) {
            // Validate hex color format
            const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
            if (!hexColorRegex.test(value)) {
              validationErrors.push(
                `Field "${field.label}" must be a valid hex color (e.g., #FF0000)`
              );
            }
          }
          break;

        case 'DATE':
          if (value) {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
              validationErrors.push(`Field "${field.label}" must be a valid date`);
            }
          }
          break;
      }

      // Add to customizations to create
      customizationsToCreate.push({
        cartItemId,
        fieldId,
        value: value || null,
        fileUrl: fileUrl || null,
        fileName: fileName || null,
        priceModifier,
      });
    }

    // Check if all required fields are provided
    const requiredFields = fields.filter((f) => f.required);
    for (const requiredField of requiredFields) {
      const hasCustomization = customizations.some(
        (c: any) => c.fieldId === requiredField.id && (c.value || c.fileUrl)
      );
      if (!hasCustomization) {
        validationErrors.push(`Required field "${requiredField.label}" is missing`);
      }
    }

    // If there are validation errors, return them
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validationErrors },
        { status: 400 }
      );
    }

    // Delete existing customizations and create new ones in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing customizations
      await tx.cartItemCustomization.deleteMany({
        where: { cartItemId },
      });

      // Create new customizations
      await tx.cartItemCustomization.createMany({
        data: customizationsToCreate,
      });

      // Return the cart item with updated customizations
      return tx.cartItem.findUnique({
        where: { id: cartItemId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
          customizations: {
            include: {
              field: {
                select: {
                  id: true,
                  label: true,
                  type: true,
                },
              },
            },
          },
        },
      });
    });

    // Calculate total price with customizations
    const totalPriceModifier = result?.customizations.reduce(
      (sum, custom) => sum + Number(custom.priceModifier),
      0
    ) || 0;

    return NextResponse.json({
      cartItem: result,
      pricing: {
        basePrice: result?.product.price,
        customizationModifier: totalPriceModifier,
        totalPrice: Number(result?.product.price || 0) + totalPriceModifier,
      },
    });
  } catch (error) {
    console.error('Error adding/updating customizations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
