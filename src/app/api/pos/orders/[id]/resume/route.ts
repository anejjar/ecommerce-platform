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
    });

    if (!posOrder) {
      return NextResponse.json({ error: 'POS order not found' }, { status: 404 });
    }

    if (posOrder.status !== 'HELD') {
      return NextResponse.json(
        { error: 'Order is not held' },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.posOrder.update({
      where: { id },
      data: {
        status: 'ACTIVE',
      },
      include: {
        location: true,
        cashier: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await logActivity({
      userId: session.user.id,
      action: 'UPDATE',
      resource: 'POS_ORDER',
      resourceId: posOrder.id,
      details: `Resumed held POS order: ${posOrder.id}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error resuming POS order:', error);
    return NextResponse.json(
      { error: 'Failed to resume order' },
      { status: 500 }
    );
  }
}

