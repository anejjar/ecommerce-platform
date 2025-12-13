-- CreateTable
CREATE TABLE `AbandonedCartEmail` (
    `id` VARCHAR(191) NOT NULL,
    `abandonedCartId` VARCHAR(191) NOT NULL,
    `emailType` VARCHAR(191) NOT NULL,
    `sentAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `opened` BOOLEAN NOT NULL DEFAULT false,
    `clicked` BOOLEAN NOT NULL DEFAULT false,

    INDEX `AbandonedCartEmail_abandonedCartId_idx`(`abandonedCartId`),
    INDEX `AbandonedCartEmail_emailType_idx`(`emailType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AbandonedCartEmail` ADD CONSTRAINT `AbandonedCartEmail_abandonedCartId_fkey` FOREIGN KEY (`abandonedCartId`) REFERENCES `AbandonedCart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
