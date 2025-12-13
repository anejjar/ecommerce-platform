!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="8c878745-4e80-5f71-91be-4bb2039b35a2")}catch(e){}}();
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/i18n.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "defaultLocale",
    ()=>defaultLocale,
    "locales",
    ()=>locales
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/server/react-client/index.js [app-client] (ecmascript)");
;
const locales = [
    'en',
    'fr'
];
const defaultLocale = 'en';
const __TURBOPACK__default__export__ = _c1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRequestConfig"])(_c = async ({ requestLocale })=>{
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
var _c, _c1;
__turbopack_context__.k.register(_c, "%default%$getRequestConfig");
__turbopack_context__.k.register(_c1, "%default%");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/navigation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Link",
    ()=>Link,
    "redirect",
    ()=>redirect,
    "usePathname",
    ()=>usePathname,
    "useRouter",
    ()=>useRouter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$navigation$2f$react$2d$client$2f$createNavigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__createNavigation$3e$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/navigation/react-client/createNavigation.js [app-client] (ecmascript) <export default as createNavigation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/i18n.ts [app-client] (ecmascript)");
;
;
const { Link, redirect, usePathname, useRouter } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$navigation$2f$react$2d$client$2f$createNavigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__createNavigation$3e$__["createNavigation"])({
    locales: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["locales"]
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/redux/hooks.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAppDispatch",
    ()=>useAppDispatch,
    "useAppSelector",
    ()=>useAppSelector,
    "useAppStore",
    ()=>useAppStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-client] (ecmascript)");
;
const useAppDispatch = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"].withTypes();
const useAppSelector = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"].withTypes();
const useAppStore = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"].withTypes();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/formatting.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/normalizeBlockConfig.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Normalizes block configuration data to ensure repeater fields are always arrays
 * This prevents "value.map is not a function" errors when loading existing blocks
 */ __turbopack_context__.s([
    "normalizeBlockConfig",
    ()=>normalizeBlockConfig
]);
function normalizeBlockConfig(config, schema) {
    if (!config || !schema) return config;
    const normalized = {
        ...config
    };
    const schemaFields = schema.fields || [];
    // Recursively normalize repeater fields
    const normalizeRepeaterField = (field, value)=>{
        if (field.type === 'repeater' && field.fields) {
            // Ensure value is an array
            const arrayValue = Array.isArray(value) ? value : value ? [
                value
            ] : [];
            // Normalize each item in the repeater
            return arrayValue.map((item)=>{
                const normalizedItem = {};
                field.fields.forEach((subField)=>{
                    if (subField.type === 'repeater') {
                        // Handle nested repeaters
                        normalizedItem[subField.name] = normalizeRepeaterField(subField, item[subField.name]);
                    } else {
                        normalizedItem[subField.name] = item[subField.name] ?? subField.default ?? '';
                    }
                });
                return normalizedItem;
            });
        }
        return value;
    };
    // Normalize all fields in the config
    schemaFields.forEach((field)=>{
        if (field.type === 'repeater') {
            normalized[field.name] = normalizeRepeaterField(field, normalized[field.name]);
        }
    });
    return normalized;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useCurrency.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCurrency",
    ()=>useCurrency
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/SettingsContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatting$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/formatting.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useCurrency() {
    _s();
    const { settings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"])();
    const currencySymbol = settings.general_currency_symbol || '$';
    /**
   * Format currency with 2 decimal places
   */ const format = (amount)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatting$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrencyWithSymbol"])(amount, currencySymbol);
    };
    /**
   * Format currency without decimal places
   */ const formatNoDecimals = (amount)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatting$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrencyWithSymbolNoDecimals"])(amount, currencySymbol);
    };
    /**
   * Get the currency symbol
   */ const symbol = currencySymbol;
    /**
   * Format a number with the currency symbol (for custom formatting)
   */ const formatWithSymbol = (amount, options)=>{
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(numAmount)) {
            return `${currencySymbol}0${options?.decimals === 0 ? '' : '.00'}`;
        }
        const formatted = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: options?.decimals ?? 2,
            maximumFractionDigits: options?.decimals ?? 2
        }).format(numAmount);
        return `${currencySymbol}${formatted}`;
    };
    return {
        format,
        formatNoDecimals,
        symbol,
        formatWithSymbol
    };
}
_s(useCurrency, "gxi4fQ+d98hNJYOxevCQ9ERfZgI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useFlashSale.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFlashSale",
    ()=>useFlashSale
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useFlashSale(productId) {
    _s();
    const [flashSaleData, setFlashSaleData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        flashSale: null,
        product: null
    });
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useFlashSale.useEffect": ()=>{
            async function fetchFlashSale() {
                try {
                    const response = await fetch(`/api/products/${productId}/flash-sale`);
                    if (response.ok) {
                        const data = await response.json();
                        setFlashSaleData(data);
                    }
                } catch (error) {
                    console.error('Error fetching flash sale:', error);
                } finally{
                    setLoading(false);
                }
            }
            if (productId) {
                fetchFlashSale();
            } else {
                setLoading(false);
            }
        }
    }["useFlashSale.useEffect"], [
        productId
    ]);
    return {
        ...flashSaleData,
        loading
    };
}
_s(useFlashSale, "9cgxXPDtYa48+JcaLub5cyCeA9E=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/usePageEditor.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePageEditor",
    ()=>usePageEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
function usePageEditor({ pageId, initialBlocks = [], initialPageData = {}, autoSaveEnabled = true, autoSaveDelay = 2000, templates = [] }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [blocks, setBlocks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialBlocks);
    const [pageData, setPageData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialPageData);
    const [selectedBlockId, setSelectedBlockId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDirty, setIsDirty] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [autoSaveStatus, setAutoSaveStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    const autoSaveTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastSavedStateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])('');
    // Undo/Redo state
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [historyIndex, setHistoryIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(-1);
    const maxHistorySize = 50;
    const configUpdateTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pageDataUpdateTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Initialize blocks if provided later (e.g. after fetch) - only if blocks array is empty
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePageEditor.useEffect": ()=>{
            if (initialBlocks.length > 0 && blocks.length === 0) {
                setBlocks(initialBlocks);
                // Initialize history with initial state
                setHistory([
                    {
                        blocks: initialBlocks,
                        pageData: initialPageData
                    }
                ]);
                setHistoryIndex(0);
            }
        }
    }["usePageEditor.useEffect"], [
        initialBlocks,
        blocks.length,
        initialPageData
    ]);
    // Save state to history
    const saveToHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePageEditor.useCallback[saveToHistory]": (blocksToSave, pageDataToSave)=>{
            setHistory({
                "usePageEditor.useCallback[saveToHistory]": (prev)=>{
                    const newHistory = prev.slice(0, historyIndex + 1);
                    newHistory.push({
                        blocks: blocksToSave,
                        pageData: pageDataToSave
                    });
                    // Limit history size
                    if (newHistory.length > maxHistorySize) {
                        newHistory.shift();
                        return newHistory;
                    }
                    return newHistory;
                }
            }["usePageEditor.useCallback[saveToHistory]"]);
            setHistoryIndex({
                "usePageEditor.useCallback[saveToHistory]": (prev)=>Math.min(prev + 1, maxHistorySize - 1)
            }["usePageEditor.useCallback[saveToHistory]"]);
        }
    }["usePageEditor.useCallback[saveToHistory]"], [
        historyIndex,
        maxHistorySize
    ]);
    // Undo function
    const undo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePageEditor.useCallback[undo]": ()=>{
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                const state = history[newIndex];
                setBlocks(state.blocks);
                setPageData(state.pageData);
                setHistoryIndex(newIndex);
                setIsDirty(true);
            }
        }
    }["usePageEditor.useCallback[undo]"], [
        history,
        historyIndex
    ]);
    // Redo function
    const redo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePageEditor.useCallback[redo]": ()=>{
            if (historyIndex < history.length - 1) {
                const newIndex = historyIndex + 1;
                const state = history[newIndex];
                setBlocks(state.blocks);
                setPageData(state.pageData);
                setHistoryIndex(newIndex);
                setIsDirty(true);
            }
        }
    }["usePageEditor.useCallback[redo]"], [
        history,
        historyIndex
    ]);
    // Check if undo/redo is available
    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;
    // Load from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePageEditor.useEffect": ()=>{
            const storageKey = `cms-editor-${pageId}`;
            try {
                const saved = localStorage.getItem(storageKey);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed.blocks && parsed.blocks.length > 0) {
                        setBlocks(parsed.blocks);
                    }
                    if (parsed.pageData) {
                        setPageData(parsed.pageData);
                    }
                    setIsDirty(true);
                }
            } catch (error) {
                console.error('Failed to load from localStorage:', error);
            }
        }
    }["usePageEditor.useEffect"], [
        pageId
    ]);
    // Save to localStorage as backup
    const saveToLocalStorage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePageEditor.useCallback[saveToLocalStorage]": (blocksToSave, pageDataToSave)=>{
            const storageKey = `cms-editor-${pageId}`;
            try {
                localStorage.setItem(storageKey, JSON.stringify({
                    blocks: blocksToSave,
                    pageData: pageDataToSave,
                    timestamp: Date.now()
                }));
            } catch (error) {
                console.error('Failed to save to localStorage:', error);
            }
        }
    }["usePageEditor.useCallback[saveToLocalStorage]"], [
        pageId
    ]);
    // Clear localStorage after successful save
    const clearLocalStorage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePageEditor.useCallback[clearLocalStorage]": ()=>{
            const storageKey = `cms-editor-${pageId}`;
            try {
                localStorage.removeItem(storageKey);
            } catch (error) {
                console.error('Failed to clear localStorage:', error);
            }
        }
    }["usePageEditor.useCallback[clearLocalStorage]"], [
        pageId
    ]);
    const addBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePageEditor.useCallback[addBlock]": (template)=>{
            const newBlock = {
                id: `temp-${Date.now()}`,
                templateId: template.id,
                config: template.defaultConfig || {},
                order: blocks.length,
                template: template
            };
            setBlocks({
                "usePageEditor.useCallback[addBlock]": (prev)=>{
                    const updated = [
                        ...prev,
                        newBlock
                    ];
                    saveToHistory(updated, pageData);
                    return updated;
                }
            }["usePageEditor.useCallback[addBlock]"]);
            setSelectedBlockId(newBlock.id);
            setIsDirty(true);
        }
    }["usePageEditor.useCallback[addBlock]"], [
        blocks.length,
        pageData,
        saveToHistory
    ]);
    const updateBlockConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePageEditor.useCallback[updateBlockConfig]": (blockId, newConfig)=>{
            setBlocks({
                "usePageEditor.useCallback[updateBlockConfig]": (prev)=>{
                    const updated = prev.map({
                        "usePageEditor.useCallback[updateBlockConfig].updated": (block)=>block.id === blockId ? {
                                ...block,
                                config: newConfig
                            } : block
                    }["usePageEditor.useCallback[updateBlockConfig].updated"]);
                    // Debounce history saves for config updates (only save every 500ms)
                    if (configUpdateTimeoutRef.current) {
                        clearTimeout(configUpdateTimeoutRef.current);
                    }
                    configUpdateTimeoutRef.current = setTimeout({
                        "usePageEditor.useCallback[updateBlockConfig]": ()=>{
                            saveToHistory(updated, pageData);
                        }
                    }["usePageEditor.useCallback[updateBlockConfig]"], 500);
                    return updated;
                }
            }["usePageEditor.useCallback[updateBlockConfig]"]);
            setIsDirty(true);
        }
    }["usePageEditor.useCallback[updateBlockConfig]"], [
        pageData,
        saveToHistory
    ]);
    const removeBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePageEditor.useCallback[removeBlock]": (blockId)=>{
            setBlocks({
                "usePageEditor.useCallback[removeBlock]": (prev)=>{
                    const updated = prev.filter({
                        "usePageEditor.useCallback[removeBlock].updated": (block)=>block.id !== blockId
                    }["usePageEditor.useCallback[removeBlock].updated"]);
                    saveToHistory(updated, pageData);
                    return updated;
                }
            }["usePageEditor.useCallback[removeBlock]"]);
            if (selectedBlockId === blockId) {
                setSelectedBlockId(null);
            }
            setIsDirty(true);
        }
    }["usePageEditor.useCallback[removeBlock]"], [
        selectedBlockId,
        pageData,
        saveToHistory
    ]);
    const duplicateBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePageEditor.useCallback[duplicateBlock]": (blockId)=>{
            const blockToDuplicate = blocks.find({
                "usePageEditor.useCallback[duplicateBlock].blockToDuplicate": (b)=>b.id === blockId
            }["usePageEditor.useCallback[duplicateBlock].blockToDuplicate"]);
            if (!blockToDuplicate) return;
            const newBlock = {
                id: `temp-${Date.now()}`,
                templateId: blockToDuplicate.templateId,
                config: {
                    ...blockToDuplicate.config
                },
                order: blockToDuplicate.order + 1,
                template: blockToDuplicate.template
            };
            setBlocks({
                "usePageEditor.useCallback[duplicateBlock]": (prev)=>{
                    const index = prev.findIndex({
                        "usePageEditor.useCallback[duplicateBlock].index": (b)=>b.id === blockId
                    }["usePageEditor.useCallback[duplicateBlock].index"]);
                    const updated = [
                        ...prev.slice(0, index + 1),
                        newBlock,
                        ...prev.slice(index + 1).map({
                            "usePageEditor.useCallback[duplicateBlock]": (b)=>({
                                    ...b,
                                    order: b.order + 1
                                })
                        }["usePageEditor.useCallback[duplicateBlock]"])
                    ];
                    saveToHistory(updated, pageData);
                    return updated;
                }
            }["usePageEditor.useCallback[duplicateBlock]"]);
            setSelectedBlockId(newBlock.id);
            setIsDirty(true);
        }
    }["usePageEditor.useCallback[duplicateBlock]"], [
        blocks,
        pageData,
        saveToHistory
    ]);
    const reorderBlocks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePageEditor.useCallback[reorderBlocks]": (newBlocks)=>{
            // Update order property based on index
            const orderedBlocks = newBlocks.map({
                "usePageEditor.useCallback[reorderBlocks].orderedBlocks": (block, index)=>({
                        ...block,
                        order: index
                    })
            }["usePageEditor.useCallback[reorderBlocks].orderedBlocks"]);
            setBlocks(orderedBlocks);
            saveToHistory(orderedBlocks, pageData);
            setIsDirty(true);
        }
    }["usePageEditor.useCallback[reorderBlocks]"], [
        pageData,
        saveToHistory
    ]);
    const updatePageData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePageEditor.useCallback[updatePageData]": (field, value)=>{
            setPageData({
                "usePageEditor.useCallback[updatePageData]": (prev)=>{
                    const updated = {
                        ...prev,
                        [field]: value
                    };
                    // Debounce history saves for page data updates
                    if (pageDataUpdateTimeoutRef.current) {
                        clearTimeout(pageDataUpdateTimeoutRef.current);
                    }
                    pageDataUpdateTimeoutRef.current = setTimeout({
                        "usePageEditor.useCallback[updatePageData]": ()=>{
                            saveToHistory(blocks, updated);
                        }
                    }["usePageEditor.useCallback[updatePageData]"], 500);
                    return updated;
                }
            }["usePageEditor.useCallback[updatePageData]"]);
            setIsDirty(true);
        }
    }["usePageEditor.useCallback[updatePageData]"], [
        blocks,
        saveToHistory
    ]);
    const savePage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePageEditor.useCallback[savePage]": async (isAutoSave = false)=>{
            setIsSaving(true);
            if (isAutoSave) {
                setAutoSaveStatus('saving');
            }
            try {
                // Save page data first
                const pageResponse = await fetch(`/api/admin/cms/pages/${pageId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: pageData.title,
                        slug: pageData.slug,
                        description: pageData.description,
                        seoTitle: pageData.seoTitle,
                        seoDescription: pageData.seoDescription,
                        seoKeywords: pageData.seoKeywords,
                        status: pageData.status
                    })
                });
                if (!pageResponse.ok) {
                    const errorData = await pageResponse.json().catch({
                        "usePageEditor.useCallback[savePage]": ()=>({})
                    }["usePageEditor.useCallback[savePage]"]);
                    throw new Error(errorData.error || 'Failed to save page data');
                }
                // Then sync blocks
                const blocksResponse = await fetch(`/api/admin/cms/pages/${pageId}/sync-blocks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        blocks: blocks.map({
                            "usePageEditor.useCallback[savePage]": (block)=>({
                                    id: block.id,
                                    templateId: block.templateId,
                                    config: block.config,
                                    order: block.order
                                })
                        }["usePageEditor.useCallback[savePage]"])
                    })
                });
                if (!blocksResponse.ok) {
                    throw new Error('Failed to save blocks');
                }
                const data = await blocksResponse.json();
                // Update blocks with the server response (to get real IDs for temp blocks)
                if (data.page?.blocks) {
                    // Create a mapping from old block IDs to new block IDs
                    // This helps preserve the selected block when temp IDs are replaced
                    const idMap = new Map();
                    // First, try to match by index (most common case)
                    blocks.forEach({
                        "usePageEditor.useCallback[savePage]": (oldBlock, index)=>{
                            if (data.page.blocks[index]) {
                                idMap.set(oldBlock.id, data.page.blocks[index].id);
                            }
                        }
                    }["usePageEditor.useCallback[savePage]"]);
                    // Also match by templateId + order as fallback (in case order changed)
                    blocks.forEach({
                        "usePageEditor.useCallback[savePage]": (oldBlock)=>{
                            if (!idMap.has(oldBlock.id)) {
                                const matchingBlock = data.page.blocks.find({
                                    "usePageEditor.useCallback[savePage].matchingBlock": (newBlock)=>newBlock.templateId === oldBlock.templateId && newBlock.order === oldBlock.order
                                }["usePageEditor.useCallback[savePage].matchingBlock"]);
                                if (matchingBlock) {
                                    idMap.set(oldBlock.id, matchingBlock.id);
                                }
                            }
                        }
                    }["usePageEditor.useCallback[savePage]"]);
                    const updatedBlocks = data.page.blocks.map({
                        "usePageEditor.useCallback[savePage].updatedBlocks": (block)=>{
                            // Find the existing block to preserve template data if server response is incomplete
                            const existingBlock = blocks.find({
                                "usePageEditor.useCallback[savePage].updatedBlocks.existingBlock": (b)=>b.id === block.id || b.templateId === block.templateId && b.order === block.order
                            }["usePageEditor.useCallback[savePage].updatedBlocks.existingBlock"]);
                            // Use template from server response if it has configSchema
                            let template = block.template;
                            if (!template || !template.configSchema) {
                                // Fall back to existing block's template
                                if (existingBlock?.template && existingBlock.template.configSchema) {
                                    template = existingBlock.template;
                                } else {
                                    // Last resort: find template from templates array
                                    const templateFromArray = templates.find({
                                        "usePageEditor.useCallback[savePage].updatedBlocks.templateFromArray": (t)=>t.id === block.templateId
                                    }["usePageEditor.useCallback[savePage].updatedBlocks.templateFromArray"]);
                                    if (templateFromArray) {
                                        template = templateFromArray;
                                    } else {
                                        // Use whatever we have
                                        template = block.template || existingBlock?.template;
                                    }
                                }
                            }
                            return {
                                id: block.id,
                                templateId: block.templateId,
                                config: block.config,
                                order: block.order,
                                template: template
                            };
                        }
                    }["usePageEditor.useCallback[savePage].updatedBlocks"]);
                    setBlocks(updatedBlocks);
                    // Preserve selected block ID if it was a temp block that got a new ID
                    if (selectedBlockId && idMap.has(selectedBlockId)) {
                        const newId = idMap.get(selectedBlockId);
                        if (newId) {
                            setSelectedBlockId(newId);
                        }
                    } else if (selectedBlockId) {
                        // If the selected block ID doesn't exist in updated blocks, check if it still exists
                        const blockStillExists = updatedBlocks.some({
                            "usePageEditor.useCallback[savePage].blockStillExists": (b)=>b.id === selectedBlockId
                        }["usePageEditor.useCallback[savePage].blockStillExists"]);
                        if (!blockStillExists) {
                            // Block was removed or ID changed, deselect
                            setSelectedBlockId(null);
                        }
                    }
                    // Update last saved state
                    lastSavedStateRef.current = JSON.stringify({
                        blocks: updatedBlocks,
                        pageData
                    });
                }
                setIsDirty(false);
                if (isAutoSave) {
                    setAutoSaveStatus('saved');
                    clearLocalStorage();
                    setTimeout({
                        "usePageEditor.useCallback[savePage]": ()=>setAutoSaveStatus('idle')
                    }["usePageEditor.useCallback[savePage]"], 2000);
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Page saved successfully');
                    clearLocalStorage();
                }
                // Refresh will reload the page data from server
                router.refresh();
            } catch (error) {
                console.error('Error saving page:', error);
                if (isAutoSave) {
                    setAutoSaveStatus('error');
                    setTimeout({
                        "usePageEditor.useCallback[savePage]": ()=>setAutoSaveStatus('idle')
                    }["usePageEditor.useCallback[savePage]"], 3000);
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message || 'Failed to save page');
                }
            } finally{
                setIsSaving(false);
            }
        }
    }["usePageEditor.useCallback[savePage]"], [
        blocks,
        pageId,
        pageData,
        router,
        clearLocalStorage
    ]);
    // Auto-save effect
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePageEditor.useEffect": ()=>{
            if (!autoSaveEnabled || !isDirty) {
                return;
            }
            // Clear existing timeout
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
            // Save current state to localStorage
            saveToLocalStorage(blocks, pageData);
            // Set new timeout for auto-save
            autoSaveTimeoutRef.current = setTimeout({
                "usePageEditor.useEffect": ()=>{
                    const currentState = JSON.stringify({
                        blocks,
                        pageData
                    });
                    // Only auto-save if state has changed since last save
                    if (currentState !== lastSavedStateRef.current) {
                        savePage(true);
                    }
                }
            }["usePageEditor.useEffect"], autoSaveDelay);
            return ({
                "usePageEditor.useEffect": ()=>{
                    if (autoSaveTimeoutRef.current) {
                        clearTimeout(autoSaveTimeoutRef.current);
                    }
                }
            })["usePageEditor.useEffect"];
        }
    }["usePageEditor.useEffect"], [
        blocks,
        pageData,
        isDirty,
        autoSaveEnabled,
        autoSaveDelay,
        savePage,
        saveToLocalStorage
    ]);
    return {
        blocks,
        pageData,
        selectedBlockId,
        setSelectedBlockId,
        addBlock,
        updateBlockConfig,
        updatePageData,
        removeBlock,
        reorderBlocks,
        savePage,
        isSaving,
        isDirty,
        autoSaveStatus,
        undo,
        redo,
        canUndo,
        canRedo,
        duplicateBlock
    };
}
_s(usePageEditor, "y4PDnrnqOybmgd6YHpTRoXRcfbM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_b3bed572._.js.map
//# debugId=8c878745-4e80-5f71-91be-4bb2039b35a2
