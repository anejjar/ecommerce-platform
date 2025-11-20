# 🎉 Toast Notifications Guide

## ✅ Toast Setup Complete!

I've installed and configured `react-hot-toast` in your application. Toasts are now ready to use!

---

## 📍 What's Already Updated

### ✅ Components Updated to Use Toast:
1. **ProductDetail.tsx** - Now shows toast when:
   - ❌ User tries to add to cart without selecting all variant options
   - ✅ Product successfully added to cart

---

## 🎨 How to Use Toasts

### Basic Usage:

```typescript
import toast from 'react-hot-toast';

// Success toast
toast.success('Order placed successfully!');

// Error toast
toast.error('Something went wrong');

// Info/default toast
toast('Processing your request...');

// Loading toast
toast.loading('Uploading...');

// Custom duration
toast.success('Saved!', { duration: 2000 }); // 2 seconds
```

---

## 📋 Components That Still Use `alert()` (Need Migration)

### Admin Components:

#### 1. **OrderDetailPage** (`src/app/admin/orders/[id]/page.tsx`)
**Current:**
```typescript
alert('Order status updated successfully');
alert('Failed to update order');
```

**Replace with:**
```typescript
import toast from 'react-hot-toast';

// Success
toast.success('Order status updated successfully');

// Error
toast.error('Failed to update order');
```

---

#### 2. **CartContent** (`src/components/public/CartContent.tsx`)
**Current:**
```typescript
if (confirm('Remove this item from cart?')) {
  dispatch(removeFromCart(itemId));
}
```

**Replace with:**
```typescript
import toast from 'react-hot-toast';

// For confirmations, use a custom toast with buttons:
const handleRemove = (itemId: string) => {
  toast((t) => (
    <div className="flex flex-col gap-2">
      <p className="font-medium">Remove this item?</p>
      <div className="flex gap-2">
        <button
          onClick={() => {
            dispatch(removeFromCart(itemId));
            toast.dismiss(t.id);
            toast.success('Item removed from cart');
          }}
          className="px-3 py-1 bg-red-600 text-white rounded text-sm"
        >
          Remove
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 bg-gray-200 rounded text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  ), {
    duration: 5000,
  });
};
```

---

#### 3. **CheckoutContent** (`src/components/public/CheckoutContent.tsx`)
**Current:**
```typescript
alert('Please enter your email address');
alert('Password must be at least 6 characters');
alert(error.error || 'Failed to place order');
```

**Replace with:**
```typescript
import toast from 'react-hot-toast';

toast.error('Please enter your email address');
toast.error('Password must be at least 6 characters');
toast.error(error.error || 'Failed to place order');

// On success (optional, can keep redirect):
toast.success('Order placed successfully!');
```

---

#### 4. **SignInPage** (`src/app/auth/signin/page.tsx`)
**Current:**
```typescript
setError('Invalid email or password');
setError('An error occurred. Please try again.');
```

**Keep as state-based errors** (these are better as inline errors), OR add toast:
```typescript
toast.error('Invalid email or password');
```

---

## 🎯 Toast Best Practices

### ✅ DO:
- Use `toast.success()` for successful operations
- Use `toast.error()` for errors and failures
- Use `toast.loading()` for async operations
- Keep messages short and clear
- Use appropriate durations (2-4 seconds)

### ❌ DON'T:
- Don't use toast for form validation errors (use inline errors instead)
- Don't stack too many toasts at once
- Don't use very long messages (truncate if needed)
- Don't use for critical errors that need acknowledgment (use modal instead)

---

## 🎨 Toast Types & Examples

### Success Toast:
```typescript
toast.success('Profile updated!', {
  duration: 2000,
  icon: '✅',
});
```

### Error Toast:
```typescript
toast.error('Failed to save changes', {
  duration: 4000,
  icon: '❌',
});
```

