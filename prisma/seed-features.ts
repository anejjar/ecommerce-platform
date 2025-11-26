import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const features = [
  // Analytics & Reporting
  {
    name: 'analytics_dashboard',
    displayName: 'Analytics & Reporting Dashboard',
    description: 'Advanced analytics with charts, sales reports, customer insights, and exportable reports',
    category: 'analytics',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'sales_reports',
    displayName: 'Sales Reports',
    description: 'Detailed sales reporting with revenue trends, average order value, and time-based comparisons',
    category: 'analytics',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'customer_analytics',
    displayName: 'Customer Analytics',
    description: 'Customer behavior analysis, lifetime value, geographic distribution, and retention metrics',
    category: 'analytics',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'product_performance',
    displayName: 'Product Performance Analytics',
    description: 'Track best sellers, low performers, stock turnover rate, and product trends',
    category: 'analytics',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'export_reports',
    displayName: 'Export Reports',
    description: 'Export analytics and reports to CSV/PDF for accounting and external analysis',
    category: 'analytics',
    tier: 'PRO' as const,
    enabled: false,
  },

  // Operations
  {
    name: 'refund_management',
    displayName: 'Refund & Return Management',
    description: 'Complete refund workflow with customer requests, admin approval, and automatic stock restoration',
    category: 'operations',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'bulk_operations',
    displayName: 'Bulk Operations',
    description: 'Bulk actions for orders, products, customers, and reviews to save time on repetitive tasks',
    category: 'operations',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'activity_log',
    displayName: 'Activity Log & Audit Trail',
    description: 'Complete history of admin actions for accountability, troubleshooting, and security',
    category: 'operations',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'multi_admin',
    displayName: 'Multi-Admin User Management',
    description: 'Create multiple admin accounts with role-based permissions and granular access control',
    category: 'operations',
    tier: 'ENTERPRISE' as const,
    enabled: false,
  },
  {
    name: 'invoice_generator',
    displayName: 'Invoice & Packing Slip Generator',
    description: 'Auto-generate professional PDF invoices and packing slips with customizable templates',
    category: 'operations',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'product_import_export',
    displayName: 'Product Import/Export',
    description: 'CSV-based bulk product management for importing, exporting, and updating products',
    category: 'operations',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'customer_segments',
    displayName: 'Customer Segments & Groups',
    description: 'Organize customers into segments for targeted marketing and personalized pricing',
    category: 'operations',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'flash_sales',
    displayName: 'Flash Sales & Scheduled Promotions',
    description: 'Time-limited promotional system with countdown timers and automatic price reversion',
    category: 'operations',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'advanced_shipping',
    displayName: 'Advanced Shipping Management',
    description: 'Shipping zones, multiple carriers, real-time rates, and label printing',
    category: 'operations',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'inventory_management',
    displayName: 'Advanced Inventory Management',
    description: 'Stock movement history, predicted stock-out dates, reorder points, and purchase orders',
    category: 'operations',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'support_tickets',
    displayName: 'Customer Support Ticket System',
    description: 'Built-in helpdesk for managing customer inquiries with status tracking and email notifications',
    category: 'operations',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'template_manager',
    displayName: 'Template Manager',
    description: 'Centralized system to manage and customize templates for invoices, packing slips, and emails',
    category: 'operations',
    tier: 'PRO' as const,
    enabled: false,
  },

  // Marketing
  {
    name: 'abandoned_cart',
    displayName: 'Abandoned Cart Recovery',
    description: 'Automated email reminders to recover abandoned carts with recovery rate tracking',
    category: 'marketing',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'email_campaigns',
    displayName: 'Email Campaign Builder',
    description: 'Complete email marketing platform: campaign builder, pre-built templates, newsletter subscribers, open/click tracking, test sends, and real-time analytics',
    category: 'marketing',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'cms',
    displayName: 'Content Management System',
    description: 'Manage blog posts, custom pages, and website content without developer assistance',
    category: 'marketing',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'banner_management',
    displayName: 'Promotional Banner Management',
    description: 'Create rotating hero banners, announcement bars, and scheduled promotional content',
    category: 'marketing',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'product_badges',
    displayName: 'Product Badges & Labels',
    description: 'Visual indicators like "New", "Best Seller", "Sale", "Limited Stock" with auto-assignment rules',
    category: 'marketing',
    tier: 'PRO' as const,
    enabled: false,
  },

  {
    name: 'checkout_customization',
    displayName: 'Advanced Checkout Customization',
    description: 'Premium checkout experience with branding, field customization, trust elements, address autocomplete, and conversion optimization features',
    category: 'sales',
    tier: 'PRO' as const,
    enabled: false,
  },

  // Financial
  {
    name: 'tax_management',
    displayName: 'Advanced Tax Management',
    description: 'Tax rates by location, exemptions, EU VAT handling, and tax reports for compliance',
    category: 'financial',
    tier: 'ENTERPRISE' as const,
    enabled: false,
  },
  {
    name: 'multi_currency',
    displayName: 'Multi-Currency Support',
    description: 'Sell internationally with multiple currencies, auto-conversion, and currency-specific pricing',
    category: 'financial',
    tier: 'ENTERPRISE' as const,
    enabled: false,
  },
  {
    name: 'product_bundles',
    displayName: 'Product Bundles & Kits',
    description: 'Create product bundles with discounted pricing and component inventory tracking',
    category: 'financial',
    tier: 'PRO' as const,
    enabled: false,
  },

  // Customer Experience
  {
    name: 'advanced_reviews',
    displayName: 'Advanced Product Reviews',
    description: 'Photo/video reviews, review voting, admin replies, and review rewards program',
    category: 'customer_experience',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'wishlist',
    displayName: 'Wishlist Management',
    description: 'Customer wishlists with sale alerts, sharing capabilities, and wishlist analytics',
    category: 'customer_experience',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'loyalty_program',
    displayName: 'Loyalty & Rewards Program',
    description: 'Points system for purchases, reviews, and referrals with tiered rewards and redemption',
    category: 'customer_experience',
    tier: 'PRO' as const,
    enabled: false,
  },

  // New Premium Features
  {
    name: 'product_customization',
    displayName: 'Advanced Product Options & Customization',
    description: 'Text engraving, image uploads, color picker, custom messages, conditional options with price modifiers',
    category: 'operations',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'seo_toolkit',
    displayName: 'Advanced SEO Toolkit',
    description: 'Automatic sitemaps, meta optimization, schema markup, 301 redirects, SEO audit, rich snippets',
    category: 'marketing',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'exit_intent_popups',
    displayName: 'Exit-Intent Popups & Overlays',
    description: 'Exit-intent offers, email capture, age verification, cookie consent, announcement modals',
    category: 'marketing',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'customer_account_features',
    displayName: 'Customer Account Features',
    description: 'Order tracking, one-click reorder, saved payments, address book, order export, account deletion',
    category: 'customer_experience',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'backup_export',
    displayName: 'Backup & Data Export',
    description: 'Automatic database backups, one-click restore, GDPR data export, scheduled backups, migration tools',
    category: 'operations',
    tier: 'ENTERPRISE' as const,
    enabled: false,
  },

  // Enhanced Existing Features
  {
    name: 'analytics_dashboard_enhanced',
    displayName: 'Enhanced Analytics Dashboard',
    description: 'Real-time updates, custom date ranges, conversion funnels, exit pages, traffic sources, goal tracking, saved views, scheduled reports',
    category: 'analytics',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'cms_enhanced',
    displayName: 'Enhanced CMS',
    description: 'Landing page builder, dynamic blocks, FAQ builder, testimonials, video embed, content scheduling, version history',
    category: 'marketing',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'abandoned_cart_enhanced',
    displayName: 'Powerful Abandoned Cart Recovery',
    description: 'SMS recovery, progressive discounts, abandoned browse tracking, Facebook retargeting, push notifications, A/B testing',
    category: 'marketing',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'wishlist_enhanced',
    displayName: 'Advanced Wishlist',
    description: 'Public/private lists, shareable links, gift registry, price drop alerts, back-in-stock alerts, multiple lists',
    category: 'customer_experience',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'bulk_operations_enhanced',
    displayName: 'Bulk Operations Enhancement',
    description: 'Bulk editing (prices, inventory, tags), CSV updates, image optimization, schedule operations, undo actions',
    category: 'operations',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'refund_management_enhanced',
    displayName: 'Advanced Refund System',
    description: 'Partial refunds, store credit, RMA generation, return labels, refund analytics, automated approval, restocking fees',
    category: 'operations',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'advanced_reviews_enhanced',
    displayName: 'Enhanced Product Reviews',
    description: 'Purchase verification, Q&A section, review templates, incentivized reviews, moderation queue, SEO schema',
    category: 'customer_experience',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'loyalty_program_enhanced',
    displayName: 'Loyalty Program Enhancement',
    description: 'VIP tiers (Bronze/Silver/Gold), action-based points, birthday bonuses, points expiry, redemption options, gamification',
    category: 'customer_experience',
    tier: 'PRO' as const,
    enabled: false,
  },
  {
    name: 'multi_admin_enhanced',
    displayName: 'Multi-Admin Improvements',
    description: 'Permission templates, activity log per admin, login history, 2FA, IP whitelist, session timeout, admin approval',
    category: 'operations',
    tier: 'ENTERPRISE' as const,
    enabled: false,
  },
];

async function main() {
  console.log('🌱 Seeding feature flags...');

  for (const feature of features) {
    await prisma.featureFlag.upsert({
      where: { name: feature.name },
      update: {
        displayName: feature.displayName,
        description: feature.description,
        category: feature.category,
        tier: feature.tier,
      },
      create: feature,
    });
    console.log(`✅ ${feature.displayName}`);
  }

  console.log(`\n🎉 Successfully seeded ${features.length} feature flags!`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding feature flags:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
