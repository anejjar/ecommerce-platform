import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import cloudinary from '@/lib/cloudinary'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'
import { convertToCSV, getExportColumns } from '@/lib/export-utils'

/**
 * GET /api/admin/export
 * List all exports with pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is ADMIN or SUPERADMIN
    if (!['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    // Build where clause
    const where: any = {}
    if (type) {
      where.type = type
    }
    if (status) {
      where.status = status
    }

    // Get exports with pagination
    const [exports, total] = await Promise.all([
      prisma.dataExport.findMany({
        where,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.dataExport.count({ where }),
    ])

    return NextResponse.json({
      exports,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching exports:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/export
 * Create a new data export job
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is ADMIN or SUPERADMIN
    if (!['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Parse request body
    const body = await request.json()
    const {
      type, // PRODUCTS, ORDERS, CUSTOMERS, CATEGORIES, INVENTORY
      format = 'CSV', // CSV, JSON, XLSX
      filters = {},
    } = body

    // Validate type
    const validTypes = ['PRODUCTS', 'ORDERS', 'CUSTOMERS', 'CATEGORIES', 'INVENTORY']
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid export type' }, { status: 400 })
    }

    // Validate format
    const validFormats = ['CSV', 'JSON']
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Supported: CSV, JSON' },
        { status: 400 }
      )
    }

    // Create export record
    const dataExport = await prisma.dataExport.create({
      data: {
        type,
        format,
        status: 'IN_PROGRESS',
        filters: JSON.stringify(filters),
        createdById: session.user.id,
      },
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'CREATE',
      resource: 'DATA_EXPORT',
      resourceId: dataExport.id,
      details: `Started ${type} export in ${format} format`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    // Generate export asynchronously
    setImmediate(async () => {
      try {
        let data: any[] = []
        let recordCount = 0

        // Fetch data based on type
        switch (type) {
          case 'PRODUCTS':
            data = await prisma.product.findMany({
              include: {
                category: true,
                images: true,
              },
              where: filters.categoryId
                ? { categoryId: filters.categoryId }
                : undefined,
            })
            recordCount = data.length
            break

          case 'ORDERS':
            const orderWhere: any = {}
            if (filters.status) {
              orderWhere.status = filters.status
            }
            if (filters.startDate) {
              orderWhere.createdAt = {
                gte: new Date(filters.startDate),
              }
            }
            if (filters.endDate) {
              orderWhere.createdAt = {
                ...orderWhere.createdAt,
                lte: new Date(filters.endDate),
              }
            }

            data = await prisma.order.findMany({
              where: orderWhere,
              include: {
                user: {
                  select: {
                    email: true,
                    name: true,
                  },
                },
                items: true,
              },
            })
            recordCount = data.length
            break

          case 'CUSTOMERS':
            data = await prisma.user.findMany({
              where: {
                role: 'CUSTOMER',
              },
              include: {
                orders: {
                  select: {
                    total: true,
                  },
                },
              },
            })
            recordCount = data.length
            break

          case 'CATEGORIES':
            data = await prisma.category.findMany({
              include: {
                parent: true,
                products: true,
              },
            })
            recordCount = data.length
            break

          case 'INVENTORY':
            data = await prisma.product.findMany({
              include: {
                category: true,
                stockAlert: true,
              },
              where: filters.lowStock
                ? {
                  stock: {
                    lt: 10,
                  },
                }
                : undefined,
            })
            recordCount = data.length
            break
        }

        // Generate file based on format
        let fileContent: string
        let mimeType: string
        let fileExtension: string

        if (format === 'CSV') {
          const columns = getExportColumns(type)
          fileContent = convertToCSV(data, columns)
          mimeType = 'text/csv'
          fileExtension = 'csv'
        } else {
          // JSON
          fileContent = JSON.stringify(data, null, 2)
          mimeType = 'application/json'
          fileExtension = 'json'
        }

        const filename = `export-${type.toLowerCase()}-${Date.now()}.${fileExtension}`
        const fileSize = Buffer.byteLength(fileContent, 'utf8')

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(
          `data:${mimeType};base64,${Buffer.from(fileContent).toString('base64')}`,
          {
            folder: 'ecommerce/exports',
            resource_type: 'raw',
            public_id: `export-${dataExport.id}`,
            format: fileExtension,
          }
        )

        // Update export record
        await prisma.dataExport.update({
          where: { id: dataExport.id },
          data: {
            status: 'COMPLETED',
            filename,
            fileUrl: uploadResult.secure_url,
            fileSize,
            recordCount,
            completedAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          },
        })

        console.log(`Export ${dataExport.id} completed successfully`)
      } catch (error) {
        console.error(`Error generating export ${dataExport.id}:`, error)
        await prisma.dataExport.update({
          where: { id: dataExport.id },
          data: {
            status: 'FAILED',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          },
        })
      }
    })

    return NextResponse.json({
      export: {
        id: dataExport.id,
        status: dataExport.status,
        message: 'Export started. Check status at /api/admin/export/' + dataExport.id,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating export:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
