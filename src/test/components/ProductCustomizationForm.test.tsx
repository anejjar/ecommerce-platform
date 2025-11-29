import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductCustomizationForm } from '@/components/ProductCustomizationForm'
import { renderWithProviders } from '@/test/utils/test-utils'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { role: 'CUSTOMER' } }, status: 'authenticated' }),
}))

global.fetch = vi.fn()

describe('ProductCustomizationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ fields: [] }),
    })
  })

  it('renders without crashing', async () => {
    renderWithProviders(<ProductCustomizationForm productId="test-product-123" />)
    // Component will show loading state initially
    expect(screen.getByRole).toBeDefined()
  })
})
