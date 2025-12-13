-- CreateTable
CREATE TABLE `ProductCustomizationOption` (
    `id` VARCHAR(191) NOT NULL,
    `fieldId` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `priceModifier` DECIMAL(10, 2) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProductCustomizationOption_fieldId_idx`(`fieldId`),
    INDEX `ProductCustomizationOption_position_idx`(`position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductCustomizationOption` ADD CONSTRAINT `ProductCustomizationOption_fieldId_fkey` FOREIGN KEY (`fieldId`) REFERENCES `ProductCustomizationField`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
