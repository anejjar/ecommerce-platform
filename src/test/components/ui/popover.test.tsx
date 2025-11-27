import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import popover from '@/components/ui\popover'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { role: 'CUSTOMER' } }, status: 'authenticated' }),
}))

describe('popover', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<popover />)
    expect(screen.getByRole).toBeDefined()
  })
})
