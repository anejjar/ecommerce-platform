import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FreeShippingBar } from '@/components/checkout/FreeShippingBar'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { role: 'CUSTOMER' } }, status: 'authenticated' }),
}))

describe('FreeShippingBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders progress bar when below threshold', () => {
    render(<FreeShippingBar currentTotal={30} threshold={50} />)

    expect(screen.getByText(/Add.*more for free shipping/i)).toBeInTheDocument()
  })

  it('shows remaining amount correctly', () => {
    render(<FreeShippingBar currentTotal={30} threshold={50} />)

    const text = screen.getByText(/Add.*20.*MAD more/i)
    expect(text).toBeInTheDocument()
  })

  it('shows success message when threshold is reached', () => {
    render(<FreeShippingBar currentTotal={50} threshold={50} />)

    expect(screen.getByText(/qualified for free shipping/i)).toBeInTheDocument()
  })

  it('shows success message when threshold is exceeded', () => {
    render(<FreeShippingBar currentTotal={60} threshold={50} />)

    expect(screen.getByText(/qualified for free shipping/i)).toBeInTheDocument()
  })

  it('renders with custom text', () => {
    render(
      <FreeShippingBar
        currentTotal={30}
        threshold={50}
        text="Spend {amount} more for free shipping!"
      />
    )

    expect(screen.getByText(/Spend.*20.*MAD more for free shipping/i)).toBeInTheDocument()
  })

  it('calculates percentage correctly', () => {
    const { container } = render(<FreeShippingBar currentTotal={25} threshold={50} />)

    const progressBar = container.querySelector('.bg-blue-500')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveStyle({ width: '50%' })
  })

  it('shows green progress bar when eligible', () => {
    const { container } = render(<FreeShippingBar currentTotal={50} threshold={50} />)

    const progressBar = container.querySelector('.bg-green-500')
    expect(progressBar).toBeInTheDocument()
  })

  it('handles zero current total', () => {
    render(<FreeShippingBar currentTotal={0} threshold={50} />)

    expect(screen.getByText(/Add.*50.*MAD more/i)).toBeInTheDocument()
  })

  it('handles negative current total gracefully', () => {
    render(<FreeShippingBar currentTotal={-10} threshold={50} />)

    // Should show full threshold amount
    expect(screen.getByText(/Add.*50.*MAD more/i)).toBeInTheDocument()
  })
})
