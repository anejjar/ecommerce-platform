import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create admin user
  const hashedPassword = await hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(`Created admin user: ${admin.email}`);

  // Create sample categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'clothing' },
      update: {},
      create: {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Apparel and fashion items',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'books' },
      update: {},
      create: {
        name: 'Books',
        slug: 'books',
        description: 'Books and reading materials',
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'laptop-pro-15' },
      update: {},
      create: {
        name: 'Laptop Pro 15',
        slug: 'laptop-pro-15',
        description: 'High-performance laptop with 15-inch display',
        price: 1299.99,
        stock: 10,
        sku: 'LAP-001',
        published: true,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'wireless-mouse' },
      update: {},
      create: {
        name: 'Wireless Mouse',
        slug: 'wireless-mouse',
        description: 'Ergonomic wireless mouse with precision tracking',
        price: 29.99,
        stock: 50,
        sku: 'MOU-001',
        published: true,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'blue-t-shirt' },
      update: {},
      create: {
        name: 'Blue T-Shirt',
        slug: 'blue-t-shirt',
        description: 'Comfortable cotton t-shirt in blue',
        price: 19.99,
        stock: 100,
        sku: 'TSH-001',
        published: true,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'classic-jeans' },
      update: {},
      create: {
        name: 'Classic Jeans',
        slug: 'classic-jeans',
        description: 'Durable denim jeans with classic fit',
        price: 49.99,
        stock: 75,
        sku: 'JEA-001',
        published: true,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'programming-book' },
      update: {},
      create: {
        name: 'Programming Fundamentals',
        slug: 'programming-book',
        description: 'Learn programming from scratch',
        price: 34.99,
        stock: 30,
        sku: 'BOO-001',
        published: true,
        categoryId: categories[2].id,
      },
    }),
  ]);

  console.log(`Created ${products.length} products`);

  // Create sample customer users
  const customerPassword = await hash('customer123', 12);

  const customers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        email: 'john@example.com',
        name: 'John Doe',
        password: customerPassword,
        role: 'CUSTOMER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: {
        email: 'jane@example.com',
        name: 'Jane Smith',
        password: customerPassword,
        role: 'CUSTOMER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: {
        email: 'bob@example.com',
        name: 'Bob Johnson',
        password: customerPassword,
        role: 'CUSTOMER',
      },
    }),
  ]);

  console.log(`Created ${customers.length} customer users`);

  // Delete existing orders and addresses to allow re-seeding
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.address.deleteMany({});
  console.log('Cleared existing orders and addresses');

  // Create sample orders
  // Order 1: John's delivered order
  const address1 = await prisma.address.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      phone: '555-0001',
    },
  });

  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-20250101-0001',
      userId: customers[0].id,
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      subtotal: 1329.98,
      tax: 132.99,
      shipping: 0,
      total: 1462.97,
      shippingAddressId: address1.id,
      items: {
        create: [
          {
            productId: products[0].id, // Laptop
            quantity: 1,
            price: 1299.99,
            total: 1299.99,
          },
          {
            productId: products[1].id, // Mouse
            quantity: 1,
            price: 29.99,
            total: 29.99,
          },
        ],
      },
    },
  });

  console.log(`Created order: ${order1.orderNumber}`);

  // Order 2: Jane's shipped order
  const address2 = await prisma.address.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      address1: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'USA',
      phone: '555-0002',
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-20250102-0001',
      userId: customers[1].id,
      status: 'SHIPPED',
      paymentStatus: 'PAID',
      subtotal: 69.98,
      tax: 6.99,
      shipping: 10,
      total: 86.97,
      shippingAddressId: address2.id,
      items: {
        create: [
          {
            productId: products[2].id, // T-Shirt
            quantity: 1,
            price: 19.99,
            total: 19.99,
          },
          {
            productId: products[3].id, // Jeans
            quantity: 1,
            price: 49.99,
            total: 49.99,
          },
        ],
      },
    },
  });

  console.log(`Created order: ${order2.orderNumber}`);

  // Order 3: John's pending order
  const address3 = await prisma.address.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      phone: '555-0001',
    },
  });

  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-20250103-0001',
      userId: customers[0].id,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      subtotal: 34.99,
      tax: 3.49,
      shipping: 10,
      total: 48.48,
      shippingAddressId: address3.id,
      items: {
        create: [
          {
            productId: products[4].id, // Book
            quantity: 1,
            price: 34.99,
            total: 34.99,
          },
        ],
      },
    },
  });

  console.log(`Created order: ${order3.orderNumber}`);

  // Order 4: Guest order (no userId)
  const address4 = await prisma.address.create({
    data: {
      firstName: 'Guest',
      lastName: 'User',
      address1: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60601',
      country: 'USA',
      phone: '555-0003',
    },
  });

  const order4 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-20250104-0001',
      isGuest: true,
      guestEmail: 'guest@example.com',
      status: 'PROCESSING',
      paymentStatus: 'PAID',
      subtotal: 29.99,
      tax: 2.99,
      shipping: 10,
      total: 42.98,
      shippingAddressId: address4.id,
      items: {
        create: [
          {
            productId: products[1].id, // Mouse
            quantity: 1,
            price: 29.99,
            total: 29.99,
          },
        ],
      },
    },
  });

  console.log(`Created guest order: ${order4.orderNumber}`);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
