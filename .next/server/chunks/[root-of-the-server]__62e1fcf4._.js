module.exports=[193695,(e,r,t)=>{r.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},29173,(e,r,t)=>{r.exports=e.x("@prisma/client",()=>require("@prisma/client"))},698043,e=>{"use strict";var r=e.i(29173);let t=globalThis.prisma??new r.PrismaClient({log:["query"]});e.s(["prisma",0,t])},918622,(e,r,t)=>{r.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,r,t)=>{r.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,r,t)=>{r.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,r,t)=>{r.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},224361,(e,r,t)=>{r.exports=e.x("util",()=>require("util"))},921517,(e,r,t)=>{r.exports=e.x("http",()=>require("http"))},524836,(e,r,t)=>{r.exports=e.x("https",()=>require("https"))},254799,(e,r,t)=>{r.exports=e.x("crypto",()=>require("crypto"))},792509,(e,r,t)=>{r.exports=e.x("url",()=>require("url"))},427699,(e,r,t)=>{r.exports=e.x("events",()=>require("events"))},406461,(e,r,t)=>{r.exports=e.x("zlib",()=>require("zlib"))},449719,(e,r,t)=>{r.exports=e.x("assert",()=>require("assert"))},500874,(e,r,t)=>{r.exports=e.x("buffer",()=>require("buffer"))},145706,(e,r,t)=>{r.exports=e.x("querystring",()=>require("querystring"))},575096,e=>{e.v({name:"openid-client",version:"5.7.1",description:"OpenID Connect Relying Party (RP, Client) implementation for Node.js runtime, supports passportjs",keywords:["auth","authentication","basic","certified","client","connect","dynamic","electron","hybrid","identity","implicit","oauth","oauth2","oidc","openid","passport","relying party","strategy"],homepage:"https://github.com/panva/openid-client",repository:"panva/openid-client",funding:{url:"https://github.com/sponsors/panva"},license:"MIT",author:"Filip Skokan <panva.ip@gmail.com>",exports:{types:"./types/index.d.ts",import:"./lib/index.mjs",require:"./lib/index.js"},main:"./lib/index.js",types:"./types/index.d.ts",files:["lib","types/index.d.ts"],scripts:{format:"npx prettier --loglevel silent --write ./lib ./test ./certification ./types",test:"mocha test/**/*.test.js"},dependencies:{jose:"^4.15.9","lru-cache":"^6.0.0","object-hash":"^2.2.0","oidc-token-hash":"^5.0.3"},devDependencies:{"@types/node":"^16.18.106","@types/passport":"^1.0.16",base64url:"^3.0.1",chai:"^4.5.0",mocha:"^10.7.3",nock:"^13.5.5",prettier:"^2.8.8","readable-mock-req":"^0.2.2",sinon:"^9.2.4",timekeeper:"^2.3.1"},"standard-version":{scripts:{postchangelog:"sed -i '' -e 's/### \\[/## [/g' CHANGELOG.md"},types:[{type:"feat",section:"Features"},{type:"fix",section:"Fixes"},{type:"chore",hidden:!0},{type:"docs",hidden:!0},{type:"style",hidden:!0},{type:"refactor",section:"Refactor",hidden:!1},{type:"perf",section:"Performance",hidden:!1},{type:"test",hidden:!0}]}})},507290,(e,r,t)=>{r.exports=function(e,r){this.v=e,this.k=r},r.exports.__esModule=!0,r.exports.default=r.exports},101900,(e,r,t)=>{function o(e,t,n,s){var i=Object.defineProperty;try{i({},"",{})}catch(e){i=0}r.exports=o=function(e,r,t,n){function s(r,t){o(e,r,function(e){return this._invoke(r,t,e)})}r?i?i(e,r,{value:t,enumerable:!n,configurable:!n,writable:!n}):e[r]=t:(s("next",0),s("throw",1),s("return",2))},r.exports.__esModule=!0,r.exports.default=r.exports,o(e,t,n,s)}r.exports=o,r.exports.__esModule=!0,r.exports.default=r.exports},458629,(e,r,t)=>{var o=e.r(101900);function n(){var e,t,s="function"==typeof Symbol?Symbol:{},i=s.iterator||"@@iterator",a=s.toStringTag||"@@toStringTag";function p(r,n,s,i){var a=Object.create((n&&n.prototype instanceof u?n:u).prototype);return o(a,"_invoke",function(r,o,n){var s,i,a,p=0,u=n||[],l=!1,c={p:0,n:0,v:e,a:f,f:f.bind(e,4),d:function(r,t){return s=r,i=0,a=e,c.n=t,d}};function f(r,o){for(i=r,a=o,t=0;!l&&p&&!n&&t<u.length;t++){var n,s=u[t],f=c.p,x=s[2];r>3?(n=x===o)&&(a=s[(i=s[4])?5:(i=3,3)],s[4]=s[5]=e):s[0]<=f&&((n=r<2&&f<s[1])?(i=0,c.v=o,c.n=s[1]):f<x&&(n=r<3||s[0]>o||o>x)&&(s[4]=r,s[5]=o,c.n=x,i=0))}if(n||r>1)return d;throw l=!0,o}return function(n,u,x){if(p>1)throw TypeError("Generator is already running");for(l&&1===u&&f(u,x),i=u,a=x;(t=i<2?e:a)||!l;){s||(i?i<3?(i>1&&(c.n=-1),f(i,a)):c.n=a:c.v=a);try{if(p=2,s){if(i||(n="next"),t=s[n]){if(!(t=t.call(s,a)))throw TypeError("iterator result is not an object");if(!t.done)return t;a=t.value,i<2&&(i=0)}else 1===i&&(t=s.return)&&t.call(s),i<2&&(a=TypeError("The iterator does not provide a '"+n+"' method"),i=1);s=e}else if((t=(l=c.n<0)?a:r.call(o,c))!==d)break}catch(r){s=e,i=1,a=r}finally{p=1}}return{value:t,done:l}}}(r,s,i),!0),a}var d={};function u(){}function l(){}function c(){}t=Object.getPrototypeOf;var f=c.prototype=u.prototype=Object.create([][i]?t(t([][i]())):(o(t={},i,function(){return this}),t));function x(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,c):(e.__proto__=c,o(e,a,"GeneratorFunction")),e.prototype=Object.create(f),e}return l.prototype=c,o(f,"constructor",c),o(c,"constructor",l),l.displayName="GeneratorFunction",o(c,a,"GeneratorFunction"),o(f),o(f,a,"Generator"),o(f,i,function(){return this}),o(f,"toString",function(){return"[object Generator]"}),(r.exports=n=function(){return{w:p,m:x}},r.exports.__esModule=!0,r.exports.default=r.exports)()}r.exports=n,r.exports.__esModule=!0,r.exports.default=r.exports},418973,(e,r,t)=>{var o=e.r(507290),n=e.r(101900);r.exports=function e(r,t){var s;this.next||(n(e.prototype),n(e.prototype,"function"==typeof Symbol&&Symbol.asyncIterator||"@asyncIterator",function(){return this})),n(this,"_invoke",function(e,n,i){function a(){return new t(function(n,s){!function e(n,s,i,a){try{var p=r[n](s),d=p.value;return d instanceof o?t.resolve(d.v).then(function(r){e("next",r,i,a)},function(r){e("throw",r,i,a)}):t.resolve(d).then(function(e){p.value=e,i(p)},function(r){return e("throw",r,i,a)})}catch(e){a(e)}}(e,i,n,s)})}return s=s?s.then(a,a):a()},!0)},r.exports.__esModule=!0,r.exports.default=r.exports},61982,(e,r,t)=>{var o=e.r(458629),n=e.r(418973);r.exports=function(e,r,t,s,i){return new n(o().w(e,r,t,s),i||Promise)},r.exports.__esModule=!0,r.exports.default=r.exports},804252,(e,r,t)=>{var o=e.r(61982);r.exports=function(e,r,t,n,s){var i=o(e,r,t,n,s);return i.next().then(function(e){return e.done?e.value:i.next()})},r.exports.__esModule=!0,r.exports.default=r.exports},829915,(e,r,t)=>{r.exports=function(e){var r=Object(e),t=[];for(var o in r)t.unshift(o);return function e(){for(;t.length;)if((o=t.pop())in r)return e.value=o,e.done=!1,e;return e.done=!0,e}},r.exports.__esModule=!0,r.exports.default=r.exports},485754,(e,r,t)=>{function o(e){return r.exports=o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r.exports.__esModule=!0,r.exports.default=r.exports,o(e)}r.exports=o,r.exports.__esModule=!0,r.exports.default=r.exports},482995,(e,r,t)=>{var o=e.r(485754).default;r.exports=function(e){if(null!=e){var r=e["function"==typeof Symbol&&Symbol.iterator||"@@iterator"],t=0;if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length))return{next:function(){return e&&t>=e.length&&(e=void 0),{value:e&&e[t++],done:!e}}}}throw TypeError(o(e)+" is not iterable")},r.exports.__esModule=!0,r.exports.default=r.exports},213031,(e,r,t)=>{var o=e.r(507290),n=e.r(458629),s=e.r(804252),i=e.r(61982),a=e.r(418973),p=e.r(829915),d=e.r(482995);function u(){"use strict";var e=n(),t=e.m(u),l=(Object.getPrototypeOf?Object.getPrototypeOf(t):t.__proto__).constructor;function c(e){var r="function"==typeof e&&e.constructor;return!!r&&(r===l||"GeneratorFunction"===(r.displayName||r.name))}var f={throw:1,return:2,break:3,continue:3};function x(e){var r,t;return function(o){r||(r={stop:function(){return t(o.a,2)},catch:function(){return o.v},abrupt:function(e,r){return t(o.a,f[e],r)},delegateYield:function(e,n,s){return r.resultName=n,t(o.d,d(e),s)},finish:function(e){return t(o.f,e)}},t=function(e,t,n){o.p=r.prev,o.n=r.next;try{return e(t,n)}finally{r.next=o.n}}),r.resultName&&(r[r.resultName]=o.v,r.resultName=void 0),r.sent=o.v,r.next=o.n;try{return e.call(this,r)}finally{o.p=r.prev,o.n=r.next}}}return(r.exports=u=function(){return{wrap:function(r,t,o,n){return e.w(x(r),t,o,n&&n.reverse())},isGeneratorFunction:c,mark:e.m,awrap:function(e,r){return new o(e,r)},AsyncIterator:a,async:function(e,r,t,o,n){return(c(r)?i:s)(x(e),r,t,o,n)},keys:p,values:d}},r.exports.__esModule=!0,r.exports.default=r.exports)()}r.exports=u,r.exports.__esModule=!0,r.exports.default=r.exports},981415,(e,r,t)=>{var o=e.r(213031)();r.exports=o;try{regeneratorRuntime=o}catch(e){"object"==typeof globalThis?globalThis.regeneratorRuntime=o:Function("r","regeneratorRuntime = r")(o)}},40766,(e,r,t)=>{var o=e.r(485754).default;r.exports=function(e,r){if("object"!=o(e)||!e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var n=t.call(e,r||"default");if("object"!=o(n))return n;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(e)},r.exports.__esModule=!0,r.exports.default=r.exports},491776,(e,r,t)=>{var o=e.r(485754).default,n=e.r(40766);r.exports=function(e){var r=n(e,"string");return"symbol"==o(r)?r:r+""},r.exports.__esModule=!0,r.exports.default=r.exports},72762,(e,r,t)=>{var o=e.r(491776);r.exports=function(e,r,t){return(r=o(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e},r.exports.__esModule=!0,r.exports.default=r.exports},361932,(e,r,t)=>{function o(e,r,t,o,n,s,i){try{var a=e[s](i),p=a.value}catch(e){return void t(e)}a.done?r(p):Promise.resolve(p).then(o,n)}r.exports=function(e){return function(){var r=this,t=arguments;return new Promise(function(n,s){var i=e.apply(r,t);function a(e){o(i,n,s,a,p,"next",e)}function p(e){o(i,n,s,a,p,"throw",e)}a(void 0)})}},r.exports.__esModule=!0,r.exports.default=r.exports},432173,(e,r,t)=>{r.exports=function(e,r){if(!(e instanceof r))throw TypeError("Cannot call a class as a function")},r.exports.__esModule=!0,r.exports.default=r.exports},752046,(e,r,t)=>{var o=e.r(491776);function n(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,o(n.key),n)}}r.exports=function(e,r,t){return r&&n(e.prototype,r),t&&n(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e},r.exports.__esModule=!0,r.exports.default=r.exports},608431,(e,r,t)=>{r.exports=function(e){if(void 0===e)throw ReferenceError("this hasn't been initialised - super() hasn't been called");return e},r.exports.__esModule=!0,r.exports.default=r.exports},313366,(e,r,t)=>{var o=e.r(485754).default,n=e.r(608431);r.exports=function(e,r){if(r&&("object"==o(r)||"function"==typeof r))return r;if(void 0!==r)throw TypeError("Derived constructors may only return object or undefined");return n(e)},r.exports.__esModule=!0,r.exports.default=r.exports},98993,(e,r,t)=>{function o(e){return r.exports=o=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},r.exports.__esModule=!0,r.exports.default=r.exports,o(e)}r.exports=o,r.exports.__esModule=!0,r.exports.default=r.exports},912619,(e,r,t)=>{function o(e,t){return r.exports=o=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,r){return e.__proto__=r,e},r.exports.__esModule=!0,r.exports.default=r.exports,o(e,t)}r.exports=o,r.exports.__esModule=!0,r.exports.default=r.exports},330873,(e,r,t)=>{var o=e.r(912619);r.exports=function(e,r){if("function"!=typeof r&&null!==r)throw TypeError("Super expression must either be null or a function");e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),r&&o(e,r)},r.exports.__esModule=!0,r.exports.default=r.exports},916020,(e,r,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0})},757660,(e,r,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o={};Object.defineProperty(t,"default",{enumerable:!0,get:function(){return s.default}});var n=e.r(916020);Object.keys(n).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(o,e)||e in t&&t[e]===n[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return n[e]}})});var s=function(e,r){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=i(void 0);if(t&&t.has(e))return t.get(e);var o={__proto__:null},n=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var s in e)if("default"!==s&&({}).hasOwnProperty.call(e,s)){var a=n?Object.getOwnPropertyDescriptor(e,s):null;a&&(a.get||a.set)?Object.defineProperty(o,s,a):o[s]=e[s]}return o.default=e,t&&t.set(e,o),o}(e.r(823667));function i(e){if("function"!=typeof WeakMap)return null;var r=new WeakMap,t=new WeakMap;return(i=function(e){return e?t:r})(e)}Object.keys(s).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(o,e)||e in t&&t[e]===s[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return s[e]}})})},814747,(e,r,t)=>{r.exports=e.x("path",()=>require("path"))},522734,(e,r,t)=>{r.exports=e.x("fs",()=>require("fs"))},688947,(e,r,t)=>{r.exports=e.x("stream",()=>require("stream"))},233405,(e,r,t)=>{r.exports=e.x("child_process",()=>require("child_process"))},446786,(e,r,t)=>{r.exports=e.x("os",()=>require("os"))},848782,e=>{"use strict";function r(e,r){return`
    <h2>Order Confirmation</h2>
    <p>Hi ${r},</p>
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
  `}function t(e,r,t){return`
    <h2>Your Order Has Shipped! 📦</h2>
    <p>Hi ${r},</p>
    <p>Great news! Your order #${e.orderNumber} has been shipped and is on its way to you.</p>

    ${t?`
      <div style="background-color: #dbeafe; border: 1px solid #3b82f6; border-radius: 6px; padding: 15px; margin: 20px 0;">
        <strong>Tracking Number:</strong><br>
        <span style="font-family: monospace; font-size: 16px;">${t}</span>
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
  `}function o(e,r){return`
    <h2>Your Order Has Been Delivered! 🎉</h2>
    <p>Hi ${r},</p>
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
  `}function a(e,r){return`
    <h2>New Order Received! 🛍️</h2>
    <p>A new order has been placed on your store.</p>

    <div class="order-details">
      <h3>Order #${e.orderNumber}</h3>
      <div style="margin-bottom: 15px; padding: 10px; background-color: #f9fafb; border-radius: 6px;">
        <strong>Customer Email:</strong> ${r}<br>
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
  `}function p(e,r,t,o){return`
    <h2>New Note on Your Order 📝</h2>
    <p>A note has been added to your order #${e}.</p>

    <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <div style="margin-bottom: 10px; font-size: 12px; color: #1e40af;">
        <strong>${t}</strong> • ${new Date(o).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}
      </div>
      <div style="color: #1e3a8a; line-height: 1.6;">
        ${r}
      </div>
    </div>

    <a href="${process.env.NEXT_PUBLIC_URL||"http://localhost:3000"}/account/orders/${e}" class="button">
      View Order Details
    </a>

    <p>If you have any questions about this note, please contact our support team.</p>
  `}function d(e,r,t,o){return`
    <h2>Refund Request Received 🔄</h2>
    <p>We've received your refund request for order #${e}.</p>

    <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <strong>RMA Number:</strong> ${r}<br>
      <strong>Refund Amount:</strong> $${t}<br>
      <strong>Reason:</strong> ${o}
    </div>

    <p>Our team will review your request and get back to you within 1-2 business days.</p>

    <a href="${process.env.NEXT_PUBLIC_URL||"http://localhost:3000"}/account/orders/${e}" class="button">
      View Order
    </a>

    <p>You can track the status of your refund request in your account.</p>
  `}function u(e,r,t){return`
    <h2>Refund Approved! ✅</h2>
    <p>Great news! Your refund request has been approved.</p>

    <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <strong>Order Number:</strong> ${e}<br>
      <strong>RMA Number:</strong> ${r}<br>
      <strong>Refund Amount:</strong> $${t}
    </div>

    <h3>Next Steps:</h3>
    <ul style="line-height: 1.8;">
      <li>Your refund will be processed within 5-7 business days</li>
      <li>The amount will be credited to your original payment method</li>
      <li>You may need to return the item(s) using the provided RMA number</li>
    </ul>

    <p>Thank you for your patience!</p>
  `}function l(e,r,t){return`
    <h2>Refund Request Update ❌</h2>
    <p>We've reviewed your refund request for order #${e}.</p>

    <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <strong>RMA Number:</strong> ${r}<br>
      <strong>Status:</strong> Not Approved
    </div>

    ${t?`
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 15px 0;">
        <strong>Reason:</strong><br>
        <p style="margin-top: 10px;">${t}</p>
      </div>
    `:""}

    <p>If you have questions about this decision, please contact our support team.</p>

    <a href="${process.env.NEXT_PUBLIC_URL||"http://localhost:3000"}/contact" class="button">
      Contact Support
    </a>
  `}function c(e,r,t){return`
    <h2>Refund Completed! 💰</h2>
    <p>Your refund has been successfully processed.</p>

    <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <strong>Order Number:</strong> ${e}<br>
      <strong>RMA Number:</strong> ${r}<br>
      <strong>Refunded Amount:</strong> $${t}
    </div>

    <p>The refund has been credited to your original payment method. Depending on your bank, it may take 5-10 business days to appear in your account.</p>

    <p>Thank you for shopping with us!</p>
  `}function f(e,r,t,o,n,s,i){return`
    <h2>New Refund Request 🔔</h2>
    <p>A customer has submitted a refund request.</p>

    <div class="order-details">
      <h3>Refund Details</h3>

      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 15px 0;">
        <strong>Order Number:</strong> ${e}<br>
        <strong>RMA Number:</strong> ${r}<br>
        <strong>Refund Amount:</strong> $${n}<br>
        <strong>Reason:</strong> ${s}
      </div>

      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 15px 0;">
        <strong>Customer:</strong> ${t}<br>
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
  `}e.s(["adminNewOrderEmail",()=>a,"adminNewRefundRequestEmail",()=>f,"customerOrderNoteEmail",()=>p,"lowStockAlertEmail",()=>n,"newsletterWelcomeEmail",()=>i,"orderConfirmationEmail",()=>r,"orderDeliveredEmail",()=>o,"orderShippedEmail",()=>t,"refundApprovedEmailCustomer",()=>u,"refundCompletedEmailCustomer",()=>c,"refundRejectedEmailCustomer",()=>l,"refundRequestedEmailCustomer",()=>d,"welcomeEmail",()=>s])}];

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="7a3cba7c-8348-5227-a185-bc9e07ae47a3")}catch(e){}}();
//# sourceMappingURL=%5Broot-of-the-server%5D__62e1fcf4._.js.map
//# debugId=7a3cba7c-8348-5227-a185-bc9e07ae47a3
