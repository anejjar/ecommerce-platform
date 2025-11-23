import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isFeatureEnabled } from '@/lib/features';

// Get abandoned cart statistics
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

    // Get total count
    const total = await prisma.abandonedCart.count();

    // Get counts by status
    const abandoned = await prisma.abandonedCart.count({
      where: { status: 'ABANDONED' },
    });

    const recovered = await prisma.abandonedCart.count({
      where: { status: 'RECOVERED' },
    });

    const expired = await prisma.abandonedCart.count({
      where: { status: 'EXPIRED' },
    });

    // Calculate total value of abandoned carts
    const abandonedCarts = await prisma.abandonedCart.findMany({
      where: { status: 'ABANDONED' },
      select: { totalValue: true },
    });

    const totalValue = abandonedCarts.reduce(
      (sum, cart) => sum + Number(cart.totalValue),
      0
    );

    // Calculate recovered value
    const recoveredCarts = await prisma.abandonedCart.findMany({
      where: { status: 'RECOVERED' },
      select: { totalValue: true },
    });

    const recoveredValue = recoveredCarts.reduce(
      (sum, cart) => sum + Number(cart.totalValue),
      0
    );

    // Calculate recovery rate
    const recoveryRate = total > 0 ? (recovered / total) * 100 : 0;

    return NextResponse.json({
      total,
      abandoned,
      recovered,
      expired,
      totalValue,
      recoveredValue,
      recoveryRate,
    });
  } catch (error) {
    console.error('Error fetching abandoned cart stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
