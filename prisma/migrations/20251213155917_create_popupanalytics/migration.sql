-- CreateTable
CREATE TABLE `PopupAnalytics` (
    `id` VARCHAR(191) NOT NULL,
    `popupId` VARCHAR(191) NOT NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `clicks` INTEGER NOT NULL DEFAULT 0,
    `dismissals` INTEGER NOT NULL DEFAULT 0,
    `conversions` INTEGER NOT NULL DEFAULT 0,
    `date` DATE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PopupAnalytics_popupId_idx`(`popupId`),
    INDEX `PopupAnalytics_date_idx`(`date`),
    UNIQUE INDEX `PopupAnalytics_popupId_date_key`(`popupId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PopupAnalytics` ADD CONSTRAINT `PopupAnalytics_popupId_fkey` FOREIGN KEY (`popupId`) REFERENCES `Popup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
