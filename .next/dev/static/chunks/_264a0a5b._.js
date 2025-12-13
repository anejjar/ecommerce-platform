!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d25a3554-113b-5cc9-9375-75525cbaaf6e")}catch(e){}}();
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/prisma.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$2f$index$2d$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@prisma/client/index-browser.js [app-client] (ecmascript)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$2f$index$2d$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PrismaClient"]({
    log: [
        'query'
    ]
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/features.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getEnabledFeatures",
    ()=>getEnabledFeatures,
    "isFeatureEnabled",
    ()=>isFeatureEnabled
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-client] (ecmascript)");
;
async function isFeatureEnabled(featureName) {
    try {
        const feature = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["prisma"].featureFlag.findUnique({
            where: {
                name: featureName
            }
        });
        return feature?.enabled ?? false;
    } catch (error) {
        console.error(`Error checking feature flag ${featureName}:`, error);
        return false;
    }
}
async function getEnabledFeatures() {
    try {
        const features = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["prisma"].featureFlag.findMany({
            where: {
                enabled: true
            },
            select: {
                name: true
            }
        });
        return features.map((f)=>f.name);
    } catch (error) {
        console.error('Error getting enabled features:', error);
        return [];
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/admin/(protected)/marketing/flash-sales/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FlashSalesLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/features.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function FlashSalesLayout({ children }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [featureEnabled, setFeatureEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FlashSalesLayout.useEffect": ()=>{
            async function checkFeature() {
                const enabled = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFeatureEnabled"])('flash_sales');
                setFeatureEnabled(enabled);
                if (!enabled) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error('Flash Sales feature is not available');
                    router.push('/admin');
                }
            }
            checkFeature();
        }
    }["FlashSalesLayout.useEffect"], [
        router
    ]);
    if (featureEnabled === null) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/(protected)/marketing/flash-sales/layout.tsx",
                        lineNumber: 34,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-muted-foreground",
                        children: "Loading..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/(protected)/marketing/flash-sales/layout.tsx",
                        lineNumber: 35,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/(protected)/marketing/flash-sales/layout.tsx",
                lineNumber: 33,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/admin/(protected)/marketing/flash-sales/layout.tsx",
            lineNumber: 32,
            columnNumber: 7
        }, this);
    }
    if (!featureEnabled) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(FlashSalesLayout, "8LLhKRQQW5pdqi2c5nI0oXXCi/o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = FlashSalesLayout;
var _c;
__turbopack_context__.k.register(_c, "FlashSalesLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/@prisma/client/runtime/index-browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var pe = Object.defineProperty;
var Xe = Object.getOwnPropertyDescriptor;
var Ke = Object.getOwnPropertyNames;
var Qe = Object.prototype.hasOwnProperty;
var Ye = (e)=>{
    throw TypeError(e);
};
var Oe = (e, n)=>{
    for(var i in n)pe(e, i, {
        get: n[i],
        enumerable: !0
    });
}, xe = (e, n, i, t)=>{
    if (n && typeof n == "object" || typeof n == "function") for (let r of Ke(n))!Qe.call(e, r) && r !== i && pe(e, r, {
        get: ()=>n[r],
        enumerable: !(t = Xe(n, r)) || t.enumerable
    });
    return e;
};
var ze = (e)=>xe(pe({}, "__esModule", {
        value: !0
    }), e);
var ne = (e, n, i)=>n.has(e) ? Ye("Cannot add the same private member more than once") : n instanceof WeakSet ? n.add(e) : n.set(e, i);
var ii = {};
Oe(ii, {
    Decimal: ()=>Je,
    Public: ()=>ge,
    getRuntime: ()=>_e,
    makeStrictEnum: ()=>qe,
    objectEnumValues: ()=>Ae
});
module.exports = ze(ii);
var ge = {};
Oe(ge, {
    validator: ()=>Re
});
function Re(...e) {
    return (n)=>n;
}
var ie = Symbol(), me = new WeakMap, we = class {
    constructor(n){
        n === ie ? me.set(this, "Prisma.".concat(this._getName())) : me.set(this, "new Prisma.".concat(this._getNamespace(), ".").concat(this._getName(), "()"));
    }
    _getName() {
        return this.constructor.name;
    }
    toString() {
        return me.get(this);
    }
}, G = class extends we {
    _getNamespace() {
        return "NullTypes";
    }
}, Ne, J = class extends G {
    constructor(){
        super(...arguments);
        ne(this, Ne);
    }
};
Ne = new WeakMap;
ke(J, "DbNull");
var ve, X = class extends G {
    constructor(){
        super(...arguments);
        ne(this, ve);
    }
};
ve = new WeakMap;
ke(X, "JsonNull");
var Ee, K = class extends G {
    constructor(){
        super(...arguments);
        ne(this, Ee);
    }
};
Ee = new WeakMap;
ke(K, "AnyNull");
var Ae = {
    classes: {
        DbNull: J,
        JsonNull: X,
        AnyNull: K
    },
    instances: {
        DbNull: new J(ie),
        JsonNull: new X(ie),
        AnyNull: new K(ie)
    }
};
function ke(e, n) {
    Object.defineProperty(e, "name", {
        value: n,
        configurable: !0
    });
}
var ye = new Set([
    "toJSON",
    "$$typeof",
    "asymmetricMatch",
    Symbol.iterator,
    Symbol.toStringTag,
    Symbol.isConcatSpreadable,
    Symbol.toPrimitive
]);
function qe(e) {
    return new Proxy(e, {
        get (n, i) {
            if (i in n) return n[i];
            if (!ye.has(i)) throw new TypeError("Invalid enum value: ".concat(String(i)));
        }
    });
}
var en = ()=>{
    var e, n;
    return ((n = (e = globalThis.process) == null ? void 0 : e.release) == null ? void 0 : n.name) === "node";
}, nn = ()=>{
    var e, n;
    return !!globalThis.Bun || !!((n = (e = globalThis.process) == null ? void 0 : e.versions) != null && n.bun);
}, tn = ()=>!!globalThis.Deno, rn = ()=>typeof globalThis.Netlify == "object", sn = ()=>typeof globalThis.EdgeRuntime == "object", on = ()=>{
    var e;
    return ((e = globalThis.navigator) == null ? void 0 : e.userAgent) === "Cloudflare-Workers";
};
function un() {
    var i;
    return (i = [
        [
            rn,
            "netlify"
        ],
        [
            sn,
            "edge-light"
        ],
        [
            on,
            "workerd"
        ],
        [
            tn,
            "deno"
        ],
        [
            nn,
            "bun"
        ],
        [
            en,
            "node"
        ]
    ].flatMap((t)=>t[0]() ? [
            t[1]
        ] : []).at(0)) != null ? i : "";
}
var fn = {
    node: "Node.js",
    workerd: "Cloudflare Workers",
    deno: "Deno and Deno Deploy",
    netlify: "Netlify Edge Functions",
    "edge-light": "Edge Runtime (Vercel Edge Functions, Vercel Edge Middleware, Next.js (Pages Router) Edge API Routes, Next.js (App Router) Edge Route Handlers or Next.js Middleware)"
};
function _e() {
    let e = un();
    return {
        id: e,
        prettyName: fn[e] || e,
        isEdge: [
            "workerd",
            "deno",
            "netlify",
            "edge-light"
        ].includes(e)
    };
}
var V = 9e15, H = 1e9, Se = "0123456789abcdef", se = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058", oe = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789", Me = {
    precision: 20,
    rounding: 4,
    modulo: 1,
    toExpNeg: -7,
    toExpPos: 21,
    minE: -V,
    maxE: V,
    crypto: !1
}, Le, Z, w = !0, fe = "[DecimalError] ", $ = fe + "Invalid argument: ", Ie = fe + "Precision limit exceeded", Ze = fe + "crypto unavailable", Ue = "[object Decimal]", R = Math.floor, C = Math.pow, cn = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i, ln = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i, an = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i, Be = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, D = 1e7, m = 7, dn = 9007199254740991, hn = se.length - 1, Ce = oe.length - 1, h = {
    toStringTag: Ue
};
h.absoluteValue = h.abs = function() {
    var e = new this.constructor(this);
    return e.s < 0 && (e.s = 1), p(e);
};
h.ceil = function() {
    return p(new this.constructor(this), this.e + 1, 2);
};
h.clampedTo = h.clamp = function(e, n) {
    var i, t = this, r = t.constructor;
    if (e = new r(e), n = new r(n), !e.s || !n.s) return new r(NaN);
    if (e.gt(n)) throw Error($ + n);
    return i = t.cmp(e), i < 0 ? e : t.cmp(n) > 0 ? n : new r(t);
};
h.comparedTo = h.cmp = function(e) {
    var n, i, t, r, s = this, o = s.d, u = (e = new s.constructor(e)).d, c = s.s, f = e.s;
    if (!o || !u) return !c || !f ? NaN : c !== f ? c : o === u ? 0 : !o ^ c < 0 ? 1 : -1;
    if (!o[0] || !u[0]) return o[0] ? c : u[0] ? -f : 0;
    if (c !== f) return c;
    if (s.e !== e.e) return s.e > e.e ^ c < 0 ? 1 : -1;
    for(t = o.length, r = u.length, n = 0, i = t < r ? t : r; n < i; ++n)if (o[n] !== u[n]) return o[n] > u[n] ^ c < 0 ? 1 : -1;
    return t === r ? 0 : t > r ^ c < 0 ? 1 : -1;
};
h.cosine = h.cos = function() {
    var e, n, i = this, t = i.constructor;
    return i.d ? i.d[0] ? (e = t.precision, n = t.rounding, t.precision = e + Math.max(i.e, i.sd()) + m, t.rounding = 1, i = pn(t, We(t, i)), t.precision = e, t.rounding = n, p(Z == 2 || Z == 3 ? i.neg() : i, e, n, !0)) : new t(1) : new t(NaN);
};
h.cubeRoot = h.cbrt = function() {
    var e, n, i, t, r, s, o, u, c, f, l = this, a = l.constructor;
    if (!l.isFinite() || l.isZero()) return new a(l);
    for(w = !1, s = l.s * C(l.s * l, 1 / 3), !s || Math.abs(s) == 1 / 0 ? (i = b(l.d), e = l.e, (s = (e - i.length + 1) % 3) && (i += s == 1 || s == -2 ? "0" : "00"), s = C(i, 1 / 3), e = R((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2)), s == 1 / 0 ? i = "5e" + e : (i = s.toExponential(), i = i.slice(0, i.indexOf("e") + 1) + e), t = new a(i), t.s = l.s) : t = new a(s.toString()), o = (e = a.precision) + 3;;)if (u = t, c = u.times(u).times(u), f = c.plus(l), t = k(f.plus(l).times(u), f.plus(c), o + 2, 1), b(u.d).slice(0, o) === (i = b(t.d)).slice(0, o)) if (i = i.slice(o - 3, o + 1), i == "9999" || !r && i == "4999") {
        if (!r && (p(u, e + 1, 0), u.times(u).times(u).eq(l))) {
            t = u;
            break;
        }
        o += 4, r = 1;
    } else {
        (!+i || !+i.slice(1) && i.charAt(0) == "5") && (p(t, e + 1, 1), n = !t.times(t).times(t).eq(l));
        break;
    }
    return w = !0, p(t, e, a.rounding, n);
};
h.decimalPlaces = h.dp = function() {
    var e, n = this.d, i = NaN;
    if (n) {
        if (e = n.length - 1, i = (e - R(this.e / m)) * m, e = n[e], e) for(; e % 10 == 0; e /= 10)i--;
        i < 0 && (i = 0);
    }
    return i;
};
h.dividedBy = h.div = function(e) {
    return k(this, new this.constructor(e));
};
h.dividedToIntegerBy = h.divToInt = function(e) {
    var n = this, i = n.constructor;
    return p(k(n, new i(e), 0, 1, 1), i.precision, i.rounding);
};
h.equals = h.eq = function(e) {
    return this.cmp(e) === 0;
};
h.floor = function() {
    return p(new this.constructor(this), this.e + 1, 3);
};
h.greaterThan = h.gt = function(e) {
    return this.cmp(e) > 0;
};
h.greaterThanOrEqualTo = h.gte = function(e) {
    var n = this.cmp(e);
    return n == 1 || n === 0;
};
h.hyperbolicCosine = h.cosh = function() {
    var e, n, i, t, r, s = this, o = s.constructor, u = new o(1);
    if (!s.isFinite()) return new o(s.s ? 1 / 0 : NaN);
    if (s.isZero()) return u;
    i = o.precision, t = o.rounding, o.precision = i + Math.max(s.e, s.sd()) + 4, o.rounding = 1, r = s.d.length, r < 32 ? (e = Math.ceil(r / 3), n = (1 / le(4, e)).toString()) : (e = 16, n = "2.3283064365386962890625e-10"), s = j(o, 1, s.times(n), new o(1), !0);
    for(var c, f = e, l = new o(8); f--;)c = s.times(s), s = u.minus(c.times(l.minus(c.times(l))));
    return p(s, o.precision = i, o.rounding = t, !0);
};
h.hyperbolicSine = h.sinh = function() {
    var e, n, i, t, r = this, s = r.constructor;
    if (!r.isFinite() || r.isZero()) return new s(r);
    if (n = s.precision, i = s.rounding, s.precision = n + Math.max(r.e, r.sd()) + 4, s.rounding = 1, t = r.d.length, t < 3) r = j(s, 2, r, r, !0);
    else {
        e = 1.4 * Math.sqrt(t), e = e > 16 ? 16 : e | 0, r = r.times(1 / le(5, e)), r = j(s, 2, r, r, !0);
        for(var o, u = new s(5), c = new s(16), f = new s(20); e--;)o = r.times(r), r = r.times(u.plus(o.times(c.times(o).plus(f))));
    }
    return s.precision = n, s.rounding = i, p(r, n, i, !0);
};
h.hyperbolicTangent = h.tanh = function() {
    var e, n, i = this, t = i.constructor;
    return i.isFinite() ? i.isZero() ? new t(i) : (e = t.precision, n = t.rounding, t.precision = e + 7, t.rounding = 1, k(i.sinh(), i.cosh(), t.precision = e, t.rounding = n)) : new t(i.s);
};
h.inverseCosine = h.acos = function() {
    var e = this, n = e.constructor, i = e.abs().cmp(1), t = n.precision, r = n.rounding;
    return i !== -1 ? i === 0 ? e.isNeg() ? F(n, t, r) : new n(0) : new n(NaN) : e.isZero() ? F(n, t + 4, r).times(.5) : (n.precision = t + 6, n.rounding = 1, e = new n(1).minus(e).div(e.plus(1)).sqrt().atan(), n.precision = t, n.rounding = r, e.times(2));
};
h.inverseHyperbolicCosine = h.acosh = function() {
    var e, n, i = this, t = i.constructor;
    return i.lte(1) ? new t(i.eq(1) ? 0 : NaN) : i.isFinite() ? (e = t.precision, n = t.rounding, t.precision = e + Math.max(Math.abs(i.e), i.sd()) + 4, t.rounding = 1, w = !1, i = i.times(i).minus(1).sqrt().plus(i), w = !0, t.precision = e, t.rounding = n, i.ln()) : new t(i);
};
h.inverseHyperbolicSine = h.asinh = function() {
    var e, n, i = this, t = i.constructor;
    return !i.isFinite() || i.isZero() ? new t(i) : (e = t.precision, n = t.rounding, t.precision = e + 2 * Math.max(Math.abs(i.e), i.sd()) + 6, t.rounding = 1, w = !1, i = i.times(i).plus(1).sqrt().plus(i), w = !0, t.precision = e, t.rounding = n, i.ln());
};
h.inverseHyperbolicTangent = h.atanh = function() {
    var e, n, i, t, r = this, s = r.constructor;
    return r.isFinite() ? r.e >= 0 ? new s(r.abs().eq(1) ? r.s / 0 : r.isZero() ? r : NaN) : (e = s.precision, n = s.rounding, t = r.sd(), Math.max(t, e) < 2 * -r.e - 1 ? p(new s(r), e, n, !0) : (s.precision = i = t - r.e, r = k(r.plus(1), new s(1).minus(r), i + e, 1), s.precision = e + 4, s.rounding = 1, r = r.ln(), s.precision = e, s.rounding = n, r.times(.5))) : new s(NaN);
};
h.inverseSine = h.asin = function() {
    var e, n, i, t, r = this, s = r.constructor;
    return r.isZero() ? new s(r) : (n = r.abs().cmp(1), i = s.precision, t = s.rounding, n !== -1 ? n === 0 ? (e = F(s, i + 4, t).times(.5), e.s = r.s, e) : new s(NaN) : (s.precision = i + 6, s.rounding = 1, r = r.div(new s(1).minus(r.times(r)).sqrt().plus(1)).atan(), s.precision = i, s.rounding = t, r.times(2)));
};
h.inverseTangent = h.atan = function() {
    var e, n, i, t, r, s, o, u, c, f = this, l = f.constructor, a = l.precision, d = l.rounding;
    if (f.isFinite()) {
        if (f.isZero()) return new l(f);
        if (f.abs().eq(1) && a + 4 <= Ce) return o = F(l, a + 4, d).times(.25), o.s = f.s, o;
    } else {
        if (!f.s) return new l(NaN);
        if (a + 4 <= Ce) return o = F(l, a + 4, d).times(.5), o.s = f.s, o;
    }
    for(l.precision = u = a + 10, l.rounding = 1, i = Math.min(28, u / m + 2 | 0), e = i; e; --e)f = f.div(f.times(f).plus(1).sqrt().plus(1));
    for(w = !1, n = Math.ceil(u / m), t = 1, c = f.times(f), o = new l(f), r = f; e !== -1;)if (r = r.times(c), s = o.minus(r.div(t += 2)), r = r.times(c), o = s.plus(r.div(t += 2)), o.d[n] !== void 0) for(e = n; o.d[e] === s.d[e] && e--;);
    return i && (o = o.times(2 << i - 1)), w = !0, p(o, l.precision = a, l.rounding = d, !0);
};
h.isFinite = function() {
    return !!this.d;
};
h.isInteger = h.isInt = function() {
    return !!this.d && R(this.e / m) > this.d.length - 2;
};
h.isNaN = function() {
    return !this.s;
};
h.isNegative = h.isNeg = function() {
    return this.s < 0;
};
h.isPositive = h.isPos = function() {
    return this.s > 0;
};
h.isZero = function() {
    return !!this.d && this.d[0] === 0;
};
h.lessThan = h.lt = function(e) {
    return this.cmp(e) < 0;
};
h.lessThanOrEqualTo = h.lte = function(e) {
    return this.cmp(e) < 1;
};
h.logarithm = h.log = function(e) {
    var n, i, t, r, s, o, u, c, f = this, l = f.constructor, a = l.precision, d = l.rounding, g = 5;
    if (e == null) e = new l(10), n = !0;
    else {
        if (e = new l(e), i = e.d, e.s < 0 || !i || !i[0] || e.eq(1)) return new l(NaN);
        n = e.eq(10);
    }
    if (i = f.d, f.s < 0 || !i || !i[0] || f.eq(1)) return new l(i && !i[0] ? -1 / 0 : f.s != 1 ? NaN : i ? 0 : 1 / 0);
    if (n) if (i.length > 1) s = !0;
    else {
        for(r = i[0]; r % 10 === 0;)r /= 10;
        s = r !== 1;
    }
    if (w = !1, u = a + g, o = B(f, u), t = n ? ue(l, u + 10) : B(e, u), c = k(o, t, u, 1), Q(c.d, r = a, d)) do if (u += 10, o = B(f, u), t = n ? ue(l, u + 10) : B(e, u), c = k(o, t, u, 1), !s) {
        +b(c.d).slice(r + 1, r + 15) + 1 == 1e14 && (c = p(c, a + 1, 0));
        break;
    }
    while (Q(c.d, r += 10, d))
    return w = !0, p(c, a, d);
};
h.minus = h.sub = function(e) {
    var n, i, t, r, s, o, u, c, f, l, a, d, g = this, v = g.constructor;
    if (e = new v(e), !g.d || !e.d) return !g.s || !e.s ? e = new v(NaN) : g.d ? e.s = -e.s : e = new v(e.d || g.s !== e.s ? g : NaN), e;
    if (g.s != e.s) return e.s = -e.s, g.plus(e);
    if (f = g.d, d = e.d, u = v.precision, c = v.rounding, !f[0] || !d[0]) {
        if (d[0]) e.s = -e.s;
        else if (f[0]) e = new v(g);
        else return new v(c === 3 ? -0 : 0);
        return w ? p(e, u, c) : e;
    }
    if (i = R(e.e / m), l = R(g.e / m), f = f.slice(), s = l - i, s) {
        for(a = s < 0, a ? (n = f, s = -s, o = d.length) : (n = d, i = l, o = f.length), t = Math.max(Math.ceil(u / m), o) + 2, s > t && (s = t, n.length = 1), n.reverse(), t = s; t--;)n.push(0);
        n.reverse();
    } else {
        for(t = f.length, o = d.length, a = t < o, a && (o = t), t = 0; t < o; t++)if (f[t] != d[t]) {
            a = f[t] < d[t];
            break;
        }
        s = 0;
    }
    for(a && (n = f, f = d, d = n, e.s = -e.s), o = f.length, t = d.length - o; t > 0; --t)f[o++] = 0;
    for(t = d.length; t > s;){
        if (f[--t] < d[t]) {
            for(r = t; r && f[--r] === 0;)f[r] = D - 1;
            --f[r], f[t] += D;
        }
        f[t] -= d[t];
    }
    for(; f[--o] === 0;)f.pop();
    for(; f[0] === 0; f.shift())--i;
    return f[0] ? (e.d = f, e.e = ce(f, i), w ? p(e, u, c) : e) : new v(c === 3 ? -0 : 0);
};
h.modulo = h.mod = function(e) {
    var n, i = this, t = i.constructor;
    return e = new t(e), !i.d || !e.s || e.d && !e.d[0] ? new t(NaN) : !e.d || i.d && !i.d[0] ? p(new t(i), t.precision, t.rounding) : (w = !1, t.modulo == 9 ? (n = k(i, e.abs(), 0, 3, 1), n.s *= e.s) : n = k(i, e, 0, t.modulo, 1), n = n.times(e), w = !0, i.minus(n));
};
h.naturalExponential = h.exp = function() {
    return be(this);
};
h.naturalLogarithm = h.ln = function() {
    return B(this);
};
h.negated = h.neg = function() {
    var e = new this.constructor(this);
    return e.s = -e.s, p(e);
};
h.plus = h.add = function(e) {
    var n, i, t, r, s, o, u, c, f, l, a = this, d = a.constructor;
    if (e = new d(e), !a.d || !e.d) return !a.s || !e.s ? e = new d(NaN) : a.d || (e = new d(e.d || a.s === e.s ? a : NaN)), e;
    if (a.s != e.s) return e.s = -e.s, a.minus(e);
    if (f = a.d, l = e.d, u = d.precision, c = d.rounding, !f[0] || !l[0]) return l[0] || (e = new d(a)), w ? p(e, u, c) : e;
    if (s = R(a.e / m), t = R(e.e / m), f = f.slice(), r = s - t, r) {
        for(r < 0 ? (i = f, r = -r, o = l.length) : (i = l, t = s, o = f.length), s = Math.ceil(u / m), o = s > o ? s + 1 : o + 1, r > o && (r = o, i.length = 1), i.reverse(); r--;)i.push(0);
        i.reverse();
    }
    for(o = f.length, r = l.length, o - r < 0 && (r = o, i = l, l = f, f = i), n = 0; r;)n = (f[--r] = f[r] + l[r] + n) / D | 0, f[r] %= D;
    for(n && (f.unshift(n), ++t), o = f.length; f[--o] == 0;)f.pop();
    return e.d = f, e.e = ce(f, t), w ? p(e, u, c) : e;
};
h.precision = h.sd = function(e) {
    var n, i = this;
    if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error($ + e);
    return i.d ? (n = $e(i.d), e && i.e + 1 > n && (n = i.e + 1)) : n = NaN, n;
};
h.round = function() {
    var e = this, n = e.constructor;
    return p(new n(e), e.e + 1, n.rounding);
};
h.sine = h.sin = function() {
    var e, n, i = this, t = i.constructor;
    return i.isFinite() ? i.isZero() ? new t(i) : (e = t.precision, n = t.rounding, t.precision = e + Math.max(i.e, i.sd()) + m, t.rounding = 1, i = mn(t, We(t, i)), t.precision = e, t.rounding = n, p(Z > 2 ? i.neg() : i, e, n, !0)) : new t(NaN);
};
h.squareRoot = h.sqrt = function() {
    var e, n, i, t, r, s, o = this, u = o.d, c = o.e, f = o.s, l = o.constructor;
    if (f !== 1 || !u || !u[0]) return new l(!f || f < 0 && (!u || u[0]) ? NaN : u ? o : 1 / 0);
    for(w = !1, f = Math.sqrt(+o), f == 0 || f == 1 / 0 ? (n = b(u), (n.length + c) % 2 == 0 && (n += "0"), f = Math.sqrt(n), c = R((c + 1) / 2) - (c < 0 || c % 2), f == 1 / 0 ? n = "5e" + c : (n = f.toExponential(), n = n.slice(0, n.indexOf("e") + 1) + c), t = new l(n)) : t = new l(f.toString()), i = (c = l.precision) + 3;;)if (s = t, t = s.plus(k(o, s, i + 2, 1)).times(.5), b(s.d).slice(0, i) === (n = b(t.d)).slice(0, i)) if (n = n.slice(i - 3, i + 1), n == "9999" || !r && n == "4999") {
        if (!r && (p(s, c + 1, 0), s.times(s).eq(o))) {
            t = s;
            break;
        }
        i += 4, r = 1;
    } else {
        (!+n || !+n.slice(1) && n.charAt(0) == "5") && (p(t, c + 1, 1), e = !t.times(t).eq(o));
        break;
    }
    return w = !0, p(t, c, l.rounding, e);
};
h.tangent = h.tan = function() {
    var e, n, i = this, t = i.constructor;
    return i.isFinite() ? i.isZero() ? new t(i) : (e = t.precision, n = t.rounding, t.precision = e + 10, t.rounding = 1, i = i.sin(), i.s = 1, i = k(i, new t(1).minus(i.times(i)).sqrt(), e + 10, 0), t.precision = e, t.rounding = n, p(Z == 2 || Z == 4 ? i.neg() : i, e, n, !0)) : new t(NaN);
};
h.times = h.mul = function(e) {
    var n, i, t, r, s, o, u, c, f, l = this, a = l.constructor, d = l.d, g = (e = new a(e)).d;
    if (e.s *= l.s, !d || !d[0] || !g || !g[0]) return new a(!e.s || d && !d[0] && !g || g && !g[0] && !d ? NaN : !d || !g ? e.s / 0 : e.s * 0);
    for(i = R(l.e / m) + R(e.e / m), c = d.length, f = g.length, c < f && (s = d, d = g, g = s, o = c, c = f, f = o), s = [], o = c + f, t = o; t--;)s.push(0);
    for(t = f; --t >= 0;){
        for(n = 0, r = c + t; r > t;)u = s[r] + g[t] * d[r - t - 1] + n, s[r--] = u % D | 0, n = u / D | 0;
        s[r] = (s[r] + n) % D | 0;
    }
    for(; !s[--o];)s.pop();
    return n ? ++i : s.shift(), e.d = s, e.e = ce(s, i), w ? p(e, a.precision, a.rounding) : e;
};
h.toBinary = function(e, n) {
    return Pe(this, 2, e, n);
};
h.toDecimalPlaces = h.toDP = function(e, n) {
    var i = this, t = i.constructor;
    return i = new t(i), e === void 0 ? i : (q(e, 0, H), n === void 0 ? n = t.rounding : q(n, 0, 8), p(i, e + i.e + 1, n));
};
h.toExponential = function(e, n) {
    var i, t = this, r = t.constructor;
    return e === void 0 ? i = L(t, !0) : (q(e, 0, H), n === void 0 ? n = r.rounding : q(n, 0, 8), t = p(new r(t), e + 1, n), i = L(t, !0, e + 1)), t.isNeg() && !t.isZero() ? "-" + i : i;
};
h.toFixed = function(e, n) {
    var i, t, r = this, s = r.constructor;
    return e === void 0 ? i = L(r) : (q(e, 0, H), n === void 0 ? n = s.rounding : q(n, 0, 8), t = p(new s(r), e + r.e + 1, n), i = L(t, !1, e + t.e + 1)), r.isNeg() && !r.isZero() ? "-" + i : i;
};
h.toFraction = function(e) {
    var n, i, t, r, s, o, u, c, f, l, a, d, g = this, v = g.d, N = g.constructor;
    if (!v) return new N(g);
    if (f = i = new N(1), t = c = new N(0), n = new N(t), s = n.e = $e(v) - g.e - 1, o = s % m, n.d[0] = C(10, o < 0 ? m + o : o), e == null) e = s > 0 ? n : f;
    else {
        if (u = new N(e), !u.isInt() || u.lt(f)) throw Error($ + u);
        e = u.gt(n) ? s > 0 ? n : f : u;
    }
    for(w = !1, u = new N(b(v)), l = N.precision, N.precision = s = v.length * m * 2; a = k(u, n, 0, 1, 1), r = i.plus(a.times(t)), r.cmp(e) != 1;)i = t, t = r, r = f, f = c.plus(a.times(r)), c = r, r = n, n = u.minus(a.times(r)), u = r;
    return r = k(e.minus(i), t, 0, 1, 1), c = c.plus(r.times(f)), i = i.plus(r.times(t)), c.s = f.s = g.s, d = k(f, t, s, 1).minus(g).abs().cmp(k(c, i, s, 1).minus(g).abs()) < 1 ? [
        f,
        t
    ] : [
        c,
        i
    ], N.precision = l, w = !0, d;
};
h.toHexadecimal = h.toHex = function(e, n) {
    return Pe(this, 16, e, n);
};
h.toNearest = function(e, n) {
    var i = this, t = i.constructor;
    if (i = new t(i), e == null) {
        if (!i.d) return i;
        e = new t(1), n = t.rounding;
    } else {
        if (e = new t(e), n === void 0 ? n = t.rounding : q(n, 0, 8), !i.d) return e.s ? i : e;
        if (!e.d) return e.s && (e.s = i.s), e;
    }
    return e.d[0] ? (w = !1, i = k(i, e, 0, n, 1).times(e), w = !0, p(i)) : (e.s = i.s, i = e), i;
};
h.toNumber = function() {
    return +this;
};
h.toOctal = function(e, n) {
    return Pe(this, 8, e, n);
};
h.toPower = h.pow = function(e) {
    var n, i, t, r, s, o, u = this, c = u.constructor, f = +(e = new c(e));
    if (!u.d || !e.d || !u.d[0] || !e.d[0]) return new c(C(+u, f));
    if (u = new c(u), u.eq(1)) return u;
    if (t = c.precision, s = c.rounding, e.eq(1)) return p(u, t, s);
    if (n = R(e.e / m), n >= e.d.length - 1 && (i = f < 0 ? -f : f) <= dn) return r = He(c, u, i, t), e.s < 0 ? new c(1).div(r) : p(r, t, s);
    if (o = u.s, o < 0) {
        if (n < e.d.length - 1) return new c(NaN);
        if ((e.d[n] & 1) == 0 && (o = 1), u.e == 0 && u.d[0] == 1 && u.d.length == 1) return u.s = o, u;
    }
    return i = C(+u, f), n = i == 0 || !isFinite(i) ? R(f * (Math.log("0." + b(u.d)) / Math.LN10 + u.e + 1)) : new c(i + "").e, n > c.maxE + 1 || n < c.minE - 1 ? new c(n > 0 ? o / 0 : 0) : (w = !1, c.rounding = u.s = 1, i = Math.min(12, (n + "").length), r = be(e.times(B(u, t + i)), t), r.d && (r = p(r, t + 5, 1), Q(r.d, t, s) && (n = t + 10, r = p(be(e.times(B(u, n + i)), n), n + 5, 1), +b(r.d).slice(t + 1, t + 15) + 1 == 1e14 && (r = p(r, t + 1, 0)))), r.s = o, w = !0, c.rounding = s, p(r, t, s));
};
h.toPrecision = function(e, n) {
    var i, t = this, r = t.constructor;
    return e === void 0 ? i = L(t, t.e <= r.toExpNeg || t.e >= r.toExpPos) : (q(e, 1, H), n === void 0 ? n = r.rounding : q(n, 0, 8), t = p(new r(t), e, n), i = L(t, e <= t.e || t.e <= r.toExpNeg, e)), t.isNeg() && !t.isZero() ? "-" + i : i;
};
h.toSignificantDigits = h.toSD = function(e, n) {
    var i = this, t = i.constructor;
    return e === void 0 ? (e = t.precision, n = t.rounding) : (q(e, 1, H), n === void 0 ? n = t.rounding : q(n, 0, 8)), p(new t(i), e, n);
};
h.toString = function() {
    var e = this, n = e.constructor, i = L(e, e.e <= n.toExpNeg || e.e >= n.toExpPos);
    return e.isNeg() && !e.isZero() ? "-" + i : i;
};
h.truncated = h.trunc = function() {
    return p(new this.constructor(this), this.e + 1, 1);
};
h.valueOf = h.toJSON = function() {
    var e = this, n = e.constructor, i = L(e, e.e <= n.toExpNeg || e.e >= n.toExpPos);
    return e.isNeg() ? "-" + i : i;
};
function b(e) {
    var n, i, t, r = e.length - 1, s = "", o = e[0];
    if (r > 0) {
        for(s += o, n = 1; n < r; n++)t = e[n] + "", i = m - t.length, i && (s += U(i)), s += t;
        o = e[n], t = o + "", i = m - t.length, i && (s += U(i));
    } else if (o === 0) return "0";
    for(; o % 10 === 0;)o /= 10;
    return s + o;
}
function q(e, n, i) {
    if (e !== ~~e || e < n || e > i) throw Error($ + e);
}
function Q(e, n, i, t) {
    var r, s, o, u;
    for(s = e[0]; s >= 10; s /= 10)--n;
    return --n < 0 ? (n += m, r = 0) : (r = Math.ceil((n + 1) / m), n %= m), s = C(10, m - n), u = e[r] % s | 0, t == null ? n < 3 ? (n == 0 ? u = u / 100 | 0 : n == 1 && (u = u / 10 | 0), o = i < 4 && u == 99999 || i > 3 && u == 49999 || u == 5e4 || u == 0) : o = (i < 4 && u + 1 == s || i > 3 && u + 1 == s / 2) && (e[r + 1] / s / 100 | 0) == C(10, n - 2) - 1 || (u == s / 2 || u == 0) && (e[r + 1] / s / 100 | 0) == 0 : n < 4 ? (n == 0 ? u = u / 1e3 | 0 : n == 1 ? u = u / 100 | 0 : n == 2 && (u = u / 10 | 0), o = (t || i < 4) && u == 9999 || !t && i > 3 && u == 4999) : o = ((t || i < 4) && u + 1 == s || !t && i > 3 && u + 1 == s / 2) && (e[r + 1] / s / 1e3 | 0) == C(10, n - 3) - 1, o;
}
function te(e, n, i) {
    for(var t, r = [
        0
    ], s, o = 0, u = e.length; o < u;){
        for(s = r.length; s--;)r[s] *= n;
        for(r[0] += Se.indexOf(e.charAt(o++)), t = 0; t < r.length; t++)r[t] > i - 1 && (r[t + 1] === void 0 && (r[t + 1] = 0), r[t + 1] += r[t] / i | 0, r[t] %= i);
    }
    return r.reverse();
}
function pn(e, n) {
    var i, t, r;
    if (n.isZero()) return n;
    t = n.d.length, t < 32 ? (i = Math.ceil(t / 3), r = (1 / le(4, i)).toString()) : (i = 16, r = "2.3283064365386962890625e-10"), e.precision += i, n = j(e, 1, n.times(r), new e(1));
    for(var s = i; s--;){
        var o = n.times(n);
        n = o.times(o).minus(o).times(8).plus(1);
    }
    return e.precision -= i, n;
}
var k = function() {
    function e(t, r, s) {
        var o, u = 0, c = t.length;
        for(t = t.slice(); c--;)o = t[c] * r + u, t[c] = o % s | 0, u = o / s | 0;
        return u && t.unshift(u), t;
    }
    function n(t, r, s, o) {
        var u, c;
        if (s != o) c = s > o ? 1 : -1;
        else for(u = c = 0; u < s; u++)if (t[u] != r[u]) {
            c = t[u] > r[u] ? 1 : -1;
            break;
        }
        return c;
    }
    function i(t, r, s, o) {
        for(var u = 0; s--;)t[s] -= u, u = t[s] < r[s] ? 1 : 0, t[s] = u * o + t[s] - r[s];
        for(; !t[0] && t.length > 1;)t.shift();
    }
    return function(t, r, s, o, u, c) {
        var f, l, a, d, g, v, N, A, M, _, E, P, x, I, ae, z, W, de, T, y, ee = t.constructor, he = t.s == r.s ? 1 : -1, O = t.d, S = r.d;
        if (!O || !O[0] || !S || !S[0]) return new ee(!t.s || !r.s || (O ? S && O[0] == S[0] : !S) ? NaN : O && O[0] == 0 || !S ? he * 0 : he / 0);
        for(c ? (g = 1, l = t.e - r.e) : (c = D, g = m, l = R(t.e / g) - R(r.e / g)), T = S.length, W = O.length, M = new ee(he), _ = M.d = [], a = 0; S[a] == (O[a] || 0); a++);
        if (S[a] > (O[a] || 0) && l--, s == null ? (I = s = ee.precision, o = ee.rounding) : u ? I = s + (t.e - r.e) + 1 : I = s, I < 0) _.push(1), v = !0;
        else {
            if (I = I / g + 2 | 0, a = 0, T == 1) {
                for(d = 0, S = S[0], I++; (a < W || d) && I--; a++)ae = d * c + (O[a] || 0), _[a] = ae / S | 0, d = ae % S | 0;
                v = d || a < W;
            } else {
                for(d = c / (S[0] + 1) | 0, d > 1 && (S = e(S, d, c), O = e(O, d, c), T = S.length, W = O.length), z = T, E = O.slice(0, T), P = E.length; P < T;)E[P++] = 0;
                y = S.slice(), y.unshift(0), de = S[0], S[1] >= c / 2 && ++de;
                do d = 0, f = n(S, E, T, P), f < 0 ? (x = E[0], T != P && (x = x * c + (E[1] || 0)), d = x / de | 0, d > 1 ? (d >= c && (d = c - 1), N = e(S, d, c), A = N.length, P = E.length, f = n(N, E, A, P), f == 1 && (d--, i(N, T < A ? y : S, A, c))) : (d == 0 && (f = d = 1), N = S.slice()), A = N.length, A < P && N.unshift(0), i(E, N, P, c), f == -1 && (P = E.length, f = n(S, E, T, P), f < 1 && (d++, i(E, T < P ? y : S, P, c))), P = E.length) : f === 0 && (d++, E = [
                    0
                ]), _[a++] = d, f && E[0] ? E[P++] = O[z] || 0 : (E = [
                    O[z]
                ], P = 1);
                while ((z++ < W || E[0] !== void 0) && I--)
                v = E[0] !== void 0;
            }
            _[0] || _.shift();
        }
        if (g == 1) M.e = l, Le = v;
        else {
            for(a = 1, d = _[0]; d >= 10; d /= 10)a++;
            M.e = a + l * g - 1, p(M, u ? s + M.e + 1 : s, o, v);
        }
        return M;
    };
}();
function p(e, n, i, t) {
    var r, s, o, u, c, f, l, a, d, g = e.constructor;
    e: if (n != null) {
        if (a = e.d, !a) return e;
        for(r = 1, u = a[0]; u >= 10; u /= 10)r++;
        if (s = n - r, s < 0) s += m, o = n, l = a[d = 0], c = l / C(10, r - o - 1) % 10 | 0;
        else if (d = Math.ceil((s + 1) / m), u = a.length, d >= u) if (t) {
            for(; u++ <= d;)a.push(0);
            l = c = 0, r = 1, s %= m, o = s - m + 1;
        } else break e;
        else {
            for(l = u = a[d], r = 1; u >= 10; u /= 10)r++;
            s %= m, o = s - m + r, c = o < 0 ? 0 : l / C(10, r - o - 1) % 10 | 0;
        }
        if (t = t || n < 0 || a[d + 1] !== void 0 || (o < 0 ? l : l % C(10, r - o - 1)), f = i < 4 ? (c || t) && (i == 0 || i == (e.s < 0 ? 3 : 2)) : c > 5 || c == 5 && (i == 4 || t || i == 6 && (s > 0 ? o > 0 ? l / C(10, r - o) : 0 : a[d - 1]) % 10 & 1 || i == (e.s < 0 ? 8 : 7)), n < 1 || !a[0]) return a.length = 0, f ? (n -= e.e + 1, a[0] = C(10, (m - n % m) % m), e.e = -n || 0) : a[0] = e.e = 0, e;
        if (s == 0 ? (a.length = d, u = 1, d--) : (a.length = d + 1, u = C(10, m - s), a[d] = o > 0 ? (l / C(10, r - o) % C(10, o) | 0) * u : 0), f) for(;;)if (d == 0) {
            for(s = 1, o = a[0]; o >= 10; o /= 10)s++;
            for(o = a[0] += u, u = 1; o >= 10; o /= 10)u++;
            s != u && (e.e++, a[0] == D && (a[0] = 1));
            break;
        } else {
            if (a[d] += u, a[d] != D) break;
            a[d--] = 0, u = 1;
        }
        for(s = a.length; a[--s] === 0;)a.pop();
    }
    return w && (e.e > g.maxE ? (e.d = null, e.e = NaN) : e.e < g.minE && (e.e = 0, e.d = [
        0
    ])), e;
}
function L(e, n, i) {
    if (!e.isFinite()) return je(e);
    var t, r = e.e, s = b(e.d), o = s.length;
    return n ? (i && (t = i - o) > 0 ? s = s.charAt(0) + "." + s.slice(1) + U(t) : o > 1 && (s = s.charAt(0) + "." + s.slice(1)), s = s + (e.e < 0 ? "e" : "e+") + e.e) : r < 0 ? (s = "0." + U(-r - 1) + s, i && (t = i - o) > 0 && (s += U(t))) : r >= o ? (s += U(r + 1 - o), i && (t = i - r - 1) > 0 && (s = s + "." + U(t))) : ((t = r + 1) < o && (s = s.slice(0, t) + "." + s.slice(t)), i && (t = i - o) > 0 && (r + 1 === o && (s += "."), s += U(t))), s;
}
function ce(e, n) {
    var i = e[0];
    for(n *= m; i >= 10; i /= 10)n++;
    return n;
}
function ue(e, n, i) {
    if (n > hn) throw w = !0, i && (e.precision = i), Error(Ie);
    return p(new e(se), n, 1, !0);
}
function F(e, n, i) {
    if (n > Ce) throw Error(Ie);
    return p(new e(oe), n, i, !0);
}
function $e(e) {
    var n = e.length - 1, i = n * m + 1;
    if (n = e[n], n) {
        for(; n % 10 == 0; n /= 10)i--;
        for(n = e[0]; n >= 10; n /= 10)i++;
    }
    return i;
}
function U(e) {
    for(var n = ""; e--;)n += "0";
    return n;
}
function He(e, n, i, t) {
    var r, s = new e(1), o = Math.ceil(t / m + 4);
    for(w = !1;;){
        if (i % 2 && (s = s.times(n), De(s.d, o) && (r = !0)), i = R(i / 2), i === 0) {
            i = s.d.length - 1, r && s.d[i] === 0 && ++s.d[i];
            break;
        }
        n = n.times(n), De(n.d, o);
    }
    return w = !0, s;
}
function Te(e) {
    return e.d[e.d.length - 1] & 1;
}
function Ve(e, n, i) {
    for(var t, r, s = new e(n[0]), o = 0; ++o < n.length;){
        if (r = new e(n[o]), !r.s) {
            s = r;
            break;
        }
        t = s.cmp(r), (t === i || t === 0 && s.s === i) && (s = r);
    }
    return s;
}
function be(e, n) {
    var i, t, r, s, o, u, c, f = 0, l = 0, a = 0, d = e.constructor, g = d.rounding, v = d.precision;
    if (!e.d || !e.d[0] || e.e > 17) return new d(e.d ? e.d[0] ? e.s < 0 ? 0 : 1 / 0 : 1 : e.s ? e.s < 0 ? 0 : e : NaN);
    for(n == null ? (w = !1, c = v) : c = n, u = new d(.03125); e.e > -2;)e = e.times(u), a += 5;
    for(t = Math.log(C(2, a)) / Math.LN10 * 2 + 5 | 0, c += t, i = s = o = new d(1), d.precision = c;;){
        if (s = p(s.times(e), c, 1), i = i.times(++l), u = o.plus(k(s, i, c, 1)), b(u.d).slice(0, c) === b(o.d).slice(0, c)) {
            for(r = a; r--;)o = p(o.times(o), c, 1);
            if (n == null) if (f < 3 && Q(o.d, c - t, g, f)) d.precision = c += 10, i = s = u = new d(1), l = 0, f++;
            else return p(o, d.precision = v, g, w = !0);
            else return d.precision = v, o;
        }
        o = u;
    }
}
function B(e, n) {
    var i, t, r, s, o, u, c, f, l, a, d, g = 1, v = 10, N = e, A = N.d, M = N.constructor, _ = M.rounding, E = M.precision;
    if (N.s < 0 || !A || !A[0] || !N.e && A[0] == 1 && A.length == 1) return new M(A && !A[0] ? -1 / 0 : N.s != 1 ? NaN : A ? 0 : N);
    if (n == null ? (w = !1, l = E) : l = n, M.precision = l += v, i = b(A), t = i.charAt(0), Math.abs(s = N.e) < 15e14) {
        for(; t < 7 && t != 1 || t == 1 && i.charAt(1) > 3;)N = N.times(e), i = b(N.d), t = i.charAt(0), g++;
        s = N.e, t > 1 ? (N = new M("0." + i), s++) : N = new M(t + "." + i.slice(1));
    } else return f = ue(M, l + 2, E).times(s + ""), N = B(new M(t + "." + i.slice(1)), l - v).plus(f), M.precision = E, n == null ? p(N, E, _, w = !0) : N;
    for(a = N, c = o = N = k(N.minus(1), N.plus(1), l, 1), d = p(N.times(N), l, 1), r = 3;;){
        if (o = p(o.times(d), l, 1), f = c.plus(k(o, new M(r), l, 1)), b(f.d).slice(0, l) === b(c.d).slice(0, l)) if (c = c.times(2), s !== 0 && (c = c.plus(ue(M, l + 2, E).times(s + ""))), c = k(c, new M(g), l, 1), n == null) if (Q(c.d, l - v, _, u)) M.precision = l += v, f = o = N = k(a.minus(1), a.plus(1), l, 1), d = p(N.times(N), l, 1), r = u = 1;
        else return p(c, M.precision = E, _, w = !0);
        else return M.precision = E, c;
        c = f, r += 2;
    }
}
function je(e) {
    return String(e.s * e.s / 0);
}
function re(e, n) {
    var i, t, r;
    for((i = n.indexOf(".")) > -1 && (n = n.replace(".", "")), (t = n.search(/e/i)) > 0 ? (i < 0 && (i = t), i += +n.slice(t + 1), n = n.substring(0, t)) : i < 0 && (i = n.length), t = 0; n.charCodeAt(t) === 48; t++);
    for(r = n.length; n.charCodeAt(r - 1) === 48; --r);
    if (n = n.slice(t, r), n) {
        if (r -= t, e.e = i = i - t - 1, e.d = [], t = (i + 1) % m, i < 0 && (t += m), t < r) {
            for(t && e.d.push(+n.slice(0, t)), r -= m; t < r;)e.d.push(+n.slice(t, t += m));
            n = n.slice(t), t = m - n.length;
        } else t -= r;
        for(; t--;)n += "0";
        e.d.push(+n), w && (e.e > e.constructor.maxE ? (e.d = null, e.e = NaN) : e.e < e.constructor.minE && (e.e = 0, e.d = [
            0
        ]));
    } else e.e = 0, e.d = [
        0
    ];
    return e;
}
function gn(e, n) {
    var i, t, r, s, o, u, c, f, l;
    if (n.indexOf("_") > -1) {
        if (n = n.replace(/(\d)_(?=\d)/g, "$1"), Be.test(n)) return re(e, n);
    } else if (n === "Infinity" || n === "NaN") return +n || (e.s = NaN), e.e = NaN, e.d = null, e;
    if (ln.test(n)) i = 16, n = n.toLowerCase();
    else if (cn.test(n)) i = 2;
    else if (an.test(n)) i = 8;
    else throw Error($ + n);
    for(s = n.search(/p/i), s > 0 ? (c = +n.slice(s + 1), n = n.substring(2, s)) : n = n.slice(2), s = n.indexOf("."), o = s >= 0, t = e.constructor, o && (n = n.replace(".", ""), u = n.length, s = u - s, r = He(t, new t(i), s, s * 2)), f = te(n, i, D), l = f.length - 1, s = l; f[s] === 0; --s)f.pop();
    return s < 0 ? new t(e.s * 0) : (e.e = ce(f, l), e.d = f, w = !1, o && (e = k(e, r, u * 4)), c && (e = e.times(Math.abs(c) < 54 ? C(2, c) : Y.pow(2, c))), w = !0, e);
}
function mn(e, n) {
    var i, t = n.d.length;
    if (t < 3) return n.isZero() ? n : j(e, 2, n, n);
    i = 1.4 * Math.sqrt(t), i = i > 16 ? 16 : i | 0, n = n.times(1 / le(5, i)), n = j(e, 2, n, n);
    for(var r, s = new e(5), o = new e(16), u = new e(20); i--;)r = n.times(n), n = n.times(s.plus(r.times(o.times(r).minus(u))));
    return n;
}
function j(e, n, i, t, r) {
    var s, o, u, c, f = 1, l = e.precision, a = Math.ceil(l / m);
    for(w = !1, c = i.times(i), u = new e(t);;){
        if (o = k(u.times(c), new e(n++ * n++), l, 1), u = r ? t.plus(o) : t.minus(o), t = k(o.times(c), new e(n++ * n++), l, 1), o = u.plus(t), o.d[a] !== void 0) {
            for(s = a; o.d[s] === u.d[s] && s--;);
            if (s == -1) break;
        }
        s = u, u = t, t = o, o = s, f++;
    }
    return w = !0, o.d.length = a + 1, o;
}
function le(e, n) {
    for(var i = e; --n;)i *= e;
    return i;
}
function We(e, n) {
    var i, t = n.s < 0, r = F(e, e.precision, 1), s = r.times(.5);
    if (n = n.abs(), n.lte(s)) return Z = t ? 4 : 1, n;
    if (i = n.divToInt(r), i.isZero()) Z = t ? 3 : 2;
    else {
        if (n = n.minus(i.times(r)), n.lte(s)) return Z = Te(i) ? t ? 2 : 3 : t ? 4 : 1, n;
        Z = Te(i) ? t ? 1 : 4 : t ? 3 : 2;
    }
    return n.minus(r).abs();
}
function Pe(e, n, i, t) {
    var r, s, o, u, c, f, l, a, d, g = e.constructor, v = i !== void 0;
    if (v ? (q(i, 1, H), t === void 0 ? t = g.rounding : q(t, 0, 8)) : (i = g.precision, t = g.rounding), !e.isFinite()) l = je(e);
    else {
        for(l = L(e), o = l.indexOf("."), v ? (r = 2, n == 16 ? i = i * 4 - 3 : n == 8 && (i = i * 3 - 2)) : r = n, o >= 0 && (l = l.replace(".", ""), d = new g(1), d.e = l.length - o, d.d = te(L(d), 10, r), d.e = d.d.length), a = te(l, 10, r), s = c = a.length; a[--c] == 0;)a.pop();
        if (!a[0]) l = v ? "0p+0" : "0";
        else {
            if (o < 0 ? s-- : (e = new g(e), e.d = a, e.e = s, e = k(e, d, i, t, 0, r), a = e.d, s = e.e, f = Le), o = a[i], u = r / 2, f = f || a[i + 1] !== void 0, f = t < 4 ? (o !== void 0 || f) && (t === 0 || t === (e.s < 0 ? 3 : 2)) : o > u || o === u && (t === 4 || f || t === 6 && a[i - 1] & 1 || t === (e.s < 0 ? 8 : 7)), a.length = i, f) for(; ++a[--i] > r - 1;)a[i] = 0, i || (++s, a.unshift(1));
            for(c = a.length; !a[c - 1]; --c);
            for(o = 0, l = ""; o < c; o++)l += Se.charAt(a[o]);
            if (v) {
                if (c > 1) if (n == 16 || n == 8) {
                    for(o = n == 16 ? 4 : 3, --c; c % o; c++)l += "0";
                    for(a = te(l, r, n), c = a.length; !a[c - 1]; --c);
                    for(o = 1, l = "1."; o < c; o++)l += Se.charAt(a[o]);
                } else l = l.charAt(0) + "." + l.slice(1);
                l = l + (s < 0 ? "p" : "p+") + s;
            } else if (s < 0) {
                for(; ++s;)l = "0" + l;
                l = "0." + l;
            } else if (++s > c) for(s -= c; s--;)l += "0";
            else s < c && (l = l.slice(0, s) + "." + l.slice(s));
        }
        l = (n == 16 ? "0x" : n == 2 ? "0b" : n == 8 ? "0o" : "") + l;
    }
    return e.s < 0 ? "-" + l : l;
}
function De(e, n) {
    if (e.length > n) return e.length = n, !0;
}
function wn(e) {
    return new this(e).abs();
}
function Nn(e) {
    return new this(e).acos();
}
function vn(e) {
    return new this(e).acosh();
}
function En(e, n) {
    return new this(e).plus(n);
}
function kn(e) {
    return new this(e).asin();
}
function Sn(e) {
    return new this(e).asinh();
}
function Mn(e) {
    return new this(e).atan();
}
function Cn(e) {
    return new this(e).atanh();
}
function bn(e, n) {
    e = new this(e), n = new this(n);
    var i, t = this.precision, r = this.rounding, s = t + 4;
    return !e.s || !n.s ? i = new this(NaN) : !e.d && !n.d ? (i = F(this, s, 1).times(n.s > 0 ? .25 : .75), i.s = e.s) : !n.d || e.isZero() ? (i = n.s < 0 ? F(this, t, r) : new this(0), i.s = e.s) : !e.d || n.isZero() ? (i = F(this, s, 1).times(.5), i.s = e.s) : n.s < 0 ? (this.precision = s, this.rounding = 1, i = this.atan(k(e, n, s, 1)), n = F(this, s, 1), this.precision = t, this.rounding = r, i = e.s < 0 ? i.minus(n) : i.plus(n)) : i = this.atan(k(e, n, s, 1)), i;
}
function Pn(e) {
    return new this(e).cbrt();
}
function On(e) {
    return p(e = new this(e), e.e + 1, 2);
}
function Rn(e, n, i) {
    return new this(e).clamp(n, i);
}
function An(e) {
    if (!e || typeof e != "object") throw Error(fe + "Object expected");
    var n, i, t, r = e.defaults === !0, s = [
        "precision",
        1,
        H,
        "rounding",
        0,
        8,
        "toExpNeg",
        -V,
        0,
        "toExpPos",
        0,
        V,
        "maxE",
        0,
        V,
        "minE",
        -V,
        0,
        "modulo",
        0,
        9
    ];
    for(n = 0; n < s.length; n += 3)if (i = s[n], r && (this[i] = Me[i]), (t = e[i]) !== void 0) if (R(t) === t && t >= s[n + 1] && t <= s[n + 2]) this[i] = t;
    else throw Error($ + i + ": " + t);
    if (i = "crypto", r && (this[i] = Me[i]), (t = e[i]) !== void 0) if (t === !0 || t === !1 || t === 0 || t === 1) if (t) if (typeof crypto < "u" && crypto && (crypto.getRandomValues || crypto.randomBytes)) this[i] = !0;
    else throw Error(Ze);
    else this[i] = !1;
    else throw Error($ + i + ": " + t);
    return this;
}
function qn(e) {
    return new this(e).cos();
}
function _n(e) {
    return new this(e).cosh();
}
function Ge(e) {
    var n, i, t;
    function r(s) {
        var o, u, c, f = this;
        if (!(f instanceof r)) return new r(s);
        if (f.constructor = r, Fe(s)) {
            f.s = s.s, w ? !s.d || s.e > r.maxE ? (f.e = NaN, f.d = null) : s.e < r.minE ? (f.e = 0, f.d = [
                0
            ]) : (f.e = s.e, f.d = s.d.slice()) : (f.e = s.e, f.d = s.d ? s.d.slice() : s.d);
            return;
        }
        if (c = typeof s, c === "number") {
            if (s === 0) {
                f.s = 1 / s < 0 ? -1 : 1, f.e = 0, f.d = [
                    0
                ];
                return;
            }
            if (s < 0 ? (s = -s, f.s = -1) : f.s = 1, s === ~~s && s < 1e7) {
                for(o = 0, u = s; u >= 10; u /= 10)o++;
                w ? o > r.maxE ? (f.e = NaN, f.d = null) : o < r.minE ? (f.e = 0, f.d = [
                    0
                ]) : (f.e = o, f.d = [
                    s
                ]) : (f.e = o, f.d = [
                    s
                ]);
                return;
            }
            if (s * 0 !== 0) {
                s || (f.s = NaN), f.e = NaN, f.d = null;
                return;
            }
            return re(f, s.toString());
        }
        if (c === "string") return (u = s.charCodeAt(0)) === 45 ? (s = s.slice(1), f.s = -1) : (u === 43 && (s = s.slice(1)), f.s = 1), Be.test(s) ? re(f, s) : gn(f, s);
        if (c === "bigint") return s < 0 ? (s = -s, f.s = -1) : f.s = 1, re(f, s.toString());
        throw Error($ + s);
    }
    if (r.prototype = h, r.ROUND_UP = 0, r.ROUND_DOWN = 1, r.ROUND_CEIL = 2, r.ROUND_FLOOR = 3, r.ROUND_HALF_UP = 4, r.ROUND_HALF_DOWN = 5, r.ROUND_HALF_EVEN = 6, r.ROUND_HALF_CEIL = 7, r.ROUND_HALF_FLOOR = 8, r.EUCLID = 9, r.config = r.set = An, r.clone = Ge, r.isDecimal = Fe, r.abs = wn, r.acos = Nn, r.acosh = vn, r.add = En, r.asin = kn, r.asinh = Sn, r.atan = Mn, r.atanh = Cn, r.atan2 = bn, r.cbrt = Pn, r.ceil = On, r.clamp = Rn, r.cos = qn, r.cosh = _n, r.div = Tn, r.exp = Dn, r.floor = Fn, r.hypot = Ln, r.ln = In, r.log = Zn, r.log10 = Bn, r.log2 = Un, r.max = $n, r.min = Hn, r.mod = Vn, r.mul = jn, r.pow = Wn, r.random = Gn, r.round = Jn, r.sign = Xn, r.sin = Kn, r.sinh = Qn, r.sqrt = Yn, r.sub = xn, r.sum = zn, r.tan = yn, r.tanh = ei, r.trunc = ni, e === void 0 && (e = {}), e && e.defaults !== !0) for(t = [
        "precision",
        "rounding",
        "toExpNeg",
        "toExpPos",
        "maxE",
        "minE",
        "modulo",
        "crypto"
    ], n = 0; n < t.length;)e.hasOwnProperty(i = t[n++]) || (e[i] = this[i]);
    return r.config(e), r;
}
function Tn(e, n) {
    return new this(e).div(n);
}
function Dn(e) {
    return new this(e).exp();
}
function Fn(e) {
    return p(e = new this(e), e.e + 1, 3);
}
function Ln() {
    var e, n, i = new this(0);
    for(w = !1, e = 0; e < arguments.length;)if (n = new this(arguments[e++]), n.d) i.d && (i = i.plus(n.times(n)));
    else {
        if (n.s) return w = !0, new this(1 / 0);
        i = n;
    }
    return w = !0, i.sqrt();
}
function Fe(e) {
    return e instanceof Y || e && e.toStringTag === Ue || !1;
}
function In(e) {
    return new this(e).ln();
}
function Zn(e, n) {
    return new this(e).log(n);
}
function Un(e) {
    return new this(e).log(2);
}
function Bn(e) {
    return new this(e).log(10);
}
function $n() {
    return Ve(this, arguments, -1);
}
function Hn() {
    return Ve(this, arguments, 1);
}
function Vn(e, n) {
    return new this(e).mod(n);
}
function jn(e, n) {
    return new this(e).mul(n);
}
function Wn(e, n) {
    return new this(e).pow(n);
}
function Gn(e) {
    var n, i, t, r, s = 0, o = new this(1), u = [];
    if (e === void 0 ? e = this.precision : q(e, 1, H), t = Math.ceil(e / m), this.crypto) if (crypto.getRandomValues) for(n = crypto.getRandomValues(new Uint32Array(t)); s < t;)r = n[s], r >= 429e7 ? n[s] = crypto.getRandomValues(new Uint32Array(1))[0] : u[s++] = r % 1e7;
    else if (crypto.randomBytes) {
        for(n = crypto.randomBytes(t *= 4); s < t;)r = n[s] + (n[s + 1] << 8) + (n[s + 2] << 16) + ((n[s + 3] & 127) << 24), r >= 214e7 ? crypto.randomBytes(4).copy(n, s) : (u.push(r % 1e7), s += 4);
        s = t / 4;
    } else throw Error(Ze);
    else for(; s < t;)u[s++] = Math.random() * 1e7 | 0;
    for(t = u[--s], e %= m, t && e && (r = C(10, m - e), u[s] = (t / r | 0) * r); u[s] === 0; s--)u.pop();
    if (s < 0) i = 0, u = [
        0
    ];
    else {
        for(i = -1; u[0] === 0; i -= m)u.shift();
        for(t = 1, r = u[0]; r >= 10; r /= 10)t++;
        t < m && (i -= m - t);
    }
    return o.e = i, o.d = u, o;
}
function Jn(e) {
    return p(e = new this(e), e.e + 1, this.rounding);
}
function Xn(e) {
    return e = new this(e), e.d ? e.d[0] ? e.s : 0 * e.s : e.s || NaN;
}
function Kn(e) {
    return new this(e).sin();
}
function Qn(e) {
    return new this(e).sinh();
}
function Yn(e) {
    return new this(e).sqrt();
}
function xn(e, n) {
    return new this(e).sub(n);
}
function zn() {
    var e = 0, n = arguments, i = new this(n[e]);
    for(w = !1; i.s && ++e < n.length;)i = i.plus(n[e]);
    return w = !0, p(i, this.precision, this.rounding);
}
function yn(e) {
    return new this(e).tan();
}
function ei(e) {
    return new this(e).tanh();
}
function ni(e) {
    return p(e = new this(e), e.e + 1, 1);
}
h[Symbol.for("nodejs.util.inspect.custom")] = h.toString;
h[Symbol.toStringTag] = "Decimal";
var Y = h.constructor = Ge(Me);
se = new Y(se);
oe = new Y(oe);
var Je = Y;
0 && (module.exports = {
    Decimal,
    Public,
    getRuntime,
    makeStrictEnum,
    objectEnumValues
}); /*! Bundled license information:

decimal.js/decimal.mjs:
  (*!
   *  decimal.js v10.5.0
   *  An arbitrary-precision Decimal type for JavaScript.
   *  https://github.com/MikeMcl/decimal.js
   *  Copyright (c) 2025 Michael Mclaughlin <M8ch88l@gmail.com>
   *  MIT Licence
   *)
*/  //# sourceMappingURL=index-browser.js.map
}),
"[project]/node_modules/.prisma/client/index-browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

