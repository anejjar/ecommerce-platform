export interface FeatureDocumentation {
  key: string;
  title: string;
  category: string;
  tier: 'FREE' | 'PRO' | 'ENTERPRISE';
  status: 'completed' | 'partial' | 'pending';
  overview: string;
  benefits: string[];
  howItWorks: string;
  howToUse: {
    step: number;
    title: string;
    description: string;
    location?: string;
  }[];
  setupRequired?: {
    step: number;
    title: string;
    description: string;
  }[];
  relatedFeatures?: string[];
  technicalDetails?: {
    database?: string;
    apis?: string[];
    components?: string[];
  };
  notes?: string[];
}

export const featureDocs: Record<string, FeatureDocumentation> = {
  analytics_dashboard: {
    key: 'analytics_dashboard',
    title: 'Analytics Dashboard',
    category: 'analytics',
    tier: 'PRO',
    status: 'completed',
    overview: 'Comprehensive analytics dashboard providing real-time insights into your store performance, sales trends, customer behavior, and product metrics.',
    benefits: [
      'Real-time sales and revenue tracking',
      'Customer behavior insights',
      'Product performance metrics',
      'Conversion rate analysis',
      'Data-driven decision making',
    ],
    howItWorks: 'The analytics dashboard aggregates data from orders, products, and customer interactions to provide visual insights through charts and metrics. Data is updated in real-time as transactions occur.',
    howToUse: [
      {
        step: 1,
        title: 'Access the Dashboard',
        description: 'Navigate to Admin > Analytics from the sidebar',
        location: '/admin/analytics',
      },
      {
        step: 2,
        title: 'View Key Metrics',
        description: 'Review overview cards showing total revenue, orders, customers, and conversion rate',
      },
      {
        step: 3,
        title: 'Analyze Trends',
        description: 'Use the date range selector to compare different time periods',
      },
      {
        step: 4,
        title: 'Product Performance',
        description: 'Scroll down to see top-performing products and categories',
      },
      {
        step: 5,
        title: 'Export Reports',
        description: 'Use the export button to download analytics data for external analysis',
      },
    ],
    technicalDetails: {
      database: 'Aggregates from Order, Product, User tables',
      apis: ['/api/analytics/overview', '/api/analytics/revenue', '/api/analytics/products'],
      components: ['AnalyticsDashboard', 'RevenueChart', 'TopProductsTable'],
    },
    relatedFeatures: ['advanced_analytics', 'custom_reports'],
  },

  refund_management: {
    key: 'refund_management',
    title: 'Refund Management',
    category: 'financial',
    tier: 'PRO',
    status: 'completed',
    overview: 'Complete refund processing system allowing customers to request refunds and administrators to review, approve, or reject refund requests with full audit trail.',
    benefits: [
      'Streamlined refund workflow',
      'Customer self-service refund requests',
      'Admin approval system',
      'Full refund history tracking',
      'Automated email notifications',
      'Fraud prevention with status tracking',
    ],
    howItWorks: 'Customers initiate refund requests from their order history. Requests are sent to administrators who can review order details, refund reasons, and approve or reject with notes. All actions are tracked and customers receive email notifications.',
    howToUse: [
      {
        step: 1,
        title: 'Enable Feature',
        description: 'Ensure the refund_management feature is enabled in Feature Management',
        location: '/admin/features',
      },
      {
        step: 2,
        title: 'Customer Requests Refund',
        description: 'Customers can request refunds from their order history page by clicking "Request Refund" button',
        location: '/account/orders',
      },
      {
        step: 3,
        title: 'Admin Reviews Request',
        description: 'Navigate to Admin > Sales > Refunds to view all pending refund requests',
        location: '/admin/refunds',
      },
      {
        step: 4,
        title: 'Process Refund',
        description: 'Click on a refund request, review details, and approve or reject with optional notes',
      },
      {
        step: 5,
        title: 'Track Status',
        description: 'Both customers and admins can track refund status in real-time',
      },
    ],
    setupRequired: [
      {
        step: 1,
        title: 'Database Migration',
        description: 'Ensure Refund model is in your database (already migrated)',
      },
      {
        step: 2,
        title: 'Email Configuration',
        description: 'Configure SMTP settings in .env for refund notifications',
      },
    ],
    technicalDetails: {
      database: 'Refund model with relations to Order and User',
      apis: ['/api/refunds', '/api/refunds/[id]', '/api/admin/refunds'],
      components: ['RefundRequestForm', 'RefundManagement', 'RefundStatusBadge'],
    },
    relatedFeatures: ['order_management', 'email_notifications'],
  },

  abandoned_cart: {
    key: 'abandoned_cart',
    title: 'Abandoned Cart Recovery',
    category: 'marketing',
    tier: 'PRO',
    status: 'completed',
    overview: 'Automated email campaign system to recover abandoned shopping carts with multi-stage reminders and incentive-based discount codes.',
    benefits: [
      'Recover lost sales automatically',
      'Three-stage email reminder system',
      'Automatic discount code generation',
      'Track recovery success rates',
      'Email engagement metrics',
      'Admin dashboard with statistics',
    ],
    howItWorks: 'When a cart is abandoned, the system tracks it and sends three automated reminder emails: 1 hour reminder, 24-hour reminder with 10% discount, and final 3-day reminder. Customers can recover their cart with a single click.',
    howToUse: [
      {
        step: 1,
        title: 'Enable Feature',
        description: 'Enable the abandoned_cart feature in Feature Management',
        location: '/admin/features',
      },
      {
        step: 2,
        title: 'Configure Cron Job',
        description: 'Set up a cron job to call /api/cron/abandoned-carts every hour with your CRON_SECRET',
      },
      {
        step: 3,
        title: 'Monitor Dashboard',
        description: 'View abandoned cart statistics at Admin > Marketing > Abandoned Carts',
        location: '/admin/abandoned-carts',
      },
      {
        step: 4,
        title: 'Track Recovery',
        description: 'Monitor recovery rates, total value, and email engagement metrics',
      },
      {
        step: 5,
        title: 'Manual Recovery Links',
        description: 'Copy recovery links for manual outreach to specific customers',
      },
    ],
    setupRequired: [
      {
        step: 1,
        title: 'Add CRON_SECRET',
        description: 'Add CRON_SECRET environment variable to .env file',
      },
      {
        step: 2,
        title: 'Setup Cron Job',
        description: 'Configure a cron job (Vercel Cron, GitHub Actions, etc.) to call the endpoint hourly',
      },
      {
        step: 3,
        title: 'Email Configuration',
        description: 'Ensure email service is properly configured for sending reminder emails',
      },
    ],
    technicalDetails: {
      database: 'AbandonedCart and AbandonedCartEmail models',
      apis: [
        '/api/abandoned-cart/track',
        '/api/abandoned-cart/recover/[token]',
        '/api/admin/abandoned-carts',
        '/api/cron/abandoned-carts',
      ],
      components: ['AbandonedCartsDashboard', 'CartRecoveryPage'],
    },
    relatedFeatures: ['email_campaigns', 'discount_codes'],
    notes: [
      'Carts are marked as expired after 30 days',
      'Discount codes are 10% off by default',
      'Recovery links are unique and secure',
    ],
  },

  cms: {
    key: 'cms',
    title: 'Content Management System',
    category: 'customer_experience',
    tier: 'PRO',
    status: 'completed',
    overview: 'Full-featured CMS for managing blog posts, pages, and content with rich text editing, SEO optimization, and media library integration.',
    benefits: [
      'Create and manage blog posts',
      'Custom pages with rich content',
      'Category and tag organization',
      'SEO meta tags support',
      'Draft and publish workflow',
      'Media library integration',
    ],
    howItWorks: 'The CMS provides a visual editor for creating content, organizing it with categories/tags, and publishing to your storefront. Content can be drafted, scheduled, or published immediately.',
    howToUse: [
      {
        step: 1,
        title: 'Access CMS',
        description: 'Navigate to Admin > Content from the sidebar',
        location: '/admin/cms',
      },
      {
        step: 2,
        title: 'Create Blog Post',
        description: 'Click "New Post" to create a blog article with rich text editor',
        location: '/admin/cms/posts',
      },
      {
        step: 3,
        title: 'Add Media',
        description: 'Upload images and media through the Media Library',
        location: '/admin/media',
      },
      {
        step: 4,
        title: 'Organize Content',
        description: 'Use categories and tags to organize your content',
        location: '/admin/cms/categories',
      },
      {
        step: 5,
        title: 'Publish or Draft',
        description: 'Save as draft for later or publish immediately to your storefront',
      },
    ],
    technicalDetails: {
      database: 'BlogPost, Page, Category, Tag models',
      apis: ['/api/cms/posts', '/api/cms/pages', '/api/cms/categories'],
      components: ['RichTextEditor', 'PostEditor', 'MediaLibrary'],
    },
    relatedFeatures: ['media_library', 'seo_optimization'],
  },

  template_manager: {
    key: 'template_manager',
    title: 'Email Template Manager',
    category: 'marketing',
    tier: 'PRO',
    status: 'completed',
    overview: 'Visual email template editor for creating and customizing transactional and marketing emails with drag-and-drop components and variable support.',
    benefits: [
      'Customize all email templates',
      'Visual drag-and-drop editor',
      'Brand consistency across emails',
      'Preview before sending',
      'Variable substitution',
      'Template versioning',
    ],
    howItWorks: 'Create email templates using a visual editor with pre-built components. Templates support dynamic variables that are replaced with actual data when emails are sent.',
    howToUse: [
      {
        step: 1,
        title: 'Access Templates',
        description: 'Navigate to Admin > Marketing > Email Templates (when enabled)',
      },
      {
        step: 2,
        title: 'Select Template Type',
        description: 'Choose from order confirmation, shipping, refund, or marketing templates',
      },
      {
        step: 3,
        title: 'Edit with Visual Editor',
        description: 'Use drag-and-drop components to customize the template',
      },
      {
        step: 4,
        title: 'Add Variables',
        description: 'Insert dynamic variables like {{customerName}}, {{orderTotal}}, etc.',
      },
      {
        step: 5,
        title: 'Preview and Save',
        description: 'Preview the template with sample data before saving',
      },
    ],
    technicalDetails: {
      database: 'EmailTemplate model',
      apis: ['/api/templates', '/api/templates/[id]'],
      components: ['TemplateEditor', 'TemplatePreview'],
    },
    relatedFeatures: ['email_campaigns', 'abandoned_cart'],
  },

  email_campaigns: {
    key: 'email_campaigns',
    title: 'Email Marketing Campaigns',
    category: 'marketing',
    tier: 'ENTERPRISE',
    status: 'partial',
    overview: 'Advanced email marketing platform for creating targeted campaigns, newsletters, and automated email sequences with analytics.',
    benefits: [
      'Send targeted email campaigns',
      'Segment customer audiences',
      'A/B testing support',
      'Campaign analytics',
      'Automated sequences',
      'Engagement tracking',
    ],
    howItWorks: 'Create email campaigns with custom content, select target audience segments, schedule sending, and track performance metrics like open rates and click-through rates.',
    howToUse: [
      {
        step: 1,
        title: 'Navigate to Campaigns',
        description: 'Go to Admin > Marketing > Email Campaigns',
        location: '/admin/marketing/email-campaigns',
      },
      {
        step: 2,
        title: 'Create Campaign',
        description: 'Click "New Campaign" and choose campaign type (newsletter, promotional, etc.)',
      },
      {
        step: 3,
        title: 'Design Email',
        description: 'Use the email editor to create your campaign content',
      },
      {
        step: 4,
        title: 'Select Audience',
        description: 'Choose customer segments or import email lists',
      },
      {
        step: 5,
        title: 'Schedule or Send',
        description: 'Send immediately or schedule for later. Track results in analytics.',
      },
    ],
    setupRequired: [
      {
        step: 1,
        title: 'Email Service Provider',
        description: 'Configure email service (SendGrid, Mailgun, etc.) in .env',
      },
      {
        step: 2,
        title: 'Domain Authentication',
        description: 'Set up SPF and DKIM records for your domain',
      },
    ],
    technicalDetails: {
      database: 'EmailCampaign, CampaignRecipient models (partial)',
      apis: ['/api/marketing/campaigns'],
      components: ['CampaignEditor', 'AudienceSelector'],
    },
    relatedFeatures: ['template_manager', 'customer_segmentation'],
    notes: ['Currently has basic campaign creation, needs analytics integration'],
  },

  loyalty_program: {
    key: 'loyalty_program',
    title: 'Customer Loyalty Program',
    category: 'customer_experience',
    tier: 'PRO',
    status: 'pending',
    overview: 'Reward your customers with points for purchases, referrals, and engagement. Points can be redeemed for discounts on future orders.',
    benefits: [
      'Increase customer retention',
      'Encourage repeat purchases',
      'Reward customer loyalty',
      'Gamification elements',
      'Referral incentives',
      'Tiered membership levels',
    ],
    howItWorks: 'Customers earn points based on purchase amount and specific actions. Points accumulate in their account and can be redeemed for discount codes or rewards during checkout.',
    howToUse: [
      {
        step: 1,
        title: 'Configure Point Rules',
        description: 'Set up how many points customers earn per dollar spent',
      },
      {
        step: 2,
        title: 'Set Redemption Values',
        description: 'Define how many points equal what discount amount',
      },
      {
        step: 3,
        title: 'Create Tiers',
        description: 'Optional: Create Bronze, Silver, Gold tiers with different benefits',
      },
      {
        step: 4,
        title: 'Enable for Customers',
        description: 'Customers automatically earn points with each purchase',
      },
      {
        step: 5,
        title: 'Monitor Program',
        description: 'Track program performance and engagement in analytics',
      },
    ],
    setupRequired: [
      {
        step: 1,
        title: 'Feature Implementation',
        description: 'This feature is pending implementation',
      },
    ],
    relatedFeatures: ['discount_codes', 'customer_accounts'],
    notes: ['Feature planned but not yet implemented'],
  },

  wishlist: {
    key: 'wishlist',
    title: 'Product Wishlist',
    category: 'customer_experience',
    tier: 'FREE',
    status: 'pending',
    overview: 'Allow customers to save products to wishlists for future purchase consideration. Supports multiple wishlists and sharing capabilities.',
    benefits: [
      'Help customers save products',
      'Increase return visits',
      'Gift registry functionality',
      'Sharable wishlists',
      'Price drop notifications',
      'Back-in-stock alerts',
    ],
    howItWorks: 'Customers can add products to one or more wishlists from product pages. Wishlists can be private or shared with others. Email notifications sent when wishlist items go on sale.',
    howToUse: [
      {
        step: 1,
        title: 'Customer Adds to Wishlist',
        description: 'Click the heart icon on any product page',
      },
      {
        step: 2,
        title: 'View Wishlist',
        description: 'Access saved products from account menu',
      },
      {
        step: 3,
        title: 'Create Multiple Lists',
        description: 'Organize products into different wishlists (e.g., "Birthday Ideas", "Holiday Gifts")',
      },
      {
        step: 4,
        title: 'Share Wishlist',
        description: 'Generate shareable link for gift registries',
      },
      {
        step: 5,
        title: 'Add to Cart',
        description: 'Easily move items from wishlist to cart',
      },
    ],
    relatedFeatures: ['customer_accounts', 'price_alerts'],
    notes: ['Feature planned but not yet implemented'],
  },

  advanced_search: {
    key: 'advanced_search',
    title: 'Advanced Search & Filters',
    category: 'customer_experience',
    tier: 'PRO',
    status: 'pending',
    overview: 'Powerful search engine with faceted filtering, autocomplete, search suggestions, and relevance ranking for improved product discovery.',
    benefits: [
      'Faster product discovery',
      'Multi-attribute filtering',
      'Search autocomplete',
      'Typo tolerance',
      'Search analytics',
      'Synonym support',
    ],
    howItWorks: 'Uses advanced search algorithms to index products and provide instant, relevant results. Filters can be combined and search learns from user behavior.',
    howToUse: [
      {
        step: 1,
        title: 'Search Products',
        description: 'Start typing in the search bar for instant suggestions',
      },
      {
        step: 2,
        title: 'Apply Filters',
        description: 'Use sidebar filters for price range, category, brand, ratings, etc.',
      },
      {
        step: 3,
        title: 'Sort Results',
        description: 'Sort by relevance, price, newest, or popularity',
      },
      {
        step: 4,
        title: 'Save Searches',
        description: 'Save frequently used search queries for quick access',
      },
    ],
    relatedFeatures: ['product_catalog', 'category_management'],
    notes: ['Feature planned but not yet implemented'],
  },

  product_recommendations: {
    key: 'product_recommendations',
    title: 'AI Product Recommendations',
    category: 'customer_experience',
    tier: 'ENTERPRISE',
    status: 'pending',
    overview: 'Machine learning-powered product recommendations based on browsing history, purchase patterns, and similar customer behavior.',
    benefits: [
      'Increase average order value',
      'Personalized shopping experience',
      'Cross-sell and upsell opportunities',
      'Improved conversion rates',
      'Data-driven suggestions',
    ],
    howItWorks: 'Analyzes customer behavior, purchase history, and product relationships to generate personalized recommendations shown throughout the shopping experience.',
    howToUse: [
      {
        step: 1,
        title: 'Automatic Display',
        description: 'Recommendations appear automatically on product pages, cart, and homepage',
      },
      {
        step: 2,
        title: 'Configure Rules',
        description: 'Admin can set recommendation strategies (frequently bought together, similar products, etc.)',
      },
      {
        step: 3,
        title: 'Monitor Performance',
        description: 'Track recommendation click-through and conversion rates',
      },
    ],
    relatedFeatures: ['analytics_dashboard', 'customer_segmentation'],
    notes: ['Requires machine learning model training', 'Feature planned but not yet implemented'],
  },

  live_chat: {
    key: 'live_chat',
    title: 'Live Chat Support',
    category: 'customer_experience',
    tier: 'PRO',
    status: 'pending',
    overview: 'Real-time customer support chat system with agent dashboard, chat history, canned responses, and file sharing capabilities.',
    benefits: [
      'Instant customer support',
      'Reduce support tickets',
      'Increase conversions',
      'Chat transcripts',
      'Agent performance metrics',
      'Multi-agent support',
    ],
    howItWorks: 'Customers can initiate chat from any page. Chat requests are routed to available agents who respond in real-time. Full chat history is saved.',
    howToUse: [
      {
        step: 1,
        title: 'Enable Chat Widget',
        description: 'Chat widget appears on all storefront pages',
      },
      {
        step: 2,
        title: 'Agent Dashboard',
        description: 'Agents access chat queue from admin panel',
      },
      {
        step: 3,
        title: 'Respond to Chats',
        description: 'Accept incoming chats and respond with text or canned responses',
      },
      {
        step: 4,
        title: 'View History',
        description: 'Access complete chat history for each customer',
      },
    ],
    relatedFeatures: ['customer_accounts', 'support_tickets'],
    notes: ['Feature planned but not yet implemented'],
  },

  multi_currency: {
    key: 'multi_currency',
    title: 'Multi-Currency Support',
    category: 'operations',
    tier: 'ENTERPRISE',
    status: 'pending',
    overview: 'Support for multiple currencies with automatic conversion, geo-detection, and real-time exchange rates.',
    benefits: [
      'Sell internationally',
      'Auto-detect customer location',
      'Real-time exchange rates',
      'Currency-specific pricing',
      'Improved global UX',
    ],
    howItWorks: 'Detects customer location and displays prices in their local currency. Exchange rates are updated regularly. Admins can set custom prices per currency.',
    howToUse: [
      {
        step: 1,
        title: 'Configure Currencies',
        description: 'Select which currencies to support in settings',
      },
      {
        step: 2,
        title: 'Set Exchange Rates',
        description: 'Use auto-update or set manual exchange rates',
      },
      {
        step: 3,
        title: 'Currency Selector',
        description: 'Customers can switch currency from header dropdown',
      },
      {
        step: 4,
        title: 'Settlement Currency',
        description: 'All payments settled in your base currency',
      },
    ],
    setupRequired: [
      {
        step: 1,
        title: 'Exchange Rate API',
        description: 'Configure API for real-time exchange rates (e.g., exchangeratesapi.io)',
      },
    ],
    relatedFeatures: ['multi_language', 'international_shipping'],
    notes: ['Feature planned but not yet implemented'],
  },

  inventory_tracking: {
    key: 'inventory_tracking',
    title: 'Advanced Inventory Tracking',
    category: 'operations',
    tier: 'PRO',
    status: 'pending',
    overview: 'Multi-location inventory management with stock transfer, low stock alerts, and inventory forecasting.',
    benefits: [
      'Track stock across locations',
      'Prevent overselling',
      'Automated low stock alerts',
      'Inventory forecasting',
      'Stock transfer management',
      'Batch and SKU tracking',
    ],
    howItWorks: 'Tracks inventory levels in real-time across multiple warehouses. Automatically sends alerts when stock is low and provides forecasting based on sales trends.',
    howToUse: [
      {
        step: 1,
        title: 'Add Locations',
        description: 'Set up warehouse/store locations in settings',
      },
      {
        step: 2,
        title: 'Assign Inventory',
        description: 'Allocate stock quantities to each location',
      },
      {
        step: 3,
        title: 'Set Alert Thresholds',
        description: 'Configure when to receive low stock notifications',
      },
      {
        step: 4,
        title: 'Transfer Stock',
        description: 'Move inventory between locations as needed',
      },
      {
        step: 5,
        title: 'View Forecasts',
        description: 'Review inventory forecasts and reorder recommendations',
      },
    ],
    relatedFeatures: ['stock_alerts', 'product_management'],
    notes: ['Feature planned but not yet implemented'],
  },

  custom_reports: {
    key: 'custom_reports',
    title: 'Custom Report Builder',
    category: 'analytics',
    tier: 'ENTERPRISE',
    status: 'pending',
    overview: 'Build custom reports with drag-and-drop interface, schedule automated delivery, and export in multiple formats.',
    benefits: [
      'Create tailored reports',
      'Schedule automated reports',
      'Multiple export formats (PDF, CSV, Excel)',
      'Share with team members',
      'Custom date ranges and filters',
    ],
    howItWorks: 'Select data points, apply filters, choose visualization types, and save as reusable report templates. Reports can be scheduled for automatic generation and email delivery.',
    howToUse: [
      {
        step: 1,
        title: 'Access Report Builder',
        description: 'Navigate to Admin > Analytics > Custom Reports',
      },
      {
        step: 2,
        title: 'Select Data Sources',
        description: 'Choose metrics (sales, customers, products, etc.)',
      },
      {
        step: 3,
        title: 'Apply Filters',
        description: 'Filter by date range, category, location, etc.',
      },
      {
        step: 4,
        title: 'Choose Visualizations',
        description: 'Select charts, tables, or graphs for data display',
      },
      {
        step: 5,
        title: 'Schedule or Export',
        description: 'Save template, schedule automatic delivery, or export now',
      },
    ],
    relatedFeatures: ['analytics_dashboard', 'advanced_analytics'],
    notes: ['Feature planned but not yet implemented'],
  },
};

export function getFeatureDoc(key: string): FeatureDocumentation | undefined {
  return featureDocs[key];
}

export function getAllFeatureDocs(): FeatureDocumentation[] {
  return Object.values(featureDocs);
}

export function getFeatureDocsByCategory(category: string): FeatureDocumentation[] {
  return Object.values(featureDocs).filter(doc => doc.category === category);
}

export function getFeatureDocsByStatus(status: 'completed' | 'partial' | 'pending'): FeatureDocumentation[] {
  return Object.values(featureDocs).filter(doc => doc.status === status);
}
