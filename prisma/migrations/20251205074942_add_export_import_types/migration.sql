/*
  Warnings:

  - You are about to drop the `flashsalestatus` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[posOrderId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `blogpost` ADD COLUMN `useBlockEditor` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `checkout_settings` ADD COLUMN `buttonStyle` VARCHAR(191) NULL DEFAULT 'rounded',
    ADD COLUMN `checkoutLayout` VARCHAR(191) NULL DEFAULT 'single',
    ADD COLUMN `countdownEndDate` DATETIME(3) NULL,
    ADD COLUMN `countdownText` VARCHAR(191) NULL,
    ADD COLUMN `customFields` JSON NULL,
    ADD COLUMN `customerServiceDisplay` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `customerServiceEmail` VARCHAR(191) NULL,
    ADD COLUMN `customerServicePhone` VARCHAR(191) NULL,
    ADD COLUMN `customerServiceText` TEXT NULL,
    ADD COLUMN `deliveryInstructionsLabel` VARCHAR(191) NULL,
    ADD COLUMN `discountFieldPosition` VARCHAR(191) NULL DEFAULT 'top',
    ADD COLUMN `fieldLabels` JSON NULL,
    ADD COLUMN `fieldOrder` JSON NULL,
    ADD COLUMN `fieldPlaceholders` JSON NULL,
    ADD COLUMN `fontFamily` VARCHAR(191) NULL DEFAULT 'system',
    ADD COLUMN `freeShippingBarText` VARCHAR(191) NULL,
    ADD COLUMN `giftDescription` TEXT NULL,
    ADD COLUMN `giftMessageLabel` VARCHAR(191) NULL,
    ADD COLUMN `giftThreshold` DECIMAL(10, 2) NULL,
    ADD COLUMN `logoUrl` VARCHAR(191) NULL,
    ADD COLUMN `lowStockText` VARCHAR(191) NULL,
    ADD COLUMN `lowStockThreshold` INTEGER NULL DEFAULT 5,
    ADD COLUMN `loyaltyPointsText` VARCHAR(191) NULL,
    ADD COLUMN `moneyBackGuarantee` TEXT NULL,
    ADD COLUMN `orderCountText` VARCHAR(191) NULL,
    ADD COLUMN `orderSummaryPosition` VARCHAR(191) NULL DEFAULT 'right',
    ADD COLUMN `pageWidth` VARCHAR(191) NULL DEFAULT 'normal',
    ADD COLUMN `primaryColor` VARCHAR(191) NULL DEFAULT '#000000',
    ADD COLUMN `progressStyle` VARCHAR(191) NULL DEFAULT 'steps',
    ADD COLUMN `promotionalBanners` JSON NULL,
    ADD COLUMN `recentPurchaseDelay` INTEGER NULL DEFAULT 5000,
    ADD COLUMN `referralDiscountEnabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `referralDiscountText` VARCHAR(191) NULL,
    ADD COLUMN `scarcityMessage` TEXT NULL,
    ADD COLUMN `secondaryColor` VARCHAR(191) NULL DEFAULT '#666666',
    ADD COLUMN `showAlternativePhone` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `showCountdownTimer` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `showDeliveryDate` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `showDeliveryInstructions` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `showFreeShippingBar` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `showGiftMessage` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `showGiftWithPurchase` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `showLowStock` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `showLoyaltyPoints` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `showOrderCount` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `showRecentPurchases` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `showSecuritySeals` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `showTestimonials` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `showTrustRating` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `showUpsells` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `testimonials` JSON NULL,
    ADD COLUMN `trustBadges` JSON NULL,
    ADD COLUMN `trustRatingCount` INTEGER NULL,
    ADD COLUMN `trustRatingScore` DECIMAL(2, 1) NULL,
    ADD COLUMN `upsellPosition` VARCHAR(191) NULL DEFAULT 'cart',
    ADD COLUMN `upsellProducts` JSON NULL,
    ADD COLUMN `upsellTitle` VARCHAR(191) NULL,
    ADD COLUMN `urgencyBadgeStyle` VARCHAR(191) NULL DEFAULT 'warning';

-- AlterTable
ALTER TABLE `dataexport` MODIFY `type` ENUM('PRODUCTS', 'PRODUCT_IMAGES', 'PRODUCT_VARIANTS', 'ORDERS', 'CUSTOMERS', 'CATEGORIES', 'INVENTORY', 'BLOG_POSTS', 'PAGES', 'MEDIA_LIBRARY', 'REVIEWS', 'NEWSLETTER_SUBSCRIBERS', 'DISCOUNT_CODES', 'CUSTOM') NOT NULL;

-- AlterTable
ALTER TABLE `dataimport` MODIFY `type` ENUM('PRODUCTS', 'PRODUCT_IMAGES', 'PRODUCT_VARIANTS', 'ORDERS', 'CUSTOMERS', 'CATEGORIES', 'INVENTORY', 'BLOG_POSTS', 'PAGES', 'MEDIA_LIBRARY', 'REVIEWS', 'NEWSLETTER_SUBSCRIBERS', 'DISCOUNT_CODES', 'CUSTOM') NOT NULL;

-- AlterTable
ALTER TABLE `newslettersubscriber` ADD COLUMN `pageId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `isPosOrder` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `posOrderId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `page` ADD COLUMN `authorId` VARCHAR(191) NULL,
    ADD COLUMN `conversionGoal` VARCHAR(191) NULL,
    ADD COLUMN `customCss` TEXT NULL,
    ADD COLUMN `customJs` TEXT NULL,
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `layoutConfig` JSON NULL,
    ADD COLUMN `ogDescription` VARCHAR(191) NULL,
    ADD COLUMN `ogImage` VARCHAR(191) NULL,
    ADD COLUMN `ogTitle` VARCHAR(191) NULL,
    ADD COLUMN `overriddenPageType` VARCHAR(191) NULL,
    ADD COLUMN `overridesStorefrontPage` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `publishedAt` DATETIME(3) NULL,
    ADD COLUMN `scheduledPublishAt` DATETIME(3) NULL,
    ADD COLUMN `seoKeywords` VARCHAR(191) NULL,
    ADD COLUMN `templateId` VARCHAR(191) NULL,
    ADD COLUMN `useBlockEditor` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `viewCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `status` ENUM('DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT';

-- DropTable
DROP TABLE `flashsalestatus`;

-- CreateTable
CREATE TABLE `Location` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` TEXT NULL,
    `phone` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `settings` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Location_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cashier` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `locationId` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NULL,
    `pin` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Cashier_userId_key`(`userId`),
    UNIQUE INDEX `Cashier_employeeId_key`(`employeeId`),
    INDEX `Cashier_locationId_idx`(`locationId`),
    INDEX `Cashier_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `PosSession` (
    `id` VARCHAR(191) NOT NULL,
    `cashierId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `locationId` VARCHAR(191) NOT NULL,
    `openedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `closedAt` DATETIME(3) NULL,
    `openingCash` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `closingCash` DECIMAL(10, 2) NULL,
    `expectedCash` DECIMAL(10, 2) NULL,
    `difference` DECIMAL(10, 2) NULL,
    `status` ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PosSession_cashierId_idx`(`cashierId`),
    INDEX `PosSession_locationId_idx`(`locationId`),
    INDEX `PosSession_status_idx`(`status`),
    INDEX `PosSession_openedAt_idx`(`openedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UrlRedirect` (
    `id` VARCHAR(191) NOT NULL,
    `fromPath` VARCHAR(191) NOT NULL,
    `toPath` VARCHAR(191) NOT NULL,
    `type` ENUM('PERMANENT_301', 'TEMPORARY_302') NOT NULL DEFAULT 'PERMANENT_301',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `hitCount` INTEGER NOT NULL DEFAULT 0,
    `lastHitAt` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `createdById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UrlRedirect_fromPath_key`(`fromPath`),
    INDEX `UrlRedirect_fromPath_idx`(`fromPath`),
    INDEX `UrlRedirect_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SchemaMarkup` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('ORGANIZATION', 'PRODUCT', 'BREADCRUMB', 'FAQ', 'ARTICLE', 'REVIEW', 'LOCAL_BUSINESS', 'EVENT', 'RECIPE', 'VIDEO') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `schemaData` TEXT NOT NULL,
    `applyToAll` BOOLEAN NOT NULL DEFAULT false,
    `targetPages` TEXT NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SchemaMarkup_type_idx`(`type`),
    INDEX `SchemaMarkup_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmailCampaign` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `preheader` VARCHAR(191) NULL,
    `type` ENUM('NEWSLETTER', 'PROMOTIONAL', 'TRANSACTIONAL', 'ANNOUNCEMENT', 'CUSTOM') NOT NULL DEFAULT 'NEWSLETTER',
    `status` ENUM('DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'PAUSED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `htmlContent` TEXT NOT NULL,
    `textContent` TEXT NULL,
    `templateId` VARCHAR(191) NULL,
    `scheduledAt` DATETIME(3) NULL,
    `sentAt` DATETIME(3) NULL,
    `sendToAll` BOOLEAN NOT NULL DEFAULT false,
    `recipientCount` INTEGER NOT NULL DEFAULT 0,
    `fromName` VARCHAR(191) NULL,
    `fromEmail` VARCHAR(191) NULL,
    `replyTo` VARCHAR(191) NULL,
    `totalSent` INTEGER NOT NULL DEFAULT 0,
    `totalOpened` INTEGER NOT NULL DEFAULT 0,
    `totalClicked` INTEGER NOT NULL DEFAULT 0,
    `totalBounced` INTEGER NOT NULL DEFAULT 0,
    `totalUnsubscribed` INTEGER NOT NULL DEFAULT 0,
    `createdById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `EmailCampaign_status_idx`(`status`),
    INDEX `EmailCampaign_type_idx`(`type`),
    INDEX `EmailCampaign_scheduledAt_idx`(`scheduledAt`),
    INDEX `EmailCampaign_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CampaignRecipient` (
    `id` VARCHAR(191) NOT NULL,
    `campaignId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `sent` BOOLEAN NOT NULL DEFAULT false,
    `sentAt` DATETIME(3) NULL,
    `opened` BOOLEAN NOT NULL DEFAULT false,
    `openedAt` DATETIME(3) NULL,
    `clicked` BOOLEAN NOT NULL DEFAULT false,
    `clickedAt` DATETIME(3) NULL,
    `bounced` BOOLEAN NOT NULL DEFAULT false,
    `unsubscribed` BOOLEAN NOT NULL DEFAULT false,
    `trackingToken` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CampaignRecipient_trackingToken_key`(`trackingToken`),
    INDEX `CampaignRecipient_campaignId_idx`(`campaignId`),
    INDEX `CampaignRecipient_email_idx`(`email`),
    INDEX `CampaignRecipient_trackingToken_idx`(`trackingToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CampaignAnalytics` (
    `id` VARCHAR(191) NOT NULL,
    `campaignId` VARCHAR(191) NOT NULL,
    `eventType` VARCHAR(191) NOT NULL,
    `recipientEmail` VARCHAR(191) NOT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` TEXT NULL,
    `clickedUrl` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CampaignAnalytics_campaignId_idx`(`campaignId`),
    INDEX `CampaignAnalytics_eventType_idx`(`eventType`),
    INDEX `CampaignAnalytics_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmailTemplate` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `category` VARCHAR(191) NULL,
    `subject` VARCHAR(191) NOT NULL,
    `preheader` VARCHAR(191) NULL,
    `htmlContent` TEXT NOT NULL,
    `textContent` TEXT NULL,
    `thumbnailUrl` VARCHAR(191) NULL,
    `isPublic` BOOLEAN NOT NULL DEFAULT false,
    `usageCount` INTEGER NOT NULL DEFAULT 0,
    `createdById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `EmailTemplate_category_idx`(`category`),
    INDEX `EmailTemplate_isPublic_idx`(`isPublic`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContentBlock` (
    `id` VARCHAR(191) NOT NULL,
    `templateId` VARCHAR(191) NOT NULL,
    `pageId` VARCHAR(191) NULL,
    `postId` VARCHAR(191) NULL,
    `config` JSON NOT NULL,
    `customCss` TEXT NULL,
    `customClasses` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isVisible` BOOLEAN NOT NULL DEFAULT true,
    `visibilityRules` JSON NULL,
    `hideOnMobile` BOOLEAN NOT NULL DEFAULT false,
    `hideOnTablet` BOOLEAN NOT NULL DEFAULT false,
    `hideOnDesktop` BOOLEAN NOT NULL DEFAULT false,
    `animationType` VARCHAR(191) NULL,
    `animationDelay` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ContentBlock_pageId_order_idx`(`pageId`, `order`),
    INDEX `ContentBlock_postId_order_idx`(`postId`, `order`),
    INDEX `ContentBlock_templateId_idx`(`templateId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PageRevision` (
    `id` VARCHAR(191) NOT NULL,
    `pageId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `content` TEXT NULL,
    `seoTitle` VARCHAR(191) NULL,
    `seoDescription` TEXT NULL,
    `seoKeywords` VARCHAR(191) NULL,
    `ogImage` VARCHAR(191) NULL,
    `ogTitle` VARCHAR(191) NULL,
    `ogDescription` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED') NOT NULL,
    `layoutConfig` JSON NULL,
    `customCss` TEXT NULL,
    `customJs` TEXT NULL,
    `useBlockEditor` BOOLEAN NOT NULL,
    `useStorefrontLayout` BOOLEAN NOT NULL,
    `blocksSnapshot` JSON NULL,
    `overridesStorefrontPage` BOOLEAN NOT NULL,
    `overriddenPageType` VARCHAR(191) NULL,
    `revisionNumber` INTEGER NOT NULL,
    `note` TEXT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PageRevision_pageId_idx`(`pageId`),
    INDEX `PageRevision_createdAt_idx`(`createdAt`),
    INDEX `PageRevision_revisionNumber_idx`(`revisionNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `invoiceType` ENUM('STANDARD', 'PROFORMA', 'CREDIT_NOTE', 'QUOTE', 'RECURRING', 'RECEIPT') NOT NULL DEFAULT 'STANDARD',
    `status` ENUM('DRAFT', 'SENT', 'VIEWED', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'DRAFT',
    `invoiceDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dueDate` DATETIME(3) NULL,
    `sentAt` DATETIME(3) NULL,
    `viewedAt` DATETIME(3) NULL,
    `paidAt` DATETIME(3) NULL,
    `customerId` VARCHAR(191) NULL,
    `customerEmail` VARCHAR(191) NULL,
    `customerName` VARCHAR(191) NULL,
    `customerCompany` VARCHAR(191) NULL,
    `billingAddress` JSON NULL,
    `shippingAddress` JSON NULL,
    `orderId` VARCHAR(191) NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `tax` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `taxRate` DECIMAL(5, 2) NULL,
    `shipping` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `discount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `discountType` VARCHAR(191) NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `amountPaid` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `balanceDue` DECIMAL(10, 2) NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `currencySymbol` VARCHAR(191) NOT NULL DEFAULT '$',
    `templateId` VARCHAR(191) NULL,
    `customFields` JSON NULL,
    `termsAndConditions` TEXT NULL,
    `notes` TEXT NULL,
    `footerText` TEXT NULL,
    `paymentMethod` VARCHAR(191) NULL,
    `paymentInstructions` TEXT NULL,
    `paymentLink` VARCHAR(191) NULL,
    `isRecurring` BOOLEAN NOT NULL DEFAULT false,
    `recurringId` VARCHAR(191) NULL,
    `qrCodeUrl` VARCHAR(191) NULL,
    `signatureUrl` VARCHAR(191) NULL,
    `signedAt` DATETIME(3) NULL,
    `signedBy` VARCHAR(191) NULL,
    `createdById` VARCHAR(191) NULL,
    `updatedById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Invoice_invoiceNumber_key`(`invoiceNumber`),
    INDEX `Invoice_invoiceNumber_idx`(`invoiceNumber`),
    INDEX `Invoice_status_idx`(`status`),
    INDEX `Invoice_invoiceType_idx`(`invoiceType`),
    INDEX `Invoice_customerId_idx`(`customerId`),
    INDEX `Invoice_orderId_idx`(`orderId`),
    INDEX `Invoice_invoiceDate_idx`(`invoiceDate`),
    INDEX `Invoice_dueDate_idx`(`dueDate`),
    INDEX `Invoice_createdAt_idx`(`createdAt`),
    INDEX `Invoice_recurringId_idx`(`recurringId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceItem` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NULL,
    `variantId` VARCHAR(191) NULL,
    `description` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NULL,
    `quantity` INTEGER NOT NULL,
    `unitPrice` DECIMAL(10, 2) NOT NULL,
    `taxRate` DECIMAL(5, 2) NULL,
    `discount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `total` DECIMAL(10, 2) NOT NULL,
    `customFields` JSON NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `InvoiceItem_invoiceId_idx`(`invoiceId`),
    INDEX `InvoiceItem_productId_idx`(`productId`),
    INDEX `InvoiceItem_position_idx`(`position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceSettings` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceNumberPrefix` VARCHAR(191) NOT NULL DEFAULT 'INV',
    `invoiceNumberFormat` VARCHAR(191) NOT NULL DEFAULT '{{prefix}}-{{number}}',
    `nextInvoiceNumber` INTEGER NOT NULL DEFAULT 1,
    `defaultTerms` TEXT NULL,
    `defaultNotes` TEXT NULL,
    `defaultDueDays` INTEGER NOT NULL DEFAULT 30,
    `logoUrl` VARCHAR(191) NULL,
    `companyName` VARCHAR(191) NULL,
    `companyAddress` TEXT NULL,
    `companyPhone` VARCHAR(191) NULL,
    `companyEmail` VARCHAR(191) NULL,
    `companyWebsite` VARCHAR(191) NULL,
    `companyTaxId` VARCHAR(191) NULL,
    `primaryColor` VARCHAR(191) NOT NULL DEFAULT '#000000',
    `secondaryColor` VARCHAR(191) NOT NULL DEFAULT '#666666',
    `accentColor` VARCHAR(191) NOT NULL DEFAULT '#3182ce',
    `fontFamily` VARCHAR(191) NOT NULL DEFAULT 'Helvetica',
    `fontSize` INTEGER NOT NULL DEFAULT 10,
    `defaultTemplateId` VARCHAR(191) NULL,
    `emailSubjectTemplate` VARCHAR(191) NULL DEFAULT 'Invoice {{invoiceNumber}} from {{companyName}}',
    `emailBodyTemplate` TEXT NULL,
    `autoSendOnCreate` BOOLEAN NOT NULL DEFAULT false,
    `sendCopyToAdmin` BOOLEAN NOT NULL DEFAULT false,
    `adminEmail` VARCHAR(191) NULL,
    `defaultTaxRate` DECIMAL(5, 2) NULL,
    `taxLabel` VARCHAR(191) NOT NULL DEFAULT 'Tax',
    `showTaxBreakdown` BOOLEAN NOT NULL DEFAULT true,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `currencySymbol` VARCHAR(191) NOT NULL DEFAULT '$',
    `paymentMethods` JSON NULL,
    `showPaymentLink` BOOLEAN NOT NULL DEFAULT true,
    `paymentGateway` VARCHAR(191) NULL,
    `showQRCode` BOOLEAN NOT NULL DEFAULT false,
    `enableSignatures` BOOLEAN NOT NULL DEFAULT false,
    `customFields` JSON NULL,
    `multiLanguage` BOOLEAN NOT NULL DEFAULT false,
    `defaultLanguage` VARCHAR(191) NOT NULL DEFAULT 'en',
    `headerText` TEXT NULL,
    `footerText` TEXT NULL,
    `showFooter` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `InvoiceSettings_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceTemplate` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `isSystem` BOOLEAN NOT NULL DEFAULT false,
    `config` JSON NOT NULL,
    `previewImage` VARCHAR(191) NULL,
    `usageCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `InvoiceTemplate_isDefault_idx`(`isDefault`),
    INDEX `InvoiceTemplate_isSystem_idx`(`isSystem`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoicePayment` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceId` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `paymentDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `paymentMethod` VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NULL,
    `referenceNumber` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'completed',
    `notes` TEXT NULL,
    `recordedById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `InvoicePayment_invoiceId_idx`(`invoiceId`),
    INDEX `InvoicePayment_paymentDate_idx`(`paymentDate`),
    INDEX `InvoicePayment_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceHistory` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `fieldName` VARCHAR(191) NULL,
    `oldValue` TEXT NULL,
    `newValue` TEXT NULL,
    `description` TEXT NULL,
    `changedById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `InvoiceHistory_invoiceId_idx`(`invoiceId`),
    INDEX `InvoiceHistory_createdAt_idx`(`createdAt`),
    INDEX `InvoiceHistory_action_idx`(`action`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecurringInvoice` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `customerId` VARCHAR(191) NULL,
    `customerEmail` VARCHAR(191) NULL,
    `frequency` ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM') NOT NULL DEFAULT 'MONTHLY',
    `interval` INTEGER NOT NULL DEFAULT 1,
    `customInterval` INTEGER NULL,
    `dayOfMonth` INTEGER NULL,
    `dayOfWeek` INTEGER NULL,
    `templateId` VARCHAR(191) NULL,
    `invoiceSettings` JSON NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `nextRunDate` DATETIME(3) NULL,
    `lastRunDate` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `autoSend` BOOLEAN NOT NULL DEFAULT true,
    `createdById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `RecurringInvoice_customerId_idx`(`customerId`),
    INDEX `RecurringInvoice_isActive_idx`(`isActive`),
    INDEX `RecurringInvoice_nextRunDate_idx`(`nextRunDate`),
    INDEX `RecurringInvoice_startDate_idx`(`startDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Theme` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `version` VARCHAR(191) NOT NULL DEFAULT '1.0.0',
    `author` VARCHAR(191) NULL,
    `previewImage` VARCHAR(191) NULL,
    `isBuiltIn` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `themeConfig` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Theme_name_key`(`name`),
    INDEX `Theme_isActive_idx`(`isActive`),
    INDEX `Theme_isBuiltIn_idx`(`isBuiltIn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `BlockTemplate_slug_idx` ON `BlockTemplate`(`slug`);

-- CreateIndex
CREATE INDEX `NewsletterSubscriber_pageId_idx` ON `NewsletterSubscriber`(`pageId`);

-- CreateIndex
CREATE UNIQUE INDEX `Order_posOrderId_key` ON `Order`(`posOrderId`);

-- CreateIndex
CREATE INDEX `Page_overriddenPageType_idx` ON `Page`(`overriddenPageType`);

-- CreateIndex
CREATE INDEX `Page_authorId_idx` ON `Page`(`authorId`);

-- CreateIndex
CREATE INDEX `Page_publishedAt_idx` ON `Page`(`publishedAt`);

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_posOrderId_fkey` FOREIGN KEY (`posOrderId`) REFERENCES `PosOrder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cashier` ADD CONSTRAINT `Cashier_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cashier` ADD CONSTRAINT `Cashier_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PosOrder` ADD CONSTRAINT `PosOrder_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PosOrder` ADD CONSTRAINT `PosOrder_cashierId_fkey` FOREIGN KEY (`cashierId`) REFERENCES `Cashier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PosOrder` ADD CONSTRAINT `PosOrder_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PosSession` ADD CONSTRAINT `PosSession_cashierId_fkey` FOREIGN KEY (`cashierId`) REFERENCES `Cashier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PosSession` ADD CONSTRAINT `PosSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PosSession` ADD CONSTRAINT `PosSession_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsletterSubscriber` ADD CONSTRAINT `NewsletterSubscriber_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `Page`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Page` ADD CONSTRAINT `Page_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CampaignRecipient` ADD CONSTRAINT `CampaignRecipient_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `EmailCampaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CampaignAnalytics` ADD CONSTRAINT `CampaignAnalytics_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `EmailCampaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContentBlock` ADD CONSTRAINT `ContentBlock_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `BlockTemplate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContentBlock` ADD CONSTRAINT `ContentBlock_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `Page`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContentBlock` ADD CONSTRAINT `ContentBlock_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `BlogPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PageRevision` ADD CONSTRAINT `PageRevision_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `Page`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PageRevision` ADD CONSTRAINT `PageRevision_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `InvoiceTemplate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_recurringId_fkey` FOREIGN KEY (`recurringId`) REFERENCES `RecurringInvoice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoicePayment` ADD CONSTRAINT `InvoicePayment_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoicePayment` ADD CONSTRAINT `InvoicePayment_recordedById_fkey` FOREIGN KEY (`recordedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceHistory` ADD CONSTRAINT `InvoiceHistory_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceHistory` ADD CONSTRAINT `InvoiceHistory_changedById_fkey` FOREIGN KEY (`changedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecurringInvoice` ADD CONSTRAINT `RecurringInvoice_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecurringInvoice` ADD CONSTRAINT `RecurringInvoice_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `InvoiceTemplate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecurringInvoice` ADD CONSTRAINT `RecurringInvoice_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