### Loading Toast (with promise):
```typescript
const saveData = async () => {
  await toast.promise(
    fetch('/api/save'),
    {
      loading: 'Saving...',
      success: 'Saved successfully!',
      error: 'Failed to save',
    }
  );
};
```

### Custom Toast:
```typescript
toast.custom((t) => (
  <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
    <p className="font-bold">Custom Message!</p>
    <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
  </div>
));
```

### Toast with Action:
```typescript
toast.success(
  'Order placed!',
  {
    duration: 5000,
    action: {
      label: 'View Order',
      onClick: () => router.push('/orders'),
    },
  }
);
```

---

## 📦 Pre-built Toast Components (Create These)

### Confirmation Toast:
```typescript
// src/lib/toast-utils.ts
import toast from 'react-hot-toast';

export const confirmToast = (message: string, onConfirm: () => void) => {
  toast((t) => (
    <div className="flex flex-col gap-3">
      <p className="font-medium text-gray-900">{message}</p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          Confirm
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  ), {
    duration: 10000,
    position: 'top-center',
  });
};

// Usage:
confirmToast('Delete this item?', () => {
  deleteItem();
  toast.success('Item deleted');
});
```

---

## 🎨 Styled Toast Examples

### E-commerce Specific Toasts:

```typescript
// Product added to cart
toast.success((t) => (
  <div className="flex items-center gap-3">
    <img src={product.image} className="w-12 h-12 object-cover rounded" />
    <div>
      <p className="font-medium">{product.name}</p>
      <p className="text-sm text-gray-600">Added to cart</p>
    </div>
  </div>
), { duration: 3000 });

// Order placed
toast.success((t) => (
  <div className="flex flex-col gap-2">
    <p className="font-bold text-green-600">Order Placed!</p>
    <p className="text-sm">Order #{orderNumber}</p>
    <button
      onClick={() => {
        toast.dismiss(t.id);
        router.push(`/orders/${orderId}`);
      }}
      className="text-blue-600 text-sm font-medium hover:underline text-left"
    >
      View Order Details →
    </button>
  </div>
), { duration: 5000 });
```

---

## 🔧 Advanced Configuration

Current configuration in `src/app/layout.tsx`:

```typescript
<Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: {
      background: '#363636',
      color: '#fff',
    },
    success: {
      duration: 3000,
      iconTheme: {
        primary: '#10b981',
        secondary: '#fff',
      },
    },
    error: {
      duration: 4000,
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fff',
      },
    },
  }}
/>
```

You can customize:
- `position`: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
- `duration`: Default time in milliseconds
- `style`: CSS styles for all toasts
- Toast-specific options: success, error, loading

---

## 📝 Quick Migration Checklist

- [x] Install react-hot-toast
- [x] Add Toaster to layout
- [x] Update ProductDetail component
- [ ] Update CartContent component
- [ ] Update CheckoutContent component
- [ ] Update OrderDetailPage component
- [ ] Replace other alert() calls
- [ ] Replace confirm() calls with custom toasts
- [ ] Test all toasts
- [ ] Adjust durations and positions as needed

---

## 🎯 Next Steps

1. **Test current toasts**: Add products to cart and see the toasts!
2. **Migrate remaining alerts**: Follow examples above
3. **Create confirmToast utility**: For reusable confirmation toasts
4. **Customize styling**: Match your brand colors
5. **Add toast for async operations**: Like form submissions

---

## 🐛 Troubleshooting

### Toasts not appearing:
- Check browser console for errors
- Verify Toaster is in layout.tsx
- Make sure you imported `toast` from 'react-hot-toast'

### Toasts not styled:
- Check if custom styles override global styles
- Verify Toaster configuration in layout.tsx
- Try removing custom styles to see default behavior

### Multiple toasts stacking:
```typescript
// Prevent duplicate toasts:
toast.success('Saved!', {
  id: 'save-success', // Same id = only one toast
});

// Or dismiss all before showing new:
toast.dismiss();
toast.success('New message');
```

---

Enjoy your beautiful toast notifications! 🎉
