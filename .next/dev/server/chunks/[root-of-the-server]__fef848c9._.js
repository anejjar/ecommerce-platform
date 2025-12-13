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
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/dns [external] (dns, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("dns", () => require("dns"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[project]/src/lib/email.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "emailTemplate",
    ()=>emailTemplate,
    "sendEmail",
    ()=>sendEmail,
    "transporter",
    ()=>transporter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/nodemailer/lib/nodemailer.js [app-route] (ecmascript)");
;
const transporter = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
const emailTemplate = (content)=>`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #3b82f6;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #3b82f6;
      margin: 0;
      font-size: 28px;
    }
    .content {
      margin-bottom: 30px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #3b82f6;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
    .order-details {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 20px;
      margin: 20px 0;
    }
    .order-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .order-item:last-child {
      border-bottom: none;
    }
    .total {
      font-size: 18px;
      font-weight: bold;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 2px solid #3b82f6;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Store Name</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>Thank you for shopping with us!</p>
      <p>If you have any questions, please contact us at support@yourstore.com</p>
      <p>&copy; ${new Date().getFullYear()} Your Store Name. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
async function sendEmail({ to, subject, html }) {
    try {
        const info = await transporter.sendMail({
            from: `"Your Store Name" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to,
            subject,
            html: emailTemplate(html)
        });
        console.log('Email sent: %s', info.messageId);
        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            success: false,
            error
        };
    }
}
}),
"[project]/src/lib/email-templates.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adminNewOrderEmail",
    ()=>adminNewOrderEmail,
    "adminNewRefundRequestEmail",
    ()=>adminNewRefundRequestEmail,
    "adminNewReviewEmail",
    ()=>adminNewReviewEmail,
    "customerOrderNoteEmail",
    ()=>customerOrderNoteEmail,
    "lowStockAlertEmail",
    ()=>lowStockAlertEmail,
    "newsletterCampaignEmail",
    ()=>newsletterCampaignEmail,
    "newsletterWelcomeEmail",
    ()=>newsletterWelcomeEmail,
    "orderConfirmationEmail",
    ()=>orderConfirmationEmail,
    "orderDeliveredEmail",
    ()=>orderDeliveredEmail,
    "orderShippedEmail",
    ()=>orderShippedEmail,
    "refundApprovedEmailCustomer",
    ()=>refundApprovedEmailCustomer,
    "refundCompletedEmailCustomer",
    ()=>refundCompletedEmailCustomer,
    "refundRejectedEmailCustomer",
    ()=>refundRejectedEmailCustomer,
    "refundRequestedEmailCustomer",
    ()=>refundRequestedEmailCustomer,
    "welcomeEmail",
    ()=>welcomeEmail
]);
function orderConfirmationEmail(order, customerName) {
    return `
    <h2>Order Confirmation</h2>
    <p>Hi ${customerName},</p>
    <p>Thank you for your order! We've received your order and will process it shortly.</p>

    <div class="order-details">
      <h3>Order #${order.orderNumber}</h3>

      ${order.items.map((item)=>`
        <div class="order-item">
          <div>
            <strong>${item.product.name}</strong><br>
            <span style="color: #6b7280;">Quantity: ${item.quantity}</span>
          </div>
          <div style="text-align: right;">
            <strong>$${item.total}</strong><br>
            <span style="color: #6b7280; font-size: 14px;">$${item.price} each</span>
          </div>
        </div>
      `).join('')}

      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Subtotal:</span>
          <span>$${order.subtotal}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Tax:</span>
          <span>$${order.tax}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Shipping:</span>
          <span>$${order.shipping}</span>
        </div>
        <div class="total" style="display: flex; justify-content: space-between;">
          <span>Total:</span>
          <span>$${order.total}</span>
        </div>
      </div>
    </div>

    ${order.shippingAddress ? `
      <div style="margin-top: 20px;">
        <h3>Shipping Address</h3>
        <p style="margin: 5px 0;">
          ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
          ${order.shippingAddress.address1}${order.shippingAddress.address2 ? '<br>' + order.shippingAddress.address2 : ''}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
          ${order.shippingAddress.country}
        </p>
      </div>
    ` : ''}

    <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account/orders/${order.orderNumber}" class="button">
      View Order Details
    </a>

    <p>We'll send you another email when your order ships.</p>
  `;
}
function orderShippedEmail(order, customerName, trackingNumber) {
    return `
    <h2>Your Order Has Shipped! 📦</h2>
    <p>Hi ${customerName},</p>
    <p>Great news! Your order #${order.orderNumber} has been shipped and is on its way to you.</p>

    ${trackingNumber ? `
      <div style="background-color: #dbeafe; border: 1px solid #3b82f6; border-radius: 6px; padding: 15px; margin: 20px 0;">
        <strong>Tracking Number:</strong><br>
        <span style="font-family: monospace; font-size: 16px;">${trackingNumber}</span>
      </div>
    ` : ''}

    <div class="order-details">
      <h3>Order Summary</h3>
      ${order.items.map((item)=>`
        <div class="order-item">
          <div>
            <strong>${item.product.name}</strong><br>
            <span style="color: #6b7280;">Quantity: ${item.quantity}</span>
          </div>
          <div style="text-align: right;">
            <strong>$${item.total}</strong>
          </div>
        </div>
      `).join('')}

      <div class="total" style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 2px solid #3b82f6;">
        <span>Total:</span>
        <span>$${order.total}</span>
      </div>
    </div>

    ${order.shippingAddress ? `
      <div style="margin-top: 20px;">
        <h3>Shipping To:</h3>
        <p style="margin: 5px 0;">
          ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
          ${order.shippingAddress.address1}${order.shippingAddress.address2 ? '<br>' + order.shippingAddress.address2 : ''}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
          ${order.shippingAddress.country}
        </p>
      </div>
    ` : ''}

    <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account/orders/${order.orderNumber}" class="button">
      Track Your Order
    </a>
  `;
}
function orderDeliveredEmail(order, customerName) {
    return `
    <h2>Your Order Has Been Delivered! 🎉</h2>
    <p>Hi ${customerName},</p>
    <p>Your order #${order.orderNumber} has been delivered. We hope you love your purchase!</p>

    <div class="order-details">
      <h3>Order Summary</h3>
      ${order.items.map((item)=>`
        <div class="order-item">
          <div>
            <strong>${item.product.name}</strong><br>
            <span style="color: #6b7280;">Quantity: ${item.quantity}</span>
          </div>
          <div style="text-align: right;">
            <strong>$${item.total}</strong>
          </div>
        </div>
      `).join('')}
    </div>

    <p style="margin-top: 20px;">How was your experience? We'd love to hear your feedback!</p>

    <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account/orders/${order.orderNumber}" class="button">
      Leave a Review
    </a>
  `;
}
function lowStockAlertEmail(products) {
    return `
    <h2>Low Stock Alert! ⚠️</h2>
    <p>The following products are running low on stock:</p>

    <div class="order-details">
      ${products.map((product)=>`
        <div class="order-item">
          <div>
            <strong>${product.name}</strong><br>
            ${product.sku ? `<span style="color: #6b7280;">SKU: ${product.sku}</span>` : ''}
          </div>
          <div style="text-align: right;">
            <span style="color: ${product.stock === 0 ? '#dc2626' : '#f59e0b'}; font-weight: bold;">
              ${product.stock} units
            </span><br>
            <span style="color: #6b7280; font-size: 14px;">Threshold: ${product.threshold}</span>
          </div>
        </div>
      `).join('')}
    </div>

    <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/admin/settings/stock-alerts" class="button">
      View Stock Alerts
    </a>

    <p>Please restock these items to avoid running out of inventory.</p>
  `;
}
function welcomeEmail(customerName) {
    return `
    <h2>Welcome to Our Store! 🎊</h2>
    <p>Hi ${customerName},</p>
    <p>Thank you for creating an account with us! We're excited to have you as part of our community.</p>

    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Here's what you can do with your account:</h3>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Track your orders in real-time</li>
        <li>Save your shipping addresses</li>
        <li>View your order history</li>
        <li>Write product reviews</li>
        <li>Get exclusive member deals</li>
      </ul>
    </div>

    <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/shop" class="button">
      Start Shopping
    </a>

    <p>If you have any questions, our support team is always here to help!</p>
  `;
}
function newsletterWelcomeEmail(name) {
    return `
    <h2>Welcome to Our Newsletter! 📧</h2>
    <p>Hi ${name || 'there'},</p>
    <p>Thank you for subscribing to our newsletter! You'll now receive:</p>

    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Exclusive deals and discount codes</li>
        <li>New product announcements</li>
        <li>Tips and recommendations</li>
        <li>Special subscriber-only offers</li>
        <li>Early access to sales</li>
      </ul>
    </div>

    <p>You can unsubscribe at any time by clicking the link at the bottom of our emails.</p>

    <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/shop" class="button">
      Browse Our Products
    </a>
  `;
}
function newsletterCampaignEmail(content, subscriberEmail) {
    return `
    ${content}

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

    <p style="font-size: 12px; color: #6b7280; text-align: center;">
      You're receiving this email because you subscribed to our newsletter.<br>
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/newsletter/unsubscribe?email=${encodeURIComponent(subscriberEmail)}" style="color: #6b7280;">
        Unsubscribe
      </a>
    </p>
  `;
}
function adminNewOrderEmail(order, customerEmail) {
    return `
    <h2>New Order Received! 🛍️</h2>
    <p>A new order has been placed on your store.</p>

    <div class="order-details">
      <h3>Order #${order.orderNumber}</h3>
      <div style="margin-bottom: 15px; padding: 10px; background-color: #f9fafb; border-radius: 6px;">
        <strong>Customer Email:</strong> ${customerEmail}<br>
        <strong>Order Status:</strong> <span style="color: #f59e0b; font-weight: bold;">${order.status}</span>
      </div>

      ${order.items.map((item)=>`
        <div class="order-item">
          <div>
            <strong>${item.product.name}</strong><br>
            <span style="color: #6b7280;">Quantity: ${item.quantity}</span>
          </div>
          <div style="text-align: right;">
            <strong>$${item.total}</strong><br>
            <span style="color: #6b7280; font-size: 14px;">$${item.price} each</span>
          </div>
        </div>
      `).join('')}

      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Subtotal:</span>
          <span>$${order.subtotal}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Tax:</span>
          <span>$${order.tax}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Shipping:</span>
          <span>$${order.shipping}</span>
        </div>
        ${order.discountAmount && parseFloat(order.discountAmount) > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #059669;">
          <span>Discount:</span>
          <span>-$${order.discountAmount}</span>
        </div>
        ` : ''}
        <div class="total" style="display: flex; justify-content: space-between;">
          <span>Total:</span>
          <span>$${order.total}</span>
        </div>
      </div>
    </div>

    ${order.shippingAddress ? `
      <div style="margin-top: 20px;">
        <h3>Shipping Address</h3>
        <p style="margin: 5px 0;">
          ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
          ${order.shippingAddress.address1}${order.shippingAddress.address2 ? '<br>' + order.shippingAddress.address2 : ''}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
          ${order.shippingAddress.country}
        </p>
      </div>
    ` : ''}

    <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/admin/orders/${order.orderNumber}" class="button">
      View Order in Admin
    </a>

    <p>Please process this order as soon as possible.</p>
  `;
}
function adminNewReviewEmail(review, productName, customerName, reviewId) {
    return `
    <h2>New Product Review Submitted! ⭐</h2>
    <p>A customer has submitted a new review on your store.</p>

    <div class="order-details">
      <h3>${productName}</h3>

      <div style="margin: 15px 0;">
        <div style="color: #f59e0b; font-size: 24px; margin-bottom: 5px;">
          ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
        </div>
        <span style="color: #6b7280; font-size: 14px;">
          ${review.rating} out of 5 stars
          ${review.verified ? '<span style="color: #059669; margin-left: 10px;">✓ Verified Purchase</span>' : ''}
        </span>
      </div>

      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 15px 0;">
        <div style="margin-bottom: 10px;">
          <strong>Reviewer:</strong> ${customerName}<br>
          <strong>Submitted:</strong> ${new Date(review.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}
        </div>

        ${review.title ? `
          <div style="margin-bottom: 10px;">
            <strong style="font-size: 16px;">${review.title}</strong>
          </div>
        ` : ''}

        ${review.comment ? `
          <div style="color: #374151; line-height: 1.6;">
            ${review.comment}
          </div>
        ` : ''}
      </div>
    </div>

    <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/admin/reviews" class="button">
      Moderate Review
    </a>

    <p>Please review and approve or reject this review in the admin panel.</p>
  `;
}
function customerOrderNoteEmail(orderNumber, note, addedBy, addedAt) {
    return `
    <h2>New Note on Your Order 📝</h2>
    <p>A note has been added to your order #${orderNumber}.</p>

    <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <div style="margin-bottom: 10px; font-size: 12px; color: #1e40af;">
        <strong>${addedBy}</strong> • ${new Date(addedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}
      </div>
      <div style="color: #1e3a8a; line-height: 1.6;">
        ${note}
      </div>
    </div>

    <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account/orders/${orderNumber}" class="button">
      View Order Details
    </a>

    <p>If you have any questions about this note, please contact our support team.</p>
  `;
}
function refundRequestedEmailCustomer(orderNumber, rmaNumber, refundAmount, reason) {
    return `
    <h2>Refund Request Received 🔄</h2>
    <p>We've received your refund request for order #${orderNumber}.</p>

    <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <strong>RMA Number:</strong> ${rmaNumber}<br>
      <strong>Refund Amount:</strong> $${refundAmount}<br>
      <strong>Reason:</strong> ${reason}
    </div>

    <p>Our team will review your request and get back to you within 1-2 business days.</p>

    <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account/orders/${orderNumber}" class="button">
      View Order
    </a>

    <p>You can track the status of your refund request in your account.</p>
  `;
}
function refundApprovedEmailCustomer(orderNumber, rmaNumber, refundAmount) {
    return `
    <h2>Refund Approved! ✅</h2>
    <p>Great news! Your refund request has been approved.</p>

    <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <strong>Order Number:</strong> ${orderNumber}<br>
      <strong>RMA Number:</strong> ${rmaNumber}<br>
      <strong>Refund Amount:</strong> $${refundAmount}
    </div>

    <h3>Next Steps:</h3>
    <ul style="line-height: 1.8;">
      <li>Your refund will be processed within 5-7 business days</li>
      <li>The amount will be credited to your original payment method</li>
      <li>You may need to return the item(s) using the provided RMA number</li>
    </ul>

    <p>Thank you for your patience!</p>
  `;
}
function refundRejectedEmailCustomer(orderNumber, rmaNumber, adminNotes) {
    return `
    <h2>Refund Request Update ❌</h2>
    <p>We've reviewed your refund request for order #${orderNumber}.</p>

    <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <strong>RMA Number:</strong> ${rmaNumber}<br>
      <strong>Status:</strong> Not Approved
    </div>

    ${adminNotes ? `
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 15px 0;">
        <strong>Reason:</strong><br>
        <p style="margin-top: 10px;">${adminNotes}</p>
      </div>
    ` : ''}

    <p>If you have questions about this decision, please contact our support team.</p>

    <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/contact" class="button">
      Contact Support
    </a>
  `;
}
function refundCompletedEmailCustomer(orderNumber, rmaNumber, refundAmount) {
    return `
    <h2>Refund Completed! 💰</h2>
    <p>Your refund has been successfully processed.</p>

    <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <strong>Order Number:</strong> ${orderNumber}<br>
      <strong>RMA Number:</strong> ${rmaNumber}<br>
      <strong>Refunded Amount:</strong> $${refundAmount}
    </div>

    <p>The refund has been credited to your original payment method. Depending on your bank, it may take 5-10 business days to appear in your account.</p>

    <p>Thank you for shopping with us!</p>
  `;
}
function adminNewRefundRequestEmail(orderNumber, rmaNumber, customerName, customerEmail, refundAmount, reason, reasonDetails) {
    return `
    <h2>New Refund Request 🔔</h2>
    <p>A customer has submitted a refund request.</p>

    <div class="order-details">
      <h3>Refund Details</h3>

      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 15px 0;">
        <strong>Order Number:</strong> ${orderNumber}<br>
        <strong>RMA Number:</strong> ${rmaNumber}<br>
        <strong>Refund Amount:</strong> $${refundAmount}<br>
        <strong>Reason:</strong> ${reason}
      </div>

      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 15px 0;">
        <strong>Customer:</strong> ${customerName}<br>
        <strong>Email:</strong> ${customerEmail}
      </div>

      ${reasonDetails ? `
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; border-radius: 4px;">
          <strong>Customer Notes:</strong><br>
          <p style="margin-top: 10px;">${reasonDetails}</p>
        </div>
      ` : ''}
    </div>

    <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/admin/refunds" class="button">
      Review Refund Request
    </a>

    <p>Please review and process this request as soon as possible.</p>
  `;
}
}),
"[project]/src/app/api/checkout/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/email.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2d$templates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/email-templates.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
async function generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    const todayOrders = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.count({
        where: {
            createdAt: {
                gte: startOfDay,
                lt: endOfDay
            }
        }
    });
    const sequence = String(todayOrders + 1).padStart(4, '0');
    return `ORD-${year}${month}${day}-${sequence}`;
}
async function POST(request) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        const body = await request.json();
        const { items, shippingAddress, customerInfo, isGuest, createAccount, password, orderNotes } = body;
        // Validation
        if (!items || items.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Cart is empty'
            }, {
                status: 400
            });
        }
        if (!shippingAddress || !shippingAddress.address1 || !shippingAddress.city) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Complete shipping address is required'
            }, {
                status: 400
            });
        }
        if (!customerInfo?.email) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Email is required'
            }, {
                status: 400
            });
        }
        // Find or create user
        let user;
        if (session && session.user) {
            // Logged in user
            user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                where: {
                    email: session.user.email
                }
            });
            if (!user) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'User not found. Please sign in again.'
                }, {
                    status: 401
                });
            }
        } else if (isGuest) {
            // Guest checkout
            if (createAccount) {
                // Guest wants to create account
                if (!password || password.length < 6) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'Password must be at least 6 characters'
                    }, {
                        status: 400
                    });
                }
                // Check if email already exists
                const existingUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                    where: {
                        email: customerInfo.email
                    }
                });
                if (existingUser) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'Email already exists. Please sign in.'
                    }, {
                        status: 400
                    });
                }
                // Create new user
                const hashedPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, 10);
                user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.create({
                    data: {
                        email: customerInfo.email,
                        password: hashedPassword,
                        name: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
                        role: 'CUSTOMER'
                    }
                });
                // Send welcome email
                try {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])({
                        to: user.email,
                        subject: 'Welcome to Our Store!',
                        html: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2d$templates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["welcomeEmail"])(user.name || user.email)
                    });
                } catch (emailError) {
                    console.error('Failed to send welcome email:', emailError);
                }
            } else {
                // Pure guest checkout - no user account
                user = null;
            }
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        // Calculate totals and validate stock
        let subtotal = 0;
        const orderItems = [];
        for (const item of items){
            let price;
            let stock;
            if (item.variantId) {
                // Get variant price and stock
                const variant = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].productVariant.findUnique({
                    where: {
                        id: item.variantId
                    },
                    include: {
                        product: true
                    }
                });
                if (!variant) {
                    console.error('Checkout Error: Variant not found', {
                        variantId: item.variantId,
                        productId: item.productId,
                        item: item,
                        timestamp: new Date().toISOString()
                    });
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: `Product variant not available: Variant ID ${item.variantId} not found`
                    }, {
                        status: 400
                    });
                }
                if (!variant.product.published) {
                    console.error('Checkout Error: Variant product not published', {
                        variantId: item.variantId,
                        productId: item.productId,
                        productName: variant.product.name,
                        published: variant.product.published,
                        item: item,
                        timestamp: new Date().toISOString()
                    });
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: `Product variant not available: ${variant.product.name} is no longer available`
                    }, {
                        status: 400
                    });
                }
                price = variant.price ? Number(variant.price) : Number(variant.product.price);
                stock = variant.stock;
                if (stock < item.quantity) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: `Insufficient stock for variant`
                    }, {
                        status: 400
                    });
                }
            } else {
                // Get base product price and stock
                const product = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findUnique({
                    where: {
                        id: item.productId
                    }
                });
                if (!product) {
                    console.error('Checkout Error: Product not found', {
                        productId: item.productId,
                        item: item,
                        timestamp: new Date().toISOString()
                    });
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: `Product not available: Product ID ${item.productId} not found`
                    }, {
                        status: 400
                    });
                }
                if (!product.published) {
                    console.error('Checkout Error: Product not published', {
                        productId: item.productId,
                        productName: product.name,
                        published: product.published,
                        item: item,
                        timestamp: new Date().toISOString()
                    });
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: `Product not available: ${product.name} is no longer available`
                    }, {
                        status: 400
                    });
                }
                price = Number(product.price);
                stock = product.stock;
                if (stock < item.quantity) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: `Insufficient stock for ${product.name}`
                    }, {
                        status: 400
                    });
                }
            }
            const itemTotal = price * item.quantity;
            subtotal += itemTotal;
            orderItems.push({
                productId: item.productId,
                variantId: item.variantId || null,
                price,
                quantity: item.quantity,
                total: itemTotal
            });
        }
        const tax = subtotal * 0.1; // 10% tax
        const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
        let total = subtotal + tax + shipping;
        // Handle Discount Code
        let discountAmount = 0;
        let discountCodeId = null;
        if (body.discountCodeId) {
            const discount = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].discountCode.findUnique({
                where: {
                    id: body.discountCodeId
                }
            });
            if (discount && discount.isActive) {
                const now = new Date();
                const isValidDate = discount.startDate <= now && (!discount.endDate || discount.endDate >= now);
                const isValidUsage = !discount.maxUses || discount.usedCount < discount.maxUses;
                const isValidMinOrder = !discount.minOrderAmount || subtotal >= Number(discount.minOrderAmount);
                if (isValidDate && isValidUsage && isValidMinOrder) {
                    if (discount.type === 'PERCENTAGE') {
                        discountAmount = subtotal * Number(discount.value) / 100;
                    } else {
                        discountAmount = Number(discount.value);
                    }
                    // Ensure discount doesn't exceed total
                    discountAmount = Math.min(discountAmount, total);
                    total -= discountAmount;
                    discountCodeId = discount.id;
                    // Increment usage count
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].discountCode.update({
                        where: {
                            id: discount.id
                        },
                        data: {
                            usedCount: {
                                increment: 1
                            }
                        }
                    });
                }
            }
        }
        // Create shipping address
        const address = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].address.create({
            data: {
                firstName: customerInfo.firstName || '',
                lastName: customerInfo.lastName || '',
                company: shippingAddress.company || null,
                address1: shippingAddress.address1,
                address2: shippingAddress.address2 || null,
                city: shippingAddress.city,
                state: shippingAddress.state || null,
                postalCode: shippingAddress.postalCode || '00000',
                country: shippingAddress.country || 'Morocco',
                phone: customerInfo.phone || null,
                userId: user?.id || null
            }
        });
        // Generate order number
        const orderNumber = await generateOrderNumber();
        // Create order
        const order = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.create({
            data: {
                orderNumber,
                status: 'PENDING',
                paymentStatus: 'PENDING',
                subtotal,
                tax,
                shipping,
                total,
                discountCodeId,
                discountAmount,
                notes: orderNotes || null,
                userId: user?.id || null,
                isGuest: !user || isGuest,
                guestEmail: !user ? customerInfo.email : null,
                shippingAddressId: address.id,
                items: {
                    create: orderItems
                }
            },
            include: {
                items: {
                    include: {
                        product: true,
                        variant: true
                    }
                },
                user: true,
                shippingAddress: true
            }
        });
        // Update stock (product AND variant if applicable)
        for (const item of items){
            if (item.variantId) {
                // Update variant stock AND product stock
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction([
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].productVariant.update({
                        where: {
                            id: item.variantId
                        },
                        data: {
                            stock: {
                                decrement: item.quantity
                            }
                        }
                    }),
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.update({
                        where: {
                            id: item.productId
                        },
                        data: {
                            stock: {
                                decrement: item.quantity
                            }
                        }
                    })
                ]);
            } else {
                // Update product stock only (no variants)
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.update({
                    where: {
                        id: item.productId
                    },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                });
            }
        }
        // Check for low stock alerts after stock updates
        try {
            const productIds = items.map((item)=>item.productId);
            const lowStockProducts = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
                where: {
                    id: {
                        in: productIds
                    },
                    stockAlert: {
                        isNot: null
                    }
                },
                include: {
                    stockAlert: true
                }
            });
            const productsToAlert = lowStockProducts.filter((product)=>{
                if (!product.stockAlert) return false;
                const threshold = product.stockAlert.threshold;
                return product.stock <= threshold && !product.stockAlert.notified;
            });
            if (productsToAlert.length > 0) {
                const adminEmail = process.env.ADMIN_EMAIL;
                if (adminEmail) {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])({
                        to: adminEmail,
                        subject: 'Low Stock Alert',
                        html: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2d$templates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["lowStockAlertEmail"])(productsToAlert.map((p)=>({
                                name: p.name,
                                sku: p.sku,
                                stock: p.stock,
                                threshold: p.stockAlert.threshold
                            })))
                    });
                    // Mark alerts as notified
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].stockAlert.updateMany({
                        where: {
                            productId: {
                                in: productsToAlert.map((p)=>p.id)
                            }
                        },
                        data: {
                            notified: true
                        }
                    });
                }
            }
        } catch (stockAlertError) {
            console.error('Failed to check/send stock alerts:', stockAlertError);
        // Don't fail the order if stock alert fails
        }
        // Send order confirmation email
        const emailTo = user?.email || customerInfo.email;
        const customerName = user?.name || `${customerInfo.firstName} ${customerInfo.lastName}`.trim();
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])({
                to: emailTo,
                subject: `Order Confirmation - ${orderNumber}`,
                html: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2d$templates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["orderConfirmationEmail"])({
                    orderNumber: order.orderNumber,
                    total: order.total.toString(),
                    subtotal: order.subtotal.toString(),
                    tax: order.tax.toString(),
                    shipping: order.shipping.toString(),
                    discountAmount: order.discountAmount.toString(),
                    status: order.status,
                    items: order.items.map((item)=>({
                            product: {
                                name: item.product.name
                            },
                            quantity: item.quantity,
                            price: item.price.toString(),
                            total: item.total.toString()
                        })),
                    shippingAddress: order.shippingAddress || undefined
                }, customerName || emailTo)
            });
        } catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError);
        // Don't fail the order if email fails
        }
        // Send admin notification email
        try {
            const adminEmail = process.env.ADMIN_EMAIL;
            if (adminEmail) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])({
                    to: adminEmail,
                    subject: `New Order Received - ${orderNumber}`,
                    html: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2d$templates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminNewOrderEmail"])({
                        orderNumber: order.orderNumber,
                        total: order.total.toString(),
                        subtotal: order.subtotal.toString(),
                        tax: order.tax.toString(),
                        shipping: order.shipping.toString(),
                        discountAmount: order.discountAmount.toString(),
                        status: order.status,
                        items: order.items.map((item)=>({
                                product: {
                                    name: item.product.name
                                },
                                quantity: item.quantity,
                                price: item.price.toString(),
                                total: item.total.toString()
                            })),
                        shippingAddress: order.shippingAddress || undefined
                    }, emailTo)
                });
            }
        } catch (emailError) {
            console.error('Failed to send admin notification email:', emailError);
        // Don't fail the order if email fails
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(order);
    } catch (error) {
        console.error('Checkout error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to process checkout'
        }, {
            status: 500
        });
    }
}
}),
];

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="232fd486-60f6-51f8-8aa1-cb252edbe450")}catch(e){}}();
//# sourceMappingURL=%5Broot-of-the-server%5D__fef848c9._.js.map
//# debugId=232fd486-60f6-51f8-8aa1-cb252edbe450
