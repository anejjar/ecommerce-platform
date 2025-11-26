'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Plus, Trash2, Search, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface PurchaseOrderItem {
  productId: string;
  productName: string;
  productSku: string;
  variantId?: string;
  quantity: number;
  unitCost: number;
  total: number;
}

interface PurchaseOrderFormProps {
  orderId?: string;
  defaultSupplierId?: string;
  onSuccess: (orderId: string) => void;
}

interface Product {
  id: string;
  name: string;
  sku: string | null;
  price: string;
  stock: number;
}

export function PurchaseOrderForm({ orderId, defaultSupplierId, onSuccess }: PurchaseOrderFormProps) {
  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string }>>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [supplierId, setSupplierId] = useState(defaultSupplierId || '');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDate, setExpectedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [tax, setTax] = useState('0');
  const [shipping, setShipping] = useState('0');
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchOpen, setSearchOpen] = useState<number | null>(null);

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/admin/suppliers?isActive=true');
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data.suppliers || []);
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=1000');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        productId: '',
        productName: '',
        productSku: '',
        quantity: 1,
        unitCost: 0,
        total: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Recalculate total for this item
    if (field === 'quantity' || field === 'unitCost') {
      const item = updatedItems[index];
      item.total = item.quantity * item.unitCost;
    }

    setItems(updatedItems);
  };

  const selectProduct = (index: number, product: Product) => {
    updateItem(index, 'productId', product.id);
    updateItem(index, 'productName', product.name);
    updateItem(index, 'productSku', product.sku || '');
    updateItem(index, 'unitCost', parseFloat(product.price));
    setSearchOpen(null);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = parseFloat(tax) || 0;
    const shippingAmount = parseFloat(shipping) || 0;
    return subtotal + taxAmount + shippingAmount;
  };

  const handleSubmit = async (status: 'DRAFT' | 'PENDING') => {
    if (!supplierId) {
      toast.error('Please select a supplier');
      return;
    }

    if (items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    if (items.some((item) => !item.productId || item.quantity <= 0 || item.unitCost <= 0)) {
      toast.error('Please complete all item details');
      return;
    }

    setIsSubmitting(true);

    try {
      const subtotal = calculateSubtotal();
      const total = calculateTotal();

      const response = await fetch('/api/admin/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId,
          status,
          orderDate,
          expectedDate: expectedDate || null,
          notes,
          subtotal,
          tax: parseFloat(tax) || 0,
          shipping: parseFloat(shipping) || 0,
          total,
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            unitCost: item.unitCost,
            total: item.total,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Purchase order ${status === 'DRAFT' ? 'saved as draft' : 'created'} successfully`);
        onSuccess(data.id);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create purchase order');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('An error occurred while creating purchase order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supplier">Supplier *</Label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="orderDate">Order Date *</Label>
              <Input
                id="orderDate"
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expectedDate">Expected Delivery Date</Label>
              <Input
                id="expectedDate"
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Additional notes about this order..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order Items</CardTitle>
            <Button onClick={addItem} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No items added yet</p>
              <Button onClick={addItem} variant="outline" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add First Item
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-4 items-start p-4 border rounded-lg">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Product *</Label>
                        <Popover open={searchOpen === index} onOpenChange={(open) => setSearchOpen(open ? index : null)}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              {item.productName || 'Select product'}
                              <Search className="w-4 h-4 ml-2 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search products..." />
                              <CommandEmpty>No products found.</CommandEmpty>
                              <CommandGroup className="max-h-64 overflow-auto">
                                {products.map((product) => (
                                  <CommandItem
                                    key={product.id}
                                    onSelect={() => selectProduct(index, product)}
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${item.productId === product.id ? 'opacity-100' : 'opacity-0'}`}
                                    />
                                    <div className="flex-1">
                                      <div className="font-medium">{product.name}</div>
                                      <div className="text-sm text-muted-foreground">
                                        SKU: {product.sku || 'N/A'} | Stock: {product.stock} | ${product.price}
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {item.productSku && (
                          <p className="text-xs text-muted-foreground mt-1">SKU: {item.productSku}</p>
                        )}
                      </div>

                      <div>
                        <Label>Quantity *</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Unit Cost ($) *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitCost}
                          onChange={(e) => updateItem(index, 'unitCost', parseFloat(e.target.value) || 0)}
                        />
                      </div>

                      <div>
                        <Label>Total</Label>
                        <Input
                          type="text"
                          value={`$${item.total.toFixed(2)}`}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="tax">Tax ($)</Label>
              <Input
                id="tax"
                type="number"
                step="0.01"
                min="0"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="shipping">Shipping ($)</Label>
              <Input
                id="shipping"
                type="number"
                step="0.01"
                min="0"
                value={shipping}
                onChange={(e) => setShipping(e.target.value)}
              />
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax:</span>
              <span className="font-medium">${(parseFloat(tax) || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping:</span>
              <span className="font-medium">${(parseFloat(shipping) || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => handleSubmit('DRAFT')}
          disabled={isSubmitting}
        >
          Save as Draft
        </Button>
        <Button
          onClick={() => handleSubmit('PENDING')}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Purchase Order'}
        </Button>
      </div>
    </div>
  );
}
