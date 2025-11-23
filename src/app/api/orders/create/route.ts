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

  // Count orders today to get sequence
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, items, status, paymentStatus, tax, shipping, shippingAddress } = body;

    // Validation
    if (!userId) {
      return NextResponse.json({ error: 'Customer is required' }, { status: 400 });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Order must have at least one item' }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.address1 || !shippingAddress.city || !shippingAddress.postalCode) {
      return NextResponse.json({ error: 'Complete shipping address is required' }, { status: 400 });
    }

    // Calculate subtotal and validate products
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    const taxAmount = Number(tax) || 0;
    const shippingAmount = Number(shipping) || 0;
    const total = subtotal + taxAmount + shippingAmount;

    // Create shipping address
    const address = await prisma.address.create({
      data: {
        firstName: '',
        lastName: '',
        address1: shippingAddress.address1,
        address2: shippingAddress.address2 || null,
        city: shippingAddress.city,
        state: shippingAddress.state || null,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || 'USA',
        userId,
      },
    });

    // Generate order number
    const orderNumber = await generateOrderNumber();

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: status || 'PENDING',
        paymentStatus: paymentStatus || 'PENDING',
        subtotal,
        tax: taxAmount,
        shipping: shippingAmount,
        total,
        userId,
        shippingAddressId: address.id,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
        shippingAddress: true,
      },
    });

    // Update product stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'CREATE',
      resource: 'ORDER',
      resourceId: order.id,
      details: `Created order: ${order.orderNumber} (Total: ${order.total})`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
