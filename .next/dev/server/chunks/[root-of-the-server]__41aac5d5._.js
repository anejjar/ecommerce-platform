module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authOptions",
    ()=>authOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/providers/credentials.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$next$2d$auth$2f$prisma$2d$adapter$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@next-auth/prisma-adapter/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
;
;
const authOptions = {
    adapter: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$next$2d$auth$2f$prisma$2d$adapter$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PrismaAdapter"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"]),
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/admin/login'
    },
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            name: 'credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email'
                },
                password: {
                    label: 'Password',
                    type: 'password'
                }
            },
            async authorize (credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });
                if (!user || !user.password) {
                    return null;
                }
                const isPasswordValid = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compare"])(credentials.password, user.password);
                if (!isPasswordValid) {
                    return null;
                }
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                };
            }
        })
    ],
    callbacks: {
        async jwt ({ token, user, trigger }) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    role: user.role
                };
            }
            // Validate session hasn't been invalidated
            if (token.id) {
                const dbUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                    where: {
                        id: token.id
                    },
                    select: {
                        sessionsInvalidatedAt: true,
                        role: true
                    }
                });
                if (dbUser) {
                    // Check if JWT was issued before sessions were invalidated
                    if (dbUser.sessionsInvalidatedAt) {
                        const tokenIssuedAt = token.iat ? token.iat * 1000 : 0; // Convert to milliseconds
                        const invalidatedAt = new Date(dbUser.sessionsInvalidatedAt).getTime();
                        if (tokenIssuedAt < invalidatedAt) {
                            // Session has been invalidated - return null to force re-login
                            return null;
                        }
                    }
                    // Update role in token if it changed
                    token.role = dbUser.role;
                } else {
                    // User no longer exists
                    return null;
                }
            }
            return token;
        },
        async session ({ session, token }) {
            // If token is null, session is invalid
            if (!token) {
                return null;
            }
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    role: token.role
                }
            };
        }
    }
};
}),
"[project]/src/lib/permissions.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "canCreateResource",
    ()=>canCreateResource,
    "canDeleteResource",
    ()=>canDeleteResource,
    "canManageResource",
    ()=>canManageResource,
    "canUpdateResource",
    ()=>canUpdateResource,
    "canViewResource",
    ()=>canViewResource,
    "getDefaultPermissionsForRole",
    ()=>getDefaultPermissionsForRole,
    "getUserPermissions",
    ()=>getUserPermissions,
    "hasPermission",
    ()=>hasPermission,
    "isAdmin",
    ()=>isAdmin,
    "isSuperAdmin",
    ()=>isSuperAdmin
]);
/**
 * Default permissions for each role
 * Format: "RESOURCE:ACTION"
 */ const ROLE_PERMISSIONS = {
    SUPERADMIN: [
        // Has ALL permissions including feature management
        'PRODUCT:MANAGE',
        'ORDER:MANAGE',
        'CUSTOMER:MANAGE',
        'CATEGORY:MANAGE',
        'REVIEW:MANAGE',
        'DISCOUNT:MANAGE',
        'SETTINGS:MANAGE',
        'ANALYTICS:MANAGE',
        'FEATURES:MANAGE',
        'ADMIN_USER:MANAGE',
        'STOCK_ALERT:MANAGE',
        'NEWSLETTER:MANAGE',
        'REFUND:MANAGE',
        'INVENTORY:MANAGE',
        'SUPPLIER:MANAGE',
        'PURCHASE_ORDER:MANAGE'
    ],
    ADMIN: [
        // Has all permissions EXCEPT feature management
        'PRODUCT:MANAGE',
        'ORDER:MANAGE',
        'CUSTOMER:MANAGE',
        'CATEGORY:MANAGE',
        'REVIEW:MANAGE',
        'DISCOUNT:MANAGE',
        'SETTINGS:MANAGE',
        'ANALYTICS:MANAGE',
        'ADMIN_USER:MANAGE',
        'STOCK_ALERT:MANAGE',
        'NEWSLETTER:MANAGE',
        'REFUND:MANAGE',
        'INVENTORY:MANAGE',
        'SUPPLIER:MANAGE',
        'PURCHASE_ORDER:MANAGE'
    ],
    MANAGER: [
        // Can manage orders, view/update customers and products
        'ORDER:MANAGE',
        'CUSTOMER:VIEW',
        'CUSTOMER:UPDATE',
        'PRODUCT:VIEW',
        'PRODUCT:UPDATE',
        'PRODUCT:CREATE',
        'CATEGORY:VIEW',
        'REVIEW:VIEW',
        'REVIEW:UPDATE',
        'STOCK_ALERT:VIEW',
        'REFUND:VIEW',
        'REFUND:UPDATE',
        'INVENTORY:MANAGE',
        'SUPPLIER:VIEW',
        'PURCHASE_ORDER:MANAGE'
    ],
    EDITOR: [
        // Can edit products and categories
        'PRODUCT:VIEW',
        'PRODUCT:CREATE',
        'PRODUCT:UPDATE',
        'CATEGORY:MANAGE',
        'REVIEW:VIEW',
        'STOCK_ALERT:VIEW'
    ],
    SUPPORT: [
        // View-only access to orders and customers
        'ORDER:VIEW',
        'CUSTOMER:VIEW',
        'PRODUCT:VIEW',
        'CATEGORY:VIEW',
        'REVIEW:VIEW',
        'REFUND:VIEW'
    ],
    VIEWER: [
        // Read-only access to all resources
        'PRODUCT:VIEW',
        'ORDER:VIEW',
        'CUSTOMER:VIEW',
        'CATEGORY:VIEW',
        'REVIEW:VIEW',
        'DISCOUNT:VIEW',
        'ANALYTICS:VIEW',
        'STOCK_ALERT:VIEW',
        'NEWSLETTER:VIEW',
        'REFUND:VIEW'
    ],
    CUSTOMER: []
};
function getDefaultPermissionsForRole(role) {
    return ROLE_PERMISSIONS[role] || [];
}
function hasPermission(role, resource, action) {
    if (!role) return false;
    // SUPERADMIN has all permissions
    if (role === 'SUPERADMIN') return true;
    const permissions = getDefaultPermissionsForRole(role);
    // Check exact permission
    const exactPermission = `${resource}:${action}`;
    if (permissions.includes(exactPermission)) return true;
    // If resource has MANAGE permission, it includes all actions
    const managePermission = `${resource}:MANAGE`;
    if (permissions.includes(managePermission)) {
        // MANAGE grants VIEW, CREATE, UPDATE, DELETE
        if ([
            'VIEW',
            'CREATE',
            'UPDATE',
            'DELETE'
        ].includes(action)) {
            return true;
        }
    }
    return false;
}
function canViewResource(role, resource) {
    return hasPermission(role, resource, 'VIEW');
}
function canCreateResource(role, resource) {
    return hasPermission(role, resource, 'CREATE');
}
function canUpdateResource(role, resource) {
    return hasPermission(role, resource, 'UPDATE');
}
function canDeleteResource(role, resource) {
    return hasPermission(role, resource, 'DELETE');
}
function canManageResource(role, resource) {
    return hasPermission(role, resource, 'MANAGE');
}
function isAdmin(role) {
    if (!role) return false;
    return [
        'ADMIN',
        'SUPERADMIN',
        'MANAGER',
        'EDITOR',
        'SUPPORT',
        'VIEWER'
    ].includes(role);
}
function isSuperAdmin(role) {
    return role === 'SUPERADMIN';
}
function getUserPermissions(role) {
    const permissions = getDefaultPermissionsForRole(role);
    const grouped = {};
    permissions.forEach((permission)=>{
        const [resource, action] = permission.split(':');
        if (!grouped[resource]) {
            grouped[resource] = new Set();
        }
        if (action === 'MANAGE') {
            // MANAGE implies all actions
            grouped[resource].add('VIEW');
            grouped[resource].add('CREATE');
            grouped[resource].add('UPDATE');
            grouped[resource].add('DELETE');
            grouped[resource].add('MANAGE');
        } else {
            grouped[resource].add(action);
        }
    });
    return Object.entries(grouped).map(([resource, actions])=>({
            resource,
            actions: Array.from(actions).sort()
        }));
}
}),
"[project]/src/lib/activity-log.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getActivityLogs",
    ()=>getActivityLogs,
    "getActivityLogsByResource",
    ()=>getActivityLogsByResource,
    "getActivityLogsByUser",
    ()=>getActivityLogsByUser,
    "getClientIp",
    ()=>getClientIp,
    "getUserAgent",
    ()=>getUserAgent,
    "logActivity",
    ()=>logActivity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
