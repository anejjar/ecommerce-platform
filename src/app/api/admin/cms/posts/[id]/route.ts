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

        const post = await prisma.blogPost.findUnique({
            where: { id },
            include: {
                category: true,
                tags: true,
            },
        });

        if (!post) {
            return new NextResponse('Post not found', { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('[CMS_POST_GET]', error);
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
        const { title, slug, content, excerpt, status, categoryId, featuredImage, seoTitle, seoDescription } = body;

        // Check if slug exists on other posts
        if (slug) {
            const existingPost = await prisma.blogPost.findFirst({
                where: {
                    slug,
                    NOT: { id },
                },
            });

            if (existingPost) {
                return new NextResponse('Slug already exists', { status: 400 });
            }
        }

        const post = await prisma.blogPost.update({
            where: { id },
            data: {
                title,
                slug,
                content,
                excerpt,
                status,
                categoryId,
                featuredImage,
                seoTitle,
                seoDescription,
                publishedAt: status === 'PUBLISHED' ? new Date() : undefined,
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('[CMS_POST_PUT]', error);
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

        await prisma.blogPost.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('[CMS_POST_DELETE]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
