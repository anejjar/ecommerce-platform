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
            }),
            prisma.page.count({ where }),
        ]);

        return NextResponse.json({
            pages,
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
        const { title, slug, content, status, useStorefrontLayout, seoTitle, seoDescription } = body;

        if (!title || !slug || !content) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // Check if slug exists
        const existingPage = await prisma.page.findUnique({
            where: { slug },
        });

        if (existingPage) {
            return new NextResponse('Slug already exists', { status: 400 });
        }

        const page = await prisma.page.create({
            data: {
                title,
                slug,
                content,
                status: status || 'DRAFT',
                useStorefrontLayout: useStorefrontLayout ?? true,
                seoTitle,
                seoDescription,
            },
        });

        return NextResponse.json(page);
    } catch (error) {
        console.error('[CMS_PAGES_POST]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
