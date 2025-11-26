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
  }>;
}

/**
 * GET /api/admin/products/[id]/customization-fields
 * Get all customization fields for a product
 */
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'PRODUCT', 'VIEW')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await context.params;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get all customization fields with their options
    const fields = await prisma.productCustomizationField.findMany({
      where: { productId: id },
      include: {
        options: {
          orderBy: { position: 'asc' },
        },
      },
      orderBy: { position: 'asc' },
    });

    return NextResponse.json({ fields });
  } catch (error) {
    console.error('Error fetching customization fields:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/products/[id]/customization-fields
 * Create a new customization field for a product
 */
export async function POST(request: NextRequest, context: RouteParams) {
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

    const { id } = await context.params;
    const body = await request.json();

    const {
      type,
      label,
      placeholder,
      helpText,
      required,
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

    // Validate required fields
    if (!type || !label) {
      return NextResponse.json(
        { error: 'Missing required fields: type, label' },
        { status: 400 }
      );
    }

    // Validate field type
    const validTypes = Object.values(CustomizationFieldType);
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid field type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Validate options for dropdown/radio/checkbox fields
    if (['DROPDOWN', 'RADIO', 'CHECKBOX'].includes(type)) {
      if (!options || !Array.isArray(options) || options.length === 0) {
        return NextResponse.json(
          { error: `Options are required for ${type} field type` },
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

    // Get the current max position to set the new field's position
    const maxPositionField = await prisma.productCustomizationField.findFirst({
      where: { productId: id },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    const newPosition = maxPositionField ? maxPositionField.position + 1 : 0;

    // Create the customization field with options if applicable
    const field = await prisma.productCustomizationField.create({
      data: {
        productId: id,
        type,
        label,
        placeholder: placeholder || null,
        helpText: helpText || null,
        required: required || false,
        position: newPosition,
        minLength: minLength || null,
        maxLength: maxLength || null,
        minValue: minValue || null,
        maxValue: maxValue || null,
        pattern: pattern || null,
        maxFileSize: maxFileSize || null,
        allowedTypes: allowedTypes || null,
        priceModifier: priceModifier || 0,
        priceModifierType: priceModifierType || 'fixed',
        options: {
          create:
            options && ['DROPDOWN', 'RADIO', 'CHECKBOX'].includes(type)
              ? options.map((option: any, index: number) => ({
                  label: option.label,
                  value: option.value,
                  position: option.position !== undefined ? option.position : index,
                  priceModifier: option.priceModifier || null,
                }))
              : [],
        },
      },
      include: {
        options: {
          orderBy: { position: 'asc' },
        },
      },
    });

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'CREATE',
      resource: 'PRODUCT',
      resourceId: id,
      details: `Created customization field "${label}" for product: ${product.name}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json({ field }, { status: 201 });
  } catch (error) {
    console.error('Error creating customization field:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
