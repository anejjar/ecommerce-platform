module.exports=[193695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},29173,(e,t,r)=>{t.exports=e.x("@prisma/client",()=>require("@prisma/client"))},698043,e=>{"use strict";var t=e.i(29173);let r=globalThis.prisma??new t.PrismaClient({log:["query"]});e.s(["prisma",0,r])},918622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},224361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},921517,(e,t,r)=>{t.exports=e.x("http",()=>require("http"))},524836,(e,t,r)=>{t.exports=e.x("https",()=>require("https"))},254799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},792509,(e,t,r)=>{t.exports=e.x("url",()=>require("url"))},427699,(e,t,r)=>{t.exports=e.x("events",()=>require("events"))},406461,(e,t,r)=>{t.exports=e.x("zlib",()=>require("zlib"))},449719,(e,t,r)=>{t.exports=e.x("assert",()=>require("assert"))},500874,(e,t,r)=>{t.exports=e.x("buffer",()=>require("buffer"))},145706,(e,t,r)=>{t.exports=e.x("querystring",()=>require("querystring"))},575096,e=>{e.v({name:"openid-client",version:"5.7.1",description:"OpenID Connect Relying Party (RP, Client) implementation for Node.js runtime, supports passportjs",keywords:["auth","authentication","basic","certified","client","connect","dynamic","electron","hybrid","identity","implicit","oauth","oauth2","oidc","openid","passport","relying party","strategy"],homepage:"https://github.com/panva/openid-client",repository:"panva/openid-client",funding:{url:"https://github.com/sponsors/panva"},license:"MIT",author:"Filip Skokan <panva.ip@gmail.com>",exports:{types:"./types/index.d.ts",import:"./lib/index.mjs",require:"./lib/index.js"},main:"./lib/index.js",types:"./types/index.d.ts",files:["lib","types/index.d.ts"],scripts:{format:"npx prettier --loglevel silent --write ./lib ./test ./certification ./types",test:"mocha test/**/*.test.js"},dependencies:{jose:"^4.15.9","lru-cache":"^6.0.0","object-hash":"^2.2.0","oidc-token-hash":"^5.0.3"},devDependencies:{"@types/node":"^16.18.106","@types/passport":"^1.0.16",base64url:"^3.0.1",chai:"^4.5.0",mocha:"^10.7.3",nock:"^13.5.5",prettier:"^2.8.8","readable-mock-req":"^0.2.2",sinon:"^9.2.4",timekeeper:"^2.3.1"},"standard-version":{scripts:{postchangelog:"sed -i '' -e 's/### \\[/## [/g' CHANGELOG.md"},types:[{type:"feat",section:"Features"},{type:"fix",section:"Fixes"},{type:"chore",hidden:!0},{type:"docs",hidden:!0},{type:"style",hidden:!0},{type:"refactor",section:"Refactor",hidden:!1},{type:"perf",section:"Performance",hidden:!1},{type:"test",hidden:!0}]}})},507290,(e,t,r)=>{t.exports=function(e,t){this.v=e,this.k=t},t.exports.__esModule=!0,t.exports.default=t.exports},101900,(e,t,r)=>{function o(e,r,n,s){var i=Object.defineProperty;try{i({},"",{})}catch(e){i=0}t.exports=o=function(e,t,r,n){function s(t,r){o(e,t,function(e){return this._invoke(t,r,e)})}t?i?i(e,t,{value:r,enumerable:!n,configurable:!n,writable:!n}):e[t]=r:(s("next",0),s("throw",1),s("return",2))},t.exports.__esModule=!0,t.exports.default=t.exports,o(e,r,n,s)}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports},458629,(e,t,r)=>{var o=e.r(101900);function n(){var e,r,s="function"==typeof Symbol?Symbol:{},i=s.iterator||"@@iterator",a=s.toStringTag||"@@toStringTag";function p(t,n,s,i){var a=Object.create((n&&n.prototype instanceof u?n:u).prototype);return o(a,"_invoke",function(t,o,n){var s,i,a,p=0,u=n||[],l=!1,c={p:0,n:0,v:e,a:f,f:f.bind(e,4),d:function(t,r){return s=t,i=0,a=e,c.n=r,d}};function f(t,o){for(i=t,a=o,r=0;!l&&p&&!n&&r<u.length;r++){var n,s=u[r],f=c.p,h=s[2];t>3?(n=h===o)&&(a=s[(i=s[4])?5:(i=3,3)],s[4]=s[5]=e):s[0]<=f&&((n=t<2&&f<s[1])?(i=0,c.v=o,c.n=s[1]):f<h&&(n=t<3||s[0]>o||o>h)&&(s[4]=t,s[5]=o,c.n=h,i=0))}if(n||t>1)return d;throw l=!0,o}return function(n,u,h){if(p>1)throw TypeError("Generator is already running");for(l&&1===u&&f(u,h),i=u,a=h;(r=i<2?e:a)||!l;){s||(i?i<3?(i>1&&(c.n=-1),f(i,a)):c.n=a:c.v=a);try{if(p=2,s){if(i||(n="next"),r=s[n]){if(!(r=r.call(s,a)))throw TypeError("iterator result is not an object");if(!r.done)return r;a=r.value,i<2&&(i=0)}else 1===i&&(r=s.return)&&r.call(s),i<2&&(a=TypeError("The iterator does not provide a '"+n+"' method"),i=1);s=e}else if((r=(l=c.n<0)?a:t.call(o,c))!==d)break}catch(t){s=e,i=1,a=t}finally{p=1}}return{value:r,done:l}}}(t,s,i),!0),a}var d={};function u(){}function l(){}function c(){}r=Object.getPrototypeOf;var f=c.prototype=u.prototype=Object.create([][i]?r(r([][i]())):(o(r={},i,function(){return this}),r));function h(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,c):(e.__proto__=c,o(e,a,"GeneratorFunction")),e.prototype=Object.create(f),e}return l.prototype=c,o(f,"constructor",c),o(c,"constructor",l),l.displayName="GeneratorFunction",o(c,a,"GeneratorFunction"),o(f),o(f,a,"Generator"),o(f,i,function(){return this}),o(f,"toString",function(){return"[object Generator]"}),(t.exports=n=function(){return{w:p,m:h}},t.exports.__esModule=!0,t.exports.default=t.exports)()}t.exports=n,t.exports.__esModule=!0,t.exports.default=t.exports},418973,(e,t,r)=>{var o=e.r(507290),n=e.r(101900);t.exports=function e(t,r){var s;this.next||(n(e.prototype),n(e.prototype,"function"==typeof Symbol&&Symbol.asyncIterator||"@asyncIterator",function(){return this})),n(this,"_invoke",function(e,n,i){function a(){return new r(function(n,s){!function e(n,s,i,a){try{var p=t[n](s),d=p.value;return d instanceof o?r.resolve(d.v).then(function(t){e("next",t,i,a)},function(t){e("throw",t,i,a)}):r.resolve(d).then(function(e){p.value=e,i(p)},function(t){return e("throw",t,i,a)})}catch(e){a(e)}}(e,i,n,s)})}return s=s?s.then(a,a):a()},!0)},t.exports.__esModule=!0,t.exports.default=t.exports},61982,(e,t,r)=>{var o=e.r(458629),n=e.r(418973);t.exports=function(e,t,r,s,i){return new n(o().w(e,t,r,s),i||Promise)},t.exports.__esModule=!0,t.exports.default=t.exports},804252,(e,t,r)=>{var o=e.r(61982);t.exports=function(e,t,r,n,s){var i=o(e,t,r,n,s);return i.next().then(function(e){return e.done?e.value:i.next()})},t.exports.__esModule=!0,t.exports.default=t.exports},829915,(e,t,r)=>{t.exports=function(e){var t=Object(e),r=[];for(var o in t)r.unshift(o);return function e(){for(;r.length;)if((o=r.pop())in t)return e.value=o,e.done=!1,e;return e.done=!0,e}},t.exports.__esModule=!0,t.exports.default=t.exports},485754,(e,t,r)=>{function o(e){return t.exports=o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},t.exports.__esModule=!0,t.exports.default=t.exports,o(e)}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports},482995,(e,t,r)=>{var o=e.r(485754).default;t.exports=function(e){if(null!=e){var t=e["function"==typeof Symbol&&Symbol.iterator||"@@iterator"],r=0;if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length))return{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}}}throw TypeError(o(e)+" is not iterable")},t.exports.__esModule=!0,t.exports.default=t.exports},213031,(e,t,r)=>{var o=e.r(507290),n=e.r(458629),s=e.r(804252),i=e.r(61982),a=e.r(418973),p=e.r(829915),d=e.r(482995);function u(){"use strict";var e=n(),r=e.m(u),l=(Object.getPrototypeOf?Object.getPrototypeOf(r):r.__proto__).constructor;function c(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===l||"GeneratorFunction"===(t.displayName||t.name))}var f={throw:1,return:2,break:3,continue:3};function h(e){var t,r;return function(o){t||(t={stop:function(){return r(o.a,2)},catch:function(){return o.v},abrupt:function(e,t){return r(o.a,f[e],t)},delegateYield:function(e,n,s){return t.resultName=n,r(o.d,d(e),s)},finish:function(e){return r(o.f,e)}},r=function(e,r,n){o.p=t.prev,o.n=t.next;try{return e(r,n)}finally{t.next=o.n}}),t.resultName&&(t[t.resultName]=o.v,t.resultName=void 0),t.sent=o.v,t.next=o.n;try{return e.call(this,t)}finally{o.p=t.prev,o.n=t.next}}}return(t.exports=u=function(){return{wrap:function(t,r,o,n){return e.w(h(t),r,o,n&&n.reverse())},isGeneratorFunction:c,mark:e.m,awrap:function(e,t){return new o(e,t)},AsyncIterator:a,async:function(e,t,r,o,n){return(c(t)?i:s)(h(e),t,r,o,n)},keys:p,values:d}},t.exports.__esModule=!0,t.exports.default=t.exports)()}t.exports=u,t.exports.__esModule=!0,t.exports.default=t.exports},981415,(e,t,r)=>{var o=e.r(213031)();t.exports=o;try{regeneratorRuntime=o}catch(e){"object"==typeof globalThis?globalThis.regeneratorRuntime=o:Function("r","regeneratorRuntime = r")(o)}},40766,(e,t,r)=>{var o=e.r(485754).default;t.exports=function(e,t){if("object"!=o(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=o(n))return n;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)},t.exports.__esModule=!0,t.exports.default=t.exports},491776,(e,t,r)=>{var o=e.r(485754).default,n=e.r(40766);t.exports=function(e){var t=n(e,"string");return"symbol"==o(t)?t:t+""},t.exports.__esModule=!0,t.exports.default=t.exports},72762,(e,t,r)=>{var o=e.r(491776);t.exports=function(e,t,r){return(t=o(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e},t.exports.__esModule=!0,t.exports.default=t.exports},361932,(e,t,r)=>{function o(e,t,r,o,n,s,i){try{var a=e[s](i),p=a.value}catch(e){return void r(e)}a.done?t(p):Promise.resolve(p).then(o,n)}t.exports=function(e){return function(){var t=this,r=arguments;return new Promise(function(n,s){var i=e.apply(t,r);function a(e){o(i,n,s,a,p,"next",e)}function p(e){o(i,n,s,a,p,"throw",e)}a(void 0)})}},t.exports.__esModule=!0,t.exports.default=t.exports},432173,(e,t,r)=>{t.exports=function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")},t.exports.__esModule=!0,t.exports.default=t.exports},752046,(e,t,r)=>{var o=e.r(491776);function n(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,o(n.key),n)}}t.exports=function(e,t,r){return t&&n(e.prototype,t),r&&n(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e},t.exports.__esModule=!0,t.exports.default=t.exports},608431,(e,t,r)=>{t.exports=function(e){if(void 0===e)throw ReferenceError("this hasn't been initialised - super() hasn't been called");return e},t.exports.__esModule=!0,t.exports.default=t.exports},313366,(e,t,r)=>{var o=e.r(485754).default,n=e.r(608431);t.exports=function(e,t){if(t&&("object"==o(t)||"function"==typeof t))return t;if(void 0!==t)throw TypeError("Derived constructors may only return object or undefined");return n(e)},t.exports.__esModule=!0,t.exports.default=t.exports},98993,(e,t,r)=>{function o(e){return t.exports=o=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},t.exports.__esModule=!0,t.exports.default=t.exports,o(e)}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports},912619,(e,t,r)=>{function o(e,r){return t.exports=o=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},t.exports.__esModule=!0,t.exports.default=t.exports,o(e,r)}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports},330873,(e,t,r)=>{var o=e.r(912619);t.exports=function(e,t){if("function"!=typeof t&&null!==t)throw TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&o(e,t)},t.exports.__esModule=!0,t.exports.default=t.exports},916020,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0})},757660,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var o={};Object.defineProperty(r,"default",{enumerable:!0,get:function(){return s.default}});var n=e.r(916020);Object.keys(n).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(o,e)||e in r&&r[e]===n[e]||Object.defineProperty(r,e,{enumerable:!0,get:function(){return n[e]}})});var s=function(e,t){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var r=i(void 0);if(r&&r.has(e))return r.get(e);var o={__proto__:null},n=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var s in e)if("default"!==s&&({}).hasOwnProperty.call(e,s)){var a=n?Object.getOwnPropertyDescriptor(e,s):null;a&&(a.get||a.set)?Object.defineProperty(o,s,a):o[s]=e[s]}return o.default=e,r&&r.set(e,o),o}(e.r(823667));function i(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(i=function(e){return e?r:t})(e)}Object.keys(s).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(o,e)||e in r&&r[e]===s[e]||Object.defineProperty(r,e,{enumerable:!0,get:function(){return s[e]}})})},814747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},522734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},688947,(e,t,r)=>{t.exports=e.x("stream",()=>require("stream"))},233405,(e,t,r)=>{t.exports=e.x("child_process",()=>require("child_process"))},446786,(e,t,r)=>{t.exports=e.x("os",()=>require("os"))},848782,e=>{"use strict";function t(e,t){return`
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
  `}function o(e,t){return`
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
  `}function n(e){return`
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
  `}function s(e){return`
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
  `}function p(e,t,r,o){return`
    <h2>New Note on Your Order 📝</h2>
    <p>A note has been added to your order #${e}.</p>

    <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <div style="margin-bottom: 10px; font-size: 12px; color: #1e40af;">
        <strong>${r}</strong> • ${new Date(o).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}
      </div>
      <div style="color: #1e3a8a; line-height: 1.6;">
        ${t}
      </div>
    </div>

    <a href="${process.env.NEXT_PUBLIC_URL||"http://localhost:3000"}/account/orders/${e}" class="button">
      View Order Details
    </a>

    <p>If you have any questions about this note, please contact our support team.</p>
  `}function d(e,t,r,o){return`
    <h2>Refund Request Received 🔄</h2>
    <p>We've received your refund request for order #${e}.</p>

    <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <strong>RMA Number:</strong> ${t}<br>
      <strong>Refund Amount:</strong> $${r}<br>
      <strong>Reason:</strong> ${o}
    </div>

    <p>Our team will review your request and get back to you within 1-2 business days.</p>

    <a href="${process.env.NEXT_PUBLIC_URL||"http://localhost:3000"}/account/orders/${e}" class="button">
      View Order
    </a>

    <p>You can track the status of your refund request in your account.</p>
  `}function u(e,t,r){return`
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
  `}function l(e,t,r){return`
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
  `}function f(e,t,r,o,n,s,i){return`
    <h2>New Refund Request 🔔</h2>
    <p>A customer has submitted a refund request.</p>

    <div class="order-details">
      <h3>Refund Details</h3>

      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 15px 0;">
        <strong>Order Number:</strong> ${e}<br>
        <strong>RMA Number:</strong> ${t}<br>
        <strong>Refund Amount:</strong> $${n}<br>
        <strong>Reason:</strong> ${s}
      </div>

      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 15px 0;">
        <strong>Customer:</strong> ${r}<br>
        <strong>Email:</strong> ${o}
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
  `}e.s(["adminNewOrderEmail",()=>a,"adminNewRefundRequestEmail",()=>f,"customerOrderNoteEmail",()=>p,"lowStockAlertEmail",()=>n,"newsletterWelcomeEmail",()=>i,"orderConfirmationEmail",()=>t,"orderDeliveredEmail",()=>o,"orderShippedEmail",()=>r,"refundApprovedEmailCustomer",()=>u,"refundCompletedEmailCustomer",()=>c,"refundRejectedEmailCustomer",()=>l,"refundRequestedEmailCustomer",()=>d,"welcomeEmail",()=>s])},447579,e=>{"use strict";var t=e.i(747909),r=e.i(174017),o=e.i(996250),n=e.i(759756),s=e.i(561916),i=e.i(114444),a=e.i(837092),p=e.i(869741),d=e.i(316795),u=e.i(487718),l=e.i(995169),c=e.i(47587),f=e.i(666012),h=e.i(570101),x=e.i(626937),b=e.i(10372),y=e.i(193695);e.i(52474);var m=e.i(600220),v=e.i(89171),g=e.i(757660),w=e.i(79832),$=e.i(698043),_=e.i(492749),R=e.i(848782);async function O(e,{params:t}){try{let{id:e}=await t,r=await $.prisma.orderNote.findMany({where:{orderId:e},include:{user:{select:{name:!0,email:!0}}},orderBy:{createdAt:"desc"}});return v.NextResponse.json(r)}catch(e){return console.error("Failed to fetch notes:",e),v.NextResponse.json({error:"Failed to fetch notes"},{status:500})}}async function N(e,{params:t}){try{let r=await (0,g.getServerSession)(w.authOptions);if(!r||"ADMIN"!==r.user.role)return v.NextResponse.json({error:"Unauthorized"},{status:401});let{id:o}=await t,{note:n,isInternal:s}=await e.json(),i=await $.prisma.user.findUnique({where:{id:r.user.id}});if(!i&&r.user?.email){let e=await $.prisma.user.findUnique({where:{email:r.user.email}});e&&(console.warn("Session user id not found; falling back to user found by email",{sessionId:r.user.id,email:r.user.email,fallbackId:e.id}),i=e)}if(!i)return console.error("Session user not found in database:",r.user.id),v.NextResponse.json({error:"Session user not found"},{status:400});if(!n||!n.trim())return v.NextResponse.json({error:"Note content is required"},{status:400});let a=await $.prisma.orderNote.create({data:{note:n.trim(),isInternal:s??!0,orderId:o,userId:i.id},include:{user:{select:{name:!0,email:!0}}}});if(!a.isInternal)try{let e=await $.prisma.order.findUnique({where:{id:o},select:{orderNumber:!0,user:{select:{email:!0,name:!0}},guestEmail:!0}});if(e){let t=e.user?.email||e.guestEmail;t&&await (0,_.sendEmail)({to:t,subject:`New Note on Order #${e.orderNumber}`,html:(0,R.customerOrderNoteEmail)(e.orderNumber,a.note,a.user.name||a.user.email||"Admin",a.createdAt)})}}catch(e){console.error("Failed to send customer note notification:",e)}return v.NextResponse.json(a)}catch(e){return console.error("Failed to create note:",e),v.NextResponse.json({error:"Failed to create note"},{status:500})}}e.s(["GET",()=>O,"POST",()=>N],370160);var j=e.i(370160);let A=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/orders/[id]/notes/route",pathname:"/api/orders/[id]/notes",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/orders/[id]/notes/route.ts",nextConfigOutput:"",userland:j}),{workAsyncStorage:E,workUnitAsyncStorage:k,serverHooks:P}=A;function S(){return(0,o.patchFetch)({workAsyncStorage:E,workUnitAsyncStorage:k})}async function T(e,t,o){A.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let v="/api/orders/[id]/notes/route";v=v.replace(/\/index$/,"")||"/";let g=await A.prepare(e,t,{srcPage:v,multiZoneDraftMode:!1});if(!g)return t.statusCode=400,t.end("Bad Request"),null==o.waitUntil||o.waitUntil.call(o,Promise.resolve()),null;let{buildId:w,params:$,nextConfig:_,parsedUrl:R,isDraftMode:O,prerenderManifest:N,routerServerContext:j,isOnDemandRevalidate:E,revalidateOnlyGenerated:k,resolvedPathname:P,clientReferenceManifest:S,serverActionsManifest:T}=g,C=(0,p.normalizeAppPath)(v),q=!!(N.dynamicRoutes[C]||N.routes[P]),M=async()=>((null==j?void 0:j.render404)?await j.render404(e,t,R,!1):t.end("This page could not be found"),null);if(q&&!O){let e=!!N.routes[P],t=N.dynamicRoutes[C];if(t&&!1===t.fallback&&!e){if(_.experimental.adapterPath)return await M();throw new y.NoFallbackError}}let U=null;!q||A.isDev||O||(U="/index"===(U=P)?"/":U);let I=!0===A.isDev||!q,L=q&&!I;T&&S&&(0,i.setReferenceManifestsSingleton)({page:v,clientReferenceManifest:S,serverActionsManifest:T,serverModuleMap:(0,a.createServerModuleMap)({serverActionsManifest:T})});let D=e.method||"GET",H=(0,s.getTracer)(),F=H.getActiveScopeSpan(),B={params:$,prerenderManifest:N,renderOpts:{experimental:{authInterrupts:!!_.experimental.authInterrupts},cacheComponents:!!_.cacheComponents,supportsDynamicResponse:I,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:_.cacheLife,waitUntil:o.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,o)=>A.onRequestError(e,t,o,j)},sharedContext:{buildId:w}},G=new d.NodeNextRequest(e),W=new d.NodeNextResponse(t),X=u.NextRequestAdapter.fromNodeNextRequest(G,(0,u.signalFromNodeResponse)(t));try{let i=async e=>A.handle(X,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=H.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==l.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let o=r.get("next.route");if(o){let t=`${D} ${o}`;e.setAttributes({"next.route":o,"http.route":o,"next.span_name":t}),e.updateName(t)}else e.updateName(`${D} ${v}`)}),a=!!(0,n.getRequestMeta)(e,"minimalMode"),p=async n=>{var s,p;let d=async({previousCacheEntry:r})=>{try{if(!a&&E&&k&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await i(n);e.fetchMetrics=B.renderOpts.fetchMetrics;let p=B.renderOpts.pendingWaitUntil;p&&o.waitUntil&&(o.waitUntil(p),p=void 0);let d=B.renderOpts.collectedTags;if(!q)return await (0,f.sendResponse)(G,W,s,B.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(s.headers);d&&(t[b.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=b.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,o=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=b.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:m.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:o}}}}catch(t){throw(null==r?void 0:r.isStale)&&await A.onRequestError(e,t,{routerKind:"App Router",routePath:v,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:L,isOnDemandRevalidate:E})},j),t}},u=await A.handleResponse({req:e,nextConfig:_,cacheKey:U,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:N,isRoutePPREnabled:!1,isOnDemandRevalidate:E,revalidateOnlyGenerated:k,responseGenerator:d,waitUntil:o.waitUntil,isMinimalMode:a});if(!q)return null;if((null==u||null==(s=u.value)?void 0:s.kind)!==m.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(p=u.value)?void 0:p.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});a||t.setHeader("x-nextjs-cache",E?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),O&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let l=(0,h.fromNodeOutgoingHttpHeaders)(u.value.headers);return a&&q||l.delete(b.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||l.get("Cache-Control")||l.set("Cache-Control",(0,x.getCacheControlHeader)(u.cacheControl)),await (0,f.sendResponse)(G,W,new Response(u.value.body,{headers:l,status:u.value.status||200})),null};F?await p(F):await H.withPropagatedContext(e.headers,()=>H.trace(l.BaseServerSpan.handleRequest,{spanName:`${D} ${v}`,kind:s.SpanKind.SERVER,attributes:{"http.method":D,"http.target":e.url}},p))}catch(t){if(t instanceof y.NoFallbackError||await A.onRequestError(e,t,{routerKind:"App Router",routePath:C,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:L,isOnDemandRevalidate:E})}),q)throw t;return await (0,f.sendResponse)(G,W,new Response(null,{status:500})),null}}e.s(["handler",()=>T,"patchFetch",()=>S,"routeModule",()=>A,"serverHooks",()=>P,"workAsyncStorage",()=>E,"workUnitAsyncStorage",()=>k],447579)}];

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="b5d6d1a6-38e0-5843-ae9d-f0594d1d89f5")}catch(e){}}();
//# sourceMappingURL=%5Broot-of-the-server%5D__69a8b7a2._.js.map
//# debugId=b5d6d1a6-38e0-5843-ae9d-f0594d1d89f5
