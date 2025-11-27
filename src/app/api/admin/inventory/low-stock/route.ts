import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/permissions'

/**
 * GET /api/admin/inventory/low-stock
 * Get all products with stock below threshold
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'INVENTORY', 'VIEW')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const defaultThreshold = parseInt(searchParams.get('threshold') || '10')

    // Get products with stock alerts
    const productsWithAlerts = await prisma.product.findMany({
      where: {
        stockAlert: {
          isNot: null,
        },
      },
      include: {
        stockAlert: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        variants: {
          select: {
            id: true,
            sku: true,
            stock: true,
            optionValues: true,
          },
        },
      },
    })

    // Filter products below threshold
    const lowStockProducts = productsWithAlerts.filter((product) => {
      const threshold = product.stockAlert?.threshold || defaultThreshold
      return product.stock <= threshold
    })

    // Also check products without alerts but below default threshold
    const productsWithoutAlerts = await prisma.product.findMany({
      where: {
        stockAlert: null,
        stock: {
          lte: defaultThreshold,
        },
      },
      include: {
        stockAlert: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        variants: {
          select: {
            id: true,
            sku: true,
            stock: true,
            optionValues: true,
          },
        },
      },
    })

    // Combine and sort by stock level (lowest first)
    const allLowStockProducts = [...lowStockProducts, ...productsWithoutAlerts]
      .sort((a, b) => a.stock - b.stock)

    // Get low stock variants
    const lowStockVariants = await prisma.productVariant.findMany({
      where: {
        stock: {
          lte: defaultThreshold,
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            sku: true,
          },
        },
      },
      orderBy: {
        stock: 'asc',
      },
    })

    // Paginate results
    const total = allLowStockProducts.length
    const paginatedProducts = allLowStockProducts.slice(
      (page - 1) * limit,
      page * limit
    )

    // Format response with threshold info
    const formattedProducts = paginatedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      stock: product.stock,
      threshold: product.stockAlert?.threshold || defaultThreshold,
      belowThresholdBy: (product.stockAlert?.threshold || defaultThreshold) - product.stock,
      category: product.category,
      variants: product.variants,
      hasAlert: !!product.stockAlert,
    }))

    return NextResponse.json({
      products: formattedProducts,
      variants: lowStockVariants,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      defaultThreshold,
      summary: {
        totalLowStockProducts: total,
        totalLowStockVariants: lowStockVariants.length,
        criticalStock: allLowStockProducts.filter(p => p.stock === 0).length,
      },
    })
  } catch (error) {
    console.error('Error fetching low stock products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
