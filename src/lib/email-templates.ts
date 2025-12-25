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
    <div class="highlight-box">
      <h2 style="margin: 0 0 10px 0;">Order Confirmation</h2>
      <p class="highlight-box-large" style="margin: 0;">#${order.orderNumber}</p>
    </div>

    <p>Hi ${customerName},</p>
    <p>Thank you for your order! We've received your order and will process it shortly.</p>

    <div class="order-details">
      <h3>Order Items</h3>

      ${order.items.map(item => `
        <div class="order-item">
          <div class="order-item-name">
            ${item.product.name}
            <div class="order-item-details">Quantity: ${item.quantity} × $${item.price} each</div>
          </div>
          <div class="order-item-price">$${item.total}</div>
        </div>
      `).join('')}

      <div class="order-totals">
        <div class="order-total-row">
          <span>Subtotal:</span>
          <span>$${order.subtotal}</span>
        </div>
        <div class="order-total-row">
          <span>Tax:</span>
          <span>$${order.tax}</span>
        </div>
        <div class="order-total-row">
          <span>Shipping:</span>
          <span>$${order.shipping}</span>
        </div>
        ${order.discountAmount && parseFloat(order.discountAmount) > 0 ? `
        <div class="order-total-row" style="color: #10b981;">
          <span>Discount:</span>
          <span>-$${order.discountAmount}</span>
        </div>
        ` : ''}
        <div class="order-total-row total">
          <span>Total:</span>
          <span class="order-total-amount">$${order.total}</span>
        </div>
      </div>
    </div>

    ${order.shippingAddress ? `
      <div class="email-card">
        <h3>Shipping Address</h3>
        <p style="margin: 10px 0 0 0; line-height: 1.8;">
          ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
          ${order.shippingAddress.address1}${order.shippingAddress.address2 ? '<br>' + order.shippingAddress.address2 : ''}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state || ''} ${order.shippingAddress.postalCode}<br>
          ${order.shippingAddress.country}
        </p>
      </div>
    ` : ''}

    <div class="email-button-center">
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account/orders/${order.orderNumber}" class="email-button">
        View Order Details
      </a>
    </div>

    <p class="text-muted">We'll send you another email when your order ships.</p>
  `;
}

export function orderShippedEmail(order: Order, customerName: string, trackingNumber?: string) {
  return `
    <div class="highlight-box" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
      <h2 style="margin: 0 0 10px 0;">Your Order Has Shipped! 📦</h2>
      <p style="margin: 0; font-size: 18px;">Order #${order.orderNumber}</p>
    </div>

    <p>Hi ${customerName},</p>
    <p>Great news! Your order has been shipped and is on its way to you.</p>

    ${trackingNumber ? `
      <div class="tracking-number">
        <div class="tracking-number-label">Tracking Number</div>
        <div class="tracking-number-value">${trackingNumber}</div>
      </div>
    ` : ''}

    <div class="order-details">
      <h3>Order Summary</h3>
      ${order.items.map(item => `
        <div class="order-item">
          <div class="order-item-name">
            ${item.product.name}
            <div class="order-item-details">Quantity: ${item.quantity}</div>
          </div>
          <div class="order-item-price">$${item.total}</div>
        </div>
      `).join('')}

      <div class="order-totals">
        <div class="order-total-row total">
          <span>Total:</span>
          <span class="order-total-amount">$${order.total}</span>
        </div>
      </div>
    </div>

    ${order.shippingAddress ? `
      <div class="email-card">
        <h3>Shipping To:</h3>
        <p style="margin: 10px 0 0 0; line-height: 1.8;">
          ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
          ${order.shippingAddress.address1}${order.shippingAddress.address2 ? '<br>' + order.shippingAddress.address2 : ''}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state || ''} ${order.shippingAddress.postalCode}<br>
          ${order.shippingAddress.country}
        </p>
      </div>
    ` : ''}

    <div class="email-button-center">
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account/orders/${order.orderNumber}" class="email-button email-button-success">
        Track Your Order
      </a>
    </div>
  `;
}

export function orderDeliveredEmail(order: Order, customerName: string) {
  return `
    <div class="highlight-box" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
      <h2 style="margin: 0 0 10px 0;">Your Order Has Been Delivered! 🎉</h2>
      <p style="margin: 0; font-size: 18px;">Order #${order.orderNumber}</p>
    </div>

    <p>Hi ${customerName},</p>
    <p>Your order has been delivered. We hope you love your purchase!</p>

    <div class="order-details">
      <h3>Order Summary</h3>
      ${order.items.map(item => `
        <div class="order-item">
          <div class="order-item-name">
            ${item.product.name}
            <div class="order-item-details">Quantity: ${item.quantity}</div>
          </div>
          <div class="order-item-price">$${item.total}</div>
        </div>
      `).join('')}
    </div>

    <div class="email-card-primary">
      <p style="margin: 0; font-weight: 600;">How was your experience? We'd love to hear your feedback!</p>
    </div>

    <div class="email-button-center">
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account/orders/${order.orderNumber}" class="email-button">
        Leave a Review
      </a>
    </div>
  `;
}

export function lowStockAlertEmail(products: Array<{ name: string; sku: string | null; stock: number; threshold: number }>) {
  return `
    <div class="highlight-box" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
      <h2 style="margin: 0;">Low Stock Alert! ⚠️</h2>
    </div>

    <p>The following products are running low on stock:</p>

    <div class="order-details">
      ${products.map(product => `
        <div class="order-item">
          <div class="order-item-name">
            ${product.name}
            ${product.sku ? `<div class="order-item-details">SKU: ${product.sku}</div>` : ''}
          </div>
          <div class="order-item-price" style="color: ${product.stock === 0 ? '#ef4444' : '#f59e0b'};">
            ${product.stock} units
            <div class="order-item-details">Threshold: ${product.threshold}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="email-button-center">
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/admin/settings/stock-alerts" class="email-button email-button-warning">
        View Stock Alerts
      </a>
    </div>

    <p class="text-muted">Please restock these items to avoid running out of inventory.</p>
  `;
}

export function welcomeEmail(customerName: string) {
  return `
    <div class="highlight-box">
      <h2 style="margin: 0;">Welcome to Our Store! 🎊</h2>
    </div>

    <p>Hi ${customerName},</p>
    <p>Thank you for creating an account with us! We're excited to have you as part of our community.</p>

    <div class="email-card-primary">
      <h3 style="margin-top: 0;">Here's what you can do with your account:</h3>
      <ul style="margin: 10px 0;">
        <li>Track your orders in real-time</li>
        <li>Save your shipping addresses</li>
        <li>View your order history</li>
        <li>Write product reviews</li>
        <li>Get exclusive member deals</li>
      </ul>
    </div>

    <div class="email-button-center">
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/shop" class="email-button">
        Start Shopping
      </a>
    </div>

    <p class="text-muted">If you have any questions, our support team is always here to help!</p>
  `;
}

export function newsletterWelcomeEmail(name?: string) {
  return `
    <div class="highlight-box">
      <h2 style="margin: 0;">Welcome to Our Newsletter! 📧</h2>
    </div>

    <p>Hi ${name || 'there'},</p>
    <p>Thank you for subscribing to our newsletter! You'll now receive:</p>

    <div class="email-card-primary">
      <ul style="margin: 10px 0;">
        <li>Exclusive deals and discount codes</li>
        <li>New product announcements</li>
        <li>Tips and recommendations</li>
        <li>Special subscriber-only offers</li>
        <li>Early access to sales</li>
      </ul>
    </div>

    <p class="text-muted text-small">You can unsubscribe at any time by clicking the link at the bottom of our emails.</p>

    <div class="email-button-center">
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/shop" class="email-button">
        Browse Our Products
      </a>
    </div>
  `;
}

export function newsletterCampaignEmail(
  content: string,
  subscriberEmail: string
) {
  return `
    ${content}

    <div class="spacer-large"></div>
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

    <p class="text-muted text-small text-center">
      You're receiving this email because you subscribed to our newsletter.<br>
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/newsletter/unsubscribe?email=${encodeURIComponent(subscriberEmail)}" style="color: #3b82f6;">
        Unsubscribe
      </a>
    </p>
  `;
}

// Admin notification emails

export function adminNewOrderEmail(order: Order, customerEmail: string) {
  return `
    <div class="highlight-box">
      <h2 style="margin: 0 0 10px 0;">New Order Received! 🛍️</h2>
      <p class="highlight-box-large" style="margin: 0;">#${order.orderNumber}</p>
    </div>

    <p>A new order has been placed on your store.</p>

    <div class="email-card-primary">
      <p style="margin: 0 0 10px 0;"><strong>Customer Email:</strong> ${customerEmail}</p>
      <p style="margin: 0;"><strong>Order Status:</strong> <span style="color: #f59e0b; font-weight: bold;">${order.status}</span></p>
    </div>

    <div class="order-details">
      <h3>Order Items</h3>

      ${order.items.map(item => `
        <div class="order-item">
          <div class="order-item-name">
            ${item.product.name}
            <div class="order-item-details">Quantity: ${item.quantity} × $${item.price} each</div>
          </div>
          <div class="order-item-price">$${item.total}</div>
        </div>
      `).join('')}

      <div class="order-totals">
        <div class="order-total-row">
          <span>Subtotal:</span>
          <span>$${order.subtotal}</span>
        </div>
        <div class="order-total-row">
          <span>Tax:</span>
          <span>$${order.tax}</span>
        </div>
        <div class="order-total-row">
          <span>Shipping:</span>
          <span>$${order.shipping}</span>
        </div>
        ${order.discountAmount && parseFloat(order.discountAmount) > 0 ? `
        <div class="order-total-row" style="color: #10b981;">
          <span>Discount:</span>
          <span>-$${order.discountAmount}</span>
        </div>
        ` : ''}
        <div class="order-total-row total">
          <span>Total:</span>
          <span class="order-total-amount">$${order.total}</span>
        </div>
      </div>
    </div>

    ${order.shippingAddress ? `
      <div class="email-card">
        <h3>Shipping Address</h3>
        <p style="margin: 10px 0 0 0; line-height: 1.8;">
          ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
          ${order.shippingAddress.address1}${order.shippingAddress.address2 ? '<br>' + order.shippingAddress.address2 : ''}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state || ''} ${order.shippingAddress.postalCode}<br>
          ${order.shippingAddress.country}
        </p>
      </div>
    ` : ''}

    <div class="email-button-center">
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/admin/orders/${order.orderNumber}" class="email-button">
        View Order in Admin
      </a>
    </div>

    <p class="text-muted">Please process this order as soon as possible.</p>
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
    <div class="highlight-box">
      <h2 style="margin: 0;">New Product Review Submitted! ⭐</h2>
    </div>

    <p>A customer has submitted a new review on your store.</p>

    <div class="email-card">
      <h3 style="margin-top: 0;">${productName}</h3>

      <div style="margin: 15px 0;">
        <div style="color: #f59e0b; font-size: 24px; margin-bottom: 5px;">
          ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
        </div>
        <span class="text-muted text-small">
          ${review.rating} out of 5 stars
          ${review.verified ? '<span style="color: #10b981; margin-left: 10px;">✓ Verified Purchase</span>' : ''}
        </span>
      </div>
    </div>

    <div class="email-card-primary">
      <div style="margin-bottom: 15px;">
        <p style="margin: 0 0 5px 0;"><strong>Reviewer:</strong> ${customerName}</p>
        <p style="margin: 0;" class="text-muted text-small"><strong>Submitted:</strong> ${new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}</p>
      </div>

      ${review.title ? `
        <div style="margin-bottom: 15px;">
          <h4 style="margin: 0; color: #1f2937;">${review.title}</h4>
        </div>
      ` : ''}

      ${review.comment ? `
        <div style="color: #1f2937; line-height: 1.6;">
          ${review.comment}
        </div>
      ` : ''}
    </div>

    <div class="email-button-center">
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/admin/reviews" class="email-button">
        Moderate Review
      </a>
    </div>

    <p class="text-muted">Please review and approve or reject this review in the admin panel.</p>
  `;
}

