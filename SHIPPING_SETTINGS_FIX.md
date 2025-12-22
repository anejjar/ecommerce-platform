# Shipping Settings Fix - Summary

## Problem
The shipping and tax settings configured in the admin panel (`/admin/settings/shipping`) were not being applied to the storefront (checkout page, cart page, etc.). The checkout and cart pages were using hardcoded values instead of fetching the settings from the database.

## Root Cause
1. The checkout page and cart page had hardcoded shipping/tax calculations:
   - Tax: `subtotal * 0.1` (hardcoded 10%)
   - Shipping: `subtotal > 50 ? 0 : 10` (hardcoded $50 threshold and $10 flat rate)

2. The `/api/checkout-settings` endpoint only returned checkout customization settings and did not include shipping settings

3. The checkout API route (`/api/checkout/route.ts`) also used hardcoded values for order processing

## Solution Implemented

### 1. Updated `/api/checkout-settings` API (route.ts)
**File:** `src/app/api/checkout-settings/route.ts`

Added logic to fetch shipping settings from the `StoreSetting` table and include them in the API response:

```typescript
// Fetch shipping and tax settings from StoreSetting table
const shippingSettings = await prisma.storeSetting.findMany({
    where: { category: 'shipping' },
});

// Convert to key-value object
const shippingSettingsObject = shippingSettings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
}, {} as Record<string, string>);

// Merge checkout settings with shipping settings
const mergedSettings = {
    ...settings,
    shippingSettings: shippingSettingsObject,
};
```

### 2. Updated Checkout Page (CheckoutContent.tsx)
**File:** `src/components/public/CheckoutContent.tsx`

Replaced hardcoded calculations with dynamic values from settings:

```typescript
// Calculate tax based on admin settings
const taxEnabled = checkoutSettings?.shippingSettings?.tax_enable === 'true';
const taxRate = parseFloat(checkoutSettings?.shippingSettings?.tax_rate_default || '0') / 100;
const tax = taxEnabled ? subtotal * taxRate : 0;

// Calculate shipping based on admin settings
const freeShippingEnabled = checkoutSettings?.shippingSettings?.shipping_enable_free === 'true';
const freeShippingThreshold = parseFloat(checkoutSettings?.shippingSettings?.shipping_free_threshold || '0');
const flatRateEnabled = checkoutSettings?.shippingSettings?.shipping_enable_flat_rate === 'true';
const flatRateAmount = parseFloat(checkoutSettings?.shippingSettings?.shipping_flat_rate || '0');

let shipping = 0;
if (freeShippingEnabled && subtotal >= freeShippingThreshold) {
    shipping = 0; // Free shipping
} else if (flatRateEnabled) {
    shipping = flatRateAmount; // Flat rate shipping
}
```

Also updated the tax display to show the actual tax rate instead of hardcoded "10%":
```typescript
{taxEnabled && (
    <div className="flex justify-between text-sm">
        <span className="text-gray-600">
            {t('cart.tax')} ({parseFloat(checkoutSettings?.shippingSettings?.tax_rate_default || '0')}%)
        </span>
        <span className="font-medium">{format(tax)}</span>
    </div>
)}
```

### 3. Updated Cart Page (CartContent.tsx)
**File:** `src/components/public/CartContent.tsx`

Added state and useEffect to fetch shipping settings, then applied the same calculation logic as the checkout page.

### 4. Updated Checkout API Route
**File:** `src/app/api/checkout/route.ts`

Updated the server-side order processing to fetch and use shipping settings instead of hardcoded values. This ensures that orders are created with the correct tax and shipping amounts based on admin settings.

### 5. Updated Landing Page Cart Summary Component
**File:** `src/components/landing-page/blocks/CartSummary.tsx`

Applied the same fix to ensure consistency across all cart displays on the site.

## Settings Available

The admin panel at `/admin/settings/shipping` allows configuring:

### Free Shipping
- **Enable/Disable:** Toggle free shipping
- **Threshold:** Minimum order amount for free shipping (e.g., $50)

### Flat Rate Shipping
- **Enable/Disable:** Toggle flat rate shipping
- **Amount:** Fixed shipping cost (e.g., $10)

### Tax
- **Enable/Disable:** Toggle tax calculation
- **Rate:** Tax percentage (e.g., 10%)

## Current Database Settings

Based on the database check:
```
shipping_enable_free: true
shipping_free_threshold: 500
shipping_enable_flat_rate: false
shipping_flat_rate: 10
tax_enable: false
tax_rate_default: 10
```

## Testing

### Test Scripts Created
1. `check-db-settings.js` - Checks shipping settings in the database
2. `check-shipping-settings.js` - Tests the API endpoint

### Manual Testing Steps
1. Go to `/admin/settings/shipping`
2. Modify shipping/tax settings (e.g., change free shipping threshold to $100)
3. Save the settings
4. Go to the storefront and add items to cart
5. Go to `/cart` - verify the shipping/tax calculations reflect the new settings
6. Go to `/checkout` - verify the calculations are correct
7. Complete an order - verify the order totals match the configured settings

## Files Modified

1. ✅ `src/app/api/checkout-settings/route.ts`
2. ✅ `src/components/public/CheckoutContent.tsx`
3. ✅ `src/components/public/CartContent.tsx`
4. ✅ `src/app/api/checkout/route.ts`
5. ✅ `src/components/landing-page/blocks/CartSummary.tsx`

## Impact

- ✅ All shipping and tax calculations now use admin-configured settings
- ✅ Consistent calculations across cart, checkout, and order processing
- ✅ Real-time updates when admin changes settings
- ✅ Tax display is conditional (only shows if enabled)
- ✅ Tax rate display shows actual configured rate instead of hardcoded value

## Notes

- The fix ensures that all storefront calculations match what's configured in the admin panel
- Settings are fetched from the database on each page load to ensure real-time accuracy
- If no settings are configured, the system defaults to $0 shipping and 0% tax (safe defaults)
