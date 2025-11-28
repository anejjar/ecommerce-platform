import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const syncBlocksSchema = z.object({
    blocks: z.array(z.object({
        id: z.string().optional(), // Optional for new blocks
        templateId: z.string(),
        config: z.any(),
        order: z.number(),
    })),
});

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { blocks } = syncBlocksSchema.parse(body);

        // Verify page exists and user has access
        const page = await prisma.landingPage.findUnique({
            where: { id },
            include: { blocks: true },
        });

        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        // Get existing block IDs
        const existingBlockIds = page.blocks.map(b => b.id);
        const incomingBlockIds = blocks.filter(b => b.id && !b.id.startsWith('temp-')).map(b => b.id!);

        // Delete blocks that are no longer in the list
        const blocksToDelete = existingBlockIds.filter(id => !incomingBlockIds.includes(id));
        if (blocksToDelete.length > 0) {
            await prisma.contentBlock.deleteMany({
                where: {
                    id: { in: blocksToDelete },
                    landingPageId: id,
                },
            });
        }

        // Upsert blocks (create new or update existing)
        for (const block of blocks) {
            const isNewBlock = !block.id || block.id.startsWith('temp-');

            if (isNewBlock) {
                // Create new block
                await prisma.contentBlock.create({
                    data: {
                        templateId: block.templateId,
                        config: block.config,
                        order: block.order,
                        landingPageId: id,
                    },
                });
            } else {
                // Update existing block
                await prisma.contentBlock.update({
                    where: { id: block.id },
                    data: {
                        config: block.config,
                        order: block.order,
                    },
                });
            }
        }

        // Fetch updated page with blocks
        const updatedPage = await prisma.landingPage.findUnique({
            where: { id },
            include: {
                blocks: {
                    include: { template: true },
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
                { error: 'Invalid request data', details: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to sync blocks' },
            { status: 500 }
        );
    }
}
