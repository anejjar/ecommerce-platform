# E-Commerce Platform

A modern, full-featured e-commerce platform built with Next.js 14+, similar to WooCommerce/WordPress functionality.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: Redux Toolkit
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe (configurable)
- **File Storage**: Cloudinary/AWS S3 (configurable)

## Features

### Customer-Facing Features
- Product catalog with categories
- Product search and filtering
- Shopping cart
- Checkout process
- User authentication and accounts
- Order history
- Product reviews and ratings
- Wishlist (coming soon)

### Admin Dashboard Features
- Product management (CRUD operations)
- Category and taxonomy management
- Order management and tracking
- Customer management
- Inventory tracking
- Sales analytics and reports
- Media library
- Store settings

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
- PostgreSQL database

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
npx prisma generate
npx prisma db push
```

5. (Optional) Seed the database:
```bash
npx prisma db seed
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The platform includes the following models:

- **User**: Customer and admin accounts
- **Product**: Product information, pricing, and inventory
- **Category**: Product categories and taxonomy
- **Order**: Customer orders and order items
- **Cart**: Shopping cart functionality
- **Review**: Product reviews and ratings
- **Address**: Shipping and billing addresses
- **ProductImage**: Product images
- **ProductVariant**: Product variations (size, color, etc.)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema changes to database

### Adding Shadcn/ui Components

To add new components from Shadcn/ui:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
# etc.
```

## Authentication

The platform uses NextAuth.js for authentication with support for:
- Email/Password authentication
- OAuth providers (Google, GitHub, etc.)
- Role-based access control (Customer/Admin)

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

## Next Steps

1. Set up authentication with NextAuth.js
2. Create admin dashboard layout and navigation
3. Build product management CRUD operations
4. Implement shopping cart functionality
5. Create checkout flow
6. Add payment processing
7. Build customer-facing storefront
8. Implement search and filtering
9. Add email notifications
10. Create analytics dashboard

## Support

For questions or issues, please open an issue on GitHub.
