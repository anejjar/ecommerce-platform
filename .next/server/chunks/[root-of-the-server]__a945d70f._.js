module.exports=[193695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},29173,(e,t,r)=>{t.exports=e.x("@prisma/client",()=>require("@prisma/client"))},698043,e=>{"use strict";var t=e.i(29173);let r=globalThis.prisma??new t.PrismaClient({log:["query"]});e.s(["prisma",0,r])},918622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},224361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},921517,(e,t,r)=>{t.exports=e.x("http",()=>require("http"))},524836,(e,t,r)=>{t.exports=e.x("https",()=>require("https"))},254799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},427699,(e,t,r)=>{t.exports=e.x("events",()=>require("events"))},792509,(e,t,r)=>{t.exports=e.x("url",()=>require("url"))},406461,(e,t,r)=>{t.exports=e.x("zlib",()=>require("zlib"))},814747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},522734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},688947,(e,t,r)=>{t.exports=e.x("stream",()=>require("stream"))},233405,(e,t,r)=>{t.exports=e.x("child_process",()=>require("child_process"))},446786,(e,t,r)=>{t.exports=e.x("os",()=>require("os"))},848782,e=>{"use strict";function t(e,t){return`
    <h2>Order Confirmation</h2>
    <p>Hi ${t},</p>
    <p>Thank you for your order! We've received your order and will process it shortly.</p>

    <div class="order-details">
      <h3>Order #${e.orderNumber}</h3>

      ${e.items.map(e=>`
        <div class="order-item">
          <div>
            <strong>${e.product.name}</strong><br>
            <span style="color: #6b7280;">Quantity: ${e.quantity}</span>
          </div>
          <div style="text-align: right;">
            <strong>$${e.total}</strong><br>
            <span style="color: #6b7280; font-size: 14px;">$${e.price} each</span>
          </div>
        </div>
      `).join("")}

      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Subtotal:</span>
          <span>$${e.subtotal}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Tax:</span>
          <span>$${e.tax}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Shipping:</span>
          <span>$${e.shipping}</span>
        </div>
        <div class="total" style="display: flex; justify-content: space-between;">
          <span>Total:</span>
          <span>$${e.total}</span>
        </div>
      </div>
    </div>

    ${e.shippingAddress?`
      <div style="margin-top: 20px;">
        <h3>Shipping Address</h3>
        <p style="margin: 5px 0;">
          ${e.shippingAddress.firstName} ${e.shippingAddress.lastName}<br>
          ${e.shippingAddress.address1}${e.shippingAddress.address2?"<br>"+e.shippingAddress.address2:""}<br>
          ${e.shippingAddress.city}, ${e.shippingAddress.state} ${e.shippingAddress.postalCode}<br>
          ${e.shippingAddress.country}
        </p>
      </div>
    `:""}

    <a href="${process.env.NEXT_PUBLIC_URL||"http://localhost:3000"}/account/orders/${e.orderNumber}" class="button">
      View Order Details
    </a>

    <p>We'll send you another email when your order ships.</p>
  `}function r(e,t,r){return`
    <h2>Your Order Has Shipped! 📦</h2>
    <p>Hi ${t},</p>
    <p>Great news! Your order #${e.orderNumber} has been shipped and is on its way to you.</p>

    ${r?`
      <div style="background-color: #dbeafe; border: 1px solid #3b82f6; border-radius: 6px; padding: 15px; margin: 20px 0;">
        <strong>Tracking Number:</strong><br>
        <span style="font-family: monospace; font-size: 16px;">${r}</span>
      </div>
    `:""}

    <div class="order-details">
      <h3>Order Summary</h3>
      ${e.items.map(e=>`
        <div class="order-item">
          <div>
            <strong>${e.product.name}</strong><br>
            <span style="color: #6b7280;">Quantity: ${e.quantity}</span>
          </div>
          <div style="text-align: right;">
            <strong>$${e.total}</strong>
          </div>
        </div>
      `).join("")}

      <div class="total" style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 2px solid #3b82f6;">
        <span>Total:</span>
        <span>$${e.total}</span>
      </div>
    </div>

    ${e.shippingAddress?`
      <div style="margin-top: 20px;">
        <h3>Shipping To:</h3>
        <p style="margin: 5px 0;">
          ${e.shippingAddress.firstName} ${e.shippingAddress.lastName}<br>
          ${e.shippingAddress.address1}${e.shippingAddress.address2?"<br>"+e.shippingAddress.address2:""}<br>
          ${e.shippingAddress.city}, ${e.shippingAddress.state} ${e.shippingAddress.postalCode}<br>
          ${e.shippingAddress.country}
        </p>
      </div>
    `:""}

    <a href="${process.env.NEXT_PUBLIC_URL||"http://localhost:3000"}/account/orders/${e.orderNumber}" class="button">
      Track Your Order
    </a>
  `}function s(e,t){return`
    <h2>Your Order Has Been Delivered! 🎉</h2>
    <p>Hi ${t},</p>
    <p>Your order #${e.orderNumber} has been delivered. We hope you love your purchase!</p>

    <div class="order-details">
      <h3>Order Summary</h3>
      ${e.items.map(e=>`
        <div class="order-item">
          <div>
            <strong>${e.product.name}</strong><br>
            <span style="color: #6b7280;">Quantity: ${e.quantity}</span>
          </div>
          <div style="text-align: right;">
            <strong>$${e.total}</strong>
          </div>
        </div>
      `).join("")}
    </div>

    <p style="margin-top: 20px;">How was your experience? We'd love to hear your feedback!</p>

    <a href="${process.env.NEXT_PUBLIC_URL||"http://localhost:3000"}/account/orders/${e.orderNumber}" class="button">
      Leave a Review
    </a>
  `}function o(e){return`
    <h2>Low Stock Alert! ⚠️</h2>
    <p>The following products are running low on stock:</p>

    <div class="order-details">
      ${e.map(e=>`
        <div class="order-item">
          <div>
            <strong>${e.name}</strong><br>
            ${e.sku?`<span style="color: #6b7280;">SKU: ${e.sku}</span>`:""}
          </div>
          <div style="text-align: right;">
            <span style="color: ${0===e.stock?"#dc2626":"#f59e0b"}; font-weight: bold;">
              ${e.stock} units
            </span><br>
            <span style="color: #6b7280; font-size: 14px;">Threshold: ${e.threshold}</span>
          </div>
        </div>
      `).join("")}
    </div>

    <a href="${process.env.NEXT_PUBLIC_URL||"http://localhost:3000"}/admin/settings/stock-alerts" class="button">
      View Stock Alerts
    </a>

    <p>Please restock these items to avoid running out of inventory.</p>
  `}function n(e){return`
    <h2>Welcome to Our Store! 🎊</h2>
    <p>Hi ${e},</p>
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

    <a href="${process.env.NEXT_PUBLIC_URL||"http://localhost:3000"}/shop" class="button">
      Start Shopping
    </a>

    <p>If you have any questions, our support team is always here to help!</p>
  `}function i(e){return`
    <h2>Welcome to Our Newsletter! 📧</h2>
    <p>Hi ${e||"there"},</p>
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

    <a href="${process.env.NEXT_PUBLIC_URL||"http://localhost:3000"}/shop" class="button">
      Browse Our Products
    </a>
  `}function a(e,t){return`
    <h2>New Order Received! 🛍️</h2>
    <p>A new order has been placed on your store.</p>

    <div class="order-details">
      <h3>Order #${e.orderNumber}</h3>
      <div style="margin-bottom: 15px; padding: 10px; background-color: #f9fafb; border-radius: 6px;">
        <strong>Customer Email:</strong> ${t}<br>
        <strong>Order Status:</strong> <span style="color: #f59e0b; font-weight: bold;">${e.status}</span>
      </div>

      ${e.items.map(e=>`
        <div class="order-item">
          <div>
            <strong>${e.product.name}</strong><br>
            <span style="color: #6b7280;">Quantity: ${e.quantity}</span>
          </div>
          <div style="text-align: right;">
            <strong>$${e.total}</strong><br>
            <span style="color: #6b7280; font-size: 14px;">$${e.price} each</span>
          </div>
        </div>
      `).join("")}

      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Subtotal:</span>
          <span>$${e.subtotal}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Tax:</span>
          <span>$${e.tax}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Shipping:</span>
          <span>$${e.shipping}</span>
        </div>
        ${e.discountAmount&&parseFloat(e.discountAmount)>0?`
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #059669;">
          <span>Discount:</span>
          <span>-$${e.discountAmount}</span>
        </div>
        `:""}
        <div class="total" style="display: flex; justify-content: space-between;">
          <span>Total:</span>
          <span>$${e.total}</span>
        </div>
      </div>
    </div>

    ${e.shippingAddress?`
      <div style="margin-top: 20px;">
        <h3>Shipping Address</h3>
        <p style="margin: 5px 0;">
          ${e.shippingAddress.firstName} ${e.shippingAddress.lastName}<br>
          ${e.shippingAddress.address1}${e.shippingAddress.address2?"<br>"+e.shippingAddress.address2:""}<br>
          ${e.shippingAddress.city}, ${e.shippingAddress.state} ${e.shippingAddress.postalCode}<br>
          ${e.shippingAddress.country}
        </p>
      </div>
    `:""}

    <a href="${process.env.NEXT_PUBLIC_URL||"http://localhost:3000"}/admin/orders/${e.orderNumber}" class="button">
      View Order in Admin
    </a>

    <p>Please process this order as soon as possible.</p>
  `}function d(e,t,r,s){return`
    <h2>New Note on Your Order 📝</h2>
    <p>A note has been added to your order #${e}.</p>

    <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <div style="margin-bottom: 10px; font-size: 12px; color: #1e40af;">
        <strong>${r}</strong> • ${new Date(s).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}
      </div>
      <div style="color: #1e3a8a; line-height: 1.6;">
        ${t}
      </div>
    </div>

    <a href="${process.env.NEXT_PUBLIC_URL||"http://localhost:3000"}/account/orders/${e}" class="button">
      View Order Details
    </a>

    <p>If you have any questions about this note, please contact our support team.</p>
  `}function p(e,t,r,s){return`
    <h2>Refund Request Received 🔄</h2>
    <p>We've received your refund request for order #${e}.</p>

    <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <strong>RMA Number:</strong> ${t}<br>
      <strong>Refund Amount:</strong> $${r}<br>
      <strong>Reason:</strong> ${s}
    </div>

    <p>Our team will review your request and get back to you within 1-2 business days.</p>

    <a href="${process.env.NEXT_PUBLIC_URL||"http://localhost:3000"}/account/orders/${e}" class="button">
      View Order
    </a>

    <p>You can track the status of your refund request in your account.</p>
  `}function l(e,t,r){return`
    <h2>Refund Approved! ✅</h2>
    <p>Great news! Your refund request has been approved.</p>

    <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <strong>Order Number:</strong> ${e}<br>
      <strong>RMA Number:</strong> ${t}<br>
      <strong>Refund Amount:</strong> $${r}
    </div>

    <h3>Next Steps:</h3>
    <ul style="line-height: 1.8;">
      <li>Your refund will be processed within 5-7 business days</li>
      <li>The amount will be credited to your original payment method</li>
      <li>You may need to return the item(s) using the provided RMA number</li>
    </ul>

    <p>Thank you for your patience!</p>
  `}function u(e,t,r){return`
    <h2>Refund Request Update ❌</h2>
    <p>We've reviewed your refund request for order #${e}.</p>

    <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <strong>RMA Number:</strong> ${t}<br>
      <strong>Status:</strong> Not Approved
    </div>

    ${r?`
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 15px 0;">
        <strong>Reason:</strong><br>
        <p style="margin-top: 10px;">${r}</p>
      </div>
    `:""}

    <p>If you have questions about this decision, please contact our support team.</p>

    <a href="${process.env.NEXT_PUBLIC_URL||"http://localhost:3000"}/contact" class="button">
      Contact Support
    </a>
  `}function c(e,t,r){return`
    <h2>Refund Completed! 💰</h2>
    <p>Your refund has been successfully processed.</p>

    <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <strong>Order Number:</strong> ${e}<br>
      <strong>RMA Number:</strong> ${t}<br>
      <strong>Refunded Amount:</strong> $${r}
    </div>

    <p>The refund has been credited to your original payment method. Depending on your bank, it may take 5-10 business days to appear in your account.</p>

    <p>Thank you for shopping with us!</p>
  `}function h(e,t,r,s,o,n,i){return`
    <h2>New Refund Request 🔔</h2>
    <p>A customer has submitted a refund request.</p>

    <div class="order-details">
      <h3>Refund Details</h3>

      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 15px 0;">
        <strong>Order Number:</strong> ${e}<br>
        <strong>RMA Number:</strong> ${t}<br>
        <strong>Refund Amount:</strong> $${o}<br>
        <strong>Reason:</strong> ${n}
      </div>

      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 15px 0;">
        <strong>Customer:</strong> ${r}<br>
        <strong>Email:</strong> ${s}
      </div>

      ${i?`
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; border-radius: 4px;">
          <strong>Customer Notes:</strong><br>
          <p style="margin-top: 10px;">${i}</p>
        </div>
      `:""}
    </div>

    <a href="${process.env.NEXT_PUBLIC_URL||"http://localhost:3000"}/admin/refunds" class="button">
      Review Refund Request
    </a>

    <p>Please review and process this request as soon as possible.</p>
  `}e.s(["adminNewOrderEmail",()=>a,"adminNewRefundRequestEmail",()=>h,"customerOrderNoteEmail",()=>d,"lowStockAlertEmail",()=>o,"newsletterWelcomeEmail",()=>i,"orderConfirmationEmail",()=>t,"orderDeliveredEmail",()=>s,"orderShippedEmail",()=>r,"refundApprovedEmailCustomer",()=>l,"refundCompletedEmailCustomer",()=>c,"refundRejectedEmailCustomer",()=>u,"refundRequestedEmailCustomer",()=>p,"welcomeEmail",()=>n])},462134,e=>{"use strict";var t=e.i(747909),r=e.i(174017),s=e.i(996250),o=e.i(759756),n=e.i(561916),i=e.i(114444),a=e.i(837092),d=e.i(869741),p=e.i(316795),l=e.i(487718),u=e.i(995169),c=e.i(47587),h=e.i(666012),g=e.i(570101),m=e.i(626937),b=e.i(10372),v=e.i(193695);e.i(52474);var x=e.i(600220),f=e.i(89171),y=e.i(698043),$=e.i(492749),w=e.i(848782);async function R(e){try{let{email:t,name:r,source:s,landingPageId:o}=await e.json();if(!t)return f.NextResponse.json({error:"Email is required"},{status:400});if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t))return f.NextResponse.json({error:"Invalid email format"},{status:400});let n=await y.prisma.newsletterSubscriber.findUnique({where:{email:t}});if(n)if(n.isActive)return f.NextResponse.json({error:"Email is already subscribed"},{status:400});else{let e=await y.prisma.newsletterSubscriber.update({where:{email:t},data:{isActive:!0,unsubscribedAt:null,name:r||n.name,source:s||n.source,landingPageId:o||n.landingPageId}});try{await (0,$.sendEmail)({to:t,subject:"Welcome Back to Our Newsletter!",html:(0,w.newsletterWelcomeEmail)(r||n.name||void 0)})}catch(e){console.error("Failed to send welcome email:",e)}return f.NextResponse.json({message:"Successfully resubscribed to newsletter",subscriber:{email:e.email,name:e.name}})}let i=await y.prisma.newsletterSubscriber.create({data:{email:t,name:r||null,source:s||"unknown",landingPageId:o||null,isActive:!0}});try{await (0,$.sendEmail)({to:t,subject:"Welcome to Our Newsletter!",html:(0,w.newsletterWelcomeEmail)(r||void 0)})}catch(e){console.error("Failed to send welcome email:",e)}return f.NextResponse.json({message:"Successfully subscribed to newsletter",subscriber:{email:i.email,name:i.name}})}catch(e){return console.error("Newsletter subscription error:",e),console.error("Error details:",{message:e?.message,code:e?.code,meta:e?.meta}),f.NextResponse.json({error:"Failed to subscribe to newsletter",details:void 0},{status:500})}}e.s(["POST",()=>R],95671);var A=e.i(95671);let E=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/newsletter/subscribe/route",pathname:"/api/newsletter/subscribe",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/newsletter/subscribe/route.ts",nextConfigOutput:"",userland:A}),{workAsyncStorage:N,workUnitAsyncStorage:C,serverHooks:k}=E;function T(){return(0,s.patchFetch)({workAsyncStorage:N,workUnitAsyncStorage:C})}async function q(e,t,s){E.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let f="/api/newsletter/subscribe/route";f=f.replace(/\/index$/,"")||"/";let y=await E.prepare(e,t,{srcPage:f,multiZoneDraftMode:!1});if(!y)return t.statusCode=400,t.end("Bad Request"),null==s.waitUntil||s.waitUntil.call(s,Promise.resolve()),null;let{buildId:$,params:w,nextConfig:R,parsedUrl:A,isDraftMode:N,prerenderManifest:C,routerServerContext:k,isOnDemandRevalidate:T,revalidateOnlyGenerated:q,resolvedPathname:S,clientReferenceManifest:O,serverActionsManifest:_}=y,P=(0,d.normalizeAppPath)(f),j=!!(C.dynamicRoutes[P]||C.routes[S]),U=async()=>((null==k?void 0:k.render404)?await k.render404(e,t,A,!1):t.end("This page could not be found"),null);if(j&&!N){let e=!!C.routes[S],t=C.dynamicRoutes[P];if(t&&!1===t.fallback&&!e){if(R.experimental.adapterPath)return await U();throw new v.NoFallbackError}}let I=null;!j||E.isDev||N||(I="/index"===(I=S)?"/":I);let L=!0===E.isDev||!j,H=j&&!L;_&&O&&(0,i.setReferenceManifestsSingleton)({page:f,clientReferenceManifest:O,serverActionsManifest:_,serverModuleMap:(0,a.createServerModuleMap)({serverActionsManifest:_})});let D=e.method||"GET",M=(0,n.getTracer)(),B=M.getActiveScopeSpan(),W={params:w,prerenderManifest:C,renderOpts:{experimental:{authInterrupts:!!R.experimental.authInterrupts},cacheComponents:!!R.cacheComponents,supportsDynamicResponse:L,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:R.cacheLife,waitUntil:s.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,s)=>E.onRequestError(e,t,s,k)},sharedContext:{buildId:$}},X=new p.NodeNextRequest(e),Y=new p.NodeNextResponse(t),F=l.NextRequestAdapter.fromNodeNextRequest(X,(0,l.signalFromNodeResponse)(t));try{let i=async e=>E.handle(F,W).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=M.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let s=r.get("next.route");if(s){let t=`${D} ${s}`;e.setAttributes({"next.route":s,"http.route":s,"next.span_name":t}),e.updateName(t)}else e.updateName(`${D} ${f}`)}),a=!!(0,o.getRequestMeta)(e,"minimalMode"),d=async o=>{var n,d;let p=async({previousCacheEntry:r})=>{try{if(!a&&T&&q&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(o);e.fetchMetrics=W.renderOpts.fetchMetrics;let d=W.renderOpts.pendingWaitUntil;d&&s.waitUntil&&(s.waitUntil(d),d=void 0);let p=W.renderOpts.collectedTags;if(!j)return await (0,h.sendResponse)(X,Y,n,W.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,g.toNodeOutgoingHttpHeaders)(n.headers);p&&(t[b.NEXT_CACHE_TAGS_HEADER]=p),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==W.renderOpts.collectedRevalidate&&!(W.renderOpts.collectedRevalidate>=b.INFINITE_CACHE)&&W.renderOpts.collectedRevalidate,s=void 0===W.renderOpts.collectedExpire||W.renderOpts.collectedExpire>=b.INFINITE_CACHE?void 0:W.renderOpts.collectedExpire;return{value:{kind:x.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:s}}}}catch(t){throw(null==r?void 0:r.isStale)&&await E.onRequestError(e,t,{routerKind:"App Router",routePath:f,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:T})},k),t}},l=await E.handleResponse({req:e,nextConfig:R,cacheKey:I,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:T,revalidateOnlyGenerated:q,responseGenerator:p,waitUntil:s.waitUntil,isMinimalMode:a});if(!j)return null;if((null==l||null==(n=l.value)?void 0:n.kind)!==x.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(d=l.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});a||t.setHeader("x-nextjs-cache",T?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),N&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,g.fromNodeOutgoingHttpHeaders)(l.value.headers);return a&&j||u.delete(b.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,m.getCacheControlHeader)(l.cacheControl)),await (0,h.sendResponse)(X,Y,new Response(l.value.body,{headers:u,status:l.value.status||200})),null};B?await d(B):await M.withPropagatedContext(e.headers,()=>M.trace(u.BaseServerSpan.handleRequest,{spanName:`${D} ${f}`,kind:n.SpanKind.SERVER,attributes:{"http.method":D,"http.target":e.url}},d))}catch(t){if(t instanceof v.NoFallbackError||await E.onRequestError(e,t,{routerKind:"App Router",routePath:P,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:T})}),j)throw t;return await (0,h.sendResponse)(X,Y,new Response(null,{status:500})),null}}e.s(["handler",()=>q,"patchFetch",()=>T,"routeModule",()=>E,"serverHooks",()=>k,"workAsyncStorage",()=>N,"workUnitAsyncStorage",()=>C],462134)}];

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="1efd52ed-c2b2-5a58-bf25-9c4634c895eb")}catch(e){}}();
//# sourceMappingURL=%5Broot-of-the-server%5D__a945d70f._.js.map
//# debugId=1efd52ed-c2b2-5a58-bf25-9c4634c895eb
