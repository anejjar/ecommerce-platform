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

-- AddForeignKey
ALTER TABLE `RecurringInvoice` ADD CONSTRAINT `RecurringInvoice_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecurringInvoice` ADD CONSTRAINT `RecurringInvoice_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `InvoiceTemplate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecurringInvoice` ADD CONSTRAINT `RecurringInvoice_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
