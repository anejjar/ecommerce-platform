# Database Seeding Guide

This document explains how to seed your database with initial data.

## 📁 Seed Files Overview

### 1. **seed-features.ts** (⭐ MASTER FILE)
**Single Source of Truth for ALL Feature Flags**

- Contains the complete list of all 30+ feature flags
- All features are **disabled by default**
- This is the ONLY place where feature flags should be defined
- Other seed scripts import from this file

**Usage:**
```bash
npx tsx prisma/seed-features.ts
```

**Result:** Seeds all feature flags in **disabled** state (recommended for production setup)

---

### 2. **seed-essentials.ts**
**Basic Setup for Development/Testing**

- Imports and enables ALL features from `seed-features.ts`
- Seeds basic store settings
- Perfect for development environment

**Usage:**
```bash
npx tsx prisma/seed-essentials.ts
```

**Result:**
- ✅ All features enabled
- ⚙️ Basic store settings configured

---

### 3. **seed-production.ts**
**Full Demo Database with Sample Data**

- Imports and enables ALL features
- Creates massive demo database:
  - 1,000 users (2 admins + 998 customers)
  - 50 categories
  - 5,000 products
  - 20 flash sales
  - 10,000 orders
  - 5,000 reviews
  - 50 discount codes
  - 100 blog posts
  - 500 newsletter subscribers

**Usage:**
```bash
npx tsx prisma/seed-production.ts
```

**Warning:** This creates a LARGE database and takes several minutes to complete.

**Test Accounts:**
- Super Admin: `admin@example.com` / `password123`
- Admin: `manager@example.com` / `password123`

---

### 4. **seed-loyalty.ts**
**Loyalty Program Setup**

- Seeds loyalty program configuration
- Creates tier levels (Bronze, Silver, Gold, Platinum)
- Defines point earning rules
- Sets up reward redemptions

**Usage:**
```bash
npx tsx prisma/seed-loyalty.ts
```

---

## 🚀 Quick Start Commands

### Fresh Installation (Production)
```bash
# 1. Run migrations
npx prisma migrate deploy

# 2. Seed features (disabled by default - enable in admin)
npx tsx prisma/seed-features.ts

# 3. Optionally seed loyalty program
npx tsx prisma/seed-loyalty.ts
```

### Fresh Installation (Development)
```bash
# 1. Run migrations
npx prisma migrate dev

# 2. Seed essentials (features enabled + basic settings)
npx tsx prisma/seed-essentials.ts

# 3. Optionally add loyalty program
npx tsx prisma/seed-loyalty.ts
```

### Demo Environment
```bash
# 1. Run migrations
npx prisma migrate dev

# 2. Seed full demo database (WARNING: Creates thousands of records)
npx tsx prisma/seed-production.ts
```

---

## 🔧 NPM Scripts

Add these to your `package.json` for convenience:

```json
{
  "scripts": {
    "db:seed:features": "npx tsx prisma/seed-features.ts",
    "db:seed:essentials": "npx tsx prisma/seed-essentials.ts",
    "db:seed:loyalty": "npx tsx prisma/seed-loyalty.ts",
    "db:seed:production": "npx tsx prisma/seed-production.ts",
    "db:reset": "npx prisma migrate reset --force"
  }
}
```

Then run:
```bash
npm run db:seed:features
npm run db:seed:essentials
npm run db:seed:loyalty
npm run db:seed:production
```

---

## 📋 Feature Flags Reference

All feature flags are centrally managed in `seed-features.ts`:

### Analytics Features (5)
- `analytics_dashboard` - Comprehensive analytics platform
- `sales_reports` - Detailed sales reporting
- `customer_analytics` - Customer behavior analysis
- `product_performance` - Product analytics
- `traffic_analytics` - Traffic source tracking & attribution ⭐ NEW
- `custom_reports` - Custom report builder

### Financial Features (1)
- `refund_management` - Refund processing system

### Operations Features (13)
- `flash_sales` - Flash sales & promotions
- `inventory_management` - Stock management
- `inventory_tracking` - Multi-location tracking
- `product_import_export` - Bulk operations
- `bulk_operations` - Advanced bulk editing
- `activity_log` - Audit trail
- `multi_admin` - Multi-admin management
- `invoice_generator` - PDF invoices
- `customer_segments` - Customer grouping
- `advanced_shipping` - Shipping management
- `product_customization` - Product options
- `multi_currency` - Currency support
- `pos_system` - Point of sale

### Marketing Features (6)
- `abandoned_cart` - Cart recovery
- `email_campaigns` - Email marketing
- `exit_intent_popups` - Popup system
- `seo_toolkit` - SEO management
- `template_manager` - Email templates

### Customer Experience Features (7)
- `cms` - Content management
- `loyalty_program` - Loyalty & rewards
- `wishlist` - Product wishlists
- `advanced_reviews` - Product reviews
- `advanced_search` - Search & filters
- `live_chat` - Live support
- `customer_account_features` - Account management
- `product_recommendations` - AI recommendations
- `storefront_enabled` - Storefront control

### Sales Features (1)
- `checkout_customization` - Checkout branding

---

## ⚠️ Important Notes

1. **Always use `seed-features.ts` as the source of truth**
   - Never add feature flags directly in other files
   - Add new features to `seed-features.ts` first
   - Other scripts will automatically include them

2. **Production Setup**
   - Start with features disabled (`seed-features.ts`)
   - Enable features manually in admin panel as needed
   - This prevents unwanted features from being active

3. **Development Setup**
   - Use `seed-essentials.ts` to enable all features quickly
   - Speeds up development and testing

4. **Adding New Features**
   - Add to `allFeatures` array in `seed-features.ts`
   - Set `enabled: false` by default
   - Run seed script to update database

5. **Migrations**
   - Always run migrations before seeding
   - Use `prisma migrate dev` for development
   - Use `prisma migrate deploy` for production

---

## 🔄 Update Feature Flags

To update existing feature flags in the database:

```bash
# Updates all features with latest descriptions/settings
npx tsx prisma/seed-features.ts
```

This is safe to run multiple times - it uses `upsert` to update existing records.

---

## 📞 Support

If you encounter issues:
1. Check database connection in `.env`
2. Ensure migrations are up to date: `npx prisma migrate dev`
3. Review console output for specific errors
4. Check Prisma schema matches seed data structure
