import { render, screen } from '@testing-library/react'
import { ProductsList } from '@/components/admin/ProductsList'
import { vi, describe, it, expect } from 'vitest'

// Mock child components
vi.mock('@/components/admin/ProductsFilter', () => ({
  ProductsFilter: ({ onFilterChange }: any) => (
    <div data-testid="products-filter">ProductsFilter</div>
  ),
}))

vi.mock('@/components/admin/ProductsTable', () => ({
  ProductsTable: ({ products }: any) => (
    <div data-testid="products-table">
      {products.map((p: any) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  ),
}))

const mockProducts = [
  {
    id: '1',
    name: 'Product 1',
    price: '10.00',
    comparePrice: '15.00',
    stock: 100,
    published: true,
    featured: true,
    category: { name: 'Electronics' },
    categoryId: 'cat1',
    images: [{ url: '/img1.jpg', alt: 'Product 1' }],
  },
  {
    id: '2',
    name: 'Product 2',
    price: '20.00',
    comparePrice: null,
    stock: 50,
    published: false,
    featured: false,
    category: { name: 'Clothing' },
    categoryId: 'cat2',
    images: [],
  },
]

const mockCategories = [
  { id: 'cat1', name: 'Electronics' },
  { id: 'cat2', name: 'Clothing' },
]

describe('ProductsList', () => {
  it('renders ProductsFilter component', () => {
    render(<ProductsList products={mockProducts} categories={mockCategories} />)

    expect(screen.getByTestId('products-filter')).toBeInTheDocument()
  })

  it('renders ProductsTable with all products initially', () => {
    render(<ProductsList products={mockProducts} categories={mockCategories} />)

    expect(screen.getByTestId('products-table')).toBeInTheDocument()
    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.getByText('Product 2')).toBeInTheDocument()
  })

  it('shows empty message when no products match filters', () => {
    render(<ProductsList products={[]} categories={mockCategories} />)

    expect(screen.getByText('No products found matching your filters.')).toBeInTheDocument()
    expect(screen.queryByTestId('products-table')).not.toBeInTheDocument()
  })
})
