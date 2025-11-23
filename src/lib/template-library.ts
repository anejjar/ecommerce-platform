// Comprehensive template library with professional designs

export interface TemplateOption {
  id: string;
  name: string;
  description: string;
  preview: string;
  content: string;
}

// ============================================================================
// INVOICE TEMPLATES
// ============================================================================

export const invoiceTemplates: TemplateOption[] = [
  {
    id: 'invoice-classic',
    name: 'Classic Invoice',
    description: 'Traditional professional invoice with clean layout',
    preview: 'Clean and professional design with company branding',
    content: JSON.stringify({
      format: 'A4',
      orientation: 'portrait',
      title: 'INVOICE',
      primaryColor: '#1a202c',
      secondaryColor: '#4a5568',
      accentColor: '#3182ce',

      header: {
        logo: '{{store.logo}}',
        companyName: '{{store.name}}',
        companyAddress: '{{store.address}}',
        companyPhone: '{{store.phone}}',
        companyEmail: '{{store.email}}',
        showLogo: true,
      },

      invoiceInfo: {
        invoiceNumber: '{{order.number}}',
        invoiceDate: '{{order.date}}',
        dueDate: '{{order.dueDate}}',
        status: '{{order.status}}',
      },

      billTo: {
        title: 'Bill To',
        name: '{{billing.name}}',
        address1: '{{billing.address1}}',
        address2: '{{billing.address2}}',
        city: '{{billing.city}}',
        state: '{{billing.state}}',
        zip: '{{billing.zip}}',
        country: '{{billing.country}}',
      },

      shipTo: {
        title: 'Ship To',
        name: '{{shipping.name}}',
        address1: '{{shipping.address1}}',
        address2: '{{shipping.address2}}',
        city: '{{shipping.city}}',
        state: '{{shipping.state}}',
        zip: '{{shipping.zip}}',
        country: '{{shipping.country}}',
      },

      items: {
        headers: ['Item', 'SKU', 'Quantity', 'Unit Price', 'Total'],
        showSku: true,
        showDescription: true,
      },

      totals: {
        subtotal: '{{order.subtotal}}',
        tax: '{{order.tax}}',
        shipping: '{{order.shipping}}',
        discount: '{{order.discount}}',
        total: '{{order.total}}',
      },

      footer: {
        notes: '{{order.notes}}',
        thankYouMessage: 'Thank you for your business!',
        paymentInstructions: 'Payment is due within 30 days. Please include invoice number with payment.',
      },

      style: {
        font: 'Helvetica',
        fontSize: 10,
        headerFontSize: 24,
        showBorders: true,
        alternateRowColors: true,
      }
    }, null, 2),
  },

  {
    id: 'invoice-modern',
    name: 'Modern Invoice',
    description: 'Contemporary design with bold colors and modern typography',
    preview: 'Sleek modern design with accent colors',
    content: JSON.stringify({
      format: 'A4',
      orientation: 'portrait',
      title: 'INVOICE',
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      accentColor: '#ec4899',

      header: {
        logo: '{{store.logo}}',
        companyName: '{{store.name}}',
        companyEmail: '{{store.email}}',
        companyPhone: '{{store.phone}}',
        companyWebsite: '{{store.url}}',
        showLogo: true,
        style: 'gradient',
      },

      invoiceInfo: {
        invoiceNumber: '{{order.number}}',
        invoiceDate: '{{order.date}}',
        status: '{{order.status}}',
        layout: 'modern',
      },

      billTo: {
        title: 'Billing Information',
        name: '{{customer.name}}',
        email: '{{customer.email}}',
        address: '{{billing.address1}}, {{billing.city}}, {{billing.state}} {{billing.zip}}',
        country: '{{billing.country}}',
      },

      shipTo: {
        title: 'Shipping Address',
        name: '{{shipping.name}}',
        address: '{{shipping.address1}}, {{shipping.city}}, {{shipping.state}} {{shipping.zip}}',
        phone: '{{shipping.phone}}',
      },

      items: {
        headers: ['Description', 'Qty', 'Price', 'Amount'],
        showSku: false,
        showDescription: true,
        style: 'modern',
      },

      totals: {
        subtotal: '{{order.subtotal}}',
        tax: '{{order.tax}}',
        shipping: '{{order.shipping}}',
        total: '{{order.total}}',
        layout: 'side-by-side',
      },

      footer: {
        thankYouMessage: 'We appreciate your business!',
        contactInfo: 'Questions? Contact us at {{store.email}}',
      },

      style: {
        font: 'Helvetica',
        fontSize: 10,
        headerFontSize: 28,
        showBorders: false,
        alternateRowColors: false,
        roundedCorners: true,
      }
    }, null, 2),
  },

  {
    id: 'invoice-minimal',
    name: 'Minimal Invoice',
    description: 'Clean minimalist design focused on clarity',
    preview: 'Simple, elegant design with maximum readability',
    content: JSON.stringify({
      format: 'A4',
      orientation: 'portrait',
      title: 'Invoice',
      primaryColor: '#000000',
      secondaryColor: '#666666',
      accentColor: '#000000',

      header: {
        companyName: '{{store.name}}',
        companyEmail: '{{store.email}}',
        showLogo: false,
        style: 'minimal',
      },

      invoiceInfo: {
        invoiceNumber: '{{order.number}}',
        invoiceDate: '{{order.date}}',
        layout: 'compact',
      },

      billTo: {
        title: 'To',
        name: '{{customer.name}}',
        email: '{{customer.email}}',
      },

      items: {
        headers: ['Item', 'Qty', 'Price', 'Total'],
        showSku: false,
        showDescription: false,
      },

      totals: {
        subtotal: '{{order.subtotal}}',
        tax: '{{order.tax}}',
        total: '{{order.total}}',
        layout: 'right-aligned',
      },

      footer: {
        thankYouMessage: 'Thank you',
      },

      style: {
        font: 'Helvetica',
        fontSize: 9,
        headerFontSize: 20,
        showBorders: false,
        alternateRowColors: false,
        spacing: 'compact',
      }
    }, null, 2),
  },
];

