import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isFeatureEnabled } from '@/lib/features'

// Manually deactivate a flash sale
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const enabled = await isFeatureEnabled('flash_sales')
    if (!enabled) {
      return NextResponse.json(
        { error: 'Feature not available' },
        { status: 404 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const flashSale = await prisma.flashSale.findUnique({
      where: { id },
    })

    if (!flashSale) {
      return NextResponse.json(
        { error: 'Flash sale not found' },
        { status: 404 }
      )
    }

    const updated = await prisma.flashSale.update({
      where: { id },
      data: {
        status: flashSale.endDate < new Date() ? 'ENDED' : 'CANCELLED',
        isActive: false,
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Error deactivating flash sale:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Flash sale not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to deactivate flash sale' },
      { status: 500 }
    )
  }
}

