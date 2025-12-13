-- CreateTable
CREATE TABLE `DataImport` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('PRODUCTS', 'PRODUCT_IMAGES', 'PRODUCT_VARIANTS', 'ORDERS', 'CUSTOMERS', 'CATEGORIES', 'INVENTORY', 'BLOG_POSTS', 'PAGES', 'MEDIA_LIBRARY', 'REVIEWS', 'NEWSLETTER_SUBSCRIBERS', 'DISCOUNT_CODES', 'CUSTOM') NOT NULL,
    `format` ENUM('CSV', 'JSON', 'XLSX') NOT NULL DEFAULT 'CSV',
    `mode` ENUM('CREATE', 'UPDATE', 'UPSERT') NOT NULL DEFAULT 'CREATE',
    `status` ENUM('PENDING', 'VALIDATING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'PARTIAL') NOT NULL DEFAULT 'PENDING',
    `filename` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `totalRows` INTEGER NULL,
    `successCount` INTEGER NULL,
    `failedCount` INTEGER NULL,
    `skippedCount` INTEGER NULL,
    `errors` TEXT NULL,
    `isPreview` BOOLEAN NOT NULL DEFAULT false,
    `createdById` VARCHAR(191) NULL,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DataImport_status_idx`(`status`),
    INDEX `DataImport_type_idx`(`type`),
    INDEX `DataImport_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DataImport` ADD CONSTRAINT `DataImport_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
