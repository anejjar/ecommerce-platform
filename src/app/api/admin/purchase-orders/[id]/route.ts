import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/permissions'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'
import { PurchaseOrderStatus } from '@prisma/client'

/**
 * GET /api/admin/purchase-orders/[id]
 * Get purchase order details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'PURCHASE_ORDER', 'VIEW')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = params

    // Get purchase order with all related data
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                slug: true,
              },
            },
            variant: {
              select: {
                id: true,
                sku: true,
                optionValues: true,
              },
            },
          },
        },
      },
    })

    if (!purchaseOrder) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 })
    }

    return NextResponse.json({ purchaseOrder })
  } catch (error) {
    console.error('Error fetching purchase order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/purchase-orders/[id]
 * Update purchase order
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'PURCHASE_ORDER', 'UPDATE')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = params

    // Verify purchase order exists
    const existingPO = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: { items: true },
    })

    if (!existingPO) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 })
    }

    // Parse request body
    const body = await request.json()
    const { status, expectedDate, receivedDate, notes, items } = body

    // Validate status if provided
    const validStatuses: PurchaseOrderStatus[] = ['DRAFT', 'PENDING', 'CONFIRMED', 'SHIPPED', 'RECEIVED', 'CANCELLED']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Don't allow updating received orders
    if (existingPO.status === 'RECEIVED') {
      return NextResponse.json(
        { error: 'Cannot update a received purchase order' },
        { status: 400 }
      )
    }

    // Build update data
    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (expectedDate !== undefined) updateData.expectedDate = expectedDate ? new Date(expectedDate) : null
    if (receivedDate !== undefined) updateData.receivedDate = receivedDate ? new Date(receivedDate) : null
    if (notes !== undefined) updateData.notes = notes

    // If items are being updated, recalculate totals
    if (items && Array.isArray(items)) {
      // Only allow updating items if order is in DRAFT status
      if (existingPO.status !== 'DRAFT') {
        return NextResponse.json(
          { error: 'Can only update items when purchase order is in DRAFT status' },
          { status: 400 }
        )
      }

      let subtotal = 0
      const itemsData = items.map((item: any) => {
        const itemTotal = item.quantity * parseFloat(item.unitCost)
        subtotal += itemTotal
        return {
          productId: item.productId,
          variantId: item.variantId || null,
          quantity: item.quantity,
          unitCost: item.unitCost,
          total: itemTotal,
          receivedQuantity: 0,
        }
      })

      updateData.subtotal = subtotal
      updateData.total = subtotal + existingPO.tax.toNumber() + existingPO.shipping.toNumber()
    }

    // Update purchase order
    const purchaseOrder = await prisma.$transaction(async (tx) => {
      // If items are being updated, delete old items and create new ones
      if (items) {
        await tx.purchaseOrderItem.deleteMany({
          where: { purchaseOrderId: id },
        })
      }

      const po = await tx.purchaseOrder.update({
        where: { id },
        data: {
          ...updateData,
          ...(items && {
            items: {
              create: items.map((item: any) => ({
                productId: item.productId,
                variantId: item.variantId || null,
                quantity: item.quantity,
                unitCost: item.unitCost,
                total: item.quantity * parseFloat(item.unitCost),
                receivedQuantity: 0,
              })),
            },
          }),
        },
        include: {
          supplier: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: true,
        },
      })

      return po
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'UPDATE',
      resource: 'PURCHASE_ORDER',
      resourceId: purchaseOrder.id,
      details: `Updated purchase order ${purchaseOrder.orderNumber}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({ purchaseOrder })
  } catch (error) {
    console.error('Error updating purchase order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/purchase-orders/[id]
 * Delete purchase order (only if in DRAFT or CANCELLED status)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'PURCHASE_ORDER', 'DELETE')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = params

    // Verify purchase order exists
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id },
    })

    if (!purchaseOrder) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 })
    }

    // Only allow deleting DRAFT or CANCELLED purchase orders
    if (!['DRAFT', 'CANCELLED'].includes(purchaseOrder.status)) {
      return NextResponse.json(
        { error: 'Can only delete purchase orders in DRAFT or CANCELLED status' },
        { status: 400 }
      )
    }

    // Delete purchase order (items will be cascade deleted)
    await prisma.purchaseOrder.delete({
      where: { id },
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'DELETE',
      resource: 'PURCHASE_ORDER',
      resourceId: id,
      details: `Deleted purchase order ${purchaseOrder.orderNumber}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({
      success: true,
      message: 'Purchase order deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting purchase order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
