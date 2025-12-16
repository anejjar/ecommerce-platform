import { prisma } from '@/lib/prisma';

interface UTMParams {
  source?: string | null;
  medium?: string | null;
  campaign?: string | null;
  content?: string | null;
  term?: string | null;
}

interface SessionData {
  sessionToken: string;
  userId?: string;
  utmParams?: UTMParams;
  referrer?: string;
  landingPage?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Detect traffic source from UTM parameters or referrer
 */
export function detectSource(utmParams?: UTMParams, referrer?: string) {
  // UTM parameters take priority
  if (utmParams?.source) {
    return {
      source: utmParams.source,
      medium: utmParams.medium || 'unknown',
    };
  }

  // Fallback to referrer domain detection
  if (referrer) {
    try {
      const url = new URL(referrer);
      const domain = url.hostname.toLowerCase();

      // Social media platforms
      if (domain.includes('facebook.com') || domain.includes('fb.com')) {
        return { source: 'facebook', medium: 'social' };
      }
      if (domain.includes('instagram.com')) {
        return { source: 'instagram', medium: 'social' };
      }
      if (domain.includes('tiktok.com')) {
        return { source: 'tiktok', medium: 'social' };
      }
      if (domain.includes('twitter.com') || domain.includes('x.com')) {
        return { source: 'twitter', medium: 'social' };
      }
      if (domain.includes('linkedin.com')) {
        return { source: 'linkedin', medium: 'social' };
      }
      if (domain.includes('pinterest.com')) {
        return { source: 'pinterest', medium: 'social' };
      }
      if (domain.includes('youtube.com')) {
        return { source: 'youtube', medium: 'video' };
      }

      // Search engines
      if (domain.includes('google.com')) {
        return { source: 'google', medium: 'organic' };
      }
      if (domain.includes('bing.com')) {
        return { source: 'bing', medium: 'organic' };
      }
      if (domain.includes('yahoo.com')) {
        return { source: 'yahoo', medium: 'organic' };
      }
      if (domain.includes('duckduckgo.com')) {
        return { source: 'duckduckgo', medium: 'organic' };
      }

      // Other referrals
      return { source: domain, medium: 'referral' };
    } catch (e) {
      // Invalid URL, treat as direct
    }
  }

  // No source detected - direct traffic
  return { source: 'direct', medium: 'none' };
}

/**
 * Get or create a traffic session
 */
export async function getOrCreateSession(data: SessionData) {
  let session = await prisma.trafficSession.findUnique({
    where: { sessionToken: data.sessionToken },
  });

  if (!session) {
    // New session - create with first-touch attribution
    const source = detectSource(data.utmParams, data.referrer);

    session = await prisma.trafficSession.create({
      data: {
        sessionToken: data.sessionToken,
        userId: data.userId,

        // First-touch attribution (never changes)
        firstTouchSource: source.source,
        firstTouchMedium: source.medium,
        firstTouchCampaign: data.utmParams?.campaign,
        firstTouchContent: data.utmParams?.content,
        firstTouchTerm: data.utmParams?.term,
        firstTouchReferrer: data.referrer,
        firstTouchLandingPage: data.landingPage,

        // Last-touch attribution (initial = same as first)
        lastTouchSource: source.source,
        lastTouchMedium: source.medium,
        lastTouchCampaign: data.utmParams?.campaign,
        lastTouchContent: data.utmParams?.content,
        lastTouchTerm: data.utmParams?.term,
        lastTouchReferrer: data.referrer,
        lastTouchLandingPage: data.landingPage,

        // Session metadata
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  } else {
    // Existing session - update last-touch if new source detected
    if (data.utmParams?.source || data.referrer) {
      const source = detectSource(data.utmParams, data.referrer);

      await prisma.trafficSession.update({
        where: { id: session.id },
        data: {
          lastTouchSource: source.source,
          lastTouchMedium: source.medium,
          lastTouchCampaign: data.utmParams?.campaign,
          lastTouchContent: data.utmParams?.content,
          lastTouchTerm: data.utmParams?.term,
          lastTouchReferrer: data.referrer,
          lastTouchLandingPage: data.landingPage,
          lastActivityAt: new Date(),
          userId: data.userId || session.userId, // Associate user if they log in
        },
      });
    } else {
      // Just update last activity
      await prisma.trafficSession.update({
        where: { id: session.id },
        data: {
          lastActivityAt: new Date(),
          userId: data.userId || session.userId,
        },
      });
    }
  }

  return session;
}

/**
 * Track a page view
 */
export async function trackPageView(
  sessionId: string,
  data: { path: string; title?: string; referrer?: string }
) {
  await prisma.trafficPageView.create({
    data: {
      sessionId,
      path: data.path,
      title: data.title,
      referrer: data.referrer,
    },
  });

  // Increment page view count
  await prisma.trafficSession.update({
    where: { id: sessionId },
    data: {
      pageViewCount: { increment: 1 },
      lastActivityAt: new Date(),
    },
  });
}

/**
 * Track a product view
 */
export async function trackProductView(sessionId: string, productId: string) {
  await prisma.trafficProductView.create({
    data: {
      sessionId,
      productId,
    },
  });

  // Increment product view count
  await prisma.trafficSession.update({
    where: { id: sessionId },
    data: {
      productViewCount: { increment: 1 },
      lastActivityAt: new Date(),
    },
  });
}

/**
 * Track a custom event (add to cart, checkout start, etc.)
 */
export async function trackEvent(
  sessionId: string,
  eventType: string,
  eventData?: any,
  eventValue?: number
) {
  await prisma.trafficEvent.create({
    data: {
      sessionId,
      eventType: eventType as any,
      eventData: eventData ? JSON.stringify(eventData) : null,
      eventValue,
    },
  });

  // Update add-to-cart count if applicable
  if (eventType === 'ADD_TO_CART') {
    await prisma.trafficSession.update({
      where: { id: sessionId },
      data: {
        addToCartCount: { increment: 1 },
        lastActivityAt: new Date(),
      },
    });
  } else {
    // Just update last activity
    await prisma.trafficSession.update({
      where: { id: sessionId },
      data: {
        lastActivityAt: new Date(),
      },
    });
  }
}

/**
 * Track a conversion (completed order)
 */
export async function trackConversion(
  sessionToken: string,
  orderId: string,
  orderValue: number
) {
  const session = await prisma.trafficSession.findUnique({
    where: { sessionToken },
  });

  if (!session) {
    console.warn(`No session found for token: ${sessionToken}`);
    return;
  }

  // Mark session as converted
  await prisma.trafficSession.update({
    where: { id: session.id },
    data: {
      converted: true,
      orderId,
      conversionValue: orderValue,
      lastActivityAt: new Date(),
    },
  });

  // Update order with attribution data (first-touch)
  await prisma.order.update({
    where: { id: orderId },
    data: {
      attributionSource: session.firstTouchSource,
      attributionMedium: session.firstTouchMedium,
      attributionCampaign: session.firstTouchCampaign,
    },
  });
}

/**
 * Helper to extract IP address from request headers
 */
export function getClientIp(request: Request): string | undefined {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return undefined;
}

/**
 * Helper to extract user agent from request headers
 */
export function getUserAgent(request: Request): string | undefined {
  return request.headers.get('user-agent') || undefined;
}
