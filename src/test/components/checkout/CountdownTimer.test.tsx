import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CountdownTimer } from '@/components/checkout/CountdownTimer'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { role: 'CUSTOMER' } }, status: 'authenticated' }),
}))

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders countdown timer with future date', () => {
    const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
    render(<CountdownTimer endDate={futureDate} />)

    expect(screen.getByText(/Limited Time Offer!/i)).toBeInTheDocument()
  })

  it('renders with custom text', () => {
    const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000)
    render(<CountdownTimer endDate={futureDate} text="Special Offer!" />)

    expect(screen.getByText('Special Offer!')).toBeInTheDocument()
  })

  it('displays days when more than 24 hours remaining', () => {
    const futureDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
    render(<CountdownTimer endDate={futureDate} />)

    expect(screen.getByText(/Days/i)).toBeInTheDocument()
  })

  it('displays hours when less than 24 hours remaining', () => {
    const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
    render(<CountdownTimer endDate={futureDate} />)

    expect(screen.getByText(/Hours/i)).toBeInTheDocument()
  })

  it('displays minutes and seconds', () => {
    const futureDate = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
    render(<CountdownTimer endDate={futureDate} />)

    expect(screen.getByText(/Minutes/i)).toBeInTheDocument()
    expect(screen.getByText(/Seconds/i)).toBeInTheDocument()
  })

  it('returns null when timer has expired', () => {
    const pastDate = new Date(Date.now() - 1000) // 1 second ago
    const { container } = render(<CountdownTimer endDate={pastDate} />)

    expect(container.firstChild).toBeNull()
  })

  it('updates countdown every second', () => {
    const futureDate = new Date(Date.now() + 65 * 1000) // 65 seconds from now
    render(<CountdownTimer endDate={futureDate} />)

    // Advance time by 1 second
    vi.advanceTimersByTime(1000)

    // Component should re-render with updated time
    expect(screen.getByText(/Seconds/i)).toBeInTheDocument()
  })
})
