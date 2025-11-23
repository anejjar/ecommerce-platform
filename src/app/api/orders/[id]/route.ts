import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log';
import { sendEmail } from '@/lib/email';
import { orderShippedEmail, orderDeliveredEmail } from '@/lib/email-templates';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
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
        shippingAddress: true,
        billingAddress: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const { status, trackingNumber } = json;

    // Get the current order to check status change
    const currentOrder = await prisma.order.findUnique({
      where: { id },
      select: { status: true },
    });

    const order = await prisma.order.update({
      where: { id },
      data: json,
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
        shippingAddress: true,
      },
    });

    // Send email notifications on status changes
    try {
      if (status && currentOrder && currentOrder.status !== status) {
        const emailData = {
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
        };

        const customerEmail = order.user?.email || order.guestEmail;
        const customerName = order.user?.name || customerEmail || 'Customer';

        if (customerEmail) {
          if (status === 'SHIPPED') {
            await sendEmail({
              to: customerEmail,
              subject: `Your Order Has Shipped - ${order.orderNumber}`,
              html: orderShippedEmail(emailData, customerName, trackingNumber),
            });
          } else if (status === 'DELIVERED') {
            await sendEmail({
              to: customerEmail,
              subject: `Your Order Has Been Delivered - ${order.orderNumber}`,
              html: orderDeliveredEmail(emailData, customerName),
            });
          }
        }
      }
    } catch (emailError) {
      console.error('Failed to send order status email:', emailError);
      // Don't fail the update if email fails
    }

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'UPDATE',
      resource: 'ORDER',
      resourceId: order.id,
      details: `Updated order ${order.orderNumber} status to ${status || 'unchanged'}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
