import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import RegionSelect from '@/components/public\RegionSelect'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { role: 'CUSTOMER' } }, status: 'authenticated' }),
}))

describe('RegionSelect', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<RegionSelect />)
    expect(screen.getByRole).toBeDefined()
  })
})
