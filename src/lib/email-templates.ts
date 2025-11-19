interface OrderItem {
  product: { name: string };
  quantity: number;
  price: string;
  total: string;
}

interface Order {
  orderNumber: string;
  total: string;
  subtotal: string;
  tax: string;
  shipping: string;
  status: string;
  items: OrderItem[];
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string | null;
    city: string;
    state?: string | null;
    postalCode: string;
    country: string;
  };
}

export function orderConfirmationEmail(order: Order, customerName: string) {
  return `
    <h2>Order Confirmation</h2>
    <p>Hi ${customerName},</p>
    <p>Thank you for your order! We've received your order and will process it shortly.</p>

    <div class="order-details">
      <h3>Order #${order.orderNumber}</h3>

      ${order.items.map(item => `
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

export function orderShippedEmail(order: Order, customerName: string, trackingNumber?: string) {
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
      ${order.items.map(item => `
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

export function orderDeliveredEmail(order: Order, customerName: string) {
  return `
    <h2>Your Order Has Been Delivered! 🎉</h2>
    <p>Hi ${customerName},</p>
    <p>Your order #${order.orderNumber} has been delivered. We hope you love your purchase!</p>

    <div class="order-details">
      <h3>Order Summary</h3>
      ${order.items.map(item => `
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

export function lowStockAlertEmail(products: Array<{ name: string; sku: string | null; stock: number; threshold: number }>) {
  return `
    <h2>Low Stock Alert! ⚠️</h2>
    <p>The following products are running low on stock:</p>

    <div class="order-details">
      ${products.map(product => `
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

    <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/admin/stock-alerts" class="button">
      View Stock Alerts
    </a>

    <p>Please restock these items to avoid running out of inventory.</p>
  `;
}

export function welcomeEmail(customerName: string) {
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
