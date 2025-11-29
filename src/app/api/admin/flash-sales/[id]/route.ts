import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isFeatureEnabled } from '@/lib/features'

// Get a single flash sale
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
    })

    if (!flashSale) {
      return NextResponse.json(
        { error: 'Flash sale not found' },
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

// Update a flash sale
export async function PUT(
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
    const body = await request.json()

    const {
      name,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      status,
      isActive,
      priority,
      bannerImage,
      bannerText,
      productIds,
      categoryIds,
    } = body

    // Validation
    if (discountType === 'PERCENTAGE' && discountValue !== undefined && (discountValue < 0 || discountValue > 100)) {
      return NextResponse.json(
        { error: 'Percentage discount must be between 0 and 100' },
        { status: 400 }
      )
    }

    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (end <= start) {
        return NextResponse.json(
          { error: 'End date must be after start date' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (discountType !== undefined) updateData.discountType = discountType
    if (discountValue !== undefined) updateData.discountValue = discountValue
    if (startDate !== undefined) updateData.startDate = new Date(startDate)
    if (endDate !== undefined) updateData.endDate = new Date(endDate)
    if (status !== undefined) updateData.status = status
    if (isActive !== undefined) updateData.isActive = isActive
    if (priority !== undefined) updateData.priority = priority
    if (bannerImage !== undefined) updateData.bannerImage = bannerImage
    if (bannerText !== undefined) updateData.bannerText = bannerText

    const flashSale = await prisma.$transaction(async (tx) => {
      // Update the flash sale
      const updated = await tx.flashSale.update({
        where: { id },
        data: updateData,
      })

      // Update products if provided
      if (productIds !== undefined) {
        // Delete existing products
        await tx.flashSaleProduct.deleteMany({
          where: { flashSaleId: id },
        })

        // Add new products
        if (productIds.length > 0) {
          const products = await tx.product.findMany({
            where: { id: { in: productIds } },
          })

          const discountType = updated.discountType
          const discountValue = updated.discountValue

          const flashSaleProducts = products.map((product) => {
            const originalPrice = Number(product.price)
            let salePrice: number

            if (discountType === 'PERCENTAGE') {
              salePrice = originalPrice * (1 - discountValue / 100)
            } else {
              salePrice = Math.max(0, originalPrice - discountValue)
            }

            return {
              flashSaleId: id,
              productId: product.id,
              originalPrice,
              salePrice,
            }
          })

          await tx.flashSaleProduct.createMany({
            data: flashSaleProducts,
          })
        }
      }

      // Update categories if provided
      if (categoryIds !== undefined) {
        // Delete existing categories
        await tx.flashSaleCategory.deleteMany({
          where: { flashSaleId: id },
        })

        // Add new categories
        if (categoryIds.length > 0) {
          const flashSaleCategories = categoryIds.map((categoryId: string) => ({
            flashSaleId: id,
            categoryId,
          }))

          await tx.flashSaleCategory.createMany({
            data: flashSaleCategories,
          })
        }
      }

      // Return updated sale with relations
      return tx.flashSale.findUnique({
        where: { id },
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

    return NextResponse.json(flashSale)
  } catch (error: any) {
    console.error('Error updating flash sale:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Flash sale not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update flash sale' },
      { status: 500 }
    )
  }
}

// Delete a flash sale
export async function DELETE(
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

    await prisma.flashSale.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Flash sale deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting flash sale:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Flash sale not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete flash sale' },
      { status: 500 }
    )
  }
}

