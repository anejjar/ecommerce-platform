import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isFeatureEnabled } from '@/lib/features'

// Get all flash sales (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check if feature is enabled
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

    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')

    const where: any = {}
    if (status) {
      where.status = status
    }
    if (startDate || endDate) {
      where.OR = []
      if (startDate) {
        where.OR.push({
          startDate: { gte: new Date(startDate) },
        })
      }
      if (endDate) {
        where.OR.push({
          endDate: { lte: new Date(endDate) },
        })
      }
    }

    const flashSales = await prisma.flashSale.findMany({
      where,
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: {
                  take: 1,
                  select: {
                    url: true,
                  },
                },
              },
            },
          },
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(flashSales)
  } catch (error) {
    console.error('Error fetching flash sales:', error)
    return NextResponse.json(
      { error: 'Failed to fetch flash sales' },
      { status: 500 }
    )
  }
}

// Create a new flash sale (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check if feature is enabled
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

    const body = await request.json()
    const {
      name,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      status = 'DRAFT',
      isActive = true,
      priority = 0,
      bannerImage,
      bannerText,
      productIds = [],
      categoryIds = [],
    } = body

    // Validation
    if (!name || !discountType || discountValue === undefined || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: name, discountType, discountValue, startDate, endDate' },
        { status: 400 }
      )
    }

    if (discountType === 'PERCENTAGE' && (discountValue < 0 || discountValue > 100)) {
      return NextResponse.json(
        { error: 'Percentage discount must be between 0 and 100' },
        { status: 400 }
      )
    }

    if (discountType === 'FIXED_AMOUNT' && discountValue < 0) {
      return NextResponse.json(
        { error: 'Fixed discount amount must be positive' },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (end <= start) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Create flash sale with products and categories
    const flashSale = await prisma.$transaction(async (tx) => {
      // Create the flash sale
      const sale = await tx.flashSale.create({
        data: {
          name,
          description,
          discountType,
          discountValue,
          startDate: start,
          endDate: end,
          status,
          isActive,
          priority,
          bannerImage,
          bannerText,
        },
      })

      // Add products if provided
      if (productIds.length > 0) {
        const products = await tx.product.findMany({
          where: { id: { in: productIds } },
        })

        const flashSaleProducts = products.map((product) => {
          const originalPrice = Number(product.price)
          let salePrice: number

          if (discountType === 'PERCENTAGE') {
            salePrice = originalPrice * (1 - discountValue / 100)
          } else {
            salePrice = Math.max(0, originalPrice - discountValue)
          }

          return {
            flashSaleId: sale.id,
            productId: product.id,
            originalPrice,
            salePrice,
          }
        })

        await tx.flashSaleProduct.createMany({
          data: flashSaleProducts,
        })
      }

      // Add categories if provided
      if (categoryIds.length > 0) {
        const flashSaleCategories = categoryIds.map((categoryId: string) => ({
          flashSaleId: sale.id,
          categoryId,
        }))

        await tx.flashSaleCategory.createMany({
          data: flashSaleCategories,
        })
      }

      // Return the created sale with relations
      return tx.flashSale.findUnique({
        where: { id: sale.id },
        include: {
          products: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
          categories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      })
    })

    return NextResponse.json(flashSale, { status: 201 })
  } catch (error) {
    console.error('Error creating flash sale:', error)
    return NextResponse.json(
      { error: 'Failed to create flash sale' },
      { status: 500 }
    )
  }
}

