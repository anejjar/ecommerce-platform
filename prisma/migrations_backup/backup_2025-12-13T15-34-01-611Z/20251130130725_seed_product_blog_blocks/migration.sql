-- Seed Product and Blog Block Templates Migration
-- This migration adds 14 new block templates (9 product + 5 blog)
-- Uses INSERT ... ON DUPLICATE KEY UPDATE to prevent duplicates on slug

-- Product Grid Block
INSERT INTO `BlockTemplate` (
  `id`, `name`, `slug`, `description`, `category`,
  `defaultConfig`, `configSchema`, `componentCode`,
  `isSystem`, `isActive`, `isPro`, `usageCount`, `createdAt`, `updatedAt`
)
VALUES (
  'product-grid-001',
  'Product Grid',
  'product-grid',
  'Display products in a responsive grid layout with customizable columns and filters',
  'PRODUCT',
  JSON_OBJECT(
    'selectionMode', 'auto',
    'productIds', JSON_ARRAY(),
    'category', '',
    'featured', false,
    'latest', false,
    'sortOrder', 'newest',
    'limit', 8,
    'columns', 4,
    'cardStyle', 'default',
    'showPrices', true,
    'showAddToCart', true,
    'paddingTop', '60px',
    'paddingBottom', '60px',
    'backgroundColor', '#ffffff',
    'maxWidth', '1280px'
  ),
  JSON_OBJECT(
    'fields', JSON_ARRAY(
      JSON_OBJECT('name', 'selectionMode', 'type', 'select', 'label', 'Selection Mode', 'options', JSON_ARRAY(JSON_OBJECT('value', 'auto', 'label', 'Auto Query'), JSON_OBJECT('value', 'manual', 'label', 'Manual Selection')), 'default', 'auto'),
      JSON_OBJECT('name', 'productIds', 'type', 'text', 'label', 'Product IDs (comma-separated)', 'required', false, 'placeholder', 'id1,id2,id3'),
      JSON_OBJECT('name', 'category', 'type', 'text', 'label', 'Category Slug', 'required', false),
      JSON_OBJECT('name', 'featured', 'type', 'checkbox', 'label', 'Featured Products Only', 'default', false),
      JSON_OBJECT('name', 'latest', 'type', 'checkbox', 'label', 'Latest Products', 'default', false),
      JSON_OBJECT('name', 'sortOrder', 'type', 'select', 'label', 'Sort Order', 'options', JSON_ARRAY(JSON_OBJECT('value', 'newest', 'label', 'Newest'), JSON_OBJECT('value', 'oldest', 'label', 'Oldest'), JSON_OBJECT('value', 'price-asc', 'label', 'Price: Low to High'), JSON_OBJECT('value', 'price-desc', 'label', 'Price: High to Low'), JSON_OBJECT('value', 'name', 'label', 'Name A-Z')), 'default', 'newest'),
      JSON_OBJECT('name', 'limit', 'type', 'number', 'label', 'Number of Products', 'min', 1, 'max', 50, 'default', 8),
      JSON_OBJECT('name', 'columns', 'type', 'select', 'label', 'Grid Columns', 'options', JSON_ARRAY(JSON_OBJECT('value', 2, 'label', '2 Columns'), JSON_OBJECT('value', 3, 'label', '3 Columns'), JSON_OBJECT('value', 4, 'label', '4 Columns'), JSON_OBJECT('value', 5, 'label', '5 Columns'), JSON_OBJECT('value', 6, 'label', '6 Columns')), 'default', 4),
      JSON_OBJECT('name', 'paddingTop', 'type', 'text', 'label', 'Top Padding', 'default', '60px'),
      JSON_OBJECT('name', 'paddingBottom', 'type', 'text', 'label', 'Bottom Padding', 'default', '60px'),
      JSON_OBJECT('name', 'backgroundColor', 'type', 'color', 'label', 'Background Color', 'default', '#ffffff'),
      JSON_OBJECT('name', 'maxWidth', 'type', 'text', 'label', 'Max Width', 'default', '1280px')
    )
  ),
  'export default function ProductGrid({ config }) { return React.createElement("div", { className: "product-grid-block" }, "Product Grid Block"); }',
  true, true, false, 0, NOW(), NOW()
)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `defaultConfig` = VALUES(`defaultConfig`),
  `configSchema` = VALUES(`configSchema`),
  `componentCode` = VALUES(`componentCode`),
  `updatedAt` = NOW();

