import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'

/**
 * GET /api/admin/export/[id]/download
 * Download export file
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

    // Check if user is SUPERADMIN
    if (session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await params

    // Get export
    const dataExport = await prisma.dataExport.findUnique({
      where: { id },
    })

    if (!dataExport) {
      return NextResponse.json({ error: 'Export not found' }, { status: 404 })
    }

    if (dataExport.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Export is not ready for download' },
        { status: 400 }
      )
    }

    if (!dataExport.fileUrl) {
      return NextResponse.json(
        { error: 'Export file not available' },
        { status: 404 }
      )
    }

    // Check if expired
    if (dataExport.expiresAt && new Date() > dataExport.expiresAt) {
      return NextResponse.json(
        { error: 'Export file has expired' },
        { status: 410 }
      )
    }

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'VIEW',
      resource: 'DATA_EXPORT',
      resourceId: id,
      details: `Downloaded export: ${dataExport.filename}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    // Fetch and stream the file
    const response = await fetch(dataExport.fileUrl)

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch export file' },
        { status: 500 }
      )
    }

    const fileBuffer = await response.arrayBuffer()

    // Determine content type
    const contentType =
      dataExport.format === 'CSV'
        ? 'text/csv'
        : dataExport.format === 'JSON'
        ? 'application/json'
        : 'application/octet-stream'

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${dataExport.filename}"`,
        'Content-Length': dataExport.fileSize?.toString() || '',
      },
    })
  } catch (error) {
    console.error('Error downloading export:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
