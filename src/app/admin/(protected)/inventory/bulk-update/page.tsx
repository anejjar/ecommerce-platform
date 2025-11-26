'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, Upload, FileText, Check, Search, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface BulkUpdateItem {
  productId: string;
  productName: string;
  productSku: string;
  currentStock: number;
  quantityChange: number;
  changeType: string;
  reason: string;
}

interface Product {
  id: string;
  name: string;
  sku: string | null;
  stock: number;
}

export default function BulkUpdatePage() {
  const [items, setItems] = useState<BulkUpdateItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [searchOpen, setSearchOpen] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csvText, setCsvText] = useState('');

  const fetchProducts = async (query: string = '') => {
    setIsLoadingProducts(true);
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (query) params.append('search', query);

      const response = await fetch(`/api/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        productId: '',
        productName: '',
        productSku: '',
        currentStock: 0,
        quantityChange: 0,
        changeType: 'ADJUSTMENT',
        reason: '',
      },
    ]);
    if (products.length === 0) {
      fetchProducts();
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof BulkUpdateItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const selectProduct = (index: number, product: Product) => {
    updateItem(index, 'productId', product.id);
    updateItem(index, 'productName', product.name);
    updateItem(index, 'productSku', product.sku || '');
    updateItem(index, 'currentStock', product.stock);
    setSearchOpen(null);
  };

  const parseCSV = () => {
    if (!csvText.trim()) {
      toast.error('Please enter CSV data');
      return;
    }

    const lines = csvText.trim().split('\n');
    const newItems: BulkUpdateItem[] = [];

    // Skip header if present
    const startIndex = lines[0].toLowerCase().includes('sku') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(',').map((p) => p.trim());
      if (parts.length < 3) continue;

      const [sku, quantityChange, reason] = parts;
      const qty = parseInt(quantityChange);

      if (isNaN(qty)) continue;

      // Find product by SKU
      const product = products.find((p) => p.sku === sku);

      if (product) {
        newItems.push({
          productId: product.id,
          productName: product.name,
          productSku: product.sku || '',
          currentStock: product.stock,
          quantityChange: qty,
          changeType: qty > 0 ? 'RESTOCK' : 'ADJUSTMENT',
          reason: reason || 'Bulk update',
        });
      }
    }

    if (newItems.length === 0) {
      toast.error('No valid items found in CSV. Make sure products exist with matching SKUs.');
      return;
    }

    setItems([...items, ...newItems]);
    setCsvText('');
    toast.success(`Added ${newItems.length} items from CSV`);
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    const invalidItems = items.filter(
      (item) => !item.productId || item.quantityChange === 0 || !item.reason
    );

    if (invalidItems.length > 0) {
      toast.error('Please complete all item details');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/inventory/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: items.map((item) => ({
            productId: item.productId,
            quantityChange: item.quantityChange,
            changeType: item.changeType,
            reason: item.reason,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Successfully updated ${data.updated} product(s)`);
        setItems([]);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update inventory');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('An error occurred while updating inventory');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/inventory">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulk Inventory Update</h1>
          <p className="text-muted-foreground mt-2">Update stock levels for multiple products at once</p>
        </div>
      </div>

      {/* CSV Import */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import from CSV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>CSV Format: SKU, Quantity Change, Reason</Label>
            <Textarea
              placeholder="ABC123, 50, Restock from supplier&#10;XYZ789, -10, Damaged items&#10;DEF456, 100, Initial inventory"
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={5}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              One product per line. Use positive numbers to increase stock, negative to decrease.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={parseCSV} variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Parse CSV
            </Button>
            <Button
              onClick={() => fetchProducts()}
              variant="outline"
              disabled={isLoadingProducts}
            >
              {isLoadingProducts ? 'Loading Products...' : 'Load All Products'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Manual Entry */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Manual Entry</CardTitle>
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
              <div className="flex gap-2 justify-center mt-4">
                <Button onClick={addItem} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item Manually
                </Button>
                <span className="text-muted-foreground">or</span>
                <Button onClick={() => document.querySelector('textarea')?.focus()} variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      {/* Product Search */}
                      <div>
                        <Label>Product *</Label>
                        <Popover
                          open={searchOpen === index}
                          onOpenChange={(open) => {
                            setSearchOpen(open ? index : null);
                            if (open && products.length === 0) {
                              fetchProducts();
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              {item.productName || 'Select product'}
                              <Search className="w-4 h-4 ml-2 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0" align="start">
                            <Command>
                              <CommandInput
                                placeholder="Search products..."
                                onValueChange={fetchProducts}
                              />
                              <CommandEmpty>
                                {isLoadingProducts ? 'Loading...' : 'No products found.'}
                              </CommandEmpty>
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
                                        SKU: {product.sku || 'N/A'} | Current Stock: {product.stock}
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {item.productSku && (
                          <p className="text-xs text-muted-foreground mt-1">
                            SKU: {item.productSku} | Current Stock: {item.currentStock}
                          </p>
                        )}
                      </div>

                      {/* Change Type */}
                      <div>
                        <Label>Change Type *</Label>
                        <Select
                          value={item.changeType}
                          onValueChange={(value) => updateItem(index, 'changeType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="RESTOCK">Restock</SelectItem>
                            <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                            <SelectItem value="DAMAGE">Damage</SelectItem>
                            <SelectItem value="RETURN">Return</SelectItem>
                            <SelectItem value="TRANSFER">Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="ml-4 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Quantity Change */}
                    <div>
                      <Label>Quantity Change *</Label>
                      <Input
                        type="number"
                        placeholder="Use + or - to adjust"
                        value={item.quantityChange || ''}
                        onChange={(e) =>
                          updateItem(index, 'quantityChange', parseInt(e.target.value) || 0)
                        }
                      />
                      {item.productId && (
                        <p className="text-xs text-muted-foreground mt-1">
                          New stock will be: {item.currentStock + item.quantityChange}
                        </p>
                      )}
                    </div>

                    {/* Reason */}
                    <div>
                      <Label>Reason *</Label>
                      <Input
                        placeholder="e.g., Supplier restock, Damaged goods"
                        value={item.reason}
                        onChange={(e) => updateItem(index, 'reason', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Summary */}
      {items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Preview Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Products:</span>
                <span className="font-medium">{items.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Quantity Increase:</span>
                <span className="font-medium text-green-600">
                  +{items.filter((i) => i.quantityChange > 0).reduce((sum, i) => sum + i.quantityChange, 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Quantity Decrease:</span>
                <span className="font-medium text-red-600">
                  {items.filter((i) => i.quantityChange < 0).reduce((sum, i) => sum + i.quantityChange, 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      {items.length > 0 && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setItems([])}>
            Clear All
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : `Update ${items.length} Product(s)`}
          </Button>
        </div>
      )}
    </div>
  );
}
