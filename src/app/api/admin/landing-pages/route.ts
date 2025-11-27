import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { PageStatus } from '@prisma/client';

// Validation schema for creating landing pages
const createLandingPageSchema = z.object({
    title: z.string().min(3).max(200),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    description: z.string().optional().nullable(),
    seoTitle: z.string().optional().nullable(),
    seoDescription: z.string().optional().nullable(),
    seoKeywords: z.string().optional().nullable(),
    ogImage: z.string().url().optional().nullable(),
    ogTitle: z.string().optional().nullable(),
    ogDescription: z.string().optional().nullable(),
    status: z.nativeEnum(PageStatus).optional(),
    layoutConfig: z.record(z.any()).optional().nullable(),
    customCss: z.string().optional().nullable(),
    customJs: z.string().optional().nullable(),
    templateId: z.string().optional().nullable(),
});

// GET /api/admin/landing-pages - List landing pages
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'MANAGER', 'SUPERADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);

        // Parse query parameters
        const status = searchParams.get('status') as PageStatus | null;
        const authorId = searchParams.get('authorId');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Build where clause
        const where: any = {};
        if (status) where.status = status;
        if (authorId) where.authorId = authorId;
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
            ];
        }

        // Get total count
        const total = await prisma.landingPage.count({ where });

        // Get landing pages
        const pages = await prisma.landingPage.findMany({
            where,
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                status: true,
                publishedAt: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                viewCount: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: { blocks: true },
                },
            },
            orderBy: { [sortBy]: sortOrder },
            skip: (page - 1) * limit,
            take: limit,
        });

        // Transform response to include blockCount
        const transformedPages = pages.map(({ _count, ...page }) => ({
            ...page,
            blockCount: _count.blocks,
        }));

        return NextResponse.json({
            pages: transformedPages,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching landing pages:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/admin/landing-pages - Create landing page
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'MANAGER', 'SUPERADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Validate request body
        const validationResult = createLandingPageSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validationResult.error.errors },
                { status: 400 }
            );
        }

        const data = validationResult.data;

        // Check if slug already exists
        const existing = await prisma.landingPage.findUnique({
            where: { slug: data.slug },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'A landing page with this slug already exists' },
                { status: 409 }
            );
        }

        // Create landing page
        const page = await prisma.landingPage.create({
            data: {
                title: data.title,
                slug: data.slug,
                description: data.description,
                seoTitle: data.seoTitle,
                seoDescription: data.seoDescription,
                seoKeywords: data.seoKeywords,
                ogImage: data.ogImage,
                ogTitle: data.ogTitle,
                ogDescription: data.ogDescription,
                status: data.status ?? PageStatus.DRAFT,
                layoutConfig: data.layoutConfig,
                customCss: data.customCss,
                customJs: data.customJs,
                templateId: data.templateId,
                authorId: session.user.id,
            },
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

        return NextResponse.json(page, { status: 201 });
    } catch (error) {
        console.error('Error creating landing page:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
