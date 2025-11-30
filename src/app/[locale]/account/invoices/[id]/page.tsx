'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Loader2,
    ArrowLeft,
    Download,
    Printer,
    FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Invoice, InvoicePayment } from '@/types/invoice';
import { formatCurrencyWithSymbol } from '@/lib/formatting';

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: session, status } = useSession();
    const router = useRouter();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchInvoice();
        }
    }, [status, id]);

    const fetchInvoice = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/account/invoices/${id}`);
            if (response.ok) {
                const data = await response.json();
                setInvoice(data);
            } else {
                toast.error('Failed to load invoice');
                router.push('/account/invoices');
            }
        } catch (error) {
            console.error('Error fetching invoice:', error);
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!invoice) return;
        try {
            const response = await fetch(`/api/invoices/${id}/download`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Invoice-${invoice.invoiceNumber}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                toast.success('Invoice downloaded');
            } else {
                toast.error('Failed to download invoice');
            }
        } catch (error) {
            console.error('Error downloading invoice:', error);
            toast.error('Failed to download invoice');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, string> = {
            DRAFT: 'bg-gray-100 text-gray-800',
            SENT: 'bg-blue-100 text-blue-800',
            VIEWED: 'bg-purple-100 text-purple-800',
            PAID: 'bg-green-100 text-green-800',
            PARTIALLY_PAID: 'bg-yellow-100 text-yellow-800',
            OVERDUE: 'bg-red-100 text-red-800',
            CANCELLED: 'bg-gray-100 text-gray-800',
            REFUNDED: 'bg-orange-100 text-orange-800',
        };
        return variants[status] || 'bg-gray-100 text-gray-800';
    };

    if (status === 'loading' || loading) {
        return (
            <div className="container mx-auto py-8 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-gray-600">Invoice not found</p>
                        <Link href="/account/invoices">
                            <Button className="mt-4">Back to Invoices</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const billingAddress = typeof invoice.billingAddress === 'string'
        ? JSON.parse(invoice.billingAddress)
        : invoice.billingAddress;

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            {/* Header */}
            <div className="mb-6">
                <Link href="/account/invoices">
                    <Button variant="ghost" size="sm" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Invoices
                    </Button>
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Invoice {invoice.invoiceNumber}</h1>
                        <p className="text-gray-600 mt-1">
                            Issued {new Date(invoice.invoiceDate).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Badge className={getStatusBadge(invoice.status)}>
                            {invoice.status.replace('_', ' ')}
                        </Badge>
                        <Button variant="outline" onClick={handleDownload}>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                        <Button variant="outline" onClick={handlePrint} className="print:hidden">
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                        </Button>
                    </div>
                </div>
            </div>

            {/* Invoice Content */}
            <div className="space-y-6 print:space-y-4">
                {/* Invoice Details */}
                <Card className="print:shadow-none print:border-0">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold mb-2">Bill To:</h3>
                                {invoice.customerName && <p>{invoice.customerName}</p>}
                                {invoice.customerCompany && <p>{invoice.customerCompany}</p>}
                                {invoice.customerEmail && <p className="text-sm text-gray-600">{invoice.customerEmail}</p>}
                                {billingAddress && (
                                    <div className="mt-2 text-sm">
                                        <p>{billingAddress.address1}</p>
                                        {billingAddress.address2 && <p>{billingAddress.address2}</p>}
                                        <p>
                                            {billingAddress.city}
                                            {billingAddress.state && `, ${billingAddress.state}`}
                                            {billingAddress.postalCode && ` ${billingAddress.postalCode}`}
                                        </p>
                                        {billingAddress.country && <p>{billingAddress.country}</p>}
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="space-y-1">
                                    <p><span className="font-semibold">Invoice #:</span> {invoice.invoiceNumber}</p>
                                    <p><span className="font-semibold">Date:</span> {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                                    {invoice.dueDate && (
                                        <p><span className="font-semibold">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Items */}
                <Card className="print:shadow-none print:border-0">
                    <CardHeader>
                        <CardTitle>Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                    <TableHead className="text-right">Unit Price</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoice.items?.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell>{item.sku || '-'}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrencyWithSymbol(item.unitPrice, invoice.currencySymbol)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrencyWithSymbol(item.total, invoice.currencySymbol)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Totals */}
                <Card className="print:shadow-none print:border-0">
                    <CardContent className="pt-6">
                        <div className="flex justify-end">
                            <div className="w-64 space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>{formatCurrencyWithSymbol(invoice.subtotal, invoice.currencySymbol)}</span>
                                </div>
                                {invoice.tax > 0 && (
                                    <div className="flex justify-between">
                                        <span>Tax:</span>
                                        <span>{formatCurrencyWithSymbol(invoice.tax, invoice.currencySymbol)}</span>
                                    </div>
                                )}
                                {invoice.shipping > 0 && (
                                    <div className="flex justify-between">
                                        <span>Shipping:</span>
                                        <span>{formatCurrencyWithSymbol(invoice.shipping, invoice.currencySymbol)}</span>
                                    </div>
                                )}
                                {invoice.discount > 0 && (
                                    <div className="flex justify-between">
                                        <span>Discount:</span>
                                        <span>-{formatCurrencyWithSymbol(invoice.discount, invoice.currencySymbol)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>Total:</span>
                                    <span>{formatCurrencyWithSymbol(invoice.total, invoice.currencySymbol)}</span>
                                </div>
                                {invoice.amountPaid > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Amount Paid:</span>
                                        <span>{formatCurrencyWithSymbol(invoice.amountPaid, invoice.currencySymbol)}</span>
                                    </div>
                                )}
                                {invoice.balanceDue > 0 && (
                                    <div className="flex justify-between text-red-600 font-bold">
                                        <span>Balance Due:</span>
                                        <span>{formatCurrencyWithSymbol(invoice.balanceDue, invoice.currencySymbol)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment History */}
                {invoice.payments && invoice.payments.length > 0 && (
                    <Card className="print:hidden">
                        <CardHeader>
                            <CardTitle>Payment History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {invoice.payments.map((payment: InvoicePayment) => (
                                    <div key={payment.id} className="border rounded p-3">
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                {formatCurrencyWithSymbol(payment.amount, invoice.currencySymbol)}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(payment.paymentDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{payment.paymentMethod}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Notes */}
                {invoice.notes && (
                    <Card className="print:shadow-none print:border-0">
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm whitespace-pre-wrap">{invoice.notes}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Terms */}
                {invoice.termsAndConditions && (
                    <Card className="print:shadow-none print:border-0">
                        <CardHeader>
                            <CardTitle>Terms & Conditions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm whitespace-pre-wrap">{invoice.termsAndConditions}</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    @page {
                        margin: 1cm;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                    .print\\:border-0 {
                        border: none !important;
                    }
                }
            `}</style>
        </div>
    );
}

