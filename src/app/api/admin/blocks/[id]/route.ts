import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for updating content blocks
const updateBlockSchema = z.object({
    config: z.record(z.string(), z.any()).optional(),
    customCss: z.string().optional().nullable(),
    customClasses: z.string().optional().nullable(),
    order: z.number().int().min(0).optional(),
    isVisible: z.boolean().optional(),
    hideOnMobile: z.boolean().optional(),
    hideOnTablet: z.boolean().optional(),
    hideOnDesktop: z.boolean().optional(),
});

// GET /api/admin/blocks/:id - Get single content block
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'MANAGER', 'SUPERADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const block = await prisma.contentBlock.findUnique({
            where: { id },
            include: {
                template: {
                    select: {
                        id: true,
                        name: true,
                        category: true,
                        thumbnail: true,
                        configSchema: true,
                    },
                },
            },
        });

        if (!block) {
            return NextResponse.json({ error: 'Block not found' }, { status: 404 });
        }

        return NextResponse.json(block);
    } catch (error) {
        console.error('Error fetching content block:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/admin/blocks/:id - Update content block
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'MANAGER', 'SUPERADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        // Validate request body
        const validationResult = updateBlockSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validationResult.error.issues },
                { status: 400 }
            );
        }

        // Check if block exists
        const existing = await prisma.contentBlock.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Block not found' }, { status: 404 });
        }

        // Update block
        const block = await prisma.contentBlock.update({
            where: { id },
            data: validationResult.data,
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

        return NextResponse.json(block);
    } catch (error) {
        console.error('Error updating content block:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/admin/blocks/:id - Delete content block
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'MANAGER', 'SUPERADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Check if block exists
        const block = await prisma.contentBlock.findUnique({
            where: { id },
        });

        if (!block) {
            return NextResponse.json({ error: 'Block not found' }, { status: 404 });
        }

        // Delete block
        await prisma.contentBlock.delete({
            where: { id },
        });

        return NextResponse.json({
            message: 'Block deleted successfully',
            deletedId: id,
        });
    } catch (error) {
        console.error('Error deleting content block:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
