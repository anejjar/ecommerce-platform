/**
 * Seed Built-in Themes
 * Run this script to populate the database with built-in themes
 */

import { prisma } from '../src/lib/prisma';
import { defaultThemes } from '../src/lib/themes/default-themes';
import { validateThemeConfig } from '../src/lib/themes/theme-validator';

async function seedThemes() {
  console.log('🌱 Seeding built-in themes...');

  try {
    // Validate and create/update each theme
    for (const themeData of defaultThemes) {
      const validation = validateThemeConfig(themeData.config);
      
      if (!validation.valid) {
        console.error(`❌ Invalid theme config for ${themeData.name}:`, validation.errors);
        continue;
      }

      // Check if theme with this name already exists
      const existing = await prisma.theme.findUnique({
        where: { name: themeData.name },
      });

      if (existing) {
        // Update existing built-in theme
        if (existing.isBuiltIn) {
          await prisma.theme.update({
            where: { name: themeData.name },
            data: {
              displayName: themeData.displayName,
              description: themeData.description,
              version: themeData.config.metadata.version,
              author: themeData.config.metadata.author,
              themeConfig: themeData.config as any,
              // Preserve isActive status
            },
          });
          console.log(`🔄 Updated theme: ${themeData.displayName}`);
        } else {
          console.log(`⚠️  Theme "${themeData.name}" exists but is not built-in. Skipping.`);
        }
        continue;
      }

      // Create theme (first one will be active by default)
      const isFirst = defaultThemes.indexOf(themeData) === 0;
      
      await prisma.theme.create({
        data: {
          name: themeData.name,
          displayName: themeData.displayName,
          description: themeData.description,
          version: themeData.config.metadata.version,
          author: themeData.config.metadata.author,
          isBuiltIn: true,
          isActive: isFirst, // Activate first theme by default
          themeConfig: themeData.config as any,
        },
      });

      console.log(`✅ Created theme: ${themeData.displayName}`);
    }

    // Ensure feature flag exists
    const featureFlag = await prisma.featureFlag.findUnique({
      where: { name: 'storefront_themes' },
    });

    if (!featureFlag) {
      await prisma.featureFlag.create({
        data: {
          name: 'storefront_themes',
          displayName: 'Storefront Themes',
          description: 'Premium theme system for customizing storefront appearance',
          category: 'appearance',
          tier: 'PRO',
          enabled: false, // Disabled by default, superadmin can enable
        },
      });
      console.log('✅ Created feature flag: storefront_themes');
    }

    console.log('✨ Theme seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding themes:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedThemes()
    .then(() => {
      console.log('✅ Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}

export { seedThemes };