/* !!! This is code generated by Prisma. Do not edit directly. !!!
/* eslint-disable */ // biome-ignore-all lint: generated file
Object.defineProperty(exports, "__esModule", {
    value: true
});
const { Decimal, objectEnumValues, makeStrictEnum, Public, getRuntime, skip } = __turbopack_context__.r("[project]/node_modules/@prisma/client/runtime/index-browser.js [app-client] (ecmascript)");
const Prisma = {};
exports.Prisma = Prisma;
exports.$Enums = {};
/**
 * Prisma Client JS version: 6.19.0
 * Query Engine version: 2ba551f319ab1df4bc874a89965d8b3641056773
 */ Prisma.prismaVersion = {
    client: "6.19.0",
    engine: "2ba551f319ab1df4bc874a89965d8b3641056773"
};
Prisma.PrismaClientKnownRequestError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientUnknownRequestError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientRustPanicError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientInitializationError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientValidationError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.Decimal = Decimal;
/**
 * Re-export of sql-template-tag
 */ Prisma.sql = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.empty = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.join = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.raw = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.validator = Public.validator;
/**
* Extensions
*/ Prisma.getExtensionContext = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.defineExtension = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
/**
 * Shorthand utilities for JSON filtering
 */ Prisma.DbNull = objectEnumValues.instances.DbNull;
