!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="cc4c8074-1316-545a-a529-7e875937c17b")}catch(e){}}();
module.exports = [
"[project]/src/i18n.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "defaultLocale",
    ()=>defaultLocale,
    "locales",
    ()=>locales
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/server/react-client/index.js [app-ssr] (ecmascript)");
;
const locales = [
    'en',
    'fr'
];
const defaultLocale = 'en';
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRequestConfig"])(async ({ requestLocale })=>{
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
"[project]/src/navigation.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$navigation$2f$react$2d$client$2f$createNavigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__createNavigation$3e$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/navigation/react-client/createNavigation.js [app-ssr] (ecmascript) <export default as createNavigation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/i18n.ts [app-ssr] (ecmascript)");
;
;
const { Link, redirect, usePathname, useRouter } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$navigation$2f$react$2d$client$2f$createNavigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__createNavigation$3e$__["createNavigation"])({
    locales: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["locales"]
});
}),
"[project]/src/lib/redux/hooks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAppDispatch",
    ()=>useAppDispatch,
    "useAppSelector",
    ()=>useAppSelector,
    "useAppStore",
    ()=>useAppStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-ssr] (ecmascript)");
;
const useAppDispatch = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDispatch"].withTypes();
const useAppSelector = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSelector"].withTypes();
const useAppStore = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStore"].withTypes();
}),
"[project]/src/lib/formatting.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/lib/image-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PLACEHOLDER_PRODUCT_IMAGE",
    ()=>PLACEHOLDER_PRODUCT_IMAGE,
    "getProductImageUrl",
    ()=>getProductImageUrl,
    "handleImageError",
    ()=>handleImageError,
    "handleNativeImageError",
    ()=>handleNativeImageError,
    "useImageErrorHandler",
    ()=>useImageErrorHandler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
const PLACEHOLDER_PRODUCT_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f9fafb;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#f3f4f6;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>
    <g transform="translate(200, 200)">
      <!-- Shopping bag icon -->
      <path d="M-40 -20 L-40 60 L40 60 L40 -20 Z" fill="#e5e7eb" stroke="#d1d5db" stroke-width="2"/>
      <rect x="-35" y="-15" width="70" height="70" fill="#e5e7eb"/>
      <path d="M-25 -20 Q-25 -45 0 -45 Q25 -45 25 -20" fill="none" stroke="#9ca3af" stroke-width="3" stroke-linecap="round"/>
      <!-- Shopping bag icon bottom -->
      <circle cx="0" cy="20" r="3" fill="#9ca3af"/>
    </g>
    <text x="200" y="280" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" font-weight="500">No Image Available</text>
  </svg>`)}`;
function handleImageError(e) {
    const target = e.currentTarget;
    // Prevent infinite loop if placeholder also fails
    const currentSrc = target.src || target.getAttribute('src') || '';
    if (currentSrc && !currentSrc.includes('data:image/svg+xml') && !currentSrc.includes('placeholder')) {
        try {
            // For Next.js Image, we need to update the src directly
            // The onError handler receives the native img element
            target.src = PLACEHOLDER_PRODUCT_IMAGE;
            target.setAttribute('src', PLACEHOLDER_PRODUCT_IMAGE);
            target.onerror = null; // Prevent infinite loop
        } catch (error) {
            // If setting src fails, try to hide the image and show placeholder
            console.warn('Failed to set placeholder image:', error);
        }
    }
}
function handleNativeImageError(e) {
    const target = e.currentTarget;
    const currentSrc = target.src || '';
    if (currentSrc && !currentSrc.includes('data:image/svg+xml') && !currentSrc.includes('placeholder')) {
        target.onerror = null; // Prevent infinite loop
        target.src = PLACEHOLDER_PRODUCT_IMAGE;
    }
}
function getProductImageUrl(imageUrl) {
    if (!imageUrl || imageUrl.trim() === '') {
        return PLACEHOLDER_PRODUCT_IMAGE;
    }
    return imageUrl;
}
function useImageErrorHandler(initialSrc) {
    const [imageSrc, setImageSrc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(getProductImageUrl(initialSrc));
    const [hasError, setHasError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialSrc && initialSrc !== imageSrc && !hasError) {
            setImageSrc(initialSrc);
            setHasError(false);
        }
    }, [
        initialSrc,
        imageSrc,
        hasError
    ]);
    const handleError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!hasError) {
            setHasError(true);
            setImageSrc(PLACEHOLDER_PRODUCT_IMAGE);
        }
    }, [
        hasError
    ]);
    return {
        imageSrc,
        handleError,
        hasError
    };
}
}),
"[project]/src/lib/normalizeBlockConfig.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/hooks/useCurrency.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCurrency",
    ()=>useCurrency
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SettingsContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/SettingsContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatting$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/formatting.ts [app-ssr] (ecmascript)");
'use client';
;
;
function useCurrency() {
    const { settings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SettingsContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSettings"])();
    const currencySymbol = settings.general_currency_symbol || '$';
    /**
   * Format currency with 2 decimal places
   */ const format = (amount)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatting$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrencyWithSymbol"])(amount, currencySymbol);
    };
    /**
   * Format currency without decimal places
   */ const formatNoDecimals = (amount)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatting$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrencyWithSymbolNoDecimals"])(amount, currencySymbol);
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
}),
"[project]/src/hooks/useFlashSale.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFlashSale",
    ()=>useFlashSale
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
function useFlashSale(productId) {
    const [flashSaleData, setFlashSaleData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        flashSale: null,
        product: null
    });
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
    }, [
        productId
    ]);
    return {
        ...flashSaleData,
        loading
    };
}
}),
"[project]/src/hooks/useTheme.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * useTheme Hook
 * Convenience hook to access theme configuration
 */ __turbopack_context__.s([
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/ThemeContext.tsx [app-ssr] (ecmascript)");
;
function useTheme() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThemeContext"])();
}
}),
"[project]/src/hooks/usePageEditor.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePageEditor",
    ()=>usePageEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
