import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/permissions'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'

/**
 * PATCH /api/admin/inventory/alerts/[productId]
 * Update alert threshold for product
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'STOCK_ALERT', 'UPDATE')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { productId } = params

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, sku: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Parse request body
    const body = await request.json()
    const { threshold, notified } = body

    // Validate threshold
    if (threshold !== undefined) {
      if (typeof threshold !== 'number' || threshold < 0) {
        return NextResponse.json(
          { error: 'Threshold must be a non-negative number' },
          { status: 400 }
        )
      }
    }

    // Update or create stock alert
    const alert = await prisma.stockAlert.upsert({
      where: { productId },
      update: {
        threshold: threshold !== undefined ? threshold : undefined,
        notified: notified !== undefined ? notified : undefined,
      },
      create: {
        productId,
        threshold: threshold || 10,
        notified: notified || false,
      },
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'UPDATE',
      resource: 'STOCK_ALERT',
      resourceId: alert.id,
      details: `Updated stock alert for product ${product.name} (${product.sku}). Threshold: ${alert.threshold}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({
      alert,
      product,
    })
  } catch (error) {
    console.error('Error updating stock alert:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/inventory/alerts/[productId]
 * Create/update stock alert for product
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'STOCK_ALERT', 'CREATE')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { productId } = params

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, sku: true, stock: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Parse request body
    const body = await request.json()
    const { threshold } = body

    // Validate threshold
    if (threshold === undefined || typeof threshold !== 'number' || threshold < 0) {
      return NextResponse.json(
        { error: 'Valid threshold is required' },
        { status: 400 }
      )
    }

    // Check if alert already exists
    const existingAlert = await prisma.stockAlert.findUnique({
      where: { productId },
    })

    if (existingAlert) {
      return NextResponse.json(
        { error: 'Stock alert already exists for this product. Use PATCH to update.' },
        { status: 409 }
      )
    }

    // Create stock alert
    const alert = await prisma.stockAlert.create({
      data: {
        productId,
        threshold,
        notified: product.stock <= threshold, // Set notified if already below threshold
      },
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'CREATE',
      resource: 'STOCK_ALERT',
      resourceId: alert.id,
      details: `Created stock alert for product ${product.name} (${product.sku}). Threshold: ${threshold}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({
      alert,
      product,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating stock alert:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/inventory/alerts/[productId]
 * Delete stock alert for product
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'STOCK_ALERT', 'DELETE')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { productId } = params

    // Verify product and alert exist
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { stockAlert: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (!product.stockAlert) {
      return NextResponse.json({ error: 'Stock alert not found' }, { status: 404 })
    }

    // Delete stock alert
    await prisma.stockAlert.delete({
      where: { productId },
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'DELETE',
      resource: 'STOCK_ALERT',
      resourceId: product.stockAlert.id,
      details: `Deleted stock alert for product ${product.name} (${product.sku})`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({
      success: true,
      message: 'Stock alert deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting stock alert:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
