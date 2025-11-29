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
    const limit = parseInt(searchParams.get('limit') || '10');
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

    const where: any = {
      orderId: {
        not: null, // Only completed orders
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

    const posOrders = await prisma.posOrder.findMany({
      where,
      include: {
        order: {
          where: {
            status: {
              not: 'CANCELLED', // Exclude cancelled orders
            },
          },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    images: {
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Filter out posOrders where order is null or cancelled
    const validPosOrders = posOrders.filter(po => po.order && po.order.status !== 'CANCELLED');

    // Aggregate product sales
    const productSales: Record<string, { product: any; quantity: number; revenue: number }> = {};

    validPosOrders.forEach((posOrder) => {
      if (posOrder.order?.items) {
        posOrder.order.items.forEach((item) => {
          const productId = item.productId;
          if (!productSales[productId]) {
            productSales[productId] = {
              product: item.product,
              quantity: 0,
              revenue: 0,
            };
          }
          productSales[productId].quantity += item.quantity;
          productSales[productId].revenue += Number(item.total);
        });
      }
    });

    // Sort by revenue and take top N, then format for frontend
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit)
      .map((p) => ({
        productId: p.product.id,
        productName: p.product.name,
        quantity: p.quantity,
        revenue: p.revenue,
      }));

    return NextResponse.json(topProducts);
  } catch (error: any) {
    console.error('Error fetching top products:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
    });
    return NextResponse.json(
      { 
        error: 'Failed to fetch top products',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

