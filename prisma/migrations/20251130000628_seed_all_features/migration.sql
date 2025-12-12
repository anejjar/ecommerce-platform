-- Seed all features from feature-docs.ts
-- This migration ensures all features from feature-docs.ts are present in the database
-- Uses INSERT ... ON DUPLICATE KEY UPDATE to handle existing features gracefully

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_YW5hbHl0aWNzX2Rhc2hib',
  'analytics_dashboard',
  'Analytics Dashboard',
  'Comprehensive analytics platform with basic reporting completed and advanced features in development. Includes sales tracking, customer insights, product metrics, and will expand to include conversion funnels, traffic sources, goal tracking, and scheduled reports.',
  'analytics',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_cmVmdW5kX21hbmFnZW1lb',
  'refund_management',
  'Refund Management',
  'Advanced refund system with basic processing completed and enhanced features in development. Currently supports full refund workflow with admin approval, and will expand to include partial refunds, store credit, RMA generation, return labels, and refund analytics.',
  'financial',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_YWJhbmRvbmVkX2NhcnQ',
  'abandoned_cart',
  'Abandoned Cart Recovery',
  'Comprehensive cart recovery system with email automation completed and advanced multi-channel features in development. Currently includes automated email reminders with discount codes, and will expand to include SMS, push notifications, Facebook retargeting, and A/B testing.',
  'marketing',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_Y21z',
  'cms',
  'Content Management System',
  'Full-featured CMS with basic content management completed and advanced page builder features in development. Create blog posts, custom pages, and manage content with SEO optimization, rich editing, and will expand to include landing page builder, dynamic blocks, and version history.',
  'customer_experience',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_dGVtcGxhdGVfbWFuYWdlc',
  'template_manager',
  'Email Template Manager',
  'Visual email template editor for creating and customizing transactional and marketing emails with drag-and-drop components and variable support.',
  'marketing',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_bG95YWx0eV9wcm9ncmFt',
  'loyalty_program',
  'Customer Loyalty Program',
  'Complete loyalty and rewards system with points for purchases and actions, VIP tiers (Bronze/Silver/Gold/Platinum), action-based rewards, birthday bonuses, points expiration, multiple redemption options, and gamification elements to increase customer retention.',
  'customer_experience',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_d2lzaGxpc3Q',
  'wishlist',
  'Product Wishlist',
  'Advanced wishlist system allowing customers to save products across multiple lists with sharing, gift registry, price alerts, and back-in-stock notifications. Supports public/private lists and bulk operations.',
  'customer_experience',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_YWR2YW5jZWRfcmV2aWV3c',
  'advanced_reviews',
  'Advanced Product Reviews',
  'Comprehensive product review system with photo/video uploads, review voting, admin replies, purchase verification, Q&A section, review templates, incentivized reviews, moderation queue, and SEO schema markup for enhanced social proof and conversions.',
  'customer_experience',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_YWR2YW5jZWRfc2VhcmNo',
  'advanced_search',
  'Advanced Search & Filters',
  'Powerful search engine with faceted filtering, autocomplete, search suggestions, and relevance ranking for improved product discovery.',
  'customer_experience',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_cHJvZHVjdF9yZWNvbW1lb',
  'product_recommendations',
  'AI Product Recommendations',
  'Machine learning-powered product recommendations based on browsing history, purchase patterns, and similar customer behavior.',
  'customer_experience',
  'ENTERPRISE',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_bGl2ZV9jaGF0',
  'live_chat',
  'Live Chat Support',
  'Real-time customer support chat system with agent dashboard, chat history, canned responses, and file sharing capabilities.',
  'customer_experience',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_bXVsdGlfY3VycmVuY3k',
  'multi_currency',
  'Multi-Currency Support',
  'Support for multiple currencies with automatic conversion, geo-detection, and real-time exchange rates.',
  'operations',
  'ENTERPRISE',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_aW52ZW50b3J5X3RyYWNra',
  'inventory_tracking',
  'Advanced Inventory Tracking',
  'Multi-location inventory management with stock transfer, low stock alerts, and inventory forecasting.',
  'operations',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_aW52ZW50b3J5X21hbmFnZ',
  'inventory_management',
  'Advanced Inventory Management',
  'Comprehensive inventory management system with stock movement history, purchase orders, supplier management, low stock alerts, and detailed reporting for complete inventory control.',
  'operations',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_Y3VzdG9tX3JlcG9ydHM',
  'custom_reports',
  'Custom Report Builder',
  'Build custom reports with drag-and-drop interface, schedule automated delivery, and export in multiple formats.',
  'analytics',
  'ENTERPRISE',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_c2FsZXNfcmVwb3J0cw',
  'sales_reports',
  'Sales Reports',
  'Detailed sales reporting with revenue trends, average order value, time-based comparisons, and performance metrics to track your business growth.',
  'analytics',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_Y3VzdG9tZXJfYW5hbHl0a',
  'customer_analytics',
  'Customer Analytics',
  'Deep insights into customer behavior including lifetime value, purchase patterns, geographic distribution, retention metrics, and segmentation data.',
  'analytics',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_cHJvZHVjdF9wZXJmb3JtY',
  'product_performance',
  'Product Performance Analytics',
  'Comprehensive product analytics tracking best sellers, underperforming items, stock turnover rates, and product trends to optimize your inventory and pricing.',
  'analytics',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_YnVsa19vcGVyYXRpb25z',
  'bulk_operations',
  'Bulk Operations',
  'Advanced bulk operations system for managing products, orders, and customers at scale. Includes bulk editing, CSV imports/exports, price updates, inventory adjustments, image optimization, scheduled operations, and undo functionality for safe batch processing.',
  'operations',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_YWN0aXZpdHlfbG9n',
  'activity_log',
  'Activity Log & Audit Trail',
  'Complete audit trail of all admin actions including user changes, order modifications, product updates, and system events for accountability and troubleshooting.',
  'operations',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_bXVsdGlfYWRtaW4',
  'multi_admin',
  'Multi-Admin User Management',
  'Enterprise-grade admin management system with role-based permissions, permission templates, activity logging per admin, login history, two-factor authentication, IP whitelisting, session timeout, and admin approval workflow for secure team collaboration.',
  'operations',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_aW52b2ljZV9nZW5lcmF0b',
  'invoice_generator',
  'Invoice & Packing Slip Generator',
  'Automatically generate professional PDF invoices and packing slips with customizable templates, branding, and configurable content for orders.',
  'operations',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_cHJvZHVjdF9pbXBvcnRfZ',
  'product_import_export',
  'Product Import/Export',
  'CSV-based bulk product management allowing you to import new products, export existing inventory, and update products in batches for efficient catalog management.',
  'operations',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_Y3VzdG9tZXJfc2VnbWVud',
  'customer_segments',
  'Customer Segments & Groups',
  'Organize customers into dynamic segments based on purchase history, behavior, demographics, and custom criteria for targeted marketing and personalized experiences.',
  'operations',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_Zmxhc2hfc2FsZXM',
  'flash_sales',
  'Flash Sales & Scheduled Promotions',
  'Time-limited promotional system with countdown timers, automatic price changes, and scheduled start/end times to create urgency and drive sales.',
  'operations',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_YWR2YW5jZWRfc2hpcHBpb',
  'advanced_shipping',
  'Advanced Shipping Management',
  'Comprehensive shipping solution with multiple carriers, shipping zones, real-time rate calculation, label printing, and tracking integration.',
  'operations',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_Y2hlY2tvdXRfY3VzdG9ta',
  'checkout_customization',
  'Advanced Checkout Customization',
  'Premium checkout customization with advanced branding, field customization, trust & security elements, and marketing & conversion features. Transform your checkout into a conversion-optimized, branded experience.',
  'sales',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_c2VvX3Rvb2xraXQ',
  'seo_toolkit',
  'Advanced SEO Toolkit',
  'Comprehensive SEO management system with meta tags, URL redirects, structured data (schema.org), automatic sitemaps, robots.txt configuration, and SEO audit tools.',
  'marketing',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_Y3VzdG9tZXJfYWNjb3Vud',
  'customer_account_features',
  'Customer Account Features',
  'Comprehensive customer account management system with order tracking, one-click reorder, saved payment methods, address book, order export, and GDPR-compliant account deletion requests.',
  'customer_experience',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_cHJvZHVjdF9jdXN0b21pe',
  'product_customization',
  'Advanced Product Options & Customization',
  'Advanced product customization system allowing customers to personalize products with text engraving, image uploads, color picker, custom messages, and conditional options with price modifiers.',
  'operations',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_ZXhpdF9pbnRlbnRfcG9wd',
  'exit_intent_popups',
  'Exit-Intent Popups & Overlays',
  'Advanced popup system with exit-intent detection, timed triggers, scroll-based triggers, email capture, discount offers, age verification, cookie consent, and comprehensive analytics tracking.',
  'marketing',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_ZW1haWxfY2FtcGFpZ25z',
  'email_campaigns',
  'Email Campaign Builder',
  'Professional email marketing platform with campaign creation, template management, audience targeting, automated sending, and comprehensive analytics including open rates, click rates, and engagement tracking.',
  'marketing',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_cG9zX3N5c3RlbQ',
  'pos_system',
  'POS (Point of Sale) System',
  'Complete point of sale system designed for both retail and restaurant businesses. Features a fast, user-friendly interface optimized for speed with large touch targets, keyboard shortcuts, and streamlined workflows. Includes multi-location support, cashier management, customer search, hold orders, discount codes, order modifications, receipt printing, and real-time analytics.',
  'operations',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

INSERT INTO `featureflag` (`id`, `name`, `displayName`, `description`, `category`, `tier`, `enabled`, `createdAt`, `updatedAt`)
VALUES (
  'feat_c3RvcmVmcm9udF9lbmFibGVk',
  'storefront_enabled',
  'Enable Storefront',
  'Control the visibility of your storefront. When disabled, all storefront routes redirect to admin login. When enabled, admins can create custom pages that override default storefront pages (homepage, shop, product, cart, checkout, blog).',
  'customer_experience',
  'PRO',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `displayName` = VALUES(`displayName`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `tier` = VALUES(`tier`),
  `updatedAt` = NOW();

