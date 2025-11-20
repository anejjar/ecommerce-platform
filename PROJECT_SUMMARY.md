# E-Commerce Platform - Quick Project Summary

> **Purpose**: This file helps AI assistants quickly understand the project without reading the entire codebase.

---

## 🎯 What This Project Is

A **fully functional WooCommerce-like e-commerce platform** built with Next.js 15, featuring:
- Complete admin panel for store management
- Customer-facing storefront with shopping cart and checkout
- Product variants (size, color, etc.) with individual pricing/stock
- Guest checkout (no login required)
- Email notifications for orders
- Reviews and ratings system
- Dashboard with analytics and charts

---

## 🛠️ Tech Stack

```
Frontend:  Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn/ui
State:     Redux Toolkit (cart), NextAuth (sessions)
Backend:   Next.js API Routes, Prisma ORM
Database:  MySQL
Auth:      NextAuth.js with credentials provider
Images:    Cloudinary
Emails:    Nodemailer
Charts:    Recharts
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/              # Admin panel pages (dashboard, products, orders, customers)
│   ├── api/                # REST API endpoints
│   ├── (public routes)     # shop, product/[slug], cart, checkout, account
│   └── auth/               # signin, signup, forgot-password, reset-password
├── components/
│   ├── admin/              # Admin-only components
│   ├── public/             # Storefront components (Header, Footer, ProductDetail, etc.)
│   └── ui/                 # Shadcn/ui base components
├── lib/
│   ├── redux/              # Store, slices (cartSlice with isOpen for drawer)
│   ├── prisma.ts           # Prisma client singleton
│   ├── email.ts            # Email service with Nodemailer
│   ├── cloudinary.ts       # Image upload helpers
│   └── stock-sync.ts       # Utility functions for variant stock sync
└── i18n.ts                 # Multi-language config (not active yet)
```

---

## 🗄️ Database Schema (Prisma)

**Key Models:**
- **User**: Admin/Customer roles, password, email, passwordResets relation
- **Product**: name, slug, price, comparePrice, stock, featured, images[], variants[]
- **ProductVariant**: SKU, price override, stock, image, optionValues (JSON array)
- **VariantOption**: name (e.g., "Size"), position, values[]
- **VariantOptionValue**: value (e.g., "Large"), position
- **Category**: name, slug, parent (self-relation for hierarchy)
- **Order**: orderNumber, userId (optional), isGuest, guestEmail, status, paymentStatus, total, items[]
- **OrderItem**: productId, variantId (optional), quantity, price, total
- **Address**: Shipping/billing addresses
- **Review**: rating (1-5), title, comment, verifiedPurchase
- **StockAlert**: threshold, notified (for low stock warnings)
- **PasswordReset**: token, expiresAt, used (one-time reset links)

**Important Relations:**
- Product → ProductImage[] (cascade delete)
- Product → ProductVariant[] (cascade delete)
- Product → VariantOption[] (cascade delete)
- Order → OrderItem[] (cascade delete)
- User → Order[] (optional - supports guest orders)

---

## 🔑 Critical Implementation Details

### 1. Product Variants System
**How it works:**
- Admin creates VariantOptions (e.g., "Size", "Color")
- Admin adds VariantOptionValues (e.g., "Small", "Medium", "Large")
- Admin creates ProductVariants by selecting option values
- Each variant has: SKU, price override, stock, image
- `optionValues` stored as JSON array: `["Large", "Red"]`

**Frontend (ProductDetail.tsx):**
- User selects options via buttons
- Component finds matching variant by comparing `optionValues`
- Price and stock update dynamically
- Cart stores `variantId` and `variantName` ("Size: Large, Color: Red")

**Stock Management:**
- Product stock = sum of all variant stocks (not always synced - see Known Issues)
- Checkout decrements BOTH variant stock AND product stock (transaction)
- Display shows variant stock when selected, total when not

### 2. Guest Checkout
**How it works:**
- No session required for checkout
- Order model: `isGuest: true`, `guestEmail: "guest@example.com"`, `userId: null`
- Optional account creation: checkbox during checkout creates User record
- Emails sent to `order.guestEmail` if `order.user` is null

**Admin Panel:**
- All components check `order.user` with null safety
- Fallback to `order.shippingAddress.firstName` for name
- Fallback to `order.guestEmail` for email
- Badge: "Guest Order" displayed

