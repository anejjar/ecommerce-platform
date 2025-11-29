import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isFeatureEnabled } from '@/lib/features'

// Check if a product has an active flash sale (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const enabled = await isFeatureEnabled('flash_sales')
    if (!enabled) {
      return NextResponse.json({ flashSale: null })
    }

    const { id } = await params
    const now = new Date()

    // Find active flash sales that include this product
    const flashSaleProduct = await prisma.flashSaleProduct.findFirst({
      where: {
        productId: id,
        flashSale: {
          status: 'ACTIVE',
          isActive: true,
          startDate: { lte: now },
          endDate: { gt: now },
        },
        // Filter by availability in application code
      },
      include: {
        flashSale: {
          select: {
            id: true,
            name: true,
            description: true,
            discountType: true,
            discountValue: true,
            startDate: true,
            endDate: true,
            bannerImage: true,
            bannerText: true,
          },
        },
      },
    })

    if (!flashSaleProduct) {
      return NextResponse.json({ flashSale: null })
    }

    // Check if product is still available (hasn't reached maxQuantity)
    if (
      flashSaleProduct.maxQuantity !== null &&
      flashSaleProduct.soldQuantity >= flashSaleProduct.maxQuantity
    ) {
      return NextResponse.json({ flashSale: null })
    }

    return NextResponse.json({
      flashSale: {
        id: flashSaleProduct.flashSale.id,
        name: flashSaleProduct.flashSale.name,
        description: flashSaleProduct.flashSale.description,
        discountType: flashSaleProduct.flashSale.discountType,
        discountValue: flashSaleProduct.flashSale.discountValue,
        startDate: flashSaleProduct.flashSale.startDate,
        endDate: flashSaleProduct.flashSale.endDate,
        bannerImage: flashSaleProduct.flashSale.bannerImage,
        bannerText: flashSaleProduct.flashSale.bannerText,
      },
      product: {
        originalPrice: Number(flashSaleProduct.originalPrice),
        salePrice: Number(flashSaleProduct.salePrice),
        maxQuantity: flashSaleProduct.maxQuantity,
        soldQuantity: flashSaleProduct.soldQuantity,
        available: flashSaleProduct.maxQuantity !== null
          ? flashSaleProduct.maxQuantity - flashSaleProduct.soldQuantity
          : null,
      },
    })
  } catch (error) {
    console.error('Error checking product flash sale:', error)
    return NextResponse.json({ flashSale: null })
  }
}

