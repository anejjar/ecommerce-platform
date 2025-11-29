#!/usr/bin/env tsx
/**
 * Script to clean up merged feature flags from the database
 * This removes all "_enhanced" feature variants that have been merged into their base features
 *
 * Usage: npx tsx scripts/cleanup-merged-features.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// List of enhanced features to remove (they've been merged into base features)
const FEATURES_TO_REMOVE = [
  'analytics_dashboard_enhanced',
  'cms_enhanced',
  'abandoned_cart_enhanced',
  'wishlist_enhanced',
  'bulk_operations_enhanced',
  'refund_management_enhanced',
  'advanced_reviews_enhanced',
  'loyalty_program_enhanced',
  'multi_admin_enhanced',
];

async function main() {
  console.log('🧹 Cleaning up merged feature flags...\n');

  console.log('Features to remove:');
  FEATURES_TO_REMOVE.forEach((name, index) => {
    console.log(`  ${index + 1}. ${name}`);
  });
  console.log('');

  let deletedCount = 0;
  let notFoundCount = 0;

  for (const featureName of FEATURES_TO_REMOVE) {
    try {
      // Check if the feature exists
      const feature = await prisma.featureFlag.findUnique({
        where: { name: featureName },
      });

      if (!feature) {
        console.log(`⚠️  Feature "${featureName}" not found in database (already removed or never created)`);
        notFoundCount++;
        continue;
      }

      // Delete the feature
      await prisma.featureFlag.delete({
        where: { name: featureName },
      });

      console.log(`✅ Deleted: ${featureName}`);
      deletedCount++;
    } catch (error) {
      console.error(`❌ Error deleting "${featureName}":`, error);
    }
  }

  console.log('');
  console.log('━'.repeat(60));
  console.log(`Summary:`);
  console.log(`  ✅ Deleted: ${deletedCount} features`);
  console.log(`  ⚠️  Not found: ${notFoundCount} features`);
  console.log(`  📋 Total processed: ${FEATURES_TO_REMOVE.length} features`);
  console.log('━'.repeat(60));
  console.log('');

  if (deletedCount > 0) {
    console.log('✨ Database cleanup complete!');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Run: npx tsx prisma/seed-features.ts');
    console.log('     (This will create/update the merged feature flags)');
    console.log('  2. Verify features in admin panel: /admin/features');
    console.log('  3. Check that build status shows correctly (partial/pending)');
  } else {
    console.log('ℹ️  No features were deleted. Database might already be clean.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error during cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
