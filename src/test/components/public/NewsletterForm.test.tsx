import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NewsletterForm } from '@/components/public/NewsletterForm';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import toast from 'react-hot-toast';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock global fetch
global.fetch = vi.fn();

// Mock next-intl
vi.mock('next-intl', () => ({
    useTranslations: () => (key: string) => {
        const translations: Record<string, string> = {
            'newsletter.enterEmail': 'Please enter your email',
            'newsletter.success': 'Successfully subscribed to newsletter!',
            'newsletter.error': 'Failed to subscribe',
            'newsletter.genericError': 'Something went wrong',
            'newsletter.thankYou': 'Thank you for subscribing!',
            'newsletter.name': 'Name',
            'newsletter.namePlaceholder': 'Your name (optional)',
            'newsletter.email': 'Email',
            'newsletter.emailPlaceholder': 'Enter your email',
            'newsletter.subscribe': 'Subscribe',
            'newsletter.subscribing': 'Subscribing...',
            'newsletter.disclaimer': 'Get exclusive deals and updates.',
        };
        return translations[key] || key;
    },
}));

describe('NewsletterForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders newsletter form correctly', () => {
        render(<NewsletterForm />);

        expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
        expect(screen.getByText('Subscribe')).toBeInTheDocument();
        expect(screen.getByText('Get exclusive deals and updates.')).toBeInTheDocument();
    });

    it('shows name field when showName is true', () => {
        render(<NewsletterForm showName={true} />);

        expect(screen.getByPlaceholderText('Your name (optional)')).toBeInTheDocument();
    });

    it('handles successful subscription', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ message: 'Successfully subscribed' }),
        });

        render(<NewsletterForm source="footer" />);

        const emailInput = screen.getByPlaceholderText('Enter your email');
        const submitButton = screen.getByText('Subscribe');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'test@example.com',
                    name: undefined,
                    source: 'footer',
                }),
            });
        });

        expect(toast.success).toHaveBeenCalledWith('Successfully subscribed to newsletter!');
        expect(screen.getByText('Thank you for subscribing!')).toBeInTheDocument();
    });

    it('handles subscription error', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'Email is already subscribed' }),
        });

        render(<NewsletterForm />);

        const emailInput = screen.getByPlaceholderText('Enter your email');
        const submitButton = screen.getByText('Subscribe');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Email is already subscribed');
        });
    });

    it('includes name in submission when provided', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ message: 'Successfully subscribed' }),
        });

        render(<NewsletterForm showName={true} />);

        const nameInput = screen.getByPlaceholderText('Your name (optional)');
        const emailInput = screen.getByPlaceholderText('Enter your email');
        const submitButton = screen.getByText('Subscribe');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'john@example.com',
                    name: 'John Doe',
                    source: 'footer',
                }),
            });
        });
    });
});
