import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for reorder request
const reorderSchema = z.object({
    pageId: z.string().optional(),
    postId: z.string().optional(),
    landingPageId: z.string().optional(),
    blockOrders: z.array(z.object({
        blockId: z.string(),
        order: z.number().int().min(0),
    })),
}).refine(
    (data) => !!(data.pageId || data.postId || data.landingPageId),
    { message: 'One of pageId, postId, or landingPageId is required' }
);

// POST /api/admin/blocks/reorder - Reorder blocks
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'MANAGER', 'SUPERADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Validate request body
        const validationResult = reorderSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validationResult.error.errors },
                { status: 400 }
            );
        }

        const { pageId, postId, landingPageId, blockOrders } = validationResult.data;

        // Update all blocks in a transaction
        const updates = await prisma.$transaction(
            blockOrders.map(({ blockId, order }) =>
                prisma.contentBlock.update({
                    where: { id: blockId },
                    data: { order },
                })
            )
        );

        return NextResponse.json({
            message: 'Blocks reordered successfully',
            updatedCount: updates.length,
        });
    } catch (error) {
        console.error('Error reordering blocks:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
