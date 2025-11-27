import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'

/**
 * POST /api/admin/backup/[id]/restore
 * Restore database from backup
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

    // Check if user is SUPERADMIN
    if (session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await params

    // Parse request body
    const body = await request.json()
    const {
      preview = false, // Dry run mode
      conflictStrategy = 'skip', // 'skip' | 'overwrite'
      restoreProducts = true,
      restoreOrders = true,
      restoreCustomers = true,
      restoreSettings = true,
    } = body

    // Get backup
    const backup = await prisma.backup.findUnique({
      where: { id },
    })

    if (!backup) {
      return NextResponse.json({ error: 'Backup not found' }, { status: 404 })
    }

    if (backup.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Backup is not completed' },
        { status: 400 }
      )
    }

    if (!backup.fileUrl) {
      return NextResponse.json(
        { error: 'Backup file not available' },
        { status: 404 }
      )
    }

    // Fetch backup file
    const response = await fetch(backup.fileUrl)
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch backup file' },
        { status: 500 }
      )
    }

    const backupData = await response.json()

    // Validate backup data structure
    if (!backupData.version || !backupData.data) {
      return NextResponse.json(
        { error: 'Invalid backup file format' },
        { status: 400 }
      )
    }

    const results = {
      preview,
      products: { created: 0, updated: 0, skipped: 0, errors: [] as string[] },
      categories: { created: 0, updated: 0, skipped: 0, errors: [] as string[] },
      orders: { created: 0, updated: 0, skipped: 0, errors: [] as string[] },
      customers: { created: 0, updated: 0, skipped: 0, errors: [] as string[] },
      settings: { created: 0, updated: 0, skipped: 0, errors: [] as string[] },
    }

    // Preview mode - just analyze what would be restored
    if (preview) {
      if (restoreProducts && backupData.data.products) {
        for (const product of backupData.data.products) {
          const existing = await prisma.product.findUnique({
            where: { id: product.id },
          })
          if (existing) {
            if (conflictStrategy === 'overwrite') {
              results.products.updated++
            } else {
              results.products.skipped++
            }
          } else {
            results.products.created++
          }
        }
      }

      if (restoreOrders && backupData.data.orders) {
        for (const order of backupData.data.orders) {
          const existing = await prisma.order.findUnique({
            where: { id: order.id },
          })
          if (existing) {
            results.orders.skipped++
          } else {
            results.orders.created++
          }
        }
      }

      if (restoreCustomers && backupData.data.customers) {
        for (const customer of backupData.data.customers) {
          const existing = await prisma.user.findUnique({
            where: { id: customer.id },
          })
          if (existing) {
            if (conflictStrategy === 'overwrite') {
              results.customers.updated++
            } else {
              results.customers.skipped++
            }
          } else {
            results.customers.created++
          }
        }
      }

      return NextResponse.json({
        message: 'Preview completed',
        results,
      })
    }

    // Actual restore - use transaction
    await prisma.$transaction(
      async (tx) => {
        // Restore Categories first (foreign key dependency)
        if (restoreProducts && backupData.data.categories) {
          for (const category of backupData.data.categories) {
            try {
              const existing = await tx.category.findUnique({
                where: { id: category.id },
              })

              if (existing) {
                if (conflictStrategy === 'overwrite') {
                  await tx.category.update({
                    where: { id: category.id },
                    data: {
                      name: category.name,
                      slug: category.slug,
                      description: category.description,
                      image: category.image,
                      parentId: category.parentId,
                    },
                  })
                  results.categories.updated++
                } else {
                  results.categories.skipped++
                }
              } else {
                await tx.category.create({
                  data: {
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    description: category.description,
                    image: category.image,
                    parentId: category.parentId,
                    createdAt: new Date(category.createdAt),
                    updatedAt: new Date(category.updatedAt),
                  },
                })
                results.categories.created++
              }
            } catch (error) {
              results.categories.errors.push(
                `Category ${category.slug}: ${error instanceof Error ? error.message : 'Unknown error'}`
              )
            }
          }
        }

        // Restore Products
        if (restoreProducts && backupData.data.products) {
          for (const product of backupData.data.products) {
            try {
              const existing = await tx.product.findUnique({
                where: { id: product.id },
              })

              const { images, variants, variantOptions, translations, customizationFields, category, ...productData } = product

              if (existing) {
                if (conflictStrategy === 'overwrite') {
                  await tx.product.update({
                    where: { id: product.id },
                    data: {
                      name: productData.name,
                      slug: productData.slug,
                      description: productData.description,
                      price: productData.price,
                      comparePrice: productData.comparePrice,
                      sku: productData.sku,
                      stock: productData.stock,
                      featured: productData.featured,
                      published: productData.published,
                      categoryId: productData.categoryId,
                    },
                  })
                  results.products.updated++
                } else {
                  results.products.skipped++
                }
              } else {
                await tx.product.create({
                  data: {
                    id: productData.id,
                    name: productData.name,
                    slug: productData.slug,
                    description: productData.description,
                    price: productData.price,
                    comparePrice: productData.comparePrice,
                    sku: productData.sku,
                    stock: productData.stock,
                    featured: productData.featured,
                    published: productData.published,
                    categoryId: productData.categoryId,
                    createdAt: new Date(productData.createdAt),
                    updatedAt: new Date(productData.updatedAt),
                  },
                })
                results.products.created++
              }
            } catch (error) {
              results.products.errors.push(
                `Product ${product.slug}: ${error instanceof Error ? error.message : 'Unknown error'}`
              )
            }
          }
        }

        // Restore Customers
        if (restoreCustomers && backupData.data.customers) {
          for (const customer of backupData.data.customers) {
            try {
              const existing = await tx.user.findUnique({
                where: { id: customer.id },
              })

              const { addresses, ...customerData } = customer

              if (existing) {
                if (conflictStrategy === 'overwrite') {
                  await tx.user.update({
                    where: { id: customer.id },
                    data: {
                      name: customerData.name,
                      email: customerData.email,
                      image: customerData.image,
                      communicationPreferences: customerData.communicationPreferences,
                    },
                  })
                  results.customers.updated++
                } else {
                  results.customers.skipped++
                }
              } else {
                await tx.user.create({
                  data: {
                    id: customerData.id,
                    name: customerData.name,
                    email: customerData.email,
                    emailVerified: customerData.emailVerified ? new Date(customerData.emailVerified) : null,
                    image: customerData.image,
                    role: customerData.role,
                    communicationPreferences: customerData.communicationPreferences,
                    createdAt: new Date(customerData.createdAt),
                    updatedAt: new Date(customerData.updatedAt),
                  },
                })
                results.customers.created++
              }
            } catch (error) {
              results.customers.errors.push(
                `Customer ${customer.email}: ${error instanceof Error ? error.message : 'Unknown error'}`
              )
            }
          }
        }

        // Restore Settings
        if (restoreSettings && backupData.data.settings) {
          for (const setting of backupData.data.settings) {
            try {
              const existing = await tx.storeSetting.findUnique({
                where: { key: setting.key },
              })

              if (existing) {
                if (conflictStrategy === 'overwrite') {
                  await tx.storeSetting.update({
                    where: { key: setting.key },
                    data: {
                      value: setting.value,
                      category: setting.category,
                    },
                  })
                  results.settings.updated++
                } else {
                  results.settings.skipped++
                }
              } else {
                await tx.storeSetting.create({
                  data: {
                    key: setting.key,
                    value: setting.value,
                    category: setting.category,
                  },
                })
                results.settings.created++
              }
            } catch (error) {
              results.settings.errors.push(
                `Setting ${setting.key}: ${error instanceof Error ? error.message : 'Unknown error'}`
              )
            }
          }
        }

        // Note: Orders are intentionally not restored to prevent duplicate order processing
        // They are included in backups for archival purposes only
      },
      {
        timeout: 60000, // 60 second timeout
      }
    )

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'UPDATE',
      resource: 'BACKUP',
      resourceId: id,
      details: `Restored from backup: ${backup.filename}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({
      message: 'Restore completed',
      results,
    })
  } catch (error) {
    console.error('Error restoring backup:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
