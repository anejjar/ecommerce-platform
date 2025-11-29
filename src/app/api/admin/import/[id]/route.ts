import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import cloudinary from '@/lib/cloudinary'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'

/**
 * GET /api/admin/import/[id]
 * Get import details and status
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

    // Get import
    const dataImport = await prisma.dataImport.findUnique({
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

    if (!dataImport) {
      return NextResponse.json({ error: 'Import not found' }, { status: 404 })
    }

    // Parse errors if exists
    let parsedErrors = null
    if (dataImport.errors) {
      try {
        parsedErrors = JSON.parse(dataImport.errors)
      } catch (e) {
        parsedErrors = dataImport.errors
      }
    }

    return NextResponse.json({
      import: {
        ...dataImport,
        errors: parsedErrors,
      },
    })
  } catch (error) {
    console.error('Error fetching import:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/import/[id]
 * Delete import record and file
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

    // Check if user is SUPERADMIN
    if (session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await params

    // Get import
    const dataImport = await prisma.dataImport.findUnique({
      where: { id },
    })

    if (!dataImport) {
      return NextResponse.json({ error: 'Import not found' }, { status: 404 })
    }

    // Don't allow deletion of in-progress imports
    if (dataImport.status === 'IN_PROGRESS' || dataImport.status === 'VALIDATING') {
      return NextResponse.json(
        { error: 'Cannot delete import that is currently processing' },
        { status: 400 }
      )
    }

    // Delete from Cloudinary if exists
    if (dataImport.fileUrl) {
      try {
        // Extract public_id from URL
        const urlParts = dataImport.fileUrl.split('/')
        const filename = urlParts[urlParts.length - 1]
        const publicId = `ecommerce/imports/${filename.split('.')[0]}`
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' })
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError)
        // Continue with database deletion
      }
    }

    // Delete import record
    await prisma.dataImport.delete({
      where: { id },
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'DELETE',
      resource: 'DATA_IMPORT',
      resourceId: id,
      details: `Deleted import: ${dataImport.filename}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({
      message: 'Import deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting import:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
