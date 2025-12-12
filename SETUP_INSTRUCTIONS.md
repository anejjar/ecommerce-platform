# E-Commerce Platform - Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js 18+** and npm
- **MySQL server** (via Laragon, XAMPP, or standalone)
- **Git** (optional, for version control)

You will also need accounts/credentials for:
- **Cloudinary** (for image uploads) - [Sign up for free](https://cloudinary.com)
- **SMTP Server** (for emails) - Can use Gmail, SendGrid, or your hosting provider's SMTP

## Step-by-Step Setup

### 1. Database Setup

Make sure your MySQL server is running. The project expects a database (e.g., `ecommerce_platform`).

Create the database:
```sql
CREATE DATABASE ecommerce_platform;
```

### 2. Environment Configuration

Create a `.env` file in the root directory (copy from `.env.example` if available).

**Required Configuration:**

```env
# Database Configuration
DATABASE_URL="mysql://root:secret@localhost:3306/ecommerce_platform"

# Authentication (NextAuth)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-this-to-a-random-secret-at-least-32-chars"

# Cloudinary (Images)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Email Configuration (SMTP)
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="your_email@example.com"
SMTP_PASSWORD="your_email_password"
SMTP_FROM="noreply@example.com"

# App Settings
NODE_ENV="development"
```

> [!IMPORTANT]
> Change `NEXTAUTH_SECRET` to a random string. You can generate one with `openssl rand -base64 32`.

### 3. Install Dependencies

```bash
npm install
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Push Database Schema

```bash
npm run db:push
```
This creates all necessary tables in your MySQL database.

### 6. Seed the Database

You have two options for seeding:

**Option A: Test Data (Recommended for Development)**
Includes sample products, categories, users, reviews, and blog posts.
```bash
npm run seed:test
```

**Option B: Production Data (Minimal)**
Only essential data (admin user, basic settings).
```bash
npm run seed:production
```

**Default Credentials:**
- **Admin**: `admin@example.com` / `admin123` (or `password123` check console output)
- **Customer**: `alice@example.com` / `password123` (if using test seed)

### 7. Start the Development Server

```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

## Accessing the Admin Panel

1. Navigate to: `http://localhost:3000/admin/login`
2. Login with the admin credentials.

## Project Structure

```
ecommerce-platform/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed-test.ts       # Test data seeder
│   └── seed-production.ts # Production data seeder
├── src/
│   ├── app/
│   │   ├── [locale]/      # Internationalized storefront pages
│   │   ├── admin/         # Admin dashboard pages
│   │   ├── api/           # API routes
│   │   └── layout.tsx     # Root layout
│   ├── components/
│   │   ├── ui/            # Shadcn UI components
│   │   └── admin/         # Admin-specific components
│   ├── lib/
│   │   ├── auth.ts        # NextAuth configuration
│   │   └── prisma.ts      # Prisma client
│   ├── store/             # Redux store
│   └── types/             # TypeScript types
├── .env                   # Environment variables
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run seed:test` - Seed database with comprehensive test data
- `npm run seed:production` - Seed database with minimal production data
- `npm run update:contact-form` - Update contact form templates

## Deployment

For detailed deployment instructions, specifically for Namecheap or cPanel hosting, please refer to:

- **[NAMECHEAP_DEPLOYMENT_GUIDE.md](./NAMECHEAP_DEPLOYMENT_GUIDE.md)** - Full step-by-step guide
- **[NAMECHEAP_QUICK_START.md](./NAMECHEAP_QUICK_START.md)** - Condensed checklist

## Common Issues & Solutions

### Issue: Database Connection Error
**Solution**: Ensure MySQL is running and credentials in `.env` are correct. Check if the database exists.

### Issue: "Prisma Client not generated"
**Solution**: Run `npx prisma generate`

### Issue: Images not uploading
**Solution**: Verify Cloudinary credentials in `.env`.

### Issue: Login not working
**Solution**:
1. Check if database was seeded.
2. Verify admin user exists in database.
3. Clear browser cookies.

## What's Implemented

✅ **Admin Panel**: Dashboard, Products, Orders, Customers, Analytics
✅ **Storefront**: Home, Product Listing, Product Details, Cart
✅ **Internationalization**: Multi-language support (`[locale]`)
✅ **CMS**: Page Builder, Blog Management
✅ **Authentication**: Admin and Customer login
✅ **Database**: MySQL with Prisma ORM

## Support

For issues or questions, refer to:
- `DEVELOPMENT_LOG.md` - Detailed development history
- `README.md` - Project overview
