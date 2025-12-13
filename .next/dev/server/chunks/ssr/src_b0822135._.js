!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="cec6f4d5-81a9-58a4-bd75-6b193bddc06b")}catch(e){}}();
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
"[project]/src/lib/editor-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * CMS Page Editor Utility Functions
 *
 * Helper functions for working with the Elementor-style page builder,
 * including block tree manipulation, container operations, and more.
 */ __turbopack_context__.s([
    "blocksToNavigatorNodes",
    ()=>blocksToNavigatorNodes,
    "buildBlockTree",
    ()=>buildBlockTree,
    "canDropInto",
    ()=>canDropInto,
    "duplicateBlock",
    ()=>duplicateBlock,
    "findBlockById",
    ()=>findBlockById,
    "findBlockParent",
    ()=>findBlockParent,
    "flattenBlockTree",
    ()=>flattenBlockTree,
    "getBlockAncestors",
    ()=>getBlockAncestors,
    "getBlockDescendants",
    ()=>getBlockDescendants,
    "getMaxDepth",
    ()=>getMaxDepth,
    "isContainer",
    ()=>isContainer,
    "mergeConfigs",
    ()=>mergeConfigs,
    "moveBlockToParent",
    ()=>moveBlockToParent,
    "normalizeBlockOrders",
    ()=>normalizeBlockOrders,
    "removeBlockFromTree",
    ()=>removeBlockFromTree,
    "reorderBlocks",
    ()=>reorderBlocks,
    "searchBlocks",
    ()=>searchBlocks,
    "splitConfigIntoTabs",
    ()=>splitConfigIntoTabs,
    "updateBlockInTree",
    ()=>updateBlockInTree,
    "validateBlockTree",
    ()=>validateBlockTree
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$editor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/editor.ts [app-ssr] (ecmascript)");
;
function buildBlockTree(blocks) {
    const blockMap = new Map();
    const rootBlocks = [];
    // First pass: Create map and initialize children arrays
    blocks.forEach((block)=>{
        blockMap.set(block.id, {
            ...block,
            children: []
        });
    });
    // Second pass: Build hierarchy
    blocks.forEach((block)=>{
        const blockWithChildren = blockMap.get(block.id);
        if (block.parentId) {
            const parent = blockMap.get(block.parentId);
            if (parent) {
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(blockWithChildren);
            } else {
                // Parent not found, treat as root
                rootBlocks.push(blockWithChildren);
            }
        } else {
            rootBlocks.push(blockWithChildren);
        }
    });
    // Sort children by order
    const sortByOrder = (blocks)=>{
        blocks.sort((a, b)=>a.order - b.order);
        blocks.forEach((block)=>{
            if (block.children && block.children.length > 0) {
                sortByOrder(block.children);
            }
        });
    };
    sortByOrder(rootBlocks);
    return rootBlocks;
}
function flattenBlockTree(blocks) {
    const result = [];
    const traverse = (block)=>{
        const { children, ...blockWithoutChildren } = block;
        result.push(blockWithoutChildren);
        if (children && children.length > 0) {
            children.forEach(traverse);
        }
    };
    blocks.forEach(traverse);
    return result;
}
function findBlockById(blocks, blockId) {
    for (const block of blocks){
        if (block.id === blockId) {
            return block;
        }
        if (block.children && block.children.length > 0) {
            const found = findBlockById(block.children, blockId);
            if (found) {
                return found;
            }
        }
    }
    return null;
}
function findBlockParent(blocks, blockId, parentBlock) {
    for (const block of blocks){
        if (block.children && block.children.some((child)=>child.id === blockId)) {
            return block;
        }
        if (block.children && block.children.length > 0) {
            const found = findBlockParent(block.children, blockId, block);
            if (found) {
                return found;
            }
        }
    }
    return null;
}
function getBlockAncestors(blocks, blockId) {
    const ancestors = [];
    const findAncestors = (currentBlocks, targetId)=>{
        for (const block of currentBlocks){
            if (block.children && block.children.some((child)=>child.id === targetId)) {
                ancestors.unshift(block);
                return true;
            }
            if (block.children && block.children.length > 0) {
                if (findAncestors(block.children, targetId)) {
                    ancestors.unshift(block);
                    return true;
                }
            }
        }
        return false;
    };
    findAncestors(blocks, blockId);
    return ancestors;
}
function getBlockDescendants(block) {
    const descendants = [];
    const traverse = (currentBlock)=>{
        if (currentBlock.children && currentBlock.children.length > 0) {
            currentBlock.children.forEach((child)=>{
                descendants.push(child);
                traverse(child);
            });
        }
    };
    traverse(block);
    return descendants;
}
function updateBlockInTree(blocks, blockId, updates) {
    return blocks.map((block)=>{
        if (block.id === blockId) {
            return {
                ...block,
                ...updates
            };
        }
        if (block.children && block.children.length > 0) {
            return {
                ...block,
                children: updateBlockInTree(block.children, blockId, updates)
            };
        }
        return block;
    });
}
function removeBlockFromTree(blocks, blockId) {
    return blocks.filter((block)=>block.id !== blockId).map((block)=>{
        if (block.children && block.children.length > 0) {
            return {
                ...block,
                children: removeBlockFromTree(block.children, blockId)
            };
        }
        return block;
    });
}
function moveBlockToParent(blocks, blockId, newParentId, newOrder) {
    // First, find and remove the block
    const block = findBlockById(blocks, blockId);
    if (!block) {
        return blocks;
    }
    const withoutBlock = removeBlockFromTree(blocks, blockId);
    // Update the block's parent and order
    const movedBlock = {
        ...block,
        parentId: newParentId,
        order: newOrder
    };
    // If moving to root
    if (!newParentId) {
        return [
            ...withoutBlock,
            movedBlock
        ];
    }
    // Otherwise, add to new parent
    return updateBlockInTree(withoutBlock, newParentId, (parent)=>({
            ...parent,
            children: [
                ...parent.children || [],
                movedBlock
            ]
        }));
}
function duplicateBlock(block, generateId) {
    const newId = generateId();
    const duplicated = {
        ...block,
        id: newId,
        order: block.order + 1
    };
    // Recursively duplicate children
    if (block.children && block.children.length > 0) {
        duplicated.children = block.children.map((child)=>duplicateBlock(child, generateId));
    }
    return duplicated;
}
function isContainer(block) {
    return block.containerType !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$editor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContainerType"].BLOCK;
}
function canDropInto(draggedBlock, targetBlock) {
    // Can't drop into regular blocks
    if (!isContainer(targetBlock)) {
        return false;
    }
    // Can't drop a container into itself or its descendants
    if (draggedBlock.id === targetBlock.id) {
        return false;
    }
    const descendants = getBlockDescendants(draggedBlock);
    if (descendants.some((d)=>d.id === targetBlock.id)) {
        return false;
    }
    return true;
}
function getMaxDepth(blocks, currentDepth = 0) {
    if (!blocks || blocks.length === 0) {
        return currentDepth;
    }
    let maxDepth = currentDepth;
    blocks.forEach((block)=>{
        if (block.children && block.children.length > 0) {
            const childDepth = getMaxDepth(block.children, currentDepth + 1);
            maxDepth = Math.max(maxDepth, childDepth);
        }
    });
    return maxDepth;
}
function blocksToNavigatorNodes(blocks, selectedBlockId, expandedIds, depth = 0) {
    return blocks.map((block)=>{
        const node = {
            id: block.id,
            label: block.template?.name || 'Untitled Block',
            type: block.containerType,
            isVisible: block.isVisible,
            isSelected: block.id === selectedBlockId,
            isExpanded: expandedIds.has(block.id),
            depth,
            children: block.children && block.children.length > 0 ? blocksToNavigatorNodes(block.children, selectedBlockId, expandedIds, depth + 1) : undefined
        };
        return node;
    });
}
function mergeConfigs(block) {
    return {
        ...block.contentConfig,
        ...block.styleConfig,
        ...block.advancedConfig
    };
}
function splitConfigIntoTabs(config, schema) {
    // This is a simplified version - in reality, you'd use the schema to determine
    // which fields belong in which tab
    const contentConfig = {};
    const styleConfig = {};
    const advancedConfig = {};
    Object.entries(config).forEach(([key, value])=>{
        // Style-related keys
        if (key.includes('color') || key.includes('background') || key.includes('font') || key.includes('padding') || key.includes('margin') || key.includes('border')) {
            styleConfig[key] = value;
        } else if (key.includes('animation') || key.includes('custom') || key.includes('position') || key.includes('zIndex')) {
            advancedConfig[key] = value;
        } else {
            contentConfig[key] = value;
        }
    });
    return {
        contentConfig,
        styleConfig,
        advancedConfig
    };
}
function reorderBlocks(blocks, oldIndex, newIndex) {
    const result = Array.from(blocks);
    const [removed] = result.splice(oldIndex, 1);
    result.splice(newIndex, 0, removed);
    // Update order values
    return result.map((block, index)=>({
            ...block,
            order: index
        }));
}
function normalizeBlockOrders(blocks) {
    return blocks.map((block, index)=>{
        const updated = {
            ...block,
            order: index
        };
        if (block.children && block.children.length > 0) {
            updated.children = normalizeBlockOrders(block.children);
        }
        return updated;
    });
}
function validateBlockTree(blocks) {
    const errors = [];
    const blockIds = new Set();
    const validate = (block, ancestors = [])=>{
        // Check for duplicate IDs
        if (blockIds.has(block.id)) {
            errors.push(`Duplicate block ID: ${block.id}`);
        }
        blockIds.add(block.id);
        // Check for circular references
        if (ancestors.includes(block.id)) {
            errors.push(`Circular reference detected: ${block.id}`);
        }
        // Check children
        if (block.children) {
            // Non-containers shouldn't have children
            if (!isContainer(block)) {
                errors.push(`Non-container block ${block.id} has children`);
            }
            block.children.forEach((child)=>{
                validate(child, [
                    ...ancestors,
                    block.id
                ]);
            });
        }
    };
    blocks.forEach((block)=>validate(block));
    return {
        isValid: errors.length === 0,
        errors
    };
}
function searchBlocks(blocks, query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    const search = (block)=>{
        const templateName = block.template?.name?.toLowerCase() || '';
        const configStr = JSON.stringify(block.contentConfig).toLowerCase();
        if (templateName.includes(lowerQuery) || configStr.includes(lowerQuery)) {
            results.push(block);
        }
        if (block.children && block.children.length > 0) {
            block.children.forEach(search);
        }
    };
    blocks.forEach(search);
    return results;
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
"[project]/src/hooks/useKeyboardShortcuts.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Keyboard Shortcuts Hook
 *
 * Global keyboard shortcut handler for the editor.
 * Matches Elementor's keyboard shortcuts.
 */ __turbopack_context__.s([
    "createEditorShortcuts",
    ()=>createEditorShortcuts,
    "formatShortcut",
    ()=>formatShortcut,
    "useKeyboardShortcuts",
    ()=>useKeyboardShortcuts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
function useKeyboardShortcuts({ enabled = true, shortcuts }) {
    const handleKeyDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        if (!enabled) return;
        // Don't trigger shortcuts when typing in inputs, textareas, or contenteditable
        const target = event.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            return;
        }
        for (const shortcut of shortcuts){
            const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
            const ctrlMatches = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
            const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey;
            const altMatches = shortcut.alt ? event.altKey : !event.altKey;
            const metaMatches = shortcut.meta ? event.metaKey : !event.metaKey;
            if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
                if (shortcut.preventDefault !== false) {
                    event.preventDefault();
                }
                shortcut.action();
                break;
            }
        }
    }, [
        enabled,
        shortcuts
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        window.addEventListener('keydown', handleKeyDown);
        return ()=>{
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [
        handleKeyDown
    ]);
}
function createEditorShortcuts(handlers) {
    const shortcuts = [];
    if (handlers.onSave) {
        shortcuts.push({
            key: 's',
            ctrl: true,
            description: 'Save page',
            action: handlers.onSave
        });
    }
    if (handlers.onUndo) {
        shortcuts.push({
            key: 'z',
            ctrl: true,
            description: 'Undo',
            action: handlers.onUndo
        });
    }
    if (handlers.onRedo) {
        shortcuts.push({
            key: 'z',
            ctrl: true,
            shift: true,
            description: 'Redo',
            action: handlers.onRedo
        });
        shortcuts.push({
            key: 'y',
            ctrl: true,
            description: 'Redo',
            action: handlers.onRedo
        });
    }
    if (handlers.onCopy) {
        shortcuts.push({
            key: 'c',
            ctrl: true,
            description: 'Copy selected block',
            action: handlers.onCopy
        });
    }
    if (handlers.onPaste) {
        shortcuts.push({
            key: 'v',
            ctrl: true,
            description: 'Paste block',
            action: handlers.onPaste
        });
    }
    if (handlers.onDuplicate) {
        shortcuts.push({
            key: 'd',
            ctrl: true,
            description: 'Duplicate selected block',
            action: handlers.onDuplicate
        });
    }
    if (handlers.onDelete) {
        shortcuts.push({
            key: 'Delete',
            description: 'Delete selected block',
            action: handlers.onDelete
        });
        shortcuts.push({
            key: 'Backspace',
            description: 'Delete selected block',
            action: handlers.onDelete
        });
    }
    if (handlers.onOpenFinder) {
        shortcuts.push({
            key: 'e',
            ctrl: true,
            description: 'Open Finder',
            action: handlers.onOpenFinder
        });
        shortcuts.push({
            key: 'k',
            ctrl: true,
            description: 'Open Finder',
            action: handlers.onOpenFinder
        });
    }
    if (handlers.onOpenHistory) {
        shortcuts.push({
            key: 'h',
            ctrl: true,
            description: 'Open History',
            action: handlers.onOpenHistory
        });
    }
    if (handlers.onToggleDeviceMode) {
        shortcuts.push({
            key: 'm',
            ctrl: true,
            description: 'Toggle device mode',
            action: handlers.onToggleDeviceMode
        });
    }
    if (handlers.onShowHelp) {
        shortcuts.push({
            key: '/',
            ctrl: true,
            description: 'Show keyboard shortcuts',
            action: handlers.onShowHelp
        });
    }
    if (handlers.onSelectAll) {
        shortcuts.push({
            key: 'a',
            ctrl: true,
            description: 'Select all blocks',
            action: handlers.onSelectAll
        });
    }
    if (handlers.onDeselectAll) {
        shortcuts.push({
            key: 'Escape',
            description: 'Deselect all',
            action: handlers.onDeselectAll
        });
    }
    return shortcuts;
}
function formatShortcut(shortcut) {
    const parts = [];
    if (shortcut.ctrl || shortcut.meta) {
        parts.push('Ctrl');
    }
    if (shortcut.shift) {
        parts.push('Shift');
    }
    if (shortcut.alt) {
        parts.push('Alt');
    }
    parts.push(shortcut.key.charAt(0).toUpperCase() + shortcut.key.slice(1));
    return parts.join('+');
}
}),
"[project]/src/hooks/useEnhancedPageEditor.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Enhanced Page Editor Hook
 *
 * Supports:
 * - Nested containers with children
 * - Three-tab configuration (content, style, advanced)
 * - Move blocks between containers
 * - Visibility toggling
 * - Hover state management
 * - Clipboard operations
 */ __turbopack_context__.s([
    "useEnhancedPageEditor",
    ()=>useEnhancedPageEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$editor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/editor.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$editor$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/editor-utils.ts [app-ssr] (ecmascript)");
;
;
;
;
;
function useEnhancedPageEditor({ pageId, initialBlocks = [], initialPageData = {}, autoSaveEnabled = true, autoSaveDelay = 2000, templates = [] }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    // Core state
    const [blocks, setBlocks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialBlocks);
    const [pageData, setPageData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialPageData);
    const [selectedBlockId, setSelectedBlockId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hoveredBlockId, setHoveredBlockId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [deviceMode, setDeviceMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$editor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DeviceMode"].DESKTOP);
    const [clipboard, setClipboard] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Save state
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDirty, setIsDirty] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [autoSaveStatus, setAutoSaveStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('idle');
    const autoSaveTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastSavedStateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])('');
    // History state (Undo/Redo)
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [historyIndex, setHistoryIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(-1);
    const maxHistorySize = 50;
    const historyUpdateTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Initialize blocks
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialBlocks.length > 0 && blocks.length === 0) {
            setBlocks(initialBlocks);
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
    // Save to history (debounced)
    const saveToHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((blocksToSave, pageDataToSave)=>{
        if (historyUpdateTimeoutRef.current) {
            clearTimeout(historyUpdateTimeoutRef.current);
        }
        historyUpdateTimeoutRef.current = setTimeout(()=>{
            setHistory((prev)=>{
                const newHistory = prev.slice(0, historyIndex + 1);
                newHistory.push({
                    blocks: blocksToSave,
                    pageData: pageDataToSave
                });
                if (newHistory.length > maxHistorySize) {
                    newHistory.shift();
                    return newHistory;
                }
                return newHistory;
            });
            setHistoryIndex((prev)=>Math.min(prev + 1, maxHistorySize - 1));
        }, 500);
    }, [
        historyIndex,
        maxHistorySize
    ]);
    // Undo/Redo
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
    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;
    // LocalStorage backup
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
    // Load from localStorage
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
    // Block operations
    const generateBlockId = ()=>`temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const addBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((template, parentId)=>{
        const { contentConfig, styleConfig, advancedConfig } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$editor$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["splitConfigIntoTabs"])(template.defaultConfig || {}, template.configSchema);
        const newBlock = {
            id: generateBlockId(),
            templateId: template.id,
            containerType: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$editor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContainerType"].BLOCK,
            parentId: parentId || null,
            contentConfig,
            styleConfig,
            advancedConfig,
            config: template.defaultConfig,
            order: blocks.filter((b)=>b.parentId === parentId).length,
            isVisible: true,
            template
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
        blocks,
        pageData,
        saveToHistory
    ]);
    const addContainerBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((containerType, parentId)=>{
        // Find the appropriate container template based on container type
        const templateSlug = containerType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$editor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContainerType"].SECTION ? 'section-container' : containerType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$editor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContainerType"].FLEXBOX ? 'flexbox-container' : containerType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$editor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContainerType"].GRID ? 'grid-container' : 'container';
        const containerTemplate = templates.find((t)=>t.slug === templateSlug);
        if (!containerTemplate) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Container template "${templateSlug}" not found. Please run the container templates seed script.`);
            console.error(`Container template not found for slug: ${templateSlug}`);
            return;
        }
        const newBlock = {
            id: generateBlockId(),
            templateId: containerTemplate.id,
            template: containerTemplate,
            containerType,
            parentId: parentId || null,
            contentConfig: containerTemplate.defaultConfig || {},
            styleConfig: {},
            advancedConfig: {},
            layoutSettings: containerType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$editor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContainerType"].FLEXBOX ? {
                direction: 'row',
                wrap: 'nowrap',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                gap: 16
            } : containerType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$editor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContainerType"].GRID ? {
                columns: 2,
                columnGap: 16,
                rowGap: 16
            } : undefined,
            order: blocks.filter((b)=>b.parentId === parentId).length,
            isVisible: true,
            children: []
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
        blocks,
        pageData,
        saveToHistory,
        templates
    ]);
    const updateBlockConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((blockId, tab, newConfig)=>{
        setBlocks((prev)=>{
            const updated = prev.map((block)=>{
                if (block.id === blockId) {
                    return {
                        ...block,
                        [`${tab}Config`]: newConfig
                    };
                }
                return block;
            });
            saveToHistory(updated, pageData);
            return updated;
        });
        setIsDirty(true);
    }, [
        pageData,
        saveToHistory
    ]);
    const removeBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((blockId)=>{
        setBlocks((prev)=>{
            const blockTree = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$editor$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildBlockTree"])(prev);
            const withoutBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$editor$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeBlockFromTree"])(blockTree, blockId);
            const flattened = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$editor$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["flattenBlockTree"])(withoutBlock);
            const normalized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$editor$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeBlockOrders"])(flattened);
            saveToHistory(normalized, pageData);
            return normalized;
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
        const blockToDuplicate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$editor$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findBlockById"])(blocks, blockId);
        if (!blockToDuplicate) return;
        const duplicated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$editor$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["duplicateBlock"])(blockToDuplicate, generateBlockId);
        setBlocks((prev)=>{
            const updated = [
                ...prev,
                duplicated
            ];
            saveToHistory(updated, pageData);
            return updated;
        });
        setSelectedBlockId(duplicated.id);
        setIsDirty(true);
    }, [
        blocks,
        pageData,
        saveToHistory
    ]);
    const moveBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((blockId, newParentId, newOrder)=>{
        setBlocks((prev)=>{
            const block = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$editor$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findBlockById"])(prev, blockId);
            if (!block) return prev;
            // Update block's parent and order
            const updatedBlock = {
                ...block,
                parentId: newParentId,
                order: newOrder
            };
            const updated = prev.map((b)=>b.id === blockId ? updatedBlock : b);
            const normalized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$editor$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeBlockOrders"])(updated);
            saveToHistory(normalized, pageData);
            return normalized;
        });
        setIsDirty(true);
    }, [
        pageData,
        saveToHistory
    ]);
    const reorderBlocks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newBlocks)=>{
        const normalized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$editor$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeBlockOrders"])(newBlocks);
        setBlocks(normalized);
        saveToHistory(normalized, pageData);
        setIsDirty(true);
    }, [
        pageData,
        saveToHistory
    ]);
    const toggleBlockVisibility = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((blockId)=>{
        setBlocks((prev)=>{
            const updated = prev.map((block)=>block.id === blockId ? {
                    ...block,
                    isVisible: !block.isVisible
                } : block);
            saveToHistory(updated, pageData);
            return updated;
        });
        setIsDirty(true);
    }, [
        pageData,
        saveToHistory
    ]);
    // Clipboard operations
    const copyBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((blockId)=>{
        const block = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$editor$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findBlockById"])(blocks, blockId);
        if (block) {
            setClipboard({
                type: 'block',
                data: block,
                timestamp: Date.now()
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Block copied to clipboard');
        }
    }, [
        blocks
    ]);
    const copyStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((blockId)=>{
        const block = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$editor$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findBlockById"])(blocks, blockId);
        if (block && block.styleConfig) {
            setClipboard({
                type: 'style',
                data: block.styleConfig,
                timestamp: Date.now()
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Style copied to clipboard');
        }
    }, [
        blocks
    ]);
    const pasteBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((parentId)=>{
        if (!clipboard || clipboard.type !== 'block') return;
        const block = clipboard.data;
        const duplicated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$editor$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["duplicateBlock"])(block, generateBlockId);
        duplicated.parentId = parentId || null;
        duplicated.order = blocks.filter((b)=>b.parentId === parentId).length;
        setBlocks((prev)=>{
            const updated = [
                ...prev,
                duplicated
            ];
            saveToHistory(updated, pageData);
            return updated;
        });
        setSelectedBlockId(duplicated.id);
        setIsDirty(true);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Block pasted');
    }, [
        clipboard,
        blocks,
        pageData,
        saveToHistory
    ]);
    const pasteStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((blockId)=>{
        if (!clipboard || clipboard.type !== 'style') return;
        updateBlockConfig(blockId, 'style', clipboard.data);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Style pasted');
    }, [
        clipboard,
        updateBlockConfig
    ]);
    // Page data operations
    const updatePageData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((field, value)=>{
        setPageData((prev)=>{
            const updated = {
                ...prev,
                [field]: value
            };
            saveToHistory(blocks, updated);
            return updated;
        });
        setIsDirty(true);
    }, [
        blocks,
        saveToHistory
    ]);
    // Save page
    const savePage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (isAutoSave = false)=>{
        setIsSaving(true);
        if (isAutoSave) {
            setAutoSaveStatus('saving');
        }
        try {
            // Save page data
            const pageResponse = await fetch(`/api/admin/cms/pages/${pageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pageData)
            });
            if (!pageResponse.ok) {
                const errorData = await pageResponse.json().catch(()=>({}));
                throw new Error(errorData.error || 'Failed to save page data');
            }
            // Sync blocks
            const blocksResponse = await fetch(`/api/admin/cms/pages/${pageId}/sync-blocks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    blocks: blocks.map((block)=>({
                            id: block.id,
                            templateId: block.templateId,
                            containerType: block.containerType,
                            parentId: block.parentId,
                            contentConfig: block.contentConfig,
                            styleConfig: block.styleConfig,
                            advancedConfig: block.advancedConfig,
                            layoutSettings: block.layoutSettings,
                            order: block.order,
                            isVisible: block.isVisible,
                            // Keep legacy config for backwards compatibility
                            config: block.config || block.contentConfig
                        }))
                })
            });
            if (!blocksResponse.ok) {
                throw new Error('Failed to save blocks');
            }
            const data = await blocksResponse.json();
            if (data.page?.blocks) {
                const updatedBlocks = data.page.blocks.map((block)=>{
                    const existingBlock = blocks.find((b)=>b.id === block.id || b.templateId === block.templateId && b.order === block.order);
                    return {
                        ...block,
                        template: block.template || existingBlock?.template
                    };
                });
                setBlocks(updatedBlocks);
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
    // Auto-save
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!autoSaveEnabled || !isDirty) {
            return;
        }
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }
        saveToLocalStorage(blocks, pageData);
        autoSaveTimeoutRef.current = setTimeout(()=>{
            const currentState = JSON.stringify({
                blocks,
                pageData
            });
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
        // State
        blocks,
        pageData,
        selectedBlockId,
        hoveredBlockId,
        deviceMode,
        clipboard,
        isSaving,
        isDirty,
        autoSaveStatus,
        canUndo,
        canRedo,
        // Block operations
        addBlock,
        addContainerBlock,
        updateBlockConfig,
        removeBlock,
        duplicateBlock,
        moveBlock,
        reorderBlocks,
        toggleBlockVisibility,
        // Clipboard
        copyBlock,
        copyStyle,
        pasteBlock,
        pasteStyle,
        // Page operations
        updatePageData,
        savePage,
        // History
        undo,
        redo,
        // UI state
        setSelectedBlockId,
        setHoveredBlockId,
        setDeviceMode
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
"[project]/src/types/editor.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * CMS Page Editor Types
 *
 * Comprehensive type definitions for the Elementor-style page builder
 * with support for nested containers, three-tab configuration, and advanced features.
 */ // ============================================
// Enums
// ============================================
__turbopack_context__.s([
    "BlockCategory",
    ()=>BlockCategory,
    "ContainerType",
    ()=>ContainerType,
    "DeviceMode",
    ()=>DeviceMode
]);
var ContainerType = /*#__PURE__*/ function(ContainerType) {
    ContainerType["BLOCK"] = "BLOCK";
    ContainerType["SECTION"] = "SECTION";
    ContainerType["FLEXBOX"] = "FLEXBOX";
    ContainerType["GRID"] = "GRID";
    return ContainerType;
}({});
var BlockCategory = /*#__PURE__*/ function(BlockCategory) {
    BlockCategory["HERO"] = "HERO";
    BlockCategory["CONTENT"] = "CONTENT";
    BlockCategory["FEATURES"] = "FEATURES";
    BlockCategory["CTA"] = "CTA";
    BlockCategory["TESTIMONIALS"] = "TESTIMONIALS";
    BlockCategory["PRICING"] = "PRICING";
    BlockCategory["TEAM"] = "TEAM";
    BlockCategory["STATS"] = "STATS";
    BlockCategory["LOGO_GRID"] = "LOGO_GRID";
    BlockCategory["FORM"] = "FORM";
    BlockCategory["FAQ"] = "FAQ";
    BlockCategory["GALLERY"] = "GALLERY";
    BlockCategory["VIDEO"] = "VIDEO";
    BlockCategory["NAVIGATION"] = "NAVIGATION";
    BlockCategory["HEADER"] = "HEADER";
    BlockCategory["FOOTER"] = "FOOTER";
    BlockCategory["SOCIAL"] = "SOCIAL";
    BlockCategory["BREADCRUMBS"] = "BREADCRUMBS";
    BlockCategory["DIVIDER"] = "DIVIDER";
    BlockCategory["SPACER"] = "SPACER";
    BlockCategory["CUSTOM"] = "CUSTOM";
    BlockCategory["PRODUCT"] = "PRODUCT";
    BlockCategory["BLOG"] = "BLOG";
    BlockCategory["CONTAINER"] = "CONTAINER";
    BlockCategory["LAYOUT"] = "LAYOUT";
    return BlockCategory;
}({});
var DeviceMode = /*#__PURE__*/ function(DeviceMode) {
    DeviceMode["DESKTOP"] = "DESKTOP";
    DeviceMode["TABLET"] = "TABLET";
    DeviceMode["MOBILE"] = "MOBILE";
    return DeviceMode;
}({});
}),
];

//# sourceMappingURL=src_b0822135._.js.map
//# debugId=cec6f4d5-81a9-58a4-bd75-6b193bddc06b
