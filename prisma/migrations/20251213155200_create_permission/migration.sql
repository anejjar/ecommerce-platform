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
