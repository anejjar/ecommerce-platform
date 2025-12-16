import { Decimal } from '@prisma/client/runtime/library';

export interface LoyaltySettings {
  pointsPerDollar: Decimal;
  pointsPerReview: number;
  pointsPerReferral: number;
  pointsPerSocialShare: number;
}

/**
 * Calculate points earned from a purchase
 * @param orderTotal - Total order amount in store currency
 * @param settings - Loyalty program settings
 * @param tierMultiplier - Multiplier based on customer's tier
 * @returns Number of points earned
 */
export function calculatePurchasePoints(
  orderTotal: Decimal,
  settings: LoyaltySettings,
  tierMultiplier: Decimal
): number {
  const basePoints = Number(orderTotal) * Number(settings.pointsPerDollar);
  const totalPoints = basePoints * Number(tierMultiplier);
  return Math.floor(totalPoints); // Round down to whole number
}

/**
 * Calculate points for action-based rewards
 * @param actionType - Type of action performed
 * @param settings - Loyalty program settings
 * @returns Number of points to award
 */
export function calculateActionPoints(
  actionType: 'review' | 'referral' | 'social_share',
  settings: LoyaltySettings
): number {
  switch (actionType) {
    case 'review':
      return settings.pointsPerReview;
    case 'referral':
      return settings.pointsPerReferral;
    case 'social_share':
      return settings.pointsPerSocialShare;
    default:
      return 0;
  }
}

/**
 * Calculate discount amount from points
 * @param points - Number of points to redeem
 * @param redemptionRate - Points needed per currency unit discount
 * @returns Discount amount in store currency
 */
export function calculateDiscountFromPoints(
  points: number,
  redemptionRate: number
): number {
  if (points < redemptionRate) {
    return 0;
  }
  return Math.floor(points / redemptionRate);
}

/**
 * Calculate points needed for a specific discount
 * @param discountAmount - Desired discount in store currency
 * @param redemptionRate - Points needed per currency unit discount
 * @returns Number of points required
 */
export function calculatePointsForDiscount(
  discountAmount: number,
  redemptionRate: number
): number {
  return discountAmount * redemptionRate;
}