// ============================================================================
// PACKING SLIP TEMPLATES
// ============================================================================

export const packingSlipTemplates: TemplateOption[] = [
  {
    id: 'packing-standard',
    name: 'Standard Packing Slip',
    description: 'Clear warehouse-friendly packing slip',
    preview: 'Easy-to-read format for warehouse operations',
    content: JSON.stringify({
      format: 'A4',
      orientation: 'portrait',
      title: 'PACKING SLIP',
      primaryColor: '#000000',

      header: {
        companyName: '{{store.name}}',
        orderNumber: '{{order.number}}',
        orderDate: '{{order.date}}',
        fontSize: 16,
      },

      shipTo: {
        title: 'SHIP TO',
        name: '{{shipping.name}}',
        address1: '{{shipping.address1}}',
        address2: '{{shipping.address2}}',
        city: '{{shipping.city}}',
        state: '{{shipping.state}}',
        zip: '{{shipping.zip}}',
        country: '{{shipping.country}}',
        phone: '{{shipping.phone}}',
      },

      items: {
        headers: ['Item', 'SKU', 'Quantity', 'Picked'],
        showSku: true,
        showCheckbox: true,
        checkboxStyle: '[ ]',
        largeText: true,
      },

      footer: {
        notes: '{{order.notes}}',
        instructions: 'Please verify all items before sealing package',
        signature: {
          show: true,
          label: 'Packed By: _______________  Date: _______________',
        }
      },

      style: {
        font: 'Courier',
        fontSize: 11,
        headerFontSize: 18,
        showBorders: true,
        spacing: 'wide',
      }
    }, null, 2),
  },

  {
    id: 'packing-detailed',
    name: 'Detailed Packing Slip',
    description: 'Comprehensive slip with product details',
    preview: 'Includes product descriptions and special instructions',
    content: JSON.stringify({
      format: 'A4',
      orientation: 'portrait',
      title: 'PACKING SLIP',
      primaryColor: '#1a202c',

      header: {
        logo: '{{store.logo}}',
        companyName: '{{store.name}}',
        orderNumber: '{{order.number}}',
        orderDate: '{{order.date}}',
        showBarcode: true,
      },

      shipTo: {
        title: 'Shipping Address',
        name: '{{shipping.name}}',
        address1: '{{shipping.address1}}',
        address2: '{{shipping.address2}}',
        city: '{{shipping.city}}',
        state: '{{shipping.state}}',
        zip: '{{shipping.zip}}',
        country: '{{shipping.country}}',
        phone: '{{shipping.phone}}',
        email: '{{customer.email}}',
      },

      items: {
        headers: ['Product', 'SKU', 'Description', 'Qty', 'Location', 'Status'],
        showSku: true,
        showDescription: true,
        showLocation: true,
        showCheckbox: true,
      },

      summary: {
        totalItems: true,
        totalQuantity: true,
      },

      footer: {
        notes: '{{order.notes}}',
        qualityCheck: {
          show: true,
          label: 'Quality Check: _______________',
        },
        signature: {
          show: true,
          label: 'Packed By: _______________  Verified By: _______________',
        }
      },

      style: {
        font: 'Helvetica',
        fontSize: 10,
        headerFontSize: 16,
        showBorders: true,
        alternateRowColors: true,
      }
    }, null, 2),
  },
];

