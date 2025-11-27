import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockPrisma, resetAllMocks } from '@/test/helpers/mocks'

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))

describe('lib/translations', () => {
  beforeEach(() => {
    resetAllMocks()
  })

  it('exports functions', async () => {
    const module = await import('@/lib/translations')
    expect(module).toBeDefined()
    expect(Object.keys(module).length).toBeGreaterThan(0)
  })
})
