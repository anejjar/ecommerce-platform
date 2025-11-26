# Product Customization - Quick Start Guide

## Overview

The customer-facing product customization system allows customers to personalize products with custom fields (text, dropdowns, file uploads, colors, etc.) before adding them to their cart.

---

## Files Created

### Core Components

1. **ProductCustomizationForm.tsx**
   - Location: `src/components/ProductCustomizationForm.tsx`
   - Main component that renders all customization fields
   - Handles validation, price calculation, and state management

2. **CustomizationFileUpload.tsx**
   - Location: `src/components/CustomizationFileUpload.tsx`
   - Specialized file upload component with drag-and-drop
   - Supports image preview and file validation

3. **Type Definitions**
   - Location: `src/types/customization.ts`
   - TypeScript interfaces for all customization-related types

### Documentation & Examples

4. **Integration Guide**
   - Location: `src/components/CUSTOMIZATION_INTEGRATION_GUIDE.md`
   - Comprehensive integration examples and API documentation

5. **Example Component**
   - Location: `src/components/examples/ProductWithCustomizationExample.tsx`
   - Complete working example of a product page with customization

---

## Quick Integration (3 Steps)

### Step 1: Import the Component

```tsx
import { ProductCustomizationForm } from '@/components/ProductCustomizationForm';
import type { CustomizationValue } from '@/types/customization';
```

### Step 2: Add State Management

```tsx
const [customizations, setCustomizations] = useState<Record<string, CustomizationValue>>({});
const [isValid, setIsValid] = useState(false);
const [customizationCost, setCustomizationCost] = useState(0);
```

### Step 3: Render the Component

```tsx
<ProductCustomizationForm
  productId={product.id}
  onCustomizationsChange={(customizations, isValid, totalModifier) => {
    setCustomizations(customizations);
    setIsValid(isValid);
    setCustomizationCost(totalModifier);
  }}
/>
```

---

## Features

### Supported Field Types

- ✅ **TEXT** - Single-line text input
- ✅ **TEXTAREA** - Multi-line text with character counter
- ✅ **NUMBER** - Numeric input with min/max
- ✅ **DROPDOWN** - Select with options
- ✅ **RADIO** - Radio button group
- ✅ **CHECKBOX** - Multiple selection checkboxes
- ✅ **COLOR** - Color picker with hex input
- ✅ **FILE** - Drag-and-drop file upload
- ✅ **DATE** - Date picker

### Validation

- Required field validation
- Min/max length (text fields)
- Min/max value (number fields)
- Regex pattern matching
- File size/type validation
- Real-time validation feedback
- Inline error messages

### Price Calculation

- Field-level price modifiers
- Option-level price modifiers
- Fixed or percentage-based pricing
- Real-time total calculation
- Returned via callback

### User Experience

- Clean, modern interface
- Loading states
- Error messages
- Character counters
- File previews
- Drag-and-drop uploads
- Responsive design
- Keyboard accessible
- Screen reader support

---

## API Requirements

### 1. Get Customization Fields

```
GET /api/products/[productId]/customization-fields
```

**Already Implemented:** ✅ `src/app/api/products/[id]/customization-fields/route.ts`

### 2. Upload File

```
POST /api/cart/items/[cartItemId]/customizations/upload
```

**Already Implemented:** ✅ `src/app/api/cart/items/[id]/customizations/upload/route.ts`

---

## Usage Examples

### Example 1: Product Detail Page

```tsx
import { ProductCustomizationForm } from '@/components/ProductCustomizationForm';

export function ProductPage({ product }) {
  const [customizations, setCustomizations] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [cost, setCost] = useState(0);

  const totalPrice = Number(product.price) + cost;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: ${totalPrice.toFixed(2)}</p>

      <ProductCustomizationForm
        productId={product.id}
        onCustomizationsChange={(customizations, isValid, totalModifier) => {
          setCustomizations(customizations);
          setIsValid(isValid);
          setCost(totalModifier);
        }}
      />

      <button disabled={!isValid}>
        Add to Cart - ${totalPrice.toFixed(2)}
      </button>
    </div>
  );
}
```

