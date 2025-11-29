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

    const searchParams = request.nextUrl.searchParams;
    const locationId = searchParams.get('locationId');

    const where: any = {};
    if (locationId) where.locationId = locationId;

    // Count synced vs unsynced orders
    const [synced, unsynced] = await Promise.all([
      prisma.posOrder.count({
        where: {
          ...where,
          orderId: {
            not: null,
          },
        },
      }),
      prisma.posOrder.count({
        where: {
          ...where,
          orderId: null,
        },
      }),
    ]);

    return NextResponse.json({
      synced,
      unsynced,
      total: synced + unsynced,
      syncRate: synced + unsynced > 0 ? (synced / (synced + unsynced)) * 100 : 0,
    });
  } catch (error) {
    console.error('Error fetching sync status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sync status' },
      { status: 500 }
    );
  }
}

