-- CreateTable
CREATE TABLE `Theme` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `version` VARCHAR(191) NOT NULL DEFAULT '1.0.0',
    `author` VARCHAR(191) NULL,
    `previewImage` VARCHAR(191) NULL,
    `isBuiltIn` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `themeConfig` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Theme_name_key`(`name`),
    INDEX `Theme_isActive_idx`(`isActive`),
    INDEX `Theme_isBuiltIn_idx`(`isBuiltIn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
