import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockPrisma, resetAllMocks } from '@/test/helpers/mocks'

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))

describe('lib/stock-sync', () => {
  beforeEach(() => {
    resetAllMocks()
  })

  it('exports functions', async () => {
    const module = await import('@/lib/stock-sync')
    expect(module).toBeDefined()
    expect(Object.keys(module).length).toBeGreaterThan(0)
  })
})
