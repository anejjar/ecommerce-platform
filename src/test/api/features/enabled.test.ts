import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '@/app/api/features/enabled/route'
import { getServerSession } from 'next-auth'
import { mockPrisma, mockAdminSession, resetAllMocks } from '@/test/helpers/mocks'

vi.mock('next-auth')

describe('/api/features/enabled', () => {
  beforeEach(() => {
    resetAllMocks()
  })

  it('returns enabled features for admin', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminSession)
    mockPrisma.featureFlag.findMany.mockResolvedValue([
      { name: 'email_campaigns' },
      { name: 'analytics_dashboard' },
    ])

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.features).toEqual(['email_campaigns', 'analytics_dashboard'])
  })

  it('returns 401 for unauthorized', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)

    const response = await GET()
    expect(response.status).toBe(401)
  })

  it('handles database errors', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminSession)
    mockPrisma.featureFlag.findMany.mockRejectedValue(new Error('DB error'))

    const response = await GET()
    expect(response.status).toBe(500)
  })
})
