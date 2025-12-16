
import { PrismaClient, FeatureTier } from '@prisma/client'
import { seedFeatures } from './seed-features'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting essential data seeding...')

    // 1. Feature Flags - Import from centralized source
    await seedFeatures(true) // true = enable all features for development/testing

    // 2. Store Settings
    console.log('⚙️ Seeding Store Settings...')
    const settings = [
        // General
        { key: 'general_store_name', value: 'My E-Commerce Store', category: 'general' },
        { key: 'general_store_tagline', value: 'Best products, best prices', category: 'general' },
        { key: 'general_currency', value: 'USD', category: 'general' },
        { key: 'general_currency_symbol', value: '$', category: 'general' },

        // SEO
        { key: 'seo_meta_title', value: 'My E-Commerce Store - Shop Online', category: 'seo' },
        { key: 'seo_meta_description', value: 'Find the best products at unbeatable prices.', category: 'seo' },

        // Appearance
        { key: 'appearance_primary_color', value: '#3b82f6', category: 'appearance' }, // blue-500
        { key: 'appearance_secondary_color', value: '#1e40af', category: 'appearance' }, // blue-800

        // Shipping
        { key: 'shipping_enable_free', value: 'true', category: 'shipping' },
        { key: 'shipping_free_threshold', value: '100', category: 'shipping' },
    ]

    for (const setting of settings) {
        await prisma.storeSetting.upsert({
            where: { key: setting.key },
            update: {}, // Don't overwrite existing values
            create: {
                key: setting.key,
                value: setting.value,
                category: setting.category,
            },
        })
    }
    console.log('✅ Store Settings seeded (skipped if existing).')

    // 3. System Permission/Roles (Optional - just ensuring Enum roles exist in schema is usually enough, but here we can add basic shared resources if needed)

    console.log('✅ Essential seeding completed!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
