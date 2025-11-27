import { render, screen, fireEvent } from '@testing-library/react'
import { ProductsFilter } from '@/components/admin/ProductsFilter'
import { vi, describe, it, expect } from 'vitest'

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Search: () => <div data-testid="icon-search" />,
}))

const mockCategories = [
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Clothing' },
  { id: '3', name: 'Books' },
]

describe('ProductsFilter', () => {
  it('renders all filter inputs', () => {
    const onFilterChange = vi.fn()
    render(<ProductsFilter categories={mockCategories} onFilterChange={onFilterChange} />)

    expect(screen.getByLabelText('Search')).toBeInTheDocument()
    expect(screen.getByLabelText('Category')).toBeInTheDocument()
    expect(screen.getByLabelText('Status')).toBeInTheDocument()
    expect(screen.getByLabelText('Featured')).toBeInTheDocument()
  })

  it('renders all categories in dropdown', () => {
    const onFilterChange = vi.fn()
    render(<ProductsFilter categories={mockCategories} onFilterChange={onFilterChange} />)

    const categorySelect = screen.getByLabelText('Category')
    expect(categorySelect).toBeInTheDocument()

    mockCategories.forEach(category => {
      expect(screen.getByText(category.name)).toBeInTheDocument()
    })
  })

  it('calls onFilterChange when search input changes', () => {
    const onFilterChange = vi.fn()
    render(<ProductsFilter categories={mockCategories} onFilterChange={onFilterChange} />)

    const searchInput = screen.getByPlaceholderText('Search products...')
    fireEvent.change(searchInput, { target: { value: 'test product' } })

    expect(onFilterChange).toHaveBeenCalledWith({
      search: 'test product',
      categoryId: '',
      status: '',
      featured: '',
    })
  })

  it('calls onFilterChange when category changes', () => {
    const onFilterChange = vi.fn()
    render(<ProductsFilter categories={mockCategories} onFilterChange={onFilterChange} />)

    const categorySelect = screen.getByLabelText('Category')
    fireEvent.change(categorySelect, { target: { value: '1' } })

    expect(onFilterChange).toHaveBeenCalledWith({
      search: '',
      categoryId: '1',
      status: '',
      featured: '',
    })
  })

  it('calls onFilterChange when status changes', () => {
    const onFilterChange = vi.fn()
    render(<ProductsFilter categories={mockCategories} onFilterChange={onFilterChange} />)

    const statusSelect = screen.getByLabelText('Status')
    fireEvent.change(statusSelect, { target: { value: 'published' } })

    expect(onFilterChange).toHaveBeenCalledWith({
      search: '',
      categoryId: '',
      status: 'published',
      featured: '',
    })
  })

  it('calls onFilterChange when featured filter changes', () => {
    const onFilterChange = vi.fn()
    render(<ProductsFilter categories={mockCategories} onFilterChange={onFilterChange} />)

    const featuredSelect = screen.getByLabelText('Featured')
    fireEvent.change(featuredSelect, { target: { value: 'true' } })

    expect(onFilterChange).toHaveBeenCalledWith({
      search: '',
      categoryId: '',
      status: '',
      featured: 'true',
    })
  })

  it('shows all status options', () => {
    const onFilterChange = vi.fn()
    render(<ProductsFilter categories={mockCategories} onFilterChange={onFilterChange} />)

    expect(screen.getByText('All Status')).toBeInTheDocument()
    expect(screen.getByText('Published')).toBeInTheDocument()
    expect(screen.getByText('Draft')).toBeInTheDocument()
  })

  it('shows all featured options', () => {
    const onFilterChange = vi.fn()
    render(<ProductsFilter categories={mockCategories} onFilterChange={onFilterChange} />)

    expect(screen.getByText('All Products')).toBeInTheDocument()
    expect(screen.getByText('Featured Only')).toBeInTheDocument()
    expect(screen.getByText('Non-Featured')).toBeInTheDocument()
  })
})
