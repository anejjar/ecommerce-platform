'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Mail, Phone, Globe, Building } from 'lucide-react';
import toast from 'react-hot-toast';

interface Supplier {
    id: string;
    name: string;
    contactName: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    website: string | null;
    notes: string | null;
    isActive: boolean;
    createdAt: string;
    _count?: {
        purchaseOrders: number;
    };
}

interface SupplierFormData {
    name: string;
    contactName: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    notes: string;
    isActive: boolean;
}

export default function SuppliersPage() {
    const router = useRouter();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<SupplierFormData>({
        name: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        notes: '',
        isActive: true,
    });

    useEffect(() => {
        fetchSuppliers();
    }, [filterActive]);

    const fetchSuppliers = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterActive !== 'all') {
                params.append('isActive', filterActive === 'active' ? 'true' : 'false');
            }

            const response = await fetch(`/api/admin/suppliers?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setSuppliers(data.suppliers || []);
            }
        } catch (error) {
            console.error('Failed to fetch suppliers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenDialog = (supplier?: Supplier) => {
        if (supplier) {
            setEditingSupplier(supplier);
            setFormData({
                name: supplier.name,
                contactName: supplier.contactName || '',
                email: supplier.email || '',
                phone: supplier.phone || '',
                address: supplier.address || '',
                website: supplier.website || '',
                notes: supplier.notes || '',
                isActive: supplier.isActive,
            });
        } else {
            setEditingSupplier(null);
            setFormData({
                name: '',
                contactName: '',
                email: '',
                phone: '',
                address: '',
                website: '',
                notes: '',
                isActive: true,
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingSupplier(null);
        setFormData({
            name: '',
            contactName: '',
            email: '',
            phone: '',
            address: '',
            website: '',
            notes: '',
            isActive: true,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = editingSupplier
                ? `/api/admin/suppliers/${editingSupplier.id}`
                : '/api/admin/suppliers';
            const method = editingSupplier ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(`Supplier ${editingSupplier ? 'updated' : 'created'} successfully`);
                handleCloseDialog();
                fetchSuppliers();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to save supplier');
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('An error occurred while saving');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (supplier: Supplier) => {
        if (!confirm(`Are you sure you want to delete ${supplier.name}? This action cannot be undone.`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/suppliers/${supplier.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Supplier deleted successfully');
                fetchSuppliers();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to delete supplier');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('An error occurred while deleting');
        }
    };

    const filteredSuppliers = suppliers;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12 text-muted-foreground">Loading suppliers...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
                    <p className="text-muted-foreground mt-2">Manage your supplier relationships</p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Supplier
                </Button>
            </div>

            {/* Filter */}
            <Card className="p-4">
                <div className="flex items-center gap-2">
                    <Button
                        variant={filterActive === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterActive('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant={filterActive === 'active' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterActive('active')}
                    >
                        Active
                    </Button>
                    <Button
                        variant={filterActive === 'inactive' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterActive('inactive')}
                    >
                        Inactive
                    </Button>
                </div>
            </Card>

            {/* Suppliers Table */}
            {filteredSuppliers.length === 0 ? (
                <Card className="p-12">
                    <div className="text-center">
                        <Building className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No suppliers found</h3>
                        <p className="text-muted-foreground mb-4">Get started by adding your first supplier</p>
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Supplier
                        </Button>
                    </div>
                </Card>
            ) : (
                <Card>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Contact Person</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Website</TableHead>
                                    <TableHead>Purchase Orders</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSuppliers.map((supplier) => (
                                    <TableRow key={supplier.id}>
                                        <TableCell>
                                            <Link
                                                href={`/admin/inventory/suppliers/${supplier.id}`}
                                                className="font-medium hover:text-primary hover:underline"
                                            >
                                                {supplier.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{supplier.contactName || '-'}</TableCell>
                                        <TableCell>
                                            {supplier.email ? (
                                                <a href={`mailto:${supplier.email}`} className="text-sm hover:underline flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {supplier.email}
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {supplier.phone ? (
                                                <a href={`tel:${supplier.phone}`} className="text-sm hover:underline flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    {supplier.phone}
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {supplier.website ? (
                                                <a
                                                    href={supplier.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm hover:underline flex items-center gap-1"
                                                >
                                                    <Globe className="w-3 h-3" />
                                                    Visit
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/admin/inventory/suppliers/${supplier.id}`}
                                                className="text-sm hover:underline"
                                            >
                                                {supplier._count?.purchaseOrders || 0} orders
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={supplier.isActive ? 'default' : 'secondary'}>
                                                {supplier.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleOpenDialog(supplier)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(supplier)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
                        <DialogDescription>
                            {editingSupplier ? 'Update supplier information' : 'Enter the details of the new supplier'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Supplier Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="contactName">Contact Person</Label>
                                    <Input
                                        id="contactName"
                                        value={formData.contactName}
                                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    placeholder="https://example.com"
                                />
                            </div>

                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    rows={2}
                                />
                            </div>

                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                                <Label htmlFor="isActive">Active Supplier</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleCloseDialog}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : editingSupplier ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
