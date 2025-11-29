/*
  Warnings:

  - You are about to drop the column `name` on the `productvariant` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `productvariant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cartId,productId,variantId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `optionValues` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Made the column `stock` on table `productvariant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `CartItem_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_userId_fkey`;

-- DropIndex
DROP INDEX `CartItem_cartId_productId_key` ON `cartitem`;

-- DropIndex
DROP INDEX `Order_userId_fkey` ON `order`;

-- AlterTable
ALTER TABLE `cartitem` ADD COLUMN `variantId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `carrier` VARCHAR(191) NULL,
    ADD COLUMN `deliveredAt` DATETIME(3) NULL,
    ADD COLUMN `discountAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `discountCodeId` VARCHAR(191) NULL,
    ADD COLUMN `estimatedDelivery` DATETIME(3) NULL,
    ADD COLUMN `guestEmail` VARCHAR(191) NULL,
    ADD COLUMN `isGuest` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `shippedAt` DATETIME(3) NULL,
    ADD COLUMN `trackingNumber` VARCHAR(191) NULL,
    MODIFY `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `orderitem` ADD COLUMN `variantId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `productvariant` DROP COLUMN `name`,
    DROP COLUMN `value`,
    ADD COLUMN `comparePrice` DECIMAL(10, 2) NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `optionValues` VARCHAR(191) NOT NULL,
    MODIFY `stock` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `review` ADD COLUMN `approved` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `communicationPreferences` TEXT NULL,
    ADD COLUMN `sessionsInvalidatedAt` DATETIME(3) NULL,
    MODIFY `role` ENUM('CUSTOMER', 'ADMIN', 'SUPERADMIN', 'MANAGER', 'EDITOR', 'SUPPORT', 'VIEWER') NOT NULL DEFAULT 'CUSTOMER';

-- CreateTable
CREATE TABLE `VariantOption` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `productId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VariantOptionValue` (
    `id` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `optionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AbandonedCart` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `guestEmail` VARCHAR(191) NULL,
    `guestName` VARCHAR(191) NULL,
    `cartSnapshot` TEXT NOT NULL,
    `totalValue` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('ABANDONED', 'RECOVERED', 'EXPIRED') NOT NULL DEFAULT 'ABANDONED',
    `abandonedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `recoveredAt` DATETIME(3) NULL,
    `recoveryToken` VARCHAR(191) NOT NULL,
    `discountCode` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AbandonedCart_recoveryToken_key`(`recoveryToken`),
    INDEX `AbandonedCart_userId_idx`(`userId`),
    INDEX `AbandonedCart_guestEmail_idx`(`guestEmail`),
    INDEX `AbandonedCart_status_idx`(`status`),
    INDEX `AbandonedCart_abandonedAt_idx`(`abandonedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AbandonedCartEmail` (
    `id` VARCHAR(191) NOT NULL,
    `abandonedCartId` VARCHAR(191) NOT NULL,
    `emailType` VARCHAR(191) NOT NULL,
    `sentAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `opened` BOOLEAN NOT NULL DEFAULT false,
    `clicked` BOOLEAN NOT NULL DEFAULT false,

    INDEX `AbandonedCartEmail_abandonedCartId_idx`(`abandonedCartId`),
    INDEX `AbandonedCartEmail_emailType_idx`(`emailType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockAlert` (
    `id` VARCHAR(191) NOT NULL,
    `threshold` INTEGER NOT NULL DEFAULT 10,
    `notified` BOOLEAN NOT NULL DEFAULT false,
    `productId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StockAlert_productId_key`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockHistory` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NULL,
    `variantId` VARCHAR(191) NULL,
    `changeType` ENUM('SALE', 'REFUND', 'RESTOCK', 'ADJUSTMENT', 'DAMAGE', 'RETURN', 'TRANSFER') NOT NULL,
    `quantityBefore` INTEGER NOT NULL,
    `quantityAfter` INTEGER NOT NULL,
    `quantityChange` INTEGER NOT NULL,
    `reason` TEXT NULL,
    `notes` TEXT NULL,
    `orderId` VARCHAR(191) NULL,
    `supplierId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `StockHistory_productId_idx`(`productId`),
    INDEX `StockHistory_variantId_idx`(`variantId`),
    INDEX `StockHistory_changeType_idx`(`changeType`),
    INDEX `StockHistory_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `contactName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `address` TEXT NULL,
    `website` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Supplier_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseOrder` (
    `id` VARCHAR(191) NOT NULL,
    `orderNumber` VARCHAR(191) NOT NULL,
    `supplierId` VARCHAR(191) NOT NULL,
    `status` ENUM('DRAFT', 'PENDING', 'CONFIRMED', 'SHIPPED', 'RECEIVED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `orderDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expectedDate` DATETIME(3) NULL,
    `receivedDate` DATETIME(3) NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `tax` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `shipping` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `total` DECIMAL(10, 2) NOT NULL,
    `notes` TEXT NULL,
    `createdById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PurchaseOrder_orderNumber_key`(`orderNumber`),
    INDEX `PurchaseOrder_supplierId_idx`(`supplierId`),
    INDEX `PurchaseOrder_status_idx`(`status`),
    INDEX `PurchaseOrder_orderDate_idx`(`orderDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseOrderItem` (
    `id` VARCHAR(191) NOT NULL,
    `purchaseOrderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `variantId` VARCHAR(191) NULL,
    `quantity` INTEGER NOT NULL,
    `unitCost` DECIMAL(10, 2) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `receivedQuantity` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PurchaseOrderItem_purchaseOrderId_idx`(`purchaseOrderId`),
    INDEX `PurchaseOrderItem_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordReset` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PasswordReset_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiscountCode` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `type` ENUM('PERCENTAGE', 'FIXED_AMOUNT') NOT NULL,
    `value` DECIMAL(10, 2) NOT NULL,
    `minOrderAmount` DECIMAL(10, 2) NULL,
    `maxUses` INTEGER NULL,
    `usedCount` INTEGER NOT NULL DEFAULT 0,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DiscountCode_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsletterSubscriber` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `subscribedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `unsubscribedAt` DATETIME(3) NULL,
    `source` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `NewsletterSubscriber_email_key`(`email`),
    UNIQUE INDEX `NewsletterSubscriber_userId_key`(`userId`),
    INDEX `NewsletterSubscriber_email_idx`(`email`),
    INDEX `NewsletterSubscriber_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WishlistItem` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `WishlistItem_userId_idx`(`userId`),
    UNIQUE INDEX `WishlistItem_userId_productId_key`(`userId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StoreSetting` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `StoreSetting_key_key`(`key`),
    INDEX `StoreSetting_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeatureFlag` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT false,
    `category` VARCHAR(191) NOT NULL,
    `tier` ENUM('FREE', 'PRO', 'ENTERPRISE') NOT NULL DEFAULT 'PRO',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FeatureFlag_name_key`(`name`),
    INDEX `FeatureFlag_category_idx`(`category`),
    INDEX `FeatureFlag_enabled_idx`(`enabled`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Region` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Region_name_key`(`name`),
    INDEX `Region_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `City` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `regionId` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `City_regionId_idx`(`regionId`),
    INDEX `City_isActive_idx`(`isActive`),
    UNIQUE INDEX `City_name_regionId_key`(`name`, `regionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `checkout_settings` (
    `id` VARCHAR(191) NOT NULL,
    `showPhone` BOOLEAN NOT NULL DEFAULT true,
    `showCompany` BOOLEAN NOT NULL DEFAULT false,
    `showAddressLine2` BOOLEAN NOT NULL DEFAULT true,
    `requirePhone` BOOLEAN NOT NULL DEFAULT false,
    `thankYouMessage` TEXT NULL,
    `checkoutBanner` TEXT NULL,
    `checkoutBannerType` VARCHAR(191) NULL,
    `enableGuestCheckout` BOOLEAN NOT NULL DEFAULT true,
    `enableOrderNotes` BOOLEAN NOT NULL DEFAULT true,
    `orderNotesLabel` VARCHAR(191) NULL,
    `freeShippingThreshold` DECIMAL(10, 2) NULL,
    `defaultShippingCost` DECIMAL(10, 2) NOT NULL DEFAULT 10,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Refund` (
    `id` VARCHAR(191) NOT NULL,
    `rmaNumber` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `reason` ENUM('DEFECTIVE', 'WRONG_ITEM', 'NOT_AS_DESCRIBED', 'CHANGED_MIND', 'ARRIVED_LATE', 'OTHER') NOT NULL,
    `reasonDetails` TEXT NULL,
    `refundAmount` DECIMAL(10, 2) NOT NULL,
    `restockItems` BOOLEAN NOT NULL DEFAULT true,
    `adminNotes` TEXT NULL,
    `customerNotes` TEXT NULL,
    `processedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `requestedById` VARCHAR(191) NOT NULL,
    `processedById` VARCHAR(191) NULL,

    UNIQUE INDEX `Refund_rmaNumber_key`(`rmaNumber`),
    INDEX `Refund_status_idx`(`status`),
    INDEX `Refund_orderId_idx`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefundItem` (
    `id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `refundId` VARCHAR(191) NOT NULL,
    `orderItemId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `variantId` VARCHAR(191) NULL,

    INDEX `RefundItem_refundId_idx`(`refundId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` VARCHAR(191) NOT NULL,
    `resource` ENUM('PRODUCT', 'ORDER', 'CUSTOMER', 'CATEGORY', 'REVIEW', 'DISCOUNT', 'SETTINGS', 'ANALYTICS', 'FEATURES', 'ADMIN_USER', 'STOCK_ALERT', 'NEWSLETTER', 'REFUND') NOT NULL,
    `action` ENUM('VIEW', 'CREATE', 'UPDATE', 'DELETE', 'MANAGE') NOT NULL,
    `role` ENUM('CUSTOMER', 'ADMIN', 'SUPERADMIN', 'MANAGER', 'EDITOR', 'SUPPORT', 'VIEWER') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Permission_role_idx`(`role`),
    UNIQUE INDEX `Permission_resource_action_role_key`(`resource`, `action`, `role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminInvitation` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` ENUM('CUSTOMER', 'ADMIN', 'SUPERADMIN', 'MANAGER', 'EDITOR', 'SUPPORT', 'VIEWER') NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `acceptedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `invitedBy` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AdminInvitation_token_key`(`token`),
    INDEX `AdminInvitation_email_idx`(`email`),
    INDEX `AdminInvitation_token_idx`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminActivityLog` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `resource` VARCHAR(191) NOT NULL,
    `resourceId` VARCHAR(191) NULL,
    `details` TEXT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AdminActivityLog_userId_idx`(`userId`),
    INDEX `AdminActivityLog_createdAt_idx`(`createdAt`),
    INDEX `AdminActivityLog_resource_idx`(`resource`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProductTranslation_locale_idx`(`locale`),
    INDEX `ProductTranslation_slug_idx`(`slug`),
    UNIQUE INDEX `ProductTranslation_productId_locale_key`(`productId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoryTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CategoryTranslation_locale_idx`(`locale`),
    INDEX `CategoryTranslation_slug_idx`(`slug`),
    UNIQUE INDEX `CategoryTranslation_categoryId_locale_key`(`categoryId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Template` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('INVOICE', 'PACKING_SLIP', 'EMAIL_TRANSACTIONAL', 'EMAIL_MARKETING') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `content` TEXT NOT NULL,
    `variables` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Template_type_idx`(`type`),
    INDEX `Template_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlogPost` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `excerpt` TEXT NULL,
    `featuredImage` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt` DATETIME(3) NULL,
    `seoTitle` VARCHAR(191) NULL,
    `seoDescription` TEXT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BlogPost_slug_key`(`slug`),
    INDEX `BlogPost_status_idx`(`status`),
    INDEX `BlogPost_slug_idx`(`slug`),
    INDEX `BlogPost_authorId_idx`(`authorId`),
    INDEX `BlogPost_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlogCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BlogCategory_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlogTag` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BlogTag_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Page` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `useStorefrontLayout` BOOLEAN NOT NULL DEFAULT true,
    `seoTitle` VARCHAR(191) NULL,
    `seoDescription` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Page_slug_key`(`slug`),
    INDEX `Page_slug_idx`(`slug`),
    INDEX `Page_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MediaLibrary` (
    `id` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `type` ENUM('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER') NOT NULL,
    `cloudinaryId` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `secureUrl` TEXT NOT NULL,
    `publicId` VARCHAR(191) NOT NULL,
    `version` INTEGER NULL,
    `format` VARCHAR(191) NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `aspectRatio` DOUBLE NULL,
    `altText` TEXT NULL,
    `title` VARCHAR(191) NULL,
    `caption` TEXT NULL,
    `description` TEXT NULL,
    `folderId` VARCHAR(191) NULL,
    `uploadedById` VARCHAR(191) NOT NULL,
    `usageCount` INTEGER NOT NULL DEFAULT 0,
    `lastUsedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MediaLibrary_cloudinaryId_key`(`cloudinaryId`),
    INDEX `MediaLibrary_type_idx`(`type`),
    INDEX `MediaLibrary_folderId_idx`(`folderId`),
    INDEX `MediaLibrary_uploadedById_idx`(`uploadedById`),
    INDEX `MediaLibrary_createdAt_idx`(`createdAt`),
    INDEX `MediaLibrary_cloudinaryId_idx`(`cloudinaryId`),
    FULLTEXT INDEX `MediaLibrary_filename_altText_title_caption_idx`(`filename`, `altText`, `title`, `caption`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MediaFolder` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `parentId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `MediaFolder_parentId_idx`(`parentId`),
    UNIQUE INDEX `MediaFolder_parentId_slug_key`(`parentId`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MediaTag` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MediaTag_name_key`(`name`),
    UNIQUE INDEX `MediaTag_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MediaUsage` (
    `id` VARCHAR(191) NOT NULL,
    `mediaId` VARCHAR(191) NOT NULL,
    `usageType` ENUM('PRODUCT_IMAGE', 'PRODUCT_VARIANT', 'CATEGORY_IMAGE', 'BLOG_FEATURED_IMAGE', 'BLOG_CONTENT', 'PAGE_CONTENT', 'USER_AVATAR', 'STORE_SETTING', 'OTHER') NOT NULL,
    `resourceType` VARCHAR(191) NOT NULL,
    `resourceId` VARCHAR(191) NOT NULL,
    `fieldName` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MediaUsage_mediaId_idx`(`mediaId`),
    INDEX `MediaUsage_resourceType_resourceId_idx`(`resourceType`, `resourceId`),
    UNIQUE INDEX `MediaUsage_mediaId_usageType_resourceType_resourceId_fieldNa_key`(`mediaId`, `usageType`, `resourceType`, `resourceId`, `fieldName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MediaVariant` (
    `id` VARCHAR(191) NOT NULL,
    `mediaId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `width` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `url` TEXT NOT NULL,
    `cloudinaryId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MediaVariant_mediaId_idx`(`mediaId`),
    UNIQUE INDEX `MediaVariant_mediaId_name_key`(`mediaId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Popup` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `content` TEXT NOT NULL,
    `type` ENUM('EXIT_INTENT', 'TIMED', 'SCROLL_BASED', 'PAGE_LOAD', 'CLICK_TRIGGER') NOT NULL DEFAULT 'EXIT_INTENT',
    `triggerValue` INTEGER NULL,
    `target` ENUM('ALL_PAGES', 'HOMEPAGE', 'PRODUCT_PAGES', 'CART_PAGE', 'CHECKOUT', 'BLOG', 'CUSTOM_URL') NOT NULL DEFAULT 'ALL_PAGES',
    `customUrls` TEXT NULL,
    `position` ENUM('CENTER', 'TOP', 'BOTTOM', 'TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT') NOT NULL DEFAULT 'CENTER',
    `width` INTEGER NOT NULL DEFAULT 500,
    `height` INTEGER NULL,
    `backgroundColor` VARCHAR(191) NOT NULL DEFAULT '#ffffff',
    `textColor` VARCHAR(191) NOT NULL DEFAULT '#000000',
    `buttonText` VARCHAR(191) NOT NULL DEFAULT 'Get Offer',
    `buttonColor` VARCHAR(191) NOT NULL DEFAULT '#000000',
    `buttonTextColor` VARCHAR(191) NOT NULL DEFAULT '#ffffff',
    `showCloseButton` BOOLEAN NOT NULL DEFAULT true,
    `overlayColor` VARCHAR(191) NOT NULL DEFAULT 'rgba(0,0,0,0.5)',
    `imageUrl` VARCHAR(191) NULL,
    `frequency` VARCHAR(191) NOT NULL DEFAULT 'once_per_session',
    `delaySeconds` INTEGER NOT NULL DEFAULT 0,
    `ctaType` VARCHAR(191) NOT NULL DEFAULT 'link',
    `ctaUrl` VARCHAR(191) NULL,
    `discountCode` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Popup_isActive_idx`(`isActive`),
    INDEX `Popup_type_idx`(`type`),
    INDEX `Popup_target_idx`(`target`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PopupAnalytics` (
    `id` VARCHAR(191) NOT NULL,
    `popupId` VARCHAR(191) NOT NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `clicks` INTEGER NOT NULL DEFAULT 0,
    `dismissals` INTEGER NOT NULL DEFAULT 0,
    `conversions` INTEGER NOT NULL DEFAULT 0,
    `date` DATE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PopupAnalytics_popupId_idx`(`popupId`),
    INDEX `PopupAnalytics_date_idx`(`date`),
    UNIQUE INDEX `PopupAnalytics_popupId_date_key`(`popupId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentMethod` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerToken` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `cardLast4` VARCHAR(191) NULL,
    `cardBrand` VARCHAR(191) NULL,
    `cardExpMonth` INTEGER NULL,
    `cardExpYear` INTEGER NULL,
    `email` VARCHAR(191) NULL,
    `bankName` VARCHAR(191) NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PaymentMethod_userId_idx`(`userId`),
    INDEX `PaymentMethod_isDefault_idx`(`isDefault`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccountDeletionRequest` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `reason` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `requestedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `scheduledAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `adminNotes` TEXT NULL,
    `reviewedById` VARCHAR(191) NULL,
    `reviewedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AccountDeletionRequest_userId_key`(`userId`),
    INDEX `AccountDeletionRequest_status_idx`(`status`),
    INDEX `AccountDeletionRequest_scheduledAt_idx`(`scheduledAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `Backup` (
    `id` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `type` ENUM('MANUAL', 'SCHEDULED', 'AUTO') NOT NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `includeProducts` BOOLEAN NOT NULL DEFAULT true,
    `includeOrders` BOOLEAN NOT NULL DEFAULT true,
    `includeCustomers` BOOLEAN NOT NULL DEFAULT true,
    `includeMedia` BOOLEAN NOT NULL DEFAULT false,
    `includeSettings` BOOLEAN NOT NULL DEFAULT true,
    `fileUrl` VARCHAR(191) NULL,
    `localPath` VARCHAR(191) NULL,
    `recordCount` INTEGER NULL,
    `errorMessage` TEXT NULL,
    `createdById` VARCHAR(191) NULL,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Backup_status_idx`(`status`),
    INDEX `Backup_type_idx`(`type`),
    INDEX `Backup_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataExport` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('PRODUCTS', 'ORDERS', 'CUSTOMERS', 'CATEGORIES', 'INVENTORY', 'CUSTOM') NOT NULL,
    `format` ENUM('CSV', 'JSON', 'XLSX') NOT NULL DEFAULT 'CSV',
    `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `filters` TEXT NULL,
    `filename` VARCHAR(191) NULL,
    `fileUrl` VARCHAR(191) NULL,
    `fileSize` INTEGER NULL,
    `recordCount` INTEGER NULL,
    `errorMessage` TEXT NULL,
    `createdById` VARCHAR(191) NULL,
    `completedAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DataExport_status_idx`(`status`),
    INDEX `DataExport_type_idx`(`type`),
    INDEX `DataExport_createdAt_idx`(`createdAt`),
    INDEX `DataExport_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataImport` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('PRODUCTS', 'ORDERS', 'CUSTOMERS', 'CATEGORIES', 'INVENTORY', 'CUSTOM') NOT NULL,
    `format` ENUM('CSV', 'JSON', 'XLSX') NOT NULL DEFAULT 'CSV',
    `mode` ENUM('CREATE', 'UPDATE', 'UPSERT') NOT NULL DEFAULT 'CREATE',
    `status` ENUM('PENDING', 'VALIDATING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'PARTIAL') NOT NULL DEFAULT 'PENDING',
    `filename` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `totalRows` INTEGER NULL,
    `successCount` INTEGER NULL,
    `failedCount` INTEGER NULL,
    `skippedCount` INTEGER NULL,
    `errors` TEXT NULL,
    `isPreview` BOOLEAN NOT NULL DEFAULT false,
    `createdById` VARCHAR(191) NULL,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DataImport_status_idx`(`status`),
    INDEX `DataImport_type_idx`(`type`),
    INDEX `DataImport_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BlogPostToBlogTag` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_BlogPostToBlogTag_AB_unique`(`A`, `B`),
    INDEX `_BlogPostToBlogTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MediaLibraryToMediaTag` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_MediaLibraryToMediaTag_AB_unique`(`A`, `B`),
    INDEX `_MediaLibraryToMediaTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `CartItem_cartId_productId_variantId_key` ON `CartItem`(`cartId`, `productId`, `variantId`);

-- AddForeignKey (skipped - constraint already exists from previous migration)
-- ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VariantOption` ADD CONSTRAINT `VariantOption_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VariantOptionValue` ADD CONSTRAINT `VariantOptionValue_optionId_fkey` FOREIGN KEY (`optionId`) REFERENCES `VariantOption`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `ProductVariant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AbandonedCart` ADD CONSTRAINT `AbandonedCart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AbandonedCartEmail` ADD CONSTRAINT `AbandonedCartEmail_abandonedCartId_fkey` FOREIGN KEY (`abandonedCartId`) REFERENCES `AbandonedCart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_discountCodeId_fkey` FOREIGN KEY (`discountCodeId`) REFERENCES `DiscountCode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `ProductVariant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockAlert` ADD CONSTRAINT `StockAlert_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockHistory` ADD CONSTRAINT `StockHistory_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockHistory` ADD CONSTRAINT `StockHistory_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockHistory` ADD CONSTRAINT `StockHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrder` ADD CONSTRAINT `PurchaseOrder_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrder` ADD CONSTRAINT `PurchaseOrder_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrderItem` ADD CONSTRAINT `PurchaseOrderItem_purchaseOrderId_fkey` FOREIGN KEY (`purchaseOrderId`) REFERENCES `PurchaseOrder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordReset` ADD CONSTRAINT `PasswordReset_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsletterSubscriber` ADD CONSTRAINT `NewsletterSubscriber_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WishlistItem` ADD CONSTRAINT `WishlistItem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WishlistItem` ADD CONSTRAINT `WishlistItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `City` ADD CONSTRAINT `City_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `Region`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Refund` ADD CONSTRAINT `Refund_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Refund` ADD CONSTRAINT `Refund_requestedById_fkey` FOREIGN KEY (`requestedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Refund` ADD CONSTRAINT `Refund_processedById_fkey` FOREIGN KEY (`processedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefundItem` ADD CONSTRAINT `RefundItem_refundId_fkey` FOREIGN KEY (`refundId`) REFERENCES `Refund`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminActivityLog` ADD CONSTRAINT `AdminActivityLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductTranslation` ADD CONSTRAINT `ProductTranslation_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryTranslation` ADD CONSTRAINT `CategoryTranslation_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlogPost` ADD CONSTRAINT `BlogPost_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlogPost` ADD CONSTRAINT `BlogPost_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `BlogCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MediaLibrary` ADD CONSTRAINT `MediaLibrary_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `MediaFolder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MediaLibrary` ADD CONSTRAINT `MediaLibrary_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MediaFolder` ADD CONSTRAINT `MediaFolder_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `MediaFolder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MediaUsage` ADD CONSTRAINT `MediaUsage_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `MediaLibrary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MediaVariant` ADD CONSTRAINT `MediaVariant_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `MediaLibrary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PopupAnalytics` ADD CONSTRAINT `PopupAnalytics_popupId_fkey` FOREIGN KEY (`popupId`) REFERENCES `Popup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentMethod` ADD CONSTRAINT `PaymentMethod_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountDeletionRequest` ADD CONSTRAINT `AccountDeletionRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductCustomizationField` ADD CONSTRAINT `ProductCustomizationField_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductCustomizationOption` ADD CONSTRAINT `ProductCustomizationOption_fieldId_fkey` FOREIGN KEY (`fieldId`) REFERENCES `ProductCustomizationField`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItemCustomization` ADD CONSTRAINT `CartItemCustomization_cartItemId_fkey` FOREIGN KEY (`cartItemId`) REFERENCES `CartItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItemCustomization` ADD CONSTRAINT `CartItemCustomization_fieldId_fkey` FOREIGN KEY (`fieldId`) REFERENCES `ProductCustomizationField`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItemCustomization` ADD CONSTRAINT `OrderItemCustomization_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `OrderItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItemCustomization` ADD CONSTRAINT `OrderItemCustomization_fieldId_fkey` FOREIGN KEY (`fieldId`) REFERENCES `ProductCustomizationField`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Backup` ADD CONSTRAINT `Backup_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataExport` ADD CONSTRAINT `DataExport_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataImport` ADD CONSTRAINT `DataImport_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BlogPostToBlogTag` ADD CONSTRAINT `_BlogPostToBlogTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `BlogPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BlogPostToBlogTag` ADD CONSTRAINT `_BlogPostToBlogTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `BlogTag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MediaLibraryToMediaTag` ADD CONSTRAINT `_MediaLibraryToMediaTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `MediaLibrary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MediaLibraryToMediaTag` ADD CONSTRAINT `_MediaLibraryToMediaTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `MediaTag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
