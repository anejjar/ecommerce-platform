import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for duplicate request
const duplicateSchema = z.object({
    name: z.string().min(3).max(100),
    slug: z.string().regex(/^[a-z0-9-]+$/),
});

// POST /api/admin/blocks/templates/:id/duplicate - Duplicate block template
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'MANAGER', 'SUPERADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Validate request body
        const validationResult = duplicateSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validationResult.error.errors },
                { status: 400 }
            );
        }

        const { name, slug } = validationResult.data;

        // Check if original template exists
        const original = await prisma.blockTemplate.findUnique({
            where: { id: params.id },
        });

        if (!original) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        // Check if new slug already exists
        const slugExists = await prisma.blockTemplate.findUnique({
            where: { slug },
        });

        if (slugExists) {
            return NextResponse.json(
                { error: 'A template with this slug already exists' },
                { status: 409 }
            );
        }

        // Create duplicate
        const duplicate = await prisma.blockTemplate.create({
            data: {
                name,
                slug,
                description: original.description,
                category: original.category,
                thumbnail: original.thumbnail,
                previewUrl: original.previewUrl,
                defaultConfig: original.defaultConfig,
                configSchema: original.configSchema,
                componentCode: original.componentCode,
                htmlTemplate: original.htmlTemplate,
                cssStyles: original.cssStyles,
                isSystem: false, // Duplicates are never system templates
                isActive: original.isActive,
                isPro: original.isPro,
            },
        });

        return NextResponse.json(duplicate, { status: 201 });
    } catch (error) {
        console.error('Error duplicating block template:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
