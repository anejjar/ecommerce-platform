import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for creating content blocks
const createBlockSchema = z.object({
    templateId: z.string(),
    pageId: z.string().optional(),
    postId: z.string().optional(),
    landingPageId: z.string().optional(), // Deprecated: kept for backward compatibility, will be converted to pageId
    config: z.record(z.string(), z.any()),
    customCss: z.string().optional().nullable(),
    customClasses: z.string().optional().nullable(),
    order: z.number().int().min(0).optional(),
    isVisible: z.boolean().optional(),
    hideOnMobile: z.boolean().optional(),
    hideOnTablet: z.boolean().optional(),
    hideOnDesktop: z.boolean().optional(),
}).refine(
    (data) => !!(data.pageId || data.postId || data.landingPageId),
    { message: 'One of pageId, postId, or landingPageId is required' }
);

// GET /api/admin/blocks - List content blocks
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'MANAGER', 'SUPERADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);

        // Parse query parameters
        const pageId = searchParams.get('pageId');
        const postId = searchParams.get('postId');
        const landingPageId = searchParams.get('landingPageId'); // Deprecated: kept for backward compatibility
        const templateId = searchParams.get('templateId');
        const isVisible = searchParams.get('isVisible') === 'true' ? true : searchParams.get('isVisible') === 'false' ? false : undefined;

        // Build where clause
        const where: any = {};
        if (pageId) where.pageId = pageId;
        if (postId) where.postId = postId;
        // Convert deprecated landingPageId to pageId
        if (landingPageId) where.pageId = landingPageId;
        if (templateId) where.templateId = templateId;
        if (isVisible !== undefined) where.isVisible = isVisible;

        // Get blocks
        const blocks = await prisma.contentBlock.findMany({
            where,
            include: {
                template: {
                    select: {
                        id: true,
                        name: true,
                        category: true,
                        thumbnail: true,
                    },
                },
            },
            orderBy: { order: 'asc' },
        });

        return NextResponse.json({ blocks });
    } catch (error) {
        console.error('Error fetching content blocks:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/admin/blocks - Create content block
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'MANAGER', 'SUPERADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Validate request body
        const validationResult = createBlockSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validationResult.error.issues },
                { status: 400 }
            );
        }

        const data = validationResult.data;

        // Convert deprecated landingPageId to pageId for backward compatibility
        const pageId = data.pageId || data.landingPageId;

        // Verify template exists
        const template = await prisma.blockTemplate.findUnique({
            where: { id: data.templateId },
        });

        if (!template) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        // TODO: Validate config against template's configSchema

        // Determine order if not provided
        let order = data.order;
        if (order === undefined) {
            const maxOrder = await prisma.contentBlock.aggregate({
                where: {
                    pageId: pageId,
                    postId: data.postId,
                },
                _max: { order: true },
            });
            order = (maxOrder._max.order ?? -1) + 1;
        }

        // Create block
        const block = await prisma.contentBlock.create({
            data: {
                templateId: data.templateId,
                pageId: pageId,
                postId: data.postId,
                config: data.config,
                customCss: data.customCss,
                customClasses: data.customClasses,
                order,
                isVisible: data.isVisible ?? true,
                hideOnMobile: data.hideOnMobile ?? false,
                hideOnTablet: data.hideOnTablet ?? false,
                hideOnDesktop: data.hideOnDesktop ?? false,
            },
            include: {
                template: {
                    select: {
                        id: true,
                        name: true,
                        category: true,
                        thumbnail: true,
                    },
                },
            },
        });

        return NextResponse.json(block, { status: 201 });
    } catch (error) {
        console.error('Error creating content block:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
