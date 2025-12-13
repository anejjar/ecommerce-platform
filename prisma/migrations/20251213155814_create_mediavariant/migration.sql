-- CreateTable
CREATE TABLE `MediaVariant` (
    `id` VARCHAR(191) NOT NULL,
    `mediaId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `width` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `url` TEXT NOT NULL,
    `cloudinaryId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MediaVariant_mediaId_idx`(`mediaId`),
    UNIQUE INDEX `MediaVariant_mediaId_name_key`(`mediaId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MediaVariant` ADD CONSTRAINT `MediaVariant_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `MediaLibrary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
