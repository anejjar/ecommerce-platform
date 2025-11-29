import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isFeatureEnabled } from '@/lib/features'

// Get a single flash sale (public)
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
    })

    if (!flashSale) {
      return NextResponse.json(
        { error: 'Flash sale not found' },
        { status: 404 }
      )
    }

    // Only return if sale is active and not expired
    const now = new Date()
    if (flashSale.status !== 'ACTIVE' || !flashSale.isActive || flashSale.endDate <= now) {
      return NextResponse.json(
        { error: 'Flash sale is not available' },
        { status: 404 }
      )
    }

    return NextResponse.json(flashSale)
  } catch (error) {
    console.error('Error fetching flash sale:', error)
    return NextResponse.json(
      { error: 'Failed to fetch flash sale' },
      { status: 500 }
    )
  }
}

