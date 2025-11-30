import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { validateThemeConfig } from '@/lib/themes/theme-validator';
import { isFeatureEnabled } from '@/lib/features';

/**
 * GET /api/admin/themes/[id]
 * Get a specific theme
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

    return NextResponse.json({ theme });
  } catch (error) {
    console.error('Error fetching theme:', error);
    return NextResponse.json(
      { error: 'Failed to fetch theme' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/themes/[id]
 * Update a theme
 */
export async function PUT(
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
    const body = await request.json();

    const existing = await prisma.theme.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    // Don't allow editing built-in themes
    if (existing.isBuiltIn) {
      return NextResponse.json(
        { error: 'Cannot edit built-in themes' },
        { status: 403 }
      );
    }

    // Validate theme config if provided
    if (body.themeConfig) {
      const validation = validateThemeConfig(body.themeConfig);
      if (!validation.valid) {
        return NextResponse.json(
          {
            error: 'Invalid theme configuration',
            details: validation.errors,
          },
          { status: 400 }
        );
      }
    }

    // Check name uniqueness if name is being changed
    if (body.name && body.name !== existing.name) {
      const nameExists = await prisma.theme.findUnique({
        where: { name: body.name },
      });

      if (nameExists) {
        return NextResponse.json(
          { error: 'Theme with this name already exists' },
          { status: 409 }
        );
      }
    }

    const theme = await prisma.theme.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ theme });
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json(
      { error: 'Failed to update theme' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/themes/[id]
 * Delete a theme
 */
export async function DELETE(
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

    const existing = await prisma.theme.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    // Don't allow deleting built-in themes
    if (existing.isBuiltIn) {
      return NextResponse.json(
        { error: 'Cannot delete built-in themes' },
        { status: 403 }
      );
    }

    // Don't allow deleting active theme
    if (existing.isActive) {
      return NextResponse.json(
        { error: 'Cannot delete active theme. Please activate another theme first.' },
        { status: 400 }
      );
    }

    await prisma.theme.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting theme:', error);
    return NextResponse.json(
      { error: 'Failed to delete theme' },
      { status: 500 }
    );
  }
}

