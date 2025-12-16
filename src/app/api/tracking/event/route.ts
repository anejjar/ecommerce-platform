import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getOrCreateSession,
  trackEvent,
  getClientIp,
  getUserAgent,
} from '@/lib/tracking/tracking-service';

/**
 * POST /api/tracking/event
 * Track a custom event (add to cart, checkout start, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { sessionToken, eventType, eventData, eventValue } = body;

    if (!sessionToken || !eventType) {
      return NextResponse.json(
        { error: 'Session token and event type are required' },
        { status: 400 }
      );
    }

    // Get or create traffic session
    const trafficSession = await getOrCreateSession({
      sessionToken,
      userId: session?.user?.id,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    // Track the event
    await trackEvent(trafficSession.id, eventType, eventData, eventValue);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Event tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
