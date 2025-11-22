import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/permissions'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/admin/products/[id]/translations
 * Get all translations for a product
 */
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'PRODUCT', 'VIEW')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await context.params

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        translations: {
          orderBy: {
            locale: 'asc',
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ translations: product.translations })
  } catch (error) {
    console.error('Error fetching product translations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/products/[id]/translations
 * Create or update a product translation
 */
export async function POST(request: NextRequest, context: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'PRODUCT', 'UPDATE')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await context.params
    const body = await request.json()
    const { locale, name, description, slug, metaTitle, metaDescription } = body

    // Validate required fields
    if (!locale || !name || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: locale, name, slug' },
        { status: 400 }
      )
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if translation already exists
    const existingTranslation = await prisma.productTranslation.findUnique({
      where: {
        productId_locale: {
          productId: id,
          locale,
        },
      },
    })

    // Create or update translation
    const translation = await prisma.productTranslation.upsert({
      where: {
        productId_locale: {
          productId: id,
          locale,
        },
      },
      create: {
        productId: id,
        locale,
        name,
        description: description || null,
        slug,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      },
      update: {
        name,
        description: description || null,
        slug,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      },
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: existingTranslation ? 'UPDATE' : 'CREATE',
      resource: 'PRODUCT',
      resourceId: id,
      details: `${existingTranslation ? 'Updated' : 'Created'} ${locale} translation for product: ${product.name}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({ translation })
  } catch (error) {
    console.error('Error creating/updating product translation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
