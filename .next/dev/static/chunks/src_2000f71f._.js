!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d7fb0e74-e4d3-580f-9436-d42262ece744")}catch(e){}}();
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/redux/features/cartSlice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addToCart",
    ()=>addToCart,
    "clearCart",
    ()=>clearCart,
    "closeCart",
    ()=>closeCart,
    "default",
    ()=>__TURBOPACK__default__export__,
    "openCart",
    ()=>openCart,
    "removeFromCart",
    ()=>removeFromCart,
    "toggleCart",
    ()=>toggleCart,
    "updateQuantity",
    ()=>updateQuantity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
;
const initialState = {
    items: [],
    isOpen: false
};
const cartSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action)=>{
            // Find existing item: same product AND same variant (or both null)
            const existing = state.items.find((item)=>item.productId === action.payload.productId && item.variantId === action.payload.variantId);
            if (existing) {
                existing.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
        },
        removeFromCart: (state, action)=>{
            // Remove by unique cart item ID
            state.items = state.items.filter((item)=>item.id !== action.payload);
        },
        updateQuantity: (state, action)=>{
            // Update by unique cart item ID
            const item = state.items.find((item)=>item.id === action.payload.id);
            if (item) {
                item.quantity = action.payload.quantity;
            }
        },
        clearCart: (state)=>{
            state.items = [];
        },
        toggleCart: (state)=>{
            state.isOpen = !state.isOpen;
        },
        openCart: (state)=>{
            state.isOpen = true;
        },
        closeCart: (state)=>{
            state.isOpen = false;
        }
    }
});
const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, openCart, closeCart } = cartSlice.actions;
const __TURBOPACK__default__export__ = cartSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/redux/features/wishlistSlice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addToWishlist",
    ()=>addToWishlist,
    "clearWishlist",
    ()=>clearWishlist,
    "default",
    ()=>__TURBOPACK__default__export__,
    "removeFromWishlist",
    ()=>removeFromWishlist,
    "setLoading",
    ()=>setLoading,
    "setWishlist",
    ()=>setWishlist
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
;
const initialState = {
    items: [],
    isLoading: false,
    productIds: []
};
const wishlistSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'wishlist',
    initialState,
    reducers: {
        setWishlist: (state, action)=>{
            state.items = action.payload;
            state.productIds = action.payload.map((item)=>item.productId);
            state.isLoading = false;
        },
        addToWishlist: (state, action)=>{
            state.items.unshift(action.payload);
            if (!state.productIds.includes(action.payload.productId)) {
                state.productIds.push(action.payload.productId);
            }
        },
        removeFromWishlist: (state, action)=>{
            const productId = action.payload;
            state.items = state.items.filter((item)=>item.productId !== productId);
            state.productIds = state.productIds.filter((id)=>id !== productId);
        },
        setLoading: (state, action)=>{
            state.isLoading = action.payload;
        },
        clearWishlist: (state)=>{
            state.items = [];
            state.productIds = [];
            state.isLoading = false;
        }
    }
});
const { setWishlist, addToWishlist, removeFromWishlist, setLoading, clearWishlist } = wishlistSlice.actions;
const __TURBOPACK__default__export__ = wishlistSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/redux/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "makeStore",
    ()=>makeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2f$dist$2f$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/redux/dist/redux.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/redux-persist/es/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$persistReducer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__persistReducer$3e$__ = __turbopack_context__.i("[project]/node_modules/redux-persist/es/persistReducer.js [app-client] (ecmascript) <export default as persistReducer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$lib$2f$storage$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/redux-persist/lib/storage/index.js [app-client] (ecmascript)"); // localStorage
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redux$2f$features$2f$cartSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/redux/features/cartSlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redux$2f$features$2f$wishlistSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/redux/features/wishlistSlice.ts [app-client] (ecmascript)");
;
;
;
;
;
const persistConfig = {
    key: 'root',
    storage: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$lib$2f$storage$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    whitelist: [
        'cart'
    ]
};
const rootReducer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2f$dist$2f$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["combineReducers"])({
    cart: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redux$2f$features$2f$cartSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    wishlist: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redux$2f$features$2f$wishlistSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
});
const persistedReducer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$persistReducer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__persistReducer$3e$__["persistReducer"])(persistConfig, rootReducer);
const makeStore = ()=>{
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["configureStore"])({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware)=>getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [
                        'persist/PERSIST',
                        'persist/REHYDRATE'
                    ]
                }
            })
    });
    return store;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/redux/StoreProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StoreProvider",
    ()=>StoreProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$integration$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/redux-persist/es/integration/react.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/redux-persist/es/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$persistStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__persistStore$3e$__ = __turbopack_context__.i("[project]/node_modules/redux-persist/es/persistStore.js [app-client] (ecmascript) <export default as persistStore>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redux$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/redux/store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function StoreProvider({ children }) {
    _s();
    const storeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    const persistorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    if (!storeRef.current) {
        storeRef.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redux$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeStore"])();
        persistorRef.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$persistStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__persistStore$3e$__["persistStore"])(storeRef.current);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"], {
        store: storeRef.current,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$integration$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PersistGate"], {
            loading: null,
            persistor: persistorRef.current,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/lib/redux/StoreProvider.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/lib/redux/StoreProvider.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_s(StoreProvider, "F1YYckPwx8pQjqskrsAXgkbfET8=");
_c = StoreProvider;
var _c;
__turbopack_context__.k.register(_c, "StoreProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/SessionProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SessionProvider",
    ()=>SessionProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [app-client] (ecmascript)");
'use client';
;
;
function SessionProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SessionProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/SessionProvider.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
_c = SessionProvider;
var _c;
__turbopack_context__.k.register(_c, "SessionProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/SettingsContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SettingsProvider",
    ()=>SettingsProvider,
    "useSettings",
    ()=>useSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const SettingsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function SettingsProvider({ children }) {
    _s();
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const fetchSettings = async ()=>{
        try {
            setIsLoading(true);
            // Fetch all settings categories
            const categories = [
                'general',
                'seo',
                'appearance',
                'social',
                'shipping'
            ];
            const promises = categories.map(async (category)=>{
                const response = await fetch(`/api/settings?category=${category}`);
                if (response.ok) {
                    return await response.json();
                }
                return {};
            });
            const results = await Promise.all(promises);
            const allSettings = results.reduce((acc, result)=>({
                    ...acc,
                    ...result
                }), {});
            setSettings(allSettings);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally{
            setIsLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SettingsProvider.useEffect": ()=>{
            fetchSettings();
        }
    }["SettingsProvider.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SettingsContext.Provider, {
        value: {
            settings,
            isLoading,
            refreshSettings: fetchSettings
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/SettingsContext.tsx",
        lineNumber: 97,
        columnNumber: 5
    }, this);
}
_s(SettingsProvider, "cKvIZ2T8QsEPZ9LHplACmQ5i4Sc=");
_c = SettingsProvider;
function useSettings() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
_s1(useSettings, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "SettingsProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/CustomScripts.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomScripts",
    ()=>CustomScripts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/SettingsContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function CustomScripts() {
    _s();
    const { settings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"])();
    const googleAnalyticsId = settings.seo_google_analytics_id;
    const facebookPixelId = settings.social_facebook_pixel_id;
    const customJS = settings.appearance_custom_js;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomScripts.useEffect": ()=>{
            // Inject custom JavaScript if provided
            if (customJS) {
                try {
                    const script = document.createElement('script');
                    script.textContent = customJS;
                    document.body.appendChild(script);
                    return ({
                        "CustomScripts.useEffect": ()=>{
                            document.body.removeChild(script);
                        }
                    })["CustomScripts.useEffect"];
                } catch (error) {
                    console.error('Error loading custom JS:', error);
                }
            }
        }
    }["CustomScripts.useEffect"], [
        customJS
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            googleAnalyticsId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`,
                        strategy: "afterInteractive"
                    }, void 0, false, {
                        fileName: "[project]/src/components/CustomScripts.tsx",
                        lineNumber: 36,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        id: "google-analytics",
                        strategy: "afterInteractive",
                        children: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}');
            `
                    }, void 0, false, {
                        fileName: "[project]/src/components/CustomScripts.tsx",
                        lineNumber: 40,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            facebookPixelId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "facebook-pixel",
                strategy: "afterInteractive",
                children: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${facebookPixelId}');
            fbq('track', 'PageView');
          `
            }, void 0, false, {
                fileName: "[project]/src/components/CustomScripts.tsx",
                lineNumber: 53,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s(CustomScripts, "fVYezonQTXA8rNz4LCGuPfefvVY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"]
    ];
});
_c = CustomScripts;
var _c;
__turbopack_context__.k.register(_c, "CustomScripts");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/CustomStyles.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomStyles",
    ()=>CustomStyles
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/SettingsContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function CustomStyles() {
    _s();
    const { settings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"])();
    const customCSS = settings.appearance_custom_css;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomStyles.useEffect": ()=>{
            // Inject custom CSS if provided
            if (customCSS) {
                const style = document.createElement('style');
                style.textContent = customCSS;
                style.id = 'custom-store-styles';
                document.head.appendChild(style);
                return ({
                    "CustomStyles.useEffect": ()=>{
                        const existingStyle = document.getElementById('custom-store-styles');
                        if (existingStyle) {
                            document.head.removeChild(existingStyle);
                        }
                    }
                })["CustomStyles.useEffect"];
            }
        }
    }["CustomStyles.useEffect"], [
        customCSS
    ]);
    return null; // This component doesn't render anything
}
_s(CustomStyles, "fVYezonQTXA8rNz4LCGuPfefvVY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"]
    ];
});
_c = CustomStyles;
var _c;
__turbopack_context__.k.register(_c, "CustomStyles");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/PopupManager.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PopupManager",
    ()=>PopupManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function PopupManager() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [popups, setPopups] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activePopup, setActivePopup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Determine current page type
    const getPageType = ()=>{
        if (pathname === '/') return 'HOMEPAGE';
        if (pathname.startsWith('/products/')) return 'PRODUCT_PAGES';
        if (pathname === '/cart') return 'CART_PAGE';
        if (pathname.startsWith('/checkout')) return 'CHECKOUT';
        if (pathname.startsWith('/blog')) return 'BLOG';
        return 'ALL_PAGES';
    };
    // Check if popup should be shown based on frequency
    const shouldShowPopup = (popup)=>{
        const storageKey = `popup_${popup.id}_last_shown`;
        const lastShown = localStorage.getItem(storageKey);
        if (!lastShown) return true;
        const lastShownTime = parseInt(lastShown);
        const now = Date.now();
        switch(popup.frequency){
            case 'always':
                return true;
            case 'once_per_session':
                return false; // Already shown this session
            case 'once_per_day':
                return now - lastShownTime > 24 * 60 * 60 * 1000;
            case 'once_per_week':
                return now - lastShownTime > 7 * 24 * 60 * 60 * 1000;
            default:
                return true;
        }
    };
    // Mark popup as shown
    const markPopupShown = (popup)=>{
        const storageKey = `popup_${popup.id}_last_shown`;
        localStorage.setItem(storageKey, Date.now().toString());
    };
    // Track analytics event
    const trackEvent = async (popupId, event)=>{
        try {
            await fetch(`/api/popups/${popupId}/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    event
                })
            });
        } catch (error) {
            console.error('Error tracking popup event:', error);
        }
    };
    // Show popup
    const showPopup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PopupManager.useCallback[showPopup]": (popup)=>{
            if (!shouldShowPopup(popup)) return;
            setActivePopup(popup);
            setIsVisible(true);
            markPopupShown(popup);
            trackEvent(popup.id, 'view');
        }
    }["PopupManager.useCallback[showPopup]"], []);
    // Close popup
    const closePopup = ()=>{
        if (activePopup) {
            trackEvent(activePopup.id, 'dismissal');
        }
        setIsVisible(false);
        setTimeout(()=>setActivePopup(null), 300); // Allow animation to complete
    };
    // Handle CTA click
    const handleCTAClick = ()=>{
        if (!activePopup) return;
        trackEvent(activePopup.id, 'click');
        if (activePopup.ctaType === 'link' && activePopup.ctaUrl) {
            window.location.href = activePopup.ctaUrl;
        } else if (activePopup.ctaType === 'discount_code') {
            // Copy discount code to clipboard
            if (activePopup.discountCode) {
                navigator.clipboard.writeText(activePopup.discountCode);
                alert(`Discount code ${activePopup.discountCode} copied to clipboard!`);
            }
        } else if (activePopup.ctaType === 'email_capture') {
            trackEvent(activePopup.id, 'conversion');
            closePopup();
        }
    };
    // Fetch active popups
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PopupManager.useEffect": ()=>{
            const fetchPopups = {
                "PopupManager.useEffect.fetchPopups": async ()=>{
                    try {
                        const pageType = getPageType();
                        const response = await fetch(`/api/popups/active?page=${pageType}&url=${pathname}`);
                        if (response.ok) {
                            const data = await response.json();
                            setPopups(data);
                        }
                    } catch (error) {
                        console.error('Error fetching popups:', error);
                    }
                }
            }["PopupManager.useEffect.fetchPopups"];
            fetchPopups();
        }
    }["PopupManager.useEffect"], [
        pathname
    ]);
    // Setup triggers
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PopupManager.useEffect": ()=>{
            if (popups.length === 0 || activePopup) return;
            const triggerPopup = popups[0]; // Take highest priority popup
            // Wait for initial delay
            const initialDelay = setTimeout({
                "PopupManager.useEffect.initialDelay": ()=>{
                    switch(triggerPopup.type){
                        case 'EXIT_INTENT':
                            setupExitIntent(triggerPopup);
                            break;
                        case 'TIMED':
                            setTimeout({
                                "PopupManager.useEffect.initialDelay": ()=>showPopup(triggerPopup)
                            }["PopupManager.useEffect.initialDelay"], (triggerPopup.triggerValue || 5) * 1000);
                            break;
                        case 'SCROLL_BASED':
                            setupScrollTrigger(triggerPopup);
                            break;
                        case 'PAGE_LOAD':
                            showPopup(triggerPopup);
                            break;
                    }
                }
            }["PopupManager.useEffect.initialDelay"], triggerPopup.delaySeconds * 1000);
            return ({
                "PopupManager.useEffect": ()=>clearTimeout(initialDelay)
            })["PopupManager.useEffect"];
        }
    }["PopupManager.useEffect"], [
        popups,
        activePopup,
        showPopup
    ]);
    // Exit intent detection
    const setupExitIntent = (popup)=>{
        const handleMouseLeave = (e)=>{
            if (e.clientY <= 0) {
                showPopup(popup);
                document.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
        document.addEventListener('mouseleave', handleMouseLeave);
        return ()=>document.removeEventListener('mouseleave', handleMouseLeave);
    };
    // Scroll-based trigger
    const setupScrollTrigger = (popup)=>{
        const handleScroll = ()=>{
            const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
            if (scrollPercentage >= (popup.triggerValue || 50)) {
                showPopup(popup);
                window.removeEventListener('scroll', handleScroll);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return ()=>window.removeEventListener('scroll', handleScroll);
    };
    // Get position styles
    const getPositionStyles = ()=>{
        if (!activePopup) return {};
        const base = {
            position: 'fixed',
            zIndex: 9999,
            width: `${activePopup.width}px`,
            height: activePopup.height ? `${activePopup.height}px` : 'auto'
        };
        switch(activePopup.position){
            case 'CENTER':
                return {
                    ...base,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                };
            case 'TOP':
                return {
                    ...base,
                    top: 0,
                    left: 0,
                    right: 0,
                    width: '100%'
                };
            case 'BOTTOM':
                return {
                    ...base,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    width: '100%'
                };
            case 'TOP_LEFT':
                return {
                    ...base,
                    top: '20px',
                    left: '20px'
                };
            case 'TOP_RIGHT':
                return {
                    ...base,
                    top: '20px',
                    right: '20px'
                };
            case 'BOTTOM_LEFT':
                return {
                    ...base,
                    bottom: '20px',
                    left: '20px'
                };
            case 'BOTTOM_RIGHT':
                return {
                    ...base,
                    bottom: '20px',
                    right: '20px'
                };
            default:
                return base;
        }
    };
    if (!activePopup) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `fixed inset-0 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`,
                style: {
                    backgroundColor: activePopup.overlayColor,
                    zIndex: 9998
                },
                onClick: closePopup
            }, void 0, false, {
                fileName: "[project]/src/components/PopupManager.tsx",
                lineNumber: 239,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`,
                style: {
                    ...getPositionStyles(),
                    backgroundColor: activePopup.backgroundColor,
                    color: activePopup.textColor
                },
                onClick: (e)=>e.stopPropagation(),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative rounded-lg shadow-2xl overflow-hidden",
                    children: [
                        activePopup.showCloseButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: closePopup,
                            className: "absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors z-10",
                            "aria-label": "Close popup",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PopupManager.tsx",
                                lineNumber: 270,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/PopupManager.tsx",
                            lineNumber: 265,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 space-y-4",
                            children: [
                                activePopup.imageUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: activePopup.imageUrl,
                                    alt: "Popup",
                                    className: "w-full h-auto rounded"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/PopupManager.tsx",
                                    lineNumber: 278,
                                    columnNumber: 15
                                }, this),
                                activePopup.title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-2xl font-bold",
                                    children: activePopup.title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/PopupManager.tsx",
                                    lineNumber: 287,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "prose max-w-none",
                                    dangerouslySetInnerHTML: {
                                        __html: activePopup.content
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/PopupManager.tsx",
                                    lineNumber: 291,
                                    columnNumber: 13
                                }, this),
                                activePopup.ctaType === 'email_capture' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: (e)=>{
                                        e.preventDefault();
                                        handleCTAClick();
                                    },
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "email",
                                            placeholder: "Enter your email",
                                            required: true,
                                            className: "w-full px-4 py-2 border rounded"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/PopupManager.tsx",
                                            lineNumber: 305,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            className: "w-full py-3 rounded font-semibold transition-colors",
                                            style: {
                                                backgroundColor: activePopup.buttonColor,
                                                color: activePopup.buttonTextColor
                                            },
                                            children: activePopup.buttonText
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/PopupManager.tsx",
                                            lineNumber: 311,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/PopupManager.tsx",
                                    lineNumber: 298,
                                    columnNumber: 15
                                }, this),
                                activePopup.ctaType === 'discount_code' && activePopup.discountCode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 bg-gray-100 rounded text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm text-gray-600 mb-1",
                                                    children: "Your discount code:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/PopupManager.tsx",
                                                    lineNumber: 328,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-2xl font-bold tracking-wider",
                                                    children: activePopup.discountCode
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/PopupManager.tsx",
                                                    lineNumber: 329,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/PopupManager.tsx",
                                            lineNumber: 327,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleCTAClick,
                                            className: "w-full py-3 rounded font-semibold transition-colors",
                                            style: {
                                                backgroundColor: activePopup.buttonColor,
                                                color: activePopup.buttonTextColor
                                            },
                                            children: activePopup.buttonText
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/PopupManager.tsx",
                                            lineNumber: 331,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/PopupManager.tsx",
                                    lineNumber: 326,
                                    columnNumber: 15
                                }, this),
                                activePopup.ctaType === 'link' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleCTAClick,
                                    className: "w-full py-3 rounded font-semibold transition-colors",
                                    style: {
                                        backgroundColor: activePopup.buttonColor,
                                        color: activePopup.buttonTextColor
                                    },
                                    children: activePopup.buttonText
                                }, void 0, false, {
                                    fileName: "[project]/src/components/PopupManager.tsx",
                                    lineNumber: 346,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/PopupManager.tsx",
                            lineNumber: 275,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/PopupManager.tsx",
                    lineNumber: 262,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/PopupManager.tsx",
                lineNumber: 251,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(PopupManager, "KIh0tgpItp7X3XSiMJ0ZZ+t4EPU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = PopupManager;
var _c;
__turbopack_context__.k.register(_c, "PopupManager");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_2000f71f._.js.map
//# debugId=d7fb0e74-e4d3-580f-9436-d42262ece744
