import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { pointsExpiringEmail } from '@/lib/email-templates';
import { addDays, format } from 'date-fns';

/**
 * Cron endpoint to send expiration warning emails
 * Should be run daily at 09:00 UTC
 *
 * Example cron schedule: 0 9 * * * (daily at 9am)
 */
export async function POST(request: NextRequest) {
  try {
    // Check for secret token (should be set in environment variables)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting loyalty points expiration warning cron job...');

    const daysBeforeExpiration = 7; // Send warnings 7 days before expiration
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

    if (expiringTransactions.length === 0) {
      console.log('No points expiring soon. No warnings to send.');
      return NextResponse.json({
        success: true,
        warnings: 0,
        message: 'No expiration warnings needed',
      });
    }

    // Group by account
    const accountsMap = new Map<
      string,
      {
        account: any;
        transactions: typeof expiringTransactions;
      }
    >();

    expiringTransactions.forEach((tx) => {
      const existing = accountsMap.get(tx.accountId);
      if (existing) {
        existing.transactions.push(tx);
      } else {
        accountsMap.set(tx.accountId, {
          account: tx.account,
          transactions: [tx],
        });
      }
    });

    let emailsSent = 0;
    let emailsFailed = 0;

    // Send email to each account
    for (const [accountId, data] of accountsMap) {
      const totalExpiring = data.transactions.reduce((sum, tx) => sum + tx.points, 0);
      const earliestExpiration = data.transactions.sort(
        (a, b) => new Date(a.expiresAt!).getTime() - new Date(b.expiresAt!).getTime()
      )[0];

      try {
        await sendEmail({
          to: data.account.user.email,
          subject: `⏰ ${totalExpiring} Loyalty Points Expiring Soon!`,
          html: pointsExpiringEmail(
            data.account.user.name || data.account.user.email,
            totalExpiring,
            format(new Date(earliestExpiration.expiresAt!), 'MMMM dd, yyyy'),
            data.account.pointsBalance
          ),
        });

        emailsSent++;
        console.log(
          `Sent expiration warning to ${data.account.user.email}: ${totalExpiring} points expiring`
        );
      } catch (emailError) {
        emailsFailed++;
        console.error(
          `Failed to send expiration warning to ${data.account.user.email}:`,
          emailError
        );
      }
    }

    console.log(
      `Expiration warnings completed. Sent: ${emailsSent}, Failed: ${emailsFailed}`
    );

    return NextResponse.json({
      success: true,
      warnings: emailsSent,
      failed: emailsFailed,
      message: `Sent ${emailsSent} expiration warnings`,
    });
  } catch (error: any) {
    console.error('Error in expiration warnings cron job:', error);
    return NextResponse.json(
      { error: 'Failed to send expiration warnings', details: error.message },
      { status: 500 }
    );
  }
}
