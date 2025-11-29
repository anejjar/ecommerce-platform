import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parseCSV, validateImportData } from '@/lib/export-utils'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'

/**
 * POST /api/admin/import/[id]/validate
 * Validate import file without actually importing
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

    // Update status to validating
    await prisma.dataImport.update({
      where: { id },
      data: { status: 'VALIDATING' },
    })

    // Fetch file from Cloudinary
    const response = await fetch(dataImport.fileUrl)
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch import file' },
        { status: 500 }
      )
    }

    let data: any[]
    const fileContent = await response.text()

    // Parse file based on format
    if (dataImport.format === 'CSV') {
      data = parseCSV(fileContent)
    } else if (dataImport.format === 'JSON') {
      data = JSON.parse(fileContent)
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format' },
        { status: 400 }
      )
    }

    const totalRows = data.length

    // Validate data
    const validation = validateImportData(dataImport.type, data)

    // Additional validation based on import type and mode
    const detailedResults = {
      totalRows,
      validRows: 0,
      invalidRows: 0,
      warnings: [] as string[],
      errors: validation.errors,
      preview: data.slice(0, 5), // First 5 rows for preview
    }

    if (validation.valid) {
      detailedResults.validRows = totalRows
    } else {
      detailedResults.invalidRows = validation.errors.length
      detailedResults.validRows = totalRows - validation.errors.length
    }

    // Check for duplicate SKUs/emails based on type
    if (dataImport.type === 'PRODUCTS') {
      const skus = data.map((row) => row.SKU).filter(Boolean)
      const uniqueSkus = new Set(skus)
      if (skus.length !== uniqueSkus.size) {
        detailedResults.warnings.push('Duplicate SKUs found in file')
      }

      // Check if SKUs already exist in database
      if (dataImport.mode === 'CREATE') {
        const existingProducts = await prisma.product.findMany({
          where: {
            sku: { in: Array.from(uniqueSkus) },
          },
          select: { sku: true },
        })

        if (existingProducts.length > 0) {
          detailedResults.warnings.push(
            `${existingProducts.length} SKUs already exist in database. Use UPDATE or UPSERT mode.`
          )
        }
      }
    }

    if (dataImport.type === 'CUSTOMERS') {
      const emails = data.map((row) => row.Email).filter(Boolean)
      const uniqueEmails = new Set(emails)
      if (emails.length !== uniqueEmails.size) {
        detailedResults.warnings.push('Duplicate emails found in file')
      }

      // Check if emails already exist
      if (dataImport.mode === 'CREATE') {
        const existingUsers = await prisma.user.findMany({
          where: {
            email: { in: Array.from(uniqueEmails) },
          },
          select: { email: true },
        })

        if (existingUsers.length > 0) {
          detailedResults.warnings.push(
            `${existingUsers.length} emails already exist in database. Use UPDATE or UPSERT mode.`
          )
        }
      }
    }

    // Update import record with validation results
    await prisma.dataImport.update({
      where: { id },
      data: {
        status: validation.valid && detailedResults.warnings.length === 0 ? 'PENDING' : 'FAILED',
        totalRows,
        errors: JSON.stringify(detailedResults),
      },
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'UPDATE',
      resource: 'DATA_IMPORT',
      resourceId: id,
      details: `Validated import: ${validation.valid ? 'Valid' : 'Invalid'}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({
      valid: validation.valid,
      results: detailedResults,
      message: validation.valid
        ? 'Validation passed. Ready to process.'
        : 'Validation failed. Please fix errors and try again.',
    })
  } catch (error) {
    console.error('Error validating import:', error)

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
