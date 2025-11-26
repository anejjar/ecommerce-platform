/**
 * Script to delete the deprecated address_autocomplete feature flag
 * Run with: npx tsx scripts/delete-address-autocomplete.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Deleting deprecated address_autocomplete feature flag...\n');

  try {
    // Check if feature exists
    const existing = await prisma.featureFlag.findUnique({
      where: { name: 'address_autocomplete' },
    });

    if (!existing) {
      console.log('✅ Feature already deleted or never existed.');
      return;
    }

    // Delete the feature
    await prisma.featureFlag.delete({
      where: { name: 'address_autocomplete' },
    });

    console.log('✅ Successfully deleted address_autocomplete feature!\n');
    console.log('📋 Deleted Feature:');
    console.log(`   - Name: ${existing.name}`);
    console.log(`   - Display Name: ${existing.displayName}`);
    console.log(`\n✨ Address autocomplete is now part of checkout_customization feature.\n`);
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error('Failed to delete feature:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
