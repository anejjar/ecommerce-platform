import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await params;

    const posOrder = await prisma.posOrder.findUnique({
      where: { id: orderId },
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

    if (!posOrder || !posOrder.order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Return receipt data (will be formatted on frontend)
    return NextResponse.json({
      posOrder,
      receipt: {
        orderNumber: posOrder.order.orderNumber,
        date: posOrder.createdAt,
        location: posOrder.location.name,
        cashier: posOrder.cashier.user.name || posOrder.cashier.user.email,
        items: posOrder.order.items,
        subtotal: posOrder.order.subtotal,
        tax: posOrder.order.tax,
        discount: posOrder.order.discountAmount,
        total: posOrder.order.total,
        paymentMethod: posOrder.paymentMethod,
        customerName: posOrder.customerName,
        tableNumber: posOrder.tableNumber,
      },
    });
  } catch (error) {
    console.error('Error generating receipt:', error);
    return NextResponse.json(
      { error: 'Failed to generate receipt' },
      { status: 500 }
    );
  }
}