-- Product Card Block
INSERT INTO `BlockTemplate` (
  `id`, `name`, `slug`, `description`, `category`,
  `defaultConfig`, `configSchema`, `componentCode`,
  `isSystem`, `isActive`, `isPro`, `usageCount`, `createdAt`, `updatedAt`
)
VALUES (
  'product-card-001',
  'Product Card',
  'product-card',
  'Display a single product card with customizable options',
  'PRODUCT',
  JSON_OBJECT(
    'productId', '',
    'showImage', true,
    'showPrice', true,
    'showDescription', true,
    'showAddToCart', true,
    'cardStyle', 'default',
    'paddingTop', '40px',
    'paddingBottom', '40px',
    'backgroundColor', '#ffffff',
    'maxWidth', '400px',
    'alignment', 'center'
  ),
  JSON_OBJECT(
    'fields', JSON_ARRAY(
      JSON_OBJECT('name', 'productId', 'type', 'text', 'label', 'Product ID', 'required', true, 'placeholder', 'Enter product ID'),
      JSON_OBJECT('name', 'showImage', 'type', 'checkbox', 'label', 'Show Image', 'default', true),
      JSON_OBJECT('name', 'showPrice', 'type', 'checkbox', 'label', 'Show Price', 'default', true),
      JSON_OBJECT('name', 'showDescription', 'type', 'checkbox', 'label', 'Show Description', 'default', true),
      JSON_OBJECT('name', 'showAddToCart', 'type', 'checkbox', 'label', 'Show Add to Cart', 'default', true),
      JSON_OBJECT('name', 'alignment', 'type', 'select', 'label', 'Alignment', 'options', JSON_ARRAY(JSON_OBJECT('value', 'left', 'label', 'Left'), JSON_OBJECT('value', 'center', 'label', 'Center'), JSON_OBJECT('value', 'right', 'label', 'Right')), 'default', 'center'),
      JSON_OBJECT('name', 'maxWidth', 'type', 'text', 'label', 'Max Width', 'default', '400px')
    )
  ),
  'export default function ProductCardBlock({ config }) { return React.createElement("div", { className: "product-card-block" }, "Product Card Block"); }',
  true, true, false, 0, NOW(), NOW()
)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `defaultConfig` = VALUES(`defaultConfig`),
  `configSchema` = VALUES(`configSchema`),
  `componentCode` = VALUES(`componentCode`),
  `updatedAt` = NOW();

-- Product Description Block
INSERT INTO `BlockTemplate` (
  `id`, `name`, `slug`, `description`, `category`,
  `defaultConfig`, `configSchema`, `componentCode`,
  `isSystem`, `isActive`, `isPro`, `usageCount`, `createdAt`, `updatedAt`
)
VALUES (
  'product-description-001',
  'Product Description',
  'product-description',
  'Display rich product description with customizable formatting',
  'PRODUCT',
  JSON_OBJECT(
    'productId', '',
    'showFullDescription', true,
    'truncateLength', 200,
    'textAlignment', 'left',
    'fontSize', '16px',
    'lineHeight', '1.6',
    'textColor', '#333333',
    'paddingTop', '40px',
    'paddingBottom', '40px',
    'backgroundColor', '#ffffff',
    'maxWidth', '800px'
  ),
  JSON_OBJECT(
    'fields', JSON_ARRAY(
      JSON_OBJECT('name', 'productId', 'type', 'text', 'label', 'Product ID', 'required', true),
      JSON_OBJECT('name', 'showFullDescription', 'type', 'checkbox', 'label', 'Show Full Description', 'default', true),
      JSON_OBJECT('name', 'truncateLength', 'type', 'number', 'label', 'Truncate Length', 'min', 50, 'max', 1000, 'default', 200),
      JSON_OBJECT('name', 'textAlignment', 'type', 'select', 'label', 'Text Alignment', 'options', JSON_ARRAY(JSON_OBJECT('value', 'left', 'label', 'Left'), JSON_OBJECT('value', 'center', 'label', 'Center'), JSON_OBJECT('value', 'right', 'label', 'Right'), JSON_OBJECT('value', 'justify', 'label', 'Justify')), 'default', 'left'),
      JSON_OBJECT('name', 'fontSize', 'type', 'text', 'label', 'Font Size', 'default', '16px'),
      JSON_OBJECT('name', 'textColor', 'type', 'color', 'label', 'Text Color', 'default', '#333333')
    )
  ),
  'export default function ProductDescription({ config }) { return React.createElement("div", { className: "product-description-block" }, "Product Description Block"); }',
  true, true, false, 0, NOW(), NOW()
)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `defaultConfig` = VALUES(`defaultConfig`),
  `configSchema` = VALUES(`configSchema`),
  `componentCode` = VALUES(`componentCode`),
  `updatedAt` = NOW();

