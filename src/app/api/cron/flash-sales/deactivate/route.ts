import { NextRequest, NextResponse } from 'next/server'
import { checkAndDeactivateSales } from '@/lib/flash-sales/scheduler'

// Cron endpoint to deactivate expired flash sales
export async function POST(request: NextRequest) {
  try {
    // Check for secret token (should be set in environment variables)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET_TOKEN

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await checkAndDeactivateSales()

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('Error in deactivate cron job:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate flash sales' },
      { status: 500 }
    )
  }
}

