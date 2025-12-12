/*
  Migration: Add Container System and Three-Tab Configuration

  This migration adds support for:
  - Nested containers (parentId, children relationships)
  - Container types (BLOCK, SECTION, FLEXBOX, GRID)
  - Three-tab configuration structure (contentConfig, styleConfig, advancedConfig)
  - Layout settings for containers
*/

-- Step 1: Update BlockTemplate category enum to include CONTAINER and LAYOUT
ALTER TABLE `blocktemplate` MODIFY `category` ENUM('HERO', 'CONTENT', 'FEATURES', 'CTA', 'TESTIMONIALS', 'PRICING', 'TEAM', 'STATS', 'LOGO_GRID', 'FORM', 'FAQ', 'GALLERY', 'VIDEO', 'NAVIGATION', 'HEADER', 'FOOTER', 'SOCIAL', 'BREADCRUMBS', 'DIVIDER', 'SPACER', 'CUSTOM', 'PRODUCT', 'BLOG', 'CONTAINER', 'LAYOUT') NOT NULL;

-- Step 2: Add new columns to ContentBlock (with contentConfig as nullable first)
ALTER TABLE `contentblock`
    ADD COLUMN `containerType` ENUM('BLOCK', 'SECTION', 'FLEXBOX', 'GRID') NOT NULL DEFAULT 'BLOCK',
    ADD COLUMN `parentId` VARCHAR(191) NULL,
    ADD COLUMN `contentConfig` JSON NULL,
    ADD COLUMN `styleConfig` JSON NULL,
    ADD COLUMN `advancedConfig` JSON NULL,
    ADD COLUMN `layoutSettings` JSON NULL;

-- Step 3: Migrate existing data - copy config to contentConfig for all existing blocks
UPDATE `contentblock` SET `contentConfig` = `config` WHERE `contentConfig` IS NULL AND `config` IS NOT NULL;

-- Step 4: Set empty object for any remaining NULL contentConfig values
UPDATE `contentblock` SET `contentConfig` = '{}' WHERE `contentConfig` IS NULL;

-- Step 5: Now make contentConfig NOT NULL and config nullable
ALTER TABLE `contentblock`
    MODIFY `contentConfig` JSON NOT NULL,
    MODIFY `config` JSON NULL;

-- CreateIndex
CREATE INDEX `ContentBlock_parentId_idx` ON `ContentBlock`(`parentId`);

-- CreateIndex
CREATE INDEX `ContentBlock_containerType_idx` ON `ContentBlock`(`containerType`);

-- AddForeignKey
ALTER TABLE `ContentBlock` ADD CONSTRAINT `ContentBlock_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `ContentBlock`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
