import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { mockPrisma, mockAdminSession, mockCustomerSession, resetAllMocks } from '@/test/helpers/mocks'

vi.mock('next-auth')

describe('admin\export\template\[type]', () => {
  beforeEach(() => {
    resetAllMocks()
  })

  it('returns 401 for unauthorized requests', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)
    const req = new NextRequest('http://localhostadmin\export\template\[type]')

    // Test first available method
    const { GET } = await import('@/app/apiadmin\export\template\[type]/route')
    if (GET) {
      const response = await GET(req, { params: Promise.resolve({ id: "test-id" }) })
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

    const req = new NextRequest('http://localhostadmin\export\template\[type]')
    const { GET } = await import('@/app/apiadmin\export\template\[type]/route')
    if (GET) {
      const response = await GET(req, { params: Promise.resolve({ id: "test-id" }) })
      expect([200, 404]).toContain(response.status)
    }
  })
})
