import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const campaignSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  preheader: z.string().optional(),
  type: z.enum(['NEWSLETTER', 'PROMOTIONAL', 'TRANSACTIONAL', 'ANNOUNCEMENT', 'CUSTOM']),
  htmlContent: z.string().min(1),
  textContent: z.string().optional(),
  templateId: z.string().optional(),
  scheduledAt: z.string().optional(),
  sendToAll: z.boolean().optional(),
  fromName: z.string().optional(),
  fromEmail: z.string().email().optional(),
  replyTo: z.string().email().optional(),
});

// GET - Fetch all campaigns
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const campaigns = await prisma.emailCampaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { recipients: true },
        },
      },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

// POST - Create a new campaign
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = campaignSchema.parse(body);

    const campaign = await prisma.emailCampaign.create({
      data: {
        name: validatedData.name,
        subject: validatedData.subject,
        preheader: validatedData.preheader,
        type: validatedData.type,
        htmlContent: validatedData.htmlContent,
        textContent: validatedData.textContent,
        templateId: validatedData.templateId,
        scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : null,
        sendToAll: validatedData.sendToAll ?? false,
        fromName: validatedData.fromName,
        fromEmail: validatedData.fromEmail,
        replyTo: validatedData.replyTo,
        createdById: session.user.id,
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
