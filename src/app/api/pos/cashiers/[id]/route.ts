import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { locationId, employeeId, pin, isActive } = body;

    const updateData: any = {};
    if (locationId !== undefined) updateData.locationId = locationId;
    if (employeeId !== undefined) updateData.employeeId = employeeId;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (pin !== undefined) {
      updateData.pin = pin ? await hash(pin, 10) : null;
    }

    const cashier = await prisma.cashier.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    await logActivity({
      userId: session.user.id,
      action: 'UPDATE',
      resource: 'CASHIER',
      resourceId: cashier.id,
      details: `Updated cashier: ${cashier.user.name || cashier.user.email}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json(cashier);
  } catch (error) {
    console.error('Error updating cashier:', error);
    return NextResponse.json(
      { error: 'Failed to update cashier' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if cashier has active sessions or orders
    const [sessions, orders] = await Promise.all([
      prisma.posSession.count({
        where: {
          cashierId: id,
          status: 'OPEN',
        },
      }),
      prisma.posOrder.count({
        where: {
          cashierId: id,
        },
      }),
    ]);

    if (sessions > 0) {
      return NextResponse.json(
        { error: 'Cannot delete cashier with open sessions' },
        { status: 400 }
      );
    }

    await prisma.cashier.delete({
      where: { id },
    });

    await logActivity({
      userId: session.user.id,
      action: 'DELETE',
      resource: 'CASHIER',
      resourceId: id,
      details: `Deleted cashier: ${id}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cashier:', error);
    return NextResponse.json(
      { error: 'Failed to delete cashier' },
      { status: 500 }
    );
  }
}

