import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IntlProvider } from '@/components/IntlProvider'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { role: 'CUSTOMER' } }, status: 'authenticated' }),
}))

const mockMessages = {
  common: {
    loading: 'Loading...',
  },
}

describe('IntlProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children without crashing', () => {
    render(
      <IntlProvider locale="en" messages={mockMessages}>
        <div>Test Content</div>
      </IntlProvider>
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })
})
