import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isFeatureEnabled } from '@/lib/features';

/**
 * PATCH /api/admin/themes/[id]/activate
 * Activate a theme (sets isActive to true and deactivates others)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const theme = await prisma.theme.findUnique({
      where: { id },
    });

    if (!theme) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    // Deactivate all themes
    await prisma.theme.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Activate the selected theme
    const activated = await prisma.theme.update({
      where: { id },
      data: { isActive: true },
    });

    return NextResponse.json({ theme: activated });
  } catch (error) {
    console.error('Error activating theme:', error);
    return NextResponse.json(
      { error: 'Failed to activate theme' },
      { status: 500 }
    );
  }
}

