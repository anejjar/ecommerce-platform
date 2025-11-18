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
