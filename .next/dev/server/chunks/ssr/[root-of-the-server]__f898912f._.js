module.exports = [
"[project]/src/lib/redux/features/cartSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
;
const initialState = {
    items: [],
    isOpen: false
};
const cartSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
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
}),
"[project]/src/lib/redux/features/wishlistSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
;
const initialState = {
    items: [],
    isLoading: false,
    productIds: []
};
const wishlistSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
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
}),
"[project]/src/lib/redux/features/posSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addToPosCart",
    ()=>addToPosCart,
    "clearPosCart",
    ()=>clearPosCart,
    "default",
    ()=>__TURBOPACK__default__export__,
    "removeFromPosCart",
    ()=>removeFromPosCart,
    "setActiveSession",
    ()=>setActiveSession,
    "setCashier",
    ()=>setCashier,
    "setCustomerName",
    ()=>setCustomerName,
    "setLocation",
    ()=>setLocation,
    "setOrderType",
    ()=>setOrderType,
    "setTableNumber",
    ()=>setTableNumber,
    "updatePosCartQuantity",
    ()=>updatePosCartQuantity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
;
const initialState = {
    cart: [],
    orderType: 'DINE_IN',
    locationId: null,
    cashierId: null,
    activeSessionId: null,
    tableNumber: null,
    customerName: null
};
const posSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'pos',
    initialState,
    reducers: {
        addToPosCart: (state, action)=>{
            const existing = state.cart.find((item)=>item.productId === action.payload.productId && item.variantId === action.payload.variantId);
            if (existing) {
                existing.quantity += action.payload.quantity;
            } else {
                state.cart.push(action.payload);
            }
        },
        removeFromPosCart: (state, action)=>{
            state.cart = state.cart.filter((item)=>item.id !== action.payload);
        },
        updatePosCartQuantity: (state, action)=>{
            const item = state.cart.find((item)=>item.id === action.payload.id);
            if (item) {
                item.quantity = action.payload.quantity;
                if (item.quantity <= 0) {
                    state.cart = state.cart.filter((cartItem)=>cartItem.id !== item.id);
                }
            }
        },
        clearPosCart: (state)=>{
            state.cart = [];
        },
        setOrderType: (state, action)=>{
            state.orderType = action.payload;
        },
        setLocation: (state, action)=>{
            state.locationId = action.payload;
        },
        setCashier: (state, action)=>{
            state.cashierId = action.payload;
        },
        setActiveSession: (state, action)=>{
            state.activeSessionId = action.payload;
        },
        setTableNumber: (state, action)=>{
            state.tableNumber = action.payload;
        },
        setCustomerName: (state, action)=>{
            state.customerName = action.payload;
        }
    }
});
const { addToPosCart, removeFromPosCart, updatePosCartQuantity, clearPosCart, setOrderType, setLocation, setCashier, setActiveSession, setTableNumber, setCustomerName } = posSlice.actions;
const __TURBOPACK__default__export__ = posSlice.reducer;
}),
"[project]/src/lib/redux/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "makeStore",
    ()=>makeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2f$dist$2f$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/redux/dist/redux.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/redux-persist/es/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$persistReducer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__persistReducer$3e$__ = __turbopack_context__.i("[project]/node_modules/redux-persist/es/persistReducer.js [app-ssr] (ecmascript) <export default as persistReducer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$lib$2f$storage$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/redux-persist/lib/storage/index.js [app-ssr] (ecmascript)"); // localStorage
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redux$2f$features$2f$cartSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/redux/features/cartSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redux$2f$features$2f$wishlistSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/redux/features/wishlistSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redux$2f$features$2f$posSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/redux/features/posSlice.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
const persistConfig = {
    key: 'root',
    storage: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$lib$2f$storage$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    whitelist: [
        'cart',
        'pos'
    ]
};
const rootReducer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2f$dist$2f$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["combineReducers"])({
    cart: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redux$2f$features$2f$cartSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    wishlist: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redux$2f$features$2f$wishlistSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    pos: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redux$2f$features$2f$posSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
});
const persistedReducer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$persistReducer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__persistReducer$3e$__["persistReducer"])(persistConfig, rootReducer);
const makeStore = ()=>{
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["configureStore"])({
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
}),
"[project]/src/lib/redux/StoreProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StoreProvider",
    ()=>StoreProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$integration$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/redux-persist/es/integration/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/redux-persist/es/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$persistStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__persistStore$3e$__ = __turbopack_context__.i("[project]/node_modules/redux-persist/es/persistStore.js [app-ssr] (ecmascript) <export default as persistStore>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redux$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/redux/store.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
function StoreProvider({ children }) {
    const storeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    const persistorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    if (!storeRef.current) {
        storeRef.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redux$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeStore"])();
        persistorRef.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$persistStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__persistStore$3e$__["persistStore"])(storeRef.current);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Provider"], {
        store: storeRef.current,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$integration$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PersistGate"], {
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
}),
"[project]/src/components/SessionProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SessionProvider",
    ()=>SessionProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [app-ssr] (ecmascript)");
