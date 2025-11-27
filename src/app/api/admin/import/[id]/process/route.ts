import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parseCSV } from '@/lib/export-utils'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'
import { Decimal } from '@prisma/client/runtime/library'

/**
 * POST /api/admin/import/[id]/process
 * Process and import data from validated file
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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

    // Get import record
    const dataImport = await prisma.dataImport.findUnique({
      where: { id },
    })

    if (!dataImport) {
      return NextResponse.json({ error: 'Import not found' }, { status: 404 })
    }

    if (dataImport.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Import already processed' },
        { status: 400 }
      )
    }

    // Update status to in progress
    await prisma.dataImport.update({
      where: { id },
      data: { status: 'IN_PROGRESS' },
    })

    // Fetch file
    const response = await fetch(dataImport.fileUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch import file')
    }

    let data: any[]
    const fileContent = await response.text()

    // Parse file
    if (dataImport.format === 'CSV') {
      data = parseCSV(fileContent)
    } else if (dataImport.format === 'JSON') {
      data = JSON.parse(fileContent)
    } else {
      throw new Error('Unsupported file format')
    }

    const results = {
      successCount: 0,
      failedCount: 0,
      skippedCount: 0,
      errors: [] as { row: number; error: string }[],
    }

    // Process in transaction
    await prisma.$transaction(
      async (tx) => {
        for (let i = 0; i < data.length; i++) {
          const row = data[i]
          const rowNumber = i + 2 // Account for header

          try {
            switch (dataImport.type) {
              case 'PRODUCTS':
                await processProductRow(row, dataImport.mode, tx, results, rowNumber)
                break

              case 'CUSTOMERS':
                await processCustomerRow(row, dataImport.mode, tx, results, rowNumber)
                break

              case 'CATEGORIES':
                await processCategoryRow(row, dataImport.mode, tx, results, rowNumber)
                break

              case 'INVENTORY':
                await processInventoryRow(row, tx, results, rowNumber)
                break

              default:
                results.skippedCount++
                results.errors.push({
                  row: rowNumber,
                  error: 'Unsupported import type',
                })
            }
          } catch (error) {
            results.failedCount++
            results.errors.push({
              row: rowNumber,
              error: error instanceof Error ? error.message : 'Unknown error',
            })
          }
        }
      },
      {
        timeout: 120000, // 2 minute timeout
      }
    )

    // Update import record
    await prisma.dataImport.update({
      where: { id },
      data: {
        status: results.failedCount > 0 ? 'PARTIAL' : 'COMPLETED',
        totalRows: data.length,
        successCount: results.successCount,
        failedCount: results.failedCount,
        skippedCount: results.skippedCount,
        errors: JSON.stringify(results.errors),
        completedAt: new Date(),
      },
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'UPDATE',
      resource: 'DATA_IMPORT',
      resourceId: id,
      details: `Processed import: ${results.successCount} success, ${results.failedCount} failed`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({
      message: 'Import completed',
      results: {
        total: data.length,
        success: results.successCount,
        failed: results.failedCount,
        skipped: results.skippedCount,
        errors: results.errors,
      },
    })
  } catch (error) {
    console.error('Error processing import:', error)

    // Update status to failed
    try {
      await prisma.dataImport.update({
        where: { id: id },
        data: {
          status: 'FAILED',
          errors: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error',
          }),
        },
      })
    } catch (updateError) {
      console.error('Error updating import status:', updateError)
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Process a product row
 */
