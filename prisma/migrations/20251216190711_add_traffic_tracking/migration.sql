-- AlterTable
ALTER TABLE `Order` ADD COLUMN `attributionCampaign` VARCHAR(191) NULL,
    ADD COLUMN `attributionMedium` VARCHAR(191) NULL,
    ADD COLUMN `attributionSource` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `TrafficSession` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `firstTouchSource` VARCHAR(191) NULL,
    `firstTouchMedium` VARCHAR(191) NULL,
    `firstTouchCampaign` VARCHAR(191) NULL,
    `firstTouchContent` VARCHAR(191) NULL,
    `firstTouchTerm` VARCHAR(191) NULL,
    `firstTouchReferrer` TEXT NULL,
    `firstTouchLandingPage` TEXT NULL,
    `lastTouchSource` VARCHAR(191) NULL,
    `lastTouchMedium` VARCHAR(191) NULL,
    `lastTouchCampaign` VARCHAR(191) NULL,
    `lastTouchContent` VARCHAR(191) NULL,
    `lastTouchTerm` VARCHAR(191) NULL,
    `lastTouchReferrer` TEXT NULL,
    `lastTouchLandingPage` TEXT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` TEXT NULL,
    `deviceType` VARCHAR(191) NULL,
    `browser` VARCHAR(191) NULL,
    `os` VARCHAR(191) NULL,
    `pageViewCount` INTEGER NOT NULL DEFAULT 0,
    `productViewCount` INTEGER NOT NULL DEFAULT 0,
    `addToCartCount` INTEGER NOT NULL DEFAULT 0,
    `converted` BOOLEAN NOT NULL DEFAULT false,
    `orderId` VARCHAR(191) NULL,
    `conversionValue` DECIMAL(10, 2) NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastActivityAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TrafficSession_sessionToken_key`(`sessionToken`),
    INDEX `TrafficSession_sessionToken_idx`(`sessionToken`),
    INDEX `TrafficSession_userId_idx`(`userId`),
    INDEX `TrafficSession_firstTouchSource_firstTouchMedium_idx`(`firstTouchSource`, `firstTouchMedium`),
    INDEX `TrafficSession_converted_idx`(`converted`),
    INDEX `TrafficSession_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrafficPageView` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `path` TEXT NOT NULL,
    `title` VARCHAR(191) NULL,
    `referrer` TEXT NULL,
    `timeOnPageSeconds` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TrafficPageView_sessionId_idx`(`sessionId`),
    INDEX `TrafficPageView_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrafficProductView` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `viewDurationSeconds` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TrafficProductView_sessionId_idx`(`sessionId`),
    INDEX `TrafficProductView_productId_idx`(`productId`),
    INDEX `TrafficProductView_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrafficEvent` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `eventType` ENUM('ADD_TO_CART', 'REMOVE_FROM_CART', 'CHECKOUT_START', 'CHECKOUT_COMPLETE', 'WISHLIST_ADD', 'SEARCH', 'CUSTOM') NOT NULL,
    `eventData` JSON NULL,
    `eventValue` DECIMAL(10, 2) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TrafficEvent_sessionId_idx`(`sessionId`),
    INDEX `TrafficEvent_eventType_idx`(`eventType`),
    INDEX `TrafficEvent_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Order_attributionSource_attributionMedium_idx` ON `Order`(`attributionSource`, `attributionMedium`);

-- AddForeignKey
ALTER TABLE `TrafficSession` ADD CONSTRAINT `TrafficSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrafficSession` ADD CONSTRAINT `TrafficSession_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrafficPageView` ADD CONSTRAINT `TrafficPageView_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `TrafficSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrafficProductView` ADD CONSTRAINT `TrafficProductView_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `TrafficSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrafficProductView` ADD CONSTRAINT `TrafficProductView_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrafficEvent` ADD CONSTRAINT `TrafficEvent_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `TrafficSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
