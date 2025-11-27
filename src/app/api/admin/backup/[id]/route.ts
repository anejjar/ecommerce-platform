import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import cloudinary from '@/lib/cloudinary'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'

/**
 * GET /api/admin/backup/[id]
 * Get backup details by ID
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

    // Get backup
    const backup = await prisma.backup.findUnique({
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

    if (!backup) {
      return NextResponse.json({ error: 'Backup not found' }, { status: 404 })
    }

    return NextResponse.json({ backup })
  } catch (error) {
    console.error('Error fetching backup:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/backup/[id]
 * Delete backup file and record
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

    // Get backup
    const backup = await prisma.backup.findUnique({
      where: { id },
    })

    if (!backup) {
      return NextResponse.json({ error: 'Backup not found' }, { status: 404 })
    }

    // Delete from Cloudinary if exists
    if (backup.fileUrl) {
      try {
        const publicId = `ecommerce/backups/backup-${id}`
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' })
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError)
        // Continue with database deletion even if Cloudinary fails
      }
    }

    // Delete backup record
    await prisma.backup.delete({
      where: { id },
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'DELETE',
      resource: 'BACKUP',
      resourceId: id,
      details: `Deleted backup: ${backup.filename}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({
      message: 'Backup deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting backup:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
