import { PrismaClient, UserRole, OrderStatus, PaymentStatus, RefundStatus, RefundReason, DiscountType, PostStatus, FlashSaleStatus } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

// Helper function to generate random date within range
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Helper function to generate random number
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function main() {
  console.log('🚀 Starting SUPER CHARGED production data seeding...')
  console.log('⚠️  This will create a large database with thousands of records!')

  // 1. Clean up
  console.log('🧹 Cleaning up existing data...')
  try {
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
    await prisma.user.deleteMany({})
    console.log('🧹 Cleanup finished.')
  } catch (error) {
    console.warn('⚠️ Error during cleanup:', error)
  }

  // 2. Feature Flags (all enabled for production)
  console.log('🚩 Seeding Feature Flags...')
  await prisma.featureFlag.deleteMany({})
  const features = [
    // Analytics
    { name: 'analytics_dashboard', displayName: 'Analytics & Reporting Dashboard', description: 'Comprehensive analytics platform', category: 'analytics', tier: 'PRO' as const, enabled: true },
    { name: 'sales_reports', displayName: 'Sales Reports', description: 'Detailed sales reporting', category: 'analytics', tier: 'PRO' as const, enabled: true },
    { name: 'customer_analytics', displayName: 'Customer Analytics', description: 'Customer behavior analysis', category: 'analytics', tier: 'PRO' as const, enabled: true },
    // Operations
    { name: 'flash_sales', displayName: 'Flash Sales & Scheduled Promotions', description: 'Time-limited promotional system', category: 'operations', tier: 'PRO' as const, enabled: true },
    { name: 'refund_management', displayName: 'Refund Management', description: 'Refund processing', category: 'operations', tier: 'PRO' as const, enabled: true },
    { name: 'inventory_management', displayName: 'Inventory Management', description: 'Stock management', category: 'operations', tier: 'PRO' as const, enabled: true },
    { name: 'template_manager', displayName: 'Template Manager', description: 'Email and document templates', category: 'operations', tier: 'PRO' as const, enabled: true },
    { name: 'product_import_export', displayName: 'Product Import/Export', description: 'Bulk product management', category: 'operations', tier: 'PRO' as const, enabled: true },
    // Marketing
    { name: 'abandoned_cart', displayName: 'Abandoned Cart Recovery', description: 'Cart recovery', category: 'marketing', tier: 'PRO' as const, enabled: true },
    { name: 'cms', displayName: 'Content Management', description: 'CMS system', category: 'marketing', tier: 'PRO' as const, enabled: true },
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

  // 3. Users (1000 users)
  console.log('👤 Seeding 1000 Users...')
  const password = await hash('password123', 12)
  const users = []

  // Create admins
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Super Admin',
      password,
      role: 'SUPERADMIN',
      emailVerified: new Date(),
    },
  })
  users.push(superAdmin)

  const admin = await prisma.user.create({
    data: {
      email: 'manager@example.com',
      name: 'Store Manager',
      password,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })
  users.push(admin)

  // Create 998 customers
  for (let i = 1; i <= 998; i++) {
    const user = await prisma.user.create({
      data: {
        email: `customer${i}@example.com`,
        name: `Customer ${i}`,
        password,
        role: 'CUSTOMER',
        emailVerified: randomDate(new Date(2020, 0, 1), new Date()),
      },
    })
    users.push(user)
    if (i % 100 === 0) {
      console.log(`  Created ${i} customers...`)
    }
  }

  // 4. Categories (50 categories)
  console.log('📂 Seeding 50 Categories...')
  const categories = []
  const categoryNames = [
    'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Beauty', 'Health',
    'Automotive', 'Pet Supplies', 'Food & Beverage', 'Office Supplies', 'Jewelry', 'Watches',
    'Shoes', 'Bags', 'Furniture', 'Kitchen', 'Bedding', 'Bath', 'Outdoor', 'Tools', 'Musical Instruments',
    'Art Supplies', 'Baby Products', 'Gaming', 'Photography', 'Travel', 'Fitness', 'Camping',
    'Fishing', 'Cycling', 'Running', 'Yoga', 'Swimming', 'Tennis', 'Basketball', 'Soccer',
    'Baseball', 'Golf', 'Hiking', 'Skiing', 'Snowboarding', 'Surfing', 'Skateboarding',
    'Collectibles', 'Antiques', 'Vintage', 'Handmade', 'Custom'
  ]

  for (let i = 0; i < 50; i++) {
    const category = await prisma.category.create({
      data: {
        name: categoryNames[i] || `Category ${i + 1}`,
        slug: (categoryNames[i] || `category-${i + 1}`).toLowerCase().replace(/\s+/g, '-'),
        description: `Description for ${categoryNames[i] || `Category ${i + 1}`}`,
      },
    })
    categories.push(category)
  }

  // 5. Products (5000 products)
  console.log('📦 Seeding 5000 Products...')
  const products = []
  const productNames = [
    'Premium', 'Deluxe', 'Professional', 'Classic', 'Modern', 'Vintage', 'Luxury', 'Standard',
    'Advanced', 'Basic', 'Ultra', 'Super', 'Mega', 'Pro', 'Elite', 'Essential'
  ]

  for (let i = 1; i <= 5000; i++) {
    const category = categories[randomInt(0, categories.length - 1)]
    const namePrefix = productNames[randomInt(0, productNames.length - 1)]
    const product = await prisma.product.create({
      data: {
        name: `${namePrefix} Product ${i}`,
        slug: `${namePrefix.toLowerCase()}-product-${i}`.replace(/\s+/g, '-'),
        description: `High-quality ${namePrefix.toLowerCase()} product number ${i}. Perfect for your needs.`,
        price: randomInt(10, 2000),
        comparePrice: randomInt(15, 2500),
        stock: randomInt(0, 500),
        sku: `SKU-${String(i).padStart(6, '0')}`,
        published: Math.random() > 0.1, // 90% published
        featured: Math.random() > 0.8, // 20% featured
        categoryId: category.id,
        images: {
          create: [{
            url: `https://images.unsplash.com/photo-${Math.random().toString(36).substring(7)}?auto=format&fit=crop&q=80&w=1000`,
            position: 0,
            alt: `${namePrefix} Product ${i}`,
          }],
        },
      },
    })
    products.push(product)
    if (i % 500 === 0) {
      console.log(`  Created ${i} products...`)
    }
  }

  // 6. Flash Sales (20 flash sales)
  console.log('⚡ Seeding 20 Flash Sales...')
  const flashSales = []
  const now = new Date()
  
  for (let i = 1; i <= 20; i++) {
    const startDate = randomDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000))
    const endDate = new Date(startDate.getTime() + randomInt(1, 7) * 24 * 60 * 60 * 1000)
    const isActive = startDate <= now && endDate > now
    const status = isActive ? 'ACTIVE' : (startDate > now ? 'SCHEDULED' : 'ENDED')

    const flashSale = await prisma.flashSale.create({
      data: {
        name: `Flash Sale ${i}`,
        description: `Amazing deals on selected products - Sale ${i}`,
        discountType: Math.random() > 0.5 ? 'PERCENTAGE' : 'FIXED_AMOUNT',
        discountValue: Math.random() > 0.5 ? randomInt(10, 50) : randomInt(5, 100),
        startDate,
        endDate,
        status: status as FlashSaleStatus,
        isActive: isActive,
        priority: randomInt(0, 10),
        bannerText: `Limited Time Offer ${i}!`,
      },
    })
    flashSales.push(flashSale)

    // Add 10-50 random products to each flash sale
    const productCount = randomInt(10, 50)
    const selectedProducts = products.sort(() => 0.5 - Math.random()).slice(0, productCount)
    const flashSaleProducts = selectedProducts.map((product) => {
      const originalPrice = Number(product.price)
      const discountValue = flashSale.discountValue
      const salePrice = flashSale.discountType === 'PERCENTAGE'
        ? originalPrice * (1 - discountValue / 100)
        : Math.max(0, originalPrice - discountValue)

      return {
        flashSaleId: flashSale.id,
        productId: product.id,
        originalPrice,
        salePrice,
        maxQuantity: randomInt(10, 100),
        soldQuantity: randomInt(0, 50),
      }
    })

    await prisma.flashSaleProduct.createMany({ data: flashSaleProducts })
  }

  // 7. Orders (10000 orders)
  console.log('📦 Seeding 10000 Orders...')
  const orderStatuses: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
  const paymentStatuses: PaymentStatus[] = ['PENDING', 'PAID', 'FAILED', 'REFUNDED']

  for (let i = 1; i <= 10000; i++) {
    const customer = users[randomInt(2, users.length - 1)] // Skip admins
    const address = await prisma.address.create({
      data: {
        userId: customer.id,
        firstName: customer.name?.split(' ')[0] || 'John',
        lastName: customer.name?.split(' ')[1] || 'Doe',
        address1: `${randomInt(1, 9999)} Main St`,
        city: `City ${randomInt(1, 100)}`,
        state: `ST`,
        postalCode: String(randomInt(10000, 99999)),
        country: 'USA',
        phone: `555-${String(randomInt(1000, 9999))}`,
      },
    })

    const itemCount = randomInt(1, 5)
    const selectedProducts = products.sort(() => 0.5 - Math.random()).slice(0, itemCount)
    const items = selectedProducts.map((product) => ({
      productId: product.id,
      quantity: randomInt(1, 3),
      price: Number(product.price),
      total: Number(product.price) * randomInt(1, 3),
    }))

    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.1
    const shipping = randomInt(0, 20)
    const total = subtotal + tax + shipping

    await prisma.order.create({
      data: {
        orderNumber: `ORD-${String(i).padStart(8, '0')}`,
        userId: customer.id,
        status: orderStatuses[randomInt(0, orderStatuses.length - 1)],
        paymentStatus: paymentStatuses[randomInt(0, paymentStatuses.length - 1)],
        subtotal,
        tax,
        shipping,
        total,
        shippingAddressId: address.id,
        createdAt: randomDate(new Date(2023, 0, 1), new Date()),
        items: {
          create: items,
        },
      },
    })

    if (i % 1000 === 0) {
      console.log(`  Created ${i} orders...`)
    }
  }

  // 8. Reviews (5000 reviews)
  console.log('⭐ Seeding 5000 Reviews...')
  for (let i = 1; i <= 5000; i++) {
    const customer = users[randomInt(2, users.length - 1)]
    const product = products[randomInt(0, products.length - 1)]
    
    await prisma.review.create({
      data: {
        userId: customer.id,
        productId: product.id,
        rating: randomInt(1, 5),
        title: `Review ${i}`,
        comment: `This is review number ${i}. ${randomInt(1, 5) >= 4 ? 'Great product!' : 'Could be better.'}`,
        verified: Math.random() > 0.3,
        approved: Math.random() > 0.2,
        createdAt: randomDate(new Date(2023, 0, 1), new Date()),
      },
    })

    if (i % 1000 === 0) {
      console.log(`  Created ${i} reviews...`)
    }
  }

  // 9. Discount Codes (50 codes)
  console.log('🏷️ Seeding 50 Discount Codes...')
  for (let i = 1; i <= 50; i++) {
    await prisma.discountCode.create({
      data: {
        code: `CODE${i}`,
        type: Math.random() > 0.5 ? DiscountType.PERCENTAGE : DiscountType.FIXED_AMOUNT,
        value: Math.random() > 0.5 ? randomInt(5, 50) : randomInt(5, 100),
        minOrderAmount: Math.random() > 0.5 ? randomInt(50, 200) : null,
        maxUses: randomInt(10, 1000),
        usedCount: randomInt(0, 500),
        startDate: randomDate(new Date(2023, 0, 1), new Date()),
        endDate: randomDate(new Date(), new Date(2025, 11, 31)),
        isActive: Math.random() > 0.3,
      },
    })
  }

  // 10. Blog Posts (100 posts)
  console.log('📝 Seeding 100 Blog Posts...')
  for (let i = 1; i <= 100; i++) {
    await prisma.blogPost.create({
      data: {
        title: `Blog Post ${i}`,
        slug: `blog-post-${i}`,
        content: `<h1>Blog Post ${i}</h1><p>This is the content of blog post ${i}...</p>`,
        excerpt: `Excerpt for blog post ${i}`,
        status: Math.random() > 0.2 ? PostStatus.PUBLISHED : PostStatus.DRAFT,
        authorId: superAdmin.id,
        publishedAt: Math.random() > 0.2 ? randomDate(new Date(2023, 0, 1), new Date()) : null,
        createdAt: randomDate(new Date(2023, 0, 1), new Date()),
      },
    })
  }

  // 11. Newsletter Subscribers (500 subscribers)
  console.log('📧 Seeding 500 Newsletter Subscribers...')
  for (let i = 1; i <= 500; i++) {
    await prisma.newsletterSubscriber.create({
      data: {
        email: `subscriber${i}@example.com`,
        name: `Subscriber ${i}`,
        isActive: Math.random() > 0.1,
        source: ['footer', 'checkout', 'popup'][randomInt(0, 2)],
        subscribedAt: randomDate(new Date(2023, 0, 1), new Date()),
      },
    })
  }

  console.log('\n✅ SUPER CHARGED production data seeding completed!')
  console.log('\n📊 Database Statistics:')
  console.log(`  Users: 1000 (2 admins, 998 customers)`)
  console.log(`  Categories: 50`)
  console.log(`  Products: 5000`)
  console.log(`  Flash Sales: 20`)
  console.log(`  Orders: 10000`)
  console.log(`  Reviews: 5000`)
  console.log(`  Discount Codes: 50`)
  console.log(`  Blog Posts: 100`)
  console.log(`  Newsletter Subscribers: 500`)
  console.log('\n🔑 Test Accounts:')
  console.log('  Super Admin: admin@example.com / password123')
  console.log('  Admin: manager@example.com / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

