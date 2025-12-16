import { prisma } from '@/lib/prisma';
import { calculateActionPoints } from './points-calculator';

/**
 * Generate a unique referral code
 * @returns 8-character unique code
 */
export function generateReferralCode(): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar looking chars
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

/**
 * Claim referral bonus when a referred user makes their first purchase
 * @param referredUserId - ID of the user who was referred
 * @param referralCode - Referral code used
 * @returns Success status and points awarded
 */
export async function claimReferralBonus(
  referredUserId: string,
  referralCode: string
): Promise<{ success: boolean; points?: number; error?: string }> {
  // Find the referrer's account
  const referrerAccount = await prisma.customerLoyaltyAccount.findUnique({
    where: { referralCode },
    include: { user: true },
  });

  if (!referrerAccount) {
    return { success: false, error: 'Invalid referral code' };
  }

  // Check if referred user exists
  const referredAccount = await prisma.customerLoyaltyAccount.findUnique({
    where: { userId: referredUserId },
  });

  if (!referredAccount) {
    return { success: false, error: 'Referred user not found' };
  }

  // Check if referral relationship already exists
  if (referredAccount.referredById) {
    return { success: false, error: 'User was already referred' };
  }

  // Prevent self-referral
  if (referrerAccount.userId === referredUserId) {
    return { success: false, error: 'Cannot refer yourself' };
  }

  // Get loyalty settings
  const settings = await prisma.loyaltySettings.findFirst();
  if (!settings) {
    return { success: false, error: 'Loyalty settings not configured' };
  }

  const referralPoints = calculateActionPoints('referral', settings);

  // Award points to both users in a transaction
  await prisma.$transaction([
    // Update referred user's account with referrer link
    prisma.customerLoyaltyAccount.update({
      where: { id: referredAccount.id },
      data: {
        referredById: referrerAccount.id,
      },
    }),
    // Award points to referrer
    prisma.loyaltyPointsTransaction.create({
      data: {
        accountId: referrerAccount.id,
        type: 'REFERRAL_GIVEN',
        points: referralPoints,
        description: `Referral bonus for referring ${referredAccount.userId}`,
        referenceType: 'referral',
        referenceId: referredAccount.id,
      },
    }),
    // Update referrer's balance and lifetime points
    prisma.customerLoyaltyAccount.update({
      where: { id: referrerAccount.id },
      data: {
        pointsBalance: {
          increment: referralPoints,
        },
        lifetimePoints: {
          increment: referralPoints,
        },
        lastActivityAt: new Date(),
      },
    }),
    // Award welcome bonus to referred user (half of referral bonus)
    prisma.loyaltyPointsTransaction.create({
      data: {
        accountId: referredAccount.id,
        type: 'REFERRAL_RECEIVED',
        points: Math.floor(referralPoints / 2),
        description: `Welcome bonus from referral`,
        referenceType: 'referral',
        referenceId: referrerAccount.id,
      },
    }),
    // Update referred user's balance
    prisma.customerLoyaltyAccount.update({
      where: { id: referredAccount.id },
      data: {
        pointsBalance: {
          increment: Math.floor(referralPoints / 2),
        },
        lifetimePoints: {
          increment: Math.floor(referralPoints / 2),
        },
        lastActivityAt: new Date(),
      },
    }),
  ]);

  console.log(
    `Referral bonus claimed: ${referrerAccount.userId} referred ${referredUserId}. ${referralPoints} points awarded.`
  );

  return { success: true, points: referralPoints };
}

/**
 * Get referral statistics for an account
 * @param accountId - Customer loyalty account ID
 * @returns Referral stats
 */
export async function getReferralStats(accountId: string) {
  const account = await prisma.customerLoyaltyAccount.findUnique({
    where: { id: accountId },
    include: {
      referralsGiven: {
        include: {
          user: {
            select: {
              email: true,
              name: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

  if (!account) {
    throw new Error('Loyalty account not found');
  }

  // Get total points earned from referrals
  const referralTransactions = await prisma.loyaltyPointsTransaction.findMany({
    where: {
      accountId,
      type: 'REFERRAL_GIVEN',
    },
  });

  const totalReferralPoints = referralTransactions.reduce(
    (sum, tx) => sum + tx.points,
    0
  );

  return {
    referralCode: account.referralCode,
    totalReferrals: account.referralsGiven.length,
    totalPointsEarned: totalReferralPoints,
    referrals: account.referralsGiven.map((ref) => ({
      userId: ref.userId,
      email: ref.user.email,
      name: ref.user.name,
      joinedAt: ref.enrolledAt,
    })),
  };
}

/**
 * Validate referral code
 * @param code - Referral code to validate
 * @returns Validation result
 */
export async function validateReferralCode(
  code: string
): Promise<{ valid: boolean; error?: string }> {
  const account = await prisma.customerLoyaltyAccount.findUnique({
    where: { referralCode: code },
  });

  if (!account) {
    return { valid: false, error: 'Invalid referral code' };
  }

  return { valid: true };
}
