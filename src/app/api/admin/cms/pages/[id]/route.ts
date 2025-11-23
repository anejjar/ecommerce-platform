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
        const { title, slug, content, status, useStorefrontLayout, seoTitle, seoDescription } = body;

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

        const page = await prisma.page.update({
            where: { id },
            data: {
                title,
                slug,
                content,
                status,
                useStorefrontLayout,
                seoTitle,
                seoDescription,
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
