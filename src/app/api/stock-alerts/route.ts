import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get all stock alerts (low stock products)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get products with stock below their alert threshold
    const alerts = await prisma.stockAlert.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            sku: true,
            stock: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Filter to only show alerts where stock is below threshold
    const activeAlerts = alerts.filter(
      (alert) => alert.product.stock <= alert.threshold
    );

    return NextResponse.json(activeAlerts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stock alerts' },
      { status: 500 }
    );
  }
}
