import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/popups/[id]/track
 * Track popup events (views, clicks, dismissals, conversions)
 * Body: { event: 'view' | 'click' | 'dismissal' | 'conversion' }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { event } = body;

    if (!event || !['view', 'click', 'dismissal', 'conversion'].includes(event)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }

    // Get today's date (without time for aggregation)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Upsert analytics record for today
    const analytics = await prisma.popupAnalytics.upsert({
      where: {
        popupId_date: {
          popupId: id,
          date: today,
        },
      },
      update: {
        views: event === 'view' ? { increment: 1 } : undefined,
        clicks: event === 'click' ? { increment: 1 } : undefined,
        dismissals: event === 'dismissal' ? { increment: 1 } : undefined,
        conversions: event === 'conversion' ? { increment: 1 } : undefined,
      },
      create: {
        popupId: id,
        date: today,
        views: event === 'view' ? 1 : 0,
        clicks: event === 'click' ? 1 : 0,
        dismissals: event === 'dismissal' ? 1 : 0,
        conversions: event === 'conversion' ? 1 : 0,
      },
    });

    return NextResponse.json({ success: true, analytics });
  } catch (error) {
    console.error('Error tracking popup event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
