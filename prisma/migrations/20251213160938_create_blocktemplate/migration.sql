-- CreateTable
CREATE TABLE `BlockTemplate` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `category` ENUM('HERO', 'CONTENT', 'FEATURES', 'CTA', 'TESTIMONIALS', 'PRICING', 'TEAM', 'STATS', 'LOGO_GRID', 'FORM', 'FAQ', 'GALLERY', 'VIDEO', 'NAVIGATION', 'HEADER', 'FOOTER', 'SOCIAL', 'BREADCRUMBS', 'DIVIDER', 'SPACER', 'CUSTOM', 'PRODUCT', 'BLOG', 'CONTAINER', 'LAYOUT') NOT NULL,
    `thumbnail` VARCHAR(191) NULL,
    `previewUrl` VARCHAR(191) NULL,
    `defaultConfig` JSON NOT NULL,
    `configSchema` JSON NOT NULL,
    `componentCode` TEXT NOT NULL,
    `htmlTemplate` TEXT NULL,
    `cssStyles` TEXT NULL,
    `isSystem` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isPro` BOOLEAN NOT NULL DEFAULT false,
    `usageCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BlockTemplate_slug_key`(`slug`),
    INDEX `BlockTemplate_category_idx`(`category`),
    INDEX `BlockTemplate_isActive_idx`(`isActive`),
    INDEX `BlockTemplate_slug_idx`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
