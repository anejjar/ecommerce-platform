import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get date ranges
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Total revenue
    const totalRevenue = await prisma.order.aggregate({
      where: {
        paymentStatus: 'PAID',
      },
      _sum: {
        total: true,
      },
    });

    // Revenue this month
    const monthRevenue = await prisma.order.aggregate({
      where: {
        paymentStatus: 'PAID',
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _sum: {
        total: true,
      },
    });

    // Revenue this week
    const weekRevenue = await prisma.order.aggregate({
      where: {
        paymentStatus: 'PAID',
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      _sum: {
        total: true,
      },
    });

    // Total orders
    const totalOrders = await prisma.order.count();

    // Orders this month
    const monthOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Total customers
    const totalCustomers = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
      },
    });

    // New customers this month
    const newCustomers = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Total products
    const totalProducts = await prisma.product.count();

    // Low stock products - get all alerts and filter manually
    const stockAlerts = await prisma.stockAlert.findMany({
      include: {
        product: {
          select: {
            stock: true,
          },
        },
      },
    });

    const lowStockProducts = stockAlerts.filter(
      (alert) => alert.product.stock <= alert.threshold
    ).length;

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Top selling products (last 30 days)
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
          paymentStatus: 'PAID',
        },
      },
      _sum: {
        quantity: true,
        total: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    // Get product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            name: true,
            slug: true,
            price: true,
          },
        });
        return {
          ...product,
          totalSold: item._sum.quantity || 0,
          revenue: item._sum.total || 0,
        };
      })
    );

    // Sales by day (last 30 days) - using aggregation instead of raw SQL
    const ordersLast30Days = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
        paymentStatus: 'PAID',
      },
      select: {
        createdAt: true,
        total: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group by day manually
    const salesByDayMap = new Map<string, { revenue: number; orders: number }>();
    ordersLast30Days.forEach((order) => {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      const existing = salesByDayMap.get(dateKey) || { revenue: 0, orders: 0 };
      salesByDayMap.set(dateKey, {
        revenue: existing.revenue + Number(order.total),
        orders: existing.orders + 1,
      });
    });

    const salesByDay = Array.from(salesByDayMap.entries()).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders,
    }));

    // Order status distribution
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    // Pending orders count
    const pendingOrders = await prisma.order.count({
      where: {
        status: 'PENDING',
      },
    });

    // Out of stock products count
    const outOfStockProducts = await prisma.product.count({
      where: {
        stock: 0,
      },
    });

    // Recent reviews
    const recentReviews = await prisma.review.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        product: {
          select: {
            name: true,
            slug: true,
            images: {
              take: 1,
              select: {
                url: true,
              },
            },
          },
        },
      },
    });

    // Top customers by spend
    const topCustomersRaw = await prisma.order.groupBy({
      by: ['userId'],
      where: {
        paymentStatus: 'PAID',
        userId: {
          not: null,
        },
      },
      _sum: {
        total: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
      take: 5,
    });

    // Get customer details
    const topCustomers = await Promise.all(
      topCustomersRaw.map(async (item) => {
        if (!item.userId) return null;
        const user = await prisma.user.findUnique({
          where: { id: item.userId },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        });
        return {
          ...user,
          totalSpend: item._sum.total || 0,
          totalOrders: item._count.id,
        };
      })
    );

    // Calculate Average Order Value (AOV)
    const averageOrderValue = totalOrders > 0
      ? (Number(totalRevenue._sum.total || 0) / totalOrders)
      : 0;

    return NextResponse.json({
      summary: {
        totalRevenue: totalRevenue._sum.total || 0,
        monthRevenue: monthRevenue._sum.total || 0,
        weekRevenue: weekRevenue._sum.total || 0,
        totalOrders,
        monthOrders,
        totalCustomers,
        newCustomers,
        totalProducts,
        lowStockProducts,
        pendingOrders,
        outOfStockProducts,
        averageOrderValue,
      },
      recentOrders,
      topProducts: topProductsWithDetails,
      salesByDay,
      ordersByStatus,
      recentReviews,
      topCustomers: topCustomers.filter(Boolean),
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
