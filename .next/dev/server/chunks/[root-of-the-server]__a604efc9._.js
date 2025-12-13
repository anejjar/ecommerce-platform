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
"[externals]/worker_threads [external] (worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("worker_threads", () => require("worker_threads"));

module.exports = mod;
}),
"[project]/src/lib/formatting.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Localized formatting utilities for currency, dates, and numbers
 */ /**
 * Format currency based on locale
 */ __turbopack_context__.s([
    "formatCompactNumber",
    ()=>formatCompactNumber,
    "formatCurrency",
    ()=>formatCurrency,
    "formatCurrencyWithSymbol",
    ()=>formatCurrencyWithSymbol,
    "formatCurrencyWithSymbolNoDecimals",
    ()=>formatCurrencyWithSymbolNoDecimals,
    "formatDate",
    ()=>formatDate,
    "formatDateTime",
    ()=>formatDateTime,
    "formatFileSize",
    ()=>formatFileSize,
    "formatList",
    ()=>formatList,
    "formatNumber",
    ()=>formatNumber,
    "formatPercentage",
    ()=>formatPercentage,
    "formatRelativeTime",
    ()=>formatRelativeTime,
    "getCurrencySymbol",
    ()=>getCurrencySymbol,
    "getLocaleConfig",
    ()=>getLocaleConfig,
    "localeConfigs",
    ()=>localeConfigs
]);
function formatCurrency(amount, locale = 'en', currency = 'USD') {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency
        }).format(numAmount);
    } catch (error) {
        // Fallback to USD if currency not supported
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'USD'
        }).format(numAmount);
    }
}
function formatDate(date, locale = 'en', options) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
    };
    return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
}
function formatDateTime(date, locale = 'en', options) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        ...options
    };
    return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
}
function formatNumber(number, locale = 'en', options) {
    const num = typeof number === 'string' ? parseFloat(number) : number;
    return new Intl.NumberFormat(locale, options).format(num);
}
function formatPercentage(value, locale = 'en', decimals = 0) {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(num / 100);
}
function formatRelativeTime(date, locale = 'en') {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    const rtf = new Intl.RelativeTimeFormat(locale, {
        numeric: 'auto'
    });
    const intervals = [
        {
            unit: 'year',
            seconds: 31536000
        },
        {
            unit: 'month',
            seconds: 2592000
        },
        {
            unit: 'week',
            seconds: 604800
        },
        {
            unit: 'day',
            seconds: 86400
        },
        {
            unit: 'hour',
            seconds: 3600
        },
        {
            unit: 'minute',
            seconds: 60
        },
        {
            unit: 'second',
            seconds: 1
        }
    ];
    for (const interval of intervals){
        const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
        if (count >= 1) {
            return rtf.format(diffInSeconds > 0 ? -count : count, interval.unit);
        }
    }
    return rtf.format(0, 'second');
}
function formatFileSize(bytes, locale = 'en', decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = [
        'Bytes',
        'KB',
        'MB',
        'GB',
        'TB'
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = bytes / Math.pow(k, i);
    const formatted = formatNumber(value, locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
    return `${formatted} ${sizes[i]}`;
}
function getCurrencySymbol(locale = 'en', currency = 'USD') {
    const formatted = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(0);
    // Extract symbol by removing the number
    return formatted.replace(/\d/g, '').trim();
}
function formatCurrencyWithSymbol(amount, symbol = '$', locale = 'en-US') {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) {
        return `${symbol}0.00`;
    }
    // Format the number with locale-specific formatting
    const formatted = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numAmount);
    return `${symbol}${formatted}`;
}
function formatCurrencyWithSymbolNoDecimals(amount, symbol = '$', locale = 'en-US') {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) {
        return `${symbol}0`;
    }
    // Format the number with locale-specific formatting
    const formatted = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numAmount);
    return `${symbol}${formatted}`;
}
function formatList(items, locale = 'en', type = 'conjunction') {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    const formatter = new Intl.ListFormat(locale, {
        style: 'long',
        type
    });
    return formatter.format(items);
}
function formatCompactNumber(number, locale = 'en') {
    const num = typeof number === 'string' ? parseFloat(number) : number;
    return new Intl.NumberFormat(locale, {
        notation: 'compact',
        compactDisplay: 'short'
    }).format(num);
}
const localeConfigs = {
    en: {
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h'
    },
    fr: {
        currency: 'EUR',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h'
    }
};
function getLocaleConfig(locale) {
    return localeConfigs[locale] || localeConfigs.en;
}
}),
"[project]/src/lib/invoice-generator.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateInvoice",
    ()=>generateInvoice,
    "generateInvoicePDF",
    ()=>generateInvoicePDF,
    "generatePackingSlip",
    ()=>generatePackingSlip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$node$2e$min$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf/dist/jspdf.node.min.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatting$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/formatting.ts [app-route] (ecmascript)");
