import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    const posSession = await prisma.posSession.findUnique({
      where: { id },
      include: {
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
        location: true,
      },
    });

    if (!posSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Get all orders for this session
    const orders = await prisma.posOrder.findMany({
      where: {
        cashierId: posSession.cashierId,
        createdAt: {
          gte: posSession.openedAt,
          lte: posSession.closedAt || new Date(),
        },
      },
      include: {
        order: true,
      },
    });

    // Calculate summary
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + Number(o.order?.total || 0), 0);
    const cashSales = orders
      .filter((o) => o.paymentMethod === 'CASH')
      .reduce((sum, o) => sum + Number(o.order?.total || 0), 0);
    const cardSales = orders
      .filter((o) => o.paymentMethod === 'CARD')
      .reduce((sum, o) => sum + Number(o.order?.total || 0), 0);
    const digitalSales = orders
      .filter((o) => o.paymentMethod === 'DIGITAL_WALLET')
      .reduce((sum, o) => sum + Number(o.order?.total || 0), 0);

    return NextResponse.json({
      session: posSession,
      summary: {
        totalOrders,
        totalSales,
        cashSales,
        cardSales,
        digitalSales,
        openingCash: Number(posSession.openingCash),
        closingCash: posSession.closingCash ? Number(posSession.closingCash) : null,
        expectedCash: posSession.expectedCash ? Number(posSession.expectedCash) : null,
        difference: posSession.difference ? Number(posSession.difference) : null,
      },
    });
  } catch (error) {
    console.error('Error fetching session summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session summary' },
      { status: 500 }
    );
  }
}

