-- CreateTable
CREATE TABLE `AbandonedCart` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `guestEmail` VARCHAR(191) NULL,
    `guestName` VARCHAR(191) NULL,
    `cartSnapshot` TEXT NOT NULL,
    `totalValue` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('ABANDONED', 'RECOVERED', 'EXPIRED') NOT NULL DEFAULT 'ABANDONED',
    `abandonedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `recoveredAt` DATETIME(3) NULL,
    `recoveryToken` VARCHAR(191) NOT NULL,
    `discountCode` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AbandonedCart_recoveryToken_key`(`recoveryToken`),
    INDEX `AbandonedCart_userId_idx`(`userId`),
    INDEX `AbandonedCart_guestEmail_idx`(`guestEmail`),
    INDEX `AbandonedCart_status_idx`(`status`),
    INDEX `AbandonedCart_abandonedAt_idx`(`abandonedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AbandonedCart` ADD CONSTRAINT `AbandonedCart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
