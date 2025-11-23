// ===== ABANDONED CART RECOVERY EMAIL TEMPLATES =====

interface AbandonedCartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

// First reminder (1 hour after abandonment)
export function abandonedCartFirstReminder(
  customerName: string | null,
  cartItems: AbandonedCartItem[],
  totalValue: string,
  recoveryUrl: string
) {
  const greeting = customerName || 'there';

  return `
    <h2>You Left Something Behind! 🛒</h2>
    <p>Hi ${greeting},</p>
    <p>We noticed you left some items in your cart. Don't worry, we've saved them for you!</p>

    <div class="order-details">
      <h3>Your Cart Items</h3>

      ${cartItems.map(item => `
        <div class="order-item">
          <div>
            <strong>${item.name}</strong><br>
            <span style="color: #6b7280;">Quantity: ${item.quantity}</span>
          </div>
          <div style="text-align: right;">
            <strong>$${(item.price * item.quantity).toFixed(2)}</strong><br>
            <span style="color: #6b7280; font-size: 14px;">$${item.price.toFixed(2)} each</span>
          </div>
        </div>
      `).join('')}

      <div class="order-total">
        <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
          <span>Total:</span>
          <span>$${totalValue}</span>
        </div>
      </div>
    </div>

    <a href="${recoveryUrl}" class="button">
      Complete Your Purchase
    </a>

    <p>These items are popular and might sell out soon. Complete your purchase now to secure your items!</p>

    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
      This is a one-time reminder. Your cart will remain saved for 30 days.
    </p>
  `;
}

// Second reminder (24 hours - with discount)
export function abandonedCartSecondReminder(
  customerName: string | null,
  cartItems: AbandonedCartItem[],
  totalValue: string,
  recoveryUrl: string,
  discountCode?: string
) {
  const greeting = customerName || 'there';
  const discountHtml = discountCode ? `
    <div style="background-color: #dcfce7; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #15803d;">Your Exclusive Discount Code:</p>
      <p style="margin: 0; font-size: 24px; font-weight: bold; color: #15803d; letter-spacing: 2px;">${discountCode}</p>
      <p style="margin: 10px 0 0 0; font-size: 14px; color: #15803d;">Save 10% on your order!</p>
    </div>
  ` : '';

  const totalSection = discountCode ? `
    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
      <span>Subtotal:</span>
      <span>$${totalValue}</span>
    </div>
    <div style="display: flex; justify-content: space-between; color: #22c55e; margin-bottom: 5px;">
      <span>Discount (10%):</span>
      <span>-$${(parseFloat(totalValue) * 0.1).toFixed(2)}</span>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; padding-top: 10px; border-top: 2px solid #e5e7eb;">
      <span>New Total:</span>
      <span>$${(parseFloat(totalValue) * 0.9).toFixed(2)}</span>
    </div>
  ` : '';

  return `
    <h2>Still Thinking About It? Here's 10% Off! 🎁</h2>
    <p>Hi ${greeting},</p>
    <p>We understand sometimes you need a little more time to decide. That's why we'd like to offer you a special discount!</p>

    ${discountHtml}

    <div class="order-details">
      <h3>Your Saved Items</h3>

      ${cartItems.map(item => `
        <div class="order-item">
          <div>
            <strong>${item.name}</strong><br>
            <span style="color: #6b7280;">Quantity: ${item.quantity}</span>
          </div>
          <div style="text-align: right;">
            <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
          </div>
        </div>
      `).join('')}

      <div class="order-total">
        ${totalSection}
      </div>
    </div>

    <a href="${recoveryUrl}" class="button">
      Claim Your Discount & Checkout
    </a>

    <p>This exclusive offer is only available for a limited time. Don't miss out!</p>
  `;
}

// Final reminder (3 days - last chance)
export function abandonedCartFinalReminder(
  customerName: string | null,
  cartItems: AbandonedCartItem[],
  totalValue: string,
  recoveryUrl: string,
  discountCode?: string
) {
  const greeting = customerName || 'there';
  const discountBanner = discountCode ? `
    <div style="background-color: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #b45309;">⚡ Your discount is still active!</p>
      <p style="margin: 0; font-size: 24px; font-weight: bold; color: #b45309; letter-spacing: 2px;">${discountCode}</p>
      <p style="margin: 10px 0 0 0; font-size: 14px; color: #b45309;">Save 10% - Expires in 24 hours</p>
    </div>
  ` : '';

  const totalSection = discountCode ? `
    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
      <span>Original Total:</span>
      <span style="text-decoration: line-through; color: #9ca3af;">$${totalValue}</span>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #22c55e;">
      <span>Your Price:</span>
      <span>$${(parseFloat(totalValue) * 0.9).toFixed(2)}</span>
    </div>
  ` : `
    <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
      <span>Total:</span>
      <span>$${totalValue}</span>
    </div>
  `;

  return `
    <h2>Last Chance! Your Cart is Waiting ⏰</h2>
    <p>Hi ${greeting},</p>
    <p>This is our final reminder about the items in your cart. We really don't want you to miss out!</p>

    ${discountBanner}

    <div class="order-details">
      <h3>Items You're About to Miss</h3>

      ${cartItems.map(item => `
        <div class="order-item">
          <div>
            <strong>${item.name}</strong><br>
            <span style="color: #6b7280;">Quantity: ${item.quantity}</span>
          </div>
          <div style="text-align: right;">
            <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
          </div>
        </div>
      `).join('')}

      <div class="order-total">
        ${totalSection}
      </div>
    </div>

    <a href="${recoveryUrl}" class="button" style="background-color: #dc2626;">
      Complete Purchase Now
    </a>

    <p><strong>Why customers love shopping with us:</strong></p>
    <ul style="color: #6b7280; padding-left: 20px;">
      <li>Free shipping on orders over $50</li>
      <li>30-day money-back guarantee</li>
      <li>Secure checkout</li>
      <li>24/7 customer support</li>
    </ul>

    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
      We won't send any more reminders about this cart. Your saved items will expire in 27 days.
    </p>
  `;
}
