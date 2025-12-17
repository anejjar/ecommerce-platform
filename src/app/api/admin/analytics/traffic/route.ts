import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isFeatureEnabled } from '@/lib/features';

/**
 * GET /api/admin/analytics/traffic
 * Get traffic analytics data with attribution
 * Premium feature: traffic_analytics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if traffic analytics feature is enabled
    const featureEnabled = await isFeatureEnabled('traffic_analytics');
    if (!featureEnabled) {
      return NextResponse.json(
        { error: 'Traffic Analytics is a premium feature. Please enable it in Features settings.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('from');
    const dateTo = searchParams.get('to');

    // Build date filter
    const dateFilter = dateFrom && dateTo ? {
      createdAt: {
        gte: new Date(dateFrom),
        lte: new Date(dateTo),
      },
    } : {};

    // Get overview stats
    const totalSessions = await prisma.trafficSession.count({
      where: dateFilter,
    });

    const totalConversions = await prisma.trafficSession.count({
      where: { converted: true, ...dateFilter },
    });

    const totalRevenue = await prisma.trafficSession.aggregate({
      where: { converted: true, ...dateFilter },
      _sum: { conversionValue: true },
    });

    const conversionRate = totalSessions > 0
      ? ((totalConversions / totalSessions) * 100).toFixed(2)
      : '0.00';

    // Get traffic sources breakdown (first-touch attribution)
    const sourcesRaw = await prisma.trafficSession.groupBy({
      by: ['firstTouchSource', 'firstTouchMedium'],
      where: dateFilter,
      _count: { id: true },
      _sum: { conversionValue: true },
    });

    const sources = await Promise.all(
      sourcesRaw.map(async (source) => {
        const conversions = await prisma.trafficSession.count({
          where: {
            firstTouchSource: source.firstTouchSource,
            firstTouchMedium: source.firstTouchMedium,
            converted: true,
            ...dateFilter,
          },
        });

        const revenue = source._sum.conversionValue || 0;
        const sessions = source._count.id;
        const conversionRate = sessions > 0
          ? ((conversions / sessions) * 100).toFixed(2)
          : '0.00';

        return {
          source: source.firstTouchSource || 'unknown',
          medium: source.firstTouchMedium || 'unknown',
          sessions,
          conversions,
          revenue: Number(revenue),
          conversionRate: `${conversionRate}%`,
          revenuePerSession: sessions > 0 ? (Number(revenue) / sessions).toFixed(2) : '0.00',
        };
      })
    );

    // Sort by sessions descending
    sources.sort((a, b) => b.sessions - a.sessions);

    // Get top landing pages
    const landingPagesRaw = await prisma.trafficSession.groupBy({
      by: ['firstTouchLandingPage'],
      where: {
        firstTouchLandingPage: { not: null },
        ...dateFilter,
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    const landingPages = await Promise.all(
      landingPagesRaw.map(async (page) => {
        const conversions = await prisma.trafficSession.count({
          where: {
            firstTouchLandingPage: page.firstTouchLandingPage,
            converted: true,
            ...dateFilter,
          },
        });

        const sessions = page._count.id;
        const conversionRate = sessions > 0
          ? ((conversions / sessions) * 100).toFixed(2)
          : '0.00';

        return {
          path: page.firstTouchLandingPage,
          sessions,
          conversions,
          conversionRate: `${conversionRate}%`,
        };
      })
    );

    // Get conversion funnel
    const totalPageViews = await prisma.trafficPageView.count({
      where: {
        session: dateFilter.createdAt ? { createdAt: dateFilter.createdAt } : undefined,
      },
    });

    const totalProductViews = await prisma.trafficProductView.count({
      where: {
        session: dateFilter.createdAt ? { createdAt: dateFilter.createdAt } : undefined,
      },
    });

    const totalAddToCarts = await prisma.trafficEvent.count({
      where: {
        eventType: 'ADD_TO_CART',
        session: dateFilter.createdAt ? { createdAt: dateFilter.createdAt } : undefined,
      },
    });

    const totalCheckoutStarts = await prisma.trafficEvent.count({
      where: {
        eventType: 'CHECKOUT_START',
        session: dateFilter.createdAt ? { createdAt: dateFilter.createdAt } : undefined,
      },
    });

    const funnel = {
      sessions: totalSessions,
      pageViews: totalPageViews,
      productViews: totalProductViews,
      addToCarts: totalAddToCarts,
      checkoutStarts: totalCheckoutStarts,
      conversions: totalConversions,
    };

    // Get sessions over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sessionsOverTime = await prisma.trafficSession.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: { id: true },
    });

    // Group by date
    const sessionsByDate = sessionsOverTime.reduce((acc, item) => {
      const date = new Date(item.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + item._count.id;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(sessionsByDate).map(([date, count]) => ({
      date,
      sessions: count,
    }));

    return NextResponse.json({
      overview: {
        totalSessions,
        totalConversions,
        totalRevenue: Number(totalRevenue._sum.conversionValue || 0),
        conversionRate: `${conversionRate}%`,
      },
      sources,
      landingPages,
      funnel,
      chartData,
    });
  } catch (error: any) {
    console.error('Traffic analytics error:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      code: error?.code
    });
    return NextResponse.json(
      {
        error: 'Failed to fetch traffic analytics',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}
