import { prisma } from '@/lib/prisma';
import { addDays } from 'date-fns';

/**
 * Expire points that have passed their expiration date
 * This should be run as a daily cron job
 * @returns Number of accounts processed
 */
export async function expirePoints(): Promise<number> {
  console.log('Starting points expiration process...');

  const now = new Date();

  // Find all transactions with expired points
  const expiredTransactions = await prisma.loyaltyPointsTransaction.findMany({
    where: {
      expiresAt: {
        lte: now,
      },
      expired: false,
      points: {
        gt: 0, // Only positive (earned) points can expire
      },
    },
    include: {
      account: true,
    },
  });

  if (expiredTransactions.length === 0) {
    console.log('No points to expire');
    return 0;
  }

  console.log(`Found ${expiredTransactions.length} expired point transactions`);

  // Process each expired transaction
  for (const transaction of expiredTransactions) {
    await prisma.$transaction([
      // Mark transaction as expired
      prisma.loyaltyPointsTransaction.update({
        where: { id: transaction.id },
        data: { expired: true },
      }),
      // Create expiration transaction
      prisma.loyaltyPointsTransaction.create({
        data: {
          accountId: transaction.accountId,
          type: 'EXPIRATION',
          points: -transaction.points,
          description: `Expired points from ${transaction.createdAt.toLocaleDateString()}`,
          referenceType: 'expiration',
          referenceId: transaction.id,
        },
      }),
      // Deduct points from balance
      prisma.customerLoyaltyAccount.update({
        where: { id: transaction.accountId },
        data: {
          pointsBalance: {
            decrement: transaction.points,
          },
        },
      }),
    ]);

    console.log(
      `Expired ${transaction.points} points for account ${transaction.accountId}`
    );

    // TODO: Send expiration notification email
  }

  console.log(`Expired points for ${expiredTransactions.length} transactions`);
  return expiredTransactions.length;
}

/**
 * Get points expiring soon for an account
 * @param accountId - Customer loyalty account ID
 * @param daysAhead - Number of days to look ahead
 * @returns Total points expiring and transactions
 */
export async function getExpiringPoints(accountId: string, daysAhead = 30) {
  const futureDate = addDays(new Date(), daysAhead);

  const expiringTransactions = await prisma.loyaltyPointsTransaction.findMany({
    where: {
      accountId,
      expiresAt: {
        lte: futureDate,
        gte: new Date(),
      },
      expired: false,
      points: {
        gt: 0,
      },
    },
    orderBy: {
      expiresAt: 'asc',
    },
  });

  const totalExpiring = expiringTransactions.reduce(
    (sum, tx) => sum + tx.points,
    0
  );

  return {
    totalExpiring,
    transactions: expiringTransactions,
  };
}

/**
 * Send expiration warning emails to customers
 * This should be run as a daily cron job
 * @param daysBeforeExpiration - Days before expiration to send warning
 * @returns Number of emails sent
 */
export async function sendExpirationWarnings(
  daysBeforeExpiration = 7
): Promise<number> {
  console.log('Sending expiration warning emails...');

  const warningDate = addDays(new Date(), daysBeforeExpiration);
  const today = addDays(new Date(), daysBeforeExpiration - 1);

  // Find transactions expiring within the warning period
  const expiringTransactions = await prisma.loyaltyPointsTransaction.findMany({
    where: {
      expiresAt: {
        gte: today,
        lte: warningDate,
      },
      expired: false,
      points: {
        gt: 0,
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

  // Group by account
  const accountsMap = new Map<string, typeof expiringTransactions>();
  expiringTransactions.forEach((tx) => {
    const existing = accountsMap.get(tx.accountId) || [];
    accountsMap.set(tx.accountId, [...existing, tx]);
  });

  let emailsSent = 0;

  // Send email to each account
  for (const [accountId, transactions] of accountsMap) {
    const totalExpiring = transactions.reduce((sum, tx) => sum + tx.points, 0);
    const account = transactions[0].account;

    // TODO: Send expiration warning email
    console.log(
      `Warning: ${totalExpiring} points expiring soon for ${account.user.email}`
    );

    emailsSent++;
  }

  console.log(`Sent ${emailsSent} expiration warning emails`);
  return emailsSent;
}

/**
 * Calculate expiration date for newly earned points
 * @param expirationDays - Days until expiration from settings
 * @returns Expiration date
 */
export function calculateExpirationDate(expirationDays: number): Date {
  return addDays(new Date(), expirationDays);
}

/**
 * Get expiration summary for an account
 * @param accountId - Customer loyalty account ID
 * @returns Expiration summary with upcoming expirations
 */
export async function getExpirationSummary(accountId: string) {
  const [expiring7Days, expiring30Days, expiring90Days] = await Promise.all([
    getExpiringPoints(accountId, 7),
    getExpiringPoints(accountId, 30),
    getExpiringPoints(accountId, 90),
  ]);

  return {
    expiring7Days: expiring7Days.totalExpiring,
    expiring30Days: expiring30Days.totalExpiring,
    expiring90Days: expiring90Days.totalExpiring,
    nextExpiration: expiring7Days.transactions[0] || null,
  };
}
