import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { PageStatus } from '@prisma/client';

// Validation schema for updating landing pages
const updateLandingPageSchema = z.object({
    title: z.string().min(3).max(200).optional(),
    slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
    description: z.string().optional().nullable(),
    seoTitle: z.string().optional().nullable(),
    seoDescription: z.string().optional().nullable(),
    seoKeywords: z.string().optional().nullable(),
    ogImage: z.string().url().optional().nullable(),
    ogTitle: z.string().optional().nullable(),
    ogDescription: z.string().optional().nullable(),
    status: z.nativeEnum(PageStatus).optional(),
    layoutConfig: z.record(z.string(), z.any()).optional().nullable(),
    customCss: z.string().optional().nullable(),
    customJs: z.string().optional().nullable(),
});

// GET /api/admin/landing-pages/:id - Get single landing page
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'MANAGER', 'SUPERADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const includeBlocks = searchParams.get('includeBlocks') !== 'false';

        const page = await prisma.page.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                blocks: includeBlocks ? {
                    include: {
                        template: {
                            select: {
                                id: true,
                                name: true,
                                category: true,
                            },
                        },
                    },
                    orderBy: { order: 'asc' },
                } : false,
            },
        });

        if (!page) {
            return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
        }

        return NextResponse.json(page);
    } catch (error) {
        console.error('Error fetching landing page:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/admin/landing-pages/:id - Update landing page
export async function PUT(
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
        const validationResult = updateLandingPageSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validationResult.error.issues },
                { status: 400 }
            );
        }

        // Check if page exists
        const existing = await prisma.page.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
        }

        const data = validationResult.data;

        // If slug is being changed, check for conflicts
        if (data.slug && data.slug !== existing.slug) {
            const slugExists = await prisma.page.findUnique({
                where: { slug: data.slug },
            });

            if (slugExists) {
                return NextResponse.json(
                    { error: 'A landing page with this slug already exists' },
                    { status: 409 }
                );
            }
        }

        // Update page
        const page = await prisma.page.update({
            where: { id: id },
            data,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                blocks: {
                    include: {
                        template: {
                            select: {
                                id: true,
                                name: true,
                                category: true,
                            },
                        },
                    },
                    orderBy: { order: 'asc' },
                },
            },
        });

        return NextResponse.json(page);
    } catch (error) {
        console.error('Error updating landing page:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/admin/landing-pages/:id - Delete landing page
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
            return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
        }

        const deletedBlocksCount = page._count.blocks;

        // Delete page (blocks will be cascade deleted)
        await prisma.page.delete({
            where: { id: id },
        });

        return NextResponse.json({
            message: 'Landing page deleted successfully',
            deletedId: id,
            deletedBlocksCount,
        });
    } catch (error) {
        console.error('Error deleting landing page:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
