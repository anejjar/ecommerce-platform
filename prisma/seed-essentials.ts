
import { PrismaClient, FeatureTier } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting essential data seeding...')

    // 1. Feature Flags
    console.log('🚩 Seeding Feature Flags...')
    const features = [
        // Analytics
        { name: 'analytics_dashboard', displayName: 'Analytics & Reporting Dashboard', description: 'Comprehensive analytics platform', category: 'analytics', tier: 'PRO' as const, enabled: true },
        { name: 'sales_reports', displayName: 'Sales Reports', description: 'Detailed sales reporting', category: 'analytics', tier: 'PRO' as const, enabled: true },
        { name: 'customer_analytics', displayName: 'Customer Analytics', description: 'Customer behavior analysis', category: 'analytics', tier: 'PRO' as const, enabled: true },
        // Operations
        { name: 'flash_sales', displayName: 'Flash Sales & Scheduled Promotions', description: 'Time-limited promotional system', category: 'operations', tier: 'PRO' as const, enabled: true },
        { name: 'refund_management', displayName: 'Refund Management', description: 'Refund processing', category: 'operations', tier: 'PRO' as const, enabled: true },
        { name: 'inventory_management', displayName: 'Inventory Management', description: 'Stock management', category: 'operations', tier: 'PRO' as const, enabled: true },
        { name: 'template_manager', displayName: 'Template Manager', description: 'Email and document templates', category: 'operations', tier: 'PRO' as const, enabled: true },
        { name: 'product_import_export', displayName: 'Product Import/Export', description: 'Bulk product management', category: 'operations', tier: 'PRO' as const, enabled: true },
        // Marketing
        { name: 'abandoned_cart', displayName: 'Abandoned Cart Recovery', description: 'Cart recovery', category: 'marketing', tier: 'PRO' as const, enabled: true },
        { name: 'cms', displayName: 'Content Management', description: 'CMS system', category: 'marketing', tier: 'PRO' as const, enabled: true },
        { name: 'email_campaigns', displayName: 'Email Campaigns', description: 'Email marketing campaigns', category: 'marketing', tier: 'PRO' as const, enabled: true },
        { name: 'exit_intent_popups', displayName: 'Exit Intent Popups', description: 'Capture leaving visitors', category: 'marketing', tier: 'PRO' as const, enabled: true },
        { name: 'seo_toolkit', displayName: 'SEO Toolkit', description: 'Search engine optimization tools', category: 'marketing', tier: 'PRO' as const, enabled: true },
        { name: 'checkout_customization', displayName: 'Checkout Customization', description: 'Customize checkout experience', category: 'sales', tier: 'PRO' as const, enabled: true },
    ]

    for (const feature of features) {
        await prisma.featureFlag.upsert({
            where: { name: feature.name },
            update: feature,
            create: feature,
        })
    }
    console.log('✅ Feature Flags seeded.')

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
