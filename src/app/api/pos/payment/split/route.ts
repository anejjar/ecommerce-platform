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
    const { posOrderId, payments } = body; // payments: [{ method, amount }]

    if (!posOrderId || !payments || !Array.isArray(payments) || payments.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate total matches
    const total = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const posOrder = await prisma.posOrder.findUnique({
      where: { id: posOrderId },
      include: {
        order: true,
      },
    });

    if (!posOrder) {
      return NextResponse.json({ error: 'POS order not found' }, { status: 404 });
    }

    const orderTotal = Number(posOrder.order?.total || 0);
    if (Math.abs(total - orderTotal) > 0.01) {
      return NextResponse.json(
        { error: 'Payment total does not match order total' },
        { status: 400 }
      );
    }

    // Update with split payment
    const updatedPosOrder = await prisma.posOrder.update({
      where: { id: posOrderId },
      data: {
        paymentMethod: 'SPLIT',
        paymentDetails: JSON.stringify(payments),
      },
    });

    // Update main order if exists
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
      details: `Processed split payment for POS order`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json({
      success: true,
      posOrder: updatedPosOrder,
    });
  } catch (error) {
    console.error('Error processing split payment:', error);
    return NextResponse.json(
      { error: 'Failed to process split payment' },
      { status: 500 }
    );
  }
}

