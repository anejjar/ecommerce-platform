import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎁 Seeding loyalty program data...');

  // Create default loyalty tiers
  const tiers = [
    {
      name: 'Bronze',
      pointsRequired: 0,
      color: '#CD7F32',
      icon: '🥉',
      benefitsDescription:
        'Welcome tier! Earn points on every purchase. Basic tier benefits include points on purchases and access to exclusive promotions.',
      earlyAccessEnabled: false,
      earlyAccessHours: 0,
      discountPercentage: 0,
      pointsMultiplier: 1.0,
      freeShippingThreshold: null,
      displayOrder: 1,
    },
    {
      name: 'Silver',
      pointsRequired: 1000,
      color: '#C0C0C0',
      icon: '🥈',
      benefitsDescription:
        'Silver members enjoy enhanced rewards! Benefits include 1.25x points multiplier on purchases, early access to flash sales (24 hours before public), and priority customer support.',
      earlyAccessEnabled: true,
      earlyAccessHours: 24,
      discountPercentage: 0,
      pointsMultiplier: 1.25,
      freeShippingThreshold: null,
      displayOrder: 2,
    },
    {
      name: 'Gold',
      pointsRequired: 5000,
      color: '#FFD700',
      icon: '🥇',
      benefitsDescription:
        'Gold status unlocks premium perks! Enjoy 1.5x points multiplier, 48-hour early access to sales and new products, 5% automatic discount on all orders, free shipping on orders over $50, and exclusive Gold member promotions.',
      earlyAccessEnabled: true,
      earlyAccessHours: 48,
      discountPercentage: 5,
      pointsMultiplier: 1.5,
      freeShippingThreshold: 50,
      displayOrder: 3,
    },
    {
      name: 'Platinum',
      pointsRequired: 15000,
      color: '#E5E4E2',
      icon: '💎',
      benefitsDescription:
        'Platinum - the ultimate VIP experience! Benefits include 2x points multiplier, 72-hour exclusive early access to all sales and launches, 10% automatic discount on every purchase, free shipping on all orders, dedicated VIP support, exclusive Platinum-only products, and special anniversary rewards.',
      earlyAccessEnabled: true,
      earlyAccessHours: 72,
      discountPercentage: 10,
      pointsMultiplier: 2.0,
      freeShippingThreshold: 0,
      displayOrder: 4,
    },
  ];

  console.log('Creating loyalty tiers...');
  for (const tier of tiers) {
    await prisma.loyaltyTier.upsert({
      where: { name: tier.name },
      update: tier,
      create: tier,
    });
    console.log(`  ✓ ${tier.name} tier created`);
  }

  // Create default loyalty settings
  console.log('Creating loyalty settings...');
  await prisma.loyaltySettings.upsert({
    where: { id: 'default' },
    update: {
      pointsPerDollar: 1,
      pointsPerReview: 50,
      pointsPerReferral: 500,
      pointsPerSocialShare: 25,
      redemptionRate: 100, // 100 points = $1
      pointsExpirationDays: 365,
      enableEmailNotifications: true,
      minimumRedemptionPoints: 100,
    },
    create: {
      id: 'default',
      pointsPerDollar: 1,
      pointsPerReview: 50,
      pointsPerReferral: 500,
      pointsPerSocialShare: 25,
      redemptionRate: 100,
      pointsExpirationDays: 365,
      enableEmailNotifications: true,
      minimumRedemptionPoints: 100,
    },
  });
  console.log('  ✓ Loyalty settings created');

  console.log('✅ Loyalty program data seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding loyalty program:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
