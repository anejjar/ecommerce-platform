import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const locationId = searchParams.get('locationId');

    const where: any = {};
    if (locationId) where.locationId = locationId;

    // Get active POS orders (not yet completed)
    const activeOrders = await prisma.posOrder.findMany({
      where: {
        ...where,
        orderId: null, // Not yet completed
      },
    });

    // Get completed orders with their status
    const completedOrders = await prisma.posOrder.findMany({
      where: {
        ...where,
        orderId: {
          not: null,
        },
      },
      include: {
        order: {
          select: {
            status: true,
          },
        },
      },
    });

    // Count by status
    const statusCounts = {
      PENDING: completedOrders.filter((o) => o.order?.status === 'PENDING').length,
      PROCESSING: completedOrders.filter((o) => o.order?.status === 'PROCESSING').length,
      SHIPPED: completedOrders.filter((o) => o.order?.status === 'SHIPPED').length,
      DELIVERED: completedOrders.filter((o) => o.order?.status === 'DELIVERED').length,
      CANCELLED: completedOrders.filter((o) => o.order?.status === 'CANCELLED').length,
      ACTIVE: activeOrders.length, // Orders in POS not yet completed
    };

    return NextResponse.json(statusCounts);
  } catch (error) {
    console.error('Error fetching order status counts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order status counts' },
      { status: 500 }
    );
  }
}

