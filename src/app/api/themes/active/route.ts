import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/themes/active
 * Get the currently active theme (public API)
 */
export async function GET() {
  try {
    const activeTheme = await prisma.theme.findFirst({
      where: {
        isActive: true,
      },
    });

    if (!activeTheme) {
      return NextResponse.json({
        theme: null,
        message: 'No active theme found',
      });
    }

    return NextResponse.json({
      theme: activeTheme.themeConfig,
      id: activeTheme.id,
      name: activeTheme.name,
      displayName: activeTheme.displayName,
    });
  } catch (error) {
    console.error('Error fetching active theme:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active theme' },
      { status: 500 }
    );
  }
}

