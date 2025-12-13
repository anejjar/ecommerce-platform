module.exports = [
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/admin/(protected)/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/admin/(protected)/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/lib/permissions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/components/admin/ActivityLogViewer.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/admin/ActivityLogViewer.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/admin/ActivityLogViewer.tsx <module evaluation>", "default");
}),
"[project]/src/components/admin/ActivityLogViewer.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/admin/ActivityLogViewer.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/admin/ActivityLogViewer.tsx", "default");
}),
"[project]/src/components/admin/ActivityLogViewer.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$ActivityLogViewer$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/admin/ActivityLogViewer.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$ActivityLogViewer$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/admin/ActivityLogViewer.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$ActivityLogViewer$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/admin/(protected)/activity-logs/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ActivityLogsPage,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$next$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/next/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/permissions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$ActivityLogViewer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/ActivityLogViewer.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
const metadata = {
    title: 'Activity Logs - Admin',
    description: 'View admin activity logs and audit trail'
};
async function ActivityLogsPage() {
    // Check authentication
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$next$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
    if (!session?.user) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/admin/login');
    }
    // Check permissions - only users with ADMIN_USER:VIEW can see activity logs
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hasPermission"])(session.user.role, 'ADMIN_USER', 'VIEW')) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold",
                        children: "Activity Logs"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/(protected)/activity-logs/page.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground mt-2",
                        children: "View and monitor all administrative actions and changes"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/(protected)/activity-logs/page.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/(protected)/activity-logs/page.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$ActivityLogViewer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/admin/(protected)/activity-logs/page.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/(protected)/activity-logs/page.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/admin/(protected)/activity-logs/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/admin/(protected)/activity-logs/page.tsx [app-rsc] (ecmascript)"));
}),
];

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="2ce6f04a-d22a-5373-8bd7-c45bea9792bd")}catch(e){}}();
//# sourceMappingURL=%5Broot-of-the-server%5D__81695270._.js.map
//# debugId=2ce6f04a-d22a-5373-8bd7-c45bea9792bd
