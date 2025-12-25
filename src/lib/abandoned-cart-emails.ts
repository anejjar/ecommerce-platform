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
    <div class="highlight-box">
      <h2 style="margin: 0;">You Left Something Behind! 🛒</h2>
    </div>

    <p>Hi ${greeting},</p>
    <p>We noticed you left some items in your cart. Don't worry, we've saved them for you!</p>

    <div class="order-details">
      <h3>Your Cart Items</h3>

      ${cartItems.map(item => `
        <div class="order-item">
          <div class="order-item-name">
            ${item.name}
            <div class="order-item-details">Quantity: ${item.quantity} × $${item.price.toFixed(2)} each</div>
          </div>
          <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      `).join('')}

      <div class="order-totals">
        <div class="order-total-row total">
          <span>Total:</span>
          <span class="order-total-amount">$${totalValue}</span>
        </div>
      </div>
    </div>

    <div class="email-button-center">
      <a href="${recoveryUrl}" class="email-button">
        Complete Your Purchase
      </a>
    </div>

    <p>These items are popular and might sell out soon. Complete your purchase now to secure your items!</p>

    <p class="text-muted text-small">
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

  return `
    <div class="highlight-box" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
      <h2 style="margin: 0 0 10px 0;">Still Thinking About It? Here's 10% Off! 🎁</h2>
      <p style="margin: 0; font-size: 18px;">Exclusive discount just for you!</p>
    </div>

    <p>Hi ${greeting},</p>
    <p>We understand sometimes you need a little more time to decide. That's why we'd like to offer you a special discount!</p>

    ${discountCode ? `
      <div class="discount-code">
        <div class="discount-code-label">Your Exclusive Discount Code</div>
        <div class="discount-code-value">${discountCode}</div>
        <p style="margin: 10px 0 0 0; color: #92400e; font-size: 14px;">Save 10% on your order!</p>
      </div>
    ` : ''}

    <div class="order-details">
      <h3>Your Saved Items</h3>

      ${cartItems.map(item => `
        <div class="order-item">
          <div class="order-item-name">
            ${item.name}
            <div class="order-item-details">Quantity: ${item.quantity}</div>
          </div>
          <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      `).join('')}

      <div class="order-totals">
        ${discountCode ? `
          <div class="order-total-row">
            <span>Subtotal:</span>
            <span>$${totalValue}</span>
          </div>
          <div class="order-total-row" style="color: #10b981;">
            <span>Discount (10%):</span>
            <span>-$${(parseFloat(totalValue) * 0.1).toFixed(2)}</span>
          </div>
          <div class="order-total-row total">
            <span>New Total:</span>
            <span class="order-total-amount" style="color: #10b981;">$${(parseFloat(totalValue) * 0.9).toFixed(2)}</span>
          </div>
        ` : `
          <div class="order-total-row total">
            <span>Total:</span>
            <span class="order-total-amount">$${totalValue}</span>
          </div>
        `}
      </div>
    </div>

    <div class="email-button-center">
      <a href="${recoveryUrl}" class="email-button email-button-success">
        Claim Your Discount & Checkout
      </a>
    </div>

    <p class="text-muted">This exclusive offer is only available for a limited time. Don't miss out!</p>
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

  return `
    <div class="highlight-box" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
      <h2 style="margin: 0 0 10px 0;">Last Chance! Your Cart is Waiting ⏰</h2>
      <p style="margin: 0; font-size: 18px;">This is our final reminder</p>
    </div>

    <p>Hi ${greeting},</p>
    <p>This is our final reminder about the items in your cart. We really don't want you to miss out!</p>

    ${discountCode ? `
      <div class="discount-code">
        <div class="discount-code-label">⚡ Your discount is still active!</div>
        <div class="discount-code-value">${discountCode}</div>
        <p style="margin: 10px 0 0 0; color: #92400e; font-size: 14px;">Save 10% - Expires in 24 hours</p>
      </div>
    ` : ''}

    <div class="order-details">
      <h3>Items You're About to Miss</h3>

      ${cartItems.map(item => `
        <div class="order-item">
          <div class="order-item-name">
            ${item.name}
            <div class="order-item-details">Quantity: ${item.quantity}</div>
          </div>
          <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      `).join('')}

      <div class="order-totals">
        ${discountCode ? `
          <div class="order-total-row">
            <span>Original Total:</span>
            <span style="text-decoration: line-through; color: #9ca3af;">$${totalValue}</span>
          </div>
          <div class="order-total-row total">
            <span>Your Price:</span>
            <span class="order-total-amount" style="color: #10b981;">$${(parseFloat(totalValue) * 0.9).toFixed(2)}</span>
          </div>
        ` : `
          <div class="order-total-row total">
            <span>Total:</span>
            <span class="order-total-amount">$${totalValue}</span>
          </div>
        `}
      </div>
    </div>

    <div class="email-button-center">
      <a href="${recoveryUrl}" class="email-button email-button-danger">
        Complete Purchase Now
      </a>
    </div>

    <div class="email-card">
      <p style="margin: 0 0 10px 0; font-weight: 600;"><strong>Why customers love shopping with us:</strong></p>
      <ul style="margin: 10px 0;">
        <li>Free shipping on orders over $50</li>
        <li>30-day money-back guarantee</li>
        <li>Secure checkout</li>
        <li>24/7 customer support</li>
      </ul>
    </div>

    <p class="text-muted text-small">
      We won't send any more reminders about this cart. Your saved items will expire in 27 days.
    </p>
  `;
}
