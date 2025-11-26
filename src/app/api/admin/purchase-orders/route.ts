import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/permissions'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'
import { PurchaseOrderStatus } from '@prisma/client'

/**
 * GET /api/admin/purchase-orders
 * List purchase orders with pagination and filtering
 */
export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') as PurchaseOrderStatus | null
    const supplierId = searchParams.get('supplierId')
    const search = searchParams.get('search')

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (supplierId) {
      where.supplierId = supplierId
    }

    if (search) {
      where.orderNumber = { contains: search }
    }

    // Get purchase orders with pagination
    const [purchaseOrders, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
              contactName: true,
              email: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            select: {
              id: true,
              productId: true,
              variantId: true,
              quantity: true,
              receivedQuantity: true,
              unitCost: true,
              total: true,
            },
          },
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: { orderDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.purchaseOrder.count({ where }),
    ])

    return NextResponse.json({
      orders: purchaseOrders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching purchase orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/purchase-orders
 * Create a new purchase order
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'PURCHASE_ORDER', 'CREATE')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Parse request body
    const body = await request.json()
    const {
      supplierId,
      expectedDate,
      notes,
      items,
      tax,
      shipping,
    } = body

    // Validate required fields
    if (!supplierId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Supplier ID and items are required' },
        { status: 400 }
      )
    }

    // Verify supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
    })

    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
    }

    // Validate items
    for (const item of items) {
      if (!item.productId || !item.quantity || !item.unitCost) {
        return NextResponse.json(
          { error: 'Each item must have productId, quantity, and unitCost' },
          { status: 400 }
        )
      }

      if (item.quantity <= 0 || item.unitCost < 0) {
        return NextResponse.json(
          { error: 'Quantity must be positive and unitCost must be non-negative' },
          { status: 400 }
        )
      }
    }

    // Calculate totals
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

    const taxAmount = tax ? parseFloat(tax) : 0
    const shippingAmount = shipping ? parseFloat(shipping) : 0
    const total = subtotal + taxAmount + shippingAmount

    // Generate order number
    const orderCount = await prisma.purchaseOrder.count()
    const orderNumber = `PO-${String(orderCount + 1).padStart(6, '0')}`

    // Create purchase order with items in transaction
    const purchaseOrder = await prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.create({
        data: {
          orderNumber,
          supplierId,
          status: 'DRAFT',
          expectedDate: expectedDate ? new Date(expectedDate) : null,
          subtotal,
          tax: taxAmount,
          shipping: shippingAmount,
          total,
          notes,
          createdById: session.user.id,
          items: {
            create: itemsData,
          },
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
      action: 'CREATE',
      resource: 'PURCHASE_ORDER',
      resourceId: purchaseOrder.id,
      details: `Created purchase order ${orderNumber} for supplier ${supplier.name}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({ purchaseOrder }, { status: 201 })
  } catch (error) {
    console.error('Error creating purchase order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
