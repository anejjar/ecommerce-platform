import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getRedemptionHistory } from '@/lib/loyalty/redemption-service';

export async function GET(request: NextRequest) {
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
      select: { id: true },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Loyalty account not found' },
        { status: 404 }
      );
    }

    // Get pagination params
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get redemption history
    const redemptions = await getRedemptionHistory(account.id, limit);

    return NextResponse.json({
      redemptions: redemptions.map((redemption) => ({
        id: redemption.id,
        type: redemption.type,
        pointsSpent: redemption.pointsSpent,
        description: redemption.description,
        redeemedAt: redemption.redeemedAt,
        discountCode: redemption.discountCode
          ? {
              code: redemption.discountCode.code,
              value: Number(redemption.discountCode.value),
              type: redemption.discountCode.type,
            }
          : null,
        product: redemption.product
          ? {
              id: redemption.product.id,
              name: redemption.product.name,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error('Get redemption history error:', error);
    return NextResponse.json(
      { error: 'Failed to get redemption history' },
      { status: 500 }
    );
  }
}