### Example 2: Edit Cart Customizations

```tsx
<ProductCustomizationForm
  productId={cartItem.product.id}
  cartItemId={cartItem.id}
  initialValues={cartItem.customizations}
  onCustomizationsChange={(customizations, isValid) => {
    // Handle updates
  }}
/>
```

---

## Component Props

### ProductCustomizationForm

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `productId` | string | ✅ | Product ID to load fields for |
| `cartItemId` | string | ❌ | Cart item ID (for file uploads) |
| `initialValues` | Record | ❌ | Pre-filled values (for editing) |
| `onCustomizationsChange` | function | ❌ | Callback for changes |
| `disabled` | boolean | ❌ | Disable all fields |

### CustomizationFileUpload

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `fieldId` | string | ✅ | Field ID |
| `fieldLabel` | string | ✅ | Field label |
| `cartItemId` | string | ❌ | Cart item ID |
| `maxFileSize` | number | ❌ | Max size in KB |
| `allowedTypes` | string | ❌ | MIME types |
| `value` | object | ❌ | Current file |
| `onChange` | function | ✅ | Change handler |
| `onError` | function | ❌ | Error handler |
| `disabled` | boolean | ❌ | Disable upload |

---

## Price Calculation Example

```tsx
// Base product price
const basePrice = 50.00;

// Customer adds customizations:
// - Engraving (+$5.00)
// - Gift Box option (+$10.00)
// - Custom color (+$0.00)

// Total customization cost = $15.00
const customizationCost = 15.00;

// Final price
const totalPrice = basePrice + customizationCost; // $65.00
```

---

## Troubleshooting

### Issue: File upload not working
**Solution:** Make sure `cartItemId` is provided when the product is in the cart. Without it, files are stored locally temporarily.

### Issue: Validation not working
**Solution:** Check that required fields have values and all validation rules are met. Use the `isValid` parameter from the callback.

### Issue: Price not updating
**Solution:** Ensure `onCustomizationsChange` callback is connected and `totalModifier` is being used to update the price display.

### Issue: Fields not loading
**Solution:** Verify the API endpoint `/api/products/[id]/customization-fields` is working and returns the correct data structure.

---

## Next Steps

1. **Review the Full Integration Guide**
   - See `src/components/CUSTOMIZATION_INTEGRATION_GUIDE.md`
   - Contains detailed examples for all scenarios

2. **Check the Example Component**
   - See `src/components/examples/ProductWithCustomizationExample.tsx`
   - Complete working implementation

3. **Customize Styling**
   - Components use Tailwind CSS classes
   - Modify colors, spacing, and layout as needed

4. **Test All Field Types**
   - Create test products with different field types
   - Verify validation works correctly
   - Test file uploads

5. **Integrate with Cart**
   - Add customizations to cart items
   - Allow editing from cart page
   - Display customizations in checkout

---

## Admin Setup

To configure customization fields for products:

1. Go to Admin Panel → Products
2. Edit a product
3. Scroll to "Product Customization Fields" section
4. Add fields with types, validation, and pricing
5. Save product

The admin component is already built: `src/components/admin/ProductCustomizationFields.tsx`

---

## Production Checklist

- [ ] API endpoints are secured with authentication
- [ ] Server-side validation mirrors client-side validation
- [ ] File uploads are properly validated on server
- [ ] Price calculations are verified on backend
- [ ] Customizations are stored with cart items
- [ ] Customizations are included in order processing
- [ ] Email notifications show customization details
- [ ] Invoice/receipt displays customizations
- [ ] Admin can view order customizations

---

## Support & Resources

- **Full Documentation:** `src/components/CUSTOMIZATION_INTEGRATION_GUIDE.md`
- **Type Definitions:** `src/types/customization.ts`
- **Example Component:** `src/components/examples/ProductWithCustomizationExample.tsx`
- **Admin Component:** `src/components/admin/ProductCustomizationFields.tsx`

---

**Version:** 1.0.0
**Last Updated:** November 24, 2025
**Status:** Production Ready ✅
