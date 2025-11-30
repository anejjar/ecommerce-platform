import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const idsParam = searchParams.get('ids');
    const statusParam = searchParams.get('status');
    const categoryParam = searchParams.get('category');
    const latestParam = searchParams.get('latest');
    const sortParam = searchParams.get('sort') || 'newest';
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    // If ids parameter is provided, fetch specific posts
    if (idsParam) {
      const ids = idsParam.split(',').filter(id => id.trim());
      if (ids.length > 0) {
        const posts = await prisma.blogPost.findMany({
          where: {
            id: { in: ids },
            ...(statusParam ? { status: statusParam as any } : {}),
          },
          include: {
            author: {
              select: { name: true },
            },
            category: true,
            tags: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        return NextResponse.json(posts);
      }
    }

    // Build where clause
    const where: any = {};
    if (statusParam) {
      where.status = statusParam;
    }
    if (categoryParam) {
      where.category = { slug: categoryParam };
    }
    if (latestParam === 'true') {
      where.publishedAt = { not: null };
    }

    // Build orderBy clause
    let orderBy: any = { publishedAt: 'desc' };
    if (sortParam === 'oldest') {
      orderBy = { publishedAt: 'asc' };
    } else if (sortParam === 'title') {
      orderBy = { title: 'asc' };
    }

    // Fetch posts
    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: { name: true },
        },
        category: true,
        tags: true,
      },
      orderBy,
      take: limit,
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

