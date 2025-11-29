import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const locationId = searchParams.get('locationId');

    const where: any = {};
    if (locationId) {
      where.locationId = locationId;
    }

    const cashiers = await prisma.cashier.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(cashiers);
  } catch (error) {
    console.error('Error fetching cashiers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cashiers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, locationId, employeeId, pin } = body;

    if (!userId || !locationId) {
      return NextResponse.json(
        { error: 'User ID and Location ID are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if location exists
    const location = await prisma.location.findUnique({
      where: { id: locationId },
    });

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    // Hash PIN if provided
    const hashedPin = pin ? await hash(pin, 10) : null;

    const cashier = await prisma.cashier.create({
      data: {
        userId,
        locationId,
        employeeId,
        pin: hashedPin,
        isActive: true,
      },
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
      action: 'CREATE',
      resource: 'CASHIER',
      resourceId: cashier.id,
      details: `Created cashier: ${user.name || user.email}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json(cashier, { status: 201 });
  } catch (error) {
    console.error('Error creating cashier:', error);
    return NextResponse.json(
      { error: 'Failed to create cashier' },
      { status: 500 }
    );
  }
}

