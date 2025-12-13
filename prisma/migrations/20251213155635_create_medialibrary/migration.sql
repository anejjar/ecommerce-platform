-- CreateTable
CREATE TABLE `MediaLibrary` (
    `id` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `type` ENUM('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER') NOT NULL,
    `cloudinaryId` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `secureUrl` TEXT NOT NULL,
    `publicId` VARCHAR(191) NOT NULL,
    `version` INTEGER NULL,
    `format` VARCHAR(191) NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `aspectRatio` DOUBLE NULL,
    `altText` TEXT NULL,
    `title` VARCHAR(191) NULL,
    `caption` TEXT NULL,
    `description` TEXT NULL,
    `folderId` VARCHAR(191) NULL,
    `uploadedById` VARCHAR(191) NOT NULL,
    `usageCount` INTEGER NOT NULL DEFAULT 0,
    `lastUsedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MediaLibrary_cloudinaryId_key`(`cloudinaryId`),
    INDEX `MediaLibrary_type_idx`(`type`),
    INDEX `MediaLibrary_folderId_idx`(`folderId`),
    INDEX `MediaLibrary_uploadedById_idx`(`uploadedById`),
    INDEX `MediaLibrary_createdAt_idx`(`createdAt`),
    INDEX `MediaLibrary_cloudinaryId_idx`(`cloudinaryId`),
    FULLTEXT INDEX `MediaLibrary_filename_altText_title_caption_idx`(`filename`, `altText`, `title`, `caption`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MediaLibrary` ADD CONSTRAINT `MediaLibrary_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `MediaFolder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MediaLibrary` ADD CONSTRAINT `MediaLibrary_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