export function customerOrderNoteEmail(
  orderNumber: string,
  note: string,
  addedBy: string,
  addedAt: Date
) {
  return `
    <div class="highlight-box">
      <h2 style="margin: 0 0 10px 0;">New Note on Your Order 📝</h2>
      <p style="margin: 0; font-size: 18px;">Order #${orderNumber}</p>
    </div>

    <p>A note has been added to your order.</p>

    <div class="email-card-primary">
      <div style="margin-bottom: 15px;" class="text-small">
        <strong>${addedBy}</strong> • ${new Date(addedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}
      </div>
      <div style="color: #1f2937; line-height: 1.6;">
        ${note}
      </div>
    </div>

    <div class="email-button-center">
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account/orders/${orderNumber}" class="email-button">
        View Order Details
      </a>
    </div>

    <p class="text-muted">If you have any questions about this note, please contact our support team.</p>
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
    <div class="highlight-box">
      <h2 style="margin: 0 0 10px 0;">Refund Request Received 🔄</h2>
      <p style="margin: 0; font-size: 18px;">Order #${orderNumber}</p>
    </div>

    <p>We've received your refund request and will review it shortly.</p>

    <div class="email-card-primary">
      <p style="margin: 0 0 10px 0;"><strong>RMA Number:</strong> ${rmaNumber}</p>
      <p style="margin: 0 0 10px 0;"><strong>Refund Amount:</strong> $${refundAmount}</p>
      <p style="margin: 0;"><strong>Reason:</strong> ${reason}</p>
    </div>

    <p>Our team will review your request and get back to you within 1-2 business days.</p>

    <div class="email-button-center">
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account/orders/${orderNumber}" class="email-button">
        View Order
      </a>
    </div>

    <p class="text-muted">You can track the status of your refund request in your account.</p>
  `;
}

