import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getExportColumns } from '@/lib/export-utils'

/**
 * GET /api/admin/export/[type]/template
 * Download import template CSV for specified type
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
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

    const { type } = await params
    const exportType = type.toUpperCase()

    // Validate type
    const validTypes = ['PRODUCTS', 'ORDERS', 'CUSTOMERS', 'CATEGORIES', 'INVENTORY']
    if (!validTypes.includes(exportType)) {
      return NextResponse.json({ error: 'Invalid export type' }, { status: 400 })
    }

    // Get columns for this type
    const columns = getExportColumns(exportType)

    if (columns.length === 0) {
      return NextResponse.json(
        { error: 'Template not available for this type' },
        { status: 404 }
      )
    }

    // Generate CSV template with headers only
    const headers = columns.map((col) => col.header).join(',')

    // Add sample row for guidance
    const sampleRow = columns
      .map((col) => {
        switch (col.key) {
          case 'sku':
            return 'SAMPLE-SKU-001'
          case 'name':
            return 'Sample Product Name'
          case 'price':
          case 'comparePrice':
          case 'total':
            return '99.99'
          case 'stock':
            return '100'
          case 'email':
            return 'customer@example.com'
          case 'category':
            return 'Sample Category'
          case 'published':
          case 'featured':
            return 'Yes'
          case 'description':
            return 'Sample description text'
          case 'orderNumber':
            return 'ORD-001'
          case 'status':
            return 'PENDING'
          case 'paymentStatus':
            return 'PAID'
          default:
            return ''
        }
      })
      .join(',')

    const csvContent = `${headers}\n${sampleRow}\n`

    const filename = `import-template-${exportType.toLowerCase()}.csv`

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error generating template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
