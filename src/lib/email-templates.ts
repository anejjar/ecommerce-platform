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
  discountAmount?: string;
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

export function newsletterWelcomeEmail(name?: string) {
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

export function newsletterCampaignEmail(
  content: string,
  subscriberEmail: string
) {
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

// Admin notification emails

export function adminNewOrderEmail(order: Order, customerEmail: string) {
  return `
    <h2>New Order Received! 🛍️</h2>
    <p>A new order has been placed on your store.</p>

    <div class="order-details">
      <h3>Order #${order.orderNumber}</h3>
      <div style="margin-bottom: 15px; padding: 10px; background-color: #f9fafb; border-radius: 6px;">
        <strong>Customer Email:</strong> ${customerEmail}<br>
        <strong>Order Status:</strong> <span style="color: #f59e0b; font-weight: bold;">${order.status}</span>
      </div>

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

export function adminNewReviewEmail(
  review: {
    rating: number;
    title?: string | null;
    comment?: string | null;
    verified: boolean;
    createdAt: Date;
  },
  productName: string,
  customerName: string,
  reviewId: string
) {
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

export function customerOrderNoteEmail(
  orderNumber: string,
  note: string,
  addedBy: string,
  addedAt: Date
) {
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

// Refund notification emails

export function refundRequestedEmailCustomer(
  orderNumber: string,
  rmaNumber: string,
  refundAmount: string,
  reason: string
) {
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

export function refundApprovedEmailCustomer(
  orderNumber: string,
  rmaNumber: string,
  refundAmount: string
) {
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

export function refundRejectedEmailCustomer(
  orderNumber: string,
  rmaNumber: string,
  adminNotes: string
) {
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

export function refundCompletedEmailCustomer(
  orderNumber: string,
  rmaNumber: string,
  refundAmount: string
) {
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

export function adminNewRefundRequestEmail(
  orderNumber: string,
  rmaNumber: string,
  customerName: string,
  customerEmail: string,
  refundAmount: string,
  reason: string,
  reasonDetails: string | null
) {
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
