import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { earlyAccessNotificationEmail } from '@/lib/email-templates';
import { format } from 'date-fns';

/**
 * Cron endpoint to send early access notifications to VIP members
 * Should be run hourly
 *
 * Example cron schedule: 0 * * * * (every hour)
 */
export async function POST(request: NextRequest) {
  try {
    // Check for secret token (should be set in environment variables)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting early access notification cron job...');

    // Find early access grants that haven't been notified yet
    const grants = await prisma.loyaltyEarlyAccess.findMany({
      where: {
        notified: false,
        expiresAt: {
          gte: new Date(), // Still valid
        },
      },
      include: {
        account: {
          include: {
            user: true,
            tier: true,
          },
        },
      },
    });

    if (grants.length === 0) {
      console.log('No early access notifications to send.');
      return NextResponse.json({
        success: true,
        notifications: 0,
        message: 'No early access notifications needed',
      });
    }

    let emailsSent = 0;
    let emailsFailed = 0;

    for (const grant of grants) {
      try {
        // Get flash sale or product details
        let itemName = '';
        let publicStartDate = '';
        let earlyAccessStartDate = format(
          new Date(grant.grantedAt),
          'MMMM dd, yyyy • hh:mm a'
        );

        if (grant.accessType === 'flash_sale') {
          const flashSale = await prisma.flashSale.findUnique({
            where: { id: grant.referenceId },
          });

          if (flashSale) {
            itemName = flashSale.name;
            publicStartDate = format(
              new Date(flashSale.startDate),
              'MMMM dd, yyyy • hh:mm a'
            );
          }
        } else if (grant.accessType === 'product_launch') {
          const product = await prisma.product.findUnique({
            where: { id: grant.referenceId },
          });

          if (product) {
            itemName = product.name;
            // For product launches, we'd need a launch date field
            publicStartDate = format(new Date(grant.expiresAt), 'MMMM dd, yyyy • hh:mm a');
          }
        }

        if (!itemName) {
          console.log(`Skipping grant ${grant.id}: item not found`);
          continue;
        }

        await sendEmail({
          to: grant.account.user.email,
          subject: `🌟 VIP Early Access: ${itemName}`,
          html: earlyAccessNotificationEmail(
            grant.account.user.name || grant.account.user.email,
            grant.account.tier.name,
            itemName,
            earlyAccessStartDate,
            publicStartDate,
            grant.account.tier.earlyAccessHours
          ),
        });

        // Mark as notified
        await prisma.loyaltyEarlyAccess.update({
          where: { id: grant.id },
          data: { notified: true },
        });

        emailsSent++;
        console.log(
          `Sent early access notification to ${grant.account.user.email} for ${itemName}`
        );
      } catch (emailError) {
        emailsFailed++;
        console.error(
          `Failed to send early access notification for grant ${grant.id}:`,
          emailError
        );
      }
    }

    console.log(
      `Early access notifications completed. Sent: ${emailsSent}, Failed: ${emailsFailed}`
    );

    return NextResponse.json({
      success: true,
      notifications: emailsSent,
      failed: emailsFailed,
      message: `Sent ${emailsSent} early access notifications`,
    });
  } catch (error: any) {
    console.error('Error in early access notifications cron job:', error);
    return NextResponse.json(
      { error: 'Failed to send early access notifications', details: error.message },
      { status: 500 }
    );
  }
}
