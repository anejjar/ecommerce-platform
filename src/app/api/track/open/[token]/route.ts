import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Track email open
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const recipient = await prisma.campaignRecipient.findUnique({
      where: { trackingToken: token },
      include: { campaign: true },
    });

    if (recipient && !recipient.opened) {
      // Update recipient
      await prisma.campaignRecipient.update({
        where: { id: recipient.id },
        data: {
          opened: true,
          openedAt: new Date(),
        },
      });

      // Update campaign stats
      await prisma.emailCampaign.update({
        where: { id: recipient.campaignId },
        data: {
          totalOpened: { increment: 1 },
        },
      });

      // Log analytics
      await prisma.campaignAnalytics.create({
        data: {
          campaignId: recipient.campaignId,
          eventType: 'open',
          recipientEmail: recipient.email,
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
      });
    }

    // Return 1x1 transparent pixel
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );

    return new NextResponse(pixel, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error tracking email open:', error);

    // Still return pixel even on error
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );

    return new NextResponse(pixel, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
}
