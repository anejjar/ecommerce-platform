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
"[project]/src/lib/themes/theme-validator.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Theme Validator
 * Validates theme JSON against the schema
 */ __turbopack_context__.s([
    "validateThemeConfig",
    ()=>validateThemeConfig,
    "validateThemeJSON",
    ()=>validateThemeJSON
]);
function validateThemeConfig(config) {
    const errors = [];
    // Validate metadata
    if (!config.metadata) {
        errors.push({
            path: 'metadata',
            message: 'Metadata is required'
        });
    } else {
        if (!config.metadata.name || typeof config.metadata.name !== 'string') {
            errors.push({
                path: 'metadata.name',
                message: 'Metadata name is required and must be a string'
            });
        }
        if (!config.metadata.version || typeof config.metadata.version !== 'string') {
            errors.push({
                path: 'metadata.version',
                message: 'Metadata version is required and must be a string'
            });
        }
    }
    // Validate colors
    if (!config.colors) {
        errors.push({
            path: 'colors',
            message: 'Colors configuration is required'
        });
    } else {
        const requiredColors = [
            'primary',
            'secondary',
            'accent',
            'background',
            'surface',
            'border'
        ];
        requiredColors.forEach((color)=>{
            if (!config.colors[color] || typeof config.colors[color] !== 'string') {
                errors.push({
                    path: `colors.${color}`,
                    message: `Color ${color} is required and must be a string`
                });
            }
        });
        if (!config.colors.text) {
            errors.push({
                path: 'colors.text',
                message: 'Colors.text configuration is required'
            });
        } else {
            const requiredTextColors = [
                'primary',
                'secondary',
                'muted'
            ];
            requiredTextColors.forEach((color)=>{
                if (!config.colors.text[color] || typeof config.colors.text[color] !== 'string') {
                    errors.push({
                        path: `colors.text.${color}`,
                        message: `Text color ${color} is required and must be a string`
                    });
                }
            });
        }
    }
    // Validate typography
    if (!config.typography) {
        errors.push({
            path: 'typography',
            message: 'Typography configuration is required'
        });
    } else {
        if (!config.typography.fontFamily) {
            errors.push({
                path: 'typography.fontFamily',
                message: 'Font family configuration is required'
            });
        } else {
            const requiredFonts = [
                'heading',
                'body'
            ];
            requiredFonts.forEach((font)=>{
                if (!config.typography.fontFamily[font] || typeof config.typography.fontFamily[font] !== 'string') {
                    errors.push({
                        path: `typography.fontFamily.${font}`,
                        message: `Font family ${font} is required`
                    });
                }
            });
        }
    }
    // Validate spacing
    if (!config.spacing) {
        errors.push({
            path: 'spacing',
            message: 'Spacing configuration is required'
        });
    } else {
        const requiredSpacing = [
            'xs',
            'sm',
            'md',
            'lg',
            'xl'
        ];
        requiredSpacing.forEach((size)=>{
            if (!config.spacing[size] || typeof config.spacing[size] !== 'string') {
                errors.push({
                    path: `spacing.${size}`,
                    message: `Spacing ${size} is required and must be a string`
                });
            }
        });
    }
    // Validate borderRadius
    if (!config.borderRadius) {
        errors.push({
            path: 'borderRadius',
            message: 'Border radius configuration is required'
        });
    }
    // Validate components
    if (!config.components) {
        errors.push({
            path: 'components',
            message: 'Components configuration is required'
        });
    } else {
        if (!config.components.header) {
            errors.push({
                path: 'components.header',
                message: 'Header configuration is required'
            });
        }
        if (!config.components.footer) {
            errors.push({
                path: 'components.footer',
                message: 'Footer configuration is required'
            });
        }
        if (!config.components.productCard) {
            errors.push({
                path: 'components.productCard',
                message: 'Product card configuration is required'
            });
        }
        if (!config.components.buttons) {
            errors.push({
                path: 'components.buttons',
                message: 'Buttons configuration is required'
            });
        }
    }
    // Validate layout
    if (!config.layout) {
        errors.push({
            path: 'layout',
            message: 'Layout configuration is required'
        });
    } else {
        const requiredLayout = [
            'containerMaxWidth',
            'pagePadding',
            'sectionSpacing'
        ];
        requiredLayout.forEach((prop)=>{
            if (!config.layout[prop] || typeof config.layout[prop] !== 'string') {
                errors.push({
                    path: `layout.${prop}`,
                    message: `Layout ${prop} is required and must be a string`
                });
            }
        });
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
function validateThemeJSON(jsonString) {
    try {
        const config = JSON.parse(jsonString);
        return validateThemeConfig(config);
    } catch (error) {
        return {
            valid: false,
            errors: [
                {
                    path: 'root',
                    message: `Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
                }
            ]
        };
    }
}
}),
"[project]/src/lib/features.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getEnabledFeatures",
    ()=>getEnabledFeatures,
    "isFeatureEnabled",
    ()=>isFeatureEnabled
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
async function isFeatureEnabled(featureName) {
    try {
        const feature = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].featureFlag.findUnique({
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
        const features = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].featureFlag.findMany({
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
}),
"[project]/src/app/api/admin/themes/[id]/duplicate/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$theme$2d$validator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/themes/theme-validator.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/features.ts [app-route] (ecmascript)");
;
;
;
;
;
;
async function POST(request, { params }) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session || ![
            'ADMIN',
            'SUPERADMIN',
            'MANAGER'
        ].includes(session.user.role)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        // Check feature flag
        const featureEnabled = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isFeatureEnabled"])('storefront_themes');
        if (!featureEnabled) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Themes feature is not enabled'
            }, {
                status: 403
            });
        }
        const { id } = await params;
        const body = await request.json().catch(()=>({}));
        const { displayName, activate = true } = body;
        // Get the original theme
        const original = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].theme.findUnique({
            where: {
                id
            }
        });
        if (!original) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Theme not found'
            }, {
                status: 404
            });
        }
        // Generate a unique name for the duplicate
        const baseName = original.name.replace(/-\d+$/, ''); // Remove any existing suffix
        let newName = `${baseName}-custom`;
        let counter = 1;
        // Ensure unique name
        while(await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].theme.findUnique({
            where: {
                name: newName
            }
        })){
            newName = `${baseName}-custom-${counter}`;
            counter++;
        }
        // Create the duplicate theme config
        const themeConfig = original.themeConfig;
        // Update metadata in the config
        const updatedConfig = {
            ...themeConfig,
            metadata: {
                ...themeConfig.metadata,
                name: newName,
                displayName: displayName || `${original.displayName} (Custom)`,
                version: '1.0.0'
            }
        };
        // Validate the config
        const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$theme$2d$validator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateThemeConfig"])(updatedConfig);
        if (!validation.valid) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid theme configuration',
                details: validation.errors
            }, {
                status: 400
            });
        }
        // Deactivate all themes if we're activating the new one
        if (activate) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].theme.updateMany({
                where: {
                    isActive: true
                },
                data: {
                    isActive: false
                }
            });
        }
        // Create the duplicate theme
        const duplicate = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].theme.create({
            data: {
                name: newName,
                displayName: displayName || `${original.displayName} (Custom)`,
                description: original.description ? `${original.description} (Custom copy)` : null,
                version: '1.0.0',
                author: session.user.name || session.user.email || null,
                previewImage: original.previewImage,
                isBuiltIn: false,
                isActive: activate,
                themeConfig: updatedConfig
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            theme: duplicate
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Error duplicating theme:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to duplicate theme'
        }, {
            status: 500
        });
    }
}
}),
];

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="5f3870f4-2b17-51b2-89d2-c1d22b6ad29d")}catch(e){}}();
//# sourceMappingURL=%5Broot-of-the-server%5D__73716403._.js.map
//# debugId=5f3870f4-2b17-51b2-89d2-c1d22b6ad29d
