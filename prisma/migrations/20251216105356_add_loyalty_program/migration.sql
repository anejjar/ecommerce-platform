-- CreateTable
CREATE TABLE `LoyaltyTier` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `pointsRequired` INTEGER NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `benefitsDescription` TEXT NOT NULL,
    `earlyAccessEnabled` BOOLEAN NOT NULL DEFAULT false,
    `earlyAccessHours` INTEGER NOT NULL DEFAULT 24,
    `discountPercentage` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `pointsMultiplier` DECIMAL(3, 2) NOT NULL DEFAULT 1.0,
    `freeShippingThreshold` DECIMAL(10, 2) NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LoyaltyTier_name_key`(`name`),
    INDEX `LoyaltyTier_displayOrder_idx`(`displayOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerLoyaltyAccount` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `pointsBalance` INTEGER NOT NULL DEFAULT 0,
    `lifetimePoints` INTEGER NOT NULL DEFAULT 0,
    `tierId` VARCHAR(191) NOT NULL,
    `referralCode` VARCHAR(191) NOT NULL,
    `enrolledAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastActivityAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `referredById` VARCHAR(191) NULL,

    UNIQUE INDEX `CustomerLoyaltyAccount_userId_key`(`userId`),
    UNIQUE INDEX `CustomerLoyaltyAccount_referralCode_key`(`referralCode`),
    INDEX `CustomerLoyaltyAccount_tierId_idx`(`tierId`),
    INDEX `CustomerLoyaltyAccount_userId_idx`(`userId`),
    INDEX `CustomerLoyaltyAccount_referralCode_idx`(`referralCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoyaltyPointsTransaction` (
    `id` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `type` ENUM('PURCHASE', 'REVIEW', 'REFERRAL_GIVEN', 'REFERRAL_RECEIVED', 'SOCIAL_SHARE', 'REDEMPTION', 'REFUND', 'EXPIRATION', 'MANUAL_ADJUSTMENT', 'EARLY_ACCESS_BONUS') NOT NULL,
    `points` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `referenceType` VARCHAR(191) NULL,
    `referenceId` VARCHAR(191) NULL,
    `expiresAt` DATETIME(3) NULL,
    `expired` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LoyaltyPointsTransaction_accountId_idx`(`accountId`),
    INDEX `LoyaltyPointsTransaction_expiresAt_expired_idx`(`expiresAt`, `expired`),
    INDEX `LoyaltyPointsTransaction_referenceType_referenceId_idx`(`referenceType`, `referenceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoyaltyRedemption` (
    `id` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `type` ENUM('DISCOUNT_CODE', 'FREE_PRODUCT', 'FREE_SHIPPING') NOT NULL,
    `pointsSpent` INTEGER NOT NULL,
    `discountCodeId` VARCHAR(191) NULL,
    `productId` VARCHAR(191) NULL,
    `orderId` VARCHAR(191) NULL,
    `description` VARCHAR(191) NOT NULL,
    `redeemedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LoyaltyRedemption_discountCodeId_key`(`discountCodeId`),
    INDEX `LoyaltyRedemption_accountId_idx`(`accountId`),
    INDEX `LoyaltyRedemption_redeemedAt_idx`(`redeemedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoyaltyEarlyAccess` (
    `id` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `accessType` VARCHAR(191) NOT NULL,
    `referenceId` VARCHAR(191) NOT NULL,
    `grantedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,
    `notified` BOOLEAN NOT NULL DEFAULT false,
    `accessed` BOOLEAN NOT NULL DEFAULT false,

    INDEX `LoyaltyEarlyAccess_expiresAt_idx`(`expiresAt`),
    INDEX `LoyaltyEarlyAccess_accountId_idx`(`accountId`),
    UNIQUE INDEX `LoyaltyEarlyAccess_accountId_accessType_referenceId_key`(`accountId`, `accessType`, `referenceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoyaltySettings` (
    `id` VARCHAR(191) NOT NULL,
    `pointsPerDollar` DECIMAL(10, 2) NOT NULL DEFAULT 1,
    `pointsPerReview` INTEGER NOT NULL DEFAULT 50,
    `pointsPerReferral` INTEGER NOT NULL DEFAULT 500,
    `pointsPerSocialShare` INTEGER NOT NULL DEFAULT 25,
    `redemptionRate` INTEGER NOT NULL DEFAULT 100,
    `pointsExpirationDays` INTEGER NOT NULL DEFAULT 365,
    `enableEmailNotifications` BOOLEAN NOT NULL DEFAULT true,
    `minimumRedemptionPoints` INTEGER NOT NULL DEFAULT 100,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CustomerLoyaltyAccount` ADD CONSTRAINT `CustomerLoyaltyAccount_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerLoyaltyAccount` ADD CONSTRAINT `CustomerLoyaltyAccount_tierId_fkey` FOREIGN KEY (`tierId`) REFERENCES `LoyaltyTier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerLoyaltyAccount` ADD CONSTRAINT `CustomerLoyaltyAccount_referredById_fkey` FOREIGN KEY (`referredById`) REFERENCES `CustomerLoyaltyAccount`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoyaltyPointsTransaction` ADD CONSTRAINT `LoyaltyPointsTransaction_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `CustomerLoyaltyAccount`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoyaltyRedemption` ADD CONSTRAINT `LoyaltyRedemption_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `CustomerLoyaltyAccount`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoyaltyRedemption` ADD CONSTRAINT `LoyaltyRedemption_discountCodeId_fkey` FOREIGN KEY (`discountCodeId`) REFERENCES `DiscountCode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoyaltyRedemption` ADD CONSTRAINT `LoyaltyRedemption_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoyaltyRedemption` ADD CONSTRAINT `LoyaltyRedemption_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoyaltyEarlyAccess` ADD CONSTRAINT `LoyaltyEarlyAccess_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `CustomerLoyaltyAccount`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
