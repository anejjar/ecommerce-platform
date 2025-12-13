(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,72057,e=>{"use strict";var t=e.i(843476),i=e.i(271645),o=e.i(618566),r=e.i(519455),a=e.i(515288),n=e.i(487486),l=e.i(107233),s=e.i(178583),d=e.i(263488),p=e.i(488844),c=e.i(688511),f=e.i(727612),g=e.i(174886),h=e.i(705766),m=e.i(522016),x=e.i(776639),u=e.i(793479),y=e.i(110204),b=e.i(624687),w=e.i(629288),v=e.i(283086),z=e.i(39312);let N={INVOICE:[{id:"invoice-classic",name:"Classic Invoice",description:"Traditional professional invoice with clean layout",preview:"Clean and professional design with company branding",content:JSON.stringify({format:"A4",orientation:"portrait",title:"INVOICE",primaryColor:"#1a202c",secondaryColor:"#4a5568",accentColor:"#3182ce",header:{logo:"{{store.logo}}",companyName:"{{store.name}}",companyAddress:"{{store.address}}",companyPhone:"{{store.phone}}",companyEmail:"{{store.email}}",showLogo:!0},invoiceInfo:{invoiceNumber:"{{order.number}}",invoiceDate:"{{order.date}}",dueDate:"{{order.dueDate}}",status:"{{order.status}}"},billTo:{title:"Bill To",name:"{{billing.name}}",address1:"{{billing.address1}}",address2:"{{billing.address2}}",city:"{{billing.city}}",state:"{{billing.state}}",zip:"{{billing.zip}}",country:"{{billing.country}}"},shipTo:{title:"Ship To",name:"{{shipping.name}}",address1:"{{shipping.address1}}",address2:"{{shipping.address2}}",city:"{{shipping.city}}",state:"{{shipping.state}}",zip:"{{shipping.zip}}",country:"{{shipping.country}}"},items:{headers:["Item","SKU","Quantity","Unit Price","Total"],showSku:!0,showDescription:!0},totals:{subtotal:"{{order.subtotal}}",tax:"{{order.tax}}",shipping:"{{order.shipping}}",discount:"{{order.discount}}",total:"{{order.total}}"},footer:{notes:"{{order.notes}}",thankYouMessage:"Thank you for your business!",paymentInstructions:"Payment is due within 30 days. Please include invoice number with payment."},style:{font:"Helvetica",fontSize:10,headerFontSize:24,showBorders:!0,alternateRowColors:!0}},null,2)},{id:"invoice-modern",name:"Modern Invoice",description:"Contemporary design with bold colors and modern typography",preview:"Sleek modern design with accent colors",content:JSON.stringify({format:"A4",orientation:"portrait",title:"INVOICE",primaryColor:"#6366f1",secondaryColor:"#8b5cf6",accentColor:"#ec4899",header:{logo:"{{store.logo}}",companyName:"{{store.name}}",companyEmail:"{{store.email}}",companyPhone:"{{store.phone}}",companyWebsite:"{{store.url}}",showLogo:!0,style:"gradient"},invoiceInfo:{invoiceNumber:"{{order.number}}",invoiceDate:"{{order.date}}",status:"{{order.status}}",layout:"modern"},billTo:{title:"Billing Information",name:"{{customer.name}}",email:"{{customer.email}}",address:"{{billing.address1}}, {{billing.city}}, {{billing.state}} {{billing.zip}}",country:"{{billing.country}}"},shipTo:{title:"Shipping Address",name:"{{shipping.name}}",address:"{{shipping.address1}}, {{shipping.city}}, {{shipping.state}} {{shipping.zip}}",phone:"{{shipping.phone}}"},items:{headers:["Description","Qty","Price","Amount"],showSku:!1,showDescription:!0,style:"modern"},totals:{subtotal:"{{order.subtotal}}",tax:"{{order.tax}}",shipping:"{{order.shipping}}",total:"{{order.total}}",layout:"side-by-side"},footer:{thankYouMessage:"We appreciate your business!",contactInfo:"Questions? Contact us at {{store.email}}"},style:{font:"Helvetica",fontSize:10,headerFontSize:28,showBorders:!1,alternateRowColors:!1,roundedCorners:!0}},null,2)},{id:"invoice-minimal",name:"Minimal Invoice",description:"Clean minimalist design focused on clarity",preview:"Simple, elegant design with maximum readability",content:JSON.stringify({format:"A4",orientation:"portrait",title:"Invoice",primaryColor:"#000000",secondaryColor:"#666666",accentColor:"#000000",header:{companyName:"{{store.name}}",companyEmail:"{{store.email}}",showLogo:!1,style:"minimal"},invoiceInfo:{invoiceNumber:"{{order.number}}",invoiceDate:"{{order.date}}",layout:"compact"},billTo:{title:"To",name:"{{customer.name}}",email:"{{customer.email}}"},items:{headers:["Item","Qty","Price","Total"],showSku:!1,showDescription:!1},totals:{subtotal:"{{order.subtotal}}",tax:"{{order.tax}}",total:"{{order.total}}",layout:"right-aligned"},footer:{thankYouMessage:"Thank you"},style:{font:"Helvetica",fontSize:9,headerFontSize:20,showBorders:!1,alternateRowColors:!1,spacing:"compact"}},null,2)}],PACKING_SLIP:[{id:"packing-standard",name:"Standard Packing Slip",description:"Clear warehouse-friendly packing slip",preview:"Easy-to-read format for warehouse operations",content:JSON.stringify({format:"A4",orientation:"portrait",title:"PACKING SLIP",primaryColor:"#000000",header:{companyName:"{{store.name}}",orderNumber:"{{order.number}}",orderDate:"{{order.date}}",fontSize:16},shipTo:{title:"SHIP TO",name:"{{shipping.name}}",address1:"{{shipping.address1}}",address2:"{{shipping.address2}}",city:"{{shipping.city}}",state:"{{shipping.state}}",zip:"{{shipping.zip}}",country:"{{shipping.country}}",phone:"{{shipping.phone}}"},items:{headers:["Item","SKU","Quantity","Picked"],showSku:!0,showCheckbox:!0,checkboxStyle:"[ ]",largeText:!0},footer:{notes:"{{order.notes}}",instructions:"Please verify all items before sealing package",signature:{show:!0,label:"Packed By: _______________  Date: _______________"}},style:{font:"Courier",fontSize:11,headerFontSize:18,showBorders:!0,spacing:"wide"}},null,2)},{id:"packing-detailed",name:"Detailed Packing Slip",description:"Comprehensive slip with product details",preview:"Includes product descriptions and special instructions",content:JSON.stringify({format:"A4",orientation:"portrait",title:"PACKING SLIP",primaryColor:"#1a202c",header:{logo:"{{store.logo}}",companyName:"{{store.name}}",orderNumber:"{{order.number}}",orderDate:"{{order.date}}",showBarcode:!0},shipTo:{title:"Shipping Address",name:"{{shipping.name}}",address1:"{{shipping.address1}}",address2:"{{shipping.address2}}",city:"{{shipping.city}}",state:"{{shipping.state}}",zip:"{{shipping.zip}}",country:"{{shipping.country}}",phone:"{{shipping.phone}}",email:"{{customer.email}}"},items:{headers:["Product","SKU","Description","Qty","Location","Status"],showSku:!0,showDescription:!0,showLocation:!0,showCheckbox:!0},summary:{totalItems:!0,totalQuantity:!0},footer:{notes:"{{order.notes}}",qualityCheck:{show:!0,label:"Quality Check: _______________"},signature:{show:!0,label:"Packed By: _______________  Verified By: _______________"}},style:{font:"Helvetica",fontSize:10,headerFontSize:16,showBorders:!0,alternateRowColors:!0}},null,2)}],EMAIL_TRANSACTIONAL:[{id:"email-order-confirmation",name:"Order Confirmation",description:"Welcome email sent after order is placed",preview:"Professional order confirmation with order details",content:`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Thank You for Your Order!</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Order #{{order.number}}</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                Hi {{customer.firstName}},
              </p>
              <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                We've received your order and it's being processed. We'll send you a shipping notification as soon as your items are on their way!
              </p>

              <!-- Order Summary Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin: 30px 0;">
                <tr>
                  <td>
                    <h2 style="color: #333333; font-size: 18px; margin: 0 0 15px 0;">Order Summary</h2>
                    <table width="100%" cellpadding="5" cellspacing="0">
                      <tr>
                        <td style="color: #666666; font-size: 14px;">Order Date:</td>
                        <td align="right" style="color: #333333; font-size: 14px; font-weight: bold;">{{order.date}}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px;">Order Number:</td>
                        <td align="right" style="color: #333333; font-size: 14px; font-weight: bold;">{{order.number}}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px;">Payment Method:</td>
                        <td align="right" style="color: #333333; font-size: 14px; font-weight: bold;">{{payment.method}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Items -->
              <h2 style="color: #333333; font-size: 18px; margin: 30px 0 15px 0;">Order Items</h2>
              <table width="100%" cellpadding="10" cellspacing="0" style="border-top: 2px solid #e0e0e0; border-bottom: 2px solid #e0e0e0;">
                {{#each items}}
                <tr style="border-bottom: 1px solid #f0f0f0;">
                  <td style="color: #333333; font-size: 14px; padding: 15px 0;">
                    <strong>{{items.name}}</strong><br>
                    <span style="color: #666666; font-size: 12px;">SKU: {{items.sku}}</span>
                  </td>
                  <td align="center" style="color: #666666; font-size: 14px; padding: 15px 0;">
                    Qty: {{items.quantity}}
                  </td>
                  <td align="right" style="color: #333333; font-size: 14px; padding: 15px 0; font-weight: bold;">
                    {{items.total}}
                  </td>
                </tr>
                {{/each}}
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="5" cellspacing="0" style="margin: 20px 0;">
                <tr>
                  <td style="color: #666666; font-size: 14px;">Subtotal:</td>
                  <td align="right" style="color: #333333; font-size: 14px;">{{order.subtotal}}</td>
                </tr>
                <tr>
                  <td style="color: #666666; font-size: 14px;">Shipping:</td>
                  <td align="right" style="color: #333333; font-size: 14px;">{{order.shipping}}</td>
                </tr>
                <tr>
                  <td style="color: #666666; font-size: 14px;">Tax:</td>
                  <td align="right" style="color: #333333; font-size: 14px;">{{order.tax}}</td>
                </tr>
                <tr style="border-top: 2px solid #333333;">
                  <td style="color: #333333; font-size: 18px; font-weight: bold; padding-top: 10px;">Total:</td>
                  <td align="right" style="color: #667eea; font-size: 18px; font-weight: bold; padding-top: 10px;">{{order.total}}</td>
                </tr>
              </table>

              <!-- Shipping Address -->
              <h2 style="color: #333333; font-size: 18px; margin: 30px 0 15px 0;">Shipping Address</h2>
              <p style="color: #666666; font-size: 14px; line-height: 22px; margin: 0;">
                {{shipping.name}}<br>
                {{shipping.address1}}<br>
                {{shipping.address2}}<br>
                {{shipping.city}}, {{shipping.state}} {{shipping.zip}}<br>
                {{shipping.country}}
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="{{store.url}}/account/orders/{{order.id}}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: bold;">View Order Details</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                Questions? Contact us at <a href="mailto:{{store.email}}" style="color: #667eea; text-decoration: none;">{{store.email}}</a>
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                {{store.name}} | {{store.phone}}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`},{id:"email-shipping-notification",name:"Shipping Notification",description:"Email sent when order ships with tracking info",preview:"Professional shipping notification with tracking details",content:`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Order Has Shipped</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">

          <!-- Header with Icon -->
          <tr>
            <td style="background-color: #10b981; padding: 40px 30px; text-align: center;">
              <div style="background-color: #ffffff; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">📦</span>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Your Order is On Its Way!</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Order #{{order.number}}</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                Hi {{customer.firstName}},
              </p>
              <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                Great news! Your order has been shipped and is on its way to you. You can track your package using the information below.
              </p>

              <!-- Tracking Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 8px; padding: 25px; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0; opacity: 0.9;">Tracking Number</p>
                    <p style="color: #ffffff; font-size: 24px; font-weight: bold; margin: 0 0 20px 0; letter-spacing: 2px;">{{order.trackingNumber}}</p>
                    <a href="{{order.trackingUrl}}" style="display: inline-block; background-color: #ffffff; color: #10b981; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-size: 14px; font-weight: bold;">Track Package</a>
                  </td>
                </tr>
              </table>

              <!-- Shipping Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin: 30px 0;">
                <tr>
                  <td>
                    <h3 style="color: #333333; font-size: 16px; margin: 0 0 15px 0;">Shipping Details</h3>
                    <table width="100%" cellpadding="5" cellspacing="0">
                      <tr>
                        <td style="color: #666666; font-size: 14px;">Carrier:</td>
                        <td align="right" style="color: #333333; font-size: 14px; font-weight: bold;">{{order.carrier}}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px;">Shipped Date:</td>
                        <td align="right" style="color: #333333; font-size: 14px; font-weight: bold;">{{order.shippedDate}}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px;">Estimated Delivery:</td>
                        <td align="right" style="color: #333333; font-size: 14px; font-weight: bold;">{{order.estimatedDelivery}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Items Shipped -->
              <h3 style="color: #333333; font-size: 16px; margin: 30px 0 15px 0;">Items in This Shipment</h3>
              <table width="100%" cellpadding="10" cellspacing="0">
                {{#each items}}
                <tr style="border-bottom: 1px solid #e0e0e0;">
                  <td style="color: #333333; font-size: 14px;">
                    <strong>{{items.name}}</strong>
                  </td>
                  <td align="right" style="color: #666666; font-size: 14px;">
                    Qty: {{items.quantity}}
                  </td>
                </tr>
                {{/each}}
              </table>

              <!-- Delivery Address -->
              <h3 style="color: #333333; font-size: 16px; margin: 30px 0 15px 0;">Delivery Address</h3>
              <p style="color: #666666; font-size: 14px; line-height: 22px; margin: 0;">
                {{shipping.name}}<br>
                {{shipping.address1}}<br>
                {{shipping.city}}, {{shipping.state}} {{shipping.zip}}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                Need help? Contact us at <a href="mailto:{{store.email}}" style="color: #10b981; text-decoration: none;">{{store.email}}</a>
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                {{store.name}}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`},{id:"email-order-cancelled",name:"Order Cancellation",description:"Email sent when order is cancelled",preview:"Professional cancellation notification with refund details",content:`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Cancelled</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">

          <tr>
            <td style="background-color: #ef4444; padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Order Cancelled</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Order #{{order.number}}</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                Hi {{customer.firstName}},
              </p>
              <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                Your order has been cancelled as requested. If you paid for this order, a refund will be processed to your original payment method within 5-7 business days.
              </p>

              <!-- Refund Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 30px 0;">
                <tr>
                  <td>
                    <h3 style="color: #991b1b; font-size: 16px; margin: 0 0 10px 0;">Refund Information</h3>
                    <p style="color: #7f1d1d; font-size: 14px; margin: 0; line-height: 22px;">
                      Amount: <strong>{{order.total}}</strong><br>
                      Payment Method: {{payment.method}}<br>
                      Processing Time: 5-7 business days
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Order Details -->
              <h3 style="color: #333333; font-size: 16px; margin: 30px 0 15px 0;">Cancelled Order Details</h3>
              <table width="100%" cellpadding="10" cellspacing="0" style="border: 1px solid #e0e0e0; border-radius: 6px;">
                {{#each items}}
                <tr style="border-bottom: 1px solid #f0f0f0;">
                  <td style="color: #333333; font-size: 14px;">{{items.name}}</td>
                  <td align="right" style="color: #666666; font-size: 14px;">Qty: {{items.quantity}}</td>
                  <td align="right" style="color: #333333; font-size: 14px;">{{items.total}}</td>
                </tr>
                {{/each}}
              </table>

              <p style="color: #666666; font-size: 14px; margin: 30px 0 0 0;">
                If you have any questions about this cancellation, please don't hesitate to contact us.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                Questions? Contact us at <a href="mailto:{{store.email}}" style="color: #ef4444; text-decoration: none;">{{store.email}}</a>
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">{{store.name}}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`}],EMAIL_MARKETING:[{id:"email-newsletter",name:"Newsletter",description:"Modern newsletter template for updates and news",preview:"Clean newsletter design with featured content sections",content:`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">

          <!-- Header with Logo -->
          <tr>
            <td style="padding: 30px; text-align: center; border-bottom: 3px solid #667eea;">
              <h1 style="color: #667eea; margin: 0; font-size: 32px; font-weight: bold;">{{store.name}}</h1>
              <p style="color: #666666; margin: 10px 0 0 0; font-size: 14px;">Your Monthly Newsletter</p>
            </td>
          </tr>

          <!-- Hero Image/Section -->
          <tr>
            <td style="padding: 0;">
              <img src="https://via.placeholder.com/600x300" alt="Newsletter Hero" style="width: 100%; height: auto; display: block;">
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333333; font-size: 24px; margin: 0 0 20px 0;">What's New This Month</h2>
              <p style="color: #666666; font-size: 16px; line-height: 26px; margin: 0 0 30px 0;">
                Discover our latest products, exclusive offers, and exciting updates from {{store.name}}. We've been working hard to bring you the best shopping experience!
              </p>

              <!-- Featured Products Grid -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48%" style="vertical-align: top; padding-right: 10px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                      <tr>
                        <td>
                          <img src="https://via.placeholder.com/280x200" alt="Product" style="width: 100%; height: auto; display: block;">
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 15px;">
                          <h3 style="color: #333333; font-size: 16px; margin: 0 0 10px 0;">Featured Product 1</h3>
                          <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">Amazing product description goes here.</p>
                          <a href="#" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">Shop Now</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="48%" style="vertical-align: top; padding-left: 10px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                      <tr>
                        <td>
                          <img src="https://via.placeholder.com/280x200" alt="Product" style="width: 100%; height: auto; display: block;">
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 15px;">
                          <h3 style="color: #333333; font-size: 16px; margin: 0 0 10px 0;">Featured Product 2</h3>
                          <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">Amazing product description goes here.</p>
                          <a href="#" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">Shop Now</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Special Offer Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; margin: 30px 0; padding: 30px;">
                <tr>
                  <td align="center">
                    <h2 style="color: #ffffff; font-size: 28px; margin: 0 0 10px 0;">Exclusive Offer</h2>
                    <p style="color: #ffffff; font-size: 18px; margin: 0 0 20px 0; opacity: 0.9;">Get 20% off your next purchase!</p>
                    <p style="color: #ffffff; font-size: 14px; margin: 0 0 20px 0; opacity: 0.8;">Use code: <strong style="font-size: 20px; letter-spacing: 2px;">NEWSLETTER20</strong></p>
                    <a href="#" style="display: inline-block; background-color: #ffffff; color: #667eea; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: bold;">Shop Now</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <!-- Social Media Icons -->
              <table width="auto" cellpadding="0" cellspacing="0" align="center" style="margin: 0 0 20px 0;">
                <tr>
                  <td style="padding: 0 10px;">
                    <a href="#" style="color: #667eea; text-decoration: none; font-size: 24px;">📘</a>
                  </td>
                  <td style="padding: 0 10px;">
                    <a href="#" style="color: #667eea; text-decoration: none; font-size: 24px;">📷</a>
                  </td>
                  <td style="padding: 0 10px;">
                    <a href="#" style="color: #667eea; text-decoration: none; font-size: 24px;">🐦</a>
                  </td>
                </tr>
              </table>

              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                {{store.name}} | {{store.email}} | {{store.phone}}
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                You're receiving this email because you subscribed to our newsletter.<br>
                <a href="#" style="color: #667eea; text-decoration: none;">Unsubscribe</a> | <a href="#" style="color: #667eea; text-decoration: none;">Update Preferences</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`},{id:"email-promotion",name:"Promotional Email",description:"Eye-catching promotion template for sales",preview:"Bold promotional design with strong call-to-action",content:`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Special Promotion</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000000;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">

          <!-- Dramatic Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 60px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 48px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Flash Sale</h1>
              <p style="color: #ffffff; margin: 20px 0 0 0; font-size: 24px; font-weight: bold;">50% OFF Everything!</p>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Limited Time Only</p>
            </td>
          </tr>

          <!-- Countdown Timer Placeholder -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 20px; text-align: center;">
              <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Sale Ends In</p>
              <table width="auto" cellpadding="0" cellspacing="0" align="center">
                <tr>
                  <td style="padding: 0 15px;">
                    <div style="background-color: #f5576c; padding: 15px 20px; border-radius: 8px; min-width: 60px;">
                      <p style="color: #ffffff; font-size: 32px; font-weight: bold; margin: 0;">24</p>
                      <p style="color: #ffffff; font-size: 12px; margin: 5px 0 0 0;">HOURS</p>
                    </div>
                  </td>
                  <td style="padding: 0 15px;">
                    <div style="background-color: #f5576c; padding: 15px 20px; border-radius: 8px; min-width: 60px;">
                      <p style="color: #ffffff; font-size: 32px; font-weight: bold; margin: 0;">59</p>
                      <p style="color: #ffffff; font-size: 12px; margin: 5px 0 0 0;">MINUTES</p>
                    </div>
                  </td>
                  <td style="padding: 0 15px;">
                    <div style="background-color: #f5576c; padding: 15px 20px; border-radius: 8px; min-width: 60px;">
                      <p style="color: #ffffff; font-size: 32px; font-weight: bold; margin: 0;">59</p>
                      <p style="color: #ffffff; font-size: 12px; margin: 5px 0 0 0;">SECONDS</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 50px 30px; text-align: center;">
              <h2 style="color: #333333; font-size: 32px; margin: 0 0 20px 0;">Don't Miss Out!</h2>
              <p style="color: #666666; font-size: 18px; line-height: 28px; margin: 0 0 40px 0;">
                The biggest sale of the year is here! Save 50% on all items. From bestsellers to new arrivals, everything is on sale.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="#" style="display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; text-decoration: none; padding: 18px 60px; border-radius: 50px; font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);">Shop Now</a>
                  </td>
                </tr>
              </table>

              <!-- Featured Categories -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 50px 0 0 0;">
                <tr>
                  <td width="33%" align="center" style="padding: 10px;">
                    <img src="https://via.placeholder.com/150" alt="Category" style="width: 150px; height: 150px; border-radius: 50%; display: block; margin: 0 auto 15px;">
                    <h3 style="color: #333333; font-size: 16px; margin: 0 0 10px 0;">Electronics</h3>
                    <a href="#" style="color: #f5576c; text-decoration: none; font-weight: bold;">Shop Now →</a>
                  </td>
                  <td width="33%" align="center" style="padding: 10px;">
                    <img src="https://via.placeholder.com/150" alt="Category" style="width: 150px; height: 150px; border-radius: 50%; display: block; margin: 0 auto 15px;">
                    <h3 style="color: #333333; font-size: 16px; margin: 0 0 10px 0;">Fashion</h3>
                    <a href="#" style="color: #f5576c; text-decoration: none; font-weight: bold;">Shop Now →</a>
                  </td>
                  <td width="33%" align="center" style="padding: 10px;">
                    <img src="https://via.placeholder.com/150" alt="Category" style="width: 150px; height: 150px; border-radius: 50%; display: block; margin: 0 auto 15px;">
                    <h3 style="color: #333333; font-size: 16px; margin: 0 0 10px 0;">Home</h3>
                    <a href="#" style="color: #f5576c; text-decoration: none; font-weight: bold;">Shop Now →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Discount Code -->
          <tr>
            <td style="background-color: #fff3cd; padding: 25px; text-align: center; border-top: 3px dashed #ffc107; border-bottom: 3px dashed #ffc107;">
              <p style="color: #856404; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; font-weight: bold;">Use Promo Code</p>
              <p style="color: #856404; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px;">FLASH50</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 30px; text-align: center;">
              <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0;">
                {{store.name}}
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                <a href="#" style="color: #f5576c; text-decoration: none;">Unsubscribe</a> | <a href="#" style="color: #f5576c; text-decoration: none;">View in Browser</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`},{id:"email-product-announcement",name:"Product Announcement",description:"Professional template for new product launches",preview:"Clean design to showcase new products",content:`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Product Launch</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="padding: 30px; text-align: center;">
              <p style="color: #667eea; font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">New Arrival</p>
              <h1 style="color: #333333; margin: 15px 0 0 0; font-size: 36px; font-weight: bold;">Introducing Our Latest Product</h1>
            </td>
          </tr>

          <!-- Hero Product Image -->
          <tr>
            <td style="padding: 0;">
              <img src="https://via.placeholder.com/600x400" alt="New Product" style="width: 100%; height: auto; display: block;">
            </td>
          </tr>

          <!-- Product Description -->
          <tr>
            <td style="padding: 50px 40px; text-align: center;">
              <h2 style="color: #333333; font-size: 28px; margin: 0 0 20px 0;">Revolutionary Innovation</h2>
              <p style="color: #666666; font-size: 16px; line-height: 26px; margin: 0 0 30px 0;">
                We're excited to introduce our newest product, designed with you in mind. Combining cutting-edge technology with elegant design, this is the product you've been waiting for.
              </p>

              <!-- Features List -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 40px 0;">
                <tr>
                  <td width="50%" style="padding: 20px; text-align: center; vertical-align: top;">
                    <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; height: 100%;">
                      <span style="font-size: 40px;">⚡</span>
                      <h3 style="color: #333333; font-size: 18px; margin: 15px 0 10px 0;">Lightning Fast</h3>
                      <p style="color: #666666; font-size: 14px; margin: 0;">Experience unparalleled speed and performance</p>
                    </div>
                  </td>
                  <td width="50%" style="padding: 20px; text-align: center; vertical-align: top;">
                    <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; height: 100%;">
                      <span style="font-size: 40px;">✨</span>
                      <h3 style="color: #333333; font-size: 18px; margin: 15px 0 10px 0;">Premium Quality</h3>
                      <p style="color: #666666; font-size: 14px; margin: 0;">Crafted with the finest materials</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding: 20px; text-align: center; vertical-align: top;">
                    <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; height: 100%;">
                      <span style="font-size: 40px;">🎨</span>
                      <h3 style="color: #333333; font-size: 18px; margin: 15px 0 10px 0;">Beautiful Design</h3>
                      <p style="color: #666666; font-size: 14px; margin: 0;">Elegantly designed to impress</p>
                    </div>
                  </td>
                  <td width="50%" style="padding: 20px; text-align: center; vertical-align: top;">
                    <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; height: 100%;">
                      <span style="font-size: 40px;">💚</span>
                      <h3 style="color: #333333; font-size: 18px; margin: 15px 0 10px 0;">Eco-Friendly</h3>
                      <p style="color: #666666; font-size: 14px; margin: 0;">Sustainably sourced and produced</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Price and CTA -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 12px; margin: 40px 0;">
                <p style="color: #ffffff; font-size: 18px; margin: 0 0 15px 0; opacity: 0.9;">Starting at</p>
                <p style="color: #ffffff; font-size: 48px; font-weight: bold; margin: 0 0 25px 0;">$299</p>
                <a href="#" style="display: inline-block; background-color: #ffffff; color: #667eea; text-decoration: none; padding: 16px 50px; border-radius: 50px; font-size: 16px; font-weight: bold; text-transform: uppercase;">Pre-Order Now</a>
                <p style="color: #ffffff; font-size: 14px; margin: 20px 0 0 0; opacity: 0.8;">Limited quantities available</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                Follow us for more updates
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                {{store.name}} | <a href="#" style="color: #667eea; text-decoration: none;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`}]},k=[{value:"INVOICE",label:"Invoice",icon:s.FileText,description:"Generate professional invoices for orders"},{value:"PACKING_SLIP",label:"Packing Slip",icon:p.Package,description:"Create packing slips for shipments"},{value:"EMAIL_TRANSACTIONAL",label:"Transactional Email",icon:d.Mail,description:"Order confirmations, shipping notifications"},{value:"EMAIL_MARKETING",label:"Marketing Email",icon:d.Mail,description:"Newsletters, promotions, announcements"}];function C({open:e,onOpenChange:o,onTemplateCreated:a,initialType:n="INVOICE"}){let[l,d]=(0,i.useState)(1),[p,c]=(0,i.useState)({name:"",type:n,description:"",selectedTemplateId:""}),[f,g]=(0,i.useState)(!1),m=N[p.type]||[],C=async()=>{if(!p.name.trim())return void h.default.error("Please enter a template name");if(!p.selectedTemplateId)return void h.default.error("Please select a template");g(!0);try{let e=m.find(e=>e.id===p.selectedTemplateId),t=await fetch("/api/admin/templates",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:p.name,type:p.type,description:p.description,content:e?.content||"",isActive:!1})});if(t.ok){let e=await t.json();h.default.success("Template created successfully!"),a(e.template.id),j()}else h.default.error("Failed to create template")}catch(e){h.default.error("An error occurred")}finally{g(!1)}},j=()=>{d(1),c({name:"",type:n,description:"",selectedTemplateId:""}),o(!1)},S=k.find(e=>e.value===p.type),T=S?.icon||s.FileText;return(0,t.jsx)(x.Dialog,{open:e,onOpenChange:j,children:(0,t.jsxs)(x.DialogContent,{className:"max-w-2xl max-h-[90vh] overflow-y-auto",children:[(0,t.jsxs)(x.DialogHeader,{children:[(0,t.jsxs)(x.DialogTitle,{className:"flex items-center gap-2",children:[(0,t.jsx)(v.Sparkles,{className:"w-5 h-5 text-primary"}),"Create New Template"]}),(0,t.jsxs)(x.DialogDescription,{children:["Step ",l," of 2: ",1===l?"Basic Information":"Choose Starter Template"]})]}),(0,t.jsxs)("div",{className:"space-y-6 py-4",children:[1===l&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)(y.Label,{htmlFor:"name",children:["Template Name ",(0,t.jsx)("span",{className:"text-red-500",children:"*"})]}),(0,t.jsx)(u.Input,{id:"name",placeholder:"e.g., Modern Invoice Template",value:p.name,onChange:e=>c({...p,name:e.target.value}),autoFocus:!0})]}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsx)(y.Label,{children:"Template Type"}),(0,t.jsx)(w.RadioGroup,{value:p.type,onValueChange:e=>c({...p,type:e}),className:"grid grid-cols-2 gap-3",children:k.map(e=>{let i=e.icon;return(0,t.jsxs)("div",{children:[(0,t.jsx)(w.RadioGroupItem,{value:e.value,id:e.value,className:"peer sr-only"}),(0,t.jsxs)(y.Label,{htmlFor:e.value,className:"flex flex-col items-start gap-2 rounded-lg border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer",children:[(0,t.jsx)(i,{className:"w-5 h-5"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{className:"font-semibold",children:e.label}),(0,t.jsx)("div",{className:"text-xs text-muted-foreground mt-1",children:e.description})]})]})]},e.value)})})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(y.Label,{htmlFor:"description",children:"Description (Optional)"}),(0,t.jsx)(b.Textarea,{id:"description",placeholder:"What is this template used for?",value:p.description,onChange:e=>c({...p,description:e.target.value}),rows:3})]})]}),2===l&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"space-y-3 bg-muted p-4 rounded-lg",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(T,{className:"w-5 h-5 text-primary"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{className:"font-semibold",children:p.name}),(0,t.jsx)("div",{className:"text-sm text-muted-foreground",children:S?.label})]})]}),p.description&&(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:p.description})]}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsx)(y.Label,{children:"Choose a Professional Template"}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Select from our professionally designed templates"}),(0,t.jsx)(w.RadioGroup,{value:p.selectedTemplateId,onValueChange:e=>c({...p,selectedTemplateId:e}),className:"space-y-3 max-h-[400px] overflow-y-auto pr-2",children:m.map(e=>(0,t.jsxs)("div",{children:[(0,t.jsx)(w.RadioGroupItem,{value:e.id,id:e.id,className:"peer sr-only"}),(0,t.jsxs)(y.Label,{htmlFor:e.id,className:"flex items-start gap-3 rounded-lg border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all",children:[(0,t.jsx)("div",{className:"flex-shrink-0 mt-1",children:(0,t.jsx)(z.Zap,{className:"w-5 h-5 text-primary"})}),(0,t.jsxs)("div",{className:"flex-1 space-y-2",children:[(0,t.jsx)("div",{className:"font-semibold text-base",children:e.name}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground leading-relaxed",children:e.description}),(0,t.jsx)("div",{className:"flex items-center gap-2",children:(0,t.jsx)("span",{className:"text-xs bg-primary/10 text-primary px-2 py-1 rounded",children:e.preview})})]})]})]},e.id))})]})]})]}),(0,t.jsx)(x.DialogFooter,{children:(0,t.jsxs)("div",{className:"flex items-center justify-between w-full",children:[(0,t.jsx)("div",{children:2===l&&(0,t.jsx)(r.Button,{variant:"ghost",onClick:()=>d(1),children:"Back"})}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)(r.Button,{variant:"outline",onClick:j,children:"Cancel"}),1===l?(0,t.jsx)(r.Button,{onClick:()=>d(2),disabled:!p.name.trim(),children:"Next"}):(0,t.jsx)(r.Button,{onClick:C,disabled:f,children:f?"Creating...":"Create Template"})]})]})})]})})}let j=[{value:"INVOICE",label:"Invoices",icon:s.FileText},{value:"PACKING_SLIP",label:"Packing Slips",icon:p.Package},{value:"EMAIL_TRANSACTIONAL",label:"Transactional Emails",icon:d.Mail},{value:"EMAIL_MARKETING",label:"Marketing Emails",icon:d.Mail}];function S(){let e=(0,o.useRouter)(),[d,p]=(0,i.useState)([]),[x,u]=(0,i.useState)(!0),[y,b]=(0,i.useState)("INVOICE"),[w,v]=(0,i.useState)(!1),[z,N]=(0,i.useState)(null);(0,i.useEffect)(()=>{k()},[y]);let k=async()=>{try{u(!0);let e=await fetch(`/api/admin/templates?type=${y}`);if(e.ok){let t=await e.json();p(t.templates)}}catch(e){h.default.error("Failed to fetch templates")}finally{u(!1)}},S=async e=>{if(confirm("Are you sure you want to delete this template?"))try{(await fetch(`/api/admin/templates/${e}`,{method:"DELETE"})).ok?(h.default.success("Template deleted"),k()):h.default.error("Failed to delete template")}catch(e){h.default.error("An error occurred")}},T=async e=>{N(e);try{let t=await fetch(`/api/admin/templates/${e}/duplicate`,{method:"POST"});t.ok?(await t.json(),h.default.success("Template duplicated successfully!"),k()):h.default.error("Failed to duplicate template")}catch(e){h.default.error("An error occurred")}finally{N(null)}};return(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-bold",children:"Template Manager"}),(0,t.jsx)("p",{className:"text-muted-foreground mt-1",children:"Create and manage templates for invoices, emails, and packing slips"})]}),(0,t.jsxs)(r.Button,{onClick:()=>v(!0),children:[(0,t.jsx)(l.Plus,{className:"w-4 h-4 mr-2"}),"Create Template"]})]}),(0,t.jsx)("div",{className:"flex gap-2 overflow-x-auto pb-2",children:j.map(e=>{let i=e.icon;return(0,t.jsxs)(r.Button,{variant:y===e.value?"default":"outline",onClick:()=>b(e.value),className:"flex items-center gap-2",children:[(0,t.jsx)(i,{className:"w-4 h-4"}),e.label]},e.value)})}),x?(0,t.jsxs)("div",{className:"text-center py-12",children:[(0,t.jsx)("div",{className:"inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"}),(0,t.jsx)("p",{className:"mt-4 text-muted-foreground",children:"Loading templates..."})]}):0===d.length?(0,t.jsx)(a.Card,{children:(0,t.jsxs)(a.CardContent,{className:"text-center py-12",children:[(0,t.jsx)("div",{className:"mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4",children:(0,t.jsx)(s.FileText,{className:"w-6 h-6 text-muted-foreground"})}),(0,t.jsx)("h3",{className:"text-lg font-semibold mb-2",children:"No templates found"}),(0,t.jsx)("p",{className:"text-muted-foreground mb-6",children:"Get started by creating your first template"}),(0,t.jsxs)(r.Button,{onClick:()=>v(!0),variant:"outline",children:[(0,t.jsx)(l.Plus,{className:"w-4 h-4 mr-2"}),"Create Template"]})]})}):(0,t.jsx)("div",{className:"grid gap-4 md:grid-cols-2 lg:grid-cols-3",children:d.map(e=>(0,t.jsxs)(a.Card,{className:`relative transition-all hover:shadow-md ${e.isActive?"ring-2 ring-primary":""}`,children:[e.isActive&&(0,t.jsx)("div",{className:"absolute top-4 right-4",children:(0,t.jsx)(n.Badge,{className:"bg-primary",children:"Active"})}),(0,t.jsx)(a.CardHeader,{children:(0,t.jsx)(a.CardTitle,{className:"text-lg pr-16",children:e.name})}),(0,t.jsx)(a.CardContent,{children:(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsxs)("div",{className:"text-sm text-muted-foreground",children:["Last updated: ",new Date(e.updatedAt).toLocaleDateString()]}),(0,t.jsx)("div",{className:"flex flex-col gap-2",children:(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)(m.default,{href:`/admin/templates/${e.id}`,className:"flex-1",children:(0,t.jsxs)(r.Button,{variant:"outline",className:"w-full",children:[(0,t.jsx)(c.Edit,{className:"w-4 h-4 mr-2"}),"Edit"]})}),(0,t.jsx)(r.Button,{variant:"outline",size:"icon",onClick:()=>T(e.id),disabled:z===e.id,title:"Duplicate template",children:z===e.id?(0,t.jsx)("div",{className:"animate-spin rounded-full h-4 w-4 border-b-2 border-primary"}):(0,t.jsx)(g.Copy,{className:"w-4 h-4"})}),(0,t.jsx)(r.Button,{variant:"destructive",size:"icon",onClick:()=>S(e.id),disabled:e.isActive,title:e.isActive?"Cannot delete active template":"Delete template",children:(0,t.jsx)(f.Trash2,{className:"w-4 h-4"})})]})})]})})]},e.id))}),(0,t.jsx)(C,{open:w,onOpenChange:v,onTemplateCreated:t=>{e.push(`/admin/templates/${t}`)},initialType:y})]})}e.s(["default",()=>S],72057)}]);
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="8ba36839-10dc-5041-95ba-ba0591bc97a4")}catch(e){}}();
//# debugId=8ba36839-10dc-5041-95ba-ba0591bc97a4
