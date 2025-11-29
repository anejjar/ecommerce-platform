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

    // Build date filters - include end of day for endDate
    let startDateObj: Date | undefined;
    let endDateObj: Date | undefined;
    
    if (startDate) {
      startDateObj = new Date(startDate);
      startDateObj.setHours(0, 0, 0, 0);
    }
    
    if (endDate) {
      endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
    }

    // Build where clause for POS orders
    const where: any = {
      orderId: {
        not: null, // Only completed orders (have orderId)
      },
      status: {
        not: 'CANCELLED', // Exclude cancelled orders
      },
    };

    if (locationId) where.locationId = locationId;
    
    // Filter by date using posOrder.createdAt
    if (startDateObj || endDateObj) {
      where.createdAt = {};
      if (startDateObj) where.createdAt.gte = startDateObj;
      if (endDateObj) where.createdAt.lte = endDateObj;
    }

    // First, try to get POS orders with their linked orders
    const posOrders = await prisma.posOrder.findMany({
      where,
      include: {
        order: {
          where: {
            status: {
              not: 'CANCELLED',
            },
          },
        },
        location: {
          select: {
            name: true,
          },
        },
      },
    });

    // Also query orders directly if we need to (as a fallback)
    // This ensures we catch all POS orders even if the relation isn't loading
    const orderWhere: any = {
      isPosOrder: true,
      status: {
        not: 'CANCELLED',
      },
    };

    if (startDateObj || endDateObj) {
      orderWhere.createdAt = {};
      if (startDateObj) orderWhere.createdAt.gte = startDateObj;
      if (endDateObj) orderWhere.createdAt.lte = endDateObj;
    }

    const directOrders = await prisma.order.findMany({
      where: orderWhere,
      include: {
        posOrder: true,
      },
    });

    // Combine POS orders with their orders, and also include direct orders
    const allOrdersMap = new Map<string, { posOrder: any; order: any }>();

    // Add POS orders with their linked orders
    posOrders.forEach(po => {
      if (po.orderId && po.order) {
        allOrdersMap.set(po.orderId, { posOrder: po, order: po.order });
      }
    });

    // Add direct orders that might not have been in posOrders query
    directOrders.forEach(order => {
      if (order.posOrderId && !allOrdersMap.has(order.id)) {
        allOrdersMap.set(order.id, { posOrder: order.posOrder, order });
      }
    });

    // Convert map to array and filter valid orders
    const validOrders = Array.from(allOrdersMap.values()).filter(({ order }) => {
      return order && order.status !== 'CANCELLED';
    });

    // Calculate analytics - use order.total (should always be set for completed orders)
    const totalSales = validOrders.reduce((sum, { order }) => {
      const amount = Number(order.total || 0);
      return sum + amount;
    }, 0);
    
    const totalOrders = validOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Sales by payment method
    const salesByPaymentMethod = validOrders.reduce((acc, { posOrder, order }) => {
      if (!posOrder) return acc;
      const method = posOrder.paymentMethod;
      const amount = Number(order.total || 0);
      if (amount > 0) {
        acc[method] = (acc[method] || 0) + amount;
      }
      return acc;
    }, {} as Record<string, number>);

    // Sales by order type
    const salesByOrderType = validOrders.reduce((acc, { posOrder, order }) => {
      if (!posOrder) return acc;
      const type = posOrder.orderType;
      const amount = Number(order.total || 0);
      if (amount > 0) {
        acc[type] = (acc[type] || 0) + amount;
      }
      return acc;
    }, {} as Record<string, number>);

    // Sales by date for chart
    const salesByDate: Record<string, { sales: number; orders: number }> = {};
    validOrders.forEach(({ order }) => {
      const amount = Number(order.total || 0);
      
      if (amount <= 0) return; // Skip orders with no total
      
      // Use order.createdAt
      const dateKey = new Date(order.createdAt).toISOString().split('T')[0];
      
      if (!salesByDate[dateKey]) {
        salesByDate[dateKey] = { sales: 0, orders: 0 };
      }
      salesByDate[dateKey].sales += amount;
      salesByDate[dateKey].orders += 1;
    });

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('POS Sales Analytics Debug:', {
        posOrdersFound: posOrders.length,
        directOrdersFound: directOrders.length,
        validOrders: validOrders.length,
        totalSales,
        sampleOrder: validOrders[0] ? {
          orderId: validOrders[0].order.id,
          orderTotal: Number(validOrders[0].order.total || 0),
          posOrderId: validOrders[0].posOrder?.id,
          posTotal: validOrders[0].posOrder ? Number(validOrders[0].posOrder.total || 0) : 0,
        } : null,
      });
    }

    return NextResponse.json({
      totalSales,
      totalOrders,
      averageOrderValue,
      salesByPaymentMethod,
      salesByOrderType,
      salesByDate: Object.entries(salesByDate).map(([date, data]) => ({
        date,
        sales: data.sales,
        orders: data.orders,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching sales analytics:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
    });
    return NextResponse.json(
      { 
        error: 'Failed to fetch sales analytics',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

