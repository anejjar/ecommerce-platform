import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'

/**
 * GET /api/admin/backup/[id]/download
 * Download backup file
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params

    // Get backup
    const backup = await prisma.backup.findUnique({
      where: { id },
    })

    if (!backup) {
      return NextResponse.json({ error: 'Backup not found' }, { status: 404 })
    }

    if (backup.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Backup is not ready for download' },
        { status: 400 }
      )
    }

    if (!backup.fileUrl) {
      return NextResponse.json(
        { error: 'Backup file not available' },
        { status: 404 }
      )
    }

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'VIEW',
      resource: 'BACKUP',
      resourceId: id,
      details: `Downloaded backup: ${backup.filename}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    // Redirect to Cloudinary URL for download
    // Or fetch and stream the file
    const response = await fetch(backup.fileUrl)

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch backup file' },
        { status: 500 }
      )
    }

    const fileBuffer = await response.arrayBuffer()

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${backup.filename}"`,
        'Content-Length': backup.fileSize.toString(),
      },
    })
  } catch (error) {
    console.error('Error downloading backup:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
