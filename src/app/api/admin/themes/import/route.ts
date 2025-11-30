import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { validateThemeJSON, validateThemeConfig } from '@/lib/themes/theme-validator';
import { loadThemeFromJSONString } from '@/lib/themes/theme-loader';
import { isFeatureEnabled } from '@/lib/features';

/**
 * POST /api/admin/themes/import
 * Import a theme from JSON
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

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file content
    const fileContent = await file.text();

    // Validate JSON
    const validation = validateThemeJSON(fileContent);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Invalid theme file',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    // Load theme
    const loadedTheme = loadThemeFromJSONString(fileContent);

    // Check if theme with this name already exists
    const existing = await prisma.theme.findUnique({
      where: { name: loadedTheme.name },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Theme with name "${loadedTheme.name}" already exists` },
        { status: 409 }
      );
    }

    // Create theme in database
    const theme = await prisma.theme.create({
      data: {
        name: loadedTheme.name,
        displayName: loadedTheme.displayName,
        description: loadedTheme.description,
        version: loadedTheme.version,
        author: loadedTheme.author,
        previewImage: loadedTheme.previewImage,
        isBuiltIn: false,
        isActive: false,
        themeConfig: loadedTheme.config,
      },
    });

    return NextResponse.json(
      { theme, message: 'Theme imported successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error importing theme:', error);
    return NextResponse.json(
      {
        error: 'Failed to import theme',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

