import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PageStatus } from '@prisma/client';

// POST /api/admin/landing-pages/:id/unpublish - Unpublish landing page
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

        // Check if page exists
        const page = await prisma.page.findUnique({
            where: { id },
        });

        if (!page) {
            return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
        }

        // Update page status to DRAFT
        const updated = await prisma.page.update({
            where: { id },
            data: {
                status: PageStatus.DRAFT,
                publishedAt: null,
                scheduledPublishAt: null,
            },
            select: {
                id: true,
                status: true,
                publishedAt: true,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error unpublishing landing page:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
