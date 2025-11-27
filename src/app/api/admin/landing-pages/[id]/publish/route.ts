import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { PageStatus } from '@prisma/client';

// Validation schema for publish request
const publishSchema = z.object({
    scheduledPublishAt: z.string().datetime().optional(),
});

// POST /api/admin/landing-pages/:id/publish - Publish landing page
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'MANAGER', 'SUPERADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Validate request body
        const validationResult = publishSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validationResult.error.issues },
                { status: 400 }
            );
        }

        // Check if page exists
        const page = await prisma.landingPage.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { blocks: true },
                },
            },
        });

        if (!page) {
            return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
        }

        // Check if page has blocks
        if (page._count.blocks === 0) {
            return NextResponse.json(
                { error: 'Cannot publish empty page. Add at least one block first.' },
                { status: 400 }
            );
        }

        const { scheduledPublishAt } = validationResult.data;

        // Update page status
        const updated = await prisma.landingPage.update({
            where: { id },
            data: {
                status: scheduledPublishAt ? PageStatus.SCHEDULED : PageStatus.PUBLISHED,
                publishedAt: scheduledPublishAt ? null : new Date(),
                scheduledPublishAt: scheduledPublishAt ? new Date(scheduledPublishAt) : null,
            },
            select: {
                id: true,
                status: true,
                publishedAt: true,
                scheduledPublishAt: true,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error publishing landing page:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
