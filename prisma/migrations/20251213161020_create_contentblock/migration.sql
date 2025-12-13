-- CreateTable
CREATE TABLE `ContentBlock` (
    `id` VARCHAR(191) NOT NULL,
    `templateId` VARCHAR(191) NOT NULL,
    `pageId` VARCHAR(191) NULL,
    `postId` VARCHAR(191) NULL,
    `containerType` ENUM('BLOCK', 'SECTION', 'FLEXBOX', 'GRID') NOT NULL DEFAULT 'BLOCK',
    `parentId` VARCHAR(191) NULL,
    `contentConfig` JSON NOT NULL,
    `styleConfig` JSON NULL,
    `advancedConfig` JSON NULL,
    `config` JSON NULL,
    `layoutSettings` JSON NULL,
    `customCss` TEXT NULL,
    `customClasses` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isVisible` BOOLEAN NOT NULL DEFAULT true,
    `visibilityRules` JSON NULL,
    `hideOnMobile` BOOLEAN NOT NULL DEFAULT false,
    `hideOnTablet` BOOLEAN NOT NULL DEFAULT false,
    `hideOnDesktop` BOOLEAN NOT NULL DEFAULT false,
    `animationType` VARCHAR(191) NULL,
    `animationDelay` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ContentBlock_pageId_order_idx`(`pageId`, `order`),
    INDEX `ContentBlock_postId_order_idx`(`postId`, `order`),
    INDEX `ContentBlock_templateId_idx`(`templateId`),
    INDEX `ContentBlock_parentId_idx`(`parentId`),
    INDEX `ContentBlock_containerType_idx`(`containerType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ContentBlock` ADD CONSTRAINT `ContentBlock_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `BlockTemplate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContentBlock` ADD CONSTRAINT `ContentBlock_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `Page`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContentBlock` ADD CONSTRAINT `ContentBlock_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `BlogPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContentBlock` ADD CONSTRAINT `ContentBlock_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `ContentBlock`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
