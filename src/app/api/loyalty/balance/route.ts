import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get loyalty account with minimal data
    const account = await prisma.customerLoyaltyAccount.findUnique({
      where: { userId: user.id },
      select: {
        pointsBalance: true,
        lifetimePoints: true,
        tier: {
          select: {
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Loyalty account not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      pointsBalance: account.pointsBalance,
      lifetimePoints: account.lifetimePoints,
      tier: account.tier,
    });
  } catch (error) {
    console.error('Get loyalty balance error:', error);
    return NextResponse.json(
      { error: 'Failed to get loyalty balance' },
      { status: 500 }
    );
  }
}
