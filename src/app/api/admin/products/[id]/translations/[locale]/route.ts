import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/permissions'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'

interface RouteParams {
  params: Promise<{
    id: string
    locale: string
  }>
}

/**
 * DELETE /api/admin/products/[id]/translations/[locale]
 * Delete a product translation
 */
export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'PRODUCT', 'DELETE')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id, locale } = await context.params

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if translation exists
    const translation = await prisma.productTranslation.findUnique({
      where: {
        productId_locale: {
          productId: id,
          locale,
        },
      },
    })

    if (!translation) {
      return NextResponse.json({ error: 'Translation not found' }, { status: 404 })
    }

    // Delete translation
    await prisma.productTranslation.delete({
      where: {
        productId_locale: {
          productId: id,
          locale,
        },
      },
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'DELETE',
      resource: 'PRODUCT',
      resourceId: id,
      details: `Deleted ${locale} translation for product: ${product.name}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product translation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
