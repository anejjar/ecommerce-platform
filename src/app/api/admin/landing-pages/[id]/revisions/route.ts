import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity-log';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const revisions = await prisma.landingPageRevision.findMany({
            where: { pageId: id },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ revisions });
    } catch (error: any) {
        console.error('Error fetching revisions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch revisions' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { note } = body;

        // Get current page data
        const page = await prisma.landingPage.findUnique({
            where: { id },
            include: {
                blocks: {
                    include: {
                        template: true,
                    },
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        });

        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        // Get latest revision number
        const latestRevision = await prisma.landingPageRevision.findFirst({
            where: { pageId: id },
            orderBy: { revisionNumber: 'desc' },
            select: { revisionNumber: true },
        });

        const revisionNumber = (latestRevision?.revisionNumber || 0) + 1;

        // Create revision snapshot
        const revision = await prisma.landingPageRevision.create({
            data: {
                pageId: id,
                title: page.title,
                slug: page.slug,
                description: page.description,
                seoTitle: page.seoTitle,
                seoDescription: page.seoDescription,
                seoKeywords: page.seoKeywords,
                ogImage: page.ogImage,
                ogTitle: page.ogTitle,
                ogDescription: page.ogDescription,
                status: page.status,
                layoutConfig: page.layoutConfig,
                customCss: page.customCss,
                customJs: page.customJs,
                blocksSnapshot: page.blocks.map(block => ({
                    id: block.id,
                    templateId: block.templateId,
                    config: block.config,
                    order: block.order,
                })),
                revisionNumber,
                note: note || null,
                createdById: session.user.id,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        await logActivity({
            userId: session.user.id,
            action: 'CREATE',
            entityType: 'LANDING_PAGE_REVISION',
            entityId: revision.id,
            details: `Created revision #${revisionNumber} for page "${page.title}"`,
        });

        return NextResponse.json({ revision }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating revision:', error);
        return NextResponse.json(
            { error: 'Failed to create revision' },
            { status: 500 }
        );
    }
}

