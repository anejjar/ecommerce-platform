# E-Commerce Platform

A modern, full-featured e-commerce platform built with Next.js 14+, similar to WooCommerce/WordPress functionality. Features a comprehensive admin dashboard, premium feature system, and complete e-commerce functionality.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: Redux Toolkit
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Testing**: Vitest
- **Payments**: Stripe (configurable)
- **File Storage**: Cloudinary/AWS S3 (configurable)

## Features

### Customer-Facing Features
- Product catalog with categories and filtering
- Product search and advanced filtering
- Shopping cart with persistent storage
- Secure checkout process with customization
- User authentication and accounts
- Order history and tracking
- Product reviews and ratings
- Wishlist functionality
- Flash sales with countdown timers
- Multi-language support
- Responsive design

### Admin Dashboard Features
- **Product Management**: Full CRUD operations, variants, images, stock tracking
- **Category Management**: Hierarchical categories and taxonomy
- **Order Management**: Complete order lifecycle, tracking, and fulfillment
- **Customer Management**: Customer profiles, order history, segmentation
- **Inventory Management**: Stock tracking, low stock alerts, purchase orders, suppliers
- **Analytics Dashboard**: Real-time sales metrics, revenue trends, customer insights
- **Flash Sales**: Time-limited promotions with automatic scheduling
- **Content Management**: Blog posts, pages, landing page builder, media library
- **Marketing Tools**: Email campaigns, abandoned cart recovery, exit intent popups, SEO toolkit
- **Refund Management**: Complete refund processing workflow
- **Template Manager**: Email and document templates
- **Feature Flags**: Premium feature gating system (PRO/ENTERPRISE tiers)
- **Multi-Admin Support**: Role-based access control (SUPERADMIN, ADMIN, MANAGER, EDITOR, SUPPORT, VIEWER)
- **Activity Logs**: Complete audit trail of admin actions
- **Store Settings**: Comprehensive store configuration

## Project Structure

```
ecommerce-platform/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── (storefront)/      # Customer-facing pages
│   │   │   ├── shop/
│   │   │   ├── product/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   └── account/
│   │   ├── (admin)/           # Admin dashboard pages
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── customers/
│   │   │   ├── categories/
│   │   │   └── settings/
│   │   └── api/               # API routes
│   │       ├── auth/
│   │       ├── products/
│   │       ├── orders/
│   │       ├── customers/
│   │       ├── categories/
│   │       ├── cart/
│   │       └── checkout/
│   ├── components/
│   │   ├── ui/                # Shadcn/ui components
│   │   ├── storefront/        # Customer-facing components
│   │   └── admin/             # Admin dashboard components
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── utils.ts           # Utility functions
│   │   └── actions/           # Server actions
│   ├── store/                 # Redux store
│   │   ├── index.ts
│   │   ├── StoreProvider.tsx
│   │   └── slices/
│   │       └── cartSlice.ts
│   └── types/                 # TypeScript types
└── .env.example               # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MySQL database (5.7+ or 8.0+)
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ecommerce-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure your database and other settings.

4. Set up the database:
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Or push schema changes (for development)
npx prisma db push
```

5. Seed the database:
```bash
# Seed with test data (recommended for development)
npm run seed:test

# Or seed with production-like data (large dataset for testing)
npm run seed:production
```

**Test Accounts** (after seeding):
- Super Admin: `admin@example.com` / `password123`
- Admin: `manager@example.com` / `password123`
- Customer: `alice@example.com` / `password123`

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

**Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)

## Database Schema

The platform includes comprehensive database models:

### Core Models
- **User**: Customer and admin accounts with role-based access
- **Product**: Product information, pricing, inventory, variants
- **Category**: Product categories and hierarchical taxonomy
- **Order**: Customer orders, order items, and order history
- **Cart**: Shopping cart functionality with persistent storage
- **Review**: Product reviews, ratings, and moderation
- **Address**: Shipping and billing addresses
- **ProductImage**: Product images with positioning
- **ProductVariant**: Product variations (size, color, etc.)

### Premium Features
- **FlashSale**: Time-limited promotional sales
- **FlashSaleProduct**: Products included in flash sales with pricing
- **FlashSaleCategory**: Category-based flash sales
- **Refund**: Refund requests and processing
- **AbandonedCart**: Abandoned cart tracking and recovery
- **BlogPost**: Blog posts and content management
- **MediaLibrary**: Media file management
- **DiscountCode**: Discount codes and coupons
- **FeatureFlag**: Premium feature gating system
- **AdminActivityLog**: Audit trail of admin actions
- **StockHistory**: Inventory movement tracking
- **PurchaseOrder**: Purchase order management
- **Supplier**: Supplier information
- **NewsletterSubscriber**: Newsletter subscription management

## Development

### Available Scripts

**Development:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests with Vitest

**Database:**
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema changes to database (development)
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma migrate reset` - Reset database and run migrations

**Seeding:**
- `npm run seed:test` - Seed database with test data (small dataset, fast)
- `npm run seed:production` - Seed database with production-like data (large dataset, ~10k records)

### Adding Shadcn/ui Components

To add new components from Shadcn/ui:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
# etc.
```

## Authentication & Authorization

The platform uses NextAuth.js for authentication with support for:
- Email/Password authentication
- OAuth providers (Google, GitHub, etc.)
- Role-based access control with multiple roles:
  - **SUPERADMIN**: Full access including feature management
  - **ADMIN**: Full access except feature management
  - **MANAGER**: Can manage orders, customers, products
  - **EDITOR**: Can edit products and content
  - **SUPPORT**: Can view orders and customers, manage support tickets
  - **VIEWER**: Read-only access
  - **CUSTOMER**: Standard customer access

## Payment Integration

Stripe is configured for payment processing. To set up:

1. Create a Stripe account
2. Get your API keys from the Stripe dashboard
3. Add them to your `.env` file
4. Configure webhook endpoints for order status updates

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS
- DigitalOcean

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Premium Features

The platform includes a comprehensive premium feature system:

### PRO Tier Features
- Analytics & Reporting Dashboard
- Flash Sales & Scheduled Promotions
- Advanced Inventory Management
- Refund Management
- Content Management System (CMS)
- Abandoned Cart Recovery
- Email Campaigns
- Exit Intent Popups
- SEO Toolkit
- Checkout Customization
- Template Manager
- And more...

### Feature Management
- Features can be enabled/disabled via `/admin/features` (SUPERADMIN only)
- Features are completely hidden when disabled
- Feature flags stored in database
- Documentation available at `/admin/features/docs/[featureKey]`

## Testing

The project uses Vitest for testing with a TDD approach:
- Unit tests for models, utilities, and components
- Integration tests for API routes
- Test coverage targets: 80%+

Run tests:
```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage # With coverage report
```

## Project Status

✅ **Completed Features:**
- Core e-commerce functionality
- Admin dashboard with comprehensive management tools
- Premium feature system with gating
- Flash Sales & Scheduled Promotions
- Analytics dashboard
- Inventory management
- Refund management
- CMS with landing page builder
- Multi-admin support
- And many more...

🚧 **In Progress:**
- Additional premium features
- Performance optimizations
- Enhanced analytics

## Support

For questions or issues, please open an issue on GitHub.

## License

MIT License - feel free to use this project for personal or commercial purposes.
