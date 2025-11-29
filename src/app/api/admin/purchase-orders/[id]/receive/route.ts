import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/permissions'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'

interface ReceiveItem {
  itemId: string
  receivedQuantity: number
}

/**
 * POST /api/admin/purchase-orders/[id]/receive
 * Mark purchase order as received and update stock
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'PURCHASE_ORDER', 'UPDATE') ||
        !hasPermission(session.user.role, 'INVENTORY', 'UPDATE')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await params

    // Verify purchase order exists
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        items: true,
      },
    })

    if (!purchaseOrder) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 })
    }

    // Check if already received
    if (purchaseOrder.status === 'RECEIVED') {
      return NextResponse.json(
        { error: 'Purchase order has already been received' },
        { status: 400 }
      )
    }

    // Check if order is in valid status for receiving
    if (!['CONFIRMED', 'SHIPPED'].includes(purchaseOrder.status)) {
      return NextResponse.json(
        { error: 'Purchase order must be in CONFIRMED or SHIPPED status to receive' },
        { status: 400 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { items, partialReceive } = body as {
      items: ReceiveItem[]
      partialReceive?: boolean
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required' },
        { status: 400 }
      )
    }

    // Validate each item exists in the purchase order
    for (const item of items) {
      const poItem = purchaseOrder.items.find(i => i.id === item.itemId)
      if (!poItem) {
        return NextResponse.json(
          { error: `Item ${item.itemId} not found in purchase order` },
          { status: 400 }
        )
      }

      if (item.receivedQuantity < 0) {
        return NextResponse.json(
          { error: 'Received quantity must be non-negative' },
          { status: 400 }
        )
      }

      if (item.receivedQuantity > poItem.quantity) {
        return NextResponse.json(
          { error: `Cannot receive more than ordered quantity for item ${item.itemId}` },
          { status: 400 }
        )
      }
    }

    const stockUpdates: Array<{
      productId: string
      variantId?: string
      productName: string
      quantityChange: number
      newStock: number
    }> = []

    // Process receiving in a transaction
    await prisma.$transaction(async (tx) => {
      // Update each item's received quantity and stock
      for (const item of items) {
        const poItem = purchaseOrder.items.find(i => i.id === item.itemId)
        if (!poItem || item.receivedQuantity === 0) continue

        // Update purchase order item
        await tx.purchaseOrderItem.update({
          where: { id: item.itemId },
          data: {
            receivedQuantity: {
              increment: item.receivedQuantity,
            },
          },
        })

        // Get current stock
        let currentStock = 0
        let productName = ''
        let newStock = 0

        if (poItem.variantId) {
          const variant = await tx.productVariant.findUnique({
            where: { id: poItem.variantId },
            include: { product: { select: { name: true } } },
          })

          if (variant) {
            currentStock = variant.stock
            productName = variant.product.name
            newStock = currentStock + item.receivedQuantity

            // Update variant stock
            await tx.productVariant.update({
              where: { id: poItem.variantId },
              data: { stock: newStock },
            })
          }
        } else {
          const product = await tx.product.findUnique({
            where: { id: poItem.productId },
            select: { stock: true, name: true },
          })

          if (product) {
            currentStock = product.stock
            productName = product.name
            newStock = currentStock + item.receivedQuantity

            // Update product stock
            await tx.product.update({
              where: { id: poItem.productId },
              data: { stock: newStock },
            })
          }
        }

        // Create stock history record
        await tx.stockHistory.create({
          data: {
            productId: poItem.productId,
            variantId: poItem.variantId,
            changeType: 'RESTOCK',
            quantityBefore: currentStock,
            quantityAfter: newStock,
            quantityChange: item.receivedQuantity,
            reason: `Received from PO ${purchaseOrder.orderNumber}`,
            supplierId: purchaseOrder.supplierId,
            userId: session.user.id,
          },
        })

        stockUpdates.push({
          productId: poItem.productId,
          variantId: poItem.variantId || undefined,
          productName,
          quantityChange: item.receivedQuantity,
          newStock,
        })
      }

      // Check if all items are fully received
      const updatedItems = await tx.purchaseOrderItem.findMany({
        where: { purchaseOrderId: id },
      })

      const allFullyReceived = updatedItems.every(
        item => item.receivedQuantity >= item.quantity
      )

      // Update purchase order status
      const newStatus = allFullyReceived ? 'RECEIVED' : purchaseOrder.status
      const receivedDate = allFullyReceived ? new Date() : null

      await tx.purchaseOrder.update({
        where: { id },
        data: {
          status: newStatus,
          receivedDate: receivedDate || undefined,
        },
      })
    })

    // Get updated purchase order
    const updatedPO = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        items: true,
      },
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'UPDATE',
      resource: 'PURCHASE_ORDER',
      resourceId: id,
      details: `Received items for PO ${purchaseOrder.orderNumber}. Updated stock for ${stockUpdates.length} products.`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    // Also log inventory activity
    await logActivity({
      userId: session.user.id,
      action: 'UPDATE',
      resource: 'INVENTORY',
      details: `Restocked ${stockUpdates.length} products from PO ${purchaseOrder.orderNumber}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({
      success: true,
      purchaseOrder: updatedPO,
      stockUpdates,
      message: updatedPO?.status === 'RECEIVED'
        ? 'Purchase order fully received and stock updated'
        : 'Purchase order partially received and stock updated',
    })
  } catch (error) {
    console.error('Error receiving purchase order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
