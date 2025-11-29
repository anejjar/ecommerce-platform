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

    const where: any = {
      status: 'HELD',
    };

    if (locationId) {
      where.locationId = locationId;
    }

    const heldOrders = await prisma.posOrder.findMany({
      where,
      include: {
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        cashier: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 50,
    });

    const transformedOrders = heldOrders.map((order) => ({
      id: order.id,
      orderNumber: `POS-${order.id.slice(0, 8).toUpperCase()}`,
      orderType: order.orderType,
      paymentMethod: order.paymentMethod,
      total: Number(order.total),
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      discount: Number(order.discount),
      status: order.status,
      location: order.location,
      cashier: order.cashier,
      customer: order.customer,
      notes: order.notes,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    }));

    return NextResponse.json({ orders: transformedOrders });
  } catch (error) {
    console.error('Error fetching held orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch held orders' },
      { status: 500 }
    );
  }
}

