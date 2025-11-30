'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Loader2,
    ArrowLeft,
    Download,
    Mail,
    Edit,
    Save,
    X,
    Plus,
    DollarSign,
    FileText,
    Calendar,
    User,
    Building,
    MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Invoice, InvoicePayment } from '@/types/invoice';
import { formatCurrencyWithSymbol } from '@/lib/formatting';

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showSendDialog, setShowSendDialog] = useState(false);
    const [paymentData, setPaymentData] = useState({
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
        transactionId: '',
        referenceNumber: '',
        notes: '',
    });

    useEffect(() => {
        fetchInvoice();
    }, [id]);

    const fetchInvoice = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/invoices/${id}`);
            if (response.ok) {
                const data = await response.json();
                setInvoice(data);
            } else {
                toast.error('Failed to fetch invoice');
                router.push('/admin/invoices');
            }
        } catch (error) {
            console.error('Error fetching invoice:', error);
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(`/api/invoices/${id}/download`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `invoice-${invoice?.invoiceNumber}.pdf`;
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

    const handleSend = async (email?: string) => {
        try {
            const response = await fetch(`/api/invoices/${id}/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (response.ok) {
                toast.success('Invoice sent successfully');
                setShowSendDialog(false);
                fetchInvoice();
            } else {
                toast.error('Failed to send invoice');
            }
        } catch (error) {
            console.error('Error sending invoice:', error);
            toast.error('Failed to send invoice');
        }
    };

    const handleRecordPayment = async () => {
        try {
            const response = await fetch(`/api/invoices/${id}/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...paymentData,
                    amount: parseFloat(paymentData.amount),
                }),
            });
            if (response.ok) {
                toast.success('Payment recorded successfully');
                setShowPaymentDialog(false);
                setPaymentData({
                    amount: '',
                    paymentDate: new Date().toISOString().split('T')[0],
                    paymentMethod: 'cash',
                    transactionId: '',
                    referenceNumber: '',
                    notes: '',
                });
                fetchInvoice();
            } else {
                toast.error('Failed to record payment');
            }
        } catch (error) {
            console.error('Error recording payment:', error);
            toast.error('Failed to record payment');
        }
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
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
                        <Link href="/admin/invoices">
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
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/invoices">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Invoice {invoice.invoiceNumber}</h1>
                        <p className="text-gray-600 mt-1">
                            Created {new Date(invoice.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Badge className={getStatusBadge(invoice.status)}>
                        {invoice.status.replace('_', ' ')}
                    </Badge>
                    <Button variant="outline" onClick={() => setEditing(!editing)}>
                        <Edit className="mr-2 h-4 w-4" />
                        {editing ? 'Cancel' : 'Edit'}
                    </Button>
                    <Button variant="outline" onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                    <Button variant="outline" onClick={() => setShowSendDialog(true)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Send
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Invoice Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Invoice Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Invoice Number</Label>
                                    <p className="font-medium">{invoice.invoiceNumber}</p>
                                </div>
                                <div>
                                    <Label>Invoice Type</Label>
                                    <p className="font-medium">{invoice.invoiceType}</p>
                                </div>
                                <div>
                                    <Label>Invoice Date</Label>
                                    <p>{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <Label>Due Date</Label>
                                    <p>
                                        {invoice.dueDate
                                            ? new Date(invoice.dueDate).toLocaleDateString()
                                            : 'Not set'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items */}
                    <Card>
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
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
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {invoice.customerName && (
                                <div>
                                    <Label>Name</Label>
                                    <p>{invoice.customerName}</p>
                                </div>
                            )}
                            {invoice.customerEmail && (
                                <div>
                                    <Label>Email</Label>
                                    <p>{invoice.customerEmail}</p>
                                </div>
                            )}
                            {billingAddress && (
                                <div>
                                    <Label>Billing Address</Label>
                                    <div className="text-sm">
                                        {billingAddress.address1 && <p>{billingAddress.address1}</p>}
                                        {billingAddress.address2 && <p>{billingAddress.address2}</p>}
                                        <p>
                                            {billingAddress.city}
                                            {billingAddress.state && `, ${billingAddress.state}`}
                                            {billingAddress.postalCode && ` ${billingAddress.postalCode}`}
                                        </p>
                                        {billingAddress.country && <p>{billingAddress.country}</p>}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Tracking */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payments</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {invoice.payments && invoice.payments.length > 0 ? (
                                <div className="space-y-2">
                                    {invoice.payments.map((payment: InvoicePayment) => (
                                        <div key={payment.id} className="border rounded p-2">
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
                            ) : (
                                <p className="text-sm text-gray-500">No payments recorded</p>
                            )}
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => setShowPaymentDialog(true)}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Record Payment
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    {invoice.notes && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{invoice.notes}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Payment Dialog */}
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Record Payment</DialogTitle>
                        <DialogDescription>
                            Record a payment for this invoice
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Amount</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={paymentData.amount}
                                onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <Label>Payment Date</Label>
                            <Input
                                type="date"
                                value={paymentData.paymentDate}
                                onChange={(e) => setPaymentData({ ...paymentData, paymentDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Payment Method</Label>
                            <Input
                                value={paymentData.paymentMethod}
                                onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                                placeholder="cash, card, bank transfer, etc."
                            />
                        </div>
                        <div>
                            <Label>Transaction ID (Optional)</Label>
                            <Input
                                value={paymentData.transactionId}
                                onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Reference Number (Optional)</Label>
                            <Input
                                value={paymentData.referenceNumber}
                                onChange={(e) => setPaymentData({ ...paymentData, referenceNumber: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Notes (Optional)</Label>
                            <Textarea
                                value={paymentData.notes}
                                onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleRecordPayment}>
                            Record Payment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Send Dialog */}
            <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Invoice</DialogTitle>
                        <DialogDescription>
                            Send this invoice via email to the customer
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Email Address</Label>
                            <Input
                                type="email"
                                value={invoice.customerEmail || ''}
                                readOnly
                                placeholder="Customer email"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Invoice will be sent to this email address
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSendDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => handleSend()}>
                            Send Invoice
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

