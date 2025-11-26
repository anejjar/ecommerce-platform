import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import cloudinary from '@/lib/cloudinary'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'

/**
 * GET /api/admin/backup
 * List all backups with status and metadata
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

    // Get backups with pagination
    const [backups, total] = await Promise.all([
      prisma.backup.findMany({
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
      prisma.backup.count({ where }),
    ])

    return NextResponse.json({
      backups,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching backups:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/backup
 * Create a new database backup
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
      includeProducts = true,
      includeOrders = true,
      includeCustomers = true,
      includeMedia = false,
      includeSettings = true,
      type = 'MANUAL',
    } = body

    // Create backup record
    const backup = await prisma.backup.create({
      data: {
        filename: `backup-${Date.now()}.json`,
        fileSize: 0, // Will be updated after generation
        type,
        status: 'IN_PROGRESS',
        includeProducts,
        includeOrders,
        includeCustomers,
        includeMedia,
        includeSettings,
        createdById: session.user.id,
      },
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'CREATE',
      resource: 'BACKUP',
      resourceId: backup.id,
      details: `Started backup with ID: ${backup.id}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    // Generate backup data asynchronously
    // In a production environment, this should be done in a background job
    setImmediate(async () => {
      try {
        const backupData: any = {
          version: '1.0',
          createdAt: new Date().toISOString(),
          metadata: {
            includeProducts,
            includeOrders,
            includeCustomers,
            includeMedia,
            includeSettings,
          },
          data: {},
        }

        let recordCount = 0

        // Export Products
        if (includeProducts) {
          const products = await prisma.product.findMany({
            include: {
              images: true,
              variants: true,
              variantOptions: {
                include: {
                  values: true,
                },
              },
              category: true,
              translations: true,
              customizationFields: {
                include: {
                  options: true,
                },
              },
            },
          })
          backupData.data.products = products
          recordCount += products.length

          const categories = await prisma.category.findMany({
            include: {
              translations: true,
            },
          })
          backupData.data.categories = categories
          recordCount += categories.length
        }

        // Export Orders
        if (includeOrders) {
          const orders = await prisma.order.findMany({
            include: {
              items: {
                include: {
                  customizations: true,
                },
              },
              shippingAddress: true,
              billingAddress: true,
              orderNotes: true,
              refunds: {
                include: {
                  refundItems: true,
                },
              },
            },
          })
          backupData.data.orders = orders
          recordCount += orders.length
        }

        // Export Customers
        if (includeCustomers) {
          const customers = await prisma.user.findMany({
            where: {
              role: 'CUSTOMER',
            },
            select: {
              id: true,
              name: true,
              email: true,
              emailVerified: true,
              image: true,
              role: true,
              communicationPreferences: true,
              createdAt: true,
              updatedAt: true,
              addresses: true,
            },
          })
          backupData.data.customers = customers
          recordCount += customers.length
        }

        // Export Settings
        if (includeSettings) {
          const settings = await prisma.storeSetting.findMany()
          backupData.data.settings = settings
          recordCount += settings.length

          const discountCodes = await prisma.discountCode.findMany()
          backupData.data.discountCodes = discountCodes
          recordCount += discountCodes.length

          const featureFlags = await prisma.featureFlag.findMany()
          backupData.data.featureFlags = featureFlags
          recordCount += featureFlags.length
        }

        // Export Media metadata (not files)
        if (includeMedia) {
          const media = await prisma.mediaLibrary.findMany({
            include: {
              folder: true,
              tags: true,
              variants: true,
            },
          })
          backupData.data.media = media
          recordCount += media.length
        }

        // Convert to JSON string
        const jsonData = JSON.stringify(backupData, null, 2)
        const fileSize = Buffer.byteLength(jsonData, 'utf8')

        // Upload to Cloudinary as raw file
        const uploadResult = await cloudinary.uploader.upload(
          `data:application/json;base64,${Buffer.from(jsonData).toString('base64')}`,
          {
            folder: 'ecommerce/backups',
            resource_type: 'raw',
            public_id: `backup-${backup.id}`,
            format: 'json',
          }
        )

        // Update backup record
        await prisma.backup.update({
          where: { id: backup.id },
          data: {
            status: 'COMPLETED',
            fileUrl: uploadResult.secure_url,
            fileSize,
            recordCount,
            completedAt: new Date(),
          },
        })

        console.log(`Backup ${backup.id} completed successfully`)
      } catch (error) {
        console.error(`Error generating backup ${backup.id}:`, error)
        await prisma.backup.update({
          where: { id: backup.id },
          data: {
            status: 'FAILED',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          },
        })
      }
    })

    return NextResponse.json({
      backup: {
        id: backup.id,
        status: backup.status,
        message: 'Backup started. Check status at /api/admin/backup/' + backup.id,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating backup:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
