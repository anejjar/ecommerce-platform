import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isFeatureEnabled } from '@/lib/features';
import { sendEmail } from '@/lib/email';
import {
  abandonedCartFirstReminder,
  abandonedCartSecondReminder,
  abandonedCartFinalReminder,
} from '@/lib/abandoned-cart-emails';

interface CartItem {
  productId: string;
  variantId?: string | null;
  quantity: number;
  price: number;
  name?: string;
}

// Helper function to create discount code for abandoned cart
async function createDiscountCode(abandonedCartId: string): Promise<string> {
  const code = `COMEBACK${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // Create 10% discount code
  const discountCode = await prisma.discountCode.create({
    data: {
      code,
      type: 'PERCENTAGE',
      value: 10,
      minOrderAmount: null,
      maxUses: 1,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isActive: true,
    },
  });

  return code;
}

// Process abandoned cart emails
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if feature is enabled
    const enabled = await isFeatureEnabled('abandoned_cart');
    if (!enabled) {
      return NextResponse.json(
        { error: 'Feature not available' },
        { status: 404 }
      );
    }

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let sentCount = 0;
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    // === FIRST REMINDER (1 hour after abandonment) ===
    const firstReminderCarts = await prisma.abandonedCart.findMany({
      where: {
        status: 'ABANDONED',
        abandonedAt: {
          lte: oneHourAgo,
          gte: oneDayAgo, // Not older than 1 day (avoid overlap with second reminder)
        },
        emails: {
          none: {
            emailType: 'FIRST_REMINDER',
          },
        },
      },
      include: {
        user: true,
      },
    });

    for (const cart of firstReminderCarts) {
      const cartItemsRaw: CartItem[] = JSON.parse(cart.cartSnapshot);
      const cartItems = cartItemsRaw.map(item => ({
        productId: item.productId,
        name: item.name || 'Unknown Product',
        quantity: item.quantity,
        price: item.price,
      }));
      const customerName = cart.user?.name || cart.guestName || null;
      const recipientEmail = cart.user?.email || cart.guestEmail;

      if (!recipientEmail) continue;

      const recoveryUrl = `${baseUrl}/cart/recover/${cart.recoveryToken}`;

      try {
        await sendEmail({
          to: recipientEmail,
          subject: 'You Left Something Behind! 🛒',
          html: abandonedCartFirstReminder(
            customerName,
            cartItems,
            cart.totalValue.toString(),
            recoveryUrl
          ),
        });

        // Log email sent
        await prisma.abandonedCartEmail.create({
          data: {
            abandonedCartId: cart.id,
            emailType: 'FIRST_REMINDER',
          },
        });

        sentCount++;
      } catch (error) {
        console.error(`Failed to send first reminder for cart ${cart.id}:`, error);
      }
    }

    // === SECOND REMINDER (24 hours - with discount) ===
    const secondReminderCarts = await prisma.abandonedCart.findMany({
      where: {
        status: 'ABANDONED',
        abandonedAt: {
          lte: oneDayAgo,
          gte: threeDaysAgo, // Not older than 3 days
        },
        emails: {
          none: {
            emailType: 'SECOND_REMINDER',
          },
        },
      },
      include: {
        user: true,
      },
    });

    for (const cart of secondReminderCarts) {
      const cartItemsRaw: CartItem[] = JSON.parse(cart.cartSnapshot);
      const cartItems = cartItemsRaw.map(item => ({
        productId: item.productId,
        name: item.name || 'Unknown Product',
        quantity: item.quantity,
        price: item.price,
      }));
      const customerName = cart.user?.name || cart.guestName || null;
      const recipientEmail = cart.user?.email || cart.guestEmail;

      if (!recipientEmail) continue;

      // Create discount code if not already created
      let discountCode = cart.discountCode;
      if (!discountCode) {
        discountCode = await createDiscountCode(cart.id);

        await prisma.abandonedCart.update({
          where: { id: cart.id },
          data: { discountCode },
        });
      }

      const recoveryUrl = `${baseUrl}/cart/recover/${cart.recoveryToken}`;

      try {
        await sendEmail({
          to: recipientEmail,
          subject: "Still Thinking? Here's 10% Off! 🎁",
          html: abandonedCartSecondReminder(
            customerName,
            cartItems,
            cart.totalValue.toString(),
            recoveryUrl,
            discountCode
          ),
        });

        await prisma.abandonedCartEmail.create({
          data: {
            abandonedCartId: cart.id,
            emailType: 'SECOND_REMINDER',
          },
        });

        sentCount++;
      } catch (error) {
        console.error(`Failed to send second reminder for cart ${cart.id}:`, error);
      }
    }

    // === FINAL REMINDER (3 days - last chance) ===
    const finalReminderCarts = await prisma.abandonedCart.findMany({
      where: {
        status: 'ABANDONED',
        abandonedAt: {
          lte: threeDaysAgo,
          gte: thirtyDaysAgo, // Not expired yet
        },
        emails: {
          none: {
            emailType: 'FINAL_REMINDER',
          },
        },
      },
      include: {
        user: true,
      },
    });

    for (const cart of finalReminderCarts) {
      const cartItemsRaw: CartItem[] = JSON.parse(cart.cartSnapshot);
      const cartItems = cartItemsRaw.map(item => ({
        productId: item.productId,
        name: item.name || 'Unknown Product',
        quantity: item.quantity,
        price: item.price,
      }));
      const customerName = cart.user?.name || cart.guestName || null;
      const recipientEmail = cart.user?.email || cart.guestEmail;

      if (!recipientEmail) continue;

      const recoveryUrl = `${baseUrl}/cart/recover/${cart.recoveryToken}`;

      try {
        await sendEmail({
          to: recipientEmail,
          subject: 'Last Chance! Your Cart is Waiting ⏰',
          html: abandonedCartFinalReminder(
            customerName,
            cartItems,
            cart.totalValue.toString(),
            recoveryUrl,
            cart.discountCode || undefined
          ),
        });

        await prisma.abandonedCartEmail.create({
          data: {
            abandonedCartId: cart.id,
            emailType: 'FINAL_REMINDER',
          },
        });

        sentCount++;
      } catch (error) {
        console.error(`Failed to send final reminder for cart ${cart.id}:`, error);
      }
    }

    // === EXPIRE OLD CARTS (30+ days old) ===
    await prisma.abandonedCart.updateMany({
      where: {
        status: 'ABANDONED',
        abandonedAt: {
          lt: thirtyDaysAgo,
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    return NextResponse.json({
      success: true,
      emailsSent: sentCount,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('Error processing abandoned carts:', error);
    return NextResponse.json(
      { error: 'Failed to process abandoned carts' },
      { status: 500 }
    );
  }
}
