import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const syncBlocksSchema = z.object({
    blocks: z.array(z.object({
        id: z.string().optional(), // Optional for new blocks
        templateId: z.string(),
        containerType: z.enum(['BLOCK', 'SECTION', 'FLEXBOX', 'GRID']).optional().default('BLOCK'),
        parentId: z.string().nullable().optional(),
        contentConfig: z.any(),
        styleConfig: z.any().optional(),
        advancedConfig: z.any().optional(),
        layoutSettings: z.any().optional(),
        order: z.number(),
        isVisible: z.boolean().optional().default(true),
        // Legacy config for backwards compatibility
        config: z.any().optional(),
    })),
});

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { blocks } = syncBlocksSchema.parse(body);

        // Verify page exists and user has access
        const page = await prisma.page.findUnique({
            where: { id },
            include: { blocks: true },
        });

        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        // Get existing block IDs
        const existingBlockIds = page.blocks.map(b => b.id);
        const incomingBlockIds = blocks.filter(b => b.id && !b.id.startsWith('temp-')).map(b => b.id!);

        // Validate all template IDs exist before proceeding
        const uniqueTemplateIds = [...new Set(blocks.map(b => b.templateId).filter(Boolean))];
        if (uniqueTemplateIds.length > 0) {
            const existingTemplates = await prisma.blockTemplate.findMany({
                where: {
                    id: { in: uniqueTemplateIds },
                },
                select: { id: true },
            });

            const existingTemplateIds = new Set(existingTemplates.map(t => t.id));
            const missingTemplateIds = uniqueTemplateIds.filter(id => !existingTemplateIds.has(id));

            if (missingTemplateIds.length > 0) {
                console.error('Missing template IDs:', missingTemplateIds);
                return NextResponse.json(
                    {
                        error: 'Invalid template IDs',
                        details: `The following template IDs do not exist: ${missingTemplateIds.join(', ')}`,
                        missingTemplateIds,
                    },
                    { status: 400 }
                );
            }
        }

        // Delete blocks that are no longer in the list
        const blocksToDelete = existingBlockIds.filter(id => !incomingBlockIds.includes(id));
        if (blocksToDelete.length > 0) {
            await prisma.contentBlock.deleteMany({
                where: {
                    id: { in: blocksToDelete },
                    pageId: id,
                },
            });
        }

        // Upsert blocks (create new or update existing)
        for (const block of blocks) {
            const isNewBlock = !block.id || block.id.startsWith('temp-');

            // Validate templateId
            if (!block.templateId) {
                console.error('Block missing templateId:', block);
                continue; // Skip this block
            }

            // Prepare block data
            const blockData = {
                templateId: block.templateId,
                containerType: block.containerType || 'BLOCK',
                parentId: block.parentId || null,
                contentConfig: block.contentConfig || block.config || {},
                styleConfig: block.styleConfig || {},
                advancedConfig: block.advancedConfig || {},
                layoutSettings: block.layoutSettings || null,
                order: block.order,
                isVisible: block.isVisible !== false,
                // Keep legacy config for backwards compatibility
                config: block.config || block.contentConfig || {},
            };

            try {
                if (isNewBlock) {
                    // Create new block
                    await prisma.contentBlock.create({
                        data: {
                            ...blockData,
                            pageId: id,
                        },
                    });
                } else {
                    // Update existing block
                    await prisma.contentBlock.update({
                        where: { id: block.id },
                        data: blockData,
                    });
                }
            } catch (blockError) {
                console.error('Error saving block:', {
                    blockId: block.id,
                    templateId: block.templateId,
                    error: blockError,
                });
                // Continue with other blocks instead of failing completely
            }
        }

        // Fetch updated page with blocks
        const updatedPage = await prisma.page.findUnique({
            where: { id },
            include: {
                blocks: {
                    include: { 
                        template: true, // Include full template data including configSchema
                    },
                    orderBy: { order: 'asc' },
                },
            },
        });

        return NextResponse.json({
            success: true,
            page: updatedPage,
        });
    } catch (error) {
        console.error('Error syncing blocks:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.issues },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to sync blocks' },
            { status: 500 }
        );
    }
}

