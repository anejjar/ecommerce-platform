import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { PageStatus } from '@prisma/client';

// Validation schema for duplicate request
const duplicateSchema = z.object({
    title: z.string().min(3).max(200),
    slug: z.string().regex(/^[a-z0-9-_]+$/),
});

// POST /api/admin/cms/pages/:id/duplicate - Duplicate page
export async function POST(
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
        const validationResult = duplicateSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validationResult.error.issues },
                { status: 400 }
            );
        }

        const { title, slug } = validationResult.data;

        // Check if original page exists
        const original = await prisma.page.findUnique({
            where: { id },
            include: {
                blocks: {
                    orderBy: { order: 'asc' },
                },
            },
        });

        if (!original) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        // Check if new slug already exists
        const slugExists = await prisma.page.findUnique({
            where: { slug },
        });

        if (slugExists) {
            return NextResponse.json(
                { error: 'A page with this slug already exists' },
                { status: 409 }
            );
        }

        // Create duplicate with all blocks
        const duplicate = await prisma.page.create({
            data: {
                title,
                slug,
                description: original.description,
                content: original.content,
                status: PageStatus.DRAFT, // Always create duplicates as drafts
                useStorefrontLayout: original.useStorefrontLayout,
                useBlockEditor: original.useBlockEditor,
                seoTitle: original.seoTitle,
                seoDescription: original.seoDescription,
                seoKeywords: original.seoKeywords,
                ogImage: original.ogImage,
                ogTitle: original.ogTitle,
                ogDescription: original.ogDescription,
                layoutConfig: original.layoutConfig,
                customCss: original.customCss,
                customJs: original.customJs,
                templateId: original.templateId,
                authorId: session.user.id,
                conversionGoal: original.conversionGoal,
                overridesStorefrontPage: false, // Don't duplicate overrides
                overriddenPageType: null,
                blocks: {
                    create: original.blocks.map((block) => ({
                        templateId: block.templateId,
                        config: block.config,
                        customCss: block.customCss,
                        customClasses: block.customClasses,
                        order: block.order,
                        isVisible: block.isVisible,
                        visibilityRules: block.visibilityRules,
                        hideOnMobile: block.hideOnMobile,
                        hideOnTablet: block.hideOnTablet,
                        hideOnDesktop: block.hideOnDesktop,
                        animationType: block.animationType,
                        animationDelay: block.animationDelay,
                    })),
                },
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

        return NextResponse.json(duplicate, { status: 201 });
    } catch (error) {
        console.error('Error duplicating page:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

