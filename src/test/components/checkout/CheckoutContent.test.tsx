import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CheckoutContent } from '@/components/public/CheckoutContent';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import * as reduxHooks from '@/lib/redux/hooks';

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
    useSession: vi.fn(),
}));

// Mock next/image
vi.mock('next/image', () => ({
    default: (props: any) => <img {...props} />,
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock redux hooks
vi.mock('@/lib/redux/hooks', () => ({
    useAppSelector: vi.fn(),
    useAppDispatch: vi.fn(),
}));

// Mock global fetch
global.fetch = vi.fn();

describe('CheckoutContent', () => {
    const mockRouter = { push: vi.fn() };
    const mockDispatch = vi.fn();
    const mockCartItems = [
        {
            id: '1',
            productId: 'prod-1',
            name: 'Test Product',
            price: 100,
            quantity: 1,
            image: '/test.jpg',
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as any).mockReturnValue(mockRouter);
        (useSession as any).mockReturnValue({ data: null, status: 'unauthenticated' });
        (reduxHooks.useAppDispatch as any).mockReturnValue(mockDispatch);
        (reduxHooks.useAppSelector as any).mockReturnValue(mockCartItems);
    });

    it('renders checkout form and order summary', () => {
        render(<CheckoutContent />);

        expect(screen.getByText('Checkout')).toBeInTheDocument();
        expect(screen.getByText('Contact Information')).toBeInTheDocument();
        expect(screen.getByText('Order Summary')).toBeInTheDocument();
        expect(screen.getByText('Test Product')).toBeInTheDocument();
        const prices = screen.getAllByText('$100.00');
        expect(prices).toHaveLength(2); // Item price and Subtotal/Total
    });

    it('handles discount code application', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({
                id: 'disc-1',
                code: 'SAVE10',
                type: 'PERCENTAGE',
                value: 10,
                discountAmount: 10,
            }),
        });

        render(<CheckoutContent />);

        const discountInput = screen.getByPlaceholderText('Enter code');
        const applyButton = screen.getByText('Apply');

        fireEvent.change(discountInput, { target: { value: 'SAVE10' } });
        fireEvent.click(applyButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/discounts/validate', expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    code: 'SAVE10',
                    cartTotal: 100,
                }),
            }));
        });

        expect(screen.getByText('Discount applied: SAVE10')).toBeInTheDocument();
        expect(screen.getByText('-$10.00')).toBeInTheDocument();
    });

    it('handles invalid discount code', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'Invalid discount code' }),
        });

        render(<CheckoutContent />);

        const discountInput = screen.getByPlaceholderText('Enter code');
        const applyButton = screen.getByText('Apply');

        fireEvent.change(discountInput, { target: { value: 'INVALID' } });
        fireEvent.click(applyButton);

        await waitFor(() => {
            expect(screen.getByText('Invalid discount code')).toBeInTheDocument();
        });
    });

    it('removes applied discount', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({
                id: 'disc-1',
                code: 'SAVE10',
                type: 'PERCENTAGE',
                value: 10,
                discountAmount: 10,
            }),
        });

        render(<CheckoutContent />);

        // Apply discount first
        const discountInput = screen.getByPlaceholderText('Enter code');
        const applyButton = screen.getByText('Apply');
        fireEvent.change(discountInput, { target: { value: 'SAVE10' } });
        fireEvent.click(applyButton);

        await waitFor(() => {
            expect(screen.getByText('Discount applied: SAVE10')).toBeInTheDocument();
        });

        // Remove discount
        const removeButton = screen.getByText('Remove');
        fireEvent.click(removeButton);

        expect(screen.queryByText('Discount applied: SAVE10')).not.toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter code')).toHaveValue('');
    });
});
