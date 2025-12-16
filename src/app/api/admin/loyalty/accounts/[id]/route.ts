import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { addDays } from 'date-fns';

/**
 * GET /api/admin/loyalty/accounts/[id]
 * Get single loyalty account details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const account = await prisma.customerLoyaltyAccount.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
        tier: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        redemptions: {
          orderBy: { redeemedAt: 'desc' },
          take: 20,
          include: {
            discountCode: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        earlyAccessGrants: {
          orderBy: { grantedAt: 'desc' },
          take: 20,
        },
        _count: {
          select: {
            transactions: true,
            redemptions: true,
            referralsGiven: true,
          },
        },
      },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json({ account });
  } catch (error: any) {
    console.error('Error fetching loyalty account:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loyalty account', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/loyalty/accounts/[id]
 * Manual point adjustment for loyalty account
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { points, reason, expirationDays } = body;

    if (typeof points !== 'number' || points === 0) {
      return NextResponse.json(
        { error: 'Points must be a non-zero number' },
        { status: 400 }
      );
    }

    if (!reason || typeof reason !== 'string') {
      return NextResponse.json(
        { error: 'Reason is required' },
        { status: 400 }
      );
    }

    const account = await prisma.customerLoyaltyAccount.findUnique({
      where: { id: params.id },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Calculate expiration date if points are positive
    let expiresAt: Date | null = null;
    if (points > 0) {
      const days = expirationDays || 365;
      expiresAt = addDays(new Date(), days);
    }

    // Create transaction and update balances
    const result = await prisma.$transaction([
      // Create transaction
      prisma.loyaltyPointsTransaction.create({
        data: {
          accountId: params.id,
          type: 'MANUAL_ADJUSTMENT',
          points,
          description: `Admin adjustment: ${reason}`,
          expiresAt,
        },
      }),
      // Update balance
      prisma.customerLoyaltyAccount.update({
        where: { id: params.id },
        data: {
          pointsBalance: {
            increment: points,
          },
          lifetimePoints: points > 0 ? { increment: points } : undefined,
          lastActivityAt: new Date(),
        },
      }),
    ]);

    // Check for tier upgrade if points were added
    if (points > 0) {
      const { checkTierUpgrade } = await import('@/lib/loyalty/tier-manager');
      await checkTierUpgrade(params.id);
    }

    return NextResponse.json({
      success: true,
      transaction: result[0],
      account: result[1],
    });
  } catch (error: any) {
    console.error('Error adjusting loyalty points:', error);
    return NextResponse.json(
      { error: 'Failed to adjust loyalty points', details: error.message },
      { status: 500 }
    );
  }
}
