-- CreateEnum
CREATE TABLE IF NOT EXISTS `FlashSaleStatus` (
  `value` ENUM('DRAFT', 'SCHEDULED', 'ACTIVE', 'ENDED', 'CANCELLED') NOT NULL
);

-- CreateTable
CREATE TABLE IF NOT EXISTS `FlashSale` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `discountType` ENUM('PERCENTAGE', 'FIXED_AMOUNT') NOT NULL,
    `discountValue` DOUBLE NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `status` ENUM('DRAFT', 'SCHEDULED', 'ACTIVE', 'ENDED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `bannerImage` VARCHAR(191) NULL,
    `bannerText` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`),
    INDEX `FlashSale_status_idx`(`status`),
    INDEX `FlashSale_startDate_idx`(`startDate`),
    INDEX `FlashSale_endDate_idx`(`endDate`),
    INDEX `FlashSale_isActive_idx`(`isActive`),
    INDEX `FlashSale_priority_idx`(`priority`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `FlashSaleProduct` (
    `id` VARCHAR(191) NOT NULL,
    `flashSaleId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `originalPrice` DECIMAL(10, 2) NOT NULL,
    `salePrice` DECIMAL(10, 2) NOT NULL,
    `maxQuantity` INTEGER NULL,
    `soldQuantity` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FlashSaleProduct_flashSaleId_productId_key`(`flashSaleId`, `productId`),
    INDEX `FlashSaleProduct_flashSaleId_idx`(`flashSaleId`),
    INDEX `FlashSaleProduct_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `FlashSaleCategory` (
    `id` VARCHAR(191) NOT NULL,
    `flashSaleId` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FlashSaleCategory_flashSaleId_categoryId_key`(`flashSaleId`, `categoryId`),
    INDEX `FlashSaleCategory_flashSaleId_idx`(`flashSaleId`),
    INDEX `FlashSaleCategory_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FlashSaleProduct` ADD CONSTRAINT `FlashSaleProduct_flashSaleId_fkey` FOREIGN KEY (`flashSaleId`) REFERENCES `FlashSale`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlashSaleProduct` ADD CONSTRAINT `FlashSaleProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlashSaleCategory` ADD CONSTRAINT `FlashSaleCategory_flashSaleId_fkey` FOREIGN KEY (`flashSaleId`) REFERENCES `FlashSale`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlashSaleCategory` ADD CONSTRAINT `FlashSaleCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

