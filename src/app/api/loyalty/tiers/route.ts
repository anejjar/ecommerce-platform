import { NextRequest, NextResponse } from 'next/server';
import { getAllTiers } from '@/lib/loyalty/tier-manager';

export async function GET(request: NextRequest) {
  try {
    const tiers = await getAllTiers();

    return NextResponse.json({
      tiers: tiers.map((tier) => ({
        id: tier.id,
        name: tier.name,
        pointsRequired: tier.pointsRequired,
        color: tier.color,
        icon: tier.icon,
        benefitsDescription: tier.benefitsDescription,
        earlyAccessEnabled: tier.earlyAccessEnabled,
        earlyAccessHours: tier.earlyAccessHours,
        discountPercentage: Number(tier.discountPercentage),
        pointsMultiplier: Number(tier.pointsMultiplier),
        freeShippingThreshold: tier.freeShippingThreshold
          ? Number(tier.freeShippingThreshold)
          : null,
        displayOrder: tier.displayOrder,
      })),
    });
  } catch (error) {
    console.error('Get loyalty tiers error:', error);
    return NextResponse.json(
      { error: 'Failed to get loyalty tiers' },
      { status: 500 }
    );
  }
}
