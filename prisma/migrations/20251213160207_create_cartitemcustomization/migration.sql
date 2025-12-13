-- CreateTable
CREATE TABLE `CartItemCustomization` (
    `id` VARCHAR(191) NOT NULL,
    `cartItemId` VARCHAR(191) NOT NULL,
    `fieldId` VARCHAR(191) NOT NULL,
    `value` TEXT NULL,
    `fileUrl` VARCHAR(191) NULL,
    `fileName` VARCHAR(191) NULL,
    `priceModifier` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CartItemCustomization_cartItemId_idx`(`cartItemId`),
    INDEX `CartItemCustomization_fieldId_idx`(`fieldId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CartItemCustomization` ADD CONSTRAINT `CartItemCustomization_cartItemId_fkey` FOREIGN KEY (`cartItemId`) REFERENCES `CartItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItemCustomization` ADD CONSTRAINT `CartItemCustomization_fieldId_fkey` FOREIGN KEY (`fieldId`) REFERENCES `ProductCustomizationField`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
