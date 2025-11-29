import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isFeatureEnabled } from '@/lib/features'

// Get analytics for a flash sale
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const enabled = await isFeatureEnabled('flash_sales')
    if (!enabled) {
      return NextResponse.json(
        { error: 'Feature not available' },
        { status: 404 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const flashSale = await prisma.flashSale.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    if (!flashSale) {
      return NextResponse.json(
        { error: 'Flash sale not found' },
        { status: 404 }
      )
    }

    // Calculate analytics
    const totalProducts = flashSale.products.length
    const totalSold = flashSale.products.reduce((sum, p) => sum + p.soldQuantity, 0)
    const totalRevenue = flashSale.products.reduce((sum, p) => {
      return sum + (Number(p.salePrice) * p.soldQuantity)
    }, 0)
    const totalDiscount = flashSale.products.reduce((sum, p) => {
      return sum + ((Number(p.originalPrice) - Number(p.salePrice)) * p.soldQuantity)
    }, 0)

    // Calculate availability
    const productsWithLimits = flashSale.products.filter(p => p.maxQuantity !== null)
    const totalAvailable = productsWithLimits.reduce((sum, p) => {
      return sum + (p.maxQuantity! - p.soldQuantity)
    }, 0)
    const totalMaxQuantity = productsWithLimits.reduce((sum, p) => sum + p.maxQuantity!, 0)
    const availabilityPercentage = totalMaxQuantity > 0
      ? ((totalMaxQuantity - totalSold) / totalMaxQuantity) * 100
      : 100

    // Time remaining
    const now = new Date()
    const timeRemaining = flashSale.endDate > now
      ? flashSale.endDate.getTime() - now.getTime()
      : 0

    const analytics = {
      flashSale: {
        id: flashSale.id,
        name: flashSale.name,
        status: flashSale.status,
        startDate: flashSale.startDate,
        endDate: flashSale.endDate,
      },
      metrics: {
        totalProducts,
        totalSold,
        totalRevenue,
        totalDiscount,
        totalAvailable,
        availabilityPercentage: Math.round(availabilityPercentage * 100) / 100,
        timeRemaining,
        averageDiscount: totalSold > 0 ? totalDiscount / totalSold : 0,
      },
      products: flashSale.products.map((p) => ({
        productId: p.productId,
        productName: p.product.name,
        originalPrice: Number(p.originalPrice),
        salePrice: Number(p.salePrice),
        maxQuantity: p.maxQuantity,
        soldQuantity: p.soldQuantity,
        available: p.maxQuantity !== null ? p.maxQuantity - p.soldQuantity : null,
        revenue: Number(p.salePrice) * p.soldQuantity,
      })),
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching flash sale analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

