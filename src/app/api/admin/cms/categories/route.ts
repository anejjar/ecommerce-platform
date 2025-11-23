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

        const categories = await prisma.blogCategory.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { posts: true },
                },
            },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error('[CMS_CATEGORIES_GET]', error);
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
        const { name, slug, description } = body;

        if (!name || !slug) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        const existingCategory = await prisma.blogCategory.findUnique({
            where: { slug },
        });

        if (existingCategory) {
            return new NextResponse('Slug already exists', { status: 400 });
        }

        const category = await prisma.blogCategory.create({
            data: {
                name,
                slug,
                description,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('[CMS_CATEGORIES_POST]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
