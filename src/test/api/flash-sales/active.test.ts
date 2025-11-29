import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '@/app/api/flash-sales/active/route'
import { NextRequest } from 'next/server'
import { mockPrisma, resetAllMocks } from '@/test/helpers/mocks'

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))

vi.mock('@/lib/features', () => ({
  isFeatureEnabled: vi.fn(() => Promise.resolve(true)),
}))

import { isFeatureEnabled } from '@/lib/features'

const mockIsFeatureEnabled = isFeatureEnabled as any

describe('Public Flash Sales API - GET /api/flash-sales/active', () => {
  beforeEach(() => {
    resetAllMocks()
    mockIsFeatureEnabled.mockResolvedValue(true)
  })

  it('should return 404 if feature is disabled', async () => {
    mockIsFeatureEnabled.mockResolvedValue(false)

    const request = new NextRequest('http://localhost:3000/api/flash-sales/active')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Feature not available')
  })

  it('should return active flash sales', async () => {
    const now = new Date()
    const future = new Date(now.getTime() + 86400000) // Tomorrow

    const mockSales = [
      {
        id: 'sale-1',
        name: 'Active Sale',
        status: 'ACTIVE',
        startDate: new Date(now.getTime() - 86400000), // Yesterday
        endDate: future,
        discountType: 'PERCENTAGE',
        discountValue: 25.0,
        isActive: true,
        products: [
          {
            id: 'fs-product-1',
            productId: 'product-1',
            originalPrice: 100.0,
            salePrice: 75.0,
            maxQuantity: 100,
            soldQuantity: 10,
            product: {
              id: 'product-1',
              name: 'Test Product',
              price: 100.0,
            },
          },
        ],
        categories: [],
      },
    ]

    mockPrisma.flashSale.findMany.mockResolvedValue(mockSales)

    const request = new NextRequest('http://localhost:3000/api/flash-sales/active')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(1)
    expect(data[0].status).toBe('ACTIVE')
    expect(data[0].isActive).toBe(true)
  })

  it('should only return active and non-expired sales', async () => {
    const now = new Date()
    const past = new Date(now.getTime() - 86400000) // Yesterday

    mockPrisma.flashSale.findMany.mockResolvedValue([])

    const request = new NextRequest('http://localhost:3000/api/flash-sales/active')
    await GET(request)

    expect(mockPrisma.flashSale.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'ACTIVE',
          isActive: true,
          endDate: {
            gt: expect.any(Date),
          },
        }),
      })
    )
  })

  it('should handle database errors', async () => {
    mockPrisma.flashSale.findMany.mockRejectedValue(new Error('DB Error'))

    const request = new NextRequest('http://localhost:3000/api/flash-sales/active')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to fetch active flash sales')
  })
})

