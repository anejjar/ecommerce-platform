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
