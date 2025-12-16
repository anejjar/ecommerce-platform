import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redeemForDiscount, redeemForFreeShipping, validateRedemption } from '@/lib/loyalty/redemption-service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get loyalty account
    const account = await prisma.customerLoyaltyAccount.findUnique({
      where: { userId: user.id },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Loyalty account not found' },
        { status: 404 }
      );
    }

    // Get request body
    const body = await request.json();
    const { type, points } = body;

    // Validate redemption type
    if (!type || !['discount', 'free_shipping'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid redemption type. Must be "discount" or "free_shipping"' },
        { status: 400 }
      );
    }

    // Get settings for validation
    const settings = await prisma.loyaltySettings.findFirst();
    if (!settings) {
      return NextResponse.json(
        { error: 'Loyalty settings not configured' },
        { status: 500 }
      );
    }

    // Handle discount redemption
    if (type === 'discount') {
      if (!points || points < 100) {
        return NextResponse.json(
          { error: 'Points must be specified and at least 100' },
          { status: 400 }
        );
      }

      // Validate redemption
      const validation = validateRedemption(
        points,
        account.pointsBalance,
        settings.minimumRedemptionPoints
      );

      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }

      // Redeem for discount
      const result = await redeemForDiscount(account.id, points);

      return NextResponse.json({
        success: true,
        type: 'discount',
        discountCode: result.code,
        discountValue: result.value,
        expiresAt: result.expiresAt,
        pointsSpent: points,
      });
    }

    // Handle free shipping redemption
    if (type === 'free_shipping') {
      const result = await redeemForFreeShipping(account.id);

      return NextResponse.json({
        success: true,
        type: 'free_shipping',
        discountCode: result.code,
        discountValue: result.value,
        expiresAt: result.expiresAt,
        pointsSpent: 500,
      });
    }

    return NextResponse.json(
      { error: 'Invalid redemption type' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Redeem loyalty points error:', error);

    // Handle specific error messages from redemption service
    if (error.message) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to redeem loyalty points' },
      { status: 500 }
    );
  }
}
