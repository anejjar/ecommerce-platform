import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/permissions'
import { StockChangeType } from '@prisma/client'

/**
 * GET /api/admin/inventory/stock-history
 * List stock history with filters
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
    const productId = searchParams.get('productId')
    const variantId = searchParams.get('variantId')
    const changeType = searchParams.get('changeType') as StockChangeType | null
    const supplierId = searchParams.get('supplierId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build where clause
    const where: any = {}

    if (productId) {
      where.productId = productId
    }

    if (variantId) {
      where.variantId = variantId
    }

    if (changeType) {
      where.changeType = changeType
    }

    if (supplierId) {
      where.supplierId = supplierId
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    // Get stock history with pagination
    const [history, total] = await Promise.all([
      prisma.stockHistory.findMany({
        where,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              slug: true,
            },
          },
          supplier: {
            select: {
              id: true,
              name: true,
              contactName: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.stockHistory.count({ where }),
    ])

    return NextResponse.json({
      history,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching stock history:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
