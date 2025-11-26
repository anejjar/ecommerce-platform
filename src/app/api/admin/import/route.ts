import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import cloudinary from '@/lib/cloudinary'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'

/**
 * GET /api/admin/import
 * List all imports with pagination
 */
export async function GET(request: NextRequest) {
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

    // Get imports with pagination
    const [imports, total] = await Promise.all([
      prisma.dataImport.findMany({
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
      prisma.dataImport.count({ where }),
    ])

    return NextResponse.json({
      imports,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching imports:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/import
 * Upload import file
 */
export async function POST(request: NextRequest) {
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

    // Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string
    const mode = (formData.get('mode') as string) || 'CREATE'

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    // Validate type
    const validTypes = ['PRODUCTS', 'ORDERS', 'CUSTOMERS', 'CATEGORIES', 'INVENTORY']
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid import type' }, { status: 400 })
    }

    // Validate mode
    const validModes = ['CREATE', 'UPDATE', 'UPSERT']
    if (!validModes.includes(mode)) {
      return NextResponse.json({ error: 'Invalid import mode' }, { status: 400 })
    }

    // Validate file format
    const filename = file.name
    const fileExtension = filename.split('.').pop()?.toLowerCase()

    let format: 'CSV' | 'JSON' | 'XLSX'
    if (fileExtension === 'csv') {
      format = 'CSV'
    } else if (fileExtension === 'json') {
      format = 'JSON'
    } else {
      return NextResponse.json(
        { error: 'Invalid file format. Supported: CSV, JSON' },
        { status: 400 }
      )
    }

    const fileSize = file.size

    // Upload file to Cloudinary
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'ecommerce/imports',
          resource_type: 'raw',
          format: fileExtension,
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(buffer)
    })

    // Create import record
    const dataImport = await prisma.dataImport.create({
      data: {
        type,
        format,
        mode,
        status: 'PENDING',
        filename,
        fileUrl: uploadResult.secure_url,
        fileSize,
        createdById: session.user.id,
      },
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'CREATE',
      resource: 'DATA_IMPORT',
      resourceId: dataImport.id,
      details: `Uploaded import file: ${filename}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json(
      {
        import: dataImport,
        message: 'File uploaded successfully. Validate at /api/admin/import/' + dataImport.id + '/validate',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error uploading import:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
