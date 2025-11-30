-- Add PRODUCT and BLOG to BlockCategory enum
-- MySQL requires recreating the enum with new values

ALTER TABLE `BlockTemplate` 
MODIFY COLUMN `category` ENUM(
  'HERO',
  'CONTENT',
  'FEATURES',
  'CTA',
  'TESTIMONIALS',
  'PRICING',
  'TEAM',
  'STATS',
  'LOGO_GRID',
  'FORM',
  'FAQ',
  'GALLERY',
  'VIDEO',
  'NAVIGATION',
  'HEADER',
  'FOOTER',
  'SOCIAL',
  'BREADCRUMBS',
  'DIVIDER',
  'SPACER',
  'CUSTOM',
  'PRODUCT',
  'BLOG'
) NOT NULL;

