import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isFeatureEnabled } from '@/lib/features'

// Get active flash sales (public)
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

    const now = new Date()

    const flashSales = await prisma.flashSale.findMany({
      where: {
        status: 'ACTIVE',
        isActive: true,
        startDate: { lte: now },
        endDate: { gt: now },
      },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: {
                  take: 1,
                  select: {
                    url: true,
                    alt: true,
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
                slug: true,
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
    console.error('Error fetching active flash sales:', error)
    return NextResponse.json(
      { error: 'Failed to fetch active flash sales' },
      { status: 500 }
    )
  }
}

