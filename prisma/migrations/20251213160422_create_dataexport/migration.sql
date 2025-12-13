-- CreateTable
CREATE TABLE `DataExport` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('PRODUCTS', 'PRODUCT_IMAGES', 'PRODUCT_VARIANTS', 'ORDERS', 'CUSTOMERS', 'CATEGORIES', 'INVENTORY', 'BLOG_POSTS', 'PAGES', 'MEDIA_LIBRARY', 'REVIEWS', 'NEWSLETTER_SUBSCRIBERS', 'DISCOUNT_CODES', 'CUSTOM') NOT NULL,
    `format` ENUM('CSV', 'JSON', 'XLSX') NOT NULL DEFAULT 'CSV',
    `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `filters` TEXT NULL,
    `filename` VARCHAR(191) NULL,
    `fileUrl` VARCHAR(191) NULL,
    `fileSize` INTEGER NULL,
    `recordCount` INTEGER NULL,
    `errorMessage` TEXT NULL,
    `createdById` VARCHAR(191) NULL,
    `completedAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DataExport_status_idx`(`status`),
    INDEX `DataExport_type_idx`(`type`),
    INDEX `DataExport_createdAt_idx`(`createdAt`),
    INDEX `DataExport_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DataExport` ADD CONSTRAINT `DataExport_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
