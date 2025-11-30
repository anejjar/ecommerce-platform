import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isFeatureEnabled } from '@/lib/features';

/**
 * GET /api/admin/themes/export/[id]
 * Export a theme as JSON
 */
export async function GET(
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

    // Return theme config as JSON
    return NextResponse.json(theme.themeConfig, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${theme.name}-theme.json"`,
      },
    });
  } catch (error) {
    console.error('Error exporting theme:', error);
    return NextResponse.json(
      { error: 'Failed to export theme' },
      { status: 500 }
    );
  }
}