### 3. Cart System (Redux)
**State:**
```typescript
interface CartState {
  items: CartItem[];
  isOpen: boolean;  // For cart drawer
}

interface CartItem {
  id: string;
  productId: string;
  variantId?: string;       // Links to ProductVariant
  variantName?: string;     // Display: "Size: Large, Color: Red"
  name: string;
  price: number;
  quantity: number;
  image?: string;
}
```

**Key Logic:**
- Same product + same variant = increase quantity
- Same product + different variant = separate cart items
- Drawer opens automatically on "Add to Cart"
- Drawer controlled by `cartSlice.isOpen` state

### 4. Email System
**Files:** `src/lib/email.ts`, `src/lib/email-templates.ts`

**Templates:**
- Order Confirmation (checkout)
- Order Shipped (status update)
- Order Delivered (status update)
- Welcome Email (new account)
- Password Reset (forgot password flow)

**Testing:** Use Ethereal Email (see EMAIL_SETUP_GUIDE.md)

### 5. Next.js 15 Decimal Serialization
**Critical:** Prisma `Decimal` types cannot be passed from Server → Client Components.

**Solution:** Always convert in server components:
```typescript
const products = await prisma.product.findMany({...});
const serialized = products.map(p => ({
  ...p,
  price: p.price.toString(),
  comparePrice: p.comparePrice?.toString() ?? null,
}));
return <ClientComponent products={serialized} />;
```

---

## 🚨 Known Issues / Incomplete Features

### 1. Toast Migration Incomplete
**Problem:** Some components still use `alert()` and `confirm()`
**Files:** CartContent.tsx, CheckoutContent.tsx, admin components
**Solution:** See TOAST_MIGRATION_GUIDE.md
**Status:** react-hot-toast installed, Toaster in layout.tsx, ProductDetail.tsx migrated

### 2. Stock Sync Not Automated
**Problem:** Product stock doesn't auto-sync with variant totals
**Files:** `src/lib/stock-sync.ts` has utility functions
**Functions:**
- `syncProductStockWithVariants(productId)` - call when variants change
- `getAvailableStock(productId)` - get correct stock count
**TODO:** Call these in admin panel when variants created/updated/deleted

### 3. Multi-Language Not Active
**Status:** Infrastructure complete but not integrated
**Files:**
- `messages/en.json` - 700+ English strings
- `messages/fr.json` - 700+ French strings
- `src/middleware.ts.disabled` - Rename to activate
- `src/components/public/LanguageSwitcher.tsx` - Add to Header
**Why Disabled:** Causes 404 errors because routes not updated for locale pattern
**TODO:** Update component imports, wrap with `useTranslations()`, enable middleware

### 4. No Payment Integration
**Status:** Demo mode only
**TODO:** Integrate Stripe or PayPal

---

## 🔐 Authentication & Authorization

### NextAuth.js Setup
- **Provider:** Credentials (email/password)
- **Password Hashing:** bcrypt
- **Session:** JWT-based
- **Callbacks:** Custom to include role in session

### User Roles
- **ADMIN**: Full access to admin panel
- **CUSTOMER**: Access to storefront, account, orders

### Protected Routes
- `/admin/*` - Requires ADMIN role
- `/account/*` - Requires any authenticated user
- `/checkout` - No auth required (guest checkout supported)

### Password Reset Flow
1. User enters email on `/auth/forgot-password`
2. API generates token, saves to PasswordReset model
3. Email sent with reset link: `/auth/reset-password/[token]`
4. Token valid for 1 hour, single-use
5. User sets new password, token marked as used

---

## 📊 Admin Dashboard Analytics

**Endpoint:** `GET /api/analytics/dashboard`

**Data Returned:**
- Summary stats: total revenue, orders, customers, products
- Recent orders (last 5)
- Top products (last 30 days by revenue)
- Sales by day (last 30 days)
- Order status distribution

**Charts:**
- Line chart: Daily revenue and order count (Recharts)
- Pie chart: Order status distribution
- Top products list with medal indicators

**Note:** No caching, real-time Prisma queries

---

## 🛒 Key User Flows

### Customer Purchase Flow
1. Browse `/shop` (filter, search, sort)
2. Click product → `/product/[slug]`
3. Select variant options (size, color, etc.)
4. Click "Add to Cart" → Cart drawer opens
5. Click "Checkout" → `/checkout`
6. Fill shipping info, optional account creation
7. Submit → Order created, stock decremented, email sent
8. Redirect to order confirmation

