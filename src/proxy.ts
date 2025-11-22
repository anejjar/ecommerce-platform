import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'as-needed',
    localeDetection: true,
});

export default function proxy(request: NextRequest) {
    const response = intlMiddleware(request);
    const locale = response.headers.get('x-middleware-request-locale') || defaultLocale;
    response.cookies.set('NEXT_LOCALE', locale, {
        maxAge: 90 * 24 * 60 * 60,
        path: '/',
        sameSite: 'lax',
    });
    return response;
}

export const config = {
    matcher: ['/((?!api|admin|auth|_next|_vercel|favicon.ico|.*\\..*).*)']
};
