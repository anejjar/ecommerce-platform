import { NextRequest, NextResponse } from 'next/server';
import { expirePoints } from '@/lib/loyalty/points-expiration';

/**
 * Cron endpoint to expire points that have passed their expiration date
 * Should be run daily at 00:00 UTC
 *
 * Example cron schedule: 0 0 * * * (daily at midnight)
 */
export async function POST(request: NextRequest) {
  try {
    // Check for secret token (should be set in environment variables)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting loyalty points expiration cron job...');

    const result = await expirePoints();

    console.log(`Points expiration completed. Processed ${result} transactions.`);

    return NextResponse.json({
      success: true,
      expired: result,
      message: `Expired points for ${result} transactions`,
    });
  } catch (error: any) {
    console.error('Error in expire points cron job:', error);
    return NextResponse.json(
      { error: 'Failed to expire points', details: error.message },
      { status: 500 }
    );
  }
}
