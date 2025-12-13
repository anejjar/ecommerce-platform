-- CreateTable
CREATE TABLE `MediaTag` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MediaTag_name_key`(`name`),
    UNIQUE INDEX `MediaTag_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MediaLibraryToMediaTag` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_MediaLibraryToMediaTag_AB_unique`(`A`, `B`),
    INDEX `_MediaLibraryToMediaTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_MediaLibraryToMediaTag` ADD CONSTRAINT `_MediaLibraryToMediaTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `MediaLibrary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MediaLibraryToMediaTag` ADD CONSTRAINT `_MediaLibraryToMediaTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `MediaTag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
