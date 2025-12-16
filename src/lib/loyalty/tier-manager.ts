import { prisma } from '@/lib/prisma';

/**
 * Check if a customer should be upgraded to a higher tier
 * @param accountId - Customer loyalty account ID
 * @returns true if tier was upgraded, false otherwise
 */
export async function checkTierUpgrade(accountId: string): Promise<boolean> {
  const account = await prisma.customerLoyaltyAccount.findUnique({
    where: { id: accountId },
    include: { tier: true },
  });

  if (!account) {
    throw new Error('Loyalty account not found');
  }

  // Get all tiers ordered by points requirement
  const tiers = await prisma.loyaltyTier.findMany({
    orderBy: { pointsRequired: 'desc' },
  });

  // Find the highest tier the customer qualifies for
  const qualifyingTier = tiers.find(
    (tier) => account.lifetimePoints >= tier.pointsRequired
  );

  if (!qualifyingTier || qualifyingTier.id === account.tierId) {
    return false; // No upgrade needed
  }

  // Upgrade the customer's tier
  await prisma.customerLoyaltyAccount.update({
    where: { id: accountId },
    data: {
      tierId: qualifyingTier.id,
      lastActivityAt: new Date(),
    },
  });

  // TODO: Send tier upgrade notification email
  console.log(
    `Customer ${account.userId} upgraded to ${qualifyingTier.name} tier`
  );

  return true;
}

/**
 * Get information about the next tier a customer can reach
 * @param accountId - Customer loyalty account ID
 * @returns Next tier info or null if already at highest tier
 */
export async function getNextTierInfo(accountId: string) {
  const account = await prisma.customerLoyaltyAccount.findUnique({
    where: { id: accountId },
    include: { tier: true },
  });

  if (!account) {
    throw new Error('Loyalty account not found');
  }

  // Get all tiers ordered by points requirement
  const tiers = await prisma.loyaltyTier.findMany({
    orderBy: { pointsRequired: 'asc' },
  });

  // Find the next tier
  const nextTier = tiers.find(
    (tier) => tier.pointsRequired > account.lifetimePoints
  );

  if (!nextTier) {
    return null; // Already at highest tier
  }

  const pointsNeeded = nextTier.pointsRequired - account.lifetimePoints;
  const progress =
    (account.lifetimePoints /
      (nextTier.pointsRequired || 1)) *
    100;

  return {
    currentTier: account.tier,
    nextTier,
    pointsNeeded,
    progress: Math.min(progress, 100),
  };
}

/**
 * Get all tier benefits
 * @param tierId - Loyalty tier ID
 * @returns Tier with benefits or null
 */
export async function getTierBenefits(tierId: string) {
  return await prisma.loyaltyTier.findUnique({
    where: { id: tierId },
  });
}

/**
 * Get all available tiers
 * @returns Array of all tiers ordered by points requirement
 */
export async function getAllTiers() {
  return await prisma.loyaltyTier.findMany({
    orderBy: { displayOrder: 'asc' },
  });
}
