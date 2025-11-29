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
    const { posOrderId, paymentMethod, amount, paymentDetails } = body;

    if (!posOrderId || !paymentMethod || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const posOrder = await prisma.posOrder.findUnique({
      where: { id: posOrderId },
      include: {
        order: true,
      },
    });

    if (!posOrder) {
      return NextResponse.json({ error: 'POS order not found' }, { status: 404 });
    }

    // Update payment method and details
    const updatedPosOrder = await prisma.posOrder.update({
      where: { id: posOrderId },
      data: {
        paymentMethod,
        paymentDetails: paymentDetails ? JSON.stringify(paymentDetails) : null,
      },
    });

    // If order is already created, update payment status
    if (posOrder.orderId) {
      await prisma.order.update({
        where: { id: posOrder.orderId },
        data: {
          paymentStatus: 'PAID',
        },
      });
    }

    await logActivity({
      userId: session.user.id,
      action: 'UPDATE',
      resource: 'POS_ORDER',
      resourceId: posOrderId,
      details: `Processed payment for POS order: ${paymentMethod}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json({
      success: true,
      posOrder: updatedPosOrder,
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}

