import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple middleware - no locale routing, just pass through
export function middleware(request: NextRequest) {
  // Admin routes and API routes pass through unchanged
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
