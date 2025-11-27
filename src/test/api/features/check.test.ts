import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '@/app/api/features/check/route'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { mockPrisma, mockAdminSession, resetAllMocks } from '@/test/helpers/mocks'

vi.mock('next-auth')

describe('/api/features/check', () => {
  beforeEach(() => {
    resetAllMocks()
  })

  it('returns feature enabled status', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminSession)
    mockPrisma.featureFlag.findUnique.mockResolvedValue({ name: 'test_feature', enabled: true, displayName: 'Test', description: '', category: 'test', tier: 'PRO', createdAt: new Date(), updatedAt: new Date() })

    const req = new NextRequest('http://localhost/api/features/check?feature=test_feature')
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.enabled).toBe(true)
    expect(data.feature).toBe('test_feature')
  })

  it('returns 401 for unauthorized', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/features/check?feature=test')
    const response = await GET(req)
    expect(response.status).toBe(401)
  })

  it('returns 400 when feature name missing', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminSession)

    const req = new NextRequest('http://localhost/api/features/check')
    const response = await GET(req)
    expect(response.status).toBe(400)
  })
})
