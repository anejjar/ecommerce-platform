import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getOrCreateSession,
  trackProductView,
  getClientIp,
  getUserAgent,
} from '@/lib/tracking/tracking-service';

/**
 * POST /api/tracking/product-view
 * Track a product view for analytics
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { sessionToken, productId } = body;

    if (!sessionToken || !productId) {
      return NextResponse.json(
        { error: 'Session token and product ID are required' },
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

    // Track the product view
    await trackProductView(trafficSession.id, productId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Product view tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track product view' },
      { status: 500 }
    );
  }
}
