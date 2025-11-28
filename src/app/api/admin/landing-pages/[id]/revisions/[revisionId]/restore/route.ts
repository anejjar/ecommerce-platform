import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity-log';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; revisionId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, revisionId } = await params;

        // Get revision
        const revision = await prisma.landingPageRevision.findUnique({
            where: { id: revisionId },
            include: {
                page: true,
            },
        });

        if (!revision) {
            return NextResponse.json({ error: 'Revision not found' }, { status: 404 });
        }

        if (revision.pageId !== id) {
            return NextResponse.json({ error: 'Revision does not belong to this page' }, { status: 400 });
        }

        // Restore page data
        const updatedPage = await prisma.landingPage.update({
            where: { id },
            data: {
                title: revision.title,
                slug: revision.slug,
                description: revision.description,
                seoTitle: revision.seoTitle,
                seoDescription: revision.seoDescription,
                seoKeywords: revision.seoKeywords,
                ogImage: revision.ogImage,
                ogTitle: revision.ogTitle,
                ogDescription: revision.ogDescription,
                status: revision.status,
                layoutConfig: revision.layoutConfig,
                customCss: revision.customCss,
                customJs: revision.customJs,
            },
        });

        // Restore blocks
        const blocksSnapshot = revision.blocksSnapshot as any[];
        
        // Delete existing blocks
        await prisma.contentBlock.deleteMany({
            where: {
                blockableType: 'LandingPage',
                blockableId: id,
            },
        });

        // Create blocks from snapshot
        if (blocksSnapshot && blocksSnapshot.length > 0) {
            await prisma.contentBlock.createMany({
                data: blocksSnapshot.map(block => ({
                    templateId: block.templateId,
                    config: block.config,
                    order: block.order,
                    blockableType: 'LandingPage',
                    blockableId: id,
                })),
            });
        }

        await logActivity({
            userId: session.user.id,
            action: 'RESTORE',
            entityType: 'LANDING_PAGE',
            entityId: id,
            details: `Restored page from revision #${revision.revisionNumber}`,
        });

        return NextResponse.json({
            message: 'Page restored successfully',
            page: updatedPage,
        });
    } catch (error: any) {
        console.error('Error restoring revision:', error);
        return NextResponse.json(
            { error: 'Failed to restore revision' },
            { status: 500 }
        );
    }
}

