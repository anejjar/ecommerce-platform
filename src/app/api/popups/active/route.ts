import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/popups/active
 * Get active popups for current page
 * Query params: ?page=homepage|product_page|cart|checkout|blog|custom&url=/custom/path
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || 'ALL_PAGES';
    const url = searchParams.get('url') || '';

    const now = new Date();

    // Build where clause
    const where: any = {
      isActive: true,
      OR: [
        { startDate: null },
        { startDate: { lte: now } },
      ],
      AND: [
        {
          OR: [
            { endDate: null },
            { endDate: { gte: now } },
          ],
        },
      ],
    };

    // Add target filtering
    if (page === 'ALL_PAGES') {
      where.target = 'ALL_PAGES';
    } else {
      where.OR = [
        { target: 'ALL_PAGES' },
        { target: page.toUpperCase() },
      ];

      // If custom URL, also check customUrls field
      if (url) {
        where.OR.push({
          target: 'CUSTOM_URL',
          customUrls: {
            contains: url,
          },
        });
      }
    }

    const popups = await prisma.popup.findMany({
      where,
      orderBy: {
        priority: 'desc', // Higher priority first
      },
      select: {
        id: true,
        title: true,
        content: true,
        type: true,
        triggerValue: true,
        position: true,
        width: true,
        height: true,
        backgroundColor: true,
        textColor: true,
        buttonText: true,
        buttonColor: true,
        buttonTextColor: true,
        showCloseButton: true,
        overlayColor: true,
        imageUrl: true,
        frequency: true,
        delaySeconds: true,
        ctaType: true,
        ctaUrl: true,
        discountCode: true,
      },
    });

    return NextResponse.json(popups);
  } catch (error) {
    console.error('Error fetching active popups:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
