# E-Commerce Platform - Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ and npm
- MySQL server (via Laragon or standalone)
- Git (optional, for version control)

## Step-by-Step Setup

### 1. Database Setup

Make sure your MySQL server is running. The project expects:
- **Host**: localhost
- **Port**: 3306
- **Database**: ecommerce_platform
- **User**: root
- **Password**: secret (or update `.env`)

Create the database:
```sql
CREATE DATABASE ecommerce_platform;
```

### 2. Environment Configuration

The `.env` file is already configured with:
```
DATABASE_URL="mysql://root:secret@localhost:3306/ecommerce_platform"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-this-to-a-random-secret"
```

**IMPORTANT**: Change `NEXTAUTH_SECRET` to a random string before production.

### 3. Install Dependencies

```bash
npm install
```

### 4. Push Database Schema

```bash
npm run db:push
```

This command will create all the necessary tables in your MySQL database.

### 5. Seed the Database

```bash
npm run db:seed
```

This will create:
- **Admin user**:
  - Email: `admin@example.com`
  - Password: `admin123`
- **Sample categories**: Electronics, Clothing, Books
- **Sample products**: 5 demo products

### 6. Start the Development Server

```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

## Accessing the Admin Panel

1. Navigate to: `http://localhost:3000/admin/login`
2. Login with:
   - Email: `admin@example.com`
   - Password: `admin123`

## Admin Features Available

Once logged in, you can:

### Dashboard (`/admin/dashboard`)
- View total products, orders, and customers
- See recent orders

### Products (`/admin/products`)
- View all products in a table
- Add new products
- Edit existing products
- Delete products
- Each product has:
  - Name, slug, description
  - Price and stock quantity
  - SKU (optional)
  - Published status
  - Category (optional)

### Orders (`/admin/orders`)
- View all customer orders
- See order details (items, customer info, totals)
- Update order status:
  - PENDING
  - PROCESSING
  - SHIPPED
  - DELIVERED
  - CANCELLED

### Customers (`/admin/customers`)
- View all registered customers
- See customer statistics:
  - Total orders
  - Total amount spent
  - Registration date

## Project Structure

```
ecommerce-platform/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeder
├── src/
│   ├── app/
│   │   ├── (admin)/       # Admin pages (protected)
│   │   ├── admin/login/   # Admin login (public)
│   │   ├── api/           # API routes
│   │   └── layout.tsx     # Root layout with providers
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
- `npm run db:seed` - Seed database with sample data

## Common Issues & Solutions

### Issue: Database Connection Error
**Solution**: Ensure MySQL is running and credentials in `.env` are correct.

### Issue: "Prisma Client not generated"
**Solution**: Run `npx prisma generate`

### Issue: Login not working
**Solution**:
1. Check if database was seeded: `npm run db:seed`
2. Verify admin user exists in database
3. Clear browser cookies and try again

### Issue: Port 3000 already in use
**Solution**: Kill the process using port 3000 or use a different port:
```bash
PORT=3001 npm run dev
```

## Next Steps

Now that the admin panel is working, you can:

1. **Add Categories** (currently not implemented)
   - Create category management pages
   - Assign categories to products

2. **Enhance Product Management**
   - Add product images
   - Add product variants (sizes, colors)
   - Bulk operations

3. **Build Storefront** (not yet implemented)
   - Customer-facing shop pages
   - Product listing and detail pages
   - Shopping cart
   - Checkout process

4. **Add Payment Integration** (deferred)
   - Stripe integration
   - Payment processing
   - Order confirmation emails

## Database Management

### View Database (Prisma Studio)
```bash
npx prisma studio
```

This opens a GUI at `http://localhost:5555` to browse and edit database records.

### Reset Database
```bash
npx prisma db push --force-reset
npm run db:seed
```

**WARNING**: This deletes all data!

## Security Notes

1. **Change default admin password** after first login
2. **Update NEXTAUTH_SECRET** to a random string
3. **Never commit `.env` file** to version control
4. **Use strong passwords** in production

## Support

For issues or questions, refer to:
- `DEVELOPMENT_LOG.md` - Detailed development history
- `README.md` - Project overview

## What's Implemented

✅ Admin authentication
✅ Product CRUD operations
✅ Order viewing and status updates
✅ Customer management
✅ Dashboard with statistics
✅ Responsive UI with Shadcn/ui
✅ MySQL database with Prisma

## What's NOT Implemented (Yet)

❌ Customer-facing storefront
❌ Shopping cart (UI not connected)
❌ Checkout process
❌ Payment integration
❌ Email notifications
❌ Product images upload
❌ Category management UI
❌ Product reviews
❌ Search and filtering

---

**Happy coding!** 🚀
