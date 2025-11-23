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

        const tags = await prisma.blogTag.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { posts: true },
                },
            },
        });

        return NextResponse.json(tags);
    } catch (error) {
        console.error('[CMS_TAGS_GET]', error);
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
        const { name, slug } = body;

        if (!name || !slug) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        const existingTag = await prisma.blogTag.findUnique({
            where: { slug },
        });

        if (existingTag) {
            return new NextResponse('Slug already exists', { status: 400 });
        }

        const tag = await prisma.blogTag.create({
            data: {
                name,
                slug,
            },
        });

        return NextResponse.json(tag);
    } catch (error) {
        console.error('[CMS_TAGS_POST]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
