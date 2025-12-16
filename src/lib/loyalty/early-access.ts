import { prisma } from '@/lib/prisma';
import { addHours } from 'date-fns';

/**
 * Grant early access to a flash sale or product launch
 * @param accountId - Customer loyalty account ID
 * @param accessType - Type of early access ('flash_sale' or 'product_launch')
 * @param referenceId - ID of the flash sale or product
 * @param hoursBeforePublic - Hours of early access
 */
export async function grantEarlyAccess(
  accountId: string,
  accessType: 'flash_sale' | 'product_launch',
  referenceId: string,
  hoursBeforePublic: number
): Promise<void> {
  const expiresAt = addHours(new Date(), hoursBeforePublic);

  await prisma.loyaltyEarlyAccess.upsert({
    where: {
      accountId_accessType_referenceId: {
        accountId,
        accessType,
        referenceId,
      },
    },
    update: {
      expiresAt,
      notified: false,
    },
    create: {
      accountId,
      accessType,
      referenceId,
      expiresAt,
      notified: false,
      accessed: false,
    },
  });
}

/**
 * Check if a user has early access to a specific item
 * @param userId - User ID
 * @param referenceId - Flash sale or product ID
 * @returns true if user has active early access
 */
export async function checkEarlyAccessEligibility(
  userId: string,
  referenceId: string
): Promise<boolean> {
  const account = await prisma.customerLoyaltyAccount.findUnique({
    where: { userId },
    include: {
      earlyAccessGrants: {
        where: {
          referenceId,
          expiresAt: {
            gte: new Date(),
          },
        },
      },
    },
  });

  if (!account || account.earlyAccessGrants.length === 0) {
    return false;
  }

  // Mark as accessed if not already
  const grant = account.earlyAccessGrants[0];
  if (!grant.accessed) {
    await prisma.loyaltyEarlyAccess.update({
      where: { id: grant.id },
      data: { accessed: true },
    });
  }

  return true;
}

/**
 * Grant early access to all eligible members for a flash sale
 * @param flashSaleId - Flash sale ID
 * @param startDate - Sale start date
 */
export async function grantFlashSaleEarlyAccess(
  flashSaleId: string,
  startDate: Date
): Promise<void> {
  // Get all accounts with early access enabled tiers
  const accounts = await prisma.customerLoyaltyAccount.findMany({
    where: {
      tier: {
        earlyAccessEnabled: true,
      },
    },
    include: {
      tier: true,
    },
  });

  const now = new Date();
  const saleStart = new Date(startDate);

  for (const account of accounts) {
    // Calculate hours until sale starts
    const hoursUntilSale = (saleStart.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Only grant if early access window is within the configured hours
    if (hoursUntilSale > 0 && hoursUntilSale <= account.tier.earlyAccessHours) {
      await grantEarlyAccess(
        account.id,
        'flash_sale',
        flashSaleId,
        account.tier.earlyAccessHours
      );
    }
  }

  console.log(`Granted early access to ${accounts.length} VIP members for flash sale ${flashSaleId}`);
}

/**
 * Get all early access grants for an account
 * @param accountId - Customer loyalty account ID
 * @returns Array of active early access grants
 */
export async function getEarlyAccessGrants(accountId: string) {
  return await prisma.loyaltyEarlyAccess.findMany({
    where: {
      accountId,
      expiresAt: {
        gte: new Date(),
      },
    },
    orderBy: {
      grantedAt: 'desc',
    },
  });
}

/**
 * Notify users about their early access
 * @param referenceId - Flash sale or product ID
 * @param accessType - Type of early access
 */
export async function notifyEarlyAccessUsers(
  referenceId: string,
  accessType: 'flash_sale' | 'product_launch'
): Promise<void> {
  const grants = await prisma.loyaltyEarlyAccess.findMany({
    where: {
      referenceId,
      accessType,
      notified: false,
      expiresAt: {
        gte: new Date(),
      },
    },
    include: {
      account: {
        include: {
          user: true,
        },
      },
    },
  });

  for (const grant of grants) {
    // TODO: Send early access notification email
    console.log(`Notifying ${grant.account.user.email} about early access to ${accessType} ${referenceId}`);

    await prisma.loyaltyEarlyAccess.update({
      where: { id: grant.id },
      data: { notified: true },
    });
  }

  console.log(`Notified ${grants.length} users about early access`);
}
