import { PrismaClient, PosOrderType, PosPaymentMethod } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting POS seed data...');

  // Get or create admin user for cashiers
  let admin = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  if (!admin) {
    const hashedPassword = await hash('admin123', 12);
    admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('✅ Created admin user');
  }

  // Get or create manager user for cashiers
  let manager = await prisma.user.findUnique({
    where: { email: 'manager@example.com' },
  });

  if (!manager) {
    const hashedPassword = await hash('manager123', 12);
    manager = await prisma.user.create({
      data: {
        email: 'manager@example.com',
        name: 'Store Manager',
        password: hashedPassword,
        role: 'MANAGER',
      },
    });
    console.log('✅ Created manager user');
  }

  // 1. Create Locations
  console.log('📍 Creating locations...');
  
  // Check if locations already exist
  const existingLocations = await prisma.location.findMany();
  const locationNames = existingLocations.map((l) => l.name);

  const locationsToCreate = [
    {
      name: 'Main Store',
      address: '123 Main Street, Downtown, City, State 12345',
      phone: '+1 (555) 123-4567',
      isActive: true,
      settings: JSON.stringify({
        taxRate: 0.1,
        currency: 'USD',
        timezone: 'America/New_York',
      }),
    },
    {
      name: 'Mall Location',
      address: '456 Mall Drive, Shopping Center, City, State 12345',
      phone: '+1 (555) 234-5678',
      isActive: true,
      settings: JSON.stringify({
        taxRate: 0.1,
        currency: 'USD',
        timezone: 'America/New_York',
      }),
    },
    {
      name: 'Airport Kiosk',
      address: 'Terminal 2, Gate 15, Airport, City, State 12345',
      phone: '+1 (555) 345-6789',
      isActive: true,
      settings: JSON.stringify({
        taxRate: 0.1,
        currency: 'USD',
        timezone: 'America/New_York',
      }),
    },
  ];

  const locations = [];
  for (const locData of locationsToCreate) {
    if (!locationNames.includes(locData.name)) {
      const location = await prisma.location.create({
        data: locData,
      });
      locations.push(location);
      locationNames.push(locData.name);
    } else {
      const existing = existingLocations.find((l) => l.name === locData.name);
      if (existing) locations.push(existing);
    }
  }

  console.log(`✅ Created ${locations.length} locations`);

  // 2. Create Cashiers
  console.log('👤 Creating cashiers...');

  // Create cashiers (only if they don't exist)
  const cashiers = [];
  
  const existingCashier1 = await prisma.cashier.findUnique({
    where: { userId: admin.id },
  });
  
  if (!existingCashier1 && locations[0]) {
    const cashier1 = await prisma.cashier.create({
      data: {
        userId: admin.id,
        locationId: locations[0].id,
        employeeId: 'EMP001',
        pin: await hash('1234', 10),
        isActive: true,
      },
    });
    cashiers.push(cashier1);
  } else if (existingCashier1) {
    cashiers.push(existingCashier1);
  }

  const existingCashier2 = await prisma.cashier.findUnique({
    where: { userId: manager.id },
  });
  
  if (!existingCashier2 && locations[1]) {
    const cashier2 = await prisma.cashier.create({
      data: {
        userId: manager.id,
        locationId: locations[1].id,
        employeeId: 'EMP002',
        pin: await hash('5678', 10),
        isActive: true,
      },
    });
    cashiers.push(cashier2);
  } else if (existingCashier2) {
    cashiers.push(existingCashier2);
  }

  console.log(`✅ Created ${cashiers.length} cashiers`);

  // 3. Create sample POS orders (optional - for testing)
  console.log('🛒 Creating sample POS orders...');

  // Note: This requires products to exist first
  const products = await prisma.product.findMany({ take: 3 });
  
  if (products.length >= 2 && cashiers.length > 0) {
    // Create a sample completed POS order
    const sampleOrder = await prisma.order.create({
      data: {
        orderNumber: `ORD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-0001`,
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        subtotal: 50.00,
        tax: 5.00,
        shipping: 0,
        total: 55.00,
        isPosOrder: true,
        items: {
          create: [
            {
              productId: products[0].id,
              quantity: 2,
              price: products[0].price,
              total: Number(products[0].price) * 2,
            },
            {
              productId: products[1].id,
              quantity: 1,
              price: products[1].price,
              total: Number(products[1].price),
            },
          ],
        },
      },
    });

    const posOrder = await prisma.posOrder.create({
      data: {
        orderType: 'DINE_IN',
        locationId: locations[0].id,
        cashierId: cashiers[0].id,
        tableNumber: '5',
        customerName: 'John Doe',
        paymentMethod: 'CASH',
        receiptPrinted: true,
        orderId: sampleOrder.id,
      },
    });

    console.log(`✅ Created sample POS order: ${posOrder.id}`);
  } else {
    console.log('⚠️  Skipping sample POS orders (need at least 2 products)');
  }

  console.log('\n✨ POS seed data completed!');
  console.log('\n📋 Summary:');
  console.log(`   - Locations: ${locations.length}`);
  console.log(`   - Cashiers: ${cashiers.length}`);
  console.log('\n🔑 Cashier PINs (for testing):');
  console.log('   - Admin Cashier: 1234');
  console.log('   - Manager Cashier: 5678');
  console.log('\n📍 Locations created:');
  locations.forEach((loc) => {
    console.log(`   - ${loc.name} (${loc.id})`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error seeding POS data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

