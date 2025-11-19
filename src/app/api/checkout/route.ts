import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { orderConfirmationEmail } from '@/lib/email-templates';

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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by email (more reliable than ID from JWT token)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please sign in again.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, shippingAddress, customerInfo } = body;

    // Validation
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingAddress.address1 || !shippingAddress.city || !shippingAddress.postalCode) {
      return NextResponse.json(
        { error: 'Complete shipping address is required' },
        { status: 400 }
      );
    }

    // Calculate totals
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

      if (!product.published) {
        return NextResponse.json(
          { error: `Product is no longer available: ${product.name}` },
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

    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
    const total = subtotal + tax + shipping;

    // Create shipping address
    const address = await prisma.address.create({
      data: {
        firstName: customerInfo.firstName || '',
        lastName: customerInfo.lastName || '',
        address1: shippingAddress.address1,
        address2: shippingAddress.address2 || null,
        city: shippingAddress.city,
        state: shippingAddress.state || null,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || 'USA',
        phone: customerInfo.phone || null,
        userId: user.id,
      },
    });

    // Generate order number
    const orderNumber = await generateOrderNumber();

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: 'PENDING',
        paymentStatus: 'PENDING', // Payment not implemented yet
        subtotal,
        tax,
        shipping,
        total,
        userId: user.id,
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

    // Send order confirmation email
    try {
      await sendEmail({
        to: user.email,
        subject: `Order Confirmation - ${orderNumber}`,
        html: orderConfirmationEmail(
          {
            orderNumber: order.orderNumber,
            total: order.total.toString(),
            subtotal: order.subtotal.toString(),
            tax: order.tax.toString(),
            shipping: order.shipping.toString(),
            status: order.status,
            items: order.items.map(item => ({
              product: { name: item.product.name },
              quantity: item.quantity,
              price: item.price.toString(),
              total: item.total.toString(),
            })),
            shippingAddress: order.shippingAddress || undefined,
          },
          user.name || user.email
        ),
      });
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    );
  }
}