'use client';
;
;
function SessionProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SessionProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/SessionProvider.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/contexts/SettingsContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SettingsProvider",
    ()=>SettingsProvider,
    "useSettings",
    ()=>useSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const SettingsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function SettingsProvider({ children }) {
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchSettings();
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SettingsContext.Provider, {
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
function useSettings() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
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
"[project]/src/lib/themes/theme-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Theme Utilities
 * Helper functions for working with themes
 */ __turbopack_context__.s([
    "mergeThemeConfigs",
    ()=>mergeThemeConfigs,
    "sanitizeThemeName",
    ()=>sanitizeThemeName,
    "themeToCSSVariables",
    ()=>themeToCSSVariables
]);
function themeToCSSVariables(theme) {
    const vars = [];
    // Colors
    vars.push(`--theme-color-primary: ${theme.colors.primary};`);
    vars.push(`--theme-color-secondary: ${theme.colors.secondary};`);
    vars.push(`--theme-color-accent: ${theme.colors.accent};`);
    vars.push(`--theme-color-background: ${theme.colors.background};`);
    vars.push(`--theme-color-surface: ${theme.colors.surface};`);
    vars.push(`--theme-color-border: ${theme.colors.border};`);
    vars.push(`--theme-color-text-primary: ${theme.colors.text.primary};`);
    vars.push(`--theme-color-text-secondary: ${theme.colors.text.secondary};`);
    vars.push(`--theme-color-text-muted: ${theme.colors.text.muted};`);
    if (theme.colors.success) vars.push(`--theme-color-success: ${theme.colors.success};`);
    if (theme.colors.warning) vars.push(`--theme-color-warning: ${theme.colors.warning};`);
    if (theme.colors.error) vars.push(`--theme-color-error: ${theme.colors.error};`);
    if (theme.colors.info) vars.push(`--theme-color-info: ${theme.colors.info};`);
    // Typography
    vars.push(`--theme-font-heading: ${theme.typography.fontFamily.heading};`);
    vars.push(`--theme-font-body: ${theme.typography.fontFamily.body};`);
    vars.push(`--theme-font-mono: ${theme.typography.fontFamily.mono || 'monospace'};`);
    Object.entries(theme.typography.fontSize).forEach(([key, value])=>{
        vars.push(`--theme-font-size-${key}: ${value};`);
    });
    Object.entries(theme.typography.fontWeight).forEach(([key, value])=>{
        vars.push(`--theme-font-weight-${key}: ${value};`);
    });
    Object.entries(theme.typography.lineHeight || {}).forEach(([key, value])=>{
        vars.push(`--theme-line-height-${key}: ${value};`);
    });
    // Spacing
    Object.entries(theme.spacing).forEach(([key, value])=>{
        vars.push(`--theme-spacing-${key}: ${value};`);
    });
    // Border Radius
    Object.entries(theme.borderRadius).forEach(([key, value])=>{
        vars.push(`--theme-radius-${key}: ${value};`);
    });
    // Layout
    vars.push(`--theme-container-max-width: ${theme.layout.containerMaxWidth};`);
    vars.push(`--theme-page-padding: ${theme.layout.pagePadding};`);
    vars.push(`--theme-section-spacing: ${theme.layout.sectionSpacing};`);
    // Component-specific variables
    if (theme.components.header) {
        vars.push(`--theme-header-bg: ${theme.components.header.backgroundColor};`);
        vars.push(`--theme-header-text: ${theme.components.header.textColor};`);
        vars.push(`--theme-header-height: ${theme.components.header.height};`);
    }
    if (theme.components.footer) {
        vars.push(`--theme-footer-bg: ${theme.components.footer.backgroundColor};`);
        vars.push(`--theme-footer-text: ${theme.components.footer.textColor};`);
    }
    if (theme.components.buttons) {
        vars.push(`--theme-button-primary: ${theme.components.buttons.primaryColor};`);
        vars.push(`--theme-button-hover: ${theme.components.buttons.hoverColor};`);
        vars.push(`--theme-button-text: ${theme.components.buttons.textColor};`);
        vars.push(`--theme-button-padding: ${theme.components.buttons.padding};`);
        vars.push(`--theme-button-radius: ${theme.components.buttons.borderRadius};`);
    }
    return `:root {\n  ${vars.join('\n  ')}\n}`;
}
function mergeThemeConfigs(base, overrides) {
    return {
        ...base,
        ...overrides,
        colors: {
            ...base.colors,
            ...overrides.colors,
            text: {
                ...base.colors.text,
                ...overrides.colors?.text
            }
        },
        typography: {
            ...base.typography,
            ...overrides.typography,
            fontFamily: {
                ...base.typography.fontFamily,
                ...overrides.typography?.fontFamily
            },
            fontSize: {
                ...base.typography.fontSize,
                ...overrides.typography?.fontSize
            },
            fontWeight: {
                ...base.typography.fontWeight,
                ...overrides.typography?.fontWeight
            }
        },
        spacing: {
            ...base.spacing,
            ...overrides.spacing
        },
        borderRadius: {
            ...base.borderRadius,
            ...overrides.borderRadius
        },
        components: {
            ...base.components,
            ...overrides.components,
            header: {
                ...base.components.header,
                ...overrides.components?.header
            },
            footer: {
                ...base.components.footer,
                ...overrides.components?.footer
            },
            productCard: {
                ...base.components.productCard,
                ...overrides.components?.productCard
            },
            buttons: {
                ...base.components.buttons,
                ...overrides.components?.buttons
            }
        },
        layout: {
            ...base.layout,
            ...overrides.layout
        }
    };
}
function sanitizeThemeName(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
}),
"[project]/src/components/theme/ThemeStyles.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeStyles",
    ()=>ThemeStyles
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTheme$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useTheme.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$theme$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/themes/theme-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
;
function ThemeStyles() {
    const { theme, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTheme$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!theme) {
            // Remove theme styles if theme is cleared
            const existingStyle = document.getElementById('theme-styles');
            if (existingStyle) {
                existingStyle.remove();
            }
            return;
        }
        const cssVariables = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$theme$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["themeToCSSVariables"])(theme);
        const customCSS = theme.customCSS || '';
        const fullCSS = cssVariables + (customCSS ? `\n\n${customCSS}` : '');
        // Remove existing theme styles if any
        const existingStyle = document.getElementById('theme-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        // Inject new theme styles
        const style = document.createElement('style');
        style.id = 'theme-styles';
        style.textContent = fullCSS;
        document.head.appendChild(style);
        console.log('Theme applied:', theme.metadata?.name);
        return ()=>{
            const styleToRemove = document.getElementById('theme-styles');
            if (styleToRemove) {
                styleToRemove.remove();
            }
        };
    }, [
        theme
    ]);
    return null;
}
}),
"[project]/src/providers/ThemeProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/ThemeContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2f$ThemeStyles$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/theme/ThemeStyles.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
function ThemeProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2f$ThemeStyles$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeStyles"], {}, void 0, false, {
                fileName: "[project]/src/providers/ThemeProvider.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/providers/ThemeProvider.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/CustomScripts.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomScripts",
    ()=>CustomScripts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SettingsContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/SettingsContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function CustomScripts() {
    const { settings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SettingsContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSettings"])();
    const googleAnalyticsId = settings.seo_google_analytics_id;
    const facebookPixelId = settings.social_facebook_pixel_id;
    const customJS = settings.appearance_custom_js;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Inject custom JavaScript if provided
        if (customJS) {
            try {
                const script = document.createElement('script');
                script.textContent = customJS;
                document.body.appendChild(script);
                return ()=>{
                    document.body.removeChild(script);
                };
            } catch (error) {
                console.error('Error loading custom JS:', error);
            }
        }
    }, [
        customJS
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            googleAnalyticsId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`,
                        strategy: "afterInteractive"
                    }, void 0, false, {
                        fileName: "[project]/src/components/CustomScripts.tsx",
                        lineNumber: 36,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
            facebookPixelId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
}),
"[project]/src/components/CustomStyles.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomStyles",
    ()=>CustomStyles
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SettingsContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/SettingsContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
function CustomStyles() {
    const { settings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SettingsContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSettings"])();
    const customCSS = settings.appearance_custom_css;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Inject custom CSS if provided
        if (customCSS) {
            const style = document.createElement('style');
            style.textContent = customCSS;
            style.id = 'custom-store-styles';
            document.head.appendChild(style);
            return ()=>{
                const existingStyle = document.getElementById('custom-store-styles');
                if (existingStyle) {
                    document.head.removeChild(existingStyle);
                }
            };
        }
    }, [
        customCSS
    ]);
    return null; // This component doesn't render anything
}
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

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
"[project]/src/components/PopupManager.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PopupManager",
    ()=>PopupManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
'use client';
;
;
;
;
function PopupManager() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const [popups, setPopups] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activePopup, setActivePopup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
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
    const showPopup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((popup)=>{
        if (!shouldShowPopup(popup)) return;
        setActivePopup(popup);
        setIsVisible(true);
        markPopupShown(popup);
        trackEvent(popup.id, 'view');
    }, []);
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchPopups = async ()=>{
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
        };
        fetchPopups();
    }, [
        pathname
    ]);
    // Setup triggers
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (popups.length === 0 || activePopup) return;
        const triggerPopup = popups[0]; // Take highest priority popup
        // Wait for initial delay
        const initialDelay = setTimeout(()=>{
            switch(triggerPopup.type){
                case 'EXIT_INTENT':
                    setupExitIntent(triggerPopup);
                    break;
                case 'TIMED':
                    setTimeout(()=>showPopup(triggerPopup), (triggerPopup.triggerValue || 5) * 1000);
                    break;
                case 'SCROLL_BASED':
                    setupScrollTrigger(triggerPopup);
                    break;
                case 'PAGE_LOAD':
                    showPopup(triggerPopup);
                    break;
            }
        }, triggerPopup.delaySeconds * 1000);
        return ()=>clearTimeout(initialDelay);
    }, [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`,
                style: {
                    ...getPositionStyles(),
                    backgroundColor: activePopup.backgroundColor,
                    color: activePopup.textColor
                },
                onClick: (e)=>e.stopPropagation(),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative rounded-lg shadow-2xl overflow-hidden",
                    children: [
                        activePopup.showCloseButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: closePopup,
                            className: "absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors z-10",
                            "aria-label": "Close popup",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 space-y-4",
                            children: [
                                activePopup.imageUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: activePopup.imageUrl,
                                    alt: "Popup",
                                    className: "w-full h-auto rounded"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/PopupManager.tsx",
                                    lineNumber: 278,
                                    columnNumber: 15
                                }, this),
                                activePopup.title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-2xl font-bold",
                                    children: activePopup.title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/PopupManager.tsx",
                                    lineNumber: 287,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "prose max-w-none",
                                    dangerouslySetInnerHTML: {
                                        __html: activePopup.content
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/PopupManager.tsx",
                                    lineNumber: 291,
                                    columnNumber: 13
                                }, this),
                                activePopup.ctaType === 'email_capture' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: (e)=>{
                                        e.preventDefault();
                                        handleCTAClick();
                                    },
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "email",
                                            placeholder: "Enter your email",
                                            required: true,
                                            className: "w-full px-4 py-2 border rounded"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/PopupManager.tsx",
                                            lineNumber: 305,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                activePopup.ctaType === 'discount_code' && activePopup.discountCode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 bg-gray-100 rounded text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm text-gray-600 mb-1",
                                                    children: "Your discount code:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/PopupManager.tsx",
                                                    lineNumber: 328,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                activePopup.ctaType === 'link' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
}),
];

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="05939ede-d0c8-53af-8589-bde88a63ad34")}catch(e){}}();
//# sourceMappingURL=%5Broot-of-the-server%5D__f898912f._.js.map
//# debugId=05939ede-d0c8-53af-8589-bde88a63ad34
