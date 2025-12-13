-- CreateTable
CREATE TABLE `SchemaMarkup` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('ORGANIZATION', 'PRODUCT', 'BREADCRUMB', 'FAQ', 'ARTICLE', 'REVIEW', 'LOCAL_BUSINESS', 'EVENT', 'RECIPE', 'VIDEO') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `schemaData` TEXT NOT NULL,
    `applyToAll` BOOLEAN NOT NULL DEFAULT false,
    `targetPages` TEXT NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SchemaMarkup_type_idx`(`type`),
    INDEX `SchemaMarkup_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
