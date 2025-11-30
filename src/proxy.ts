import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';
import { prisma } from '@/lib/prisma';
import { isFeatureEnabled } from '@/lib/features';

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  // Don't prefix default locale (en)
  localePrefix: 'as-needed'
});

async function handleUrlRedirects(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip for static files, API routes, and admin routes
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.startsWith('/admin') ||
    path.includes('.') // Skip files with extensions
  ) {
    return null;
  }

  try {
    // Check for active redirects
    const redirect = await prisma.urlRedirect.findFirst({
      where: {
        fromPath: path,
        isActive: true,
      },
    });

    if (redirect) {
      // Update hit count
      await prisma.urlRedirect.update({
        where: { id: redirect.id },
        data: {
          hitCount: { increment: 1 },
          lastHitAt: new Date(),
        },
      });

      // Determine status code
      const statusCode = redirect.type === 'PERMANENT_301' ? 301 : 302;

      // Perform redirect
      return NextResponse.redirect(
        new URL(redirect.toPath, request.url),
        statusCode
      );
    }
  } catch (error) {
    console.error('Error in redirect middleware:', error);
    // Continue to the next middleware/handler if there's an error
  }

  return null;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files, API routes, admin routes, and auth routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/auth') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next();
  }

  // Check if storefront is enabled
  try {
    const storefrontEnabled = await isFeatureEnabled('storefront_enabled');
    if (!storefrontEnabled) {
      // Redirect to admin login if storefront is disabled
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  } catch (error) {
    console.error('Error checking storefront feature:', error);
    // If there's an error, allow the request to continue (fail open)
  }

  // First, handle URL redirects from database
  const redirectResponse = await handleUrlRedirects(request);
  if (redirectResponse && redirectResponse.status >= 300 && redirectResponse.status < 400) {
    return redirectResponse;
  }

  // Then, handle locale routing with next-intl
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin (admin routes)
     * - auth (auth routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|admin|auth).*)',
  ],
};
