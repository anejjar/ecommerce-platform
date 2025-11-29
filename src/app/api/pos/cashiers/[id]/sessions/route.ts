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

    const { id: cashierId } = await params;
    const body = await request.json();
    const { action, openingCash, closingCash } = body; // action: 'open' or 'close'

    const cashier = await prisma.cashier.findUnique({
      where: { id: cashierId },
      include: {
        location: true,
      },
    });

    if (!cashier) {
      return NextResponse.json({ error: 'Cashier not found' }, { status: 404 });
    }

    if (action === 'open') {
      // Check if there's an open session
      const openSession = await prisma.posSession.findFirst({
        where: {
          cashierId,
          status: 'OPEN',
        },
      });

      if (openSession) {
        return NextResponse.json(
          { error: 'Cashier already has an open session' },
          { status: 400 }
        );
      }

      const posSession = await prisma.posSession.create({
        data: {
          cashierId,
          locationId: cashier.locationId,
          openingCash: openingCash || 0,
          status: 'OPEN',
        },
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

      await logActivity({
        userId: session.user.id,
        action: 'CREATE',
        resource: 'POS_SESSION',
        resourceId: posSession.id,
        details: `Opened POS session for cashier: ${cashier.user.name || cashier.user.email}`,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      });

      return NextResponse.json(posSession, { status: 201 });
    } else if (action === 'close') {
      const openSession = await prisma.posSession.findFirst({
        where: {
          cashierId,
          status: 'OPEN',
        },
      });

      if (!openSession) {
        return NextResponse.json(
          { error: 'No open session found' },
          { status: 400 }
        );
      }

      // Calculate expected cash from orders
      const cashOrders = await prisma.posOrder.findMany({
        where: {
          cashierId,
          paymentMethod: 'CASH',
          createdAt: {
            gte: openSession.openedAt,
          },
        },
        include: {
          order: true,
        },
      });

      const totalCashSales = cashOrders.reduce((sum, posOrder) => {
        return sum + Number(posOrder.order?.total || 0);
      }, 0);

      const expectedCash = Number(openSession.openingCash) + totalCashSales;
      const difference = closingCash ? Number(closingCash) - expectedCash : 0;

      const updatedSession = await prisma.posSession.update({
        where: { id: openSession.id },
        data: {
          closedAt: new Date(),
          closingCash: closingCash || expectedCash,
          expectedCash,
          difference,
          status: 'CLOSED',
        },
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

      await logActivity({
        userId: session.user.id,
        action: 'UPDATE',
        resource: 'POS_SESSION',
        resourceId: updatedSession.id,
        details: `Closed POS session for cashier: ${cashier.user.name || cashier.user.email}`,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      });

      return NextResponse.json(updatedSession);
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "open" or "close"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error managing cashier session:', error);
    return NextResponse.json(
      { error: 'Failed to manage session' },
      { status: 500 }
    );
  }
}

