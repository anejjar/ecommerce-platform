import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/permissions'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'
import { StockChangeType } from '@prisma/client'

interface BulkUpdateItem {
  productId: string
  variantId?: string
  quantity: number
  changeType: StockChangeType
  reason?: string
}

/**
 * POST /api/admin/inventory/bulk-update
 * Update stock for multiple products at once
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'INVENTORY', 'UPDATE')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Parse request body
    const body = await request.json()
    const { updates, supplierId } = body as {
      updates: BulkUpdateItem[]
      supplierId?: string
    }

    // Validate updates array
    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: 'Updates array is required and must not be empty' },
        { status: 400 }
      )
    }

    if (updates.length > 100) {
      return NextResponse.json(
        { error: 'Cannot update more than 100 items at once' },
        { status: 400 }
      )
    }

    // Validate each update item
    for (const update of updates) {
      if (!update.productId || !update.changeType || typeof update.quantity !== 'number') {
        return NextResponse.json(
          { error: 'Each update must have productId, changeType, and quantity' },
          { status: 400 }
        )
      }

      if (!['SALE', 'REFUND', 'RESTOCK', 'ADJUSTMENT', 'DAMAGE', 'RETURN', 'TRANSFER'].includes(update.changeType)) {
        return NextResponse.json(
          { error: `Invalid changeType: ${update.changeType}` },
          { status: 400 }
        )
      }
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ productId: string; variantId?: string; error: string }>,
    }

    // Process each update in a transaction
    await prisma.$transaction(async (tx) => {
      for (const update of updates) {
        try {
          let currentStock = 0
          let productName = ''

          // Get current stock
          if (update.variantId) {
            const variant = await tx.productVariant.findUnique({
              where: { id: update.variantId },
              include: { product: { select: { name: true } } },
            })

            if (!variant) {
              results.failed++
              results.errors.push({
                productId: update.productId,
                variantId: update.variantId,
                error: 'Variant not found',
              })
              continue
            }

            currentStock = variant.stock
            productName = variant.product.name
          } else {
            const product = await tx.product.findUnique({
              where: { id: update.productId },
              select: { stock: true, name: true },
            })

            if (!product) {
              results.failed++
              results.errors.push({
                productId: update.productId,
                error: 'Product not found',
              })
              continue
            }

            currentStock = product.stock
            productName = product.name
          }

          // Calculate new stock based on change type
          let quantityChange = 0
          const isIncrease = ['REFUND', 'RESTOCK', 'RETURN'].includes(update.changeType)
          const isDecrease = ['SALE', 'DAMAGE', 'ADJUSTMENT', 'TRANSFER'].includes(update.changeType)

          if (isIncrease) {
            quantityChange = Math.abs(update.quantity)
          } else if (isDecrease) {
            quantityChange = -Math.abs(update.quantity)
          }

          const newStock = currentStock + quantityChange

          // Validate stock can't go negative
          if (newStock < 0) {
            results.failed++
            results.errors.push({
              productId: update.productId,
              variantId: update.variantId,
              error: `Stock cannot go negative. Current: ${currentStock}, Change: ${quantityChange}`,
            })
            continue
          }

          // Update stock
          if (update.variantId) {
            await tx.productVariant.update({
              where: { id: update.variantId },
              data: { stock: newStock },
            })
          } else {
            await tx.product.update({
              where: { id: update.productId },
              data: { stock: newStock },
            })
          }

          // Create stock history record
          await tx.stockHistory.create({
            data: {
              productId: update.productId,
              variantId: update.variantId,
              changeType: update.changeType,
              quantityBefore: currentStock,
              quantityAfter: newStock,
              quantityChange,
              reason: update.reason || `Bulk update: ${update.changeType}`,
              supplierId,
              userId: session.user.id,
            },
          })

          results.success++
        } catch (error) {
          console.error('Error updating stock:', error)
          results.failed++
          results.errors.push({
            productId: update.productId,
            variantId: update.variantId,
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'UPDATE',
      resource: 'INVENTORY',
      details: `Bulk updated ${results.success} items. ${results.failed} failed.`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({
      success: true,
      results,
      message: `Successfully updated ${results.success} items. ${results.failed} failed.`,
    })
  } catch (error) {
    console.error('Error in bulk update:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