-- Add to Cart Button Block
INSERT INTO `BlockTemplate` (
  `id`, `name`, `slug`, `description`, `category`,
  `defaultConfig`, `configSchema`, `componentCode`,
  `isSystem`, `isActive`, `isPro`, `usageCount`, `createdAt`, `updatedAt`
)
VALUES (
  'add-to-cart-button-001',
  'Add to Cart Button',
  'add-to-cart-button',
  'Standalone add-to-cart button with quantity selector',
  'PRODUCT',
  JSON_OBJECT(
    'productId', '',
    'buttonText', 'Add to Cart',
    'buttonStyle', 'solid',
    'buttonSize', 'md',
    'showQuantitySelector', false,
    'showIcon', true,
    'buttonColor', '#d97706',
    'textColor', '#ffffff',
    'paddingTop', '20px',
    'paddingBottom', '20px',
    'backgroundColor', 'transparent',
    'alignment', 'center'
  ),
  JSON_OBJECT(
    'fields', JSON_ARRAY(
      JSON_OBJECT('name', 'productId', 'type', 'text', 'label', 'Product ID', 'required', true),
      JSON_OBJECT('name', 'buttonText', 'type', 'text', 'label', 'Button Text', 'default', 'Add to Cart'),
      JSON_OBJECT('name', 'buttonStyle', 'type', 'select', 'label', 'Button Style', 'options', JSON_ARRAY(JSON_OBJECT('value', 'solid', 'label', 'Solid'), JSON_OBJECT('value', 'outline', 'label', 'Outline'), JSON_OBJECT('value', 'ghost', 'label', 'Ghost')), 'default', 'solid'),
      JSON_OBJECT('name', 'buttonSize', 'type', 'select', 'label', 'Button Size', 'options', JSON_ARRAY(JSON_OBJECT('value', 'sm', 'label', 'Small'), JSON_OBJECT('value', 'md', 'label', 'Medium'), JSON_OBJECT('value', 'lg', 'label', 'Large')), 'default', 'md'),
      JSON_OBJECT('name', 'showQuantitySelector', 'type', 'checkbox', 'label', 'Show Quantity Selector', 'default', false),
      JSON_OBJECT('name', 'showIcon', 'type', 'checkbox', 'label', 'Show Icon', 'default', true),
      JSON_OBJECT('name', 'buttonColor', 'type', 'color', 'label', 'Button Color', 'default', '#d97706'),
      JSON_OBJECT('name', 'textColor', 'type', 'color', 'label', 'Text Color', 'default', '#ffffff')
    )
  ),
  'export default function AddToCartButton({ config }) { return React.createElement("div", { className: "add-to-cart-button-block" }, "Add to Cart Button Block"); }',
  true, true, false, 0, NOW(), NOW()
)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `defaultConfig` = VALUES(`defaultConfig`),
  `configSchema` = VALUES(`configSchema`),
  `componentCode` = VALUES(`componentCode`),
  `updatedAt` = NOW();

-- Cart Summary Block
INSERT INTO `BlockTemplate` (
  `id`, `name`, `slug`, `description`, `category`,
  `defaultConfig`, `configSchema`, `componentCode`,
  `isSystem`, `isActive`, `isPro`, `usageCount`, `createdAt`, `updatedAt`
)
VALUES (
  'cart-summary-001',
  'Cart Summary',
  'cart-summary',
  'Display cart summary with items, subtotal, and checkout button',
  'PRODUCT',
  JSON_OBJECT(
    'showItemCount', true,
    'showSubtotal', true,
    'showTotal', true,
    'showCheckoutButton', true,
    'layout', 'inline',
    'maxItems', 5,
    'paddingTop', '40px',
    'paddingBottom', '40px',
    'backgroundColor', '#ffffff',
    'maxWidth', '400px'
  ),
  JSON_OBJECT(
    'fields', JSON_ARRAY(
      JSON_OBJECT('name', 'showItemCount', 'type', 'checkbox', 'label', 'Show Item Count', 'default', true),
      JSON_OBJECT('name', 'showSubtotal', 'type', 'checkbox', 'label', 'Show Subtotal', 'default', true),
      JSON_OBJECT('name', 'showTotal', 'type', 'checkbox', 'label', 'Show Total', 'default', true),
      JSON_OBJECT('name', 'showCheckoutButton', 'type', 'checkbox', 'label', 'Show Checkout Button', 'default', true),
      JSON_OBJECT('name', 'layout', 'type', 'select', 'label', 'Layout', 'options', JSON_ARRAY(JSON_OBJECT('value', 'inline', 'label', 'Inline'), JSON_OBJECT('value', 'drawer', 'label', 'Drawer')), 'default', 'inline'),
      JSON_OBJECT('name', 'maxItems', 'type', 'number', 'label', 'Max Items to Show', 'min', 1, 'max', 20, 'default', 5)
    )
  ),
  'export default function CartSummary({ config }) { return React.createElement("div", { className: "cart-summary-block" }, "Cart Summary Block"); }',
  true, true, false, 0, NOW(), NOW()
)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `defaultConfig` = VALUES(`defaultConfig`),
  `configSchema` = VALUES(`configSchema`),
  `componentCode` = VALUES(`componentCode`),
  `updatedAt` = NOW();

