# Product Customization Components - Integration Guide

This guide explains how to integrate the customer-facing product customization components into your ecommerce platform.

## Components Overview

### 1. ProductCustomizationForm
**Location:** `src/components/ProductCustomizationForm.tsx`

Main component that renders all customization fields for a product.

### 2. CustomizationFileUpload
**Location:** `src/components/CustomizationFileUpload.tsx`

Specialized component for file uploads with drag-and-drop support.

### 3. Type Definitions
**Location:** `src/types/customization.ts`

TypeScript interfaces for type safety.

---

## Integration Scenarios

### Scenario 1: Product Detail Page (Before Adding to Cart)

**Example:** Display customization form on product detail page

```tsx
'use client';

import { useState } from 'react';
import { ProductCustomizationForm } from '@/components/ProductCustomizationForm';
import { Button } from '@/components/ui/button';
import type { CustomizationValue } from '@/types/customization';

export function ProductDetailWithCustomization({ product }) {
  const [customizations, setCustomizations] = useState<Record<string, CustomizationValue>>({});
  const [isValid, setIsValid] = useState(false);
  const [customizationCost, setCustomizationCost] = useState(0);

  const basePrice = Number(product.price);
  const totalPrice = basePrice + customizationCost;

  const handleAddToCart = async () => {
    if (!isValid) {
      toast.error('Please complete all required customization fields');
      return;
    }

    // Add to cart with customizations
    const response = await fetch('/api/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        quantity: 1,
        customizations: Object.values(customizations),
      }),
    });

    if (response.ok) {
      toast.success('Added to cart!');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Images */}
      <div>
        {/* ... product images ... */}
      </div>

      {/* Product Info & Customization */}
      <div className="space-y-6">
        <h1>{product.name}</h1>
        <p>{product.description}</p>

        {/* Price Display */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-gray-600">Base Price:</span>
            <span className="text-2xl font-bold">${basePrice.toFixed(2)}</span>
          </div>
          {customizationCost > 0 && (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-gray-600">Customization:</span>
                <span className="text-lg text-green-600">+${customizationCost.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex items-baseline gap-2">
                <span className="text-sm text-gray-600">Total:</span>
                <span className="text-3xl font-bold">${totalPrice.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        {/* Customization Form */}
        <ProductCustomizationForm
          productId={product.id}
          onCustomizationsChange={(customizations, isValid, totalModifier) => {
            setCustomizations(customizations);
            setIsValid(isValid);
            setCustomizationCost(totalModifier);
          }}
        />

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          className="w-full"
          disabled={!isValid}
        >
          Add to Cart - ${totalPrice.toFixed(2)}
        </Button>
      </div>
    </div>
  );
}
```

---

### Scenario 2: Cart Page (Editing Existing Customizations)

**Example:** Allow customers to edit customizations from cart

```tsx
'use client';

import { useState } from 'react';
import { ProductCustomizationForm } from '@/components/ProductCustomizationForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import type { CustomizationValue } from '@/types/customization';

export function CartItemWithCustomization({ cartItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [customizations, setCustomizations] = useState<Record<string, CustomizationValue>>(
    cartItem.customizations || {}
  );
  const [isValid, setIsValid] = useState(true);

  const handleUpdateCustomizations = async () => {
    if (!isValid) {
      toast.error('Please complete all required fields');
      return;
    }

    const response = await fetch(`/api/cart/items/${cartItem.id}/customizations`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customizations: Object.values(customizations),
      }),
    });

    if (response.ok) {
      toast.success('Customizations updated');
      setIsEditing(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h3>{cartItem.product.name}</h3>
          {cartItem.hasCustomizations && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Edit customization
            </button>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product Customization</DialogTitle>
          </DialogHeader>

          <ProductCustomizationForm
            productId={cartItem.product.id}
            cartItemId={cartItem.id}
            initialValues={customizations}
            onCustomizationsChange={(customizations, isValid) => {
              setCustomizations(customizations);
              setIsValid(isValid);
            }}
          />

          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCustomizations} disabled={!isValid}>
              Update Customization
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

---

### Scenario 3: Quick View Modal

**Example:** Customization in a quick view popup

```tsx
'use client';

import { useState } from 'react';
import { ProductCustomizationForm } from '@/components/ProductCustomizationForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { CustomizationValue } from '@/types/customization';

