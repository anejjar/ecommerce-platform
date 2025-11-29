import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, PUT, DELETE } from '@/app/api/admin/flash-sales/[id]/route'
import { NextRequest } from 'next/server'
import { mockPrisma, mockAdminSession, resetAllMocks } from '@/test/helpers/mocks'

vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Headers()),
}))

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))

vi.mock('@/lib/features', () => ({
  isFeatureEnabled: vi.fn(() => Promise.resolve(true)),
}))

import { getServerSession } from 'next-auth'
import { isFeatureEnabled } from '@/lib/features'

const mockGetServerSession = getServerSession as any
const mockIsFeatureEnabled = isFeatureEnabled as any

describe('Admin Flash Sales API - GET /api/admin/flash-sales/[id]', () => {
  beforeEach(() => {
    resetAllMocks()
    mockIsFeatureEnabled.mockResolvedValue(true)
  })

  it('should return 404 if feature is disabled', async () => {
    mockIsFeatureEnabled.mockResolvedValue(false)
    mockGetServerSession.mockResolvedValue(mockAdminSession)

    const request = new NextRequest('http://localhost:3000/api/admin/flash-sales/sale-1')
    const response = await GET(request, { params: Promise.resolve({ id: 'sale-1' }) })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Feature not available')
  })

  it('should return flash sale by id', async () => {
    mockGetServerSession.mockResolvedValue(mockAdminSession)

    const mockSale = {
      id: 'sale-1',
      name: 'Summer Sale',
      status: 'ACTIVE',
      products: [],
      categories: [],
    }

    mockPrisma.flashSale.findUnique.mockResolvedValue(mockSale)

    const request = new NextRequest('http://localhost:3000/api/admin/flash-sales/sale-1')
    const response = await GET(request, { params: Promise.resolve({ id: 'sale-1' }) })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.id).toBe('sale-1')
    expect(data.name).toBe('Summer Sale')
  })

  it('should return 404 if flash sale not found', async () => {
    mockGetServerSession.mockResolvedValue(mockAdminSession)
    mockPrisma.flashSale.findUnique.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/admin/flash-sales/invalid')
    const response = await GET(request, { params: Promise.resolve({ id: 'invalid' }) })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Flash sale not found')
  })
})

describe('Admin Flash Sales API - PUT /api/admin/flash-sales/[id]', () => {
  beforeEach(() => {
    resetAllMocks()
    mockIsFeatureEnabled.mockResolvedValue(true)
  })

  it('should update flash sale', async () => {
    mockGetServerSession.mockResolvedValue(mockAdminSession)

    const existingSale = {
      id: 'sale-1',
      name: 'Old Name',
      discountType: 'PERCENTAGE',
      discountValue: 20.0,
    }

    const updatedSale = {
      ...existingSale,
      name: 'New Name',
    }

    mockPrisma.flashSale.findUnique = vi.fn().mockResolvedValue(existingSale)
    mockPrisma.$transaction = vi.fn().mockImplementation(async (callback) => {
      const tx = {
        flashSale: {
          update: vi.fn().mockResolvedValue(updatedSale),
          findUnique: vi.fn().mockResolvedValue(updatedSale),
        },
        flashSaleProduct: {
          deleteMany: vi.fn().mockResolvedValue({}),
          createMany: vi.fn().mockResolvedValue({}),
        },
        flashSaleCategory: {
          deleteMany: vi.fn().mockResolvedValue({}),
          createMany: vi.fn().mockResolvedValue({}),
        },
        product: {
          findMany: vi.fn().mockResolvedValue([]),
        },
      }
      return callback(tx)
    })

    const request = new NextRequest('http://localhost:3000/api/admin/flash-sales/sale-1', {
      method: 'PUT',
      body: JSON.stringify({ name: 'New Name' }),
    })
    const response = await PUT(request, { params: Promise.resolve({ id: 'sale-1' }) })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.name).toBe('New Name')
  })

  it('should validate endDate is after startDate', async () => {
    mockGetServerSession.mockResolvedValue(mockAdminSession)

    const request = new NextRequest('http://localhost:3000/api/admin/flash-sales/sale-1', {
      method: 'PUT',
      body: JSON.stringify({
        startDate: '2024-12-31T00:00:00Z',
        endDate: '2024-12-01T00:00:00Z',
      }),
    })
    const response = await PUT(request, { params: Promise.resolve({ id: 'sale-1' }) })
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('End date')
  })
})

describe('Admin Flash Sales API - DELETE /api/admin/flash-sales/[id]', () => {
  beforeEach(() => {
    resetAllMocks()
    mockIsFeatureEnabled.mockResolvedValue(true)
  })

  it('should delete flash sale', async () => {
    mockGetServerSession.mockResolvedValue(mockAdminSession)
    mockPrisma.flashSale.delete.mockResolvedValue({ id: 'sale-1' })

    const request = new NextRequest('http://localhost:3000/api/admin/flash-sales/sale-1', {
      method: 'DELETE',
    })
    const response = await DELETE(request, { params: Promise.resolve({ id: 'sale-1' }) })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBe('Flash sale deleted successfully')
  })

  it('should return 404 if flash sale not found', async () => {
    mockGetServerSession.mockResolvedValue(mockAdminSession)
    mockPrisma.flashSale.delete.mockRejectedValue({ code: 'P2025' })

    const request = new NextRequest('http://localhost:3000/api/admin/flash-sales/invalid', {
      method: 'DELETE',
    })
    const response = await DELETE(request, { params: Promise.resolve({ id: 'invalid' }) })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Flash sale not found')
  })
})

