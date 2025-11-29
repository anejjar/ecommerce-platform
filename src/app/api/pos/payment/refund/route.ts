import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { posOrderId, refundAmount, reason } = body;

    if (!posOrderId || !refundAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const posOrder = await prisma.posOrder.findUnique({
      where: { id: posOrderId },
      include: {
        order: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!posOrder || !posOrder.orderId) {
      return NextResponse.json(
        { error: 'POS order not found or not completed' },
        { status: 404 }
      );
    }

    // Create refund record
    const refund = await prisma.refund.create({
      data: {
        rmaNumber: `RMA-${Date.now()}`,
        status: 'APPROVED',
        reason: 'OTHER',
        reasonDetails: reason || 'POS refund',
        refundAmount: refundAmount,
        restockItems: false, // POS refunds typically don't restock
        orderId: posOrder.orderId,
        requestedById: session.user.id,
        processedById: session.user.id,
        processedAt: new Date(),
        refundItems: {
          create: posOrder.order.items.map((item) => ({
            orderItemId: item.id,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        },
      },
    });

    // Update order payment status
    await prisma.order.update({
      where: { id: posOrder.orderId },
      data: {
        paymentStatus: 'REFUNDED',
      },
    });

    await logActivity({
      userId: session.user.id,
      action: 'CREATE',
      resource: 'REFUND',
      resourceId: refund.id,
      details: `Processed refund for POS order: ${refundAmount}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json({
      success: true,
      refund,
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    );
  }
}

