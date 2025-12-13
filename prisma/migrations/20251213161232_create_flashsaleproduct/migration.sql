-- CreateTable
CREATE TABLE `FlashSaleProduct` (
    `id` VARCHAR(191) NOT NULL,
    `flashSaleId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `originalPrice` DECIMAL(10, 2) NOT NULL,
    `salePrice` DECIMAL(10, 2) NOT NULL,
    `maxQuantity` INTEGER NULL,
    `soldQuantity` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FlashSaleProduct_flashSaleId_idx`(`flashSaleId`),
    INDEX `FlashSaleProduct_productId_idx`(`productId`),
    UNIQUE INDEX `FlashSaleProduct_flashSaleId_productId_key`(`flashSaleId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FlashSaleProduct` ADD CONSTRAINT `FlashSaleProduct_flashSaleId_fkey` FOREIGN KEY (`flashSaleId`) REFERENCES `FlashSale`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlashSaleProduct` ADD CONSTRAINT `FlashSaleProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
