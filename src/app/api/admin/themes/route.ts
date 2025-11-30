import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { validateThemeConfig } from '@/lib/themes/theme-validator';
import { isFeatureEnabled } from '@/lib/features';

/**
 * GET /api/admin/themes
 * List all themes
 */
export async function GET(request: NextRequest) {
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

    const themes = await prisma.theme.findMany({
      orderBy: [
        { isActive: 'desc' },
        { isBuiltIn: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ themes });
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch themes' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/themes
 * Create a new theme
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { name, displayName, description, themeConfig, previewImage, author } = body;

    if (!name || !displayName || !themeConfig) {
      return NextResponse.json(
        { error: 'Name, displayName, and themeConfig are required' },
        { status: 400 }
      );
    }

    // Validate theme config
    const validation = validateThemeConfig(themeConfig);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Invalid theme configuration',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    // Check if name already exists
    const existing = await prisma.theme.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Theme with this name already exists' },
        { status: 409 }
      );
    }

    const theme = await prisma.theme.create({
      data: {
        name,
        displayName,
        description,
        themeConfig,
        previewImage,
        author,
        isBuiltIn: false,
        isActive: false,
        version: themeConfig.metadata?.version || '1.0.0',
      },
    });

    return NextResponse.json({ theme }, { status: 201 });
  } catch (error) {
    console.error('Error creating theme:', error);
    return NextResponse.json(
      { error: 'Failed to create theme' },
      { status: 500 }
    );
  }
}

