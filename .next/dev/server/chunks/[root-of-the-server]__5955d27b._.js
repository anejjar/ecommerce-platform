module.exports = [
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/i18n.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "defaultLocale",
    ()=>defaultLocale,
    "locales",
    ()=>locales
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getRequestConfig$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__default__as__getRequestConfig$3e$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/server/react-server/getRequestConfig.js [middleware] (ecmascript) <export default as getRequestConfig>");
;
const locales = [
    'en',
    'fr'
];
const defaultLocale = 'en';
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getRequestConfig$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__default__as__getRequestConfig$3e$__["getRequestConfig"])(async ({ requestLocale })=>{
    let locale = await requestLocale;
    // Validate that the incoming `locale` parameter is valid
    if (!locale || !locales.includes(locale)) {
        locale = defaultLocale;
    }
    try {
        // Try to load translations from the messages directory (admin managed)
        const messages = (await __turbopack_context__.f({
            "../messages/en.json": {
                id: ()=>"[project]/messages/en.json (json, async loader)",
                module: ()=>__turbopack_context__.A("[project]/messages/en.json (json, async loader)")
            },
            "../messages/fr.json": {
                id: ()=>"[project]/messages/fr.json (json, async loader)",
                module: ()=>__turbopack_context__.A("[project]/messages/fr.json (json, async loader)")
            }
        }).import(`../messages/${locale}.json`)).default;
        return {
            locale: locale,
            messages
        };
    } catch (error) {
        // If no translation file exists, fall back to English
        console.warn(`Translation file for ${locale} not found, using English`);
        const messages = (await __turbopack_context__.A("[project]/messages/en.json (json, async loader)")).default;
        return {
            locale: locale,
            messages
        };
    }
});
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: [
        'query'
    ]
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/src/lib/features.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getEnabledFeatures",
    ()=>getEnabledFeatures,
    "isFeatureEnabled",
    ()=>isFeatureEnabled
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [middleware] (ecmascript)");
;
async function isFeatureEnabled(featureName) {
    try {
        const feature = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["prisma"].featureFlag.findUnique({
            where: {
                name: featureName
            }
        });
        return feature?.enabled ?? false;
    } catch (error) {
        console.error(`Error checking feature flag ${featureName}:`, error);
        return false;
    }
}
async function getEnabledFeatures() {
    try {
        const features = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["prisma"].featureFlag.findMany({
            where: {
                enabled: true
            },
            select: {
                name: true
            }
        });
        return features.map((f)=>f.name);
    } catch (error) {
        console.error('Error getting enabled features:', error);
        return [];
    }
}
}),
"[project]/src/proxy.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "proxy",
    ()=>proxy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$middleware$2f$middleware$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/middleware/middleware.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/i18n.ts [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/features.ts [middleware] (ecmascript)");
;
;
;
;
;
// Create next-intl middleware
const intlMiddleware = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$middleware$2f$middleware$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["default"])({
    locales: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["locales"],
    defaultLocale: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["defaultLocale"],
    // Don't prefix default locale (en)
    localePrefix: 'as-needed'
});
async function handleUrlRedirects(request) {
    const path = request.nextUrl.pathname;
    // Skip for static files, API routes, and admin routes
    if (path.startsWith('/_next') || path.startsWith('/api') || path.startsWith('/admin') || path.includes('.') // Skip files with extensions
    ) {
        return null;
    }
    try {
        // Check for active redirects
        const redirect = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["prisma"].urlRedirect.findFirst({
            where: {
                fromPath: path,
                isActive: true
            }
        });
        if (redirect) {
            // Update hit count
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["prisma"].urlRedirect.update({
                where: {
                    id: redirect.id
                },
                data: {
                    hitCount: {
                        increment: 1
                    },
                    lastHitAt: new Date()
                }
            });
            // Determine status code
            const statusCode = redirect.type === 'PERMANENT_301' ? 301 : 302;
            // Perform redirect
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(redirect.toPath, request.url), statusCode);
        }
    } catch (error) {
        console.error('Error in redirect middleware:', error);
    // Continue to the next middleware/handler if there's an error
    }
    return null;
}
async function proxy(request) {
    const pathname = request.nextUrl.pathname;
    // Skip middleware for static files, API routes, admin routes, and auth routes
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/admin') || pathname.startsWith('/auth') || pathname.includes('.') // Skip files with extensions
    ) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Check if storefront is enabled
    try {
        const storefrontEnabled = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["isFeatureEnabled"])('storefront_enabled');
        if (!storefrontEnabled) {
            // Redirect to admin login if storefront is disabled
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/admin/login', request.url));
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
const config = {
    matcher: [
        /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin (admin routes)
     * - auth (auth routes)
     */ '/((?!api|_next/static|_next/image|favicon.ico|admin|auth).*)'
    ]
};
}),
];

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="86ddc073-2775-5d0e-93f9-a9a28de6257e")}catch(e){}}();
//# sourceMappingURL=%5Broot-of-the-server%5D__5955d27b._.js.map
//# debugId=86ddc073-2775-5d0e-93f9-a9a28de6257e
