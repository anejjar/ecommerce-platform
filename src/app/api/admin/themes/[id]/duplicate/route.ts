import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { validateThemeConfig } from '@/lib/themes/theme-validator';
import { isFeatureEnabled } from '@/lib/features';

/**
 * POST /api/admin/themes/[id]/duplicate
 * Duplicate a theme as a custom (non-built-in) theme
 */
export async function POST(
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
    const body = await request.json().catch(() => ({}));
    const { displayName, activate = true } = body;

    // Get the original theme
    const original = await prisma.theme.findUnique({
      where: { id },
    });

    if (!original) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    // Generate a unique name for the duplicate
    const baseName = original.name.replace(/-\d+$/, ''); // Remove any existing suffix
    let newName = `${baseName}-custom`;
    let counter = 1;

    // Ensure unique name
    while (await prisma.theme.findUnique({ where: { name: newName } })) {
      newName = `${baseName}-custom-${counter}`;
      counter++;
    }

    // Create the duplicate theme config
    const themeConfig = original.themeConfig as any;
    
    // Update metadata in the config
    const updatedConfig = {
      ...themeConfig,
      metadata: {
        ...themeConfig.metadata,
        name: newName,
        displayName: displayName || `${original.displayName} (Custom)`,
        version: '1.0.0',
      },
    };

    // Validate the config
    const validation = validateThemeConfig(updatedConfig);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Invalid theme configuration',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    // Deactivate all themes if we're activating the new one
    if (activate) {
      await prisma.theme.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    // Create the duplicate theme
    const duplicate = await prisma.theme.create({
      data: {
        name: newName,
        displayName: displayName || `${original.displayName} (Custom)`,
        description: original.description ? `${original.description} (Custom copy)` : null,
        version: '1.0.0',
        author: session.user.name || session.user.email || null,
        previewImage: original.previewImage,
        isBuiltIn: false, // Always create as custom theme
        isActive: activate,
        themeConfig: updatedConfig,
      },
    });

    return NextResponse.json({ theme: duplicate }, { status: 201 });
  } catch (error) {
    console.error('Error duplicating theme:', error);
    return NextResponse.json(
      { error: 'Failed to duplicate theme' },
      { status: 500 }
    );
  }
}

