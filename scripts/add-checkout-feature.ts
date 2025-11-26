/**
 * Script to add the checkout_customization feature flag to the database
 * Run with: npx tsx scripts/add-checkout-feature.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Adding checkout_customization feature flag...\n');

  try {
    // Check if feature already exists
    const existing = await prisma.featureFlag.findUnique({
      where: { name: 'checkout_customization' },
    });

    if (existing) {
      console.log('✅ Feature already exists!');
      console.log('📋 Details:');
      console.log(`   - Name: ${existing.name}`);
      console.log(`   - Display Name: ${existing.displayName}`);
      console.log(`   - Category: ${existing.category}`);
      console.log(`   - Tier: ${existing.tier}`);
      console.log(`   - Enabled: ${existing.enabled ? '✅ YES' : '❌ NO'}`);
      console.log(`\n💡 To enable it, go to /admin/features and toggle it ON\n`);
      return;
    }

    // Create the feature
    const feature = await prisma.featureFlag.create({
      data: {
        name: 'checkout_customization',
        displayName: 'Advanced Checkout Customization',
        description: 'Premium checkout customization with advanced branding, field customization, trust & security elements, and marketing & conversion features. Includes live preview and 31 advanced features across 4 phases.',
        category: 'sales',
        tier: 'PRO',
        enabled: false, // Disabled by default
      },
    });

    console.log('✅ Feature created successfully!\n');
    console.log('📋 Details:');
    console.log(`   - ID: ${feature.id}`);
    console.log(`   - Name: ${feature.name}`);
    console.log(`   - Display Name: ${feature.displayName}`);
    console.log(`   - Category: ${feature.category}`);
    console.log(`   - Tier: ${feature.tier}`);
    console.log(`   - Enabled: ${feature.enabled ? '✅ YES' : '❌ NO (default)'}`);
    console.log(`\n🎯 Next Steps:`);
    console.log(`   1. Go to /admin/features`);
    console.log(`   2. Find "Advanced Checkout Customization" in Sales category`);
    console.log(`   3. Toggle it ON to enable premium features`);
    console.log(`   4. Navigate to /admin/settings`);
    console.log(`   5. Click "Checkout" card (will show PREMIUM badge)`);
    console.log(`   6. Access all 49 premium features!\n`);
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error('Failed to add feature:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
