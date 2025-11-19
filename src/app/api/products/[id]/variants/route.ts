import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get all variants for a product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const variants = await prisma.productVariant.findMany({
      where: { productId: id },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(variants);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch variants' },
      { status: 500 }
    );
  }
}

// Create a new variant
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const { sku, price, comparePrice, stock, image, optionValues } = json;

    const variant = await prisma.productVariant.create({
      data: {
        productId: id,
        sku,
        price: price ? parseFloat(price) : null,
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        stock: parseInt(stock) || 0,
        image,
        optionValues: JSON.stringify(optionValues),
      },
    });

    return NextResponse.json(variant);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create variant' },
      { status: 500 }
    );
  }
}
