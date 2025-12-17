'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
    Plus,
    Trash2,
    Save,
    Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { InvoiceItem, InvoiceType } from '@/types/invoice';
import { formatCurrencyWithSymbol } from '@/lib/formatting';

export default function NewInvoicePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [order, setOrder] = useState<any>(null);
    const [invoiceData, setInvoiceData] = useState({
        invoiceType: 'STANDARD' as InvoiceType,
        customerId: '',
        customerEmail: '',
        customerName: '',
        customerCompany: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        billingAddress: null as any,
        shippingAddress: null as any,
        tax: 0,
        taxRate: 0,
        shipping: 0,
        discount: 0,
        discountType: 'FIXED_AMOUNT',
        termsAndConditions: '',
        notes: '',
    });
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [newItem, setNewItem] = useState({
        description: '',
        sku: '',
        quantity: 1,
        unitPrice: 0,
        taxRate: 0,
        discount: 0,
    });

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/orders/${orderId}`);
            if (response.ok) {
                const orderData = await response.json();
                setOrder(orderData);
                
                // Pre-fill invoice data from order
                setInvoiceData({
                    ...invoiceData,
                    customerId: orderData.userId || '',
                    customerEmail: orderData.user?.email || orderData.guestEmail || '',
                    customerName: orderData.user?.name || 
                        (orderData.shippingAddress ? `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}` : ''),
                    invoiceDate: new Date().toISOString().split('T')[0],
                    billingAddress: orderData.billingAddress,
                    shippingAddress: orderData.shippingAddress,
                    tax: Number(orderData.tax),
                    shipping: Number(orderData.shipping),
                    discount: Number(orderData.discountAmount || 0),
                });

                // Convert order items to invoice items
                const invoiceItems: InvoiceItem[] = orderData.items.map((item: any) => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    description: item.product.name,
                    sku: item.product.sku || item.variant?.sku || '',
                    quantity: item.quantity,
                    unitPrice: Number(item.price),
                    taxRate: 0,
                    discount: 0,
                    total: Number(item.total),
                }));
                setItems(invoiceItems);
            } else {
                toast.error('Failed to fetch order');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const addItem = () => {
        if (!newItem.description || newItem.quantity <= 0 || newItem.unitPrice <= 0) {
            toast.error('Please fill in all required item fields');
            return;
        }

        const total = (newItem.quantity * newItem.unitPrice) - newItem.discount;
        const item: InvoiceItem = {
            ...newItem,
            total,
        };

        setItems([...items, item]);
        setNewItem({
            description: '',
            sku: '',
            quantity: 1,
            unitPrice: 0,
            taxRate: 0,
            discount: 0,
        });
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotals = () => {
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const tax = invoiceData.tax || (subtotal * (invoiceData.taxRate / 100));
        const shipping = invoiceData.shipping || 0;
        const discount = invoiceData.discount || 0;
        const total = subtotal + tax + shipping - discount;

        return { subtotal, tax, shipping, discount, total };
    };

    const handleSave = async () => {
        if (items.length === 0) {
            toast.error('Please add at least one item');
            return;
        }

        try {
            setSaving(true);
            const totals = calculateTotals();

            // Calculate due date if not set
            let dueDate = invoiceData.dueDate;
            if (!dueDate) {
                const date = new Date(invoiceData.invoiceDate);
                date.setDate(date.getDate() + 30); // Default 30 days
                dueDate = date.toISOString().split('T')[0];
            }

            const response = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...invoiceData,
                    dueDate,
                    subtotal: totals.subtotal,
                    tax: totals.tax,
                    shipping: totals.shipping,
                    discount: totals.discount,
                    total: totals.total,
                    amountPaid: 0,
                    balanceDue: totals.total,
                    currency: 'USD',
                    currencySymbol: '$',
                    items: items.map((item, index) => ({
                        ...item,
                        position: index,
                    })),
                    orderId: orderId || null,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success('Invoice created successfully');
                router.push(`/admin/invoices/${data.id}`);
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to create invoice');
            }
        } catch (error) {
            console.error('Error creating invoice:', error);
            toast.error('Failed to create invoice');
        } finally {
            setSaving(false);
        }
    };

    const totals = calculateTotals();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/invoices">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Create New Invoice</h1>
                        <p className="text-gray-600 mt-1">
                            {orderId ? 'Creating invoice from order' : 'Create a new invoice from scratch'}
                        </p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Create Invoice
                        </>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Invoice Type</Label>
                                    <Select
                                        value={invoiceData.invoiceType}
                                        onValueChange={(value) =>
                                            setInvoiceData({ ...invoiceData, invoiceType: value as InvoiceType })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="STANDARD">Standard</SelectItem>
                                            <SelectItem value="PROFORMA">Proforma</SelectItem>
                                            <SelectItem value="QUOTE">Quote</SelectItem>
                                            <SelectItem value="CREDIT_NOTE">Credit Note</SelectItem>
                                            <SelectItem value="RECEIPT">Receipt</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Invoice Date</Label>
                                    <Input
                                        type="date"
                                        value={invoiceData.invoiceDate}
                                        onChange={(e) =>
                                            setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Due Date</Label>
                                <Input
                                    type="date"
                                    value={invoiceData.dueDate}
                                    onChange={(e) =>
                                        setInvoiceData({ ...invoiceData, dueDate: e.target.value })
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Customer Name</Label>
                                <Input
                                    value={invoiceData.customerName}
                                    onChange={(e) =>
                                        setInvoiceData({ ...invoiceData, customerName: e.target.value })
                                    }
                                    placeholder="Customer name"
                                />
                            </div>
                            <div>
                                <Label>Customer Email</Label>
                                <Input
                                    type="email"
                                    value={invoiceData.customerEmail}
                                    onChange={(e) =>
                                        setInvoiceData({ ...invoiceData, customerEmail: e.target.value })
                                    }
                                    placeholder="customer@example.com"
                                />
                            </div>
                            <div>
                                <Label>Company (Optional)</Label>
                                <Input
                                    value={invoiceData.customerCompany}
                                    onChange={(e) =>
                                        setInvoiceData({ ...invoiceData, customerCompany: e.target.value })
                                    }
                                    placeholder="Company name"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Items</CardTitle>
                            <CardDescription>Add items to this invoice</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Add Item Form */}
                            <div className="border rounded-lg p-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Description *</Label>
                                        <Input
                                            value={newItem.description}
                                            onChange={(e) =>
                                                setNewItem({ ...newItem, description: e.target.value })
                                            }
                                            placeholder="Item description"
                                        />
                                    </div>
                                    <div>
                                        <Label>SKU</Label>
                                        <Input
                                            value={newItem.sku}
                                            onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                                            placeholder="SKU"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    <div>
                                        <Label>Quantity *</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={newItem.quantity}
                                            onChange={(e) =>
                                                setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label>Unit Price *</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={newItem.unitPrice}
                                            onChange={(e) =>
                                                setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label>Discount</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={newItem.discount}
                                            onChange={(e) =>
                                                setNewItem({ ...newItem, discount: parseFloat(e.target.value) || 0 })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button onClick={addItem} className="w-full">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Items Table */}
                            {items.length > 0 && (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Description</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead className="text-right">Qty</TableHead>
                                            <TableHead className="text-right">Unit Price</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.description}</TableCell>
                                                <TableCell>{item.sku || '-'}</TableCell>
                                                <TableCell className="text-right">{item.quantity}</TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrencyWithSymbol(item.unitPrice, '$')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrencyWithSymbol(item.total, '$')}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeItem(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    {/* Additional Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Terms & Conditions</Label>
                                <Textarea
                                    value={invoiceData.termsAndConditions}
                                    onChange={(e) =>
                                        setInvoiceData({ ...invoiceData, termsAndConditions: e.target.value })
                                    }
                                    rows={4}
                                    placeholder="Enter terms and conditions..."
                                />
                            </div>
                            <div>
                                <Label>Notes</Label>
                                <Textarea
                                    value={invoiceData.notes}
                                    onChange={(e) =>
                                        setInvoiceData({ ...invoiceData, notes: e.target.value })
                                    }
                                    rows={3}
                                    placeholder="Enter notes..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Totals */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>{formatCurrencyWithSymbol(totals.subtotal, '$')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax:</span>
                                    <span>{formatCurrencyWithSymbol(totals.tax, '$')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping:</span>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={invoiceData.shipping}
                                        onChange={(e) =>
                                            setInvoiceData({
                                                ...invoiceData,
                                                shipping: parseFloat(e.target.value) || 0,
                                            })
                                        }
                                        className="w-24 h-8"
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <span>Discount:</span>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={invoiceData.discount}
                                        onChange={(e) =>
                                            setInvoiceData({
                                                ...invoiceData,
                                                discount: parseFloat(e.target.value) || 0,
                                            })
                                        }
                                        className="w-24 h-8"
                                    />
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>Total:</span>
                                    <span>{formatCurrencyWithSymbol(totals.total, '$')}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

