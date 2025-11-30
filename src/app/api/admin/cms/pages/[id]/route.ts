import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'SUPERADMIN' && session.user.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;

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

        if (!page) {
            return new NextResponse('Page not found', { status: 404 });
        }

        return NextResponse.json(page);
    } catch (error) {
        console.error('[CMS_PAGE_GET]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'SUPERADMIN' && session.user.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { 
            title, 
            slug, 
            content, 
            description,
            status, 
            useStorefrontLayout, 
            useBlockEditor,
            seoTitle, 
            seoDescription,
            seoKeywords,
            ogImage,
            ogTitle,
            ogDescription,
            publishedAt,
            scheduledPublishAt,
            layoutConfig,
            customCss,
            customJs,
            templateId,
            authorId,
            conversionGoal,
            overridesStorefrontPage, 
            overriddenPageType 
        } = body;

        // Validate override fields
        if (overridesStorefrontPage && !overriddenPageType) {
            return new NextResponse('Page type is required when overriding storefront page', { status: 400 });
        }

        // Validate slug matches override type
        if (overridesStorefrontPage && overriddenPageType) {
            const slugMap: Record<string, string> = {
                'HOME': '_home', // Special slug for homepage override
                'SHOP': 'shop',
                'PRODUCT': 'product',
                'CART': 'cart',
                'CHECKOUT': 'checkout',
                'BLOG': 'blog',
                'BLOG_POST': 'blog',
            };
            const expectedSlug = slugMap[overriddenPageType];
            if (expectedSlug !== undefined && slug !== expectedSlug) {
                return new NextResponse(`Slug must be "${expectedSlug}" for ${overriddenPageType} override`, { status: 400 });
            }
        }

        // Check if slug exists on other pages
        if (slug) {
            const existingPage = await prisma.page.findFirst({
                where: {
                    slug,
                    NOT: { id },
                },
            });

            if (existingPage) {
                return new NextResponse('Slug already exists', { status: 400 });
            }
        }

        // Check if another page already overrides this page type
        if (overridesStorefrontPage && overriddenPageType) {
            const existingOverride = await prisma.page.findFirst({
                where: {
                    overridesStorefrontPage: true,
                    overriddenPageType,
                    NOT: { id },
                },
            });

            if (existingOverride) {
                return new NextResponse(`Another page already overrides ${overriddenPageType}`, { status: 400 });
            }
        }

        const updateData: any = {};
        
        if (title !== undefined) updateData.title = title;
        if (slug !== undefined) updateData.slug = slug;
        if (content !== undefined) updateData.content = content;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;
        if (useStorefrontLayout !== undefined) updateData.useStorefrontLayout = useStorefrontLayout;
        if (useBlockEditor !== undefined) updateData.useBlockEditor = useBlockEditor;
        if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
        if (seoDescription !== undefined) updateData.seoDescription = seoDescription;
        if (seoKeywords !== undefined) updateData.seoKeywords = seoKeywords;
        if (ogImage !== undefined) updateData.ogImage = ogImage;
        if (ogTitle !== undefined) updateData.ogTitle = ogTitle;
        if (ogDescription !== undefined) updateData.ogDescription = ogDescription;
        if (publishedAt !== undefined) updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
        if (scheduledPublishAt !== undefined) updateData.scheduledPublishAt = scheduledPublishAt ? new Date(scheduledPublishAt) : null;
        if (layoutConfig !== undefined) updateData.layoutConfig = layoutConfig;
        if (customCss !== undefined) updateData.customCss = customCss;
        if (customJs !== undefined) updateData.customJs = customJs;
        if (templateId !== undefined) updateData.templateId = templateId;
        if (authorId !== undefined) updateData.authorId = authorId;
        if (conversionGoal !== undefined) updateData.conversionGoal = conversionGoal;
        if (overridesStorefrontPage !== undefined) {
            updateData.overridesStorefrontPage = overridesStorefrontPage;
            updateData.overriddenPageType = overridesStorefrontPage ? overriddenPageType : null;
        }

        const page = await prisma.page.update({
            where: { id },
            data: updateData,
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
        console.error('[CMS_PAGE_PUT]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'SUPERADMIN' && session.user.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;

        await prisma.page.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('[CMS_PAGE_DELETE]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
