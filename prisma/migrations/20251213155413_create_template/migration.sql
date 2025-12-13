-- CreateTable
CREATE TABLE `Template` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('INVOICE', 'PACKING_SLIP', 'EMAIL_TRANSACTIONAL', 'EMAIL_MARKETING') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `content` TEXT NOT NULL,
    `variables` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Template_type_idx`(`type`),
    INDEX `Template_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