export function refundApprovedEmailCustomer(
  orderNumber: string,
  rmaNumber: string,
  refundAmount: string
) {
  return `
    <div class="highlight-box" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
      <h2 style="margin: 0 0 10px 0;">Refund Approved! ✅</h2>
      <p style="margin: 0; font-size: 18px;">Order #${orderNumber}</p>
    </div>

    <p>Great news! Your refund request has been approved.</p>

    <div class="email-card-success">
      <p style="margin: 0 0 10px 0;"><strong>Order Number:</strong> ${orderNumber}</p>
      <p style="margin: 0 0 10px 0;"><strong>RMA Number:</strong> ${rmaNumber}</p>
      <p style="margin: 0; font-size: 20px; font-weight: bold; color: #059669;"><strong>Refund Amount:</strong> $${refundAmount}</p>
    </div>

    <div class="email-card">
      <h3 style="margin-top: 0;">Next Steps:</h3>
      <ul style="margin: 10px 0; line-height: 1.8;">
        <li>Your refund will be processed within 5-7 business days</li>
        <li>The amount will be credited to your original payment method</li>
        <li>You may need to return the item(s) using the provided RMA number</li>
      </ul>
    </div>

    <p class="text-muted">Thank you for your patience!</p>
  `;
}

export function refundRejectedEmailCustomer(
  orderNumber: string,
  rmaNumber: string,
  adminNotes: string
) {
  return `
    <div class="highlight-box" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
      <h2 style="margin: 0 0 10px 0;">Refund Request Update ❌</h2>
      <p style="margin: 0; font-size: 18px;">Order #${orderNumber}</p>
    </div>

    <p>We've reviewed your refund request.</p>

    <div class="email-card-error">
      <p style="margin: 0 0 10px 0;"><strong>RMA Number:</strong> ${rmaNumber}</p>
      <p style="margin: 0;"><strong>Status:</strong> Not Approved</p>
    </div>

    ${adminNotes ? `
      <div class="email-card">
        <strong>Reason:</strong>
        <p style="margin: 10px 0 0 0;">${adminNotes}</p>
      </div>
    ` : ''}

    <p>If you have questions about this decision, please contact our support team.</p>

    <div class="email-button-center">
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/contact" class="email-button email-button-danger">
        Contact Support
      </a>
    </div>
  `;
}