export function QuickViewModal({ product, isOpen, onClose }) {
  const [customizations, setCustomizations] = useState<Record<string, CustomizationValue>>({});
  const [isValid, setIsValid] = useState(false);
  const [customizationCost, setCustomizationCost] = useState(0);

  const totalPrice = Number(product.price) + customizationCost;

  const handleQuickAdd = async () => {
    // Add to cart logic
    // ...
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-6">
          {/* Product Image */}
          <div>
            {/* ... */}
          </div>

          {/* Product Info & Customization */}
          <div>
            <h2>{product.name}</h2>
            <p className="text-2xl font-bold">${totalPrice.toFixed(2)}</p>

            <ProductCustomizationForm
              productId={product.id}
              onCustomizationsChange={(customizations, isValid, totalModifier) => {
                setCustomizations(customizations);
                setIsValid(isValid);
                setCustomizationCost(totalModifier);
              }}
            />

            <Button onClick={handleQuickAdd} disabled={!isValid} className="w-full mt-4">
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## API Integration

### Required API Endpoints

The components expect these API endpoints to be available:

#### 1. Get Customization Fields (Public)
```
GET /api/products/[productId]/customization-fields
```

**Response:**
```json
{
  "fields": [
    {
      "id": "field-1",
      "type": "TEXT",
      "label": "Engraving Text",
      "placeholder": "Enter text...",
      "helpText": "Add a personal message",
      "required": true,
      "position": 0,
      "minLength": 1,
      "maxLength": 20,
      "priceModifier": 5.00,
      "priceModifierType": "fixed",
      "options": []
    }
  ],
  "summary": {
    "totalFields": 3,
    "requiredFields": 2,
    "optionalFields": 1,
    "hasFileUpload": true,
    "baseAdditionalCost": 5.00
  }
}
```

#### 2. Upload Customization File
```
POST /api/cart/items/[cartItemId]/customizations/upload
Content-Type: multipart/form-data

FormData:
  - file: File
  - fieldId: string
```

**Response:**
```json
{
  "success": true,
  "customization": {
    "id": "custom-1",
    "fieldId": "field-2",
    "fileUrl": "https://cloudinary.com/...",
    "fileName": "design.png",
    "priceModifier": 10.00
  },
  "cloudinary": {
    "url": "https://cloudinary.com/...",
    "publicId": "ecommerce/customizations/...",
    "width": 1024,
    "height": 768,
    "format": "png"
  }
}
```

---

## Component Props Reference

### ProductCustomizationForm Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `productId` | `string` | Yes | The product ID to load customization fields for |
| `cartItemId` | `string` | No | Cart item ID (needed for file uploads) |
| `initialValues` | `Record<string, CustomizationValue>` | No | Pre-filled customization values (for editing) |
| `onCustomizationsChange` | `(customizations, isValid, totalModifier) => void` | No | Callback when customizations change |
| `disabled` | `boolean` | No | Disable all fields |

### CustomizationFileUpload Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `fieldId` | `string` | Yes | The customization field ID |
| `fieldLabel` | `string` | Yes | Label for the field |
| `cartItemId` | `string` | No | Cart item ID (for uploading to server) |
| `maxFileSize` | `number` | No | Max file size in KB (default: 5120) |
| `allowedTypes` | `string` | No | Comma-separated MIME types |
| `value` | `{ fileUrl: string, fileName: string }` | No | Current file value |
| `onChange` | `(value) => void` | Yes | Callback when file changes |
| `onError` | `(error: string) => void` | No | Callback for errors |
| `disabled` | `boolean` | No | Disable upload |

---

## Field Types Supported

1. **TEXT** - Single-line text input
2. **TEXTAREA** - Multi-line text input with character counter
3. **NUMBER** - Numeric input with min/max validation
4. **DROPDOWN** - Select dropdown with options
5. **RADIO** - Radio button group (single selection)
6. **CHECKBOX** - Checkbox group (multiple selections)
7. **COLOR** - Color picker with hex input
8. **FILE** - File upload with drag-and-drop
9. **DATE** - Date picker

---

## Validation Features

- ✅ Required field validation
- ✅ Min/max length validation (TEXT, TEXTAREA)
- ✅ Min/max value validation (NUMBER)
- ✅ Regex pattern validation (TEXT, TEXTAREA)
- ✅ File size validation
- ✅ File type validation
- ✅ Real-time validation on blur
- ✅ Inline error messages
- ✅ Visual error indicators

---

## Price Calculation

The form automatically calculates price modifiers from:

1. **Field-level modifiers** - Fixed or percentage-based
2. **Option-level modifiers** - For dropdown/radio/checkbox options
3. **File upload modifiers** - Applied when files are uploaded

Price calculation is done in real-time and returned via the `onCustomizationsChange` callback.

---

## Accessibility Features

- ✅ Proper ARIA labels
- ✅ Keyboard navigation support
- ✅ Screen reader compatible
- ✅ Required field indicators
- ✅ Error announcements
- ✅ Focus management

---

## Responsive Design

All components are fully responsive and work on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

---

## Example Customization Data Structure

When submitting to cart/checkout:

```typescript
{
  "customizations": [
    {
      "fieldId": "field-1",
      "value": "Happy Birthday!"
    },
    {
      "fieldId": "field-2",
      "selectedOptions": ["option-1", "option-3"]
    },
    {
      "fieldId": "field-3",
      "fileUrl": "https://cloudinary.com/...",
      "fileName": "design.pdf"
    }
  ]
}
```

---

## Error Handling

The components handle these error scenarios:

1. **Network errors** - Shows toast notification
2. **Validation errors** - Shows inline error messages
3. **File upload errors** - Shows error with details
4. **API errors** - Shows user-friendly messages

---

## Testing Checklist

- [ ] Form loads customization fields correctly
- [ ] All field types render properly
- [ ] Validation works for required fields
- [ ] Price modifiers calculate correctly
- [ ] File uploads work (with/without cart item)
- [ ] Editing existing customizations works
- [ ] Error states display properly
- [ ] Responsive design works on all devices
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility

---

## Notes

- File uploads without a `cartItemId` create temporary local previews
- Files are uploaded to Cloudinary when `cartItemId` is provided
- All validation happens client-side for instant feedback
- Server-side validation should also be implemented in API endpoints
- Price modifiers are calculated but not applied to cart until submission

---

## Support

For questions or issues, refer to:
- Component source code with inline comments
- Type definitions in `src/types/customization.ts`
- Admin component: `src/components/admin/ProductCustomizationFields.tsx`
