import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log';

export async function GET(
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
        location: true,
        cashier: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        order: {
          include: {
            items: {
              include: {
                product: {
                  include: {
                    images: {
                      take: 1,
                    },
                  },
                },
                variant: true,
              },
            },
          },
        },
      },
    });

    if (!posOrder) {
      return NextResponse.json({ error: 'POS order not found' }, { status: 404 });
    }

    return NextResponse.json(posOrder);
  } catch (error) {
    console.error('Error fetching POS order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch POS order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      orderType,
      tableNumber,
      customerName,
      paymentMethod,
      paymentDetails,
      receiptPrinted,
    } = body;

    const updateData: any = {};
    if (orderType !== undefined) updateData.orderType = orderType;
    if (tableNumber !== undefined) updateData.tableNumber = tableNumber;
    if (customerName !== undefined) updateData.customerName = customerName;
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (paymentDetails !== undefined) {
      updateData.paymentDetails = paymentDetails ? JSON.stringify(paymentDetails) : null;
    }
    if (receiptPrinted !== undefined) updateData.receiptPrinted = receiptPrinted;

    const posOrder = await prisma.posOrder.update({
      where: { id },
      data: updateData,
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
        order: true,
      },
    });

    await logActivity({
      userId: session.user.id,
      action: 'UPDATE',
      resource: 'POS_ORDER',
      resourceId: posOrder.id,
      details: `Updated POS order: ${posOrder.id}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json(posOrder);
  } catch (error) {
    console.error('Error updating POS order:', error);
    return NextResponse.json(
      { error: 'Failed to update POS order' },
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

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if order is linked to main order
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
      return NextResponse.json(
        { error: 'Cannot delete POS order that is linked to main order' },
        { status: 400 }
      );
    }

    await prisma.posOrder.delete({
      where: { id },
    });

    await logActivity({
      userId: session.user.id,
      action: 'DELETE',
      resource: 'POS_ORDER',
      resourceId: id,
      details: `Deleted POS order: ${id}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting POS order:', error);
    return NextResponse.json(
      { error: 'Failed to delete POS order' },
      { status: 500 }
    );
  }
}