### Admin Order Management
1. View orders at `/admin/orders`
2. Filter by status, payment, date range, search
3. Click order → `/admin/orders/[id]`
4. Update status (PENDING → PROCESSING → SHIPPED → DELIVERED)
5. Status change triggers email to customer (or guest email)
6. Add internal notes or customer-visible notes
7. Print invoice: `/admin/orders/[id]/invoice`

### Admin Product Management
1. Create product: name, price, stock, category, images
2. Add variant options: Size (S, M, L), Color (Red, Blue)
3. Generate variants: All combinations created
4. Set variant-specific: SKU, price override, stock, image
5. Publish product
6. Stock alerts trigger when below threshold

---

## 🧪 Testing & Development

### Sample Data
```bash
npm run db:seed
```
Creates:
- 1 admin user
- 3 customers with order history
- 3 categories
- 5 products (some with variants)
- 3 orders (various statuses)
- 3 reviews
- 1 stock alert

### Credentials
- **Admin:** admin@example.com / admin123
- **Customer:** john@example.com / customer123

### Database GUI
```bash
npx prisma studio
```
Opens at http://localhost:5555

### Email Testing
Use Ethereal Email:
1. Create account at https://ethereal.email/
2. Add credentials to .env
3. View emails at https://ethereal.email/messages

---

## 🔧 Common Development Tasks

### Add New API Endpoint
```typescript
// src/app/api/your-route/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Your logic here
  const data = await prisma.model.findMany();
  return NextResponse.json(data);
}
```

### Update Database Schema
```bash
# Make changes to prisma/schema.prisma
npx prisma db push        # Push changes without migration
npx prisma generate       # Regenerate Prisma client
```

### Add New Redux Slice
```typescript
// src/lib/redux/features/yourSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface YourState { /* ... */ }

const initialState: YourState = { /* ... */ };

const yourSlice = createSlice({
  name: 'your',
  initialState,
  reducers: { /* ... */ },
});

export const { yourAction } = yourSlice.actions;
export default yourSlice.reducer;

// Add to store.ts
```

---

## 📚 Important Files to Know

### Configuration
- `prisma/schema.prisma` - Database schema
- `next.config.ts` - Next.js config (Cloudinary domains, next-intl)
- `.env` - Environment variables
- `src/lib/prisma.ts` - Prisma client singleton

### Authentication
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth config
- `src/components/SessionProvider.tsx` - Client-side session wrapper

### State Management
- `src/lib/redux/store.ts` - Redux store
- `src/lib/redux/features/cartSlice.ts` - Cart state + drawer visibility
- `src/lib/redux/StoreProvider.tsx` - Provider component

### Core Components
- `src/components/public/Header.tsx` - Site header with cart button
- `src/components/public/CartDrawer.tsx` - Sliding cart panel
- `src/components/public/ProductDetail.tsx` - Variant selection logic
- `src/components/public/CheckoutContent.tsx` - Guest checkout form
- `src/components/admin/AdminNav.tsx` - Admin sidebar navigation

### API Routes (Most Used)
- `src/app/api/checkout/route.ts` - Order creation, stock updates
- `src/app/api/products/[id]/route.ts` - Product CRUD
- `src/app/api/orders/[id]/route.ts` - Order updates, status changes
- `src/app/api/analytics/dashboard/route.ts` - Dashboard data

---

## 🎯 Quick Troubleshooting

### "Decimal objects are not supported"
Convert Prisma Decimal to string in server components before passing to client.

### Cart drawer not opening
Check `cartSlice.isOpen` state. Ensure `dispatch(openCart())` is called.

### Guest orders crashing admin panel
Check for `order.user?.name` null safety. Fallback to `order.guestEmail`.

### Emails not sending
Check .env EMAIL_* variables. Use Ethereal Email for testing (see guide).

### 404 on all storefront pages
i18n middleware active? Disable: rename `middleware.ts` to `middleware.ts.disabled`.

### Variant stock not updating product stock
Call `syncProductStockWithVariants(productId)` after variant changes.

---

## 📖 Documentation Files

- **README.md** - Installation and setup
- **SETUP_INSTRUCTIONS.md** - Detailed setup guide
- **DEVELOPMENT_LOG.md** - Concise development history
- **IMPLEMENTATION_SUMMARY.md** - Feature testing guide
- **EMAIL_SETUP_GUIDE.md** - Email configuration
- **TOAST_MIGRATION_GUIDE.md** - Alert to toast migration
- **PROJECT_SUMMARY.md** - This file (for AI tools)

---

**Last Updated:** Session 9 (2025-11-20)
**Platform Status:** ✅ Fully functional, ready for payment integration
