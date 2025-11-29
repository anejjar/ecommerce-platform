import { NextRequest, NextResponse } from 'next/server'
import { checkAndActivateSales } from '@/lib/flash-sales/scheduler'

// Cron endpoint to activate scheduled flash sales
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

    const result = await checkAndActivateSales()

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('Error in activate cron job:', error)
    return NextResponse.json(
      { error: 'Failed to activate flash sales' },
      { status: 500 }
    )
  }
}

