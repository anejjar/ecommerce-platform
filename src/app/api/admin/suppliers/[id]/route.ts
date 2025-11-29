import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/permissions'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'

/**
 * GET /api/admin/suppliers/[id]
 * Get supplier details
 */
export async function GET(
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
    if (!hasPermission(session.user.role, 'SUPPLIER', 'VIEW')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await params

    // Get supplier with related data
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        purchaseOrders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            orderDate: true,
            total: true,
          },
          orderBy: { orderDate: 'desc' },
          take: 10,
        },
        stockHistory: {
          select: {
            id: true,
            productId: true,
            changeType: true,
            quantityChange: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: {
          select: {
            purchaseOrders: true,
            stockHistory: true,
          },
        },
      },
    })

    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
    }

    return NextResponse.json({ supplier })
  } catch (error) {
    console.error('Error fetching supplier:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/suppliers/[id]
 * Update supplier
 */
export async function PATCH(
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
    if (!hasPermission(session.user.role, 'SUPPLIER', 'UPDATE')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await params

    // Verify supplier exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id },
    })

    if (!existingSupplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
    }

    // Parse request body
    const body = await request.json()
    const { name, contactName, email, phone, address, website, notes, isActive } = body

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Build update data (only include provided fields)
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (contactName !== undefined) updateData.contactName = contactName
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (address !== undefined) updateData.address = address
    if (website !== undefined) updateData.website = website
    if (notes !== undefined) updateData.notes = notes
    if (isActive !== undefined) updateData.isActive = isActive

    // Update supplier
    const supplier = await prisma.supplier.update({
      where: { id },
      data: updateData,
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'UPDATE',
      resource: 'SUPPLIER',
      resourceId: supplier.id,
      details: `Updated supplier: ${supplier.name}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({ supplier })
  } catch (error) {
    console.error('Error updating supplier:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/suppliers/[id]
 * Delete supplier
 */
export async function DELETE(
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
    if (!hasPermission(session.user.role, 'SUPPLIER', 'DELETE')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await params

    // Verify supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            purchaseOrders: true,
            stockHistory: true,
          },
        },
      },
    })

    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
    }

    // Check if supplier has related records
    if (supplier._count.purchaseOrders > 0 || supplier._count.stockHistory > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete supplier with existing purchase orders or stock history. Consider deactivating instead.',
          details: {
            purchaseOrders: supplier._count.purchaseOrders,
            stockHistory: supplier._count.stockHistory,
          },
        },
        { status: 409 }
      )
    }

    // Delete supplier
    await prisma.supplier.delete({
      where: { id },
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'DELETE',
      resource: 'SUPPLIER',
      resourceId: id,
      details: `Deleted supplier: ${supplier.name}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({
      success: true,
      message: 'Supplier deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting supplier:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
