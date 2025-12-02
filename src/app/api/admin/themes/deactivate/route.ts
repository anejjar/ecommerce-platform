import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isFeatureEnabled } from '@/lib/features';

/**
 * PATCH /api/admin/themes/deactivate
 * Deactivate all themes (sets isActive to false for all themes)
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check feature flag
    const featureEnabled = await isFeatureEnabled('storefront_themes');
    if (!featureEnabled) {
      return NextResponse.json(
        { error: 'Themes feature is not enabled' },
        { status: 403 }
      );
    }

    // Deactivate all themes
    await prisma.theme.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: 'All themes deactivated' });
  } catch (error) {
    console.error('Error deactivating themes:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate themes' },
      { status: 500 }
    );
  }
}

