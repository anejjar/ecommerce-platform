import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getNextTierInfo } from '@/lib/loyalty/tier-manager';
import { getExpirationSummary } from '@/lib/loyalty/points-expiration';

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

    // Get loyalty account
    const account = await prisma.customerLoyaltyAccount.findUnique({
      where: { userId: user.id },
      include: {
        tier: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        redemptions: {
          orderBy: { redeemedAt: 'desc' },
          take: 5,
          include: {
            discountCode: true,
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

    // Get next tier information
    const nextTierInfo = await getNextTierInfo(account.id);

    // Get expiration summary
    const expirationSummary = await getExpirationSummary(account.id);

    // Format response
    const response = {
      account: {
        id: account.id,
        pointsBalance: account.pointsBalance,
        lifetimePoints: account.lifetimePoints,
        referralCode: account.referralCode,
        enrolledAt: account.enrolledAt,
        lastActivityAt: account.lastActivityAt,
      },
      tier: {
        id: account.tier.id,
        name: account.tier.name,
        color: account.tier.color,
        icon: account.tier.icon,
        pointsRequired: account.tier.pointsRequired,
        benefitsDescription: account.tier.benefitsDescription,
        earlyAccessEnabled: account.tier.earlyAccessEnabled,
        earlyAccessHours: account.tier.earlyAccessHours,
        discountPercentage: Number(account.tier.discountPercentage),
        pointsMultiplier: Number(account.tier.pointsMultiplier),
      },
      nextTier: nextTierInfo
        ? {
            tier: {
              name: nextTierInfo.nextTier.name,
              pointsRequired: nextTierInfo.nextTier.pointsRequired,
              color: nextTierInfo.nextTier.color,
              icon: nextTierInfo.nextTier.icon,
            },
            pointsNeeded: nextTierInfo.pointsNeeded,
            progress: nextTierInfo.progress,
          }
        : null,
      recentTransactions: account.transactions.map((tx) => ({
        id: tx.id,
        type: tx.type,
        points: tx.points,
        description: tx.description,
        createdAt: tx.createdAt,
        expiresAt: tx.expiresAt,
      })),
      recentRedemptions: account.redemptions.map((redemption) => ({
        id: redemption.id,
        type: redemption.type,
        pointsSpent: redemption.pointsSpent,
        description: redemption.description,
        redeemedAt: redemption.redeemedAt,
        discountCode: redemption.discountCode
          ? {
              code: redemption.discountCode.code,
              value: Number(redemption.discountCode.value),
              type: redemption.discountCode.type,
            }
          : null,
      })),
      expiration: expirationSummary,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get loyalty account error:', error);
    return NextResponse.json(
      { error: 'Failed to get loyalty account' },
      { status: 500 }
    );
  }
}
