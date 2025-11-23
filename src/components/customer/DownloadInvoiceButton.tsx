'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { generateInvoice } from '@/lib/invoice-generator';
import toast from 'react-hot-toast';

interface DownloadInvoiceButtonProps {
    order: any;
}

export function DownloadInvoiceButton({ order }: DownloadInvoiceButtonProps) {
    const [invoiceFeatureEnabled, setInvoiceFeatureEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkInvoiceFeature();
    }, []);

    const checkInvoiceFeature = async () => {
        try {
            const response = await fetch('/api/features/enabled');
            if (response.ok) {
                const data = await response.json();
                setInvoiceFeatureEnabled(data.features?.includes('invoice_generator') || false);
            }
        } catch (error) {
            console.error('Error checking invoice feature:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadInvoice = async () => {
        try {
            await generateInvoice(order);
            toast.success('Invoice downloaded successfully');
        } catch (error) {
            console.error('Error generating invoice:', error);
            toast.error('Failed to generate invoice');
        }
    };

    if (!invoiceFeatureEnabled) {
        return null;
    }

    return (
        <Button variant="outline" onClick={handleDownloadInvoice} disabled={loading}>
            <FileText className="w-4 h-4 mr-2" />
            Download Invoice
        </Button>
    );
}
