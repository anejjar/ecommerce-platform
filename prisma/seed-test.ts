import { PrismaClient, UserRole, OrderStatus, PaymentStatus, RefundStatus, RefundReason, DiscountType, PostStatus, FlashSaleStatus } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive test data seeding...')

  // 1. Clean up existing data
  console.log('🧹 Cleaning up existing data...')
  try {
    // Delete in reverse order of dependencies
    await prisma.flashSaleCategory.deleteMany({})
    await prisma.flashSaleProduct.deleteMany({})
    await prisma.flashSale.deleteMany({})
    await prisma.refundItem.deleteMany({})
    await prisma.refund.deleteMany({})
    await prisma.orderNote.deleteMany({})
    await prisma.orderItem.deleteMany({})
    await prisma.order.deleteMany({})
    await prisma.review.deleteMany({})
    await prisma.cartItem.deleteMany({})
    await prisma.cart.deleteMany({})
    await prisma.address.deleteMany({})
    await prisma.productImage.deleteMany({})
    await prisma.productVariant.deleteMany({})
    await prisma.product.deleteMany({})
    await prisma.category.deleteMany({})
    await prisma.newsletterSubscriber.deleteMany({})
    await prisma.blogPost.deleteMany({})
    await prisma.discountCode.deleteMany({})
    await prisma.wishlistItem.deleteMany({})
    await prisma.passwordReset.deleteMany({})
    await prisma.adminActivityLog.deleteMany({})
    await prisma.abandonedCartEmail.deleteMany({})
    await prisma.abandonedCart.deleteMany({})
    await prisma.mediaLibrary.deleteMany({})
    await prisma.account.deleteMany({})
    await prisma.user.deleteMany({})
    console.log('🧹 Cleanup finished.')
  } catch (error) {
    console.warn('⚠️ Error during cleanup:', error)
  }

  // 2. Seed Feature Flags (all features enabled for testing)
  console.log('🚩 Seeding Feature Flags...')
  await prisma.featureFlag.deleteMany({})
  const features = [
    // Analytics
    { name: 'analytics_dashboard', displayName: 'Analytics & Reporting Dashboard', description: 'Comprehensive analytics platform', category: 'analytics', tier: 'PRO' as const, enabled: true },
    { name: 'sales_reports', displayName: 'Sales Reports', description: 'Detailed sales reporting', category: 'analytics', tier: 'PRO' as const, enabled: true },
    { name: 'customer_analytics', displayName: 'Customer Analytics', description: 'Customer behavior analysis', category: 'analytics', tier: 'PRO' as const, enabled: true },
    // Operations
    { name: 'flash_sales', displayName: 'Flash Sales & Scheduled Promotions', description: 'Time-limited promotional system with countdown timers and automatic price reversion', category: 'operations', tier: 'PRO' as const, enabled: true },
    { name: 'refund_management', displayName: 'Refund Management', description: 'Complete refund processing system', category: 'operations', tier: 'PRO' as const, enabled: true },
    { name: 'inventory_management', displayName: 'Advanced Inventory Management', description: 'Stock tracking and management', category: 'operations', tier: 'PRO' as const, enabled: true },
    { name: 'template_manager', displayName: 'Template Manager', description: 'Email and document templates', category: 'operations', tier: 'PRO' as const, enabled: true },
    { name: 'product_import_export', displayName: 'Product Import/Export', description: 'Bulk product management', category: 'operations', tier: 'PRO' as const, enabled: true },
    // Marketing
    { name: 'abandoned_cart', displayName: 'Abandoned Cart Recovery', description: 'Recover abandoned shopping carts', category: 'marketing', tier: 'PRO' as const, enabled: true },
    { name: 'cms', displayName: 'Content Management System', description: 'Blog posts, pages, and media library', category: 'marketing', tier: 'PRO' as const, enabled: true },
    { name: 'email_campaigns', displayName: 'Email Campaigns', description: 'Email marketing campaigns', category: 'marketing', tier: 'PRO' as const, enabled: true },
    { name: 'exit_intent_popups', displayName: 'Exit Intent Popups', description: 'Capture leaving visitors', category: 'marketing', tier: 'PRO' as const, enabled: true },
    { name: 'seo_toolkit', displayName: 'SEO Toolkit', description: 'Search engine optimization tools', category: 'marketing', tier: 'PRO' as const, enabled: true },
    { name: 'checkout_customization', displayName: 'Checkout Customization', description: 'Customize checkout experience', category: 'sales', tier: 'PRO' as const, enabled: true },
  ]
  for (const feature of features) {
    await prisma.featureFlag.upsert({
      where: { name: feature.name },
      update: feature,
      create: feature,
    })
  }

  // 3. Users & Roles
  console.log('👤 Seeding Users...')
  const password = await hash('password123', 12)

  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Super Admin',
      password,
      role: 'SUPERADMIN',
      emailVerified: new Date(),
    },
  })

  const admin = await prisma.user.create({
    data: {
      email: 'manager@example.com',
      name: 'Store Manager',
      password,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  const customer1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice Wonderland',
      password,
      role: 'CUSTOMER',
      emailVerified: new Date(),
    },
  })

  const customer2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Builder',
      password,
      role: 'CUSTOMER',
      emailVerified: new Date(),
    },
  })

  const customer3 = await prisma.user.create({
    data: {
      email: 'charlie@example.com',
      name: 'Charlie Brown',
      password,
      role: 'CUSTOMER',
      emailVerified: new Date(),
    },
  })

  // 4. Categories
  console.log('📂 Seeding Categories...')
  const categories = []
  const categoryData = [
    { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets' },
    { name: 'Clothing', slug: 'clothing', description: 'Apparel and fashion items' },
    { name: 'Books', slug: 'books', description: 'Books and reading materials' },
    { name: 'Home & Garden', slug: 'home-garden', description: 'Home improvement and garden supplies' },
    { name: 'Sports', slug: 'sports', description: 'Sports equipment and accessories' },
  ]

  for (const cat of categoryData) {
    const category = await prisma.category.create({ data: cat })
    categories.push(category)
  }

  // 5. Products
  console.log('☕ Seeding Products...')
  const products = []
  const productData = [
    { name: 'Laptop Pro 15', slug: 'laptop-pro-15', description: 'High-performance laptop with 15-inch display', price: 1299.99, stock: 10, sku: 'LAP-001', categoryId: categories[0].id },
    { name: 'Wireless Mouse', slug: 'wireless-mouse', description: 'Ergonomic wireless mouse', price: 29.99, stock: 50, sku: 'MOU-001', categoryId: categories[0].id },
    { name: 'Mechanical Keyboard', slug: 'mechanical-keyboard', description: 'RGB mechanical keyboard', price: 89.99, stock: 30, sku: 'KEY-001', categoryId: categories[0].id },
    { name: 'Blue T-Shirt', slug: 'blue-t-shirt', description: 'Comfortable cotton t-shirt', price: 19.99, stock: 100, sku: 'TSH-001', categoryId: categories[1].id },
    { name: 'Classic Jeans', slug: 'classic-jeans', description: 'Durable denim jeans', price: 49.99, stock: 75, sku: 'JEA-001', categoryId: categories[1].id },
    { name: 'Programming Book', slug: 'programming-book', description: 'Learn programming from scratch', price: 34.99, stock: 30, sku: 'BOO-001', categoryId: categories[2].id },
    { name: 'Garden Tools Set', slug: 'garden-tools-set', description: 'Complete garden tool set', price: 79.99, stock: 20, sku: 'GAR-001', categoryId: categories[3].id },
    { name: 'Yoga Mat', slug: 'yoga-mat', description: 'Premium yoga mat', price: 24.99, stock: 60, sku: 'SPO-001', categoryId: categories[4].id },
  ]

  for (const prod of productData) {
    const product = await prisma.product.create({
      data: {
        ...prod,
        images: {
          create: [{
            url: `https://images.unsplash.com/photo-${Math.random().toString(36).substring(7)}?auto=format&fit=crop&q=80&w=1000`,
            position: 0,
            alt: prod.name,
          }],
        },
      },
    })
    products.push(product)
  }

  // 6. Flash Sales
  console.log('⚡ Seeding Flash Sales...')
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  // Active Flash Sale
  const activeFlashSale = await prisma.flashSale.create({
    data: {
      name: 'Summer Sale 2024',
      description: 'Huge summer discounts on selected items',
      discountType: 'PERCENTAGE',
      discountValue: 25,
      startDate: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Started yesterday
      endDate: tomorrow,
      status: 'ACTIVE',
      isActive: true,
      priority: 10,
      bannerText: 'Limited Time Offer!',
    },
  })

  // Add products to active flash sale
  await prisma.flashSaleProduct.createMany({
    data: [
      {
        flashSaleId: activeFlashSale.id,
        productId: products[0].id,
        originalPrice: products[0].price,
        salePrice: products[0].price * 0.75, // 25% off
        maxQuantity: 5,
        soldQuantity: 2,
      },
      {
        flashSaleId: activeFlashSale.id,
        productId: products[1].id,
        originalPrice: products[1].price,
        salePrice: products[1].price * 0.75,
        maxQuantity: 20,
        soldQuantity: 5,
      },
    ],
  })

  // Scheduled Flash Sale
  const scheduledFlashSale = await prisma.flashSale.create({
    data: {
      name: 'Black Friday Preview',
      description: 'Early Black Friday deals',
      discountType: 'FIXED_AMOUNT',
      discountValue: 50,
      startDate: tomorrow,
      endDate: nextWeek,
      status: 'SCHEDULED',
      isActive: true,
      priority: 5,
    },
  })

  await prisma.flashSaleProduct.createMany({
    data: [
      {
        flashSaleId: scheduledFlashSale.id,
        productId: products[2].id,
        originalPrice: products[2].price,
        salePrice: products[2].price - 50,
        maxQuantity: 10,
        soldQuantity: 0,
      },
    ],
  })

  // 7. Orders
  console.log('📦 Seeding Orders...')
  const address1 = await prisma.address.create({
    data: {
      userId: customer1.id,
      firstName: 'Alice',
      lastName: 'Wonderland',
      address1: '123 Rabbit Hole Ln',
      city: 'Wonderland',
      state: 'WL',
      postalCode: '12345',
      country: 'USA',
      phone: '555-0101',
      isDefault: true,
    },
  })

  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-TEST-001',
      userId: customer1.id,
      status: OrderStatus.DELIVERED,
      paymentStatus: PaymentStatus.PAID,
      subtotal: 1329.98,
      tax: 132.99,
      shipping: 0,
      total: 1462.97,
      shippingAddressId: address1.id,
      items: {
        create: [
          { productId: products[0].id, quantity: 1, price: 1299.99, total: 1299.99 },
          { productId: products[1].id, quantity: 1, price: 29.99, total: 29.99 },
        ],
      },
    },
  })

  const address2 = await prisma.address.create({
    data: {
      userId: customer2.id,
      firstName: 'Bob',
      lastName: 'Builder',
      address1: '456 Construction Way',
      city: 'Buildsville',
      state: 'BV',
      postalCode: '67890',
      country: 'USA',
      phone: '555-0202',
    },
  })

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-TEST-002',
      userId: customer2.id,
      status: OrderStatus.PROCESSING,
      paymentStatus: PaymentStatus.PAID,
      subtotal: 69.98,
      tax: 6.99,
      shipping: 10,
      total: 86.97,
      shippingAddressId: address2.id,
      items: {
        create: [
          { productId: products[3].id, quantity: 1, price: 19.99, total: 19.99 },
          { productId: products[4].id, quantity: 1, price: 49.99, total: 49.99 },
        ],
      },
    },
  })

  // 8. Reviews
  console.log('⭐ Seeding Reviews...')
  await prisma.review.create({
    data: {
      userId: customer1.id,
      productId: products[0].id,
      rating: 5,
      title: 'Amazing Laptop!',
      comment: 'This laptop is fantastic. Highly recommended!',
      verified: true,
      approved: true,
    },
  })

  await prisma.review.create({
    data: {
      userId: customer2.id,
      productId: products[0].id,
      rating: 4,
      title: 'Good laptop',
      comment: 'Very good performance, but a bit pricey.',
      verified: true,
      approved: true,
    },
  })

  // 9. Discount Codes
  console.log('🏷️ Seeding Discount Codes...')
  await prisma.discountCode.create({
    data: {
      code: 'WELCOME10',
      type: DiscountType.PERCENTAGE,
      value: 10,
      startDate: new Date(),
      isActive: true,
    },
  })

  await prisma.discountCode.create({
    data: {
      code: 'SUMMER25',
      type: DiscountType.FIXED_AMOUNT,
      value: 25,
      minOrderAmount: 100,
      startDate: new Date(),
      isActive: true,
    },
  })

  // 10. Blog Posts
  console.log('📝 Seeding Blog Posts...')
  await prisma.blogPost.create({
    data: {
      title: 'Welcome to Our Store',
      slug: 'welcome-to-our-store',
      content: '<h1>Welcome!</h1><p>Thank you for visiting our store...</p>',
      excerpt: 'A warm welcome message to our customers.',
      status: PostStatus.PUBLISHED,
      authorId: superAdmin.id,
      publishedAt: new Date(),
    },
  })

  // 11. Newsletter Subscribers
  console.log('📧 Seeding Newsletter Subscribers...')
  await prisma.newsletterSubscriber.create({
    data: {
      email: 'subscriber@example.com',
      name: 'News Reader',
      isActive: true,
      source: 'footer',
    },
  })

  // 12. Refunds
  console.log('💸 Seeding Refunds...')
  const orderItem = await prisma.orderItem.findFirst({ where: { orderId: order1.id } })
  if (orderItem) {
    await prisma.refund.create({
      data: {
        rmaNumber: 'RMA-001',
        orderId: order1.id,
        requestedById: customer1.id,
        status: RefundStatus.PENDING,
        reason: RefundReason.CHANGED_MIND,
        refundAmount: 29.99,
        refundItems: {
          create: [{
            quantity: 1,
            orderItemId: orderItem.id,
            productId: orderItem.productId,
          }],
        },
      },
    })
  }

  console.log('✅ Test data seeding completed!')
  console.log('\n📋 Test Accounts:')
  console.log('  Super Admin: admin@example.com / password123')
  console.log('  Admin: manager@example.com / password123')
  console.log('  Customer 1: alice@example.com / password123')
  console.log('  Customer 2: bob@example.com / password123')
  console.log('  Customer 3: charlie@example.com / password123')
  console.log('\n⚡ Flash Sales:')
  console.log(`  Active: ${activeFlashSale.name} (${activeFlashSale.status})`)
  console.log(`  Scheduled: ${scheduledFlashSale.name} (${scheduledFlashSale.status})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

