import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Adding Traffic Analytics feature flag...');

  // Create or update traffic analytics feature
  await prisma.featureFlag.upsert({
    where: { name: 'traffic_analytics' },
    update: {
      displayName: 'Traffic Analytics & Attribution',
      description: 'Advanced traffic source tracking with UTM parameters, referrer detection, and full customer journey attribution. Track which platforms (Facebook, Google, TikTok, etc.) drive conversions and calculate ROI per source.',
      category: 'analytics',
      tier: 'PRO',
      enabled: true,
    },
    create: {
      name: 'traffic_analytics',
      displayName: 'Traffic Analytics & Attribution',
      description: 'Advanced traffic source tracking with UTM parameters, referrer detection, and full customer journey attribution. Track which platforms (Facebook, Google, TikTok, etc.) drive conversions and calculate ROI per source.',
      category: 'analytics',
      tier: 'PRO',
      enabled: true,
    },
  });

  console.log('✅ Traffic Analytics feature flag created successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding traffic analytics feature:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
