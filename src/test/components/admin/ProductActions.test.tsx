import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProductActions } from '@/components/admin/ProductActions'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import toast from 'react-hot-toast'

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('lucide-react', () => ({
  EllipsisVertical: () => <div data-testid="icon-ellipsis" />,
}))

describe('ProductActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it('renders actions dropdown trigger', () => {
    render(<ProductActions productId="123" />)

    const trigger = screen.getByRole('button')
    expect(trigger).toBeInTheDocument()
    expect(screen.getByTestId('icon-ellipsis')).toBeInTheDocument()
  })

  it('shows edit and delete options on click', () => {
    render(<ProductActions productId="123" />)

    const trigger = screen.getByRole('button')
    fireEvent.click(trigger)

    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('opens delete confirmation dialog when delete is clicked', () => {
    render(<ProductActions productId="123" />)

    const trigger = screen.getByRole('button')
    fireEvent.click(trigger)

    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    expect(screen.getByText('Delete Product')).toBeInTheDocument()
    expect(screen.getByText(/Are you sure you want to delete this product/)).toBeInTheDocument()
  })

  it('deletes product successfully', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response)
    ) as any

    render(<ProductActions productId="123" />)

    // Open dropdown
    const trigger = screen.getByRole('button')
    fireEvent.click(trigger)

    // Click delete
    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /Delete/i })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/products/123',
        expect.objectContaining({ method: 'DELETE' })
      )
      expect(toast.success).toHaveBeenCalledWith('Product deleted successfully')
    })
  })

  it('shows error when deletion fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to delete' }),
      } as Response)
    ) as any

    render(<ProductActions productId="123" />)

    // Open dropdown
    const trigger = screen.getByRole('button')
    fireEvent.click(trigger)

    // Click delete
    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /Delete/i })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to delete product')
    })
  })

  it('can cancel deletion', () => {
    render(<ProductActions productId="123" />)

    // Open dropdown
    const trigger = screen.getByRole('button')
    fireEvent.click(trigger)

    // Click delete
    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    // Cancel
    const cancelButton = screen.getByRole('button', { name: /Cancel/i })
    fireEvent.click(cancelButton)

    expect(global.fetch).not.toHaveBeenCalled()
  })
})
