import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/products/[id]/customization-fields
 * Get all active customization fields for a product (public endpoint)
 * This endpoint is used by customers to view available customization options
 */
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;

    // Check if product exists and is published
    const product = await prisma.product.findFirst({
      where: {
        id,
        published: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get all customization fields with their options
    // Only return fields that have necessary customer-facing data
    const fields = await prisma.productCustomizationField.findMany({
      where: { productId: id },
      select: {
        id: true,
        type: true,
        label: true,
        placeholder: true,
        helpText: true,
        required: true,
        position: true,
        minLength: true,
        maxLength: true,
        minValue: true,
        maxValue: true,
        pattern: true,
        maxFileSize: true,
        allowedTypes: true,
        priceModifier: true,
        priceModifierType: true,
        options: {
          select: {
            id: true,
            label: true,
            value: true,
            position: true,
            priceModifier: true,
          },
          orderBy: { position: 'asc' },
        },
      },
      orderBy: { position: 'asc' },
    });

    // Calculate total price modifiers for informational purposes
    const totalFixedModifier = fields.reduce((sum, field) => {
      if (field.priceModifierType === 'fixed') {
        return sum + Number(field.priceModifier);
      }
      return sum;
    }, 0);

    return NextResponse.json({
      fields,
      summary: {
        totalFields: fields.length,
        requiredFields: fields.filter((f) => f.required).length,
        optionalFields: fields.filter((f) => !f.required).length,
        hasFileUpload: fields.some((f) => f.type === 'FILE'),
        baseAdditionalCost: totalFixedModifier,
      },
    });
  } catch (error) {
    console.error('Error fetching customization fields:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
