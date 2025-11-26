import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for static files, API routes, and admin routes
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.startsWith('/admin') ||
    path.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next();
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