Prisma.JsonNull = objectEnumValues.instances.JsonNull;
Prisma.AnyNull = objectEnumValues.instances.AnyNull;
Prisma.NullTypes = {
    DbNull: objectEnumValues.classes.DbNull,
    JsonNull: objectEnumValues.classes.JsonNull,
    AnyNull: objectEnumValues.classes.AnyNull
};
/**
 * Enums
 */ exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.Prisma.UserScalarFieldEnum = {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    password: 'password',
    role: 'role',
    adminNotes: 'adminNotes',
    sessionsInvalidatedAt: 'sessionsInvalidatedAt',
    communicationPreferences: 'communicationPreferences',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.AccountScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires_at: 'expires_at',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state'
};
exports.Prisma.CategoryScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    image: 'image',
    parentId: 'parentId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.ProductScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    price: 'price',
    comparePrice: 'comparePrice',
    sku: 'sku',
    stock: 'stock',
    featured: 'featured',
    published: 'published',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    categoryId: 'categoryId'
};
exports.Prisma.ProductImageScalarFieldEnum = {
    id: 'id',
    url: 'url',
    alt: 'alt',
    position: 'position',
    productId: 'productId',
    createdAt: 'createdAt'
};
exports.Prisma.VariantOptionScalarFieldEnum = {
    id: 'id',
    name: 'name',
    position: 'position',
    productId: 'productId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.VariantOptionValueScalarFieldEnum = {
    id: 'id',
    value: 'value',
    position: 'position',
    optionId: 'optionId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.ProductVariantScalarFieldEnum = {
    id: 'id',
    sku: 'sku',
    price: 'price',
    comparePrice: 'comparePrice',
    stock: 'stock',
    image: 'image',
    optionValues: 'optionValues',
    productId: 'productId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CartScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CartItemScalarFieldEnum = {
    id: 'id',
    quantity: 'quantity',
    cartId: 'cartId',
    productId: 'productId',
    variantId: 'variantId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.AbandonedCartScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    guestEmail: 'guestEmail',
    guestName: 'guestName',
    cartSnapshot: 'cartSnapshot',
    totalValue: 'totalValue',
    status: 'status',
    abandonedAt: 'abandonedAt',
    recoveredAt: 'recoveredAt',
    recoveryToken: 'recoveryToken',
    discountCode: 'discountCode',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.AbandonedCartEmailScalarFieldEnum = {
    id: 'id',
    abandonedCartId: 'abandonedCartId',
    emailType: 'emailType',
    sentAt: 'sentAt',
    opened: 'opened',
    clicked: 'clicked'
};
exports.Prisma.OrderScalarFieldEnum = {
    id: 'id',
    orderNumber: 'orderNumber',
    status: 'status',
    paymentStatus: 'paymentStatus',
    subtotal: 'subtotal',
    tax: 'tax',
    shipping: 'shipping',
    total: 'total',
    notes: 'notes',
    isGuest: 'isGuest',
    guestEmail: 'guestEmail',
    discountCodeId: 'discountCodeId',
    discountAmount: 'discountAmount',
    trackingNumber: 'trackingNumber',
    carrier: 'carrier',
    estimatedDelivery: 'estimatedDelivery',
    shippedAt: 'shippedAt',
    deliveredAt: 'deliveredAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId',
    shippingAddressId: 'shippingAddressId',
    billingAddressId: 'billingAddressId',
    isPosOrder: 'isPosOrder',
    posOrderId: 'posOrderId'
};
exports.Prisma.OrderItemScalarFieldEnum = {
    id: 'id',
    quantity: 'quantity',
    price: 'price',
    total: 'total',
    orderId: 'orderId',
    productId: 'productId',
    variantId: 'variantId',
    createdAt: 'createdAt'
};
exports.Prisma.LocationScalarFieldEnum = {
    id: 'id',
    name: 'name',
    address: 'address',
    phone: 'phone',
    isActive: 'isActive',
    settings: 'settings',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CashierScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    locationId: 'locationId',
    employeeId: 'employeeId',
    pin: 'pin',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.PosOrderScalarFieldEnum = {
    id: 'id',
    orderType: 'orderType',
    locationId: 'locationId',
    cashierId: 'cashierId',
    customerId: 'customerId',
    tableNumber: 'tableNumber',
    customerName: 'customerName',
    paymentMethod: 'paymentMethod',
    paymentDetails: 'paymentDetails',
    receiptPrinted: 'receiptPrinted',
    subtotal: 'subtotal',
    tax: 'tax',
    discount: 'discount',
    discountCode: 'discountCode',
    discountType: 'discountType',
    total: 'total',
    status: 'status',
    notes: 'notes',
    specialInstructions: 'specialInstructions',
    orderId: 'orderId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.PosSessionScalarFieldEnum = {
    id: 'id',
    cashierId: 'cashierId',
    userId: 'userId',
    locationId: 'locationId',
    openedAt: 'openedAt',
    closedAt: 'closedAt',
    openingCash: 'openingCash',
    closingCash: 'closingCash',
    expectedCash: 'expectedCash',
    difference: 'difference',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.AddressScalarFieldEnum = {
    id: 'id',
    firstName: 'firstName',
    lastName: 'lastName',
    company: 'company',
    address1: 'address1',
    address2: 'address2',
    city: 'city',
    state: 'state',
    postalCode: 'postalCode',
    country: 'country',
    phone: 'phone',
    isDefault: 'isDefault',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId'
};
exports.Prisma.ReviewScalarFieldEnum = {
    id: 'id',
    rating: 'rating',
    title: 'title',
    comment: 'comment',
    verified: 'verified',
    approved: 'approved',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId',
    productId: 'productId'
};
exports.Prisma.OrderNoteScalarFieldEnum = {
    id: 'id',
    note: 'note',
    isInternal: 'isInternal',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    orderId: 'orderId',
    userId: 'userId'
};
exports.Prisma.StockAlertScalarFieldEnum = {
    id: 'id',
    threshold: 'threshold',
    notified: 'notified',
    productId: 'productId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.StockHistoryScalarFieldEnum = {
    id: 'id',
    productId: 'productId',
    variantId: 'variantId',
    changeType: 'changeType',
    quantityBefore: 'quantityBefore',
    quantityAfter: 'quantityAfter',
    quantityChange: 'quantityChange',
    reason: 'reason',
    notes: 'notes',
    orderId: 'orderId',
    supplierId: 'supplierId',
    userId: 'userId',
    createdAt: 'createdAt'
};
exports.Prisma.SupplierScalarFieldEnum = {
    id: 'id',
    name: 'name',
    contactName: 'contactName',
    email: 'email',
    phone: 'phone',
    address: 'address',
    website: 'website',
    notes: 'notes',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.PurchaseOrderScalarFieldEnum = {
    id: 'id',
    orderNumber: 'orderNumber',
    supplierId: 'supplierId',
    status: 'status',
    orderDate: 'orderDate',
    expectedDate: 'expectedDate',
    receivedDate: 'receivedDate',
    subtotal: 'subtotal',
    tax: 'tax',
    shipping: 'shipping',
    total: 'total',
    notes: 'notes',
    createdById: 'createdById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.PurchaseOrderItemScalarFieldEnum = {
    id: 'id',
    purchaseOrderId: 'purchaseOrderId',
    productId: 'productId',
    variantId: 'variantId',
    quantity: 'quantity',
    unitCost: 'unitCost',
    total: 'total',
    receivedQuantity: 'receivedQuantity',
    createdAt: 'createdAt'
};
exports.Prisma.PasswordResetScalarFieldEnum = {
    id: 'id',
    token: 'token',
    userId: 'userId',
    expiresAt: 'expiresAt',
    used: 'used',
    createdAt: 'createdAt'
};
exports.Prisma.DiscountCodeScalarFieldEnum = {
    id: 'id',
    code: 'code',
    type: 'type',
    value: 'value',
    minOrderAmount: 'minOrderAmount',
    maxUses: 'maxUses',
    usedCount: 'usedCount',
    startDate: 'startDate',
    endDate: 'endDate',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.NewsletterSubscriberScalarFieldEnum = {
    id: 'id',
    email: 'email',
    name: 'name',
    isActive: 'isActive',
    subscribedAt: 'subscribedAt',
    unsubscribedAt: 'unsubscribedAt',
    source: 'source',
    landingPageId: 'landingPageId',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.WishlistItemScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    productId: 'productId',
    createdAt: 'createdAt'
};
exports.Prisma.StoreSettingScalarFieldEnum = {
    id: 'id',
    key: 'key',
    value: 'value',
    category: 'category',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt'
};
exports.Prisma.FeatureFlagScalarFieldEnum = {
    id: 'id',
    name: 'name',
    displayName: 'displayName',
    description: 'description',
    enabled: 'enabled',
    category: 'category',
    tier: 'tier',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.RegionScalarFieldEnum = {
    id: 'id',
    name: 'name',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CityScalarFieldEnum = {
    id: 'id',
    name: 'name',
    regionId: 'regionId',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CheckoutSettingsScalarFieldEnum = {
    id: 'id',
    showPhone: 'showPhone',
    showCompany: 'showCompany',
    showAddressLine2: 'showAddressLine2',
    requirePhone: 'requirePhone',
    thankYouMessage: 'thankYouMessage',
    checkoutBanner: 'checkoutBanner',
    checkoutBannerType: 'checkoutBannerType',
    enableGuestCheckout: 'enableGuestCheckout',
    enableOrderNotes: 'enableOrderNotes',
    orderNotesLabel: 'orderNotesLabel',
    freeShippingThreshold: 'freeShippingThreshold',
    defaultShippingCost: 'defaultShippingCost',
    logoUrl: 'logoUrl',
    primaryColor: 'primaryColor',
    secondaryColor: 'secondaryColor',
    buttonStyle: 'buttonStyle',
    fontFamily: 'fontFamily',
    pageWidth: 'pageWidth',
    checkoutLayout: 'checkoutLayout',
    progressStyle: 'progressStyle',
    orderSummaryPosition: 'orderSummaryPosition',
    fieldLabels: 'fieldLabels',
    fieldPlaceholders: 'fieldPlaceholders',
    fieldOrder: 'fieldOrder',
    showDeliveryInstructions: 'showDeliveryInstructions',
    deliveryInstructionsLabel: 'deliveryInstructionsLabel',
    showAlternativePhone: 'showAlternativePhone',
    showGiftMessage: 'showGiftMessage',
    giftMessageLabel: 'giftMessageLabel',
    showDeliveryDate: 'showDeliveryDate',
    customFields: 'customFields',
    trustBadges: 'trustBadges',
    showSecuritySeals: 'showSecuritySeals',
    moneyBackGuarantee: 'moneyBackGuarantee',
    customerServiceDisplay: 'customerServiceDisplay',
    customerServiceText: 'customerServiceText',
    customerServicePhone: 'customerServicePhone',
    customerServiceEmail: 'customerServiceEmail',
    showOrderCount: 'showOrderCount',
    orderCountText: 'orderCountText',
    showRecentPurchases: 'showRecentPurchases',
    recentPurchaseDelay: 'recentPurchaseDelay',
    showTestimonials: 'showTestimonials',
    testimonials: 'testimonials',
    showTrustRating: 'showTrustRating',
    trustRatingScore: 'trustRatingScore',
    trustRatingCount: 'trustRatingCount',
    promotionalBanners: 'promotionalBanners',
    showCountdownTimer: 'showCountdownTimer',
    countdownEndDate: 'countdownEndDate',
    countdownText: 'countdownText',
    showFreeShippingBar: 'showFreeShippingBar',
    freeShippingBarText: 'freeShippingBarText',
    showUpsells: 'showUpsells',
    upsellProducts: 'upsellProducts',
    upsellTitle: 'upsellTitle',
    upsellPosition: 'upsellPosition',
    showLowStock: 'showLowStock',
    lowStockThreshold: 'lowStockThreshold',
    lowStockText: 'lowStockText',
    scarcityMessage: 'scarcityMessage',
    urgencyBadgeStyle: 'urgencyBadgeStyle',
    discountFieldPosition: 'discountFieldPosition',
    showLoyaltyPoints: 'showLoyaltyPoints',
    loyaltyPointsText: 'loyaltyPointsText',
    showGiftWithPurchase: 'showGiftWithPurchase',
    giftThreshold: 'giftThreshold',
    giftDescription: 'giftDescription',
    referralDiscountEnabled: 'referralDiscountEnabled',
    referralDiscountText: 'referralDiscountText',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.RefundScalarFieldEnum = {
    id: 'id',
    rmaNumber: 'rmaNumber',
    status: 'status',
    reason: 'reason',
    reasonDetails: 'reasonDetails',
    refundAmount: 'refundAmount',
    restockItems: 'restockItems',
    adminNotes: 'adminNotes',
    customerNotes: 'customerNotes',
    processedAt: 'processedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    orderId: 'orderId',
    requestedById: 'requestedById',
    processedById: 'processedById'
};
exports.Prisma.RefundItemScalarFieldEnum = {
    id: 'id',
    quantity: 'quantity',
    refundId: 'refundId',
    orderItemId: 'orderItemId',
    productId: 'productId',
    variantId: 'variantId'
};
exports.Prisma.PermissionScalarFieldEnum = {
    id: 'id',
    resource: 'resource',
    action: 'action',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.AdminInvitationScalarFieldEnum = {
    id: 'id',
    email: 'email',
    role: 'role',
    token: 'token',
    expiresAt: 'expiresAt',
    acceptedAt: 'acceptedAt',
    createdAt: 'createdAt',
    invitedBy: 'invitedBy'
};
exports.Prisma.AdminActivityLogScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    action: 'action',
    resource: 'resource',
    resourceId: 'resourceId',
    details: 'details',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    createdAt: 'createdAt'
};
exports.Prisma.ProductTranslationScalarFieldEnum = {
    id: 'id',
    productId: 'productId',
    locale: 'locale',
    name: 'name',
    description: 'description',
    slug: 'slug',
    metaTitle: 'metaTitle',
    metaDescription: 'metaDescription',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CategoryTranslationScalarFieldEnum = {
    id: 'id',
    categoryId: 'categoryId',
    locale: 'locale',
    name: 'name',
    description: 'description',
    slug: 'slug',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.TemplateScalarFieldEnum = {
    id: 'id',
    name: 'name',
    type: 'type',
    isActive: 'isActive',
    content: 'content',
    variables: 'variables',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.BlogPostScalarFieldEnum = {
    id: 'id',
    title: 'title',
    slug: 'slug',
    content: 'content',
    excerpt: 'excerpt',
    featuredImage: 'featuredImage',
    status: 'status',
    publishedAt: 'publishedAt',
    useBlockEditor: 'useBlockEditor',
    seoTitle: 'seoTitle',
    seoDescription: 'seoDescription',
    authorId: 'authorId',
    categoryId: 'categoryId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.BlogCategoryScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.BlogTagScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.PageScalarFieldEnum = {
    id: 'id',
    title: 'title',
    slug: 'slug',
    content: 'content',
    status: 'status',
    useStorefrontLayout: 'useStorefrontLayout',
    useBlockEditor: 'useBlockEditor',
    seoTitle: 'seoTitle',
    seoDescription: 'seoDescription',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.MediaLibraryScalarFieldEnum = {
    id: 'id',
    filename: 'filename',
    originalName: 'originalName',
    mimeType: 'mimeType',
    fileSize: 'fileSize',
    type: 'type',
    cloudinaryId: 'cloudinaryId',
    url: 'url',
    secureUrl: 'secureUrl',
    publicId: 'publicId',
    version: 'version',
    format: 'format',
    width: 'width',
    height: 'height',
    aspectRatio: 'aspectRatio',
    altText: 'altText',
    title: 'title',
    caption: 'caption',
    description: 'description',
    folderId: 'folderId',
    uploadedById: 'uploadedById',
    usageCount: 'usageCount',
    lastUsedAt: 'lastUsedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.MediaFolderScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    parentId: 'parentId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.MediaTagScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.MediaUsageScalarFieldEnum = {
    id: 'id',
    mediaId: 'mediaId',
    usageType: 'usageType',
    resourceType: 'resourceType',
    resourceId: 'resourceId',
    fieldName: 'fieldName',
    createdAt: 'createdAt'
};
exports.Prisma.MediaVariantScalarFieldEnum = {
    id: 'id',
    mediaId: 'mediaId',
    name: 'name',
    width: 'width',
    height: 'height',
    url: 'url',
    cloudinaryId: 'cloudinaryId',
    createdAt: 'createdAt'
};
exports.Prisma.PopupScalarFieldEnum = {
    id: 'id',
    name: 'name',
    title: 'title',
    content: 'content',
    type: 'type',
    triggerValue: 'triggerValue',
    target: 'target',
    customUrls: 'customUrls',
    position: 'position',
    width: 'width',
    height: 'height',
    backgroundColor: 'backgroundColor',
    textColor: 'textColor',
    buttonText: 'buttonText',
    buttonColor: 'buttonColor',
    buttonTextColor: 'buttonTextColor',
    showCloseButton: 'showCloseButton',
    overlayColor: 'overlayColor',
    imageUrl: 'imageUrl',
    frequency: 'frequency',
    delaySeconds: 'delaySeconds',
    ctaType: 'ctaType',
    ctaUrl: 'ctaUrl',
    discountCode: 'discountCode',
    isActive: 'isActive',
    startDate: 'startDate',
    endDate: 'endDate',
    priority: 'priority',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.PopupAnalyticsScalarFieldEnum = {
    id: 'id',
    popupId: 'popupId',
    views: 'views',
    clicks: 'clicks',
    dismissals: 'dismissals',
    conversions: 'conversions',
    date: 'date',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.PaymentMethodScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    provider: 'provider',
    providerToken: 'providerToken',
    type: 'type',
    cardLast4: 'cardLast4',
    cardBrand: 'cardBrand',
    cardExpMonth: 'cardExpMonth',
    cardExpYear: 'cardExpYear',
    email: 'email',
    bankName: 'bankName',
    isDefault: 'isDefault',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.AccountDeletionRequestScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    reason: 'reason',
    status: 'status',
    requestedAt: 'requestedAt',
    scheduledAt: 'scheduledAt',
    completedAt: 'completedAt',
    adminNotes: 'adminNotes',
    reviewedById: 'reviewedById',
    reviewedAt: 'reviewedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.ProductCustomizationFieldScalarFieldEnum = {
    id: 'id',
    productId: 'productId',
    type: 'type',
    label: 'label',
    placeholder: 'placeholder',
    helpText: 'helpText',
    required: 'required',
    position: 'position',
    minLength: 'minLength',
    maxLength: 'maxLength',
    minValue: 'minValue',
    maxValue: 'maxValue',
    pattern: 'pattern',
    maxFileSize: 'maxFileSize',
    allowedTypes: 'allowedTypes',
    priceModifier: 'priceModifier',
    priceModifierType: 'priceModifierType',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.ProductCustomizationOptionScalarFieldEnum = {
    id: 'id',
    fieldId: 'fieldId',
    label: 'label',
    value: 'value',
    position: 'position',
    priceModifier: 'priceModifier',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CartItemCustomizationScalarFieldEnum = {
    id: 'id',
    cartItemId: 'cartItemId',
    fieldId: 'fieldId',
    value: 'value',
    fileUrl: 'fileUrl',
    fileName: 'fileName',
    priceModifier: 'priceModifier',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.OrderItemCustomizationScalarFieldEnum = {
    id: 'id',
    orderItemId: 'orderItemId',
    fieldId: 'fieldId',
    fieldLabel: 'fieldLabel',
    fieldType: 'fieldType',
    value: 'value',
    fileUrl: 'fileUrl',
    fileName: 'fileName',
    priceModifier: 'priceModifier',
    createdAt: 'createdAt'
};
exports.Prisma.BackupScalarFieldEnum = {
    id: 'id',
    filename: 'filename',
    fileSize: 'fileSize',
    type: 'type',
    status: 'status',
    includeProducts: 'includeProducts',
    includeOrders: 'includeOrders',
    includeCustomers: 'includeCustomers',
    includeMedia: 'includeMedia',
    includeSettings: 'includeSettings',
    fileUrl: 'fileUrl',
    localPath: 'localPath',
    recordCount: 'recordCount',
    errorMessage: 'errorMessage',
    createdById: 'createdById',
    completedAt: 'completedAt',
    createdAt: 'createdAt'
};
exports.Prisma.DataExportScalarFieldEnum = {
    id: 'id',
    type: 'type',
    format: 'format',
    status: 'status',
    filters: 'filters',
    filename: 'filename',
    fileUrl: 'fileUrl',
    fileSize: 'fileSize',
    recordCount: 'recordCount',
    errorMessage: 'errorMessage',
    createdById: 'createdById',
    completedAt: 'completedAt',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
};
exports.Prisma.DataImportScalarFieldEnum = {
    id: 'id',
    type: 'type',
    format: 'format',
    mode: 'mode',
    status: 'status',
    filename: 'filename',
    fileUrl: 'fileUrl',
    fileSize: 'fileSize',
    totalRows: 'totalRows',
    successCount: 'successCount',
    failedCount: 'failedCount',
    skippedCount: 'skippedCount',
    errors: 'errors',
    isPreview: 'isPreview',
    createdById: 'createdById',
    completedAt: 'completedAt',
    createdAt: 'createdAt'
};
exports.Prisma.UrlRedirectScalarFieldEnum = {
    id: 'id',
    fromPath: 'fromPath',
    toPath: 'toPath',
    type: 'type',
    isActive: 'isActive',
    hitCount: 'hitCount',
    lastHitAt: 'lastHitAt',
    notes: 'notes',
    createdById: 'createdById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.SchemaMarkupScalarFieldEnum = {
    id: 'id',
    name: 'name',
    type: 'type',
    isActive: 'isActive',
    schemaData: 'schemaData',
    applyToAll: 'applyToAll',
    targetPages: 'targetPages',
    priority: 'priority',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.EmailCampaignScalarFieldEnum = {
    id: 'id',
    name: 'name',
    subject: 'subject',
    preheader: 'preheader',
    type: 'type',
    status: 'status',
    htmlContent: 'htmlContent',
    textContent: 'textContent',
    templateId: 'templateId',
    scheduledAt: 'scheduledAt',
    sentAt: 'sentAt',
    sendToAll: 'sendToAll',
    recipientCount: 'recipientCount',
    fromName: 'fromName',
    fromEmail: 'fromEmail',
    replyTo: 'replyTo',
    totalSent: 'totalSent',
    totalOpened: 'totalOpened',
    totalClicked: 'totalClicked',
    totalBounced: 'totalBounced',
    totalUnsubscribed: 'totalUnsubscribed',
    createdById: 'createdById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CampaignRecipientScalarFieldEnum = {
    id: 'id',
    campaignId: 'campaignId',
    email: 'email',
    name: 'name',
    userId: 'userId',
    sent: 'sent',
    sentAt: 'sentAt',
    opened: 'opened',
    openedAt: 'openedAt',
    clicked: 'clicked',
    clickedAt: 'clickedAt',
    bounced: 'bounced',
    unsubscribed: 'unsubscribed',
    trackingToken: 'trackingToken',
    createdAt: 'createdAt'
};
exports.Prisma.CampaignAnalyticsScalarFieldEnum = {
    id: 'id',
    campaignId: 'campaignId',
    eventType: 'eventType',
    recipientEmail: 'recipientEmail',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    clickedUrl: 'clickedUrl',
    createdAt: 'createdAt'
};
exports.Prisma.EmailTemplateScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    category: 'category',
    subject: 'subject',
    preheader: 'preheader',
    htmlContent: 'htmlContent',
    textContent: 'textContent',
    thumbnailUrl: 'thumbnailUrl',
    isPublic: 'isPublic',
    usageCount: 'usageCount',
    createdById: 'createdById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.BlockTemplateScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    category: 'category',
    thumbnail: 'thumbnail',
    previewUrl: 'previewUrl',
    defaultConfig: 'defaultConfig',
    configSchema: 'configSchema',
    componentCode: 'componentCode',
    htmlTemplate: 'htmlTemplate',
    cssStyles: 'cssStyles',
    isSystem: 'isSystem',
    isActive: 'isActive',
    isPro: 'isPro',
    usageCount: 'usageCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.ContentBlockScalarFieldEnum = {
    id: 'id',
    templateId: 'templateId',
    pageId: 'pageId',
    postId: 'postId',
    landingPageId: 'landingPageId',
    config: 'config',
    customCss: 'customCss',
    customClasses: 'customClasses',
    order: 'order',
    isVisible: 'isVisible',
    visibilityRules: 'visibilityRules',
    hideOnMobile: 'hideOnMobile',
    hideOnTablet: 'hideOnTablet',
    hideOnDesktop: 'hideOnDesktop',
    animationType: 'animationType',
    animationDelay: 'animationDelay',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.LandingPageScalarFieldEnum = {
    id: 'id',
    title: 'title',
    slug: 'slug',
    description: 'description',
    seoTitle: 'seoTitle',
    seoDescription: 'seoDescription',
    seoKeywords: 'seoKeywords',
    ogImage: 'ogImage',
    ogTitle: 'ogTitle',
    ogDescription: 'ogDescription',
    status: 'status',
    publishedAt: 'publishedAt',
    scheduledPublishAt: 'scheduledPublishAt',
    layoutConfig: 'layoutConfig',
    customCss: 'customCss',
    customJs: 'customJs',
    templateId: 'templateId',
    authorId: 'authorId',
    viewCount: 'viewCount',
    conversionGoal: 'conversionGoal',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.LandingPageTemplateScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    category: 'category',
    thumbnail: 'thumbnail',
    previewUrl: 'previewUrl',
    templateData: 'templateData',
    isSystem: 'isSystem',
    isActive: 'isActive',
    isPro: 'isPro',
    usageCount: 'usageCount',
    createdById: 'createdById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.LandingPageRevisionScalarFieldEnum = {
    id: 'id',
    pageId: 'pageId',
    title: 'title',
    slug: 'slug',
    description: 'description',
    seoTitle: 'seoTitle',
    seoDescription: 'seoDescription',
    seoKeywords: 'seoKeywords',
    ogImage: 'ogImage',
    ogTitle: 'ogTitle',
    ogDescription: 'ogDescription',
    status: 'status',
    layoutConfig: 'layoutConfig',
    customCss: 'customCss',
    customJs: 'customJs',
    blocksSnapshot: 'blocksSnapshot',
    revisionNumber: 'revisionNumber',
    note: 'note',
    createdById: 'createdById',
    createdAt: 'createdAt'
};
exports.Prisma.FlashSaleScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    discountType: 'discountType',
    discountValue: 'discountValue',
    startDate: 'startDate',
    endDate: 'endDate',
    status: 'status',
    isActive: 'isActive',
    priority: 'priority',
    bannerImage: 'bannerImage',
    bannerText: 'bannerText',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.FlashSaleProductScalarFieldEnum = {
    id: 'id',
    flashSaleId: 'flashSaleId',
    productId: 'productId',
    originalPrice: 'originalPrice',
    salePrice: 'salePrice',
    maxQuantity: 'maxQuantity',
    soldQuantity: 'soldQuantity',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.FlashSaleCategoryScalarFieldEnum = {
    id: 'id',
    flashSaleId: 'flashSaleId',
    categoryId: 'categoryId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.Prisma.NullableJsonNullValueInput = {
    DbNull: Prisma.DbNull,
    JsonNull: Prisma.JsonNull
};
exports.Prisma.JsonNullValueInput = {
    JsonNull: Prisma.JsonNull
};
exports.Prisma.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.Prisma.UserOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    email: 'email',
    image: 'image',
    password: 'password',
    adminNotes: 'adminNotes',
    communicationPreferences: 'communicationPreferences'
};
exports.Prisma.AccountOrderByRelevanceFieldEnum = {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state'
};
exports.Prisma.CategoryOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    image: 'image',
    parentId: 'parentId'
};
exports.Prisma.ProductOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    sku: 'sku',
    categoryId: 'categoryId'
};
exports.Prisma.ProductImageOrderByRelevanceFieldEnum = {
    id: 'id',
    url: 'url',
    alt: 'alt',
    productId: 'productId'
};
exports.Prisma.VariantOptionOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    productId: 'productId'
};
exports.Prisma.VariantOptionValueOrderByRelevanceFieldEnum = {
    id: 'id',
    value: 'value',
    optionId: 'optionId'
};
exports.Prisma.ProductVariantOrderByRelevanceFieldEnum = {
    id: 'id',
    sku: 'sku',
    image: 'image',
    optionValues: 'optionValues',
    productId: 'productId'
};
exports.Prisma.CartOrderByRelevanceFieldEnum = {
    id: 'id',
    userId: 'userId'
};
exports.Prisma.CartItemOrderByRelevanceFieldEnum = {
    id: 'id',
    cartId: 'cartId',
    productId: 'productId',
    variantId: 'variantId'
};
exports.Prisma.AbandonedCartOrderByRelevanceFieldEnum = {
    id: 'id',
    userId: 'userId',
    guestEmail: 'guestEmail',
    guestName: 'guestName',
    cartSnapshot: 'cartSnapshot',
    recoveryToken: 'recoveryToken',
    discountCode: 'discountCode'
};
exports.Prisma.AbandonedCartEmailOrderByRelevanceFieldEnum = {
    id: 'id',
    abandonedCartId: 'abandonedCartId',
    emailType: 'emailType'
};
exports.Prisma.OrderOrderByRelevanceFieldEnum = {
    id: 'id',
    orderNumber: 'orderNumber',
    notes: 'notes',
    guestEmail: 'guestEmail',
    discountCodeId: 'discountCodeId',
    trackingNumber: 'trackingNumber',
    carrier: 'carrier',
    userId: 'userId',
    shippingAddressId: 'shippingAddressId',
    billingAddressId: 'billingAddressId',
    posOrderId: 'posOrderId'
};
exports.Prisma.OrderItemOrderByRelevanceFieldEnum = {
    id: 'id',
    orderId: 'orderId',
    productId: 'productId',
    variantId: 'variantId'
};
exports.Prisma.LocationOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    address: 'address',
    phone: 'phone',
    settings: 'settings'
};
exports.Prisma.CashierOrderByRelevanceFieldEnum = {
    id: 'id',
    userId: 'userId',
    locationId: 'locationId',
    employeeId: 'employeeId',
    pin: 'pin'
};
exports.Prisma.PosOrderOrderByRelevanceFieldEnum = {
    id: 'id',
    locationId: 'locationId',
    cashierId: 'cashierId',
    customerId: 'customerId',
    tableNumber: 'tableNumber',
    customerName: 'customerName',
    paymentDetails: 'paymentDetails',
    discountCode: 'discountCode',
    discountType: 'discountType',
    notes: 'notes',
    specialInstructions: 'specialInstructions',
    orderId: 'orderId'
};
exports.Prisma.PosSessionOrderByRelevanceFieldEnum = {
    id: 'id',
    cashierId: 'cashierId',
    userId: 'userId',
    locationId: 'locationId'
};
exports.Prisma.AddressOrderByRelevanceFieldEnum = {
    id: 'id',
    firstName: 'firstName',
    lastName: 'lastName',
    company: 'company',
    address1: 'address1',
    address2: 'address2',
    city: 'city',
    state: 'state',
    postalCode: 'postalCode',
    country: 'country',
    phone: 'phone',
    userId: 'userId'
};
exports.Prisma.ReviewOrderByRelevanceFieldEnum = {
    id: 'id',
    title: 'title',
    comment: 'comment',
    userId: 'userId',
    productId: 'productId'
};
exports.Prisma.OrderNoteOrderByRelevanceFieldEnum = {
    id: 'id',
    note: 'note',
    orderId: 'orderId',
    userId: 'userId'
};
exports.Prisma.StockAlertOrderByRelevanceFieldEnum = {
    id: 'id',
    productId: 'productId'
};
exports.Prisma.StockHistoryOrderByRelevanceFieldEnum = {
    id: 'id',
    productId: 'productId',
    variantId: 'variantId',
    reason: 'reason',
    notes: 'notes',
    orderId: 'orderId',
    supplierId: 'supplierId',
    userId: 'userId'
};
exports.Prisma.SupplierOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    contactName: 'contactName',
    email: 'email',
    phone: 'phone',
    address: 'address',
    website: 'website',
    notes: 'notes'
};
exports.Prisma.PurchaseOrderOrderByRelevanceFieldEnum = {
    id: 'id',
    orderNumber: 'orderNumber',
    supplierId: 'supplierId',
    notes: 'notes',
    createdById: 'createdById'
};
exports.Prisma.PurchaseOrderItemOrderByRelevanceFieldEnum = {
    id: 'id',
    purchaseOrderId: 'purchaseOrderId',
    productId: 'productId',
    variantId: 'variantId'
};
exports.Prisma.PasswordResetOrderByRelevanceFieldEnum = {
    id: 'id',
    token: 'token',
    userId: 'userId'
};
exports.Prisma.DiscountCodeOrderByRelevanceFieldEnum = {
    id: 'id',
    code: 'code'
};
exports.Prisma.NewsletterSubscriberOrderByRelevanceFieldEnum = {
    id: 'id',
    email: 'email',
    name: 'name',
    source: 'source',
    landingPageId: 'landingPageId',
    userId: 'userId'
};
exports.Prisma.WishlistItemOrderByRelevanceFieldEnum = {
    id: 'id',
    userId: 'userId',
    productId: 'productId'
};
exports.Prisma.StoreSettingOrderByRelevanceFieldEnum = {
    id: 'id',
    key: 'key',
    value: 'value',
    category: 'category'
};
exports.Prisma.FeatureFlagOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    displayName: 'displayName',
    description: 'description',
    category: 'category'
};
exports.Prisma.RegionOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name'
};
exports.Prisma.CityOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    regionId: 'regionId'
};
exports.Prisma.JsonNullValueFilter = {
    DbNull: Prisma.DbNull,
    JsonNull: Prisma.JsonNull,
    AnyNull: Prisma.AnyNull
};
exports.Prisma.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.Prisma.CheckoutSettingsOrderByRelevanceFieldEnum = {
    id: 'id',
    thankYouMessage: 'thankYouMessage',
    checkoutBanner: 'checkoutBanner',
    checkoutBannerType: 'checkoutBannerType',
    orderNotesLabel: 'orderNotesLabel',
    logoUrl: 'logoUrl',
    primaryColor: 'primaryColor',
    secondaryColor: 'secondaryColor',
    buttonStyle: 'buttonStyle',
    fontFamily: 'fontFamily',
    pageWidth: 'pageWidth',
    checkoutLayout: 'checkoutLayout',
    progressStyle: 'progressStyle',
    orderSummaryPosition: 'orderSummaryPosition',
    deliveryInstructionsLabel: 'deliveryInstructionsLabel',
    giftMessageLabel: 'giftMessageLabel',
    moneyBackGuarantee: 'moneyBackGuarantee',
    customerServiceText: 'customerServiceText',
    customerServicePhone: 'customerServicePhone',
    customerServiceEmail: 'customerServiceEmail',
    orderCountText: 'orderCountText',
    countdownText: 'countdownText',
    freeShippingBarText: 'freeShippingBarText',
    upsellTitle: 'upsellTitle',
    upsellPosition: 'upsellPosition',
    lowStockText: 'lowStockText',
    scarcityMessage: 'scarcityMessage',
    urgencyBadgeStyle: 'urgencyBadgeStyle',
    discountFieldPosition: 'discountFieldPosition',
    loyaltyPointsText: 'loyaltyPointsText',
    giftDescription: 'giftDescription',
    referralDiscountText: 'referralDiscountText'
};
exports.Prisma.RefundOrderByRelevanceFieldEnum = {
    id: 'id',
    rmaNumber: 'rmaNumber',
    reasonDetails: 'reasonDetails',
    adminNotes: 'adminNotes',
    customerNotes: 'customerNotes',
    orderId: 'orderId',
    requestedById: 'requestedById',
    processedById: 'processedById'
};
exports.Prisma.RefundItemOrderByRelevanceFieldEnum = {
    id: 'id',
    refundId: 'refundId',
    orderItemId: 'orderItemId',
    productId: 'productId',
    variantId: 'variantId'
};
exports.Prisma.PermissionOrderByRelevanceFieldEnum = {
    id: 'id'
};
exports.Prisma.AdminInvitationOrderByRelevanceFieldEnum = {
    id: 'id',
    email: 'email',
    token: 'token',
    invitedBy: 'invitedBy'
};
exports.Prisma.AdminActivityLogOrderByRelevanceFieldEnum = {
    id: 'id',
    userId: 'userId',
    action: 'action',
    resource: 'resource',
    resourceId: 'resourceId',
    details: 'details',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent'
};
exports.Prisma.ProductTranslationOrderByRelevanceFieldEnum = {
    id: 'id',
    productId: 'productId',
    locale: 'locale',
    name: 'name',
    description: 'description',
    slug: 'slug',
    metaTitle: 'metaTitle',
    metaDescription: 'metaDescription'
};
exports.Prisma.CategoryTranslationOrderByRelevanceFieldEnum = {
    id: 'id',
    categoryId: 'categoryId',
    locale: 'locale',
    name: 'name',
    description: 'description',
    slug: 'slug'
};
exports.Prisma.TemplateOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    content: 'content',
    variables: 'variables'
};
exports.Prisma.BlogPostOrderByRelevanceFieldEnum = {
    id: 'id',
    title: 'title',
    slug: 'slug',
    content: 'content',
    excerpt: 'excerpt',
    featuredImage: 'featuredImage',
    seoTitle: 'seoTitle',
    seoDescription: 'seoDescription',
    authorId: 'authorId',
    categoryId: 'categoryId'
};
exports.Prisma.BlogCategoryOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description'
};
exports.Prisma.BlogTagOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug'
};
exports.Prisma.PageOrderByRelevanceFieldEnum = {
    id: 'id',
    title: 'title',
    slug: 'slug',
    content: 'content',
    seoTitle: 'seoTitle',
    seoDescription: 'seoDescription'
};
exports.Prisma.MediaLibraryOrderByRelevanceFieldEnum = {
    id: 'id',
    filename: 'filename',
    originalName: 'originalName',
    mimeType: 'mimeType',
    cloudinaryId: 'cloudinaryId',
    url: 'url',
    secureUrl: 'secureUrl',
    publicId: 'publicId',
    format: 'format',
    altText: 'altText',
    title: 'title',
    caption: 'caption',
    description: 'description',
    folderId: 'folderId',
    uploadedById: 'uploadedById'
};
exports.Prisma.MediaFolderOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    parentId: 'parentId'
};
exports.Prisma.MediaTagOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug'
};
exports.Prisma.MediaUsageOrderByRelevanceFieldEnum = {
    id: 'id',
    mediaId: 'mediaId',
    resourceType: 'resourceType',
    resourceId: 'resourceId',
    fieldName: 'fieldName'
};
exports.Prisma.MediaVariantOrderByRelevanceFieldEnum = {
    id: 'id',
    mediaId: 'mediaId',
    name: 'name',
    url: 'url',
    cloudinaryId: 'cloudinaryId'
};
exports.Prisma.PopupOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    title: 'title',
    content: 'content',
    customUrls: 'customUrls',
    backgroundColor: 'backgroundColor',
    textColor: 'textColor',
    buttonText: 'buttonText',
    buttonColor: 'buttonColor',
    buttonTextColor: 'buttonTextColor',
    overlayColor: 'overlayColor',
    imageUrl: 'imageUrl',
    frequency: 'frequency',
    ctaType: 'ctaType',
    ctaUrl: 'ctaUrl',
    discountCode: 'discountCode'
};
exports.Prisma.PopupAnalyticsOrderByRelevanceFieldEnum = {
    id: 'id',
    popupId: 'popupId'
};
exports.Prisma.PaymentMethodOrderByRelevanceFieldEnum = {
    id: 'id',
    userId: 'userId',
    provider: 'provider',
    providerToken: 'providerToken',
    type: 'type',
    cardLast4: 'cardLast4',
    cardBrand: 'cardBrand',
    email: 'email',
    bankName: 'bankName'
};
exports.Prisma.AccountDeletionRequestOrderByRelevanceFieldEnum = {
    id: 'id',
    userId: 'userId',
    reason: 'reason',
    status: 'status',
    adminNotes: 'adminNotes',
    reviewedById: 'reviewedById'
};
exports.Prisma.ProductCustomizationFieldOrderByRelevanceFieldEnum = {
    id: 'id',
    productId: 'productId',
    label: 'label',
    placeholder: 'placeholder',
    helpText: 'helpText',
    pattern: 'pattern',
    allowedTypes: 'allowedTypes',
    priceModifierType: 'priceModifierType'
};
exports.Prisma.ProductCustomizationOptionOrderByRelevanceFieldEnum = {
    id: 'id',
    fieldId: 'fieldId',
    label: 'label',
    value: 'value'
};
exports.Prisma.CartItemCustomizationOrderByRelevanceFieldEnum = {
    id: 'id',
    cartItemId: 'cartItemId',
    fieldId: 'fieldId',
    value: 'value',
    fileUrl: 'fileUrl',
    fileName: 'fileName'
};
exports.Prisma.OrderItemCustomizationOrderByRelevanceFieldEnum = {
    id: 'id',
    orderItemId: 'orderItemId',
    fieldId: 'fieldId',
    fieldLabel: 'fieldLabel',
    fieldType: 'fieldType',
    value: 'value',
    fileUrl: 'fileUrl',
    fileName: 'fileName'
};
exports.Prisma.BackupOrderByRelevanceFieldEnum = {
    id: 'id',
    filename: 'filename',
    fileUrl: 'fileUrl',
    localPath: 'localPath',
    errorMessage: 'errorMessage',
    createdById: 'createdById'
};
exports.Prisma.DataExportOrderByRelevanceFieldEnum = {
    id: 'id',
    filters: 'filters',
    filename: 'filename',
    fileUrl: 'fileUrl',
    errorMessage: 'errorMessage',
    createdById: 'createdById'
};
exports.Prisma.DataImportOrderByRelevanceFieldEnum = {
    id: 'id',
    filename: 'filename',
    fileUrl: 'fileUrl',
    errors: 'errors',
    createdById: 'createdById'
};
exports.Prisma.UrlRedirectOrderByRelevanceFieldEnum = {
    id: 'id',
    fromPath: 'fromPath',
    toPath: 'toPath',
    notes: 'notes',
    createdById: 'createdById'
};
exports.Prisma.SchemaMarkupOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    schemaData: 'schemaData',
    targetPages: 'targetPages'
};
exports.Prisma.EmailCampaignOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    subject: 'subject',
    preheader: 'preheader',
    htmlContent: 'htmlContent',
    textContent: 'textContent',
    templateId: 'templateId',
    fromName: 'fromName',
    fromEmail: 'fromEmail',
    replyTo: 'replyTo',
    createdById: 'createdById'
};
exports.Prisma.CampaignRecipientOrderByRelevanceFieldEnum = {
    id: 'id',
    campaignId: 'campaignId',
    email: 'email',
    name: 'name',
    userId: 'userId',
    trackingToken: 'trackingToken'
};
exports.Prisma.CampaignAnalyticsOrderByRelevanceFieldEnum = {
    id: 'id',
    campaignId: 'campaignId',
    eventType: 'eventType',
    recipientEmail: 'recipientEmail',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    clickedUrl: 'clickedUrl'
};
exports.Prisma.EmailTemplateOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    category: 'category',
    subject: 'subject',
    preheader: 'preheader',
    htmlContent: 'htmlContent',
    textContent: 'textContent',
    thumbnailUrl: 'thumbnailUrl',
    createdById: 'createdById'
};
exports.Prisma.BlockTemplateOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    thumbnail: 'thumbnail',
    previewUrl: 'previewUrl',
    componentCode: 'componentCode',
    htmlTemplate: 'htmlTemplate',
    cssStyles: 'cssStyles'
};
exports.Prisma.ContentBlockOrderByRelevanceFieldEnum = {
    id: 'id',
    templateId: 'templateId',
    pageId: 'pageId',
    postId: 'postId',
    landingPageId: 'landingPageId',
    customCss: 'customCss',
    customClasses: 'customClasses',
    animationType: 'animationType'
};
exports.Prisma.LandingPageOrderByRelevanceFieldEnum = {
    id: 'id',
    title: 'title',
    slug: 'slug',
    description: 'description',
    seoTitle: 'seoTitle',
    seoDescription: 'seoDescription',
    seoKeywords: 'seoKeywords',
    ogImage: 'ogImage',
    ogTitle: 'ogTitle',
    ogDescription: 'ogDescription',
    customCss: 'customCss',
    customJs: 'customJs',
    templateId: 'templateId',
    authorId: 'authorId',
    conversionGoal: 'conversionGoal'
};
exports.Prisma.LandingPageTemplateOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    category: 'category',
    thumbnail: 'thumbnail',
    previewUrl: 'previewUrl',
    createdById: 'createdById'
};
exports.Prisma.LandingPageRevisionOrderByRelevanceFieldEnum = {
    id: 'id',
    pageId: 'pageId',
    title: 'title',
    slug: 'slug',
    description: 'description',
    seoTitle: 'seoTitle',
    seoDescription: 'seoDescription',
    seoKeywords: 'seoKeywords',
    ogImage: 'ogImage',
    ogTitle: 'ogTitle',
    ogDescription: 'ogDescription',
    customCss: 'customCss',
    customJs: 'customJs',
    note: 'note',
    createdById: 'createdById'
};
exports.Prisma.FlashSaleOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    bannerImage: 'bannerImage',
    bannerText: 'bannerText'
};
exports.Prisma.FlashSaleProductOrderByRelevanceFieldEnum = {
    id: 'id',
    flashSaleId: 'flashSaleId',
    productId: 'productId'
};
exports.Prisma.FlashSaleCategoryOrderByRelevanceFieldEnum = {
    id: 'id',
    flashSaleId: 'flashSaleId',
    categoryId: 'categoryId'
};
exports.UserRole = exports.$Enums.UserRole = {
    CUSTOMER: 'CUSTOMER',
    ADMIN: 'ADMIN',
    SUPERADMIN: 'SUPERADMIN',
    MANAGER: 'MANAGER',
    EDITOR: 'EDITOR',
    SUPPORT: 'SUPPORT',
    VIEWER: 'VIEWER'
};
exports.AbandonedCartStatus = exports.$Enums.AbandonedCartStatus = {
    ABANDONED: 'ABANDONED',
    RECOVERED: 'RECOVERED',
    EXPIRED: 'EXPIRED'
};
exports.OrderStatus = exports.$Enums.OrderStatus = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED'
};
exports.PaymentStatus = exports.$Enums.PaymentStatus = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED'
};
exports.PosOrderType = exports.$Enums.PosOrderType = {
    DINE_IN: 'DINE_IN',
    TAKE_AWAY: 'TAKE_AWAY',
    DELIVERY: 'DELIVERY'
};
exports.PosPaymentMethod = exports.$Enums.PosPaymentMethod = {
    CASH: 'CASH',
    CARD: 'CARD',
    DIGITAL_WALLET: 'DIGITAL_WALLET',
    SPLIT: 'SPLIT'
};
exports.PosOrderStatus = exports.$Enums.PosOrderStatus = {
    ACTIVE: 'ACTIVE',
    HELD: 'HELD',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};
