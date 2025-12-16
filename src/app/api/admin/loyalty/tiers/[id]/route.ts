import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/loyalty/tiers/[id]
 * Get single tier details
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

    const tier = await prisma.loyaltyTier.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            accounts: true,
          },
        },
      },
    });

    if (!tier) {
      return NextResponse.json({ error: 'Tier not found' }, { status: 404 });
    }

    return NextResponse.json({ tier });
  } catch (error: any) {
    console.error('Error fetching loyalty tier:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loyalty tier', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/loyalty/tiers/[id]
 * Update a loyalty tier
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

    // Check if tier exists
    const existing = await prisma.loyaltyTier.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Tier not found' }, { status: 404 });
    }

    // If name is being changed, check for duplicates
    if (body.name && body.name !== existing.name) {
      const duplicate = await prisma.loyaltyTier.findUnique({
        where: { name: body.name },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: 'Tier with this name already exists' },
          { status: 400 }
        );
      }
    }

    const tier = await prisma.loyaltyTier.update({
      where: { id: params.id },
      data: {
        name: body.name,
        pointsRequired: body.pointsRequired,
        color: body.color,
        icon: body.icon,
        benefitsDescription: body.benefitsDescription,
        earlyAccessEnabled: body.earlyAccessEnabled,
        earlyAccessHours: body.earlyAccessHours,
        discountPercentage: body.discountPercentage,
        pointsMultiplier: body.pointsMultiplier,
        freeShippingThreshold: body.freeShippingThreshold,
        displayOrder: body.displayOrder,
      },
    });

    // If points required changed, trigger tier recalculation
    if (body.pointsRequired && body.pointsRequired !== existing.pointsRequired) {
      // This could be done asynchronously in production
      const accounts = await prisma.customerLoyaltyAccount.findMany({
        where: { tierId: params.id },
      });

      const { checkTierUpgrade } = await import('@/lib/loyalty/tier-manager');
      for (const account of accounts) {
        await checkTierUpgrade(account.id);
      }
    }

    return NextResponse.json({ tier });
  } catch (error: any) {
    console.error('Error updating loyalty tier:', error);
    return NextResponse.json(
      { error: 'Failed to update loyalty tier', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/loyalty/tiers/[id]
 * Delete a loyalty tier
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if tier has any accounts
    const accountCount = await prisma.customerLoyaltyAccount.count({
      where: { tierId: params.id },
    });

    if (accountCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete tier with ${accountCount} active accounts` },
        { status: 400 }
      );
    }

    await prisma.loyaltyTier.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting loyalty tier:', error);
    return NextResponse.json(
      { error: 'Failed to delete loyalty tier', details: error.message },
      { status: 500 }
    );
  }
}
