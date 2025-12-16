import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkTierUpgrade } from '@/lib/loyalty/tier-manager';

/**
 * Cron endpoint to recalculate and update customer tiers
 * Should be run daily at 02:00 UTC
 *
 * Example cron schedule: 0 2 * * * (daily at 2am)
 */
export async function POST(request: NextRequest) {
  try {
    // Check for secret token (should be set in environment variables)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting tier recalculation cron job...');

    // Get all loyalty accounts
    const accounts = await prisma.customerLoyaltyAccount.findMany({
      select: { id: true },
    });

    let upgraded = 0;
    let processed = 0;

    for (const account of accounts) {
      try {
        const wasUpgraded = await checkTierUpgrade(account.id);
        if (wasUpgraded) {
          upgraded++;
        }
        processed++;
      } catch (error) {
        console.error(`Failed to check tier for account ${account.id}:`, error);
      }
    }

    console.log(
      `Tier recalculation completed. Processed: ${processed}, Upgraded: ${upgraded}`
    );

    return NextResponse.json({
      success: true,
      processed,
      upgraded,
      message: `Processed ${processed} accounts, ${upgraded} tier upgrades`,
    });
  } catch (error: any) {
    console.error('Error in tier recalculation cron job:', error);
    return NextResponse.json(
      { error: 'Failed to recalculate tiers', details: error.message },
      { status: 500 }
    );
  }
}
