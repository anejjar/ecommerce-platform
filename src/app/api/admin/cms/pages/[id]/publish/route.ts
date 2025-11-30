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

// POST /api/admin/cms/pages/:id/publish - Publish page
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
        const page = await prisma.page.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { blocks: true },
                },
            },
        });

        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        // Check if page has content (either blocks or rich text)
        if (page.useBlockEditor && page._count.blocks === 0 && !page.content) {
            return NextResponse.json(
                { error: 'Cannot publish empty page. Add content or blocks first.' },
                { status: 400 }
            );
        }

        if (!page.useBlockEditor && !page.content) {
            return NextResponse.json(
                { error: 'Cannot publish empty page. Add content first.' },
                { status: 400 }
            );
        }

        const { scheduledPublishAt } = validationResult.data;

        // Update page status
        const updated = await prisma.page.update({
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
        console.error('Error publishing page:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

