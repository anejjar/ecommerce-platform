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