-- Product Image Gallery Block
INSERT INTO `BlockTemplate` (
  `id`, `name`, `slug`, `description`, `category`,
  `defaultConfig`, `configSchema`, `componentCode`,
  `isSystem`, `isActive`, `isPro`, `usageCount`, `createdAt`, `updatedAt`
)
VALUES (
  'product-image-gallery-001',
  'Product Image Gallery',
  'product-image-gallery',
  'Display product images in a gallery with thumbnails',
  'PRODUCT',
  JSON_OBJECT(
    'productId', '',
    'thumbnailSize', 'md',
    'showMainImage', true,
    'showThumbnails', true,
    'galleryStyle', 'grid',
    'aspectRatio', 'square',
    'paddingTop', '40px',
    'paddingBottom', '40px',
    'backgroundColor', '#ffffff',
    'maxWidth', '800px'
  ),
  JSON_OBJECT(
    'fields', JSON_ARRAY(
      JSON_OBJECT('name', 'productId', 'type', 'text', 'label', 'Product ID', 'required', true),
      JSON_OBJECT('name', 'thumbnailSize', 'type', 'select', 'label', 'Thumbnail Size', 'options', JSON_ARRAY(JSON_OBJECT('value', 'sm', 'label', 'Small'), JSON_OBJECT('value', 'md', 'label', 'Medium'), JSON_OBJECT('value', 'lg', 'label', 'Large')), 'default', 'md'),
      JSON_OBJECT('name', 'showMainImage', 'type', 'checkbox', 'label', 'Show Main Image', 'default', true),
      JSON_OBJECT('name', 'showThumbnails', 'type', 'checkbox', 'label', 'Show Thumbnails', 'default', true),
      JSON_OBJECT('name', 'galleryStyle', 'type', 'select', 'label', 'Gallery Style', 'options', JSON_ARRAY(JSON_OBJECT('value', 'grid', 'label', 'Grid'), JSON_OBJECT('value', 'carousel', 'label', 'Carousel')), 'default', 'grid'),
      JSON_OBJECT('name', 'aspectRatio', 'type', 'select', 'label', 'Aspect Ratio', 'options', JSON_ARRAY(JSON_OBJECT('value', 'square', 'label', 'Square'), JSON_OBJECT('value', '4:3', 'label', '4:3'), JSON_OBJECT('value', '16:9', 'label', '16:9'), JSON_OBJECT('value', 'auto', 'label', 'Auto')), 'default', 'square')
    )
  ),
  'export default function ProductImageGallery({ config }) { return React.createElement("div", { className: "product-image-gallery-block" }, "Product Image Gallery Block"); }',
  true, true, false, 0, NOW(), NOW()
)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `defaultConfig` = VALUES(`defaultConfig`),
  `configSchema` = VALUES(`configSchema`),
  `componentCode` = VALUES(`componentCode`),
  `updatedAt` = NOW();

-- Product Reviews Block
INSERT INTO `BlockTemplate` (
  `id`, `name`, `slug`, `description`, `category`,
  `defaultConfig`, `configSchema`, `componentCode`,
  `isSystem`, `isActive`, `isPro`, `usageCount`, `createdAt`, `updatedAt`
)
VALUES (
  'product-reviews-001',
  'Product Reviews',
  'product-reviews',
  'Display product reviews with rating summary',
  'PRODUCT',
  JSON_OBJECT(
    'productId', '',
    'showRatingSummary', true,
    'showIndividualReviews', true,
    'reviewsPerPage', 10,
    'sortOrder', 'newest',
    'showReviewForm', false,
    'paddingTop', '40px',
    'paddingBottom', '40px',
    'backgroundColor', '#ffffff',
    'maxWidth', '800px'
  ),
  JSON_OBJECT(
    'fields', JSON_ARRAY(
      JSON_OBJECT('name', 'productId', 'type', 'text', 'label', 'Product ID', 'required', true),
      JSON_OBJECT('name', 'showRatingSummary', 'type', 'checkbox', 'label', 'Show Rating Summary', 'default', true),
      JSON_OBJECT('name', 'showIndividualReviews', 'type', 'checkbox', 'label', 'Show Individual Reviews', 'default', true),
      JSON_OBJECT('name', 'reviewsPerPage', 'type', 'number', 'label', 'Reviews Per Page', 'min', 1, 'max', 50, 'default', 10),
      JSON_OBJECT('name', 'sortOrder', 'type', 'select', 'label', 'Sort Order', 'options', JSON_ARRAY(JSON_OBJECT('value', 'newest', 'label', 'Newest First'), JSON_OBJECT('value', 'oldest', 'label', 'Oldest First'), JSON_OBJECT('value', 'highest', 'label', 'Highest Rating'), JSON_OBJECT('value', 'lowest', 'label', 'Lowest Rating')), 'default', 'newest'),
      JSON_OBJECT('name', 'showReviewForm', 'type', 'checkbox', 'label', 'Show Review Form', 'default', false)
    )
  ),
  'export default function ProductReviews({ config }) { return React.createElement("div", { className: "product-reviews-block" }, "Product Reviews Block"); }',
  true, true, false, 0, NOW(), NOW()
)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `defaultConfig` = VALUES(`defaultConfig`),
  `configSchema` = VALUES(`configSchema`),
  `componentCode` = VALUES(`componentCode`),
  `updatedAt` = NOW();

