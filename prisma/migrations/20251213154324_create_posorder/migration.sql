-- CreateTable
CREATE TABLE `PosOrder` (
    `id` VARCHAR(191) NOT NULL,
    `orderType` ENUM('DINE_IN', 'TAKE_AWAY', 'DELIVERY') NOT NULL,
    `locationId` VARCHAR(191) NOT NULL,
    `cashierId` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NULL,
    `tableNumber` VARCHAR(191) NULL,
    `customerName` VARCHAR(191) NULL,
    `paymentMethod` ENUM('CASH', 'CARD', 'DIGITAL_WALLET', 'SPLIT') NOT NULL,
    `paymentDetails` TEXT NULL,
    `receiptPrinted` BOOLEAN NOT NULL DEFAULT false,
    `subtotal` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `tax` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `discount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `discountCode` VARCHAR(191) NULL,
    `discountType` VARCHAR(191) NULL,
    `total` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `status` ENUM('ACTIVE', 'HELD', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    `notes` TEXT NULL,
    `specialInstructions` TEXT NULL,
    `orderId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PosOrder_orderId_key`(`orderId`),
    INDEX `PosOrder_locationId_idx`(`locationId`),
    INDEX `PosOrder_cashierId_idx`(`cashierId`),
    INDEX `PosOrder_customerId_idx`(`customerId`),
    INDEX `PosOrder_orderType_idx`(`orderType`),
    INDEX `PosOrder_status_idx`(`status`),
    INDEX `PosOrder_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PosOrder` ADD CONSTRAINT `PosOrder_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PosOrder` ADD CONSTRAINT `PosOrder_cashierId_fkey` FOREIGN KEY (`cashierId`) REFERENCES `Cashier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PosOrder` ADD CONSTRAINT `PosOrder_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
