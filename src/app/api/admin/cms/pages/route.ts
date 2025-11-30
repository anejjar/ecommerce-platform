import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'SUPERADMIN' && session.user.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        const skip = (page - 1) * limit;

        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { content: { contains: search } },
            ];
        }

        const [pages, total] = await Promise.all([
            prisma.page.findMany({
                where,
                skip,
                take: limit,
                orderBy: { updatedAt: 'desc' },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    _count: {
                        select: { blocks: true },
                    },
                },
            }),
            prisma.page.count({ where }),
        ]);

        // Transform response to include blockCount
        const transformedPages = pages.map(({ _count, ...page }) => ({
            ...page,
            blockCount: _count.blocks,
        }));

        return NextResponse.json({
            pages: transformedPages,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit,
            },
        });
    } catch (error) {
        console.error('[CMS_PAGES_GET]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'SUPERADMIN' && session.user.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

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

        if (!title || !slug) {
            return new NextResponse('Missing required fields: title and slug', { status: 400 });
        }

        // Content is optional if useBlockEditor is true
        if (!useBlockEditor && !content) {
            return new NextResponse('Content is required when not using block editor', { status: 400 });
        }

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

        // Check if slug exists
        const existingPage = await prisma.page.findUnique({
            where: { slug },
        });

        if (existingPage) {
            return new NextResponse('Slug already exists', { status: 400 });
        }

        // Check if another page already overrides this page type
        if (overridesStorefrontPage && overriddenPageType) {
            const existingOverride = await prisma.page.findFirst({
                where: {
                    overridesStorefrontPage: true,
                    overriddenPageType,
                    NOT: { slug }, // Exclude current page if updating
                },
            });

            if (existingOverride) {
                return new NextResponse(`Another page already overrides ${overriddenPageType}`, { status: 400 });
            }
        }

        const page = await prisma.page.create({
            data: {
                title,
                slug,
                content: content || '',
                description,
                status: status || 'DRAFT',
                useStorefrontLayout: useStorefrontLayout ?? true,
                useBlockEditor: useBlockEditor ?? false,
                seoTitle,
                seoDescription,
                seoKeywords,
                ogImage,
                ogTitle,
                ogDescription,
                publishedAt: publishedAt ? new Date(publishedAt) : null,
                scheduledPublishAt: scheduledPublishAt ? new Date(scheduledPublishAt) : null,
                layoutConfig,
                customCss,
                customJs,
                templateId,
                authorId: authorId || session.user.id,
                conversionGoal,
                overridesStorefrontPage: overridesStorefrontPage ?? false,
                overriddenPageType: overridesStorefrontPage ? overriddenPageType : null,
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

        return NextResponse.json(page);
    } catch (error) {
        console.error('[CMS_PAGES_POST]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
