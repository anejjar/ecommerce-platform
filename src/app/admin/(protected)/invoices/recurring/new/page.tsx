'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
    Loader2,
    ArrowLeft,
    Save,
    Plus,
    Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { RecurringFrequency } from '@/types/invoice';
import { formatCurrencyWithSymbol } from '@/lib/formatting';

interface InvoiceItem {
    description: string;
    sku?: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
}

export default function NewRecurringInvoicePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [customers, setCustomers] = useState<any[]>([]);
    const [templates, setTemplates] = useState<any[]>([]);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        customerId: '',
        customerEmail: '',
        frequency: 'MONTHLY' as RecurringFrequency,
        interval: 1,
        customInterval: 30,
        dayOfMonth: 1,
        dayOfWeek: 1,
        templateId: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        autoSend: true,
    });

    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [newItem, setNewItem] = useState({
        description: '',
        sku: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
    });

    useEffect(() => {
        fetchCustomers();
        fetchTemplates();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch('/api/admin/customers?limit=100');
            if (response.ok) {
                const data = await response.json();
                setCustomers(data.customers || []);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const fetchTemplates = async () => {
        try {
            const response = await fetch('/api/invoices/templates');
            if (response.ok) {
                const data = await response.json();
                setTemplates(data.templates || []);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
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
            discount: 0,
        });
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!formData.name) {
            toast.error('Please enter a name for the recurring invoice');
            return;
        }

        if (items.length === 0) {
            toast.error('Please add at least one item');
            return;
        }

        try {
            setSaving(true);

            // Get selected customer email if customer is selected
            let customerEmail = formData.customerEmail;
            if (formData.customerId && !customerEmail) {
                const customer = customers.find(c => c.id === formData.customerId);
                customerEmail = customer?.email;
            }

            // Prepare invoice settings
            const subtotal = items.reduce((sum, item) => sum + item.total, 0);
            const invoiceSettings = {
                items: items.map((item, index) => ({
                    ...item,
                    position: index,
                })),
                subtotal,
                tax: 0,
                shipping: 0,
                discount: 0,
                total: subtotal,
                customerName: customers.find(c => c.id === formData.customerId)?.name,
                customerEmail,
            };

            const response = await fetch('/api/invoices/recurring', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    customerEmail,
                    invoiceSettings,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success('Recurring invoice created successfully');
                router.push(`/admin/invoices/recurring/${data.id}`);
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to create recurring invoice');
            }
        } catch (error) {
            console.error('Error creating recurring invoice:', error);
            toast.error('Failed to create recurring invoice');
        } finally {
            setSaving(false);
        }
    };

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/invoices/recurring">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Create Recurring Invoice</h1>
                        <p className="text-gray-600 mt-1">Set up automated invoice generation</p>
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
                            Create
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
                            <div>
                                <Label>Name *</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Monthly Subscription Invoice"
                                />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    placeholder="Description of this recurring invoice..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Customer</Label>
                                <Select
                                    value={formData.customerId}
                                    onValueChange={(value) => {
                                        const customer = customers.find(c => c.id === value);
                                        setFormData({
                                            ...formData,
                                            customerId: value,
                                            customerEmail: customer?.email || '',
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">None (Manual Email)</SelectItem>
                                        {customers.map((customer) => (
                                            <SelectItem key={customer.id} value={customer.id}>
                                                {customer.name || customer.email}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {!formData.customerId && (
                                <div>
                                    <Label>Email Address *</Label>
                                    <Input
                                        type="email"
                                        value={formData.customerEmail}
                                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                        placeholder="customer@example.com"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Schedule */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Schedule</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Frequency *</Label>
                                    <Select
                                        value={formData.frequency}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, frequency: value as RecurringFrequency })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DAILY">Daily</SelectItem>
                                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                                            <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                                            <SelectItem value="YEARLY">Yearly</SelectItem>
                                            <SelectItem value="CUSTOM">Custom</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Interval</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={formData.interval}
                                        onChange={(e) =>
                                            setFormData({ ...formData, interval: parseInt(e.target.value) || 1 })
                                        }
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Every X {formData.frequency.toLowerCase()}(s)
                                    </p>
                                </div>
                            </div>

                            {formData.frequency === 'CUSTOM' && (
                                <div>
                                    <Label>Custom Interval (Days)</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={formData.customInterval}
                                        onChange={(e) =>
                                            setFormData({ ...formData, customInterval: parseInt(e.target.value) || 30 })
                                        }
                                    />
                                </div>
                            )}

                            {(formData.frequency === 'WEEKLY' || formData.frequency === 'MONTHLY' || formData.frequency === 'QUARTERLY' || formData.frequency === 'YEARLY') && (
                                <div>
                                    <Label>Day of {formData.frequency === 'WEEKLY' ? 'Week' : 'Month'}</Label>
                                    {formData.frequency === 'WEEKLY' ? (
                                        <Select
                                            value={formData.dayOfWeek.toString()}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, dayOfWeek: parseInt(value) })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0">Sunday</SelectItem>
                                                <SelectItem value="1">Monday</SelectItem>
                                                <SelectItem value="2">Tuesday</SelectItem>
                                                <SelectItem value="3">Wednesday</SelectItem>
                                                <SelectItem value="4">Thursday</SelectItem>
                                                <SelectItem value="5">Friday</SelectItem>
                                                <SelectItem value="6">Saturday</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input
                                            type="number"
                                            min="1"
                                            max="31"
                                            value={formData.dayOfMonth}
                                            onChange={(e) =>
                                                setFormData({ ...formData, dayOfMonth: parseInt(e.target.value) || 1 })
                                            }
                                        />
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Start Date *</Label>
                                    <Input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>End Date (Optional)</Label>
                                    <Input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Invoice Items</CardTitle>
                            <CardDescription>Items to include in each generated invoice</CardDescription>
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
                                <div className="border rounded-lg">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-2">Description</th>
                                                <th className="text-left p-2">SKU</th>
                                                <th className="text-right p-2">Qty</th>
                                                <th className="text-right p-2">Price</th>
                                                <th className="text-right p-2">Total</th>
                                                <th className="w-[50px]"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((item, index) => (
                                                <tr key={index} className="border-b">
                                                    <td className="p-2">{item.description}</td>
                                                    <td className="p-2">{item.sku || '-'}</td>
                                                    <td className="p-2 text-right">{item.quantity}</td>
                                                    <td className="p-2 text-right">
                                                        {formatCurrencyWithSymbol(item.unitPrice, '$')}
                                                    </td>
                                                    <td className="p-2 text-right">
                                                        {formatCurrencyWithSymbol(item.total, '$')}
                                                    </td>
                                                    <td className="p-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeItem(index)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Template</Label>
                                <Select
                                    value={formData.templateId}
                                    onValueChange={(value) => setFormData({ ...formData, templateId: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Default template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Default</SelectItem>
                                        {templates.map((template) => (
                                            <SelectItem key={template.id} value={template.id}>
                                                {template.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div>
                                    <Label>Auto-send</Label>
                                    <p className="text-sm text-gray-500">
                                        Automatically email invoices when generated
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.autoSend}
                                    onChange={(e) => setFormData({ ...formData, autoSend: e.target.checked })}
                                    className="w-4 h-4"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>{formatCurrencyWithSymbol(subtotal, '$')}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>Total:</span>
                                    <span>{formatCurrencyWithSymbol(subtotal, '$')}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

