import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  TrustBadges,
  SecuritySeals,
  CustomerServiceDisplay,
  TrustRating,
  OrderCountTicker,
} from '@/components/checkout/TrustElements'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { role: 'CUSTOMER' } }, status: 'authenticated' }),
}))

describe('TrustElements', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('TrustBadges', () => {
    const mockBadges = [
      {
        id: 'badge-1',
        url: 'https://example.com/badge1.png',
        alt: 'Badge 1',
        position: 'header' as const,
        link: 'https://example.com',
      },
      {
        id: 'badge-2',
        url: 'https://example.com/badge2.png',
        alt: 'Badge 2',
        position: 'footer' as const,
        link: null,
      },
    ]

    it('renders badges without crashing', () => {
      render(<TrustBadges badges={mockBadges} />)
      expect(screen.getByAltText('Badge 1')).toBeInTheDocument()
      expect(screen.getByAltText('Badge 2')).toBeInTheDocument()
    })

    it('filters badges by position', () => {
      render(<TrustBadges badges={mockBadges} position="header" />)
      expect(screen.getByAltText('Badge 1')).toBeInTheDocument()
      expect(screen.queryByAltText('Badge 2')).not.toBeInTheDocument()
    })

    it('returns null when no badges match position', () => {
      const { container } = render(<TrustBadges badges={mockBadges} position="payment" />)
      expect(container.firstChild).toBeNull()
    })

    it('returns null when badges array is empty', () => {
      const { container } = render(<TrustBadges badges={[]} />)
      expect(container.firstChild).toBeNull()
    })

    it('renders badge with link', () => {
      render(<TrustBadges badges={mockBadges} />)
      const link = screen.getByAltText('Badge 1').closest('a')
      expect(link).toHaveAttribute('href', 'https://example.com')
      expect(link).toHaveAttribute('target', '_blank')
    })

    it('renders badge without link', () => {
      render(<TrustBadges badges={mockBadges} />)
      const badge2 = screen.getByAltText('Badge 2')
      expect(badge2.closest('a')).toBeNull()
    })
  })

  describe('SecuritySeals', () => {
    it('renders security seals when show is true', () => {
      render(<SecuritySeals show={true} />)
      expect(screen.getByText(/Secure Checkout/i)).toBeInTheDocument()
    })

    it('returns null when show is false', () => {
      const { container } = render(<SecuritySeals show={false} />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('CustomerServiceDisplay', () => {
    it('renders customer service info', () => {
      render(<CustomerServiceDisplay phone="123-456-7890" email="support@example.com" />)
      expect(screen.getByText(/123-456-7890/i)).toBeInTheDocument()
      expect(screen.getByText(/support@example.com/i)).toBeInTheDocument()
    })

    it('handles missing phone', () => {
      render(<CustomerServiceDisplay email="support@example.com" />)
      expect(screen.getByText(/support@example.com/i)).toBeInTheDocument()
    })

    it('handles missing email', () => {
      render(<CustomerServiceDisplay phone="123-456-7890" />)
      expect(screen.getByText(/123-456-7890/i)).toBeInTheDocument()
    })
  })

  describe('TrustRating', () => {
    it('renders rating with stars', () => {
      render(<TrustRating rating={4.5} reviewCount={100} />)
      expect(screen.getByText(/4.5/i)).toBeInTheDocument()
      expect(screen.getByText(/100/i)).toBeInTheDocument()
    })

    it('handles zero reviews', () => {
      render(<TrustRating rating={0} reviewCount={0} />)
      expect(screen.getByText(/0/i)).toBeInTheDocument()
    })
  })

  describe('OrderCountTicker', () => {
    it('renders order count', () => {
      render(<OrderCountTicker count={1234} />)
      expect(screen.getByText(/1234/i)).toBeInTheDocument()
    })

    it('handles zero orders', () => {
      render(<OrderCountTicker count={0} />)
      expect(screen.getByText(/0/i)).toBeInTheDocument()
    })
  })
})
