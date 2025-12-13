(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,531278,717521,e=>{"use strict";let t=(0,e.i(475254).default)("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);e.s(["default",()=>t],717521),e.s(["Loader2",()=>t],531278)},515288,e=>{"use strict";var t=e.i(843476),a=e.i(975157);function r({className:e,...r}){return(0,t.jsx)("div",{"data-slot":"card",className:(0,a.cn)("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6",e),...r})}function s({className:e,...r}){return(0,t.jsx)("div",{"data-slot":"card-header",className:(0,a.cn)("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",e),...r})}function i({className:e,...r}){return(0,t.jsx)("div",{"data-slot":"card-title",className:(0,a.cn)("leading-none font-semibold",e),...r})}function n({className:e,...r}){return(0,t.jsx)("div",{"data-slot":"card-description",className:(0,a.cn)("text-muted-foreground text-sm",e),...r})}function o({className:e,...r}){return(0,t.jsx)("div",{"data-slot":"card-content",className:(0,a.cn)("px-6",e),...r})}function l({className:e,...r}){return(0,t.jsx)("div",{"data-slot":"card-footer",className:(0,a.cn)("flex items-center px-6 [.border-t]:pt-6",e),...r})}e.s(["Card",()=>r,"CardContent",()=>o,"CardDescription",()=>n,"CardFooter",()=>l,"CardHeader",()=>s,"CardTitle",()=>i])},487486,e=>{"use strict";var t=e.i(843476),a=e.i(991918),r=e.i(225913),s=e.i(975157);let i=(0,r.cva)("inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",secondary:"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",destructive:"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"}},defaultVariants:{variant:"default"}});function n({className:e,variant:r,asChild:n=!1,...o}){let l=n?a.Slot:"span";return(0,t.jsx)(l,{"data-slot":"badge",className:(0,s.cn)(i({variant:r}),e),...o})}e.s(["Badge",()=>n])},180127,e=>{"use strict";let t=(0,e.i(475254).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["default",()=>t])},871689,e=>{"use strict";var t=e.i(180127);e.s(["ArrowLeft",()=>t.default])},187942,e=>{"use strict";let t=(0,e.i(475254).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["default",()=>t])},286536,e=>{"use strict";var t=e.i(187942);e.s(["Eye",()=>t.default])},776639,e=>{"use strict";var t=e.i(843476),a=e.i(326999),r=e.i(995926),s=e.i(975157);function i({...e}){return(0,t.jsx)(a.Root,{"data-slot":"dialog",...e})}function n({...e}){return(0,t.jsx)(a.Trigger,{"data-slot":"dialog-trigger",...e})}function o({...e}){return(0,t.jsx)(a.Portal,{"data-slot":"dialog-portal",...e})}function l({className:e,...r}){return(0,t.jsx)(a.Overlay,{"data-slot":"dialog-overlay",className:(0,s.cn)("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",e),...r})}function d({className:e,children:i,showCloseButton:n=!0,...d}){return(0,t.jsxs)(o,{"data-slot":"dialog-portal",children:[(0,t.jsx)(l,{}),(0,t.jsxs)(a.Content,{"data-slot":"dialog-content",className:(0,s.cn)("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",e),...d,children:[i,n&&(0,t.jsxs)(a.Close,{"data-slot":"dialog-close",className:"ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",children:[(0,t.jsx)(r.XIcon,{}),(0,t.jsx)("span",{className:"sr-only",children:"Close"})]})]})]})}function c({className:e,...a}){return(0,t.jsx)("div",{"data-slot":"dialog-header",className:(0,s.cn)("flex flex-col gap-2 text-center sm:text-left",e),...a})}function p({className:e,...a}){return(0,t.jsx)("div",{"data-slot":"dialog-footer",className:(0,s.cn)("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",e),...a})}function u({className:e,...r}){return(0,t.jsx)(a.Title,{"data-slot":"dialog-title",className:(0,s.cn)("text-lg leading-none font-semibold",e),...r})}function m({className:e,...r}){return(0,t.jsx)(a.Description,{"data-slot":"dialog-description",className:(0,s.cn)("text-muted-foreground text-sm",e),...r})}e.s(["Dialog",()=>i,"DialogContent",()=>d,"DialogDescription",()=>m,"DialogFooter",()=>p,"DialogHeader",()=>c,"DialogTitle",()=>u,"DialogTrigger",()=>n])},107233,603908,e=>{"use strict";let t=(0,e.i(475254).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["default",()=>t],603908),e.s(["Plus",()=>t],107233)},612329,e=>{"use strict";let t=(0,e.i(475254).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);e.s(["default",()=>t])},727612,e=>{"use strict";var t=e.i(612329);e.s(["Trash2",()=>t.default])},517302,e=>{"use strict";let t=(0,e.i(475254).default)("lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);e.s(["default",()=>t])},270756,e=>{"use strict";var t=e.i(517302);e.s(["Lock",()=>t.default])},405782,e=>{"use strict";var t=e.i(843476),a=e.i(271645),r=e.i(618566),s=e.i(515288),i=e.i(519455),n=e.i(531278),o=e.i(270756),l=e.i(522016);function d({featureName:e,children:d}){(0,r.useRouter)();let[c,p]=(0,a.useState)(!0),[u,m]=(0,a.useState)(!1);(0,a.useEffect)(()=>{h()},[]);let h=async()=>{try{let t=await fetch(`/api/features/check?feature=${e}`),a=await t.json();m(a.enabled)}catch(e){console.error("Error checking feature:",e),m(!1)}finally{p(!1)}};return c?(0,t.jsx)("div",{className:"flex items-center justify-center h-64",children:(0,t.jsx)(n.Loader2,{className:"h-8 w-8 animate-spin"})}):u?(0,t.jsx)(t.Fragment,{children:d}):(0,t.jsx)("div",{className:"space-y-6",children:(0,t.jsx)(s.Card,{children:(0,t.jsxs)(s.CardContent,{className:"flex flex-col items-center justify-center py-16",children:[(0,t.jsx)(o.Lock,{className:"h-16 w-16 text-muted-foreground mb-4"}),(0,t.jsx)("h3",{className:"text-xl font-semibold mb-2",children:"Feature Not Enabled"}),(0,t.jsx)("p",{className:"text-muted-foreground text-center mb-4 max-w-md",children:"This feature needs to be enabled by a super admin in the feature management page."}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)(l.default,{href:"/admin/features",children:(0,t.jsx)(i.Button,{children:"Go to Feature Management"})}),(0,t.jsx)(l.default,{href:"/admin/marketing/email-campaigns",children:(0,t.jsx)(i.Button,{variant:"outline",children:"Back to Campaigns"})})]})]})})})}e.s(["FeatureCheck",()=>d])},625316,e=>{"use strict";var t=e.i(843476),a=e.i(271645),r=e.i(515288),s=e.i(519455),i=e.i(487486),n=e.i(107233),o=e.i(871689),l=e.i(286536),d=e.i(727612),c=e.i(531278),p=e.i(178583),u=e.i(705766),m=e.i(522016),h=e.i(405782),x=e.i(776639);let g=[{name:"Welcome Email",category:"transactional",subject:"Welcome to {{store_name}}!",description:"Welcome new customers to your store",htmlContent:`
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
    <h1 style="color: white; margin: 0;">Welcome to Our Store!</h1>
  </div>
  <div style="padding: 40px; background: #f8f9fa;">
    <h2>Hi {{customer_name}},</h2>
    <p style="font-size: 16px; line-height: 1.6;">
      Thank you for joining our community! We're thrilled to have you here.
    </p>
    <p style="font-size: 16px; line-height: 1.6;">
      As a welcome gift, here's a special discount code just for you:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
        WELCOME10
      </div>
      <p style="margin-top: 10px; color: #666;">10% off your first order</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{shop_url}}" style="background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Start Shopping
      </a>
    </div>
    <p style="color: #666; font-size: 14px;">
      If you have any questions, feel free to reach out to our support team.
    </p>
  </div>
  <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
    <p>\xa9 {{year}} {{store_name}}. All rights reserved.</p>
  </div>
</div>`},{name:"Order Confirmation",category:"transactional",subject:"Order Confirmation - #{{order_number}}",description:"Confirm customer orders with details",htmlContent:`
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #2563eb; padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
  </div>
  <div style="padding: 40px;">
    <p style="font-size: 16px;">Hi {{customer_name}},</p>
    <p style="font-size: 16px; line-height: 1.6;">
      Thank you for your order! We've received your order and it's being processed.
    </p>
    <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
      <h3 style="margin-top: 0;">Order #{{order_number}}</h3>
      <p><strong>Order Date:</strong> {{order_date}}</p>
      <p><strong>Total:</strong> $ {{order_total}}</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{order_url}}" style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
        View Order Details
      </a>
    </div>
  </div>
  <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
    <p>\xa9 {{year}} {{store_name}}</p>
  </div>
</div>`},{name:"Newsletter",category:"newsletter",subject:"{{month}} Newsletter - New Products & Updates",description:"Monthly newsletter template",htmlContent:`
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #10b981; padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0;">{{month}} Newsletter</h1>
    <p style="color: white; opacity: 0.9;">Catch up on what's new!</p>
  </div>
  <div style="padding: 40px;">
    <h2>What's New This Month</h2>
    <p style="font-size: 16px; line-height: 1.6;">
      We've been busy! Here's what's happening at {{store_name}}.
    </p>

    <div style="margin: 30px 0;">
      <h3>New Products</h3>
      <p>Check out our latest additions to the store...</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="{{shop_url}}" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Shop New Arrivals
        </a>
      </div>
    </div>

    <div style="margin: 30px 0;">
      <h3>Featured Blog Post</h3>
      <p>Read our latest article: {{blog_title}}</p>
      <a href="{{blog_url}}" style="color: #10b981;">Read More →</a>
    </div>
  </div>
  <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
    <p>\xa9 {{year}} {{store_name}}</p>
    <a href="{{unsubscribe_url}}" style="color: #999;">Unsubscribe</a>
  </div>
</div>`},{name:"Promotional Sale",category:"promotional",subject:"🎉 {{sale_name}} - Up to {{discount}}% Off!",description:"Promotional sale announcement",htmlContent:`
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 50px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 36px;">{{sale_name}}</h1>
    <p style="color: white; font-size: 24px; margin: 10px 0;">Up to {{discount}}% OFF</p>
    <p style="color: white; opacity: 0.9;">Limited Time Only!</p>
  </div>
  <div style="padding: 40px; text-align: center;">
    <h2>Don't Miss Out!</h2>
    <p style="font-size: 18px; line-height: 1.6;">
      Our biggest sale of the season is here. Shop now before it's gone!
    </p>
    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; text-align: left;">
      <strong>Sale Ends:</strong> {{sale_end_date}}
    </div>
    <div style="margin: 30px 0;">
      <a href="{{shop_url}}" style="background: #f5576c; color: white; padding: 18px 50px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 18px; font-weight: bold;">
        Shop Now
      </a>
    </div>
    <p style="color: #666; font-size: 14px;">
      Use code <strong>{{coupon_code}}</strong> at checkout
    </p>
  </div>
  <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
    <p>\xa9 {{year}} {{store_name}}</p>
  </div>
</div>`}];function f(){var e;let f,y,[v,b]=(0,a.useState)([]),[j,w]=(0,a.useState)(!0),[N,C]=(0,a.useState)(null),[k,_]=(0,a.useState)(!1);(0,a.useEffect)(()=>{D()},[]);let D=async()=>{try{let e=await fetch("/api/admin/email-templates");if(!e.ok)throw Error("Failed to fetch templates");let t=await e.json();b(t)}catch(e){console.error("Error fetching templates:",e),u.toast.error("Failed to load templates")}finally{w(!1)}},T=async e=>{try{if(!(await fetch("/api/admin/email-templates",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).ok)throw Error("Failed to create template");u.toast.success("Template created successfully"),D()}catch(e){u.toast.error("Failed to create template")}},z=async e=>{if(confirm("Are you sure you want to delete this template?"))try{if(!(await fetch(`/api/admin/email-templates/${e}`,{method:"DELETE"})).ok)throw Error("Failed to delete template");u.toast.success("Template deleted"),D()}catch(e){u.toast.error("Failed to delete template")}};return j?(0,t.jsx)("div",{className:"flex items-center justify-center h-64",children:(0,t.jsx)(c.Loader2,{className:"h-8 w-8 animate-spin"})}):(0,t.jsx)(h.FeatureCheck,{featureName:"email_campaigns",children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsx)("div",{className:"flex items-center justify-between",children:(0,t.jsxs)("div",{className:"flex items-center gap-4",children:[(0,t.jsx)(m.default,{href:"/admin/marketing/email-campaigns",children:(0,t.jsxs)(s.Button,{variant:"ghost",size:"sm",children:[(0,t.jsx)(o.ArrowLeft,{className:"h-4 w-4 mr-2"}),"Back"]})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-bold tracking-tight",children:"Email Templates"}),(0,t.jsx)("p",{className:"text-muted-foreground mt-1",children:"Pre-designed templates for your email campaigns"})]})]})}),(0,t.jsxs)(r.Card,{children:[(0,t.jsxs)(r.CardHeader,{children:[(0,t.jsx)(r.CardTitle,{children:"Pre-built Templates"}),(0,t.jsx)(r.CardDescription,{children:"Start with these professional templates"})]}),(0,t.jsx)(r.CardContent,{children:(0,t.jsx)("div",{className:"grid gap-4 md:grid-cols-2 lg:grid-cols-4",children:g.map((e,a)=>(0,t.jsxs)(r.Card,{className:"overflow-hidden hover:shadow-lg transition-shadow",children:[(0,t.jsx)("div",{className:"h-32 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center",children:(0,t.jsx)(p.FileText,{className:"h-12 w-12 text-white opacity-80"})}),(0,t.jsxs)(r.CardHeader,{children:[(0,t.jsx)(r.CardTitle,{className:"text-base",children:e.name}),(0,t.jsx)(r.CardDescription,{className:"text-xs",children:e.description})]}),(0,t.jsx)(r.CardContent,{children:(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsxs)(s.Button,{size:"sm",variant:"outline",className:"flex-1",onClick:()=>{C(e),_(!0)},children:[(0,t.jsx)(l.Eye,{className:"h-3 w-3 mr-1"}),"Preview"]}),(0,t.jsxs)(s.Button,{size:"sm",className:"flex-1",onClick:()=>T(e),children:[(0,t.jsx)(n.Plus,{className:"h-3 w-3 mr-1"}),"Use"]})]})})]},a))})})]}),(0,t.jsxs)(r.Card,{children:[(0,t.jsxs)(r.CardHeader,{children:[(0,t.jsxs)(r.CardTitle,{children:["Your Templates (",v.length,")"]}),(0,t.jsx)(r.CardDescription,{children:"Manage your saved email templates"})]}),(0,t.jsx)(r.CardContent,{children:0===v.length?(0,t.jsxs)("div",{className:"text-center py-12 text-muted-foreground",children:[(0,t.jsx)(p.FileText,{className:"h-12 w-12 mx-auto mb-4 opacity-50"}),(0,t.jsx)("p",{children:"No templates yet"}),(0,t.jsx)("p",{className:"text-sm",children:"Create a template from the pre-built options above"})]}):(0,t.jsx)("div",{className:"grid gap-4 md:grid-cols-2 lg:grid-cols-3",children:v.map(e=>(0,t.jsxs)(r.Card,{className:"hover:shadow-md transition-shadow",children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsx)("div",{className:"flex items-start justify-between",children:(0,t.jsxs)("div",{children:[(0,t.jsx)(r.CardTitle,{className:"text-base",children:e.name}),e.category&&(0,t.jsx)(i.Badge,{variant:"outline",className:"mt-2",children:e.category})]})})}),(0,t.jsxs)(r.CardContent,{children:[(0,t.jsx)("p",{className:"text-sm text-muted-foreground mb-4 line-clamp-2",children:e.description||e.subject}),(0,t.jsx)("div",{className:"flex items-center justify-between text-xs text-muted-foreground mb-4",children:(0,t.jsxs)("span",{children:["Used ",e.usageCount," times"]})}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsxs)(s.Button,{size:"sm",variant:"outline",className:"flex-1",onClick:()=>{C(e),_(!0)},children:[(0,t.jsx)(l.Eye,{className:"h-3 w-3 mr-1"}),"Preview"]}),(0,t.jsx)(s.Button,{size:"sm",variant:"ghost",onClick:()=>z(e.id),children:(0,t.jsx)(d.Trash2,{className:"h-3 w-3"})})]})]})]},e.id))})})]}),(0,t.jsx)(x.Dialog,{open:k,onOpenChange:_,children:(0,t.jsxs)(x.DialogContent,{className:"max-w-3xl max-h-[90vh] overflow-y-auto",children:[(0,t.jsxs)(x.DialogHeader,{children:[(0,t.jsx)(x.DialogTitle,{children:N?.name}),(0,t.jsx)(x.DialogDescription,{children:N?.subject})]}),(0,t.jsx)("div",{className:"border rounded-lg p-4 bg-white",children:(0,t.jsx)("div",{dangerouslySetInnerHTML:{__html:(e=N?.htmlContent||"",f={store_name:"My Store",customer_name:"John Doe",order_number:"ORD-12345",order_date:new Date().toLocaleDateString(),order_total:"149.99",order_url:"#",shop_url:"#",year:new Date().getFullYear().toString(),month:new Date().toLocaleDateString("en-US",{month:"long"}),blog_title:"How to Choose the Perfect Product",blog_url:"#",sale_name:"Summer Sale",discount:"50",sale_end_date:new Date(Date.now()+6048e5).toLocaleDateString(),coupon_code:"SAVE50",unsubscribe_url:"#"},y=e,Object.entries(f).forEach(([e,t])=>{y=y.replace(RegExp(`\\{\\{${e}\\}\\}`,"g"),t)}),y)}})})]})})]})})}e.s(["default",()=>f])}]);
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="9487ab5c-108a-5dc3-83b1-079e649a57bf")}catch(e){}}();
//# debugId=9487ab5c-108a-5dc3-83b1-079e649a57bf
