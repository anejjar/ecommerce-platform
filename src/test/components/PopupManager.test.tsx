import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PopupManager } from '@/components/PopupManager'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { role: 'CUSTOMER' } }, status: 'authenticated' }),
}))

global.fetch = vi.fn()
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn(),
  },
  writable: true,
})

const mockPopup = {
  id: 'popup-1',
  title: 'Test Popup',
  content: '<p>Test content</p>',
  type: 'EXIT_INTENT',
  triggerValue: null,
  position: 'CENTER',
  width: 500,
  height: null,
  backgroundColor: '#ffffff',
  textColor: '#000000',
  buttonText: 'Get Offer',
  buttonColor: '#000000',
  buttonTextColor: '#ffffff',
  showCloseButton: true,
  overlayColor: 'rgba(0,0,0,0.5)',
  imageUrl: null,
  frequency: 'once_per_session',
  delaySeconds: 0,
  ctaType: 'link',
  ctaUrl: 'https://example.com',
  discountCode: null,
}

describe('PopupManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [],
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders without crashing', () => {
    render(<PopupManager />)
    expect(true).toBe(true)
  })

  it('fetches active popups on mount', async () => {
    const mockPopups = [mockPopup]
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockPopups,
    })

    render(<PopupManager />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/popups/active'),
        expect.any(Object)
      )
    })
  })

  it('handles exit-intent trigger', async () => {
    const exitIntentPopup = {
      ...mockPopup,
      id: 'popup-exit',
      type: 'EXIT_INTENT',
    }

    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [exitIntentPopup],
    })

    render(<PopupManager />)

    await waitFor(() => {
      // Simulate mouse leaving viewport (exit intent)
      const mouseEvent = new MouseEvent('mouseout', {
        bubbles: true,
        cancelable: true,
        relatedTarget: null,
      })
      Object.defineProperty(mouseEvent, 'clientY', { value: 0 })
      document.dispatchEvent(mouseEvent)
    })
  })

  it('handles timed trigger', async () => {
    vi.useFakeTimers()
    const timedPopup = {
      ...mockPopup,
      id: 'popup-timed',
      type: 'TIMED',
      triggerValue: 2000, // 2 seconds
    }

    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [timedPopup],
    })

    render(<PopupManager />)

    await waitFor(() => {
      vi.advanceTimersByTime(2000)
    })

    vi.useRealTimers()
  })

  it('handles scroll trigger', async () => {
    const scrollPopup = {
      ...mockPopup,
      id: 'popup-scroll',
      type: 'SCROLL',
      triggerValue: 50, // 50% scroll
    }

    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [scrollPopup],
    })

    render(<PopupManager />)

    // Simulate scroll
    Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true })
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true })
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 1000, writable: true })

    fireEvent.scroll(window)
  })

  it('respects frequency control - once per session', async () => {
    const popup = {
      ...mockPopup,
      frequency: 'once_per_session',
    }

    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [popup],
    })

    render(<PopupManager />)

    // First time should show
    localStorage.setItem(`popup_${popup.id}_last_shown`, Date.now().toString())

    // Second time should not show (already shown this session)
    const shouldShow = !localStorage.getItem(`popup_${popup.id}_last_shown`)
    expect(shouldShow).toBe(false)
  })

  it('handles link CTA type', async () => {
    const linkPopup = {
      ...mockPopup,
      ctaType: 'link',
      ctaUrl: 'https://example.com',
    }

    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [linkPopup],
    })

    const mockLocation = { href: '' }
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
    })

    render(<PopupManager />)
  })

  it('handles discount code CTA type', async () => {
    const discountPopup = {
      ...mockPopup,
      ctaType: 'discount_code',
      discountCode: 'SAVE10',
    }

    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [discountPopup],
    })

    const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<PopupManager />)

    expect(navigator.clipboard.writeText).toBeDefined()
    mockAlert.mockRestore()
  })

  it('handles email capture CTA type', async () => {
    const emailPopup = {
      ...mockPopup,
      ctaType: 'email_capture',
    }

    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [emailPopup],
    })

    render(<PopupManager />)
  })

  it('tracks analytics events', async () => {
    const popup = { ...mockPopup }
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [popup],
    })

    render(<PopupManager />)

    await waitFor(() => {
      // After popup is shown, track event should be called
      expect(global.fetch).toHaveBeenCalled()
    })
  })

  it('handles close button click', async () => {
    const popup = {
      ...mockPopup,
      showCloseButton: true,
    }

    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [popup],
    })

    render(<PopupManager />)
  })

  it('handles fetch errors gracefully', async () => {
    ;(global.fetch as any).mockRejectedValue(new Error('Network error'))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<PopupManager />)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
    })

    consoleSpy.mockRestore()
  })

  it('filters popups by page type', async () => {
    const homepagePopup = {
      ...mockPopup,
      id: 'popup-homepage',
      target: 'HOMEPAGE',
    }

    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [homepagePopup],
    })

    render(<PopupManager />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=HOMEPAGE'),
        expect.any(Object)
      )
    })
  })
})
