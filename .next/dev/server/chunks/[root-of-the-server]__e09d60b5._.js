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
"[project]/src/app/api/admin/inventory/reports/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$next$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/next/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/permissions.ts [app-route] (ecmascript)");
;
;
;
;
;
async function GET(request) {
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
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasPermission"])(session.user.role, 'INVENTORY', 'VIEW') || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasPermission"])(session.user.role, 'ANALYTICS', 'VIEW')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Insufficient permissions'
            }, {
                status: 403
            });
        }
        // Parse query parameters
        const searchParams = request.nextUrl.searchParams;
        const reportType = searchParams.get('type') || 'current-stock';
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const categoryId = searchParams.get('categoryId');
        let reportData = {};
        switch(reportType){
            case 'current-stock':
                {
                    // Current Stock Report
                    const where = {};
                    if (categoryId) {
                        where.categoryId = categoryId;
                    }
                    const products = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
                        where,
                        include: {
                            category: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            variants: {
                                select: {
                                    id: true,
                                    sku: true,
                                    stock: true,
                                    price: true,
                                    optionValues: true
                                }
                            },
                            stockAlert: true
                        },
                        orderBy: {
                            name: 'asc'
                        }
                    });
                    const summary = {
                        totalProducts: products.length,
                        totalStock: products.reduce((sum, p)=>sum + p.stock, 0),
                        totalVariants: products.reduce((sum, p)=>sum + p.variants.length, 0),
                        totalVariantStock: products.reduce((sum, p)=>sum + p.variants.reduce((vs, v)=>vs + v.stock, 0), 0),
                        productsInStock: products.filter((p)=>p.stock > 0).length,
                        productsOutOfStock: products.filter((p)=>p.stock === 0).length,
                        productsLowStock: products.filter((p)=>p.stockAlert && p.stock <= p.stockAlert.threshold).length
                    };
                    reportData = {
                        type: 'current-stock',
                        summary,
                        products: products.map((p)=>({
                                id: p.id,
                                name: p.name,
                                sku: p.sku,
                                stock: p.stock,
                                category: p.category?.name,
                                variants: p.variants,
                                hasLowStock: p.stockAlert ? p.stock <= p.stockAlert.threshold : false,
                                threshold: p.stockAlert?.threshold
                            }))
                    };
                    break;
                }
            case 'low-stock':
                {
                    // Low Stock Report
                    const defaultThreshold = 10;
                    const productsWithAlerts = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
                        where: {
                            stockAlert: {
                                isNot: null
                            }
                        },
                        include: {
                            stockAlert: true,
                            category: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            variants: {
                                select: {
                                    id: true,
                                    sku: true,
                                    stock: true,
                                    optionValues: true
                                }
                            }
                        }
                    });
                    const lowStockProducts = productsWithAlerts.filter((p)=>p.stock <= (p.stockAlert?.threshold || defaultThreshold));
                    const productsWithoutAlerts = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
                        where: {
                            stockAlert: null,
                            stock: {
                                lte: defaultThreshold
                            }
                        },
                        include: {
                            stockAlert: true,
                            category: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    });
                    const allLowStock = [
                        ...lowStockProducts,
                        ...productsWithoutAlerts
                    ].sort((a, b)=>a.stock - b.stock);
                    reportData = {
                        type: 'low-stock',
                        summary: {
                            totalLowStock: allLowStock.length,
                            criticalStock: allLowStock.filter((p)=>p.stock === 0).length,
                            needsReorder: allLowStock.filter((p)=>p.stock > 0).length
                        },
                        products: allLowStock.map((p)=>({
                                id: p.id,
                                name: p.name,
                                sku: p.sku,
                                stock: p.stock,
                                threshold: p.stockAlert?.threshold || defaultThreshold,
                                belowBy: (p.stockAlert?.threshold || defaultThreshold) - p.stock,
                                category: p.category?.name
                            }))
                    };
                    break;
                }
            case 'valuation':
                {
                    // Inventory Valuation Report
                    const products = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
                        include: {
                            category: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            variants: {
                                select: {
                                    stock: true,
                                    price: true
                                }
                            }
                        }
                    });
                    let totalValue = 0;
                    const valuationData = products.map((p)=>{
                        const productValue = p.stock * p.price.toNumber();
                        const variantsValue = p.variants.reduce((sum, v)=>sum + v.stock * (v.price?.toNumber() || p.price.toNumber()), 0);
                        const totalProductValue = productValue + variantsValue;
                        totalValue += totalProductValue;
                        return {
                            id: p.id,
                            name: p.name,
                            sku: p.sku,
                            stock: p.stock,
                            price: p.price.toNumber(),
                            productValue,
                            variantsValue,
                            totalValue: totalProductValue,
                            category: p.category?.name
                        };
                    });
                    reportData = {
                        type: 'valuation',
                        summary: {
                            totalProducts: products.length,
                            totalInventoryValue: totalValue,
                            averageProductValue: totalValue / (products.length || 1)
                        },
                        products: valuationData.sort((a, b)=>b.totalValue - a.totalValue)
                    };
                    break;
                }
            case 'movement':
                {
                    // Stock Movement Report
                    const where = {};
                    if (startDate || endDate) {
                        where.createdAt = {};
                        if (startDate) {
                            where.createdAt.gte = new Date(startDate);
                        }
                        if (endDate) {
                            where.createdAt.lte = new Date(endDate);
                        }
                    } else {
                        // Default to last 30 days
                        where.createdAt = {
                            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                        };
                    }
                    const stockHistory = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].stockHistory.findMany({
                        where,
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    sku: true
                                }
                            },
                            supplier: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true
                                }
                            }
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    });
                    // Calculate summary by change type
                    const byChangeType = {};
                    stockHistory.forEach((h)=>{
                        if (!byChangeType[h.changeType]) {
                            byChangeType[h.changeType] = {
                                count: 0,
                                totalChange: 0
                            };
                        }
                        byChangeType[h.changeType].count++;
                        byChangeType[h.changeType].totalChange += h.quantityChange;
                    });
                    // Group by date for chart data
                    const byDate = {};
                    stockHistory.forEach((h)=>{
                        const date = h.createdAt.toISOString().split('T')[0];
                        if (!byDate[date]) {
                            byDate[date] = {
                                in: 0,
                                out: 0
                            };
                        }
                        if (h.quantityChange > 0) {
                            byDate[date].in += h.quantityChange;
                        } else {
                            byDate[date].out += Math.abs(h.quantityChange);
                        }
                    });
                    reportData = {
                        type: 'movement',
                        period: {
                            startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                            endDate: endDate || new Date().toISOString()
                        },
                        summary: {
                            totalMovements: stockHistory.length,
                            byChangeType,
                            totalStockIn: stockHistory.filter((h)=>h.quantityChange > 0).reduce((sum, h)=>sum + h.quantityChange, 0),
                            totalStockOut: Math.abs(stockHistory.filter((h)=>h.quantityChange < 0).reduce((sum, h)=>sum + h.quantityChange, 0))
                        },
                        chartData: Object.entries(byDate).map(([date, data])=>({
                                date,
                                ...data
                            })).sort((a, b)=>a.date.localeCompare(b.date)),
                        movements: stockHistory.slice(0, 100)
                    };
                    break;
                }
            case 'dashboard':
                {
                    // Dashboard Report - Aggregate data for the main inventory dashboard
                    const defaultThreshold = 10;
                    // Get all products with comprehensive data
                    const products = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
                        include: {
                            category: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            variants: {
                                select: {
                                    id: true,
                                    stock: true,
                                    price: true
                                }
                            },
                            stockAlert: true
                        }
                    });
                    // Calculate summary statistics
                    const totalProducts = products.length;
                    const totalStock = products.reduce((sum, p)=>sum + p.stock, 0);
                    const lowStockProducts = products.filter((p)=>p.stockAlert ? p.stock <= p.stockAlert.threshold : p.stock <= defaultThreshold);
                    const lowStockCount = lowStockProducts.length;
                    const outOfStockCount = products.filter((p)=>p.stock === 0).length;
                    // Calculate total inventory value
                    const inventoryValue = products.reduce((sum, p)=>{
                        const productValue = p.stock * p.price.toNumber();
                        const variantsValue = p.variants.reduce((vSum, v)=>vSum + v.stock * (v.price?.toNumber() || p.price.toNumber()), 0);
                        return sum + productValue + variantsValue;
                    }, 0);
                    // Get recent stock changes (last 10)
                    const recentChanges = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].stockHistory.findMany({
                        take: 10,
                        orderBy: {
                            createdAt: 'desc'
                        },
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    sku: true
                                }
                            },
                            user: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    });
                    // Get stock trend data (last 30 days)
                    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                    const stockMovements = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].stockHistory.findMany({
                        where: {
                            createdAt: {
                                gte: thirtyDaysAgo
                            }
                        },
                        select: {
                            createdAt: true,
                            quantityChange: true
                        },
                        orderBy: {
                            createdAt: 'asc'
                        }
                    });
                    // Group by date for trend chart
                    const trendByDate = {};
                    stockMovements.forEach((h)=>{
                        const date = h.createdAt.toISOString().split('T')[0];
                        if (!trendByDate[date]) {
                            trendByDate[date] = {
                                in: 0,
                                out: 0
                            };
                        }
                        if (h.quantityChange > 0) {
                            trendByDate[date].in += h.quantityChange;
                        } else {
                            trendByDate[date].out += Math.abs(h.quantityChange);
                        }
                    });
                    // Stock by category
                    const stockByCategory = {};
                    products.forEach((p)=>{
                        const categoryName = p.category?.name || 'Uncategorized';
                        if (!stockByCategory[categoryName]) {
                            stockByCategory[categoryName] = {
                                products: 0,
                                totalStock: 0,
                                value: 0
                            };
                        }
                        stockByCategory[categoryName].products++;
                        stockByCategory[categoryName].totalStock += p.stock;
                        stockByCategory[categoryName].value += p.stock * p.price.toNumber();
                    });
                    reportData = {
                        type: 'dashboard',
                        summary: {
                            totalProducts,
                            totalStock,
                            lowStockCount,
                            outOfStockCount,
                            inventoryValue: Math.round(inventoryValue * 100) / 100
                        },
                        recentChanges: recentChanges.map((change)=>({
                                id: change.id,
                                productId: change.productId,
                                productName: change.product.name,
                                productSku: change.product.sku,
                                changeType: change.changeType,
                                quantityBefore: change.quantityBefore,
                                quantityAfter: change.quantityAfter,
                                quantityChange: change.quantityChange,
                                createdAt: change.createdAt,
                                createdBy: change.user?.name || 'System'
                            })),
                        lowStockAlerts: lowStockProducts.slice(0, 10).map((p)=>({
                                id: p.id,
                                name: p.name,
                                sku: p.sku,
                                slug: p.slug,
                                stock: p.stock,
                                stockAlert: p.stockAlert ? {
                                    threshold: p.stockAlert.threshold
                                } : null,
                                category: p.category?.name
                            })),
                        stockTrend: Object.entries(trendByDate).map(([date, data])=>({
                                date,
                                ...data
                            })).sort((a, b)=>a.date.localeCompare(b.date)),
                        stockByCategory: Object.entries(stockByCategory).map(([category, data])=>({
                                category,
                                ...data
                            })).sort((a, b)=>b.totalStock - a.totalStock)
                    };
                    break;
                }
            default:
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'Invalid report type'
                    }, {
                        status: 400
                    });
                }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            report: reportData,
            generatedAt: new Date().toISOString(),
            generatedBy: {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email
            }
        });
    } catch (error) {
        console.error('Error generating inventory report:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="bea4b1f8-f76e-54ae-b3af-0ae96627f790")}catch(e){}}();
//# sourceMappingURL=%5Broot-of-the-server%5D__e09d60b5._.js.map
//# debugId=bea4b1f8-f76e-54ae-b3af-0ae96627f790
