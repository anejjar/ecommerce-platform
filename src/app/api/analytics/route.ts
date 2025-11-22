import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isFeatureEnabled } from '@/lib/features';

export async function GET(request: Request) {
  try {
    // Check if feature is enabled
    const enabled = await isFeatureEnabled('analytics_dashboard');
    if (!enabled) {
      return NextResponse.json(
        { error: 'Feature not available' },
        { status: 404 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get date range from query params (default to last 30 days)
    const url = new URL(request.url);
    const range = url.searchParams.get('range') || '30';
    const daysAgo = parseInt(range);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Parallel queries for performance
    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      recentOrders,
      revenueByDay,
      topProducts,
      ordersByStatus,
      averageOrderValue,
      conversionData,
    ] = await Promise.all([
      // Total Revenue
      prisma.order.aggregate({
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: startDate },
        },
        _sum: { total: true },
      }),

      // Total Orders
      prisma.order.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),

      // Total Customers (unique users who placed orders)
      prisma.order.findMany({
        where: {
          createdAt: { gte: startDate },
          userId: { not: null },
        },
        select: { userId: true },
        distinct: ['userId'],
      }),

      // Recent Orders
      prisma.order.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          total: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
          user: {
            select: { name: true, email: true },
          },
          guestEmail: true,
        },
      }),

      // Revenue by Day
      prisma.$queryRaw<Array<{ date: string; revenue: number; orders: number }>>`
        SELECT
          DATE(createdAt) as date,
          SUM(total) as revenue,
          COUNT(*) as orders
        FROM \`Order\`
        WHERE createdAt >= ${startDate}
          AND paymentStatus = 'PAID'
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `,

      // Top Products by Revenue
      prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: {
            createdAt: { gte: startDate },
            paymentStatus: 'PAID',
          },
        },
        _sum: {
          total: true,
          quantity: true,
        },
        orderBy: {
          _sum: {
            total: 'desc',
          },
        },
        take: 10,
      }),

      // Orders by Status
      prisma.order.groupBy({
        by: ['status'],
        where: {
          createdAt: { gte: startDate },
        },
        _count: true,
      }),

      // Average Order Value
      prisma.order.aggregate({
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: startDate },
        },
        _avg: { total: true },
      }),

      // Conversion Data (for future use)
      prisma.order.count({
        where: {
          createdAt: { gte: startDate },
          paymentStatus: 'PAID',
        },
      }),
    ]);

    // Get product details for top products
    const productIds = topProducts.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true },
    });

    const topProductsWithDetails = topProducts.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        productId: item.productId,
        name: product?.name || 'Unknown Product',
        revenue: item._sum.total ? Number(item._sum.total) : 0,
        quantity: item._sum.quantity || 0,
      };
    });

    // Calculate previous period for comparison
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - daysAgo);

    const previousRevenue = await prisma.order.aggregate({
      where: {
        paymentStatus: 'PAID',
        createdAt: {
          gte: previousStartDate,
          lt: startDate,
        },
      },
      _sum: { total: true },
    });

    const previousOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: previousStartDate,
          lt: startDate,
        },
      },
    });

    // Calculate percentage changes
    const currentRevenue = totalRevenue._sum.total
      ? Number(totalRevenue._sum.total)
      : 0;
    const prevRevenue = previousRevenue._sum.total
      ? Number(previousRevenue._sum.total)
      : 0;
    const revenueChange = prevRevenue > 0
      ? ((currentRevenue - prevRevenue) / prevRevenue) * 100
      : 0;

    const orderChange = previousOrders > 0
      ? ((totalOrders - previousOrders) / previousOrders) * 100
      : 0;

    // Format revenue by day data
    const formattedRevenueByDay = revenueByDay.map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      revenue: Number(item.revenue),
      orders: Number(item.orders),
    }));

    // Format orders by status
    const formattedOrdersByStatus = ordersByStatus.map((item) => ({
      status: item.status,
      count: item._count,
    }));

    const analytics = {
      summary: {
        totalRevenue: currentRevenue,
        revenueChange,
        totalOrders,
        orderChange,
        totalCustomers: totalCustomers.length,
        averageOrderValue: averageOrderValue._avg.total
          ? Number(averageOrderValue._avg.total)
          : 0,
        conversionRate: 0, // Placeholder for future implementation
      },
      revenueByDay: formattedRevenueByDay,
      topProducts: topProductsWithDetails,
      ordersByStatus: formattedOrdersByStatus,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        total: Number(order.total),
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        customerName: order.user?.name || 'Guest',
        customerEmail: order.user?.email || order.guestEmail || 'N/A',
      })),
      dateRange: {
        start: startDate,
        end: new Date(),
        days: daysAgo,
      },
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
