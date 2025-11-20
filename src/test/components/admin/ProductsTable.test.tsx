import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useRouter } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

// Mock next/image
vi.mock('next/image', () => ({
    default: (props: any) => <img {...props} />,
}));

// Mock ProductActions
vi.mock('@/components/admin/ProductActions', () => ({
    ProductActions: () => <div data-testid="product-actions">Actions</div>,
}));

// Mock global fetch
global.fetch = vi.fn();

// Mock window.confirm
global.confirm = vi.fn();

const mockProducts = [
    {
        id: 'prod-1',
        name: 'Product 1',
        price: '100.00',
        comparePrice: null,
        stock: 10,
        published: true,
        featured: false,
        category: { name: 'Category 1' },
        images: [{ url: '/img1.jpg', alt: 'Img 1' }],
    },
    {
        id: 'prod-2',
        name: 'Product 2',
        price: '200.00',
        comparePrice: '250.00',
        stock: 5,
        published: false,
        featured: true,
        category: { name: 'Category 2' },
        images: [],
    },
];

describe('ProductsTable', () => {
    const mockRouter = { refresh: vi.fn() };

    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as any).mockReturnValue(mockRouter);
    });

    it('renders product list correctly', () => {
        render(<ProductsTable products={mockProducts} />);

        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
        expect(screen.getByText('$100.00')).toBeInTheDocument();
        expect(screen.getByText('$200.00')).toBeInTheDocument();
        expect(screen.getByText('Category 1')).toBeInTheDocument();
        expect(screen.getByText('Category 2')).toBeInTheDocument();
        expect(screen.getByText('Published')).toBeInTheDocument();
        expect(screen.getByText('Draft')).toBeInTheDocument();
    });

    it('handles select all functionality', () => {
        render(<ProductsTable products={mockProducts} />);

        const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(selectAllCheckbox);

        const checkboxes = screen.getAllByRole('checkbox');
        // 1 select all + 2 product checkboxes = 3
        expect(checkboxes[1]).toBeChecked();
        expect(checkboxes[2]).toBeChecked();
        expect(screen.getByText('2 products selected')).toBeInTheDocument();

        fireEvent.click(selectAllCheckbox);
        expect(checkboxes[1]).not.toBeChecked();
        expect(checkboxes[2]).not.toBeChecked();
    });

    it('handles select one functionality', () => {
        render(<ProductsTable products={mockProducts} />);

        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[1]); // Select first product

        expect(checkboxes[1]).toBeChecked();
        expect(checkboxes[2]).not.toBeChecked();
        expect(screen.getByText('1 product selected')).toBeInTheDocument();
    });

    it('handles bulk delete', async () => {
        (global.confirm as any).mockReturnValue(true);
        (global.fetch as any).mockResolvedValue({ ok: true });

        render(<ProductsTable products={mockProducts} />);

        // Select all
        const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(selectAllCheckbox);

        // Click delete
        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);

        expect(global.confirm).toHaveBeenCalled();

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/products/bulk', expect.objectContaining({
                method: 'DELETE',
                body: JSON.stringify({ ids: ['prod-1', 'prod-2'] }),
            }));
        });

        expect(mockRouter.refresh).toHaveBeenCalled();
    });

    it('handles bulk publish', async () => {
        (global.fetch as any).mockResolvedValue({ ok: true });

        render(<ProductsTable products={mockProducts} />);

        // Select first product
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[1]);

        // Click publish
        const publishButton = screen.getByText('Publish');
        fireEvent.click(publishButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/products/bulk', expect.objectContaining({
                method: 'PATCH',
                body: JSON.stringify({
                    ids: ['prod-1'],
                    data: { published: true },
                }),
            }));
        });

        expect(mockRouter.refresh).toHaveBeenCalled();
    });
});
