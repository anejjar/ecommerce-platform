import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/popups/[id]
 * Get single popup
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const popup = await prisma.popup.findUnique({
      where: { id },
      include: {
        analytics: {
          orderBy: {
            date: 'desc',
          },
          take: 30, // Last 30 days
        },
      },
    });

    if (!popup) {
      return NextResponse.json({ error: 'Popup not found' }, { status: 404 });
    }

    return NextResponse.json(popup);
  } catch (error) {
    console.error('Error fetching popup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/popups/[id]
 * Update popup
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Check if popup exists
    const existingPopup = await prisma.popup.findUnique({
      where: { id },
    });

    if (!existingPopup) {
      return NextResponse.json({ error: 'Popup not found' }, { status: 404 });
    }

    // Build update data
    const updateData: any = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.triggerValue !== undefined) updateData.triggerValue = body.triggerValue;
    if (body.target !== undefined) updateData.target = body.target;
    if (body.customUrls !== undefined) updateData.customUrls = body.customUrls;
    if (body.position !== undefined) updateData.position = body.position;
    if (body.width !== undefined) updateData.width = body.width;
    if (body.height !== undefined) updateData.height = body.height;
    if (body.backgroundColor !== undefined) updateData.backgroundColor = body.backgroundColor;
    if (body.textColor !== undefined) updateData.textColor = body.textColor;
    if (body.buttonText !== undefined) updateData.buttonText = body.buttonText;
    if (body.buttonColor !== undefined) updateData.buttonColor = body.buttonColor;
    if (body.buttonTextColor !== undefined) updateData.buttonTextColor = body.buttonTextColor;
    if (body.showCloseButton !== undefined) updateData.showCloseButton = body.showCloseButton;
    if (body.overlayColor !== undefined) updateData.overlayColor = body.overlayColor;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.frequency !== undefined) updateData.frequency = body.frequency;
    if (body.delaySeconds !== undefined) updateData.delaySeconds = body.delaySeconds;
    if (body.ctaType !== undefined) updateData.ctaType = body.ctaType;
    if (body.ctaUrl !== undefined) updateData.ctaUrl = body.ctaUrl;
    if (body.discountCode !== undefined) updateData.discountCode = body.discountCode;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.startDate !== undefined) updateData.startDate = body.startDate;
    if (body.endDate !== undefined) updateData.endDate = body.endDate;
    if (body.priority !== undefined) updateData.priority = body.priority;

    // Update popup
    const popup = await prisma.popup.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(popup);
  } catch (error) {
    console.error('Error updating popup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/popups/[id]
 * Delete popup
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if popup exists
    const popup = await prisma.popup.findUnique({
      where: { id },
    });

    if (!popup) {
      return NextResponse.json({ error: 'Popup not found' }, { status: 404 });
    }

    // Delete popup (will cascade delete analytics)
    await prisma.popup.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Popup deleted successfully' });
  } catch (error) {
    console.error('Error deleting popup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
