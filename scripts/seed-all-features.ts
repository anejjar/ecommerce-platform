import { PrismaClient } from '@prisma/client';
import { featureDocs } from '../src/lib/feature-docs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding all features from feature-docs.ts...');

  const features = Object.values(featureDocs).map((doc) => ({
    name: doc.key,
    displayName: doc.title,
    description: doc.overview,
    category: doc.category,
    tier: doc.tier,
    enabled: false, // Default to disabled, superadmin can enable
  }));

  console.log(`📝 Found ${features.length} features to seed`);

  let created = 0;
  let updated = 0;

  for (const feature of features) {
    try {
      const result = await prisma.featureFlag.upsert({
        where: { name: feature.name },
        update: {
          displayName: feature.displayName,
          description: feature.description,
          category: feature.category,
          tier: feature.tier,
          // Don't update enabled status if feature already exists
        },
        create: feature,
      });

      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        created++;
      } else {
        updated++;
      }
    } catch (error) {
      console.error(`❌ Error seeding feature ${feature.name}:`, error);
    }
  }

  console.log(`✅ Seeding complete!`);
  console.log(`   Created: ${created} features`);
  console.log(`   Updated: ${updated} features`);
  console.log(`   Total: ${features.length} features`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding features:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