export function refundCompletedEmailCustomer(
  orderNumber: string,
  rmaNumber: string,
  refundAmount: string
) {
  return `
    <div class="highlight-box" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
      <h2 style="margin: 0 0 10px 0;">Refund Completed! 💰</h2>
      <p style="margin: 0; font-size: 18px;">Order #${orderNumber}</p>
    </div>

    <p>Your refund has been successfully processed.</p>

    <div class="email-card-success">
      <p style="margin: 0 0 10px 0;"><strong>Order Number:</strong> ${orderNumber}</p>
      <p style="margin: 0 0 10px 0;"><strong>RMA Number:</strong> ${rmaNumber}</p>
      <p style="margin: 0; font-size: 20px; font-weight: bold; color: #059669;"><strong>Refunded Amount:</strong> $${refundAmount}</p>
    </div>

    <p>The refund has been credited to your original payment method. Depending on your bank, it may take 5-10 business days to appear in your account.</p>

    <p class="text-muted">Thank you for shopping with us!</p>
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
    <div class="highlight-box">
      <h2 style="margin: 0 0 10px 0;">New Refund Request 🔔</h2>
      <p style="margin: 0; font-size: 18px;">Order #${orderNumber}</p>
    </div>

    <p>A customer has submitted a refund request.</p>

    <div class="email-card-primary">
      <h3 style="margin-top: 0;">Refund Details</h3>
      <p style="margin: 0 0 10px 0;"><strong>Order Number:</strong> ${orderNumber}</p>
      <p style="margin: 0 0 10px 0;"><strong>RMA Number:</strong> ${rmaNumber}</p>
      <p style="margin: 0 0 10px 0;"><strong>Refund Amount:</strong> $${refundAmount}</p>
      <p style="margin: 0;"><strong>Reason:</strong> ${reason}</p>
    </div>

    <div class="email-card">
      <h3 style="margin-top: 0;">Customer Information</h3>
      <p style="margin: 0 0 10px 0;"><strong>Customer:</strong> ${customerName}</p>
      <p style="margin: 0;"><strong>Email:</strong> ${customerEmail}</p>
    </div>

    ${reasonDetails ? `
      <div class="email-card-warning">
        <strong>Customer Notes:</strong>
        <p style="margin: 10px 0 0 0;">${reasonDetails}</p>
      </div>
    ` : ''}

    <div class="email-button-center">
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/admin/refunds" class="email-button">
        Review Refund Request
      </a>
    </div>

    <p class="text-muted">Please review and process this request as soon as possible.</p>
  `;
}

