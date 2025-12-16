'use client';

import { useEffect, useCallback, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

const SESSION_COOKIE = 'traffic_session';
const SESSION_DAYS = 30;

/**
 * Hook for tracking user traffic and behavior
 * - Automatically tracks page views on route changes
 * - Provides trackEvent function for custom events
 * - Manages session tokens via cookies
 */
export function useTrafficTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string>('');

  /**
   * Get or create session token
   */
  const getSessionToken = useCallback(() => {
    let token = Cookies.get(SESSION_COOKIE);
    if (!token) {
      token = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      Cookies.set(SESSION_COOKIE, token, {
        expires: SESSION_DAYS,
        sameSite: 'lax',
        path: '/',
      });
    }
    return token;
  }, []);

  /**
   * Track a page view
   */
  const trackPageView = useCallback(
    async (force = false) => {
      const currentPath = pathname;

      // Prevent duplicate tracking
      if (!force && lastTrackedPath.current === currentPath) {
        return;
      }

      lastTrackedPath.current = currentPath;

      const sessionToken = getSessionToken();
      const utmParams = {
        source: searchParams.get('utm_source'),
        medium: searchParams.get('utm_medium'),
        campaign: searchParams.get('utm_campaign'),
        content: searchParams.get('utm_content'),
        term: searchParams.get('utm_term'),
      };

      try {
        await fetch('/api/tracking/page-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            sessionToken,
            path: currentPath,
            title: typeof document !== 'undefined' ? document.title : undefined,
            referrer: typeof document !== 'undefined' ? document.referrer : undefined,
            utmParams: Object.values(utmParams).some((v) => v) ? utmParams : undefined,
          }),
        });
      } catch (err) {
        console.error('Page view tracking failed:', err);
      }
    },
    [pathname, searchParams, getSessionToken]
  );

  /**
   * Track a custom event
   */
  const trackEvent = useCallback(
    async (eventType: string, eventData?: any, eventValue?: number) => {
      const sessionToken = getSessionToken();

      try {
        await fetch('/api/tracking/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            sessionToken,
            eventType,
            eventData,
            eventValue,
          }),
        });
      } catch (err) {
        console.error('Event tracking failed:', err);
      }
    },
    [getSessionToken]
  );

  /**
   * Track a product view
   */
  const trackProductView = useCallback(
    async (productId: string) => {
      const sessionToken = getSessionToken();

      try {
        await fetch('/api/tracking/product-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            sessionToken,
            productId,
          }),
        });
      } catch (err) {
        console.error('Product view tracking failed:', err);
      }
    },
    [getSessionToken]
  );

  /**
   * Auto-track page views on route changes
   */
  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  return {
    trackEvent,
    trackPageView,
    trackProductView,
    getSessionToken,
  };
}
