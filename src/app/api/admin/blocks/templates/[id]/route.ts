import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { BlockCategory } from '@prisma/client';

// Validation schema for updating block templates
const updateBlockTemplateSchema = z.object({
    name: z.string().min(3).max(100).optional(),
    slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
    description: z.string().optional().nullable(),
    category: z.nativeEnum(BlockCategory).optional(),
    thumbnail: z.string().url().optional().nullable(),
    previewUrl: z.string().url().optional().nullable(),
    defaultConfig: z.record(z.string(), z.any()).optional(),
    configSchema: z.record(z.string(), z.any()).optional(),
    componentCode: z.string().min(1).optional(),
    htmlTemplate: z.string().optional().nullable(),
    cssStyles: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
    isPro: z.boolean().optional(),
});

// GET /api/admin/blocks/templates/:id - Get single block template
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

        const template = await prisma.blockTemplate.findUnique({
            where: { id },
        });

        if (!template) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        return NextResponse.json(template);
    } catch (error) {
        console.error('Error fetching block template:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/admin/blocks/templates/:id - Update block template
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'MANAGER', 'SUPERADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        // Validate request body
        const validationResult = updateBlockTemplateSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validationResult.error.issues },
                { status: 400 }
            );
        }

        // Check if template exists
        const existing = await prisma.blockTemplate.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        // Prevent updating system templates unless SUPERADMIN
        if (existing.isSystem && session.user.role !== 'SUPERADMIN') {
            return NextResponse.json(
                { error: 'Cannot update system templates' },
                { status: 403 }
            );
        }

        const data = validationResult.data;

        // If slug is being changed, check for conflicts
        if (data.slug && data.slug !== existing.slug) {
            const slugExists = await prisma.blockTemplate.findUnique({
                where: { slug: data.slug },
            });

            if (slugExists) {
                return NextResponse.json(
                    { error: 'A template with this slug already exists' },
                    { status: 409 }
                );
            }
        }

        // Update template
        const template = await prisma.blockTemplate.update({
            where: { id },
            data,
        });

        return NextResponse.json(template);
    } catch (error) {
        console.error('Error updating block template:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/admin/blocks/templates/:id - Delete block template
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Check if template exists
        const template = await prisma.blockTemplate.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { instances: true },
                },
            },
        });

        if (!template) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        // Prevent deleting system templates
        if (template.isSystem) {
            return NextResponse.json(
                { error: 'Cannot delete system templates' },
                { status: 403 }
            );
        }

        // Prevent deleting templates that are in use
        if (template._count.instances > 0) {
            return NextResponse.json(
                { error: `Cannot delete template. It is used in ${template._count.instances} block(s)` },
                { status: 409 }
            );
        }

        // Delete template
        await prisma.blockTemplate.delete({
            where: { id },
        });

        return NextResponse.json({
            message: 'Template deleted successfully',
            deletedId: id,
        });
    } catch (error) {
        console.error('Error deleting block template:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
