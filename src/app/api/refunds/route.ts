import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isFeatureEnabled } from '@/lib/features';
import { sendEmail } from '@/lib/email';
import {
  refundRequestedEmailCustomer,
  adminNewRefundRequestEmail,
} from '@/lib/email-templates';

// Generate RMA number
async function generateRMANumber(): Promise<string> {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  const count = await prisma.refund.count();
  const sequence = String(count + 1).padStart(5, '0');

  return `RMA-${year}${month}-${sequence}`;
}

// Get all refunds (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check if feature is enabled
    const enabled = await isFeatureEnabled('refund_management');
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

    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    const refunds = await prisma.refund.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        order: {
          select: {
            orderNumber: true,
            total: true,
          },
        },
        requestedBy: {
          select: {
            name: true,
            email: true,
          },
        },
        processedBy: {
          select: {
            name: true,
            email: true,
          },
        },
        refundItems: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(refunds);
  } catch (error) {
    console.error('Error fetching refunds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch refunds' },
      { status: 500 }
    );
  }
}

// Create a new refund request (customer)
export async function POST(request: NextRequest) {
  try {
    // Check if feature is enabled
    const enabled = await isFeatureEnabled('refund_management');
    if (!enabled) {
      return NextResponse.json(
        { error: 'Feature not available' },
        { status: 404 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { orderId, reason, reasonDetails, items, restockItems } = body;

    // Validate order belongs to user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if order is paid - DISABLED per user request
    // if (order.paymentStatus !== 'PAID') {
    //   return NextResponse.json(
    //     { error: 'Can only request refund for paid orders' },
    //     { status: 400 }
    //   );
    // }

    // Check if refund already exists for this order
    const existingRefund = await prisma.refund.findFirst({
      where: {
        orderId,
        status: { in: ['PENDING', 'APPROVED'] },
      },
    });

    if (existingRefund) {
      return NextResponse.json(
        { error: 'A refund request already exists for this order' },
        { status: 400 }
      );
    }

    // Calculate refund amount based on items
    let refundAmount = 0;
    const refundItems: Array<{
      orderItemId: string;
      productId: string;
      variantId: string | null;
      quantity: number;
    }> = [];

    for (const item of items) {
      const orderItem = order.items.find((oi) => oi.id === item.orderItemId);
      if (!orderItem) {
        return NextResponse.json(
          { error: `Order item not found: ${item.orderItemId}` },
          { status: 400 }
        );
      }

      if (item.quantity > orderItem.quantity) {
        return NextResponse.json(
          { error: `Invalid quantity for item: ${orderItem.product.name}` },
          { status: 400 }
        );
      }

      const itemRefundAmount =
        (Number(orderItem.price) * item.quantity);
      refundAmount += itemRefundAmount;

      refundItems.push({
        orderItemId: item.orderItemId,
        productId: orderItem.productId,
        variantId: orderItem.variantId,
        quantity: item.quantity,
      });
    }

    // Generate RMA number
    const rmaNumber = await generateRMANumber();

    // Create refund
    const refund = await prisma.refund.create({
      data: {
        rmaNumber,
        status: 'PENDING',
        reason,
        reasonDetails: reasonDetails || null,
        refundAmount,
        restockItems: restockItems ?? true,
        orderId,
        requestedById: user.id,
        refundItems: {
          create: refundItems,
        },
      },
      include: {
        order: true,
        requestedBy: true,
        refundItems: true,
      },
    });

    // Send email to customer
    try {
      await sendEmail({
        to: user.email,
        subject: `Refund Request Received - ${rmaNumber}`,
        html: refundRequestedEmailCustomer(
          order.orderNumber,
          rmaNumber,
          refundAmount.toFixed(2),
          reason
        ),
      });
    } catch (emailError) {
      console.error('Failed to send customer refund email:', emailError);
    }

    // Send email to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await sendEmail({
          to: adminEmail,
          subject: `New Refund Request - ${rmaNumber}`,
          html: adminNewRefundRequestEmail(
            order.orderNumber,
            rmaNumber,
            user.name || user.email,
            user.email,
            refundAmount.toFixed(2),
            reason,
            reasonDetails
          ),
        });
      }
    } catch (emailError) {
      console.error('Failed to send admin refund email:', emailError);
    }

    return NextResponse.json(refund);
  } catch (error) {
    console.error('Error creating refund:', error);
    return NextResponse.json(
      { error: 'Failed to create refund request' },
      { status: 500 }
    );
  }
}
