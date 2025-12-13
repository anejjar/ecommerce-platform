
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="dfadaaa9-fa87-5065-b4c6-6b0ca54f6750")}catch(e){}}();
module.exports=[596221,404650,a=>{"use strict";let b=(0,a.i(170106).default)("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);a.s(["default",()=>b],404650),a.s(["Loader2",()=>b],596221)},591119,a=>{"use strict";var b=a.i(187924),c=a.i(368114);function d({className:a,...d}){return(0,b.jsx)("div",{"data-slot":"card",className:(0,c.cn)("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6",a),...d})}function e({className:a,...d}){return(0,b.jsx)("div",{"data-slot":"card-header",className:(0,c.cn)("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",a),...d})}function f({className:a,...d}){return(0,b.jsx)("div",{"data-slot":"card-title",className:(0,c.cn)("leading-none font-semibold",a),...d})}function g({className:a,...d}){return(0,b.jsx)("div",{"data-slot":"card-description",className:(0,c.cn)("text-muted-foreground text-sm",a),...d})}function h({className:a,...d}){return(0,b.jsx)("div",{"data-slot":"card-content",className:(0,c.cn)("px-6",a),...d})}function i({className:a,...d}){return(0,b.jsx)("div",{"data-slot":"card-footer",className:(0,c.cn)("flex items-center px-6 [.border-t]:pt-6",a),...d})}a.s(["Card",()=>d,"CardContent",()=>h,"CardDescription",()=>g,"CardFooter",()=>i,"CardHeader",()=>e,"CardTitle",()=>f])},786304,a=>{"use strict";var b=a.i(187924),c=a.i(811011),d=a.i(400187),e=a.i(368114);let f=(0,d.cva)("inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",secondary:"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",destructive:"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"}},defaultVariants:{variant:"default"}});function g({className:a,variant:d,asChild:g=!1,...h}){let i=g?c.Slot:"span";return(0,b.jsx)(i,{"data-slot":"badge",className:(0,e.cn)(f({variant:d}),a),...h})}a.s(["Badge",()=>g])},973365,a=>{"use strict";let b=(0,a.i(170106).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);a.s(["default",()=>b])},400210,a=>{"use strict";var b=a.i(973365);a.s(["ArrowLeft",()=>b.default])},477859,a=>{"use strict";let b=(0,a.i(170106).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);a.s(["default",()=>b])},177156,a=>{"use strict";var b=a.i(477859);a.s(["Eye",()=>b.default])},814574,a=>{"use strict";var b=a.i(187924),c=a.i(897942),d=a.i(422262),e=a.i(368114);function f({...a}){return(0,b.jsx)(c.Root,{"data-slot":"dialog",...a})}function g({...a}){return(0,b.jsx)(c.Trigger,{"data-slot":"dialog-trigger",...a})}function h({...a}){return(0,b.jsx)(c.Portal,{"data-slot":"dialog-portal",...a})}function i({className:a,...d}){return(0,b.jsx)(c.Overlay,{"data-slot":"dialog-overlay",className:(0,e.cn)("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",a),...d})}function j({className:a,children:f,showCloseButton:g=!0,...j}){return(0,b.jsxs)(h,{"data-slot":"dialog-portal",children:[(0,b.jsx)(i,{}),(0,b.jsxs)(c.Content,{"data-slot":"dialog-content",className:(0,e.cn)("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",a),...j,children:[f,g&&(0,b.jsxs)(c.Close,{"data-slot":"dialog-close",className:"ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",children:[(0,b.jsx)(d.XIcon,{}),(0,b.jsx)("span",{className:"sr-only",children:"Close"})]})]})]})}function k({className:a,...c}){return(0,b.jsx)("div",{"data-slot":"dialog-header",className:(0,e.cn)("flex flex-col gap-2 text-center sm:text-left",a),...c})}function l({className:a,...c}){return(0,b.jsx)("div",{"data-slot":"dialog-footer",className:(0,e.cn)("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",a),...c})}function m({className:a,...d}){return(0,b.jsx)(c.Title,{"data-slot":"dialog-title",className:(0,e.cn)("text-lg leading-none font-semibold",a),...d})}function n({className:a,...d}){return(0,b.jsx)(c.Description,{"data-slot":"dialog-description",className:(0,e.cn)("text-muted-foreground text-sm",a),...d})}a.s(["Dialog",()=>f,"DialogContent",()=>j,"DialogDescription",()=>n,"DialogFooter",()=>l,"DialogHeader",()=>k,"DialogTitle",()=>m,"DialogTrigger",()=>g])},915618,516868,a=>{"use strict";let b=(0,a.i(170106).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);a.s(["default",()=>b],516868),a.s(["Plus",()=>b],915618)},104876,a=>{"use strict";let b=(0,a.i(170106).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);a.s(["default",()=>b])},781560,a=>{"use strict";var b=a.i(104876);a.s(["Trash2",()=>b.default])},551120,a=>{"use strict";let b=(0,a.i(170106).default)("lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);a.s(["default",()=>b])},943108,a=>{"use strict";var b=a.i(551120);a.s(["Lock",()=>b.default])},131361,a=>{"use strict";var b=a.i(187924),c=a.i(572131),d=a.i(50944),e=a.i(591119),f=a.i(699570),g=a.i(596221),h=a.i(943108),i=a.i(238246);function j({featureName:a,children:j}){(0,d.useRouter)();let[k,l]=(0,c.useState)(!0),[m,n]=(0,c.useState)(!1);(0,c.useEffect)(()=>{o()},[]);let o=async()=>{try{let b=await fetch(`/api/features/check?feature=${a}`),c=await b.json();n(c.enabled)}catch(a){console.error("Error checking feature:",a),n(!1)}finally{l(!1)}};return k?(0,b.jsx)("div",{className:"flex items-center justify-center h-64",children:(0,b.jsx)(g.Loader2,{className:"h-8 w-8 animate-spin"})}):m?(0,b.jsx)(b.Fragment,{children:j}):(0,b.jsx)("div",{className:"space-y-6",children:(0,b.jsx)(e.Card,{children:(0,b.jsxs)(e.CardContent,{className:"flex flex-col items-center justify-center py-16",children:[(0,b.jsx)(h.Lock,{className:"h-16 w-16 text-muted-foreground mb-4"}),(0,b.jsx)("h3",{className:"text-xl font-semibold mb-2",children:"Feature Not Enabled"}),(0,b.jsx)("p",{className:"text-muted-foreground text-center mb-4 max-w-md",children:"This feature needs to be enabled by a super admin in the feature management page."}),(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsx)(i.default,{href:"/admin/features",children:(0,b.jsx)(f.Button,{children:"Go to Feature Management"})}),(0,b.jsx)(i.default,{href:"/admin/marketing/email-campaigns",children:(0,b.jsx)(f.Button,{variant:"outline",children:"Back to Campaigns"})})]})]})})})}a.s(["FeatureCheck",()=>j])},716121,a=>{"use strict";var b=a.i(187924),c=a.i(572131),d=a.i(591119),e=a.i(699570),f=a.i(786304),g=a.i(915618),h=a.i(400210),i=a.i(177156),j=a.i(781560),k=a.i(596221),l=a.i(104720),m=a.i(406704),n=a.i(238246),o=a.i(131361),p=a.i(814574);let q=[{name:"Welcome Email",category:"transactional",subject:"Welcome to {{store_name}}!",description:"Welcome new customers to your store",htmlContent:`
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
</div>`}];function r(){var a;let r,s,[t,u]=(0,c.useState)([]),[v,w]=(0,c.useState)(!0),[x,y]=(0,c.useState)(null),[z,A]=(0,c.useState)(!1);(0,c.useEffect)(()=>{B()},[]);let B=async()=>{try{let a=await fetch("/api/admin/email-templates");if(!a.ok)throw Error("Failed to fetch templates");let b=await a.json();u(b)}catch(a){console.error("Error fetching templates:",a),m.toast.error("Failed to load templates")}finally{w(!1)}},C=async a=>{try{if(!(await fetch("/api/admin/email-templates",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})).ok)throw Error("Failed to create template");m.toast.success("Template created successfully"),B()}catch(a){m.toast.error("Failed to create template")}},D=async a=>{if(confirm("Are you sure you want to delete this template?"))try{if(!(await fetch(`/api/admin/email-templates/${a}`,{method:"DELETE"})).ok)throw Error("Failed to delete template");m.toast.success("Template deleted"),B()}catch(a){m.toast.error("Failed to delete template")}};return v?(0,b.jsx)("div",{className:"flex items-center justify-center h-64",children:(0,b.jsx)(k.Loader2,{className:"h-8 w-8 animate-spin"})}):(0,b.jsx)(o.FeatureCheck,{featureName:"email_campaigns",children:(0,b.jsxs)("div",{className:"space-y-6",children:[(0,b.jsx)("div",{className:"flex items-center justify-between",children:(0,b.jsxs)("div",{className:"flex items-center gap-4",children:[(0,b.jsx)(n.default,{href:"/admin/marketing/email-campaigns",children:(0,b.jsxs)(e.Button,{variant:"ghost",size:"sm",children:[(0,b.jsx)(h.ArrowLeft,{className:"h-4 w-4 mr-2"}),"Back"]})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-3xl font-bold tracking-tight",children:"Email Templates"}),(0,b.jsx)("p",{className:"text-muted-foreground mt-1",children:"Pre-designed templates for your email campaigns"})]})]})}),(0,b.jsxs)(d.Card,{children:[(0,b.jsxs)(d.CardHeader,{children:[(0,b.jsx)(d.CardTitle,{children:"Pre-built Templates"}),(0,b.jsx)(d.CardDescription,{children:"Start with these professional templates"})]}),(0,b.jsx)(d.CardContent,{children:(0,b.jsx)("div",{className:"grid gap-4 md:grid-cols-2 lg:grid-cols-4",children:q.map((a,c)=>(0,b.jsxs)(d.Card,{className:"overflow-hidden hover:shadow-lg transition-shadow",children:[(0,b.jsx)("div",{className:"h-32 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center",children:(0,b.jsx)(l.FileText,{className:"h-12 w-12 text-white opacity-80"})}),(0,b.jsxs)(d.CardHeader,{children:[(0,b.jsx)(d.CardTitle,{className:"text-base",children:a.name}),(0,b.jsx)(d.CardDescription,{className:"text-xs",children:a.description})]}),(0,b.jsx)(d.CardContent,{children:(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsxs)(e.Button,{size:"sm",variant:"outline",className:"flex-1",onClick:()=>{y(a),A(!0)},children:[(0,b.jsx)(i.Eye,{className:"h-3 w-3 mr-1"}),"Preview"]}),(0,b.jsxs)(e.Button,{size:"sm",className:"flex-1",onClick:()=>C(a),children:[(0,b.jsx)(g.Plus,{className:"h-3 w-3 mr-1"}),"Use"]})]})})]},c))})})]}),(0,b.jsxs)(d.Card,{children:[(0,b.jsxs)(d.CardHeader,{children:[(0,b.jsxs)(d.CardTitle,{children:["Your Templates (",t.length,")"]}),(0,b.jsx)(d.CardDescription,{children:"Manage your saved email templates"})]}),(0,b.jsx)(d.CardContent,{children:0===t.length?(0,b.jsxs)("div",{className:"text-center py-12 text-muted-foreground",children:[(0,b.jsx)(l.FileText,{className:"h-12 w-12 mx-auto mb-4 opacity-50"}),(0,b.jsx)("p",{children:"No templates yet"}),(0,b.jsx)("p",{className:"text-sm",children:"Create a template from the pre-built options above"})]}):(0,b.jsx)("div",{className:"grid gap-4 md:grid-cols-2 lg:grid-cols-3",children:t.map(a=>(0,b.jsxs)(d.Card,{className:"hover:shadow-md transition-shadow",children:[(0,b.jsx)(d.CardHeader,{children:(0,b.jsx)("div",{className:"flex items-start justify-between",children:(0,b.jsxs)("div",{children:[(0,b.jsx)(d.CardTitle,{className:"text-base",children:a.name}),a.category&&(0,b.jsx)(f.Badge,{variant:"outline",className:"mt-2",children:a.category})]})})}),(0,b.jsxs)(d.CardContent,{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground mb-4 line-clamp-2",children:a.description||a.subject}),(0,b.jsx)("div",{className:"flex items-center justify-between text-xs text-muted-foreground mb-4",children:(0,b.jsxs)("span",{children:["Used ",a.usageCount," times"]})}),(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsxs)(e.Button,{size:"sm",variant:"outline",className:"flex-1",onClick:()=>{y(a),A(!0)},children:[(0,b.jsx)(i.Eye,{className:"h-3 w-3 mr-1"}),"Preview"]}),(0,b.jsx)(e.Button,{size:"sm",variant:"ghost",onClick:()=>D(a.id),children:(0,b.jsx)(j.Trash2,{className:"h-3 w-3"})})]})]})]},a.id))})})]}),(0,b.jsx)(p.Dialog,{open:z,onOpenChange:A,children:(0,b.jsxs)(p.DialogContent,{className:"max-w-3xl max-h-[90vh] overflow-y-auto",children:[(0,b.jsxs)(p.DialogHeader,{children:[(0,b.jsx)(p.DialogTitle,{children:x?.name}),(0,b.jsx)(p.DialogDescription,{children:x?.subject})]}),(0,b.jsx)("div",{className:"border rounded-lg p-4 bg-white",children:(0,b.jsx)("div",{dangerouslySetInnerHTML:{__html:(a=x?.htmlContent||"",r={store_name:"My Store",customer_name:"John Doe",order_number:"ORD-12345",order_date:new Date().toLocaleDateString(),order_total:"149.99",order_url:"#",shop_url:"#",year:new Date().getFullYear().toString(),month:new Date().toLocaleDateString("en-US",{month:"long"}),blog_title:"How to Choose the Perfect Product",blog_url:"#",sale_name:"Summer Sale",discount:"50",sale_end_date:new Date(Date.now()+6048e5).toLocaleDateString(),coupon_code:"SAVE50",unsubscribe_url:"#"},s=a,Object.entries(r).forEach(([a,b])=>{s=s.replace(RegExp(`\\{\\{${a}\\}\\}`,"g"),b)}),s)}})})]})})]})})}a.s(["default",()=>r])}];

//# sourceMappingURL=_770f42c3._.js.map
//# debugId=dfadaaa9-fa87-5065-b4c6-6b0ca54f6750
