import { prisma } from '@/lib/prisma'

/**
 * Check and activate scheduled flash sales
 * Should be called by cron job periodically
 */
export async function checkAndActivateSales() {
  const now = new Date()

  try {
    // Find sales that should be activated
    const salesToActivate = await prisma.flashSale.findMany({
      where: {
        status: 'SCHEDULED',
        startDate: { lte: now },
        endDate: { gt: now },
        isActive: true,
      },
    })

    // Activate each sale
    for (const sale of salesToActivate) {
      await prisma.flashSale.update({
        where: { id: sale.id },
        data: { status: 'ACTIVE' },
      })
    }

    return {
      activated: salesToActivate.length,
      sales: salesToActivate.map((s) => s.id),
    }
  } catch (error) {
    console.error('Error activating flash sales:', error)
    throw error
  }
}

/**
 * Check and deactivate expired flash sales
 * Should be called by cron job periodically
 */
export async function checkAndDeactivateSales() {
  const now = new Date()

  try {
    // Find active sales that have ended
    const salesToDeactivate = await prisma.flashSale.findMany({
      where: {
        status: 'ACTIVE',
        endDate: { lte: now },
      },
    })

    // Deactivate each sale
    for (const sale of salesToDeactivate) {
      await prisma.flashSale.update({
        where: { id: sale.id },
        data: {
          status: 'ENDED',
          isActive: false,
        },
      })
    }

    return {
      deactivated: salesToDeactivate.length,
      sales: salesToDeactivate.map((s) => s.id),
    }
  } catch (error) {
    console.error('Error deactivating flash sales:', error)
    throw error
  }
}

/**
 * Update product prices based on active flash sales
 * This is called on-demand when products are viewed
 */
export async function getActiveFlashSaleForProduct(productId: string) {
  const now = new Date()

  const flashSaleProduct = await prisma.flashSaleProduct.findFirst({
    where: {
      productId,
      flashSale: {
        status: 'ACTIVE',
        isActive: true,
        startDate: { lte: now },
        endDate: { gt: now },
      },
      // Filter out products that have reached maxQuantity
      // We'll filter these in application code after fetching
    },
    include: {
      flashSale: {
        select: {
          id: true,
          name: true,
          endDate: true,
          priority: true,
        },
      },
    },
    orderBy: {
      flashSale: {
        priority: 'desc',
      },
    },
  })

  // Filter out products that have reached maxQuantity
  const availableProducts = flashSaleProducts.filter((fsProduct) => {
    if (fsProduct.maxQuantity === null) return true
    return fsProduct.soldQuantity < fsProduct.maxQuantity
  })

  return availableProducts[0] || null
}

