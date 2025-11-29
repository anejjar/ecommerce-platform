import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '@/app/api/admin/abandoned-carts/route'
import { NextRequest } from 'next/server'
import { mockPrisma, mockAdminSession, resetAllMocks } from '@/test/helpers/mocks'

// Mock Next.js headers
vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Headers()),
}))

// Mock NextAuth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))

// Mock Prisma
vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))

// Mock feature flags
vi.mock('@/lib/features', () => ({
  isFeatureEnabled: vi.fn(() => Promise.resolve(true)),
}))

import { getServerSession } from 'next-auth'
import { isFeatureEnabled } from '@/lib/features'

const mockGetServerSession = getServerSession as any
const mockIsFeatureEnabled = isFeatureEnabled as any

describe('Admin Abandoned Carts API', () => {
  beforeEach(() => {
    resetAllMocks()
    mockIsFeatureEnabled.mockResolvedValue(true)
  })

  describe('GET /api/admin/abandoned-carts', () => {
    it('should return 404 if feature is disabled', async () => {
      mockIsFeatureEnabled.mockResolvedValue(false)
      mockGetServerSession.mockResolvedValue(mockAdminSession)

      const request = new NextRequest('http://localhost:3000/api/admin/abandoned-carts')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Feature not available')
    })

    it('should return 401 if not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/abandoned-carts')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 401 if user is not ADMIN or SUPERADMIN', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'CUSTOMER', email: 'customer@example.com' },
      } as any)

      const request = new NextRequest('http://localhost:3000/api/admin/abandoned-carts')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return list of abandoned carts for ADMIN', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)

      const mockCarts = [
        {
          id: '1',
          userId: 'user1',
          cartSnapshot: JSON.stringify({}),
          abandonedAt: new Date('2024-01-01'),
          status: 'ABANDONED',
          user: { name: 'John Doe', email: 'john@example.com' },
          emails: [],
        },
        {
          id: '2',
          userId: 'user2',
          cartSnapshot: JSON.stringify({}),
          abandonedAt: new Date('2024-01-02'),
          status: 'RECOVERED',
          user: { name: 'Jane Doe', email: 'jane@example.com' },
          emails: [],
        },
      ]

      mockPrisma.abandonedCart.findMany.mockResolvedValue(mockCarts)

      const request = new NextRequest('http://localhost:3000/api/admin/abandoned-carts')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveLength(2)
      expect(data[0].id).toBe('1')
    })

    it('should filter by status', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)

      mockPrisma.abandonedCart.findMany.mockResolvedValue([])

      const request = new NextRequest('http://localhost:3000/api/admin/abandoned-carts?status=PENDING')
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(mockPrisma.abandonedCart.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'PENDING' },
        })
      )
    })

    it('should return all carts when no status filter provided', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)

      mockPrisma.abandonedCart.findMany.mockResolvedValue([])

      const request = new NextRequest('http://localhost:3000/api/admin/abandoned-carts')
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(mockPrisma.abandonedCart.findMany).toHaveBeenCalled()
    })

    it('should handle database errors', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)

      mockPrisma.abandonedCart.findMany.mockRejectedValue(new Error('DB Error'))

      const request = new NextRequest('http://localhost:3000/api/admin/abandoned-carts')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch abandoned carts')
    })
  })
})
