import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/popups
 * List all popups
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const popups = await prisma.popup.findMany({
      include: {
        _count: {
          select: {
            analytics: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(popups);
  } catch (error) {
    console.error('Error fetching popups:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/popups
 * Create new popup
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.content) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      );
    }

    // Create popup
    const popup = await prisma.popup.create({
      data: {
        name: body.name,
        title: body.title || null,
        content: body.content,
        type: body.type || 'EXIT_INTENT',
        triggerValue: body.triggerValue || null,
        target: body.target || 'ALL_PAGES',
        customUrls: body.customUrls || null,
        position: body.position || 'CENTER',
        width: body.width || 500,
        height: body.height || null,
        backgroundColor: body.backgroundColor || '#ffffff',
        textColor: body.textColor || '#000000',
        buttonText: body.buttonText || 'Get Offer',
        buttonColor: body.buttonColor || '#000000',
        buttonTextColor: body.buttonTextColor || '#ffffff',
        showCloseButton: body.showCloseButton !== undefined ? body.showCloseButton : true,
        overlayColor: body.overlayColor || 'rgba(0,0,0,0.5)',
        imageUrl: body.imageUrl || null,
        frequency: body.frequency || 'once_per_session',
        delaySeconds: body.delaySeconds || 0,
        ctaType: body.ctaType || 'link',
        ctaUrl: body.ctaUrl || null,
        discountCode: body.discountCode || null,
        isActive: body.isActive || false,
        startDate: body.startDate || null,
        endDate: body.endDate || null,
        priority: body.priority || 0,
      },
    });

    return NextResponse.json(popup, { status: 201 });
  } catch (error) {
    console.error('Error creating popup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
