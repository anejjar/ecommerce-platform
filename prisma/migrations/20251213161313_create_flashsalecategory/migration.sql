-- CreateTable
CREATE TABLE `FlashSaleCategory` (
    `id` VARCHAR(191) NOT NULL,
    `flashSaleId` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FlashSaleCategory_flashSaleId_idx`(`flashSaleId`),
    INDEX `FlashSaleCategory_categoryId_idx`(`categoryId`),
    UNIQUE INDEX `FlashSaleCategory_flashSaleId_categoryId_key`(`flashSaleId`, `categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FlashSaleCategory` ADD CONSTRAINT `FlashSaleCategory_flashSaleId_fkey` FOREIGN KEY (`flashSaleId`) REFERENCES `FlashSale`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlashSaleCategory` ADD CONSTRAINT `FlashSaleCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
