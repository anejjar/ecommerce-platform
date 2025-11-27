import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProductCustomizationFields from '@/components/admin\ProductCustomizationFields'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { role: 'ADMIN' } }, status: 'authenticated' }),
}))

describe('ProductCustomizationFields', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<ProductCustomizationFields />)
    expect(screen.getByRole).toBeDefined()
  })
})
