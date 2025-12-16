import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get loyalty settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.loyaltySettings.findFirst();

    if (!settings) {
      return NextResponse.json(
        { error: 'Loyalty settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: settings.id,
      pointsPerDollar: Number(settings.pointsPerDollar),
      pointsPerReview: settings.pointsPerReview,
      pointsPerReferral: settings.pointsPerReferral,
      pointsPerSocialShare: settings.pointsPerSocialShare,
      redemptionRate: settings.redemptionRate,
      pointsExpirationDays: settings.pointsExpirationDays,
      enableEmailNotifications: settings.enableEmailNotifications,
      minimumRedemptionPoints: settings.minimumRedemptionPoints,
      updatedAt: settings.updatedAt,
    });
  } catch (error) {
    console.error('Get loyalty settings error:', error);
    return NextResponse.json(
      { error: 'Failed to get loyalty settings' },
      { status: 500 }
    );
  }
}

// Update loyalty settings
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      pointsPerDollar,
      pointsPerReview,
      pointsPerReferral,
      pointsPerSocialShare,
      redemptionRate,
      pointsExpirationDays,
      enableEmailNotifications,
      minimumRedemptionPoints,
    } = body;

    // Validation
    if (pointsPerDollar !== undefined && pointsPerDollar < 0) {
      return NextResponse.json(
        { error: 'Points per dollar must be positive' },
        { status: 400 }
      );
    }

    if (redemptionRate !== undefined && redemptionRate <= 0) {
      return NextResponse.json(
        { error: 'Redemption rate must be greater than 0' },
        { status: 400 }
      );
    }

    if (pointsExpirationDays !== undefined && pointsExpirationDays < 1) {
      return NextResponse.json(
        { error: 'Points expiration days must be at least 1' },
        { status: 400 }
      );
    }

    // Get existing settings
    const existingSettings = await prisma.loyaltySettings.findFirst();

    if (!existingSettings) {
      return NextResponse.json(
        { error: 'Loyalty settings not found' },
        { status: 404 }
      );
    }

    // Update settings
    const updated = await prisma.loyaltySettings.update({
      where: { id: existingSettings.id },
      data: {
        ...(pointsPerDollar !== undefined && { pointsPerDollar }),
        ...(pointsPerReview !== undefined && { pointsPerReview }),
        ...(pointsPerReferral !== undefined && { pointsPerReferral }),
        ...(pointsPerSocialShare !== undefined && { pointsPerSocialShare }),
        ...(redemptionRate !== undefined && { redemptionRate }),
        ...(pointsExpirationDays !== undefined && { pointsExpirationDays }),
        ...(enableEmailNotifications !== undefined && { enableEmailNotifications }),
        ...(minimumRedemptionPoints !== undefined && { minimumRedemptionPoints }),
      },
    });

    return NextResponse.json({
      message: 'Loyalty settings updated successfully',
      settings: {
        id: updated.id,
        pointsPerDollar: Number(updated.pointsPerDollar),
        pointsPerReview: updated.pointsPerReview,
        pointsPerReferral: updated.pointsPerReferral,
        pointsPerSocialShare: updated.pointsPerSocialShare,
        redemptionRate: updated.redemptionRate,
        pointsExpirationDays: updated.pointsExpirationDays,
        enableEmailNotifications: updated.enableEmailNotifications,
        minimumRedemptionPoints: updated.minimumRedemptionPoints,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update loyalty settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update loyalty settings' },
      { status: 500 }
    );
  }
}
