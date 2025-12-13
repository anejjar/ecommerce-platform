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

-- AddForeignKey
ALTER TABLE `CampaignRecipient` ADD CONSTRAINT `CampaignRecipient_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `EmailCampaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
