/**
 * Script to enable the checkout_customization feature flag
 * Run with: npx tsx scripts/enable-checkout-feature.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Enabling checkout_customization feature flag...\n');

  try {
    // Check if feature exists
    const existing = await prisma.featureFlag.findUnique({
      where: { name: 'checkout_customization' },
    });

    if (!existing) {
      console.log('❌ Feature not found! Run add-checkout-feature.ts first.');
      return;
    }

    // Enable the feature
    const feature = await prisma.featureFlag.update({
      where: { name: 'checkout_customization' },
      data: { enabled: true },
    });

    console.log('✅ Feature enabled successfully!\n');
    console.log('📋 Details:');
    console.log(`   - ID: ${feature.id}`);
    console.log(`   - Name: ${feature.name}`);
    console.log(`   - Display Name: ${feature.displayName}`);
    console.log(`   - Category: ${feature.category}`);
    console.log(`   - Tier: ${feature.tier}`);
    console.log(`   - Enabled: ${feature.enabled ? '✅ YES' : '❌ NO'}`);
    console.log(`\n🎯 Next Steps:`);
    console.log(`   1. Visit /admin/settings`);
    console.log(`   2. Click "Checkout" card`);
    console.log(`   3. Access all 49 premium features including address autocomplete!`);
    console.log(`   4. Test address autocomplete in customer checkout page\n`);

    // Also disable the deprecated address_autocomplete feature if it exists
    const deprecatedFeature = await prisma.featureFlag.findUnique({
      where: { name: 'address_autocomplete' },
    });

    if (deprecatedFeature && deprecatedFeature.enabled) {
      await prisma.featureFlag.update({
        where: { name: 'address_autocomplete' },
        data: { enabled: false },
      });
      console.log('✅ Disabled deprecated address_autocomplete feature\n');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error('Failed to enable feature:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
