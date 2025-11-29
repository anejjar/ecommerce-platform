import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/landing-pages/:slug - Get published landing page by slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const page = await prisma.landingPage.findUnique({
            where: {
                slug
                // Removed status filter to allow previewing draft pages
            },
            include: {
                blocks: {
                    include: {
                        template: true
                    },
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });

        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        // Increment view count
        await prisma.landingPage.update({
            where: { id: page.id },
            data: {
                viewCount: {
                    increment: 1
                }
            }
        });

        return NextResponse.json(page);
    } catch (error) {
        console.error('Error fetching landing page:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
