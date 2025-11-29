import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import cloudinary from '@/lib/cloudinary'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'

/**
 * GET /api/admin/export/[id]
 * Get export details and status
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

    // Check if user is ADMIN or SUPERADMIN
    if (!['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await params

    // Get export
    const dataExport = await prisma.dataExport.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!dataExport) {
      return NextResponse.json({ error: 'Export not found' }, { status: 404 })
    }

    return NextResponse.json({ export: dataExport })
  } catch (error) {
    console.error('Error fetching export:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/export/[id]
 * Delete export file and record
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

    // Check if user is ADMIN or SUPERADMIN
    if (!['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
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

    // Delete from Cloudinary if exists
    if (dataExport.fileUrl) {
      try {
        const publicId = `ecommerce/exports/export-${id}`
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' })
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError)
        // Continue with database deletion
      }
    }

    // Delete export record
    await prisma.dataExport.delete({
      where: { id },
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'DELETE',
      resource: 'DATA_EXPORT',
      resourceId: id,
      details: `Deleted export: ${dataExport.filename}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({
      message: 'Export deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting export:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
