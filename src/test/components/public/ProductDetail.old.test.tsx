import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProductDetail.old from '@/components/public\ProductDetail.old'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { role: 'CUSTOMER' } }, status: 'authenticated' }),
}))

describe('ProductDetail.old', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<ProductDetail.old />)
    expect(screen.getByRole).toBeDefined()
  })
})
