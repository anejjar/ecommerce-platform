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
                id: true,
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

    return NextResponse.json(posSession);
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
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
    const { closingCash, expectedCash, difference, status } = body;

    const updateData: any = {};
    if (closingCash !== undefined) updateData.closingCash = closingCash;
    if (expectedCash !== undefined) updateData.expectedCash = expectedCash;
    if (difference !== undefined) updateData.difference = difference;
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'CLOSED' && !updateData.closedAt) {
        updateData.closedAt = new Date();
      }
    }

    const posSession = await prisma.posSession.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(posSession);
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

