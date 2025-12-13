-- CreateTable
CREATE TABLE `ProductCustomizationField` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `type` ENUM('TEXT', 'TEXTAREA', 'NUMBER', 'DROPDOWN', 'RADIO', 'CHECKBOX', 'COLOR', 'FILE', 'DATE') NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `placeholder` VARCHAR(191) NULL,
    `helpText` VARCHAR(191) NULL,
    `required` BOOLEAN NOT NULL DEFAULT false,
    `position` INTEGER NOT NULL DEFAULT 0,
    `minLength` INTEGER NULL,
    `maxLength` INTEGER NULL,
    `minValue` DOUBLE NULL,
    `maxValue` DOUBLE NULL,
    `pattern` VARCHAR(191) NULL,
    `maxFileSize` INTEGER NULL,
    `allowedTypes` VARCHAR(191) NULL,
    `priceModifier` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `priceModifierType` VARCHAR(191) NOT NULL DEFAULT 'fixed',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProductCustomizationField_productId_idx`(`productId`),
    INDEX `ProductCustomizationField_position_idx`(`position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductCustomizationField` ADD CONSTRAINT `ProductCustomizationField_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
