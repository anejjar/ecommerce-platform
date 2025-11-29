import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log';

async function generatePosOrderNumber(): Promise<string> {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

  const todayOrders = await prisma.posOrder.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
  });

  const sequence = String(todayOrders + 1).padStart(4, '0');
  return `POS-${year}${month}${day}-${sequence}`;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const locationId = searchParams.get('locationId');
    const cashierId = searchParams.get('cashierId');
    const orderType = searchParams.get('orderType');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {};

    if (locationId) where.locationId = locationId;
    if (cashierId) where.cashierId = cashierId;
    if (orderType) where.orderType = orderType;
    
    // Handle status filter - if status is 'active', show only incomplete orders
    if (status === 'active') {
      where.orderId = null; // Orders not yet synced to main Order system
    } else if (status) {
      // If other status is provided, filter by main order status
      where.order = {
        status: status,
      };
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const posOrders = await prisma.posOrder.findMany({
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
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });

    // Transform orders for frontend
    const transformedOrders = posOrders.map((posOrder) => ({
      id: posOrder.id,
      orderNumber: posOrder.order?.orderNumber || `POS-${posOrder.id.slice(0, 8).toUpperCase()}`,
      orderType: posOrder.orderType,
      paymentMethod: posOrder.paymentMethod,
      total: posOrder.order ? Number(posOrder.order.total) : Number(posOrder.total),
      subtotal: Number(posOrder.subtotal),
      tax: Number(posOrder.tax),
      discount: Number(posOrder.discount),
      status: posOrder.status || (posOrder.orderId ? 'COMPLETED' : 'ACTIVE'),
      location: posOrder.location,
      cashier: posOrder.cashier,
      customer: posOrder.customer,
      notes: posOrder.notes,
      createdAt: posOrder.createdAt.toISOString(),
      orderId: posOrder.orderId,
    }));

    return NextResponse.json({ orders: transformedOrders });
  } catch (error: any) {
    console.error('Error fetching POS orders:', error);
    
    // Handle Prisma errors gracefully
    if (error.code === 'P2001' || error.message?.includes('does not exist')) {
      return NextResponse.json(
        { error: 'POS tables not found. Please run database migrations.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch POS orders', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      orderType,
      locationId,
      cashierId,
      customerId,
      tableNumber,
      customerName,
      items,
      subtotal,
      tax,
      discount,
      discountCode,
      discountType,
      total,
      paymentMethod,
      paymentDetails,
      notes,
    } = body;

    // Validation
    if (!orderType || !locationId || !cashierId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify location and cashier
    const [location, cashier] = await Promise.all([
      prisma.location.findUnique({ where: { id: locationId } }),
      prisma.cashier.findUnique({ where: { id: cashierId } }),
    ]);

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }
    if (!cashier) {
      return NextResponse.json({ error: 'Cashier not found' }, { status: 404 });
    }

    // Verify customer if provided
    if (customerId) {
      const customer = await prisma.user.findUnique({
        where: { id: customerId, role: 'CUSTOMER' },
      });
      if (!customer) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      }
    }

    // Create POS order
    const posOrder = await prisma.posOrder.create({
      data: {
        orderType,
        locationId,
        cashierId,
        customerId: customerId || null,
        tableNumber,
        customerName: customerName || null,
        paymentMethod: paymentMethod || 'CASH',
        paymentDetails: paymentDetails ? JSON.stringify(paymentDetails) : null,
        receiptPrinted: false,
        subtotal: subtotal || 0,
        tax: tax || 0,
        discount: discount || 0,
        discountCode: discountCode || null,
        discountType: discountType || null,
        total: total || 0,
        notes: notes || null,
        status: 'ACTIVE',
      },
      include: {
        location: true,
        cashier: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    await logActivity({
      userId: session.user.id,
      action: 'CREATE',
      resource: 'POS_ORDER',
      resourceId: posOrder.id,
      details: `Created POS order: ${posOrder.id}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json(posOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating POS order:', error);
    return NextResponse.json(
      { error: 'Failed to create POS order' },
      { status: 500 }
    );
  }
}

