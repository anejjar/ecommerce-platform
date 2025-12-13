!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="08857798-9f70-57bb-824e-941765367fbd")}catch(e){}}();
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/src/types/editor.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/editor-utils.ts [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/src/lib/editor-utils.ts'\n\n'const' declarations must be initialized");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[project]/src/components/admin/cms/editor/PageEditor.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PageEditor",
    ()=>PageEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$normalizeBlockConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/normalizeBlockConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$editor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/editor.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$editor$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/editor-utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const PageEditor = ({ page, templates })=>{
    _s();
    // Transform initial blocks to match new EditorBlock interface
    const initialBlocks = page.blocks.map((block)=>{
        // Normalize config to ensure repeater fields are arrays
        const normalizedConfig = block.template?.configSchema ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$normalizeBlockConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeBlockConfig"])(block.config || {}, block.template.configSchema) : block.config || {};
        // If block has new structure, use it; otherwise split old config
        let contentConfig, styleConfig, advancedConfig;
        if (block.contentConfig) {
            // Block already has new structure
            contentConfig = block.contentConfig;
            styleConfig = block.styleConfig || {};
            advancedConfig = block.advancedConfig || {};
        } else {
            // Migrate from old config structure
            const split = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$editor$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["splitConfigIntoTabs"])(normalizedConfig, block.template?.configSchema);
            contentConfig = split.contentConfig;
            styleConfig = split.styleConfig;
            advancedConfig = split.advancedConfig;
        }
        return {
            id: block.id,
            templateId: block.templateId,
            containerType: block.containerType || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$editor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContainerType"].BLOCK,
            parentId: block.parentId || null,
            contentConfig,
            styleConfig,
            advancedConfig,
            layoutSettings: block.layoutSettings || undefined,
            config: normalizedConfig,
            order: block.order,
            isVisible: block.isVisible !== false,
            template: block.template
        };
    });
    const { blocks, pageData, selectedBlockId, setSelectedBlockId, addBlock, updateBlockConfig, updatePageData, removeBlock, reorderBlocks, savePage, isSaving, isDirty, autoSaveStatus, undo, redo, canUndo, canRedo, duplicateBlock } = usePageEditor({
        pageId: page.id,
        initialBlocks,
        initialPageData: {
            title: page.title,
            slug: page.slug,
            description: page.description,
            seoTitle: page.seoTitle,
            seoDescription: page.seoDescription,
            seoKeywords: page.seoKeywords,
            status: page.status,
            overridesStorefrontPage: page.overridesStorefrontPage ?? false,
            overriddenPageType: page.overriddenPageType || null
        },
        templates: templates
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditorLayout, {
        pageTitle: pageData.title || page.title,
        pageId: page.id,
        pageSlug: pageData.slug || page.slug,
        pageData: {
            ...pageData,
            overridesStorefrontPage: pageData.overridesStorefrontPage ?? page.overridesStorefrontPage ?? false,
            overriddenPageType: pageData.overriddenPageType ?? page.overriddenPageType ?? null
        },
        blocks: blocks,
        templates: templates,
        selectedBlockId: selectedBlockId,
        isSaving: isSaving,
        isDirty: isDirty,
        autoSaveStatus: autoSaveStatus,
        onAddBlock: addBlock,
        onSelectBlock: setSelectedBlockId,
        onRemoveBlock: removeBlock,
        onReorderBlocks: reorderBlocks,
        onUpdateBlockConfig: updateBlockConfig,
        onUpdatePageData: updatePageData,
        onSave: savePage,
        onUndo: undo,
        onRedo: redo,
        canUndo: canUndo,
        canRedo: canRedo,
        onDuplicateBlock: duplicateBlock
    }, void 0, false, {
        fileName: "[project]/src/components/admin/cms/editor/PageEditor.tsx",
        lineNumber: 107,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(PageEditor, "Jp+5NNmaAtYUj77arFJYGi4+WAo=", true);
_c = PageEditor;
var _c;
__turbopack_context__.k.register(_c, "PageEditor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_afcf685e._.js.map
//# debugId=08857798-9f70-57bb-824e-941765367fbd
