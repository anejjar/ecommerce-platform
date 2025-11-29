import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SessionProvider } from '@/components/SessionProvider'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSession: () => ({ data: { user: { role: 'CUSTOMER' } }, status: 'authenticated' }),
}))

describe('SessionProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children without crashing', () => {
    render(
      <SessionProvider>
        <div>Test Content</div>
      </SessionProvider>
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })
})
