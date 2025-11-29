import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find cashier record for current user
    const cashier = await prisma.cashier.findUnique({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      include: {
        location: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!cashier) {
      return NextResponse.json({ error: 'Cashier record not found' }, { status: 404 });
    }

    return NextResponse.json(cashier);
  } catch (error) {
    console.error('Error fetching current cashier:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cashier' },
      { status: 500 }
    );
  }
}