// ============================================
// LOYALTY PROGRAM EMAIL TEMPLATES
// ============================================

export function loyaltyWelcomeEmail(customerName: string, referralCode: string, currencySymbol: string = '$') {
  return `
    <div class="highlight-box">
      <h2 style="margin: 0;">Welcome to Our Loyalty Rewards Program! 🎉</h2>
    </div>

    <p>Hi ${customerName},</p>
    <p>You've been automatically enrolled in our loyalty rewards program! Start earning points on every purchase and unlock exclusive benefits.</p>

    <div class="email-card-success">
      <h3 style="margin-top: 0; color: #059669;">🎁 Your Benefits:</h3>
      <ul style="margin: 10px 0; line-height: 1.8;">
        <li><strong>Earn 1 point per ${currencySymbol}1 spent</strong> (before tier multipliers)</li>
        <li><strong>100 points = ${currencySymbol}1 discount</strong></li>
        <li><strong>Progress through tiers</strong> to unlock better rewards</li>
        <li><strong>VIP early access</strong> to flash sales (Silver tier and above)</li>
        <li><strong>Refer friends</strong> and earn 500 bonus points</li>
      </ul>
    </div>

    <div class="discount-code">
      <div class="discount-code-label">Your Referral Code</div>
      <div class="discount-code-value">${referralCode}</div>
      <p style="margin: 10px 0 0 0; color: #92400e; font-size: 14px;">Share this code with friends and earn 500 points when they make their first purchase!</p>
    </div>

    <div class="email-button-center">
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account/loyalty" class="email-button">
        View Your Loyalty Dashboard
      </a>
    </div>

    <p class="text-muted">Happy shopping and earning rewards!</p>
  `;
}