;
;
;
function usePageEditor({ pageId, initialBlocks = [], initialPageData = {}, autoSaveEnabled = true, autoSaveDelay = 2000, templates = [] }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [blocks, setBlocks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialBlocks);
    const [pageData, setPageData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialPageData);
    const [selectedBlockId, setSelectedBlockId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDirty, setIsDirty] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [autoSaveStatus, setAutoSaveStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('idle');
    const autoSaveTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastSavedStateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])('');
    // Undo/Redo state
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [historyIndex, setHistoryIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(-1);
    const maxHistorySize = 50;
    const configUpdateTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pageDataUpdateTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Initialize blocks if provided later (e.g. after fetch) - only if blocks array is empty
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
    }, [
        initialBlocks,
        blocks.length,
        initialPageData
    ]);
    // Save state to history
    const saveToHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((blocksToSave, pageDataToSave)=>{
        setHistory((prev)=>{
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
        });
        setHistoryIndex((prev)=>Math.min(prev + 1, maxHistorySize - 1));
    }, [
        historyIndex,
        maxHistorySize
    ]);
    // Undo function
    const undo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            const state = history[newIndex];
            setBlocks(state.blocks);
            setPageData(state.pageData);
            setHistoryIndex(newIndex);
            setIsDirty(true);
        }
    }, [
        history,
        historyIndex
    ]);
    // Redo function
    const redo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            const state = history[newIndex];
            setBlocks(state.blocks);
            setPageData(state.pageData);
            setHistoryIndex(newIndex);
            setIsDirty(true);
        }
    }, [
        history,
        historyIndex
    ]);
    // Check if undo/redo is available
    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;
    // Load from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
    }, [
        pageId
    ]);
    // Save to localStorage as backup
    const saveToLocalStorage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((blocksToSave, pageDataToSave)=>{
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
    }, [
        pageId
    ]);
    // Clear localStorage after successful save
    const clearLocalStorage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const storageKey = `cms-editor-${pageId}`;
        try {
            localStorage.removeItem(storageKey);
        } catch (error) {
            console.error('Failed to clear localStorage:', error);
        }
    }, [
        pageId
    ]);
    const addBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((template)=>{
        const newBlock = {
            id: `temp-${Date.now()}`,
            templateId: template.id,
            config: template.defaultConfig || {},
            order: blocks.length,
            template: template
        };
        setBlocks((prev)=>{
            const updated = [
                ...prev,
                newBlock
            ];
            saveToHistory(updated, pageData);
            return updated;
        });
        setSelectedBlockId(newBlock.id);
        setIsDirty(true);
    }, [
        blocks.length,
        pageData,
        saveToHistory
    ]);
    const updateBlockConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((blockId, newConfig)=>{
        setBlocks((prev)=>{
            const updated = prev.map((block)=>block.id === blockId ? {
                    ...block,
                    config: newConfig
                } : block);
            // Debounce history saves for config updates (only save every 500ms)
            if (configUpdateTimeoutRef.current) {
                clearTimeout(configUpdateTimeoutRef.current);
            }
            configUpdateTimeoutRef.current = setTimeout(()=>{
                saveToHistory(updated, pageData);
            }, 500);
            return updated;
        });
        setIsDirty(true);
    }, [
        pageData,
        saveToHistory
    ]);
    const removeBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((blockId)=>{
        setBlocks((prev)=>{
            const updated = prev.filter((block)=>block.id !== blockId);
            saveToHistory(updated, pageData);
            return updated;
        });
        if (selectedBlockId === blockId) {
            setSelectedBlockId(null);
        }
        setIsDirty(true);
    }, [
        selectedBlockId,
        pageData,
        saveToHistory
    ]);
    const duplicateBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((blockId)=>{
        const blockToDuplicate = blocks.find((b)=>b.id === blockId);
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
        setBlocks((prev)=>{
            const index = prev.findIndex((b)=>b.id === blockId);
            const updated = [
                ...prev.slice(0, index + 1),
                newBlock,
                ...prev.slice(index + 1).map((b)=>({
                        ...b,
                        order: b.order + 1
                    }))
            ];
            saveToHistory(updated, pageData);
            return updated;
        });
        setSelectedBlockId(newBlock.id);
        setIsDirty(true);
    }, [
        blocks,
        pageData,
        saveToHistory
    ]);
    const reorderBlocks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newBlocks)=>{
        // Update order property based on index
        const orderedBlocks = newBlocks.map((block, index)=>({
                ...block,
                order: index
            }));
        setBlocks(orderedBlocks);
        saveToHistory(orderedBlocks, pageData);
        setIsDirty(true);
    }, [
        pageData,
        saveToHistory
    ]);
    const updatePageData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((field, value)=>{
        setPageData((prev)=>{
            const updated = {
                ...prev,
                [field]: value
            };
            // Debounce history saves for page data updates
            if (pageDataUpdateTimeoutRef.current) {
                clearTimeout(pageDataUpdateTimeoutRef.current);
            }
            pageDataUpdateTimeoutRef.current = setTimeout(()=>{
                saveToHistory(blocks, updated);
            }, 500);
            return updated;
        });
        setIsDirty(true);
    }, [
        blocks,
        saveToHistory
    ]);
    const savePage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (isAutoSave = false)=>{
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
                const errorData = await pageResponse.json().catch(()=>({}));
                throw new Error(errorData.error || 'Failed to save page data');
            }
            // Then sync blocks
            const blocksResponse = await fetch(`/api/admin/cms/pages/${pageId}/sync-blocks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    blocks: blocks.map((block)=>({
                            id: block.id,
                            templateId: block.templateId,
                            config: block.config,
                            order: block.order
                        }))
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
                blocks.forEach((oldBlock, index)=>{
                    if (data.page.blocks[index]) {
                        idMap.set(oldBlock.id, data.page.blocks[index].id);
                    }
                });
                // Also match by templateId + order as fallback (in case order changed)
                blocks.forEach((oldBlock)=>{
                    if (!idMap.has(oldBlock.id)) {
                        const matchingBlock = data.page.blocks.find((newBlock)=>newBlock.templateId === oldBlock.templateId && newBlock.order === oldBlock.order);
                        if (matchingBlock) {
                            idMap.set(oldBlock.id, matchingBlock.id);
                        }
                    }
                });
                const updatedBlocks = data.page.blocks.map((block)=>{
                    // Find the existing block to preserve template data if server response is incomplete
                    const existingBlock = blocks.find((b)=>b.id === block.id || b.templateId === block.templateId && b.order === block.order);
                    // Use template from server response if it has configSchema
                    let template = block.template;
                    if (!template || !template.configSchema) {
                        // Fall back to existing block's template
                        if (existingBlock?.template && existingBlock.template.configSchema) {
                            template = existingBlock.template;
                        } else {
                            // Last resort: find template from templates array
                            const templateFromArray = templates.find((t)=>t.id === block.templateId);
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
                });
                setBlocks(updatedBlocks);
                // Preserve selected block ID if it was a temp block that got a new ID
                if (selectedBlockId && idMap.has(selectedBlockId)) {
                    const newId = idMap.get(selectedBlockId);
                    if (newId) {
                        setSelectedBlockId(newId);
                    }
                } else if (selectedBlockId) {
                    // If the selected block ID doesn't exist in updated blocks, check if it still exists
                    const blockStillExists = updatedBlocks.some((b)=>b.id === selectedBlockId);
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
                setTimeout(()=>setAutoSaveStatus('idle'), 2000);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Page saved successfully');
                clearLocalStorage();
            }
            // Refresh will reload the page data from server
            router.refresh();
        } catch (error) {
            console.error('Error saving page:', error);
            if (isAutoSave) {
                setAutoSaveStatus('error');
                setTimeout(()=>setAutoSaveStatus('idle'), 3000);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(error.message || 'Failed to save page');
            }
        } finally{
            setIsSaving(false);
        }
    }, [
        blocks,
        pageId,
        pageData,
        router,
        clearLocalStorage
    ]);
    // Auto-save effect
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
        autoSaveTimeoutRef.current = setTimeout(()=>{
            const currentState = JSON.stringify({
                blocks,
                pageData
            });
            // Only auto-save if state has changed since last save
            if (currentState !== lastSavedStateRef.current) {
                savePage(true);
            }
        }, autoSaveDelay);
        return ()=>{
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [
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
}),
"[project]/src/contexts/ThemeContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useThemeContext",
    ()=>useThemeContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function useThemeContext() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
}
function ThemeProvider({ children }) {
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchActiveTheme = async ()=>{
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/themes/active', {
                cache: 'no-store'
            });
            if (!response.ok) {
                throw new Error('Failed to fetch active theme');
            }
            const data = await response.json();
            if (data.theme) {
                setTheme(data.theme);
            } else {
                setTheme(null);
            }
        } catch (err) {
            console.error('Error fetching theme:', err);
            setError(err instanceof Error ? err.message : 'Failed to load theme');
            setTheme(null);
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchActiveTheme();
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: {
            theme,
            loading,
            error,
            refreshTheme: fetchActiveTheme
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/ThemeContext.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_5c1eba1e._.js.map
//# debugId=cc4c8074-1316-545a-a529-7e875937c17b
