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
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[project]/src/lib/cloudinary.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteFromCloudinary",
    ()=>deleteFromCloudinary,
    "uploadToCloudinary",
    ()=>uploadToCloudinary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cloudinary/cloudinary.js [app-route] (ecmascript)");
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].config({
    cloud_name: ("TURBOPACK compile-time value", "dt4eburuq"),
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"];
const uploadToCloudinary = async (file, folder = 'ecommerce/products')=>{
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return new Promise((resolve, reject)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].uploader.upload_stream({
            folder: folder,
            resource_type: 'auto'
        }, (error, result)=>{
            if (error) reject(error);
            else resolve(result);
        }).end(buffer);
    });
};
const deleteFromCloudinary = async (publicId)=>{
    await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].uploader.destroy(publicId);
};
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
"[project]/src/lib/export-utils.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Export/Import utility functions
 * Handles CSV, JSON, and data transformation
 */ __turbopack_context__.s([
    "CATEGORY_EXPORT_COLUMNS",
    ()=>CATEGORY_EXPORT_COLUMNS,
    "CUSTOMER_EXPORT_COLUMNS",
    ()=>CUSTOMER_EXPORT_COLUMNS,
    "INVENTORY_EXPORT_COLUMNS",
    ()=>INVENTORY_EXPORT_COLUMNS,
    "ORDER_EXPORT_COLUMNS",
    ()=>ORDER_EXPORT_COLUMNS,
    "PRODUCT_EXPORT_COLUMNS",
    ()=>PRODUCT_EXPORT_COLUMNS,
    "convertToCSV",
    ()=>convertToCSV,
    "getExportColumns",
    ()=>getExportColumns,
    "parseCSV",
    ()=>parseCSV,
    "validateCustomerRow",
    ()=>validateCustomerRow,
    "validateImportData",
    ()=>validateImportData,
    "validateOrderRow",
    ()=>validateOrderRow,
    "validateProductRow",
    ()=>validateProductRow
]);
function convertToCSV(data, columns) {
    if (!data || data.length === 0) {
        return columns.map((col)=>col.header).join(',') + '\n';
    }
    // Headers
    const headers = columns.map((col)=>col.header).join(',');
    // Rows
    const rows = data.map((row)=>{
        return columns.map((col)=>{
            let value = row[col.key];
            // Apply transform if provided
            if (col.transform) {
                value = col.transform(value, row);
            }
            // Handle different data types
            if (value === null || value === undefined) {
                return '';
            }
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            // Escape CSV special characters
            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        }).join(',');
    });
    return headers + '\n' + rows.join('\n');
}
function parseCSV(csvString) {
    const lines = csvString.split('\n').filter((line)=>line.trim());
    if (lines.length === 0) {
        return [];
    }
    // Parse headers
    const headers = parseCSVLine(lines[0]);
    // Parse rows
    const data = [];
    for(let i = 1; i < lines.length; i++){
        const values = parseCSVLine(lines[i]);
        const row = {};
        headers.forEach((header, index)=>{
            row[header] = values[index] || '';
        });
        data.push(row);
    }
    return data;
}
/**
 * Parse a single CSV line handling quotes
 */ function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for(let i = 0; i < line.length; i++){
        const char = line[i];
        const nextChar = line[i + 1];
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                current += '"';
                i++; // Skip next quote
            } else {
                // Toggle quotes
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // End of field
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    // Add last field
    result.push(current.trim());
    return result;
}
const PRODUCT_EXPORT_COLUMNS = [
    {
        key: 'sku',
        header: 'SKU'
    },
    {
        key: 'name',
        header: 'Name'
    },
    {
        key: 'price',
        header: 'Price'
    },
    {
        key: 'comparePrice',
        header: 'Compare Price'
    },
    {
        key: 'stock',
        header: 'Stock'
    },
    {
        key: 'category',
        header: 'Category',
        transform: (value)=>value?.name || ''
    },
    {
        key: 'published',
        header: 'Published',
        transform: (value)=>value ? 'Yes' : 'No'
    },
    {
        key: 'featured',
        header: 'Featured',
        transform: (value)=>value ? 'Yes' : 'No'
    },
    {
        key: 'description',
        header: 'Description'
    },
    {
        key: 'createdAt',
        header: 'Created At',
        transform: (value)=>new Date(value).toISOString()
    }
];
const ORDER_EXPORT_COLUMNS = [
    {
        key: 'orderNumber',
        header: 'Order Number'
    },
    {
        key: 'createdAt',
        header: 'Date',
        transform: (value)=>new Date(value).toISOString()
    },
    {
        key: 'user',
        header: 'Customer Email',
        transform: (value, row)=>value?.email || row.guestEmail || ''
    },
    {
        key: 'status',
        header: 'Status'
    },
    {
        key: 'paymentStatus',
        header: 'Payment Status'
    },
    {
        key: 'total',
        header: 'Total'
    },
    {
        key: 'items',
        header: 'Items',
        transform: (value)=>value?.length || 0
    },
    {
        key: 'trackingNumber',
        header: 'Tracking Number'
    }
];
const CUSTOMER_EXPORT_COLUMNS = [
    {
        key: 'email',
        header: 'Email'
    },
    {
        key: 'name',
        header: 'Name'
    },
    {
        key: 'orders',
        header: 'Total Orders',
        transform: (value)=>value?.length || 0
    },
    {
        key: 'orders',
        header: 'Total Spent',
        transform: (value)=>value?.reduce((sum, order)=>sum + Number(order.total), 0) || 0
    },
    {
        key: 'createdAt',
        header: 'Created At',
        transform: (value)=>new Date(value).toISOString()
    },
    {
        key: 'emailVerified',
        header: 'Email Verified',
        transform: (value)=>value ? 'Yes' : 'No'
    }
];
const CATEGORY_EXPORT_COLUMNS = [
    {
        key: 'name',
        header: 'Name'
    },
    {
        key: 'slug',
        header: 'Slug'
    },
    {
        key: 'description',
        header: 'Description'
    },
    {
        key: 'parent',
        header: 'Parent Category',
        transform: (value)=>value?.name || ''
    },
    {
        key: 'products',
        header: 'Product Count',
        transform: (value)=>value?.length || 0
    }
];
const INVENTORY_EXPORT_COLUMNS = [
    {
        key: 'sku',
        header: 'SKU'
    },
    {
        key: 'name',
        header: 'Product Name'
    },
    {
        key: 'stock',
        header: 'Current Stock'
    },
    {
        key: 'stockAlert',
        header: 'Alert Threshold',
        transform: (value)=>value?.threshold || ''
    },
    {
        key: 'category',
        header: 'Category',
        transform: (value)=>value?.name || ''
    },
    {
        key: 'price',
        header: 'Price'
    },
    {
        key: 'updatedAt',
        header: 'Last Updated',
        transform: (value)=>new Date(value).toISOString()
    }
];
function getExportColumns(type) {
    switch(type){
        case 'PRODUCTS':
            return PRODUCT_EXPORT_COLUMNS;
        case 'ORDERS':
            return ORDER_EXPORT_COLUMNS;
        case 'CUSTOMERS':
            return CUSTOMER_EXPORT_COLUMNS;
        case 'CATEGORIES':
            return CATEGORY_EXPORT_COLUMNS;
        case 'INVENTORY':
            return INVENTORY_EXPORT_COLUMNS;
        default:
            return [];
    }
}
function validateProductRow(row, rowNumber) {
    const errors = [];
    if (!row.SKU || !row.SKU.trim()) {
        errors.push(`Row ${rowNumber}: SKU is required`);
    }
    if (!row.Name || !row.Name.trim()) {
        errors.push(`Row ${rowNumber}: Name is required`);
    }
    if (!row.Price || isNaN(Number(row.Price))) {
        errors.push(`Row ${rowNumber}: Valid price is required`);
    }
    if (!row.Stock || isNaN(Number(row.Stock))) {
        errors.push(`Row ${rowNumber}: Valid stock quantity is required`);
    }
    return errors;
}
function validateOrderRow(row, rowNumber) {
    const errors = [];
    if (!row['Order Number'] || !row['Order Number'].trim()) {
        errors.push(`Row ${rowNumber}: Order Number is required`);
    }
    if (!row['Customer Email'] || !row['Customer Email'].trim()) {
        errors.push(`Row ${rowNumber}: Customer Email is required`);
    }
    if (!row.Total || isNaN(Number(row.Total))) {
        errors.push(`Row ${rowNumber}: Valid total is required`);
    }
    return errors;
}
function validateCustomerRow(row, rowNumber) {
    const errors = [];
    if (!row.Email || !row.Email.trim()) {
        errors.push(`Row ${rowNumber}: Email is required`);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.Email)) {
        errors.push(`Row ${rowNumber}: Invalid email format`);
    }
    if (!row.Name || !row.Name.trim()) {
        errors.push(`Row ${rowNumber}: Name is required`);
    }
    return errors;
}
function validateImportData(type, data) {
    const errors = [];
    data.forEach((row, index)=>{
        const rowNumber = index + 2 // +2 because index starts at 0 and we skip header
        ;
        switch(type){
            case 'PRODUCTS':
                errors.push(...validateProductRow(row, rowNumber));
                break;
            case 'ORDERS':
                errors.push(...validateOrderRow(row, rowNumber));
                break;
            case 'CUSTOMERS':
                errors.push(...validateCustomerRow(row, rowNumber));
                break;
        }
    });
    return {
        valid: errors.length === 0,
        errors
    };
}
}),
"[project]/src/app/api/admin/export/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$next$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/next/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloudinary$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cloudinary.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$activity$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/activity-log.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$export$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/export-utils.ts [app-route] (ecmascript)");
;
;
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
        // Check if user is ADMIN or SUPERADMIN
        if (![
            'ADMIN',
            'SUPERADMIN'
        ].includes(session.user.role)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Insufficient permissions'
            }, {
                status: 403
            });
        }
        // Parse query parameters
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const type = searchParams.get('type');
        const status = searchParams.get('status');
        // Build where clause
        const where = {};
        if (type) {
            where.type = type;
        }
        if (status) {
            where.status = status;
        }
        // Get exports with pagination
        const [exports, total] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dataExport.findMany({
                where,
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: (page - 1) * limit,
                take: limit
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dataExport.count({
                where
            })
        ]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            exports,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error fetching exports:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
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
        // Check if user is ADMIN or SUPERADMIN
        if (![
            'ADMIN',
            'SUPERADMIN'
        ].includes(session.user.role)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Insufficient permissions'
            }, {
                status: 403
            });
        }
        // Parse request body
        const body = await request.json();
        const { type, format = 'CSV', filters = {} } = body;
        // Validate type
        const validTypes = [
            'PRODUCTS',
            'ORDERS',
            'CUSTOMERS',
            'CATEGORIES',
            'INVENTORY'
        ];
        if (!type || !validTypes.includes(type)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid export type'
            }, {
                status: 400
            });
        }
        // Validate format
        const validFormats = [
            'CSV',
            'JSON'
        ];
        if (!validFormats.includes(format)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid format. Supported: CSV, JSON'
            }, {
                status: 400
            });
        }
        // Create export record
        const dataExport = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dataExport.create({
            data: {
                type,
                format,
                status: 'IN_PROGRESS',
                filters: JSON.stringify(filters),
                createdById: session.user.id
            }
        });
        // Log activity
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$activity$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logActivity"])({
            userId: session.user.id,
            action: 'CREATE',
            resource: 'DATA_EXPORT',
            resourceId: dataExport.id,
            details: `Started ${type} export in ${format} format`,
            ipAddress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$activity$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getClientIp"])(request),
            userAgent: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$activity$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserAgent"])(request)
        });
        // Generate export asynchronously
        setImmediate(async ()=>{
            try {
                let data = [];
                let recordCount = 0;
                // Fetch data based on type
                switch(type){
                    case 'PRODUCTS':
                        data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
                            include: {
                                category: true,
                                images: true
                            },
                            where: filters.categoryId ? {
                                categoryId: filters.categoryId
                            } : undefined
                        });
                        recordCount = data.length;
                        break;
                    case 'ORDERS':
                        const orderWhere = {};
                        if (filters.status) {
                            orderWhere.status = filters.status;
                        }
                        if (filters.startDate) {
                            orderWhere.createdAt = {
                                gte: new Date(filters.startDate)
                            };
                        }
                        if (filters.endDate) {
                            orderWhere.createdAt = {
                                ...orderWhere.createdAt,
                                lte: new Date(filters.endDate)
                            };
                        }
                        data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.findMany({
                            where: orderWhere,
                            include: {
                                user: {
                                    select: {
                                        email: true,
                                        name: true
                                    }
                                },
                                items: true
                            }
                        });
                        recordCount = data.length;
                        break;
                    case 'CUSTOMERS':
                        data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findMany({
                            where: {
                                role: 'CUSTOMER'
                            },
                            include: {
                                orders: {
                                    select: {
                                        total: true
                                    }
                                }
                            }
                        });
                        recordCount = data.length;
                        break;
                    case 'CATEGORIES':
                        data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].category.findMany({
                            include: {
                                parent: true,
                                products: true
                            }
                        });
                        recordCount = data.length;
                        break;
                    case 'INVENTORY':
                        data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
                            include: {
                                category: true,
                                stockAlert: true
                            },
                            where: filters.lowStock ? {
                                stock: {
                                    lt: 10
                                }
                            } : undefined
                        });
                        recordCount = data.length;
                        break;
                }
                // Generate file based on format
                let fileContent;
                let mimeType;
                let fileExtension;
                if (format === 'CSV') {
                    const columns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$export$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getExportColumns"])(type);
                    fileContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$export$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["convertToCSV"])(data, columns);
                    mimeType = 'text/csv';
                    fileExtension = 'csv';
                } else {
                    // JSON
                    fileContent = JSON.stringify(data, null, 2);
                    mimeType = 'application/json';
                    fileExtension = 'json';
                }
                const filename = `export-${type.toLowerCase()}-${Date.now()}.${fileExtension}`;
                const fileSize = Buffer.byteLength(fileContent, 'utf8');
                // Upload to Cloudinary
                const uploadResult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloudinary$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].uploader.upload(`data:${mimeType};base64,${Buffer.from(fileContent).toString('base64')}`, {
                    folder: 'ecommerce/exports',
                    resource_type: 'raw',
                    public_id: `export-${dataExport.id}`,
                    format: fileExtension
                });
                // Update export record
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dataExport.update({
                    where: {
                        id: dataExport.id
                    },
                    data: {
                        status: 'COMPLETED',
                        filename,
                        fileUrl: uploadResult.secure_url,
                        fileSize,
                        recordCount,
                        completedAt: new Date(),
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    }
                });
                console.log(`Export ${dataExport.id} completed successfully`);
            } catch (error) {
                console.error(`Error generating export ${dataExport.id}:`, error);
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dataExport.update({
                    where: {
                        id: dataExport.id
                    },
                    data: {
                        status: 'FAILED',
                        errorMessage: error instanceof Error ? error.message : 'Unknown error'
                    }
                });
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            export: {
                id: dataExport.id,
                status: dataExport.status,
                message: 'Export started. Check status at /api/admin/export/' + dataExport.id
            }
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Error creating export:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="efbfc882-a472-5224-aaad-07efb5ebb782")}catch(e){}}();
//# sourceMappingURL=%5Broot-of-the-server%5D__edb35df4._.js.map
//# debugId=efbfc882-a472-5224-aaad-07efb5ebb782