;
;
;
// Helper function to get currency symbol from settings
const getCurrencySymbol = async ()=>{
    try {
        const response = await fetch('/api/settings?category=general');
        if (response.ok) {
            const data = await response.json();
            return data.general_currency_symbol || '$';
        }
    } catch (error) {
        console.error('Error fetching currency symbol:', error);
    }
    return '$';
};
// Helper function to format currency with symbol from settings
const formatCurrency = async (amount, symbol)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatting$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatCurrencyWithSymbol"])(amount, symbol);
};
// Helper function to format date
const formatDate = (date)=>{
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
// Helper function to format address
const formatAddress = (address)=>{
    if (!address) return 'N/A';
    const lines = [
        `${address.firstName} ${address.lastName}`,
        address.company || '',
        address.address1,
        address.address2 || '',
        `${address.city}, ${address.state || ''} ${address.postalCode}`,
        address.country,
        address.phone || ''
    ].filter((line)=>line.trim() !== '');
    return lines.join('\n');
};
const generateInvoice = async (order)=>{
    const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$node$2e$min$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]();
    const currencySymbol = await getCurrencySymbol();
    // Header
    doc.setFontSize(24);
    doc.text('INVOICE', 105, 20, {
        align: 'center'
    });
    // Order info
    doc.setFontSize(12);
    doc.text(`Order Number: ${order.orderNumber}`, 20, 40);
    doc.text(`Date: ${formatDate(order.createdAt)}`, 20, 47);
    doc.text(`Status: ${order.status}`, 20, 54);
    // Customer info
    doc.setFontSize(10);
    doc.text('Bill To:', 20, 70);
    const billingText = formatAddress(order.billingAddress);
    doc.text(billingText, 20, 77);
    doc.text('Ship To:', 110, 70);
    const shippingText = formatAddress(order.shippingAddress);
    doc.text(shippingText, 110, 77);
    // Items table
    const tableData = await Promise.all(order.items.map(async (item)=>[
            item.product.name,
            item.product.sku || item.variant?.sku || '-',
            item.quantity.toString(),
            await formatCurrency(item.price, currencySymbol),
            await formatCurrency(item.total, currencySymbol)
        ]));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(doc, {
        startY: 120,
        head: [
            [
                'Product',
                'SKU',
                'Qty',
                'Price',
                'Total'
            ]
        ],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: [
                66,
                66,
                66
            ]
        }
    });
    // Totals
    const finalY = doc.lastAutoTable.finalY || 120;
    doc.text(`Subtotal: ${await formatCurrency(order.subtotal, currencySymbol)}`, 150, finalY + 10);
    doc.text(`Tax: ${await formatCurrency(order.tax, currencySymbol)}`, 150, finalY + 17);
    doc.text(`Shipping: ${await formatCurrency(order.shipping, currencySymbol)}`, 150, finalY + 24);
    if (order.discountAmount) {
        doc.text(`Discount: -${await formatCurrency(order.discountAmount, currencySymbol)}`, 150, finalY + 31);
    }
    doc.setFontSize(14);
    doc.text(`Total: ${await formatCurrency(order.total, currencySymbol)}`, 150, finalY + (order.discountAmount ? 41 : 34));
    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for your business!', 105, 280, {
        align: 'center'
    });
    doc.save(`Invoice-${order.orderNumber}.pdf`);
};
const generatePackingSlip = async (order)=>{
    const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$node$2e$min$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]();
    // Header
    doc.setFontSize(24);
    doc.text('PACKING SLIP', 105, 20, {
        align: 'center'
    });
    // Order info
    doc.setFontSize(12);
    doc.text(`Order Number: ${order.orderNumber}`, 20, 40);
    doc.text(`Date: ${formatDate(order.createdAt)}`, 20, 47);
    // Shipping address
    doc.setFontSize(10);
    doc.text('Ship To:', 20, 65);
    const shippingText = formatAddress(order.shippingAddress);
    doc.text(shippingText, 20, 72);
    // Items table
    const tableData = order.items.map((item)=>[
            item.product.name,
            item.product.sku || item.variant?.sku || '-',
            item.quantity.toString(),
            '[ ]' // Checkbox for picked items
        ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(doc, {
        startY: 110,
        head: [
            [
                'Product',
                'SKU',
                'Quantity',
                'Picked'
            ]
        ],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: [
                66,
                66,
                66
            ]
        }
    });
    // Footer
    doc.setFontSize(10);
    doc.text('Please check contents against this slip.', 105, 280, {
        align: 'center'
    });
    doc.save(`PackingSlip-${order.orderNumber}.pdf`);
};
const generateInvoicePDF = async (invoice, template, settings)=>{
    const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$node$2e$min$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]();
    // Get settings defaults
    const primaryColor = settings?.primaryColor || '#000000';
    const secondaryColor = settings?.secondaryColor || '#666666';
    const accentColor = settings?.accentColor || '#3182ce';
    const fontFamily = settings?.fontFamily || 'Helvetica';
    const fontSize = settings?.fontSize || 10;
    const currencySymbol = invoice.currencySymbol || settings?.currencySymbol || '$';
    // Parse colors
    const parseColor = (color)=>{
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return [
            r,
            g,
            b
        ];
    };
    const primaryRGB = parseColor(primaryColor);
    const accentRGB = parseColor(accentColor);
    // Set font
    doc.setFont(fontFamily);
    doc.setFontSize(fontSize);
    let yPos = 20;
    // Header with logo
    if (settings?.logoUrl) {
        try {
            // Note: jsPDF doesn't directly support images from URLs in server-side
            // In production, you'd need to fetch and convert the image
            // For now, we'll just add space for the logo
            yPos += 20;
        } catch (error) {
            console.error('Error loading logo:', error);
        }
    }
    // Company information
    if (settings?.companyName) {
        doc.setFontSize(18);
        doc.setTextColor(...primaryRGB);
        doc.text(settings.companyName, 20, yPos);
        yPos += 8;
    }
    if (settings?.companyAddress) {
        doc.setFontSize(fontSize);
        doc.setTextColor(0, 0, 0);
        const addressLines = settings.companyAddress.split('\n');
        addressLines.forEach((line)=>{
            if (line.trim()) {
                doc.text(line, 20, yPos);
                yPos += 5;
            }
        });
    }
    if (settings?.companyPhone || settings?.companyEmail || settings?.companyWebsite) {
        yPos += 2;
        if (settings.companyPhone) {
            doc.text(`Phone: ${settings.companyPhone}`, 20, yPos);
            yPos += 5;
        }
        if (settings.companyEmail) {
            doc.text(`Email: ${settings.companyEmail}`, 20, yPos);
            yPos += 5;
        }
        if (settings.companyWebsite) {
            doc.text(`Website: ${settings.companyWebsite}`, 20, yPos);
            yPos += 5;
        }
    }
    // Invoice title and number
    yPos = 20;
    doc.setFontSize(24);
    doc.setTextColor(...primaryRGB);
    doc.text('INVOICE', 150, yPos, {
        align: 'right'
    });
    yPos += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 150, yPos, {
        align: 'right'
    });
    yPos += 6;
    doc.text(`Date: ${formatDate(invoice.invoiceDate)}`, 150, yPos, {
        align: 'right'
    });
    if (invoice.dueDate) {
        yPos += 6;
        doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 150, yPos, {
            align: 'right'
        });
    }
    yPos += 6;
    doc.text(`Status: ${invoice.status}`, 150, yPos, {
        align: 'right'
    });
    // Customer information
    yPos = Math.max(yPos + 10, 80);
    doc.setFontSize(12);
    doc.setTextColor(...primaryRGB);
    doc.text('Bill To:', 20, yPos);
    yPos += 7;
    doc.setFontSize(fontSize);
    doc.setTextColor(0, 0, 0);
    if (invoice.customerName) {
        doc.text(invoice.customerName, 20, yPos);
        yPos += 5;
    }
    if (invoice.customerCompany) {
        doc.text(invoice.customerCompany, 20, yPos);
        yPos += 5;
    }
    if (invoice.customerEmail) {
        doc.text(invoice.customerEmail, 20, yPos);
        yPos += 5;
    }
    if (invoice.billingAddress) {
        const address = typeof invoice.billingAddress === 'string' ? JSON.parse(invoice.billingAddress) : invoice.billingAddress;
        if (address.address1) {
            doc.text(address.address1, 20, yPos);
            yPos += 5;
        }
        if (address.address2) {
            doc.text(address.address2, 20, yPos);
            yPos += 5;
        }
        if (address.city || address.state || address.postalCode) {
            const cityState = [
                address.city,
                address.state,
                address.postalCode
            ].filter(Boolean).join(', ');
            doc.text(cityState, 20, yPos);
            yPos += 5;
        }
        if (address.country) {
            doc.text(address.country, 20, yPos);
            yPos += 5;
        }
        if (address.phone) {
            doc.text(`Phone: ${address.phone}`, 20, yPos);
            yPos += 5;
        }
    }
    // Items table
    const startY = yPos + 10;
    const tableData = invoice.items?.map((item)=>[
            item.description || 'Item',
            item.sku || '-',
            item.quantity.toString(),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatting$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatCurrencyWithSymbol"])(item.unitPrice, currencySymbol),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatting$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatCurrencyWithSymbol"])(item.total, currencySymbol)
        ]) || [];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(doc, {
        startY,
        head: [
            [
                'Description',
                'SKU',
                'Qty',
                'Price',
                'Total'
            ]
        ],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: primaryRGB,
            textColor: [
                255,
                255,
                255
            ],
            fontStyle: 'bold'
        },
        styles: {
            fontSize: fontSize,
            font: fontFamily
        },
        alternateRowStyles: {
            fillColor: [
                245,
                245,
                245
            ]
        }
    });
    // Totals
    const finalY = doc.lastAutoTable.finalY || startY;
    let totalsY = finalY + 10;
    doc.setFontSize(fontSize);
    doc.setTextColor(0, 0, 0);
    // Subtotal
    doc.text('Subtotal:', 150, totalsY, {
        align: 'right'
    });
    doc.text((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatting$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatCurrencyWithSymbol"])(invoice.subtotal, currencySymbol), 190, totalsY, {
        align: 'right'
    });
    totalsY += 6;
    // Tax
    if (invoice.tax > 0) {
        const taxLabel = settings?.taxLabel || 'Tax';
        doc.text(`${taxLabel}:`, 150, totalsY, {
            align: 'right'
        });
        doc.text((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatting$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatCurrencyWithSymbol"])(invoice.tax, currencySymbol), 190, totalsY, {
            align: 'right'
        });
        totalsY += 6;
    }
    // Shipping
    if (invoice.shipping > 0) {
        doc.text('Shipping:', 150, totalsY, {
            align: 'right'
        });
        doc.text((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatting$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatCurrencyWithSymbol"])(invoice.shipping, currencySymbol), 190, totalsY, {
            align: 'right'
        });
        totalsY += 6;
    }
    // Discount
    if (invoice.discount > 0) {
        doc.text('Discount:', 150, totalsY, {
            align: 'right'
        });
        doc.text(`-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatting$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatCurrencyWithSymbol"])(invoice.discount, currencySymbol)}`, 190, totalsY, {
            align: 'right'
        });
        totalsY += 6;
    }
    // Total
    totalsY += 3;
    doc.setFontSize(14);
    doc.setTextColor(...primaryRGB);
    doc.setFont(fontFamily, 'bold');
    doc.text('Total:', 150, totalsY, {
        align: 'right'
    });
    doc.text((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatting$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatCurrencyWithSymbol"])(invoice.total, currencySymbol), 190, totalsY, {
        align: 'right'
    });
    // Payment information
    if (invoice.amountPaid > 0 || invoice.balanceDue > 0) {
        totalsY += 8;
        doc.setFontSize(fontSize);
        doc.setFont(fontFamily, 'normal');
        doc.setTextColor(0, 0, 0);
        if (invoice.amountPaid > 0) {
            doc.text('Amount Paid:', 150, totalsY, {
                align: 'right'
            });
            doc.text((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatting$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatCurrencyWithSymbol"])(invoice.amountPaid, currencySymbol), 190, totalsY, {
                align: 'right'
            });
            totalsY += 6;
        }
        if (invoice.balanceDue > 0) {
            doc.setFont(fontFamily, 'bold');
            doc.setTextColor(...accentRGB);
            doc.text('Balance Due:', 150, totalsY, {
                align: 'right'
            });
            doc.text((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatting$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatCurrencyWithSymbol"])(invoice.balanceDue, currencySymbol), 190, totalsY, {
                align: 'right'
            });
        }
    }
    // Terms and conditions
    if (invoice.termsAndConditions || settings?.defaultTerms) {
        totalsY += 15;
        doc.setFontSize(fontSize - 1);
        doc.setTextColor(0, 0, 0);
        doc.setFont(fontFamily, 'normal');
        const terms = invoice.termsAndConditions || settings?.defaultTerms || '';
        const termsLines = doc.splitTextToSize(terms, 170);
        doc.text('Terms & Conditions:', 20, totalsY);
        totalsY += 6;
        doc.text(termsLines, 20, totalsY);
        totalsY += termsLines.length * 5;
    }
    // Notes
    if (invoice.notes) {
        totalsY += 5;
        doc.setFontSize(fontSize - 1);
        const notesLines = doc.splitTextToSize(invoice.notes, 170);
        doc.text('Notes:', 20, totalsY);
        totalsY += 6;
        doc.text(notesLines, 20, totalsY);
    }
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    const footerY = pageHeight - 20;
    if (settings?.footerText && settings?.showFooter) {
        doc.setFontSize(fontSize - 2);
        doc.setTextColor(100, 100, 100);
        const footerLines = doc.splitTextToSize(settings.footerText, 170);
        doc.text(footerLines, 105, footerY, {
            align: 'center'
        });
    } else {
        doc.setFontSize(fontSize - 2);
        doc.setTextColor(100, 100, 100);
        doc.text('Thank you for your business!', 105, footerY, {
            align: 'center'
        });
    }
    // Convert to buffer
    const pdfOutput = doc.output('arraybuffer');
    return Buffer.from(pdfOutput);
};
}),
"[project]/src/app/api/orders/[id]/invoice/download/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$invoice$2d$generator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/invoice-generator.ts [app-route] (ecmascript)");
;
;
;
;
;
async function GET(request, { params }) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const { id } = await params;
        // Get order
        const order = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.findUnique({
            where: {
                id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                sku: true
                            }
                        },
                        variant: {
                            select: {
                                sku: true
                            }
                        }
                    }
                },
                billingAddress: true,
                shippingAddress: true
            }
        });
        if (!order) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Order not found'
            }, {
                status: 404
            });
        }
        // Check permissions
        if (![
            'ADMIN',
            'SUPERADMIN',
            'MANAGER'
        ].includes(session.user.role)) {
            if (order.userId !== session.user.id) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Unauthorized'
                }, {
                    status: 403
                });
            }
        }
        // Get invoice settings
        let settings = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].invoiceSettings.findFirst();
        if (!settings) {
            // Create default settings if they don't exist
            settings = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].invoiceSettings.create({
                data: {
                    invoiceNumberPrefix: 'INV',
                    invoiceNumberFormat: '{{prefix}}-{{number}}',
                    nextInvoiceNumber: 1,
                    defaultDueDays: 30,
                    primaryColor: '#000000',
                    secondaryColor: '#666666',
                    accentColor: '#3182ce',
                    fontFamily: 'Helvetica',
                    fontSize: 10,
                    autoSendOnCreate: false,
                    sendCopyToAdmin: false,
                    taxLabel: 'Tax',
                    showTaxBreakdown: true,
                    showPaymentLink: true,
                    showQRCode: false,
                    enableSignatures: false,
                    multiLanguage: false,
                    defaultLanguage: 'en',
                    showFooter: true
                }
            });
        }
        // Convert order to invoice format
        const invoice = {
            id: order.id,
            invoiceNumber: order.orderNumber,
            invoiceType: 'STANDARD',
            status: 'DRAFT',
            invoiceDate: order.createdAt,
            dueDate: null,
            sentAt: null,
            viewedAt: null,
            paidAt: null,
            customerId: order.userId || undefined,
            customerEmail: order.user?.email || order.guestEmail || undefined,
            customerName: order.user?.name || (order.shippingAddress ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` : undefined),
            customerCompany: order.billingAddress?.company || undefined,
            billingAddress: order.billingAddress ? {
                firstName: order.billingAddress.firstName,
                lastName: order.billingAddress.lastName,
                company: order.billingAddress.company || undefined,
                address1: order.billingAddress.address1,
                address2: order.billingAddress.address2 || undefined,
                city: order.billingAddress.city,
                state: order.billingAddress.state || undefined,
                postalCode: order.billingAddress.postalCode,
                country: order.billingAddress.country,
                phone: order.billingAddress.phone || undefined
            } : undefined,
            shippingAddress: order.shippingAddress ? {
                firstName: order.shippingAddress.firstName,
                lastName: order.shippingAddress.lastName,
                company: order.shippingAddress.company || undefined,
                address1: order.shippingAddress.address1,
                address2: order.shippingAddress.address2 || undefined,
                city: order.shippingAddress.city,
                state: order.shippingAddress.state || undefined,
                postalCode: order.shippingAddress.postalCode,
                country: order.shippingAddress.country,
                phone: order.shippingAddress.phone || undefined
            } : undefined,
            orderId: order.id,
            subtotal: Number(order.subtotal),
            tax: Number(order.tax),
            taxRate: null,
            shipping: Number(order.shipping),
            discount: Number(order.discountAmount || 0),
            discountType: undefined,
            total: Number(order.total),
            amountPaid: 0,
            balanceDue: Number(order.total),
            currency: settings.currency || 'USD',
            currencySymbol: settings.currencySymbol || '$',
            templateId: null,
            customFields: null,
            termsAndConditions: settings.defaultTerms || undefined,
            notes: settings.defaultNotes || order.notes || undefined,
            footerText: settings.footerText || undefined,
            paymentMethod: undefined,
            paymentInstructions: undefined,
            paymentLink: undefined,
            isRecurring: false,
            recurringId: undefined,
            qrCodeUrl: undefined,
            signatureUrl: undefined,
            signedAt: undefined,
            signedBy: undefined,
            createdById: undefined,
            updatedById: undefined,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items: order.items.map((item, index)=>({
                    id: item.id,
                    productId: item.productId,
                    variantId: item.variantId || undefined,
                    description: item.product.name,
                    sku: item.product.sku || item.variant?.sku || undefined,
                    quantity: item.quantity,
                    unitPrice: Number(item.price),
                    taxRate: undefined,
                    discount: 0,
                    total: Number(item.total),
                    customFields: undefined,
                    position: index
                })),
            payments: [],
            history: []
        };
        // Generate PDF using the enhanced generator with settings
        const pdfBuffer = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$invoice$2d$generator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateInvoicePDF"])(invoice, null, settings);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Invoice-${order.orderNumber}.pdf"`
            }
        });
    } catch (error) {
        console.error('Error generating invoice from order:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to generate invoice'
        }, {
            status: 500
        });
    }
}
}),
];

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="777c7394-590c-57cc-849c-b1727eac902b")}catch(e){}}();
//# sourceMappingURL=%5Broot-of-the-server%5D__a604efc9._.js.map
//# debugId=777c7394-590c-57cc-849c-b1727eac902b