export function pointsEarnedEmail(
  customerName: string,
  pointsEarned: number,
  orderNumber: string,
  newBalance: number,
  tierMultiplier: number,
  currencySymbol: string = '$'
) {
  return `
    <div class="highlight-box">
      <h2 style="margin: 0 0 10px 0;">You Earned Points! 🎯</h2>
      <p class="highlight-box-large" style="margin: 0;">+${pointsEarned.toLocaleString()} Points</p>
      <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${orderNumber}</p>
    </div>

    <p>Hi ${customerName},</p>
    <p>Great news! You've earned loyalty points from your recent purchase.</p>

    ${tierMultiplier > 1 ? `
      <div class="email-card-warning">
        <p style="margin: 0; font-weight: 600;">⭐ ${tierMultiplier}x tier multiplier applied!</p>
      </div>
    ` : ''}

    <div class="email-card-success">
      <p style="margin: 0 0 10px 0;"><strong>Your New Balance:</strong></p>
      <div style="font-size: 28px; font-weight: bold; color: #059669; margin: 10px 0;">
        ${newBalance.toLocaleString()} Points
      </div>
      <p style="margin: 5px 0 0 0;" class="text-muted text-small">
        = ${currencySymbol}${Math.floor(newBalance / 100)} in rewards available
      </p>
    </div>

    <div class="email-button-center">
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account/loyalty" class="email-button">
        Redeem Your Points
      </a>
    </div>

    <p class="text-muted">Keep shopping to earn even more rewards!</p>
  `;
}

export function tierUpgradeEmail(
  customerName: string,
  newTierName: string,
  newTierIcon: string,
  benefits: string[],
  earlyAccessEnabled: boolean,
  earlyAccessHours: number
) {
  return `
    <div class="highlight-box" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
      <h2 style="margin: 0 0 10px 0;">Congratulations! You've Been Upgraded! 🎉</h2>
      <div style="font-size: 48px; margin: 15px 0;">${newTierIcon}</div>
      <h3 style="margin: 10px 0; font-size: 28px;">
        ${newTierName} Member
      </h3>
      <p style="margin: 0; font-size: 16px; opacity: 0.95;">You've unlocked premium benefits!</p>
    </div>

    <p>Hi ${customerName},</p>
    <p>Amazing news! Your loyalty has paid off and you've reached a new tier level.</p>

    <div class="email-card-success">
      <h3 style="margin-top: 0; color: #059669;">🎁 Your New Benefits:</h3>
      <ul style="margin: 10px 0; line-height: 1.8;">
        ${benefits.map(benefit => `<li>${benefit}</li>`).join('')}
        ${earlyAccessEnabled ? `
          <li style="background-color: #eff6ff; padding: 10px; border-radius: 4px; margin: 8px 0;">
            <strong style="color: #1e40af;">✨ VIP Early Access:</strong> ${earlyAccessHours}-hour exclusive access to flash sales and new products
          </li>
        ` : ''}
      </ul>
    </div>

    <div class="email-button-center">
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account/loyalty" class="email-button">
        View Your Tier Benefits
      </a>
    </div>

    <p class="text-muted">Thank you for being a valued customer! Enjoy your upgraded benefits.</p>
  `;
}

export function pointsExpiringEmail(
  customerName: string,
  expiringPoints: number,
  expirationDate: string,
  currentBalance: number,
  currencySymbol: string = '$'
) {
  return `
    <div class="highlight-box" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
      <h2 style="margin: 0 0 10px 0;">Your Points Are Expiring Soon! ⏰</h2>
      <p class="highlight-box-large" style="margin: 0;">${expiringPoints.toLocaleString()} Points</p>
      <p style="margin: 10px 0 0 0; font-size: 16px;">Expiring on ${expirationDate}</p>
    </div>

    <p>Hi ${customerName},</p>
    <p>This is a friendly reminder that some of your loyalty points are about to expire.</p>

    <div class="email-card">
      <p style="margin: 0 0 10px 0;"><strong>Current Balance:</strong></p>
      <div style="font-size: 24px; font-weight: bold; color: #059669; margin-top: 5px;">
        ${currentBalance.toLocaleString()} Points
      </div>
    </div>

    <div class="email-card-primary">
      <p style="margin: 0 0 10px 0; font-weight: 600;">💡 Don't Lose Your Points!</p>
      <p style="margin: 10px 0;">Redeem them now for:</p>
      <ul style="margin: 10px 0;">
        <li>Discount codes (100 points = ${currencySymbol}1)</li>
        <li>Free shipping (500 points)</li>
      </ul>
    </div>

    <div class="email-button-center">
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account/loyalty" class="email-button email-button-danger">
        Redeem Points Now
      </a>
    </div>

    <p class="text-muted">Act fast before your points expire!</p>
  `;
}

