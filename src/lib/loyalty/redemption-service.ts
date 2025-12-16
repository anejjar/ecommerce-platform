import { prisma } from '@/lib/prisma';
import { calculateDiscountFromPoints } from './points-calculator';

/**
 * Redeem points for a discount code
 * @param accountId - Customer loyalty account ID
 * @param points - Number of points to redeem
 * @returns Created discount code
 */
export async function redeemForDiscount(accountId: string, points: number) {
  const account = await prisma.customerLoyaltyAccount.findUnique({
    where: { id: accountId },
    include: { user: true },
  });

  if (!account) {
    throw new Error('Loyalty account not found');
  }

  if (account.pointsBalance < points) {
    throw new Error('Insufficient points balance');
  }

  // Get loyalty settings
  const settings = await prisma.loyaltySettings.findFirst();
  if (!settings) {
    throw new Error('Loyalty settings not configured');
  }

  if (points < settings.minimumRedemptionPoints) {
    throw new Error(`Minimum redemption is ${settings.minimumRedemptionPoints} points`);
  }

  // Calculate discount amount
  const discountAmount = calculateDiscountFromPoints(
    points,
    settings.redemptionRate
  );

  if (discountAmount === 0) {
    throw new Error('Points not enough for discount');
  }

  // Generate unique discount code
  const code = `LOYALTY${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // Create discount code
  const discountCode = await prisma.discountCode.create({
    data: {
      code,
      type: 'FIXED_AMOUNT',
      value: discountAmount,
      minOrderAmount: 0,
      maxUses: 1,
      usedCount: 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      isActive: true,
    },
  });

  // Create redemption record and deduct points in a transaction
  await prisma.$transaction([
    prisma.loyaltyRedemption.create({
      data: {
        accountId,
        type: 'DISCOUNT_CODE',
        pointsSpent: points,
        discountCodeId: discountCode.id,
        description: `Redeemed ${points} points for $${discountAmount} discount code: ${code}`,
      },
    }),
    prisma.loyaltyPointsTransaction.create({
      data: {
        accountId,
        type: 'REDEMPTION',
        points: -points,
        description: `Redeemed for discount code: ${code}`,
        referenceType: 'redemption',
        referenceId: discountCode.id,
      },
    }),
    prisma.customerLoyaltyAccount.update({
      where: { id: accountId },
      data: {
        pointsBalance: {
          decrement: points,
        },
        lastActivityAt: new Date(),
      },
    }),
  ]);

  console.log(`Customer ${account.userId} redeemed ${points} points for discount code ${code}`);

  return {
    code: discountCode.code,
    value: discountAmount,
    expiresAt: discountCode.endDate,
  };
}

/**
 * Redeem points for free shipping
 * @param accountId - Customer loyalty account ID
 * @returns Created discount code for free shipping
 */
export async function redeemForFreeShipping(accountId: string) {
  const account = await prisma.customerLoyaltyAccount.findUnique({
    where: { id: accountId },
  });

  if (!account) {
    throw new Error('Loyalty account not found');
  }

  const settings = await prisma.loyaltySettings.findFirst();
  if (!settings) {
    throw new Error('Loyalty settings not configured');
  }

  // Define free shipping cost (typically redemption for $10 discount on shipping)
  const shippingPoints = 500; // 500 points for free shipping

  if (account.pointsBalance < shippingPoints) {
    throw new Error('Insufficient points for free shipping');
  }

  // Generate unique discount code for shipping
  const code = `SHIP${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // Create shipping discount code
  const discountCode = await prisma.discountCode.create({
    data: {
      code,
      type: 'FIXED_AMOUNT',
      value: 15, // Cover up to $15 shipping
      minOrderAmount: 0,
      maxUses: 1,
      usedCount: 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      isActive: true,
    },
  });

  // Create redemption and deduct points
  await prisma.$transaction([
    prisma.loyaltyRedemption.create({
      data: {
        accountId,
        type: 'FREE_SHIPPING',
        pointsSpent: shippingPoints,
        discountCodeId: discountCode.id,
        description: `Redeemed ${shippingPoints} points for free shipping code: ${code}`,
      },
    }),
    prisma.loyaltyPointsTransaction.create({
      data: {
        accountId,
        type: 'REDEMPTION',
        points: -shippingPoints,
        description: `Redeemed for free shipping: ${code}`,
        referenceType: 'redemption',
        referenceId: discountCode.id,
      },
    }),
    prisma.customerLoyaltyAccount.update({
      where: { id: accountId },
      data: {
        pointsBalance: {
          decrement: shippingPoints,
        },
        lastActivityAt: new Date(),
      },
    }),
  ]);

  return {
    code: discountCode.code,
    value: 15,
    expiresAt: discountCode.endDate,
  };
}

/**
 * Get redemption history for an account
 * @param accountId - Customer loyalty account ID
 * @param limit - Number of records to return
 * @returns Array of redemptions
 */
export async function getRedemptionHistory(accountId: string, limit = 10) {
  return await prisma.loyaltyRedemption.findMany({
    where: { accountId },
    include: {
      discountCode: true,
      product: true,
    },
    orderBy: { redeemedAt: 'desc' },
    take: limit,
  });
}

/**
 * Validate redemption amount
 * @param points - Points to redeem
 * @param accountBalance - Customer's current balance
 * @param minPoints - Minimum points for redemption
 * @returns Validation result
 */
export function validateRedemption(
  points: number,
  accountBalance: number,
  minPoints: number
): { valid: boolean; error?: string } {
  if (points < minPoints) {
    return {
      valid: false,
      error: `Minimum redemption is ${minPoints} points`,
    };
  }

  if (points > accountBalance) {
    return {
      valid: false,
      error: 'Insufficient points balance',
    };
  }

  if (points % 100 !== 0) {
    return {
      valid: false,
      error: 'Points must be redeemed in increments of 100',
    };
  }

  return { valid: true };
}
