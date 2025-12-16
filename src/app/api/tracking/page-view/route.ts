import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getOrCreateSession,
  trackPageView,
  getClientIp,
  getUserAgent,
} from '@/lib/tracking/tracking-service';

/**
 * POST /api/tracking/page-view
 * Track a page view for analytics
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { sessionToken, path, title, referrer, utmParams } = body;

    if (!sessionToken || !path) {
      return NextResponse.json(
        { error: 'Session token and path are required' },
        { status: 400 }
      );
    }

    // Get or create traffic session
    const trafficSession = await getOrCreateSession({
      sessionToken,
      userId: session?.user?.id,
      utmParams,
      referrer,
      landingPage: path,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    // Track the page view
    await trackPageView(trafficSession.id, {
      path,
      title,
      referrer,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Page view tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track page view' },
      { status: 500 }
    );
  }
}
