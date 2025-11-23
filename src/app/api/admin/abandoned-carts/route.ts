import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isFeatureEnabled } from '@/lib/features';

// Get all abandoned carts (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check if feature is enabled
    const enabled = await isFeatureEnabled('abandoned_cart');
    if (!enabled) {
      return NextResponse.json(
        { error: 'Feature not available' },
        { status: 404 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    const abandonedCarts = await prisma.abandonedCart.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        emails: {
          orderBy: {
            sentAt: 'desc',
          },
        },
      },
      orderBy: {
        abandonedAt: 'desc',
      },
    });

    return NextResponse.json(abandonedCarts);
  } catch (error) {
    console.error('Error fetching abandoned carts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch abandoned carts' },
      { status: 500 }
    );
  }
}
