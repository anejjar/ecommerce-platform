import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { subDays, startOfDay, endOfDay } from 'date-fns';

/**
 * GET /api/admin/loyalty/analytics
 * Get loyalty program analytics and metrics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = startOfDay(subDays(new Date(), days));
    const endDate = endOfDay(new Date());

    // Parallel queries for better performance
    const [
      totalAccounts,
      totalPointsIssued,
      totalPointsRedeemed,
      totalPointsExpired,
      activeAccounts,
      newAccounts,
      tierDistribution,
      topEarners,
      recentRedemptions,
      pointsIssuedByType,
      redemptionsByType,
    ] = await Promise.all([
      // Total accounts
      prisma.customerLoyaltyAccount.count(),

      // Total points issued (all time)
      prisma.loyaltyPointsTransaction.aggregate({
        where: {
          points: { gt: 0 },
        },
        _sum: { points: true },
      }),

      // Total points redeemed (all time)
      prisma.loyaltyRedemption.aggregate({
        _sum: { pointsSpent: true },
      }),

      // Total points expired (all time)
      prisma.loyaltyPointsTransaction.aggregate({
        where: {
          expired: true,
        },
        _sum: { points: true },
      }),

      // Active accounts (had activity in date range)
      prisma.customerLoyaltyAccount.count({
        where: {
          lastActivityAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      // New accounts in date range
      prisma.customerLoyaltyAccount.count({
        where: {
          enrolledAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      // Tier distribution
      prisma.loyaltyTier.findMany({
        select: {
          id: true,
          name: true,
          color: true,
          _count: {
            select: {
              accounts: true,
            },
          },
        },
        orderBy: { displayOrder: 'asc' },
      }),

      // Top 10 earners
      prisma.customerLoyaltyAccount.findMany({
        take: 10,
        orderBy: { lifetimePoints: 'desc' },
        select: {
          id: true,
          pointsBalance: true,
          lifetimePoints: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          tier: {
            select: {
              name: true,
              color: true,
            },
          },
        },
      }),

      // Recent redemptions
      prisma.loyaltyRedemption.findMany({
        take: 10,
        orderBy: { redeemedAt: 'desc' },
        where: {
          redeemedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          id: true,
          type: true,
          pointsSpent: true,
          description: true,
          redeemedAt: true,
          account: {
            select: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),

      // Points issued by type in date range
      prisma.loyaltyPointsTransaction.groupBy({
        by: ['type'],
        where: {
          points: { gt: 0 },
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: {
          points: true,
        },
        _count: {
          id: true,
        },
      }),

      // Redemptions by type in date range
      prisma.loyaltyRedemption.groupBy({
        by: ['type'],
        where: {
          redeemedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: {
          pointsSpent: true,
        },
        _count: {
          id: true,
        },
      }),
    ]);

    // Calculate metrics
    const totalActivePoints = await prisma.customerLoyaltyAccount.aggregate({
      _sum: { pointsBalance: true },
    });

    const averagePointsPerAccount = totalAccounts > 0
      ? Math.round((totalActivePoints._sum.pointsBalance || 0) / totalAccounts)
      : 0;

    const engagementRate = totalAccounts > 0
      ? Math.round((activeAccounts / totalAccounts) * 100)
      : 0;

    // Calculate points issued in date range
    const pointsIssuedInRange = pointsIssuedByType.reduce(
      (sum, item) => sum + (item._sum.points || 0),
      0
    );

    // Calculate redemption rate
    const redemptionRate = totalPointsIssued._sum.points
      ? Math.round(
          ((totalPointsRedeemed._sum.pointsSpent || 0) / totalPointsIssued._sum.points) * 100
        )
      : 0;

    return NextResponse.json({
      overview: {
        totalAccounts,
        totalPointsIssued: totalPointsIssued._sum.points || 0,
        totalPointsRedeemed: totalPointsRedeemed._sum.pointsSpent || 0,
        totalPointsExpired: Math.abs(totalPointsExpired._sum.points || 0),
        totalActivePoints: totalActivePoints._sum.pointsBalance || 0,
        averagePointsPerAccount,
        activeAccounts,
        newAccounts,
        engagementRate,
        redemptionRate,
      },
      tierDistribution: tierDistribution.map((tier) => ({
        id: tier.id,
        name: tier.name,
        color: tier.color,
        count: tier._count.accounts,
        percentage:
          totalAccounts > 0
            ? Math.round((tier._count.accounts / totalAccounts) * 100)
            : 0,
      })),
      topEarners,
      recentRedemptions,
      pointsIssuedByType: pointsIssuedByType.map((item) => ({
        type: item.type,
        points: item._sum.points || 0,
        count: item._count.id,
      })),
      redemptionsByType: redemptionsByType.map((item) => ({
        type: item.type,
        pointsSpent: item._sum.pointsSpent || 0,
        count: item._count.id,
      })),
      dateRange: {
        start: startDate,
        end: endDate,
        days,
      },
    });
  } catch (error: any) {
    console.error('Error fetching loyalty analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loyalty analytics', details: error.message },
      { status: 500 }
    );
  }
}
