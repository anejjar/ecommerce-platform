-- Data Migration: Unify LandingPage into Page
-- This script migrates all LandingPage data to Page model
-- Run this AFTER the schema migration is applied

-- Step 1: Migrate LandingPage records to Page
-- Handle slug conflicts by appending '-migrated' if needed
INSERT INTO `Page` (
  `id`,
  `title`,
  `slug`,
  `description`,
  `content`,
  `status`,
  `useStorefrontLayout`,
  `useBlockEditor`,
  `seoTitle`,
  `seoDescription`,
  `seoKeywords`,
  `ogImage`,
  `ogTitle`,
  `ogDescription`,
  `publishedAt`,
  `scheduledPublishAt`,
  `layoutConfig`,
  `customCss`,
  `customJs`,
  `templateId`,
  `authorId`,
  `viewCount`,
  `conversionGoal`,
  `createdAt`,
  `updatedAt`
)
SELECT 
  `id`,
  `title`,
  CASE 
    WHEN EXISTS (SELECT 1 FROM `Page` p WHERE p.slug = lp.slug) 
    THEN CONCAT(lp.slug, '-migrated-', UNIX_TIMESTAMP())
    ELSE lp.slug
  END as `slug`,
  `description`,
  '' as `content`, -- Landing pages don't have rich text content
  `status`,
  false as `useStorefrontLayout`, -- Landing pages typically don't use storefront layout
  true as `useBlockEditor`, -- Landing pages use blocks
  `seoTitle`,
  `seoDescription`,
  `seoKeywords`,
  `ogImage`,
  `ogTitle`,
  `ogDescription`,
  `publishedAt`,
  `scheduledPublishAt`,
  `layoutConfig`,
  `customCss`,
  `customJs`,
  `templateId`,
  `authorId`,
  `viewCount`,
  `conversionGoal`,
  `createdAt`,
  `updatedAt`
FROM `LandingPage` lp
WHERE NOT EXISTS (SELECT 1 FROM `Page` p WHERE p.id = lp.id);

-- Step 2: Update ContentBlock records to point to pageId instead of landingPageId
UPDATE `ContentBlock` cb
INNER JOIN `LandingPage` lp ON cb.landingPageId = lp.id
SET cb.pageId = lp.id, cb.landingPageId = NULL
WHERE cb.landingPageId IS NOT NULL;

-- Step 3: Migrate LandingPageRevision to PageRevision
INSERT INTO `PageRevision` (
  `id`,
  `pageId`,
  `title`,
  `slug`,
  `description`,
  `content`,
  `seoTitle`,
  `seoDescription`,
  `seoKeywords`,
  `ogImage`,
  `ogTitle`,
  `ogDescription`,
  `status`,
  `layoutConfig`,
  `customCss`,
  `customJs`,
  `useBlockEditor`,
  `useStorefrontLayout`,
  `blocksSnapshot`,
  `overridesStorefrontPage`,
  `overriddenPageType`,
  `revisionNumber`,
  `note`,
  `createdById`,
  `createdAt`
)
SELECT 
  `id`,
  `pageId`,
  `title`,
  `slug`,
  `description`,
  '' as `content`, -- Landing page revisions don't have rich text
  `seoTitle`,
  `seoDescription`,
  `seoKeywords`,
  `ogImage`,
  `ogTitle`,
  `ogDescription`,
  `status`,
  `layoutConfig`,
  `customCss`,
  `customJs`,
  true as `useBlockEditor`,
  false as `useStorefrontLayout`,
  `blocksSnapshot`,
  false as `overridesStorefrontPage`,
  NULL as `overriddenPageType`,
  `revisionNumber`,
  `note`,
  `createdById`,
  `createdAt`
FROM `LandingPageRevision` lpr
WHERE NOT EXISTS (SELECT 1 FROM `PageRevision` pr WHERE pr.id = lpr.id);

-- Step 4: Update NewsletterSubscriber to point to pageId instead of landingPageId
UPDATE `NewsletterSubscriber` ns
INNER JOIN `LandingPage` lp ON ns.landingPageId = lp.id
SET ns.pageId = lp.id, ns.landingPageId = NULL
WHERE ns.landingPageId IS NOT NULL;

-- Note: After running this migration, you should:
-- 1. Verify all data was migrated correctly
-- 2. Drop LandingPage, LandingPageRevision, and LandingPageTemplate tables
-- 3. Remove landingPageId column from ContentBlock and NewsletterSubscriber tables
-- These drops will be handled by the Prisma schema migration

