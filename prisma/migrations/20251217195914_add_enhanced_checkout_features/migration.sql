-- AlterTable
ALTER TABLE `checkout_settings` ADD COLUMN `addressInputMethod` VARCHAR(191) NOT NULL DEFAULT 'autocomplete',
    ADD COLUMN `enableInlineValidation` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `enableMobileOptimization` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `enableQuickGuestCheckout` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `enableSavedAddressQuick` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `enableWhatsAppOrdering` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `whatsAppBusinessNumber` VARCHAR(191) NULL,
    ADD COLUMN `whatsAppButtonPosition` VARCHAR(191) NULL DEFAULT 'secondary',
    ADD COLUMN `whatsAppButtonText` VARCHAR(191) NULL DEFAULT 'Order via WhatsApp',
    ADD COLUMN `whatsAppMessageTemplate` TEXT NULL;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `orderSource` ENUM('WEBSITE', 'WHATSAPP', 'POS', 'ADMIN') NOT NULL DEFAULT 'WEBSITE',
    ADD COLUMN `whatsAppOrderData` JSON NULL;

-- CreateIndex
CREATE INDEX `Order_orderSource_idx` ON `Order`(`orderSource`);