exports.PosSessionStatus = exports.$Enums.PosSessionStatus = {
    OPEN: 'OPEN',
    CLOSED: 'CLOSED'
};
exports.StockChangeType = exports.$Enums.StockChangeType = {
    SALE: 'SALE',
    REFUND: 'REFUND',
    RESTOCK: 'RESTOCK',
    ADJUSTMENT: 'ADJUSTMENT',
    DAMAGE: 'DAMAGE',
    RETURN: 'RETURN',
    TRANSFER: 'TRANSFER'
};
exports.PurchaseOrderStatus = exports.$Enums.PurchaseOrderStatus = {
    DRAFT: 'DRAFT',
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    SHIPPED: 'SHIPPED',
    RECEIVED: 'RECEIVED',
    CANCELLED: 'CANCELLED'
};
exports.DiscountType = exports.$Enums.DiscountType = {
    PERCENTAGE: 'PERCENTAGE',
    FIXED_AMOUNT: 'FIXED_AMOUNT'
};
exports.FeatureTier = exports.$Enums.FeatureTier = {
    FREE: 'FREE',
    PRO: 'PRO',
    ENTERPRISE: 'ENTERPRISE'
};
exports.RefundStatus = exports.$Enums.RefundStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};
exports.RefundReason = exports.$Enums.RefundReason = {
    DEFECTIVE: 'DEFECTIVE',
    WRONG_ITEM: 'WRONG_ITEM',
    NOT_AS_DESCRIBED: 'NOT_AS_DESCRIBED',
    CHANGED_MIND: 'CHANGED_MIND',
    ARRIVED_LATE: 'ARRIVED_LATE',
    OTHER: 'OTHER'
};
exports.PermissionResource = exports.$Enums.PermissionResource = {
    PRODUCT: 'PRODUCT',
    ORDER: 'ORDER',
    CUSTOMER: 'CUSTOMER',
    CATEGORY: 'CATEGORY',
    REVIEW: 'REVIEW',
    DISCOUNT: 'DISCOUNT',
    SETTINGS: 'SETTINGS',
    ANALYTICS: 'ANALYTICS',
    FEATURES: 'FEATURES',
    ADMIN_USER: 'ADMIN_USER',
    STOCK_ALERT: 'STOCK_ALERT',
    NEWSLETTER: 'NEWSLETTER',
    REFUND: 'REFUND'
};
exports.PermissionAction = exports.$Enums.PermissionAction = {
    VIEW: 'VIEW',
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    MANAGE: 'MANAGE'
};
exports.TemplateType = exports.$Enums.TemplateType = {
    INVOICE: 'INVOICE',
    PACKING_SLIP: 'PACKING_SLIP',
    EMAIL_TRANSACTIONAL: 'EMAIL_TRANSACTIONAL',
    EMAIL_MARKETING: 'EMAIL_MARKETING'
};
exports.PostStatus = exports.$Enums.PostStatus = {
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED',
    ARCHIVED: 'ARCHIVED'
};
exports.MediaType = exports.$Enums.MediaType = {
    IMAGE: 'IMAGE',
    VIDEO: 'VIDEO',
    AUDIO: 'AUDIO',
    DOCUMENT: 'DOCUMENT',
    OTHER: 'OTHER'
};
exports.MediaUsageType = exports.$Enums.MediaUsageType = {
    PRODUCT_IMAGE: 'PRODUCT_IMAGE',
    PRODUCT_VARIANT: 'PRODUCT_VARIANT',
    CATEGORY_IMAGE: 'CATEGORY_IMAGE',
    BLOG_FEATURED_IMAGE: 'BLOG_FEATURED_IMAGE',
    BLOG_CONTENT: 'BLOG_CONTENT',
    PAGE_CONTENT: 'PAGE_CONTENT',
    USER_AVATAR: 'USER_AVATAR',
    STORE_SETTING: 'STORE_SETTING',
    OTHER: 'OTHER'
};
exports.PopupType = exports.$Enums.PopupType = {
    EXIT_INTENT: 'EXIT_INTENT',
    TIMED: 'TIMED',
    SCROLL_BASED: 'SCROLL_BASED',
    PAGE_LOAD: 'PAGE_LOAD',
    CLICK_TRIGGER: 'CLICK_TRIGGER'
};
exports.PopupTarget = exports.$Enums.PopupTarget = {
    ALL_PAGES: 'ALL_PAGES',
    HOMEPAGE: 'HOMEPAGE',
    PRODUCT_PAGES: 'PRODUCT_PAGES',
    CART_PAGE: 'CART_PAGE',
    CHECKOUT: 'CHECKOUT',
    BLOG: 'BLOG',
    CUSTOM_URL: 'CUSTOM_URL'
};
exports.PopupPosition = exports.$Enums.PopupPosition = {
    CENTER: 'CENTER',
    TOP: 'TOP',
    BOTTOM: 'BOTTOM',
    TOP_LEFT: 'TOP_LEFT',
    TOP_RIGHT: 'TOP_RIGHT',
    BOTTOM_LEFT: 'BOTTOM_LEFT',
    BOTTOM_RIGHT: 'BOTTOM_RIGHT'
};
exports.CustomizationFieldType = exports.$Enums.CustomizationFieldType = {
    TEXT: 'TEXT',
    TEXTAREA: 'TEXTAREA',
    NUMBER: 'NUMBER',
    DROPDOWN: 'DROPDOWN',
    RADIO: 'RADIO',
    CHECKBOX: 'CHECKBOX',
    COLOR: 'COLOR',
    FILE: 'FILE',
    DATE: 'DATE'
};
exports.BackupType = exports.$Enums.BackupType = {
    MANUAL: 'MANUAL',
    SCHEDULED: 'SCHEDULED',
    AUTO: 'AUTO'
};
exports.BackupStatus = exports.$Enums.BackupStatus = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED'
};
exports.ExportType = exports.$Enums.ExportType = {
    PRODUCTS: 'PRODUCTS',
    ORDERS: 'ORDERS',
    CUSTOMERS: 'CUSTOMERS',
    CATEGORIES: 'CATEGORIES',
    INVENTORY: 'INVENTORY',
    CUSTOM: 'CUSTOM'
};
exports.ExportFormat = exports.$Enums.ExportFormat = {
    CSV: 'CSV',
    JSON: 'JSON',
    XLSX: 'XLSX'
};
exports.ExportStatus = exports.$Enums.ExportStatus = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED'
};
exports.ImportMode = exports.$Enums.ImportMode = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    UPSERT: 'UPSERT'
};
exports.ImportStatus = exports.$Enums.ImportStatus = {
    PENDING: 'PENDING',
    VALIDATING: 'VALIDATING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    PARTIAL: 'PARTIAL'
};
exports.RedirectType = exports.$Enums.RedirectType = {
    PERMANENT_301: 'PERMANENT_301',
    TEMPORARY_302: 'TEMPORARY_302'
};
exports.SchemaType = exports.$Enums.SchemaType = {
    ORGANIZATION: 'ORGANIZATION',
    PRODUCT: 'PRODUCT',
    BREADCRUMB: 'BREADCRUMB',
    FAQ: 'FAQ',
    ARTICLE: 'ARTICLE',
    REVIEW: 'REVIEW',
    LOCAL_BUSINESS: 'LOCAL_BUSINESS',
    EVENT: 'EVENT',
    RECIPE: 'RECIPE',
    VIDEO: 'VIDEO'
};
exports.CampaignType = exports.$Enums.CampaignType = {
    NEWSLETTER: 'NEWSLETTER',
    PROMOTIONAL: 'PROMOTIONAL',
    TRANSACTIONAL: 'TRANSACTIONAL',
    ANNOUNCEMENT: 'ANNOUNCEMENT',
    CUSTOM: 'CUSTOM'
};
exports.CampaignStatus = exports.$Enums.CampaignStatus = {
    DRAFT: 'DRAFT',
    SCHEDULED: 'SCHEDULED',
    SENDING: 'SENDING',
    SENT: 'SENT',
    PAUSED: 'PAUSED',
    CANCELLED: 'CANCELLED'
};
exports.BlockCategory = exports.$Enums.BlockCategory = {
    HERO: 'HERO',
    CONTENT: 'CONTENT',
    FEATURES: 'FEATURES',
    CTA: 'CTA',
    TESTIMONIALS: 'TESTIMONIALS',
    PRICING: 'PRICING',
    TEAM: 'TEAM',
    STATS: 'STATS',
    LOGO_GRID: 'LOGO_GRID',
    FORM: 'FORM',
    FAQ: 'FAQ',
    GALLERY: 'GALLERY',
    VIDEO: 'VIDEO',
    NAVIGATION: 'NAVIGATION',
    HEADER: 'HEADER',
    FOOTER: 'FOOTER',
    SOCIAL: 'SOCIAL',
    BREADCRUMBS: 'BREADCRUMBS',
    DIVIDER: 'DIVIDER',
    SPACER: 'SPACER',
    CUSTOM: 'CUSTOM'
};
exports.PageStatus = exports.$Enums.PageStatus = {
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED',
    SCHEDULED: 'SCHEDULED',
    ARCHIVED: 'ARCHIVED'
};
exports.FlashSaleStatus = exports.$Enums.FlashSaleStatus = {
    DRAFT: 'DRAFT',
    SCHEDULED: 'SCHEDULED',
    ACTIVE: 'ACTIVE',
    ENDED: 'ENDED',
    CANCELLED: 'CANCELLED'
};
exports.Prisma.ModelName = {
    User: 'User',
    Account: 'Account',
    Category: 'Category',
    Product: 'Product',
    ProductImage: 'ProductImage',
    VariantOption: 'VariantOption',
    VariantOptionValue: 'VariantOptionValue',
    ProductVariant: 'ProductVariant',
    Cart: 'Cart',
    CartItem: 'CartItem',
    AbandonedCart: 'AbandonedCart',
    AbandonedCartEmail: 'AbandonedCartEmail',
    Order: 'Order',
    OrderItem: 'OrderItem',
    Location: 'Location',
    Cashier: 'Cashier',
    PosOrder: 'PosOrder',
    PosSession: 'PosSession',
    Address: 'Address',
    Review: 'Review',
    OrderNote: 'OrderNote',
    StockAlert: 'StockAlert',
    StockHistory: 'StockHistory',
    Supplier: 'Supplier',
    PurchaseOrder: 'PurchaseOrder',
    PurchaseOrderItem: 'PurchaseOrderItem',
    PasswordReset: 'PasswordReset',
    DiscountCode: 'DiscountCode',
    NewsletterSubscriber: 'NewsletterSubscriber',
    WishlistItem: 'WishlistItem',
    StoreSetting: 'StoreSetting',
    FeatureFlag: 'FeatureFlag',
    Region: 'Region',
    City: 'City',
    CheckoutSettings: 'CheckoutSettings',
    Refund: 'Refund',
    RefundItem: 'RefundItem',
    Permission: 'Permission',
    AdminInvitation: 'AdminInvitation',
    AdminActivityLog: 'AdminActivityLog',
    ProductTranslation: 'ProductTranslation',
    CategoryTranslation: 'CategoryTranslation',
    Template: 'Template',
    BlogPost: 'BlogPost',
    BlogCategory: 'BlogCategory',
    BlogTag: 'BlogTag',
    Page: 'Page',
    MediaLibrary: 'MediaLibrary',
    MediaFolder: 'MediaFolder',
    MediaTag: 'MediaTag',
    MediaUsage: 'MediaUsage',
    MediaVariant: 'MediaVariant',
    Popup: 'Popup',
    PopupAnalytics: 'PopupAnalytics',
    PaymentMethod: 'PaymentMethod',
    AccountDeletionRequest: 'AccountDeletionRequest',
    ProductCustomizationField: 'ProductCustomizationField',
    ProductCustomizationOption: 'ProductCustomizationOption',
    CartItemCustomization: 'CartItemCustomization',
    OrderItemCustomization: 'OrderItemCustomization',
    Backup: 'Backup',
    DataExport: 'DataExport',
    DataImport: 'DataImport',
    UrlRedirect: 'UrlRedirect',
    SchemaMarkup: 'SchemaMarkup',
    EmailCampaign: 'EmailCampaign',
    CampaignRecipient: 'CampaignRecipient',
    CampaignAnalytics: 'CampaignAnalytics',
    EmailTemplate: 'EmailTemplate',
    BlockTemplate: 'BlockTemplate',
    ContentBlock: 'ContentBlock',
    LandingPage: 'LandingPage',
    LandingPageTemplate: 'LandingPageTemplate',
    LandingPageRevision: 'LandingPageRevision',
    FlashSale: 'FlashSale',
    FlashSaleProduct: 'FlashSaleProduct',
    FlashSaleCategory: 'FlashSaleCategory'
};
/**
 * This is a stub Prisma Client that will error at runtime if called.
 */ class PrismaClient {
    constructor(){
        return new Proxy(this, {
            get (target, prop) {
                let message;
                const runtime = getRuntime();
                if (runtime.isEdge) {
                    message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
                } else {
                    message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).';
                }
                message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`;
                throw new Error(message);
            }
        });
    }
}
exports.PrismaClient = PrismaClient;
Object.assign(exports, Prisma);
}),
"[project]/node_modules/@prisma/client/index-browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const prisma = __turbopack_context__.r("[project]/node_modules/.prisma/client/index-browser.js [app-client] (ecmascript)");
module.exports = prisma;
}),
]);

//# sourceMappingURL=_264a0a5b._.js.map
//# debugId=d25a3554-113b-5cc9-9375-75525cbaaf6e
