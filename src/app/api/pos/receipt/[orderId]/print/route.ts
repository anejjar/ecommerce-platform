import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await params;

    const posOrder = await prisma.posOrder.update({
      where: { id: orderId },
      data: {
        receiptPrinted: true,
      },
    });

    await logActivity({
      userId: session.user.id,
      action: 'UPDATE',
      resource: 'POS_ORDER',
      resourceId: orderId,
      details: `Marked receipt as printed for POS order`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json({ success: true, posOrder });
  } catch (error) {
    console.error('Error marking receipt as printed:', error);
    return NextResponse.json(
      { error: 'Failed to update receipt status' },
      { status: 500 }
    );
  }
}

