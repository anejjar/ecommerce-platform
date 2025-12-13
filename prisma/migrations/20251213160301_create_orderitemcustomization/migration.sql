-- CreateTable
CREATE TABLE `OrderItemCustomization` (
    `id` VARCHAR(191) NOT NULL,
    `orderItemId` VARCHAR(191) NOT NULL,
    `fieldId` VARCHAR(191) NULL,
    `fieldLabel` VARCHAR(191) NOT NULL,
    `fieldType` VARCHAR(191) NOT NULL,
    `value` TEXT NULL,
    `fileUrl` VARCHAR(191) NULL,
    `fileName` VARCHAR(191) NULL,
    `priceModifier` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `OrderItemCustomization_orderItemId_idx`(`orderItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrderItemCustomization` ADD CONSTRAINT `OrderItemCustomization_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `OrderItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItemCustomization` ADD CONSTRAINT `OrderItemCustomization_fieldId_fkey` FOREIGN KEY (`fieldId`) REFERENCES `ProductCustomizationField`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
