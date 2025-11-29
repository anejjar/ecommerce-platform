import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const idsParam = searchParams.get('ids');

    // If ids parameter is provided, fetch specific products
    if (idsParam) {
      const ids = idsParam.split(',').filter(id => id.trim());
      if (ids.length > 0) {
        const products = await prisma.product.findMany({
          where: {
            id: { in: ids },
            published: true,
          },
          include: {
            category: true,
            images: {
              orderBy: {
                position: 'asc',
              },
              take: 1,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        return NextResponse.json(products);
      }
    }

    // Default: fetch all products
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const { name, slug, description, price, stock, sku, published, categoryId } = json;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock,
        sku,
        published,
        categoryId: categoryId || null,
      },
    });

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'CREATE',
      resource: 'PRODUCT',
      resourceId: product.id,
      details: `Created product: ${product.name} (${product.sku || 'No SKU'})`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