// ============================================================================
// TRANSACTIONAL EMAIL TEMPLATES
// ============================================================================

export const transactionalEmailTemplates: TemplateOption[] = [
  {
    id: 'email-order-confirmation',
    name: 'Order Confirmation',
    description: 'Welcome email sent after order is placed',
    preview: 'Professional order confirmation with order details',
    content: `<!DOCTYPE html>
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
</html>`,
  },

  {
    id: 'email-shipping-notification',
    name: 'Shipping Notification',
    description: 'Email sent when order ships with tracking info',
    preview: 'Professional shipping notification with tracking details',
    content: `<!DOCTYPE html>
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
</html>`,
  },

  {
    id: 'email-order-cancelled',
    name: 'Order Cancellation',
    description: 'Email sent when order is cancelled',
    preview: 'Professional cancellation notification with refund details',
    content: `<!DOCTYPE html>
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
</html>`,
  },
];

// ============================================================================
// MARKETING EMAIL TEMPLATES
// ============================================================================

export const marketingEmailTemplates: TemplateOption[] = [
  {
    id: 'email-newsletter',
    name: 'Newsletter',
    description: 'Modern newsletter template for updates and news',
    preview: 'Clean newsletter design with featured content sections',
    content: `<!DOCTYPE html>
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
</html>`,
  },

  {
    id: 'email-promotion',
    name: 'Promotional Email',
    description: 'Eye-catching promotion template for sales',
    preview: 'Bold promotional design with strong call-to-action',
    content: `<!DOCTYPE html>
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
</html>`,
  },

  {
    id: 'email-product-announcement',
    name: 'Product Announcement',
    description: 'Professional template for new product launches',
    preview: 'Clean design to showcase new products',
    content: `<!DOCTYPE html>
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
</html>`,
  },
];

// Export all templates organized by type
export const templateLibrary = {
  INVOICE: invoiceTemplates,
  PACKING_SLIP: packingSlipTemplates,
  EMAIL_TRANSACTIONAL: transactionalEmailTemplates,
  EMAIL_MARKETING: marketingEmailTemplates,
};

// Helper to get templates for a specific type
export function getTemplatesForType(type: string): TemplateOption[] {
  return templateLibrary[type as keyof typeof templateLibrary] || [];
}
