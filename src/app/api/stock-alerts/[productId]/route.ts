import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get stock alert for a specific product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const alert = await prisma.stockAlert.findUnique({
      where: { productId },
      include: {
        product: {
          select: {
            name: true,
            stock: true,
          },
        },
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stock alert' },
      { status: 500 }
    );
  }
}

// Create or update stock alert for a product
export async function POST(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const { threshold } = json;

    // Upsert the stock alert
    const alert = await prisma.stockAlert.upsert({
      where: { productId },
      update: {
        threshold: parseInt(threshold),
        notified: false,
      },
      create: {
        productId,
        threshold: parseInt(threshold),
        notified: false,
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create/update stock alert' },
      { status: 500 }
    );
  }
}

// Delete stock alert
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.stockAlert.delete({
      where: { productId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete stock alert' },
      { status: 500 }
    );
  }
}