async function logActivity(input) {
    try {
        const log = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].adminActivityLog.create({
            data: {
                userId: input.userId,
                action: input.action,
                resource: input.resource,
                resourceId: input.resourceId,
                details: input.details,
                ipAddress: input.ipAddress,
                userAgent: input.userAgent
            }
        });
        return log;
    } catch (error) {
        console.error('Error logging activity:', error);
        throw error;
    }
}
async function getActivityLogs(filters = {}) {
    const { page = 1, limit = 20, userId, action, resource, resourceId, startDate, endDate } = filters;
    const where = {};
    if (userId) {
        where.userId = userId;
    }
    if (action) {
        where.action = action;
    }
    if (resource) {
        where.resource = resource;
    }
    if (resourceId) {
        where.resourceId = resourceId;
    }
    if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) {
            where.createdAt.gte = startDate;
        }
        if (endDate) {
            where.createdAt.lte = endDate;
        }
    }
    const [logs, total] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].adminActivityLog.findMany({
            where,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        role: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: (page - 1) * limit,
            take: limit
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].adminActivityLog.count({
            where
        })
    ]);
    return {
        logs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 0
    };
}
async function getActivityLogsByUser(userId, options = {}) {
    return getActivityLogs({
        userId,
        page: options.page,
        limit: options.limit
    });
}
async function getActivityLogsByResource(resource, resourceId, options = {}) {
    return getActivityLogs({
        resource,
        resourceId,
        page: options.page,
        limit: options.limit
    });
}
function getClientIp(request) {
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
function getUserAgent(request) {
    return request.headers.get('user-agent') || undefined;
}
}),
"[project]/src/app/api/admin/inventory/alerts/[productId]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$next$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/next/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/permissions.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$activity$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/activity-log.ts [app-route] (ecmascript)");
;
;
;
;
;
;
async function PATCH(request, { params }) {
    try {
        // Check authentication
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$next$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session?.user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        // Check permissions
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasPermission"])(session.user.role, 'STOCK_ALERT', 'UPDATE')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Insufficient permissions'
            }, {
                status: 403
            });
        }
        const { productId } = await params;
        // Verify product exists
        const product = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findUnique({
            where: {
                id: productId
            },
            select: {
                id: true,
                name: true,
                sku: true
            }
        });
        if (!product) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Product not found'
            }, {
                status: 404
            });
        }
        // Parse request body
        const body = await request.json();
        const { threshold, notified } = body;
        // Validate threshold
        if (threshold !== undefined) {
            if (typeof threshold !== 'number' || threshold < 0) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Threshold must be a non-negative number'
                }, {
                    status: 400
                });
            }
        }
        // Update or create stock alert
        const alert = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].stockAlert.upsert({
            where: {
                productId
            },
            update: {
                threshold: threshold !== undefined ? threshold : undefined,
                notified: notified !== undefined ? notified : undefined
            },
            create: {
                productId,
                threshold: threshold || 10,
                notified: notified || false
            }
        });
        // Log activity
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$activity$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logActivity"])({
            userId: session.user.id,
            action: 'UPDATE',
            resource: 'STOCK_ALERT',
            resourceId: alert.id,
            details: `Updated stock alert for product ${product.name} (${product.sku}). Threshold: ${alert.threshold}`,
            ipAddress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$activity$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getClientIp"])(request),
            userAgent: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$activity$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserAgent"])(request)
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            alert,
            product
        });
    } catch (error) {
        console.error('Error updating stock alert:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
async function POST(request, { params }) {
    try {
        // Check authentication
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$next$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session?.user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        // Check permissions
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasPermission"])(session.user.role, 'STOCK_ALERT', 'CREATE')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Insufficient permissions'
            }, {
                status: 403
            });
        }
        const { productId } = await params;
        // Verify product exists
        const product = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findUnique({
            where: {
                id: productId
            },
            select: {
                id: true,
                name: true,
                sku: true,
                stock: true
            }
        });
        if (!product) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Product not found'
            }, {
                status: 404
            });
        }
        // Parse request body
        const body = await request.json();
        const { threshold } = body;
        // Validate threshold
        if (threshold === undefined || typeof threshold !== 'number' || threshold < 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Valid threshold is required'
            }, {
                status: 400
            });
        }
        // Check if alert already exists
        const existingAlert = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].stockAlert.findUnique({
            where: {
                productId
            }
        });
        if (existingAlert) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Stock alert already exists for this product. Use PATCH to update.'
            }, {
                status: 409
            });
        }
        // Create stock alert
        const alert = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].stockAlert.create({
            data: {
                productId,
                threshold,
                notified: product.stock <= threshold
            }
        });
        // Log activity
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$activity$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logActivity"])({
            userId: session.user.id,
            action: 'CREATE',
            resource: 'STOCK_ALERT',
            resourceId: alert.id,
            details: `Created stock alert for product ${product.name} (${product.sku}). Threshold: ${threshold}`,
            ipAddress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$activity$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getClientIp"])(request),
            userAgent: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$activity$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserAgent"])(request)
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            alert,
            product
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Error creating stock alert:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
async function DELETE(request, { params }) {
    try {
        // Check authentication
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$next$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session?.user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        // Check permissions
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasPermission"])(session.user.role, 'STOCK_ALERT', 'DELETE')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Insufficient permissions'
            }, {
                status: 403
            });
        }
        const { productId } = await params;
        // Verify product and alert exist
        const product = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findUnique({
            where: {
                id: productId
            },
            include: {
                stockAlert: true
            }
        });
        if (!product) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Product not found'
            }, {
                status: 404
            });
        }
        if (!product.stockAlert) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Stock alert not found'
            }, {
                status: 404
            });
        }
        // Delete stock alert
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].stockAlert.delete({
            where: {
                productId
            }
        });
        // Log activity
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$activity$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logActivity"])({
            userId: session.user.id,
            action: 'DELETE',
            resource: 'STOCK_ALERT',
            resourceId: product.stockAlert.id,
            details: `Deleted stock alert for product ${product.name} (${product.sku})`,
            ipAddress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$activity$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getClientIp"])(request),
            userAgent: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$activity$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserAgent"])(request)
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Stock alert deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting stock alert:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ebec7924-8e60-572e-ab7f-c74eb4c977f1")}catch(e){}}();
//# sourceMappingURL=%5Broot-of-the-server%5D__41aac5d5._.js.map
//# debugId=ebec7924-8e60-572e-ab7f-c74eb4c977f1
