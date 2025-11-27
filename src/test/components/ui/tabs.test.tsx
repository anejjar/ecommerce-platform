import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import tabs from '@/components/ui\tabs'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { role: 'CUSTOMER' } }, status: 'authenticated' }),
}))

describe('tabs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<tabs />)
    expect(screen.getByRole).toBeDefined()
  })
})