-- Related Products Block
INSERT INTO `BlockTemplate` (
  `id`, `name`, `slug`, `description`, `category`,
  `defaultConfig`, `configSchema`, `componentCode`,
  `isSystem`, `isActive`, `isPro`, `usageCount`, `createdAt`, `updatedAt`
)
VALUES (
  'related-products-001',
  'Related Products',
  'related-products',
  'Display related products based on category or similarity',
  'PRODUCT',
  JSON_OBJECT(
    'productId', '',
    'numberOfProducts', 4,
    'relationshipType', 'category',
    'columns', 4,
    'cardStyle', 'default',
    'paddingTop', '60px',
    'paddingBottom', '60px',
    'backgroundColor', '#ffffff',
    'maxWidth', '1280px'
  ),
  JSON_OBJECT(
    'fields', JSON_ARRAY(
      JSON_OBJECT('name', 'productId', 'type', 'text', 'label', 'Product ID (to find related)', 'required', true),
      JSON_OBJECT('name', 'numberOfProducts', 'type', 'number', 'label', 'Number of Products', 'min', 1, 'max', 12, 'default', 4),
      JSON_OBJECT('name', 'relationshipType', 'type', 'select', 'label', 'Relationship Type', 'options', JSON_ARRAY(JSON_OBJECT('value', 'category', 'label', 'Same Category'), JSON_OBJECT('value', 'similar', 'label', 'Similar Products')), 'default', 'category'),
      JSON_OBJECT('name', 'columns', 'type', 'select', 'label', 'Grid Columns', 'options', JSON_ARRAY(JSON_OBJECT('value', 2, 'label', '2 Columns'), JSON_OBJECT('value', 3, 'label', '3 Columns'), JSON_OBJECT('value', 4, 'label', '4 Columns')), 'default', 4)
    )
  ),
  'export default function RelatedProducts({ config }) { return React.createElement("div", { className: "related-products-block" }, "Related Products Block"); }',
  true, true, false, 0, NOW(), NOW()
)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `defaultConfig` = VALUES(`defaultConfig`),
  `configSchema` = VALUES(`configSchema`),
  `componentCode` = VALUES(`componentCode`),
  `updatedAt` = NOW();

-- Product Tabs Block
INSERT INTO `BlockTemplate` (
  `id`, `name`, `slug`, `description`, `category`,
  `defaultConfig`, `configSchema`, `componentCode`,
  `isSystem`, `isActive`, `isPro`, `usageCount`, `createdAt`, `updatedAt`
)
VALUES (
  'product-tabs-001',
  'Product Tabs',
  'product-tabs',
  'Display product information in tabbed interface',
  'PRODUCT',
  JSON_OBJECT(
    'productId', '',
    'tabsToShow', JSON_ARRAY('description', 'specs', 'reviews', 'shipping'),
    'defaultTab', 'description',
    'tabStyle', 'underline',
    'paddingTop', '40px',
    'paddingBottom', '40px',
    'backgroundColor', '#ffffff',
    'maxWidth', '800px'
  ),
  JSON_OBJECT(
    'fields', JSON_ARRAY(
      JSON_OBJECT('name', 'productId', 'type', 'text', 'label', 'Product ID', 'required', true),
      JSON_OBJECT('name', 'tabsToShow', 'type', 'text', 'label', 'Tabs to Show (comma-separated)', 'default', 'description,specs,reviews,shipping', 'placeholder', 'description,specs,reviews'),
      JSON_OBJECT('name', 'defaultTab', 'type', 'select', 'label', 'Default Tab', 'options', JSON_ARRAY(JSON_OBJECT('value', 'description', 'label', 'Description'), JSON_OBJECT('value', 'specs', 'label', 'Specifications'), JSON_OBJECT('value', 'reviews', 'label', 'Reviews'), JSON_OBJECT('value', 'shipping', 'label', 'Shipping')), 'default', 'description'),
      JSON_OBJECT('name', 'tabStyle', 'type', 'select', 'label', 'Tab Style', 'options', JSON_ARRAY(JSON_OBJECT('value', 'underline', 'label', 'Underline'), JSON_OBJECT('value', 'pills', 'label', 'Pills'), JSON_OBJECT('value', 'buttons', 'label', 'Buttons')), 'default', 'underline')
    )
  ),
  'export default function ProductTabs({ config }) { return React.createElement("div", { className: "product-tabs-block" }, "Product Tabs Block"); }',
  true, true, false, 0, NOW(), NOW()
)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `defaultConfig` = VALUES(`defaultConfig`),
  `configSchema` = VALUES(`configSchema`),
  `componentCode` = VALUES(`componentCode`),
  `updatedAt` = NOW();

