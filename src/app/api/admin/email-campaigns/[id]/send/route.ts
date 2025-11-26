import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { transporter } from '@/lib/email';
import { z } from 'zod';
import crypto from 'crypto';

const sendCampaignSchema = z.object({
  testEmail: z.string().email().optional(), // For test sends
  recipientEmails: z.array(z.string().email()).optional(), // Manual recipient list
  sendToAll: z.boolean().optional(), // Send to all newsletter subscribers
});

// POST - Send or test a campaign
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const body = await request.json();
    const validatedData = sendCampaignSchema.parse(body);

    const campaign = await prisma.emailCampaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Test email send
    if (validatedData.testEmail) {
      try {
        await transporter.sendMail({
          from: `${campaign.fromName || 'Store'} <${campaign.fromEmail || process.env.EMAIL_USER}>`,
          to: validatedData.testEmail,
          subject: `[TEST] ${campaign.subject}`,
          html: campaign.htmlContent,
          text: campaign.textContent,
          replyTo: campaign.replyTo,
        });

        return NextResponse.json({
          success: true,
          message: `Test email sent to ${validatedData.testEmail}`
        });
      } catch (error) {
        console.error('Error sending test email:', error);
        return NextResponse.json(
          { error: 'Failed to send test email' },
          { status: 500 }
        );
      }
    }

    // Actual campaign send
    if (campaign.status === 'SENT' || campaign.status === 'SENDING') {
      return NextResponse.json(
        { error: 'Campaign already sent or sending' },
        { status: 400 }
      );
    }

    // Update status to SENDING
    await prisma.emailCampaign.update({
      where: { id },
      data: { status: 'SENDING' },
    });

    // Get recipients
    let recipients: string[] = [];

    if (validatedData.recipientEmails && validatedData.recipientEmails.length > 0) {
      recipients = validatedData.recipientEmails;
    } else if (validatedData.sendToAll || campaign.sendToAll) {
      // Get all newsletter subscribers
      const subscribers = await prisma.newsletterSubscriber.findMany({
        where: { isActive: true },
        select: { email: true, name: true },
      });
      recipients = subscribers.map(s => s.email);
    } else {
      // Get recipients from CampaignRecipient table
      const campaignRecipients = await prisma.campaignRecipient.findMany({
        where: { campaignId: id },
        select: { email: true },
      });
      recipients = campaignRecipients.map(r => r.email);
    }

    if (recipients.length === 0) {
      await prisma.emailCampaign.update({
        where: { id },
        data: { status: 'DRAFT' },
      });
      return NextResponse.json(
        { error: 'No recipients found for this campaign' },
        { status: 400 }
      );
    }

    // Create recipient records if sending to all or manual list
    if (validatedData.sendToAll || campaign.sendToAll || validatedData.recipientEmails) {
      const recipientRecords = recipients.map(email => ({
        campaignId: id,
        email,
        trackingToken: crypto.randomBytes(32).toString('hex'),
      }));

      await prisma.campaignRecipient.createMany({
        data: recipientRecords,
        skipDuplicates: true,
      });
    }

    // Queue sending (in production, use a queue like Bull or AWS SQS)
    // For now, we'll send synchronously (not recommended for large lists)
    let sentCount = 0;
    let bouncedCount = 0;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    for (const email of recipients) {
      try {
        const recipient = await prisma.campaignRecipient.findFirst({
          where: {
            campaignId: id,
            email,
          },
        });

        if (!recipient) continue;

        // Add tracking pixel and links
        const trackingPixel = `<img src="${baseUrl}/api/track/open/${recipient.trackingToken}" width="1" height="1" alt="" />`;
        const htmlWithTracking = campaign.htmlContent + trackingPixel;

        await transporter.sendMail({
          from: `${campaign.fromName || 'Store'} <${campaign.fromEmail || process.env.EMAIL_USER}>`,
          to: email,
          subject: campaign.subject,
          html: htmlWithTracking,
          text: campaign.textContent,
          replyTo: campaign.replyTo,
        });

        // Update recipient status
        await prisma.campaignRecipient.update({
          where: { id: recipient.id },
          data: {
            sent: true,
            sentAt: new Date(),
          },
        });

        sentCount++;
      } catch (error) {
        console.error(`Error sending to ${email}:`, error);
        bouncedCount++;

        // Mark as bounced
        const recipient = await prisma.campaignRecipient.findFirst({
          where: { campaignId: params.id, email },
        });

        if (recipient) {
          await prisma.campaignRecipient.update({
            where: { id: recipient.id },
            data: { bounced: true },
          });
        }
      }
    }

    // Update campaign status and stats
    await prisma.emailCampaign.update({
      where: { id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        totalSent: sentCount,
        totalBounced: bouncedCount,
        recipientCount: recipients.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Campaign sent to ${sentCount} recipients`,
      sentCount,
      bouncedCount,
      totalRecipients: recipients.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error sending campaign:', error);

    // Revert status if error
    try {
      await prisma.emailCampaign.update({
        where: { id },
        data: { status: 'DRAFT' },
      });
    } catch (updateError) {
      console.error('Error reverting campaign status:', updateError);
    }

    return NextResponse.json(
      { error: 'Failed to send campaign' },
      { status: 500 }
    );
  }
}
