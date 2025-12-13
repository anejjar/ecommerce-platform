-- CreateTable
CREATE TABLE `MediaUsage` (
    `id` VARCHAR(191) NOT NULL,
    `mediaId` VARCHAR(191) NOT NULL,
    `usageType` ENUM('PRODUCT_IMAGE', 'PRODUCT_VARIANT', 'CATEGORY_IMAGE', 'BLOG_FEATURED_IMAGE', 'BLOG_CONTENT', 'PAGE_CONTENT', 'USER_AVATAR', 'STORE_SETTING', 'OTHER') NOT NULL,
    `resourceType` VARCHAR(191) NOT NULL,
    `resourceId` VARCHAR(191) NOT NULL,
    `fieldName` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MediaUsage_mediaId_idx`(`mediaId`),
    INDEX `MediaUsage_resourceType_resourceId_idx`(`resourceType`, `resourceId`),
    UNIQUE INDEX `MediaUsage_mediaId_usageType_resourceType_resourceId_fieldNa_key`(`mediaId`, `usageType`, `resourceType`, `resourceId`, `fieldName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MediaUsage` ADD CONSTRAINT `MediaUsage_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `MediaLibrary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