-- Blog Grid Block
INSERT INTO `BlockTemplate` (
  `id`, `name`, `slug`, `description`, `category`,
  `defaultConfig`, `configSchema`, `componentCode`,
  `isSystem`, `isActive`, `isPro`, `usageCount`, `createdAt`, `updatedAt`
)
VALUES (
  'blog-grid-001',
  'Blog Grid',
  'blog-grid',
  'Display blog posts in a responsive grid layout',
  'BLOG',
  JSON_OBJECT(
    'selectionMode', 'auto',
    'postIds', JSON_ARRAY(),
    'category', '',
    'featured', false,
    'latest', true,
    'sortOrder', 'newest',
    'limit', 6,
    'columns', 3,
    'cardStyle', 'default',
    'showExcerpt', true,
    'showAuthor', true,
    'showDate', true,
    'paddingTop', '60px',
    'paddingBottom', '60px',
    'backgroundColor', '#ffffff',
    'maxWidth', '1280px'
  ),
  JSON_OBJECT(
    'fields', JSON_ARRAY(
      JSON_OBJECT('name', 'selectionMode', 'type', 'select', 'label', 'Selection Mode', 'options', JSON_ARRAY(JSON_OBJECT('value', 'auto', 'label', 'Auto Query'), JSON_OBJECT('value', 'manual', 'label', 'Manual Selection')), 'default', 'auto'),
      JSON_OBJECT('name', 'postIds', 'type', 'text', 'label', 'Post IDs (comma-separated)', 'required', false),
      JSON_OBJECT('name', 'category', 'type', 'text', 'label', 'Category Slug', 'required', false),
      JSON_OBJECT('name', 'latest', 'type', 'checkbox', 'label', 'Latest Posts', 'default', true),
      JSON_OBJECT('name', 'sortOrder', 'type', 'select', 'label', 'Sort Order', 'options', JSON_ARRAY(JSON_OBJECT('value', 'newest', 'label', 'Newest'), JSON_OBJECT('value', 'oldest', 'label', 'Oldest'), JSON_OBJECT('value', 'title', 'label', 'Title A-Z')), 'default', 'newest'),
      JSON_OBJECT('name', 'limit', 'type', 'number', 'label', 'Number of Posts', 'min', 1, 'max', 50, 'default', 6),
      JSON_OBJECT('name', 'columns', 'type', 'select', 'label', 'Grid Columns', 'options', JSON_ARRAY(JSON_OBJECT('value', 2, 'label', '2 Columns'), JSON_OBJECT('value', 3, 'label', '3 Columns'), JSON_OBJECT('value', 4, 'label', '4 Columns')), 'default', 3),
      JSON_OBJECT('name', 'showExcerpt', 'type', 'checkbox', 'label', 'Show Excerpt', 'default', true),
      JSON_OBJECT('name', 'showAuthor', 'type', 'checkbox', 'label', 'Show Author', 'default', true),
      JSON_OBJECT('name', 'showDate', 'type', 'checkbox', 'label', 'Show Date', 'default', true)
    )
  ),
  'export default function BlogGrid({ config }) { return React.createElement("div", { className: "blog-grid-block" }, "Blog Grid Block"); }',
  true, true, false, 0, NOW(), NOW()
)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `defaultConfig` = VALUES(`defaultConfig`),
  `configSchema` = VALUES(`configSchema`),
  `componentCode` = VALUES(`componentCode`),
  `updatedAt` = NOW();

