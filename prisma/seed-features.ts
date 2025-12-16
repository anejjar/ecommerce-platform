
import { PrismaClient, FeatureTier } from '@prisma/client'

const prisma = new PrismaClient()

// ============================================================================
// CENTRALIZED FEATURE FLAGS - SINGLE SOURCE OF TRUTH
// ============================================================================
// This is the master list of all feature flags in the system.
// All other seed scripts should import this list to avoid duplication.
// ============================================================================

export const allFeatures = [
        // Analytics Features
        {
            name: 'analytics_dashboard',
            displayName: 'Analytics Dashboard',
            description: 'Comprehensive analytics platform with basic reporting completed and advanced features in development. Includes sales tracking, customer insights, product metrics, and will expand to include conversion funnels, traffic sources, goal tracking, and scheduled reports.',
            category: 'analytics',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'sales_reports',
            displayName: 'Sales Reports',
            description: 'Detailed sales reporting with revenue trends, average order value, time-based comparisons, and performance metrics to track your business growth.',
            category: 'analytics',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'customer_analytics',
            displayName: 'Customer Analytics',
            description: 'Deep insights into customer behavior including lifetime value, purchase patterns, geographic distribution, retention metrics, and segmentation data.',
            category: 'analytics',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'product_performance',
            displayName: 'Product Performance Analytics',
            description: 'Comprehensive product analytics tracking best sellers, underperforming items, stock turnover rates, and product trends to optimize your inventory and pricing.',
            category: 'analytics',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'traffic_analytics',
            displayName: 'Traffic Analytics & Attribution',
            description: 'Advanced traffic source tracking with UTM parameters, referrer detection, and full customer journey attribution. Track which platforms (Facebook, Google, TikTok, etc.) drive conversions and calculate ROI per source without using Google Analytics or third-party services.',
            category: 'analytics',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'custom_reports',
            displayName: 'Custom Report Builder',
            description: 'Build custom reports with drag-and-drop interface, schedule automated delivery, and export in multiple formats.',
            category: 'analytics',
            tier: 'ENTERPRISE' as const,
            enabled: false
        },

        // Financial Features
        {
            name: 'refund_management',
            displayName: 'Refund Management',
            description: 'Advanced refund system with basic processing completed and enhanced features in development. Currently supports full refund workflow with admin approval, and will expand to include partial refunds, store credit, RMA generation, return labels, and refund analytics.',
            category: 'financial',
            tier: 'PRO' as const,
            enabled: false
        },

        // Operations Features
        {
            name: 'flash_sales',
            displayName: 'Flash Sales & Scheduled Promotions',
            description: 'Time-limited promotional system with countdown timers, automatic price changes, and scheduled start/end times to create urgency and drive sales.',
            category: 'operations',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'inventory_management',
            displayName: 'Advanced Inventory Management',
            description: 'Comprehensive inventory management system with stock movement history, purchase orders, supplier management, low stock alerts, and detailed reporting for complete inventory control.',
            category: 'operations',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'inventory_tracking',
            displayName: 'Advanced Inventory Tracking',
            description: 'Multi-location inventory management with stock transfer, low stock alerts, and inventory forecasting.',
            category: 'operations',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'product_import_export',
            displayName: 'Product Import/Export',
            description: 'CSV-based bulk product management allowing you to import new products, export existing inventory, and update products in batches for efficient catalog management.',
            category: 'operations',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'bulk_operations',
            displayName: 'Bulk Operations',
            description: 'Advanced bulk operations system for managing products, orders, and customers at scale. Includes bulk editing, CSV imports/exports, price updates, inventory adjustments, image optimization, scheduled operations, and undo functionality for safe batch processing.',
            category: 'operations',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'activity_log',
            displayName: 'Activity Log & Audit Trail',
            description: 'Complete audit trail of all admin actions including user changes, order modifications, product updates, and system events for accountability and troubleshooting.',
            category: 'operations',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'multi_admin',
            displayName: 'Multi-Admin User Management',
            description: 'Enterprise-grade admin management system with role-based permissions, permission templates, activity logging per admin, login history, two-factor authentication, IP whitelisting, session timeout, and admin approval workflow for secure team collaboration.',
            category: 'operations',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'invoice_generator',
            displayName: 'Invoice & Packing Slip Generator',
            description: 'Automatically generate professional PDF invoices and packing slips with customizable templates, branding, and configurable content for orders.',
            category: 'operations',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'customer_segments',
            displayName: 'Customer Segments & Groups',
            description: 'Organize customers into dynamic segments based on purchase history, behavior, demographics, and custom criteria for targeted marketing and personalized experiences.',
            category: 'operations',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'advanced_shipping',
            displayName: 'Advanced Shipping Management',
            description: 'Comprehensive shipping solution with multiple carriers, shipping zones, real-time rate calculation, label printing, and tracking integration.',
            category: 'operations',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'product_customization',
            displayName: 'Advanced Product Options & Customization',
            description: 'Advanced product customization system allowing customers to personalize products with text engraving, image uploads, color picker, custom messages, and conditional options with price modifiers.',
            category: 'operations',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'multi_currency',
            displayName: 'Multi-Currency Support',
            description: 'Support for multiple currencies with automatic conversion, geo-detection, and real-time exchange rates.',
            category: 'operations',
            tier: 'ENTERPRISE' as const,
            enabled: false
        },
        {
            name: 'pos_system',
            displayName: 'POS (Point of Sale) System',
            description: 'Complete point of sale system designed for both retail and restaurant businesses. Features a fast, user-friendly interface optimized for speed with large touch targets, keyboard shortcuts, and streamlined workflows. Includes multi-location support, cashier management, customer search, hold orders, discount codes, order modifications, receipt printing, and real-time analytics.',
            category: 'operations',
            tier: 'PRO' as const,
            enabled: false
        },

        // Marketing Features
        {
            name: 'abandoned_cart',
            displayName: 'Abandoned Cart Recovery',
            description: 'Comprehensive cart recovery system with email automation completed and advanced multi-channel features in development. Currently includes automated email reminders with discount codes, and will expand to include SMS, push notifications, Facebook retargeting, and A/B testing.',
            category: 'marketing',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'email_campaigns',
            displayName: 'Email Campaign Builder',
            description: 'Professional email marketing platform with campaign creation, template management, audience targeting, automated sending, and comprehensive analytics including open rates, click rates, and engagement tracking.',
            category: 'marketing',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'exit_intent_popups',
            displayName: 'Exit-Intent Popups & Overlays',
            description: 'Advanced popup system with exit-intent detection, timed triggers, scroll-based triggers, email capture, discount offers, age verification, cookie consent, and comprehensive analytics tracking.',
            category: 'marketing',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'seo_toolkit',
            displayName: 'Advanced SEO Toolkit',
            description: 'Comprehensive SEO management system with meta tags, URL redirects, structured data (schema.org), automatic sitemaps, robots.txt configuration, and SEO audit tools.',
            category: 'marketing',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'template_manager',
            displayName: 'Email Template Manager',
            description: 'Visual email template editor for creating and customizing transactional and marketing emails with drag-and-drop components and variable support.',
            category: 'marketing',
            tier: 'PRO' as const,
            enabled: false
        },

        // Customer Experience Features
        {
            name: 'cms',
            displayName: 'Content Management System',
            description: 'Full-featured CMS with basic content management completed and advanced page builder features in development. Create blog posts, custom pages, and manage content with SEO optimization, rich editing, and will expand to include landing page builder, dynamic blocks, and version history.',
            category: 'customer_experience',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'loyalty_program',
            displayName: 'Customer Loyalty Program',
            description: 'Complete loyalty and rewards system with points for purchases and actions, VIP tiers (Bronze/Silver/Gold/Platinum), action-based rewards, birthday bonuses, points expiration, multiple redemption options, and gamification elements to increase customer retention.',
            category: 'customer_experience',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'wishlist',
            displayName: 'Product Wishlist',
            description: 'Advanced wishlist system allowing customers to save products across multiple lists with sharing, gift registry, price alerts, and back-in-stock notifications. Supports public/private lists and bulk operations.',
            category: 'customer_experience',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'advanced_reviews',
            displayName: 'Advanced Product Reviews',
            description: 'Comprehensive product review system with photo/video uploads, review voting, admin replies, purchase verification, Q&A section, review templates, incentivized reviews, moderation queue, and SEO schema markup for enhanced social proof and conversions.',
            category: 'customer_experience',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'advanced_search',
            displayName: 'Advanced Search & Filters',
            description: 'Powerful search engine with faceted filtering, autocomplete, search suggestions, and relevance ranking for improved product discovery.',
            category: 'customer_experience',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'live_chat',
            displayName: 'Live Chat Support',
            description: 'Real-time customer support chat system with agent dashboard, chat history, canned responses, and file sharing capabilities.',
            category: 'customer_experience',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'customer_account_features',
            displayName: 'Customer Account Features',
            description: 'Comprehensive customer account management system with order tracking, one-click reorder, saved payment methods, address book, order export, and GDPR-compliant account deletion requests.',
            category: 'customer_experience',
            tier: 'PRO' as const,
            enabled: false
        },
        {
            name: 'product_recommendations',
            displayName: 'AI Product Recommendations',
            description: 'Machine learning-powered product recommendations based on browsing history, purchase patterns, and similar customer behavior.',
            category: 'customer_experience',
            tier: 'ENTERPRISE' as const,
            enabled: false
        },
        {
            name: 'storefront_enabled',
            displayName: 'Enable Storefront',
            description: 'Control the visibility of your storefront. When disabled, all storefront routes redirect to admin login. When enabled, admins can create custom pages that override default storefront pages (homepage, shop, product, cart, checkout, blog).',
            category: 'customer_experience',
            tier: 'PRO' as const,
            enabled: false
        },

        // Sales Features
        {
            name: 'checkout_customization',
            displayName: 'Advanced Checkout Customization',
            description: 'Premium checkout customization with advanced branding, field customization, trust & security elements, and marketing & conversion features. Transform your checkout into a conversion-optimized, branded experience.',
            category: 'sales',
            tier: 'PRO' as const,
            enabled: false
        },
    ]

// Helper function to seed features with optional enabled override
export async function seedFeatures(enableAll = false) {
    console.log('🚩 Seeding Feature Flags...')

    for (const feature of allFeatures) {
        const featureData = enableAll
            ? { ...feature, enabled: true }
            : feature

        await prisma.featureFlag.upsert({
            where: { name: feature.name },
            update: featureData,
            create: featureData,
        })
        console.log(`✓ Updated/Created feature: ${feature.name} (enabled: ${featureData.enabled})`)
    }

    console.log(`\n✅ Successfully seeded ${allFeatures.length} feature flags`)
    if (enableAll) {
        console.log('📝 All features are ENABLED')
    } else {
        console.log('📝 All features are disabled by default')
    }
}

// Run if executed directly
if (require.main === module) {
    async function main() {
        await seedFeatures(false) // false = disabled by default
    }

    main()
        .catch((e) => {
            console.error(e)
            process.exit(1)
        })
        .finally(async () => {
            await prisma.$disconnect()
        })
}
