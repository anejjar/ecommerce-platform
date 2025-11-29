import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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
    const { name, address, phone, isActive, settings } = body;

    const location = await prisma.location.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(address !== undefined && { address }),
        ...(phone !== undefined && { phone }),
        ...(isActive !== undefined && { isActive }),
        ...(settings !== undefined && { settings: settings ? JSON.stringify(settings) : null }),
      },
    });

    await logActivity({
      userId: session.user.id,
      action: 'UPDATE',
      resource: 'LOCATION',
      resourceId: location.id,
      details: `Updated location: ${location.name}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json(location);
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json(
      { error: 'Failed to update location' },
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

    // Check if location has active cashiers or orders
    const [cashiers, orders] = await Promise.all([
      prisma.cashier.count({ where: { locationId: id, isActive: true } }),
      prisma.posOrder.count({ where: { locationId: id } }),
    ]);

    if (cashiers > 0) {
      return NextResponse.json(
        { error: 'Cannot delete location with active cashiers' },
        { status: 400 }
      );
    }

    if (orders > 0) {
      return NextResponse.json(
        { error: 'Cannot delete location with existing orders' },
        { status: 400 }
      );
    }

    await prisma.location.delete({
      where: { id },
    });

    await logActivity({
      userId: session.user.id,
      action: 'DELETE',
      resource: 'LOCATION',
      resourceId: id,
      details: `Deleted location: ${id}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting location:', error);
    return NextResponse.json(
      { error: 'Failed to delete location' },
      { status: 500 }
    );
  }
}