async function processProductRow(
  row: any,
  mode: string,
  tx: any,
  results: any,
  rowNumber: number
) {
  const sku = row.SKU?.trim()
  const name = row.Name?.trim()
  const price = parseFloat(row.Price)
  const stock = parseInt(row.Stock)
  const published = row.Published?.toLowerCase() === 'yes'

  if (!sku || !name || isNaN(price) || isNaN(stock)) {
    throw new Error('Missing required fields')
  }

  // Check if product exists
  const existingProduct = await tx.product.findUnique({
    where: { sku },
  })

  if (mode === 'CREATE') {
    if (existingProduct) {
      results.skippedCount++
      return
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    await tx.product.create({
      data: {
        sku,
        name,
        slug: `${slug}-${Date.now()}`,
        price: new Decimal(price),
        comparePrice: row['Compare Price'] ? new Decimal(parseFloat(row['Compare Price'])) : null,
        stock,
        published,
        featured: row.Featured?.toLowerCase() === 'yes',
        description: row.Description || null,
      },
    })
    results.successCount++
  } else if (mode === 'UPDATE') {
    if (!existingProduct) {
      results.skippedCount++
      return
    }

    await tx.product.update({
      where: { sku },
      data: {
        name,
        price: new Decimal(price),
        comparePrice: row['Compare Price'] ? new Decimal(parseFloat(row['Compare Price'])) : null,
        stock,
        published,
        featured: row.Featured?.toLowerCase() === 'yes',
        description: row.Description || null,
      },
    })
    results.successCount++
  } else if (mode === 'UPSERT') {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    await tx.product.upsert({
      where: { sku },
      create: {
        sku,
        name,
        slug: `${slug}-${Date.now()}`,
        price: new Decimal(price),
        comparePrice: row['Compare Price'] ? new Decimal(parseFloat(row['Compare Price'])) : null,
        stock,
        published,
        featured: row.Featured?.toLowerCase() === 'yes',
        description: row.Description || null,
      },
      update: {
        name,
        price: new Decimal(price),
        comparePrice: row['Compare Price'] ? new Decimal(parseFloat(row['Compare Price'])) : null,
        stock,
        published,
        featured: row.Featured?.toLowerCase() === 'yes',
        description: row.Description || null,
      },
    })
    results.successCount++
  }
}

/**
 * Process a customer row
 */
async function processCustomerRow(
  row: any,
  mode: string,
  tx: any,
  results: any,
  rowNumber: number
) {
  const email = row.Email?.trim()
  const name = row.Name?.trim()

  if (!email || !name) {
    throw new Error('Missing required fields')
  }

  // Check if customer exists
  const existingCustomer = await tx.user.findUnique({
    where: { email },
  })

  if (mode === 'CREATE') {
    if (existingCustomer) {
      results.skippedCount++
      return
    }

    await tx.user.create({
      data: {
        email,
        name,
        role: 'CUSTOMER',
      },
    })
    results.successCount++
  } else if (mode === 'UPDATE') {
    if (!existingCustomer) {
      results.skippedCount++
      return
    }

    await tx.user.update({
      where: { email },
      data: { name },
    })
    results.successCount++
  } else if (mode === 'UPSERT') {
    await tx.user.upsert({
      where: { email },
      create: {
        email,
        name,
        role: 'CUSTOMER',
      },
      update: { name },
    })
    results.successCount++
  }
}

/**
 * Process a category row
 */
async function processCategoryRow(
  row: any,
  mode: string,
  tx: any,
  results: any,
  rowNumber: number
) {
  const name = row.Name?.trim()
  const slug = row.Slug?.trim()

  if (!name || !slug) {
    throw new Error('Missing required fields')
  }

  // Check if category exists
  const existingCategory = await tx.category.findUnique({
    where: { slug },
  })

  if (mode === 'CREATE') {
    if (existingCategory) {
      results.skippedCount++
      return
    }

    await tx.category.create({
      data: {
        name,
        slug,
        description: row.Description || null,
      },
    })
    results.successCount++
  } else if (mode === 'UPDATE') {
    if (!existingCategory) {
      results.skippedCount++
      return
    }

    await tx.category.update({
      where: { slug },
      data: {
        name,
        description: row.Description || null,
      },
    })
    results.successCount++
  } else if (mode === 'UPSERT') {
    await tx.category.upsert({
      where: { slug },
      create: {
        name,
        slug,
        description: row.Description || null,
      },
      update: {
        name,
        description: row.Description || null,
      },
    })
    results.successCount++
  }
}

/**
 * Process an inventory row (stock update)
 */
async function processInventoryRow(
  row: any,
  tx: any,
  results: any,
  rowNumber: number
) {
  const sku = row.SKU?.trim()
  const stock = parseInt(row['Current Stock'])

  if (!sku || isNaN(stock)) {
    throw new Error('Missing required fields')
  }

  // Update product stock
  const product = await tx.product.findUnique({
    where: { sku },
  })

  if (!product) {
    results.skippedCount++
    return
  }

  await tx.product.update({
    where: { sku },
    data: { stock },
  })

  results.successCount++
}
