import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log';

async function generateOrderNumber(): Promise<string> {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

  const todayOrders = await prisma.order.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
  });

  const sequence = String(todayOrders + 1).padStart(4, '0');
  return `ORD-${year}${month}${day}-${sequence}`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { items, subtotal, tax, discount, discountCode, total, customerEmail, customerName } = body;

    // Get POS order
    const posOrder = await prisma.posOrder.findUnique({
      where: { id },
      include: {
        location: true,
        cashier: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!posOrder) {
      return NextResponse.json({ error: 'POS order not found' }, { status: 404 });
    }

    if (posOrder.orderId) {
      return NextResponse.json(
        { error: 'POS order already completed' },
        { status: 400 }
      );
    }

    // Validate items and check stock
    for (const item of items) {
      if (item.variantId) {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
        });
        if (!variant || variant.stock < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for variant ${item.variantId}` },
            { status: 400 }
          );
        }
      } else {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product || product.stock < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for product ${item.productId}` },
            { status: 400 }
          );
        }
      }
    }

    // Create main order
    const orderNumber = await generateOrderNumber();

    // Create shipping address (minimal for POS orders)
    const address = await prisma.address.create({
      data: {
        firstName: customerName || 'POS',
        lastName: 'Customer',
        address1: posOrder.location.address || 'Store Location',
        city: 'N/A',
        postalCode: '00000',
        country: 'USA',
      },
    });

    // Get discount code if provided
    let discountCodeId = null;
    if (discountCode && discountCode !== 'MANUAL-PERCENTAGE' && discountCode !== 'MANUAL-FIXED_AMOUNT') {
      const discount = await prisma.discountCode.findUnique({
        where: { code: discountCode },
      });
      if (discount) {
        discountCodeId = discount.id;
        // Increment usage count
        await prisma.discountCode.update({
          where: { id: discount.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: 'PROCESSING',
        paymentStatus: posOrder.paymentMethod === 'CASH' ? 'PAID' : 'PAID',
        subtotal,
        tax: tax || 0,
        shipping: 0,
        total,
        discountAmount: discount || 0,
        discountCodeId,
        isGuest: !customerEmail,
        guestEmail: customerEmail || null,
        isPosOrder: true,
        posOrderId: id,
        shippingAddressId: address.id,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    // Update stock
    for (const item of items) {
      if (item.variantId) {
        await prisma.$transaction([
          prisma.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          }),
          prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          }),
        ]);
      } else {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    // Link POS order to main order
    await prisma.posOrder.update({
      where: { id },
      data: {
        orderId: order.id,
      },
    });

    await logActivity({
      userId: session.user.id,
      action: 'CREATE',
      resource: 'ORDER',
      resourceId: order.id,
      details: `Completed POS order ${posOrder.id} and created main order: ${order.orderNumber}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json({
      order,
      posOrder: {
        ...posOrder,
        orderId: order.id,
      },
    });
  } catch (error) {
    console.error('Error completing POS order:', error);
    return NextResponse.json(
      { error: 'Failed to complete POS order' },
      { status: 500 }
    );
  }
}

