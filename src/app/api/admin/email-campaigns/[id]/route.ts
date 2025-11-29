import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const campaignUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  subject: z.string().min(1).optional(),
  preheader: z.string().optional(),
  type: z.enum(['NEWSLETTER', 'PROMOTIONAL', 'TRANSACTIONAL', 'ANNOUNCEMENT', 'CUSTOM']).optional(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'PAUSED', 'CANCELLED']).optional(),
  htmlContent: z.string().optional(),
  textContent: z.string().optional(),
  scheduledAt: z.string().optional(),
  sendToAll: z.boolean().optional(),
  fromName: z.string().optional(),
  fromEmail: z.string().email().optional(),
  replyTo: z.string().email().optional(),
});

// GET - Fetch a single campaign
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

    const campaign = await prisma.emailCampaign.findUnique({
      where: { id },
      include: {
        recipients: {
          take: 100,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { recipients: true, analytics: true },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}

// PATCH - Update a campaign
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const body = await request.json();
    const validatedData = campaignUpdateSchema.parse(body);

    // Check if campaign exists and is not sent
    const existing = await prisma.emailCampaign.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (existing.status === 'SENT' || existing.status === 'SENDING') {
      return NextResponse.json(
        { error: 'Cannot update a campaign that is sent or sending' },
        { status: 400 }
      );
    }

    const updateData: any = { ...validatedData };
    if (validatedData.scheduledAt) {
      updateData.scheduledAt = new Date(validatedData.scheduledAt);
    }

    const campaign = await prisma.emailCampaign.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(campaign);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a campaign
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if campaign is sent or sending
    const campaign = await prisma.emailCampaign.findUnique({
      where: { id },
    });

    if (campaign?.status === 'SENT' || campaign?.status === 'SENDING') {
      return NextResponse.json(
        { error: 'Cannot delete a campaign that is sent or sending' },
        { status: 400 }
      );
    }

    await prisma.emailCampaign.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}
