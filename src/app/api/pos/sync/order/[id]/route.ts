import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log';

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

    const posOrder = await prisma.posOrder.findUnique({
      where: { id },
      include: {
        order: true,
      },
    });

    if (!posOrder) {
      return NextResponse.json({ error: 'POS order not found' }, { status: 404 });
    }

    if (posOrder.orderId) {
      return NextResponse.json({
        success: true,
        message: 'Order already synced',
        orderId: posOrder.orderId,
      });
    }

    // This endpoint is for manual sync if needed
    // The actual sync happens in the complete endpoint
    return NextResponse.json({
      success: false,
      message: 'Order not yet completed. Use /complete endpoint first.',
    });
  } catch (error) {
    console.error('Error syncing order:', error);
    return NextResponse.json(
      { error: 'Failed to sync order' },
      { status: 500 }
    );
  }
}