-- Blog Post Card Block
INSERT INTO `BlockTemplate` (
  `id`, `name`, `slug`, `description`, `category`,
  `defaultConfig`, `configSchema`, `componentCode`,
  `isSystem`, `isActive`, `isPro`, `usageCount`, `createdAt`, `updatedAt`
)
VALUES (
  'blog-post-card-001',
  'Blog Post Card',
  'blog-post-card',
  'Display a single blog post card',
  'BLOG',
  JSON_OBJECT(
    'postId', '',
    'showImage', true,
    'showExcerpt', true,
    'showAuthor', true,
    'showDate', true,
    'showCategory', true,
    'cardStyle', 'default',
    'linkBehavior', 'link',
    'paddingTop', '40px',
    'paddingBottom', '40px',
    'backgroundColor', '#ffffff',
    'maxWidth', '600px',
    'alignment', 'center'
  ),
  JSON_OBJECT(
    'fields', JSON_ARRAY(
      JSON_OBJECT('name', 'postId', 'type', 'text', 'label', 'Post ID', 'required', true),
      JSON_OBJECT('name', 'showImage', 'type', 'checkbox', 'label', 'Show Image', 'default', true),
      JSON_OBJECT('name', 'showExcerpt', 'type', 'checkbox', 'label', 'Show Excerpt', 'default', true),
      JSON_OBJECT('name', 'showAuthor', 'type', 'checkbox', 'label', 'Show Author', 'default', true),
      JSON_OBJECT('name', 'showDate', 'type', 'checkbox', 'label', 'Show Date', 'default', true),
      JSON_OBJECT('name', 'showCategory', 'type', 'checkbox', 'label', 'Show Category', 'default', true),
      JSON_OBJECT('name', 'linkBehavior', 'type', 'select', 'label', 'Link Behavior', 'options', JSON_ARRAY(JSON_OBJECT('value', 'link', 'label', 'Link to Post'), JSON_OBJECT('value', 'no-link', 'label', 'No Link')), 'default', 'link'),
      JSON_OBJECT('name', 'alignment', 'type', 'select', 'label', 'Alignment', 'options', JSON_ARRAY(JSON_OBJECT('value', 'left', 'label', 'Left'), JSON_OBJECT('value', 'center', 'label', 'Center'), JSON_OBJECT('value', 'right', 'label', 'Right')), 'default', 'center')
    )
  ),
  'export default function BlogPostCard({ config }) { return React.createElement("div", { className: "blog-post-card-block" }, "Blog Post Card Block"); }',
  true, true, false, 0, NOW(), NOW()
)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `defaultConfig` = VALUES(`defaultConfig`),
  `configSchema` = VALUES(`configSchema`),
  `componentCode` = VALUES(`componentCode`),
  `updatedAt` = NOW();

-- Blog Post Content Block
INSERT INTO `BlockTemplate` (
  `id`, `name`, `slug`, `description`, `category`,
  `defaultConfig`, `configSchema`, `componentCode`,
  `isSystem`, `isActive`, `isPro`, `usageCount`, `createdAt`, `updatedAt`
)
VALUES (
  'blog-post-content-001',
  'Blog Post Content',
  'blog-post-content',
  'Display full blog post content with metadata',
  'BLOG',
  JSON_OBJECT(
    'postId', '',
    'showTitle', true,
    'showFeaturedImage', true,
    'showAuthor', true,
    'showDate', true,
    'showCategory', true,
    'showTags', true,
    'contentWidth', 'medium',
    'paddingTop', '60px',
    'paddingBottom', '60px',
    'backgroundColor', '#ffffff'
  ),
  JSON_OBJECT(
    'fields', JSON_ARRAY(
      JSON_OBJECT('name', 'postId', 'type', 'text', 'label', 'Post ID', 'required', true),
      JSON_OBJECT('name', 'showTitle', 'type', 'checkbox', 'label', 'Show Title', 'default', true),
      JSON_OBJECT('name', 'showFeaturedImage', 'type', 'checkbox', 'label', 'Show Featured Image', 'default', true),
      JSON_OBJECT('name', 'showAuthor', 'type', 'checkbox', 'label', 'Show Author', 'default', true),
      JSON_OBJECT('name', 'showDate', 'type', 'checkbox', 'label', 'Show Date', 'default', true),
      JSON_OBJECT('name', 'showCategory', 'type', 'checkbox', 'label', 'Show Category', 'default', true),
      JSON_OBJECT('name', 'showTags', 'type', 'checkbox', 'label', 'Show Tags', 'default', true),
      JSON_OBJECT('name', 'contentWidth', 'type', 'select', 'label', 'Content Width', 'options', JSON_ARRAY(JSON_OBJECT('value', 'narrow', 'label', 'Narrow'), JSON_OBJECT('value', 'medium', 'label', 'Medium'), JSON_OBJECT('value', 'wide', 'label', 'Wide'), JSON_OBJECT('value', 'full', 'label', 'Full')), 'default', 'medium')
    )
  ),
  'export default function BlogPostContent({ config }) { return React.createElement("div", { className: "blog-post-content-block" }, "Blog Post Content Block"); }',
  true, true, false, 0, NOW(), NOW()
)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `defaultConfig` = VALUES(`defaultConfig`),
  `configSchema` = VALUES(`configSchema`),
  `componentCode` = VALUES(`componentCode`),
  `updatedAt` = NOW();

