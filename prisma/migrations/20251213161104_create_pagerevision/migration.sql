-- CreateTable
CREATE TABLE `PageRevision` (
    `id` VARCHAR(191) NOT NULL,
    `pageId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `content` TEXT NULL,
    `seoTitle` VARCHAR(191) NULL,
    `seoDescription` TEXT NULL,
    `seoKeywords` VARCHAR(191) NULL,
    `ogImage` VARCHAR(191) NULL,
    `ogTitle` VARCHAR(191) NULL,
    `ogDescription` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED') NOT NULL,
    `layoutConfig` JSON NULL,
    `customCss` TEXT NULL,
    `customJs` TEXT NULL,
    `useBlockEditor` BOOLEAN NOT NULL,
    `useStorefrontLayout` BOOLEAN NOT NULL,
    `blocksSnapshot` JSON NULL,
    `overridesStorefrontPage` BOOLEAN NOT NULL,
    `overriddenPageType` VARCHAR(191) NULL,
    `revisionNumber` INTEGER NOT NULL,
    `note` TEXT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PageRevision_pageId_idx`(`pageId`),
    INDEX `PageRevision_createdAt_idx`(`createdAt`),
    INDEX `PageRevision_revisionNumber_idx`(`revisionNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PageRevision` ADD CONSTRAINT `PageRevision_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `Page`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PageRevision` ADD CONSTRAINT `PageRevision_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
