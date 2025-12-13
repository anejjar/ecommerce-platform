-- CreateTable
CREATE TABLE `Page` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `content` TEXT NOT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `useStorefrontLayout` BOOLEAN NOT NULL DEFAULT true,
    `useBlockEditor` BOOLEAN NOT NULL DEFAULT false,
    `seoTitle` VARCHAR(191) NULL,
    `seoDescription` TEXT NULL,
    `seoKeywords` VARCHAR(191) NULL,
    `ogImage` VARCHAR(191) NULL,
    `ogTitle` VARCHAR(191) NULL,
    `ogDescription` VARCHAR(191) NULL,
    `publishedAt` DATETIME(3) NULL,
    `scheduledPublishAt` DATETIME(3) NULL,
    `layoutConfig` JSON NULL,
    `customCss` TEXT NULL,
    `customJs` TEXT NULL,
    `templateId` VARCHAR(191) NULL,
    `overridesStorefrontPage` BOOLEAN NOT NULL DEFAULT false,
    `overriddenPageType` VARCHAR(191) NULL,
    `authorId` VARCHAR(191) NULL,
    `viewCount` INTEGER NOT NULL DEFAULT 0,
    `conversionGoal` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Page_slug_key`(`slug`),
    INDEX `Page_slug_idx`(`slug`),
    INDEX `Page_status_idx`(`status`),
    INDEX `Page_overriddenPageType_idx`(`overriddenPageType`),
    INDEX `Page_authorId_idx`(`authorId`),
    INDEX `Page_publishedAt_idx`(`publishedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Page` ADD CONSTRAINT `Page_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
