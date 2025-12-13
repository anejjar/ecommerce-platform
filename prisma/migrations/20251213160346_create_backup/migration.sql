-- CreateTable
CREATE TABLE `Backup` (
    `id` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `type` ENUM('MANUAL', 'SCHEDULED', 'AUTO') NOT NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `includeProducts` BOOLEAN NOT NULL DEFAULT true,
    `includeOrders` BOOLEAN NOT NULL DEFAULT true,
    `includeCustomers` BOOLEAN NOT NULL DEFAULT true,
    `includeMedia` BOOLEAN NOT NULL DEFAULT false,
    `includeSettings` BOOLEAN NOT NULL DEFAULT true,
    `fileUrl` VARCHAR(191) NULL,
    `localPath` VARCHAR(191) NULL,
    `recordCount` INTEGER NULL,
    `errorMessage` TEXT NULL,
    `createdById` VARCHAR(191) NULL,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Backup_status_idx`(`status`),
    INDEX `Backup_type_idx`(`type`),
    INDEX `Backup_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Backup` ADD CONSTRAINT `Backup_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
