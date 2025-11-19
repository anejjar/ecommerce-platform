import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Update a variant
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const { variantId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const { sku, price, comparePrice, stock, image, optionValues } = json;

    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        sku,
        price: price ? parseFloat(price) : null,
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        stock: parseInt(stock),
        image,
        optionValues: JSON.stringify(optionValues),
      },
    });

    return NextResponse.json(variant);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update variant' },
      { status: 500 }
    );
  }
}

// Delete a variant
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const { variantId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.productVariant.delete({
      where: { id: variantId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete variant' },
      { status: 500 }
    );
  }
}
