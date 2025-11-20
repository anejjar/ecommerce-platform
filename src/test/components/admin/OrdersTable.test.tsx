import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useRouter } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

// Mock global fetch
global.fetch = vi.fn();

// Mock window.confirm
global.confirm = vi.fn();

const mockOrders = [
    {
        id: 'order-1',
        orderNumber: 'ORD-001',
        total: '150.00',
        status: 'PENDING',
        paymentStatus: 'PAID',
        createdAt: new Date('2023-01-01'),
        shippingAddress: {
            address1: '123 Main St',
            address2: null,
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'USA',
            firstName: 'John',
            lastName: 'Doe',
        },
        user: { name: 'John Doe', email: 'john@example.com' },
        items: [{}, {}], // 2 items
        isGuest: false,
    },
    {
        id: 'order-2',
        orderNumber: 'ORD-002',
        total: '75.50',
        status: 'SHIPPED',
        paymentStatus: 'PAID',
        createdAt: new Date('2023-01-02'),
        shippingAddress: {
            address1: '456 Oak Ave',
            address2: 'Apt 2',
            city: 'Los Angeles',
            state: 'CA',
            postalCode: '90001',
            country: 'USA',
            firstName: 'Jane',
            lastName: 'Smith',
        },
        user: null,
        guestEmail: 'jane@guest.com',
        items: [{}], // 1 item
        isGuest: true,
    },
];

describe('OrdersTable', () => {
    const mockRouter = { refresh: vi.fn() };

    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as any).mockReturnValue(mockRouter);
    });

    it('renders order list correctly', () => {
        render(<OrdersTable orders={mockOrders} />);

        expect(screen.getByText('ORD-001')).toBeInTheDocument();
        expect(screen.getByText('ORD-002')).toBeInTheDocument();
        expect(screen.getByText('$150.00')).toBeInTheDocument();
        expect(screen.getByText('$75.50')).toBeInTheDocument();
        expect(screen.getByText('PENDING')).toBeInTheDocument();
        expect(screen.getByText('SHIPPED')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('jane@guest.com')).toBeInTheDocument();
        expect(screen.getByText('Guest Order')).toBeInTheDocument();
    });

    it('handles select all functionality', () => {
        render(<OrdersTable orders={mockOrders} />);

        const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(selectAllCheckbox);

        const checkboxes = screen.getAllByRole('checkbox');
        // 1 select all + 2 order checkboxes = 3
        expect(checkboxes[1]).toBeChecked();
        expect(checkboxes[2]).toBeChecked();
        expect(screen.getByText('2 orders selected')).toBeInTheDocument();

        fireEvent.click(selectAllCheckbox);
        expect(checkboxes[1]).not.toBeChecked();
        expect(checkboxes[2]).not.toBeChecked();
    });

    it('handles bulk status update', async () => {
        (global.confirm as any).mockReturnValue(true);
        (global.fetch as any).mockResolvedValue({ ok: true });

        render(<OrdersTable orders={mockOrders} />);

        // Select first order
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[1]);

        // Click Mark as Shipped
        const shippedButton = screen.getByText('Mark as Shipped');
        fireEvent.click(shippedButton);

        expect(global.confirm).toHaveBeenCalled();

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/orders/bulk', expect.objectContaining({
                method: 'PATCH',
                body: JSON.stringify({
                    ids: ['order-1'],
                    data: { status: 'SHIPPED' },
                }),
            }));
        });

        expect(mockRouter.refresh).toHaveBeenCalled();
    });
});
