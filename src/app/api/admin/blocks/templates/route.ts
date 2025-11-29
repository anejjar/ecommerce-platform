import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { BlockCategory } from '@prisma/client';

// Validation schema for creating/updating block templates
const blockTemplateSchema = z.object({
    name: z.string().min(3).max(100),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    description: z.string().optional(),
    category: z.nativeEnum(BlockCategory),
    thumbnail: z.string().url().optional().nullable(),
    previewUrl: z.string().url().optional().nullable(),
    defaultConfig: z.record(z.string(), z.any()),
    configSchema: z.record(z.string(), z.any()),
    componentCode: z.string().min(1),
    htmlTemplate: z.string().optional().nullable(),
    cssStyles: z.string().optional().nullable(),
    isSystem: z.boolean().optional(),
    isActive: z.boolean().optional(),
    isPro: z.boolean().optional(),
});

// GET /api/admin/blocks/templates - List all block templates
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'MANAGER', 'SUPERADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);

        // Parse query parameters
        const category = searchParams.get('category') as BlockCategory | null;
        const isActive = searchParams.get('isActive') === 'true' ? true : searchParams.get('isActive') === 'false' ? false : undefined;
        const isPro = searchParams.get('isPro') === 'true' ? true : searchParams.get('isPro') === 'false' ? false : undefined;
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Build where clause
        const where: any = {};
        if (category) where.category = category;
        if (isActive !== undefined) where.isActive = isActive;
        if (isPro !== undefined) where.isPro = isPro;
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
            ];
        }

        // Get total count
        const total = await prisma.blockTemplate.count({ where });

        // Get templates
        const templates = await prisma.blockTemplate.findMany({
            where,
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                category: true,
                thumbnail: true,
                previewUrl: true,
                isSystem: true,
                isActive: true,
                isPro: true,
                usageCount: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { [sortBy]: sortOrder },
            skip: (page - 1) * limit,
            take: limit,
        });

        return NextResponse.json({
            templates,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching block templates:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/admin/blocks/templates - Create new block template
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'MANAGER', 'SUPERADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Validate request body
        const validationResult = blockTemplateSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validationResult.error.issues },
                { status: 400 }
            );
        }

        const data = validationResult.data;

        // Check if slug already exists
        const existing = await prisma.blockTemplate.findUnique({
            where: { slug: data.slug },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'A template with this slug already exists' },
                { status: 409 }
            );
        }

        // Create template
        const template = await prisma.blockTemplate.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                category: data.category,
                thumbnail: data.thumbnail,
                previewUrl: data.previewUrl,
                defaultConfig: data.defaultConfig,
                configSchema: data.configSchema,
                componentCode: data.componentCode,
                htmlTemplate: data.htmlTemplate,
                cssStyles: data.cssStyles,
                isSystem: data.isSystem ?? false,
                isActive: data.isActive ?? true,
                isPro: data.isPro ?? false,
            },
        });

        return NextResponse.json(template, { status: 201 });
    } catch (error) {
        console.error('Error creating block template:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
