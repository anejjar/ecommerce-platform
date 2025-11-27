import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { mockPrisma, mockAdminSession, mockCustomerSession, resetAllMocks } from '@/test/helpers/mocks'

vi.mock('next-auth')

describe('regions', () => {
  beforeEach(() => {
    resetAllMocks()
  })

  it('returns 401 for unauthorized requests', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)
    const req = new NextRequest('http://localhostregions')

    // Test first available method
    const { GET } = await import('@/app/apiregions/route')
    if (GET) {
      const response = await GET(req)
      expect(response.status).toBe(401)
    }
  })

  it('handles authorized requests', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockCustomerSession)
    mockPrisma.product = mockPrisma.product || {}
    Object.keys(mockPrisma).forEach(key => {
      if (mockPrisma[key].findMany) mockPrisma[key].findMany.mockResolvedValue([])
      if (mockPrisma[key].findUnique) mockPrisma[key].findUnique.mockResolvedValue(null)
      if (mockPrisma[key].create) mockPrisma[key].create.mockResolvedValue({ id: 'test-id' })
      if (mockPrisma[key].update) mockPrisma[key].update.mockResolvedValue({ id: 'test-id' })
      if (mockPrisma[key].delete) mockPrisma[key].delete.mockResolvedValue({ id: 'test-id' })
    })

    const req = new NextRequest('http://localhostregions')
    const { GET } = await import('@/app/apiregions/route')
    if (GET) {
      const response = await GET(req)
      expect([200, 404]).toContain(response.status)
    }
  })
})
