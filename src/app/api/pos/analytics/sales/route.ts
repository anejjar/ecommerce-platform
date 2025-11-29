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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {
      orderId: {
        not: null, // Only completed orders
      },
    };

    if (locationId) where.locationId = locationId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const posOrders = await prisma.posOrder.findMany({
      where,
      include: {
        order: true,
        location: {
          select: {
            name: true,
          },
        },
      },
    });

    // Calculate analytics
    const totalSales = posOrders.reduce((sum, o) => sum + Number(o.order?.total || 0), 0);
    const totalOrders = posOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Sales by payment method
    const salesByPaymentMethod = posOrders.reduce((acc, o) => {
      const method = o.paymentMethod;
      const amount = Number(o.order?.total || 0);
      acc[method] = (acc[method] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

    // Sales by order type
    const salesByOrderType = posOrders.reduce((acc, o) => {
      const type = o.orderType;
      const amount = Number(o.order?.total || 0);
      acc[type] = (acc[type] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      totalSales,
      totalOrders,
      averageOrderValue,
      salesByPaymentMethod,
      salesByOrderType,
    });
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales analytics' },
      { status: 500 }
    );
  }
}

