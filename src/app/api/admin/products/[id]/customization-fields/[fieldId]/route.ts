import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/permissions';
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log';
import { CustomizationFieldType } from '@prisma/client';

interface RouteParams {
  params: Promise<{
    id: string;
    fieldId: string;
  }>;
}

/**
 * PATCH /api/admin/products/[id]/customization-fields/[fieldId]
 * Update a customization field
 */
export async function PATCH(request: NextRequest, context: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'PRODUCT', 'UPDATE')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id, fieldId } = await context.params;
    const body = await request.json();

    const {
      type,
      label,
      placeholder,
      helpText,
      required,
      position,
      minLength,
      maxLength,
      minValue,
      maxValue,
      pattern,
      maxFileSize,
      allowedTypes,
      priceModifier,
      priceModifierType,
      options, // Array of options for DROPDOWN, RADIO, CHECKBOX types
    } = body;

    // Check if field exists and belongs to the product
    const existingField = await prisma.productCustomizationField.findFirst({
      where: {
        id: fieldId,
        productId: id,
      },
      include: {
        product: true,
        options: true,
      },
    });

    if (!existingField) {
      return NextResponse.json(
        { error: 'Customization field not found' },
        { status: 404 }
      );
    }

    // Validate field type if provided
    if (type) {
      const validTypes = Object.values(CustomizationFieldType);
      if (!validTypes.includes(type)) {
        return NextResponse.json(
          { error: `Invalid field type. Must be one of: ${validTypes.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Validate options for dropdown/radio/checkbox fields
    const fieldType = type || existingField.type;
    if (['DROPDOWN', 'RADIO', 'CHECKBOX'].includes(fieldType)) {
      if (options !== undefined) {
        if (!Array.isArray(options) || options.length === 0) {
          return NextResponse.json(
            { error: `Options are required for ${fieldType} field type` },
            { status: 400 }
          );
        }

        // Validate each option
        for (const option of options) {
          if (!option.label || !option.value) {
            return NextResponse.json(
              { error: 'Each option must have label and value' },
              { status: 400 }
            );
          }
        }
      }
    }

    // Update the field in a transaction
    const field = await prisma.$transaction(async (tx) => {
      // Update the field
      const updatedField = await tx.productCustomizationField.update({
        where: { id: fieldId },
        data: {
          ...(type !== undefined && { type }),
          ...(label !== undefined && { label }),
          ...(placeholder !== undefined && { placeholder }),
          ...(helpText !== undefined && { helpText }),
          ...(required !== undefined && { required }),
          ...(position !== undefined && { position }),
          ...(minLength !== undefined && { minLength }),
          ...(maxLength !== undefined && { maxLength }),
          ...(minValue !== undefined && { minValue }),
          ...(maxValue !== undefined && { maxValue }),
          ...(pattern !== undefined && { pattern }),
          ...(maxFileSize !== undefined && { maxFileSize }),
          ...(allowedTypes !== undefined && { allowedTypes }),
          ...(priceModifier !== undefined && { priceModifier }),
          ...(priceModifierType !== undefined && { priceModifierType }),
        },
      });

      // Update options if provided
      if (options !== undefined && ['DROPDOWN', 'RADIO', 'CHECKBOX'].includes(fieldType)) {
        // Delete existing options
        await tx.productCustomizationOption.deleteMany({
          where: { fieldId },
        });

        // Create new options
        await tx.productCustomizationOption.createMany({
          data: options.map((option: any, index: number) => ({
            fieldId,
            label: option.label,
            value: option.value,
            position: option.position !== undefined ? option.position : index,
            priceModifier: option.priceModifier || null,
          })),
        });
      }

      // Return the updated field with options
      return tx.productCustomizationField.findUnique({
        where: { id: fieldId },
        include: {
          options: {
            orderBy: { position: 'asc' },
          },
        },
      });
    });

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'UPDATE',
      resource: 'PRODUCT',
      resourceId: id,
      details: `Updated customization field "${field?.label || existingField.label}" for product: ${existingField.product.name}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json({ field });
  } catch (error) {
    console.error('Error updating customization field:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/products/[id]/customization-fields/[fieldId]
 * Delete a customization field (cascade deletes options)
 */
export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'PRODUCT', 'UPDATE')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id, fieldId } = await context.params;

    // Check if field exists and belongs to the product
    const field = await prisma.productCustomizationField.findFirst({
      where: {
        id: fieldId,
        productId: id,
      },
      include: {
        product: true,
      },
    });

    if (!field) {
      return NextResponse.json(
        { error: 'Customization field not found' },
        { status: 404 }
      );
    }

    // Delete the field (options will be cascade deleted)
    await prisma.productCustomizationField.delete({
      where: { id: fieldId },
    });

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'DELETE',
      resource: 'PRODUCT',
      resourceId: id,
      details: `Deleted customization field "${field.label}" for product: ${field.product.name}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json({ success: true, message: 'Customization field deleted successfully' });
  } catch (error) {
    console.error('Error deleting customization field:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