-- Blog Categories Block
INSERT INTO `BlockTemplate` (
  `id`, `name`, `slug`, `description`, `category`,
  `defaultConfig`, `configSchema`, `componentCode`,
  `isSystem`, `isActive`, `isPro`, `usageCount`, `createdAt`, `updatedAt`
)
VALUES (
  'blog-categories-001',
  'Blog Categories',
  'blog-categories',
  'Display blog category navigation/filter',
  'BLOG',
  JSON_OBJECT(
    'showCategoryCount', true,
    'layout', 'list',
    'showActiveIndicator', true,
    'categoryStyle', 'default',
    'paddingTop', '40px',
    'paddingBottom', '40px',
    'backgroundColor', '#ffffff',
    'maxWidth', '800px'
  ),
  JSON_OBJECT(
    'fields', JSON_ARRAY(
      JSON_OBJECT('name', 'showCategoryCount', 'type', 'checkbox', 'label', 'Show Category Count', 'default', true),
      JSON_OBJECT('name', 'layout', 'type', 'select', 'label', 'Layout', 'options', JSON_ARRAY(JSON_OBJECT('value', 'list', 'label', 'List'), JSON_OBJECT('value', 'grid', 'label', 'Grid')), 'default', 'list'),
      JSON_OBJECT('name', 'showActiveIndicator', 'type', 'checkbox', 'label', 'Show Active Indicator', 'default', true),
      JSON_OBJECT('name', 'categoryStyle', 'type', 'select', 'label', 'Category Style', 'options', JSON_ARRAY(JSON_OBJECT('value', 'default', 'label', 'Default'), JSON_OBJECT('value', 'pills', 'label', 'Pills'), JSON_OBJECT('value', 'buttons', 'label', 'Buttons')), 'default', 'default')
    )
  ),
  'export default function BlogCategories({ config }) { return React.createElement("div", { className: "blog-categories-block" }, "Blog Categories Block"); }',
  true, true, false, 0, NOW(), NOW()
)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `defaultConfig` = VALUES(`defaultConfig`),
  `configSchema` = VALUES(`configSchema`),
  `componentCode` = VALUES(`componentCode`),
  `updatedAt` = NOW();

-- Recent Posts Widget Block
INSERT INTO `BlockTemplate` (
  `id`, `name`, `slug`, `description`, `category`,
  `defaultConfig`, `configSchema`, `componentCode`,
  `isSystem`, `isActive`, `isPro`, `usageCount`, `createdAt`, `updatedAt`
)
VALUES (
  'recent-posts-widget-001',
  'Recent Posts Widget',
  'recent-posts-widget',
  'Display recent blog posts in a sidebar widget style',
  'BLOG',
  JSON_OBJECT(
    'numberOfPosts', 5,
    'showImages', true,
    'showExcerpt', true,
    'showDate', true,
    'widgetStyle', 'default',
    'paddingTop', '40px',
    'paddingBottom', '40px',
    'backgroundColor', '#ffffff',
    'maxWidth', '400px'
  ),
  JSON_OBJECT(
    'fields', JSON_ARRAY(
      JSON_OBJECT('name', 'numberOfPosts', 'type', 'number', 'label', 'Number of Posts', 'min', 1, 'max', 20, 'default', 5),
      JSON_OBJECT('name', 'showImages', 'type', 'checkbox', 'label', 'Show Images', 'default', true),
      JSON_OBJECT('name', 'showExcerpt', 'type', 'checkbox', 'label', 'Show Excerpt', 'default', true),
      JSON_OBJECT('name', 'showDate', 'type', 'checkbox', 'label', 'Show Date', 'default', true),
      JSON_OBJECT('name', 'widgetStyle', 'type', 'select', 'label', 'Widget Style', 'options', JSON_ARRAY(JSON_OBJECT('value', 'default', 'label', 'Default'), JSON_OBJECT('value', 'minimal', 'label', 'Minimal'), JSON_OBJECT('value', 'detailed', 'label', 'Detailed')), 'default', 'default')
    )
  ),
  'export default function RecentPostsWidget({ config }) { return React.createElement("div", { className: "recent-posts-widget-block" }, "Recent Posts Widget Block"); }',
  true, true, false, 0, NOW(), NOW()
)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`),
  `defaultConfig` = VALUES(`defaultConfig`),
  `configSchema` = VALUES(`configSchema`),
  `componentCode` = VALUES(`componentCode`),
  `updatedAt` = NOW();
