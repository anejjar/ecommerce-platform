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

        const [posts, total] = await Promise.all([
            prisma.blogPost.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: { name: true, email: true },
                    },
                    category: true,
                },
            }),
            prisma.blogPost.count({ where }),
        ]);

        return NextResponse.json({
            posts,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit,
            },
        });
    } catch (error) {
        console.error('[CMS_POSTS_GET]', error);
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
        const { title, slug, content, excerpt, status, categoryId, featuredImage, seoTitle, seoDescription } = body;

        if (!title || !slug || !content) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // Check if slug exists
        const existingPost = await prisma.blogPost.findUnique({
            where: { slug },
        });

        if (existingPost) {
            return new NextResponse('Slug already exists', { status: 400 });
        }

        const post = await prisma.blogPost.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                status: status || 'DRAFT',
                featuredImage,
                seoTitle,
                seoDescription,
                authorId: session.user.id,
                categoryId,
                publishedAt: status === 'PUBLISHED' ? new Date() : null,
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('[CMS_POSTS_POST]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