export function redemptionConfirmationEmail(
  customerName: string,
  pointsSpent: number,
  redemptionType: string,
  discountCode?: string,
  discountValue?: number,
  currencySymbol: string = '$'
) {
  return `
    <div class="highlight-box" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
      <h2 style="margin: 0 0 10px 0;">Points Redeemed Successfully! 🎁</h2>
      <p style="margin: 0; font-size: 16px;">You spent ${pointsSpent.toLocaleString()} points</p>
    </div>

    <p>Hi ${customerName},</p>
    <p>You've successfully redeemed your loyalty points for a reward!</p>

    ${discountCode ? `
      <div class="discount-code">
        <div class="discount-code-label">Your Discount Code</div>
        <div class="discount-code-value">${discountCode}</div>
        ${discountValue ? `
          <p style="margin: 10px 0 0 0; color: #92400e; font-size: 18px; font-weight: 600;">
            Value: ${currencySymbol}${discountValue}
          </p>
        ` : ''}
        <p style="margin: 15px 0 0 0; color: #92400e; font-size: 14px;">
          Use this code at checkout. Valid for 90 days.
        </p>
      </div>
    ` : `
      <div class="email-card-success" style="text-align: center;">
        <div style="font-size: 32px; margin: 15px 0;">
          ${redemptionType === 'FREE_SHIPPING' ? '📦' : '✅'}
        </div>
        <h3 style="margin: 10px 0; color: #059669; font-size: 24px;">
          ${redemptionType === 'FREE_SHIPPING' ? 'Free Shipping Unlocked!' : 'Reward Unlocked!'}
        </h3>
      </div>
    `}

    <div class="email-button-center">
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/shop" class="email-button email-button-success">
        Start Shopping
      </a>
    </div>

    <p class="text-muted">Thank you for being a loyal customer!</p>
  `;
}

export function earlyAccessNotificationEmail(
  customerName: string,
  tierName: string,
  saleName: string,
  earlyAccessStartDate: string,
  publicStartDate: string,
  earlyAccessHours: number
) {
  return `
    <div class="highlight-box" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
      <h2 style="margin: 0 0 10px 0;">🌟 VIP Early Access Alert!</h2>
      <p style="margin: 0; font-size: 20px; font-weight: 600;">⚡ ${saleName}</p>
    </div>

    <p>Hi ${customerName},</p>
    <p>As a <strong>${tierName}</strong> member, you have exclusive early access to our upcoming flash sale!</p>

    <div class="email-card-warning" style="text-align: center;">
      <p style="margin: 0 0 10px 0; font-weight: 600; color: #92400e;">Your VIP Access Starts:</p>
      <div style="font-size: 24px; font-weight: bold; color: #d97706; margin: 10px 0;">
        ${earlyAccessStartDate}
      </div>
      <p style="margin: 15px 0 0 0; color: #92400e; font-size: 14px;">
        Public sale starts: ${publicStartDate}
      </p>
    </div>

    <div class="email-card-primary">
      <p style="margin: 0 0 10px 0; font-weight: 600;">✨ Why You Got Early Access:</p>
      <p style="margin: 0;">
        ${tierName} members get ${earlyAccessHours} hours of exclusive access before everyone else. Shop first and grab the best deals!
      </p>
    </div>

    <div class="email-button-center">
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/shop" class="email-button email-button-warning">
        Shop VIP Early Access
      </a>
    </div>

    <p class="text-muted">Don't miss this exclusive opportunity reserved just for you!</p>
  `;
}
