import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/loyalty/tiers
 * Get all loyalty tiers with account counts
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tiers = await prisma.loyaltyTier.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: {
            accounts: true,
          },
        },
      },
    });

    return NextResponse.json({ tiers });
  } catch (error: any) {
    console.error('Error fetching loyalty tiers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loyalty tiers', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/loyalty/tiers
 * Create a new loyalty tier
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      pointsRequired,
      color,
      icon,
      benefitsDescription,
      earlyAccessEnabled,
      earlyAccessHours,
      discountPercentage,
      pointsMultiplier,
      freeShippingThreshold,
      displayOrder,
    } = body;

    // Validation
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (typeof pointsRequired !== 'number' || pointsRequired < 0) {
      return NextResponse.json(
        { error: 'Points required must be a non-negative number' },
        { status: 400 }
      );
    }

    // Check if tier name already exists
    const existing = await prisma.loyaltyTier.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Tier with this name already exists' },
        { status: 400 }
      );
    }

    const tier = await prisma.loyaltyTier.create({
      data: {
        name,
        pointsRequired,
        color: color || '#000000',
        icon,
        benefitsDescription: benefitsDescription || '',
        earlyAccessEnabled: earlyAccessEnabled || false,
        earlyAccessHours: earlyAccessHours || 24,
        discountPercentage: discountPercentage || 0,
        pointsMultiplier: pointsMultiplier || 1.0,
        freeShippingThreshold,
        displayOrder: displayOrder || 0,
      },
    });

    return NextResponse.json({ tier }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating loyalty tier:', error);
    return NextResponse.json(
      { error: 'Failed to create loyalty tier', details: error.message },
      { status: 500 }
    );
  }
}
