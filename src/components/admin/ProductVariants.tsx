'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface VariantOption {
  id: string;
  name: string;
  values: { id: string; value: string; position: number }[];
}

interface Variant {
  id: string;
  sku: string | null;
  price: string | null;
  comparePrice: string | null;
  stock: number;
  image: string | null;
  optionValues: string;
}

interface ProductVariantsProps {
  productId: string;
  basePrice: number;
}

export function ProductVariants({ productId, basePrice }: ProductVariantsProps) {
  const [options, setOptions] = useState<VariantOption[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOptionForm, setShowOptionForm] = useState(false);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);

  // Option form state
  const [optionName, setOptionName] = useState('');
  const [optionValues, setOptionValues] = useState('');

  // Variant form state
  const [variantForm, setVariantForm] = useState({
    sku: '',
    price: '',
    comparePrice: '',
    stock: '0',
    image: '',
    selectedValues: {} as Record<string, string>,
  });

  useEffect(() => {
    fetchOptions();
    fetchVariants();
  }, [productId]);

  const fetchOptions = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/variant-options`);
      if (response.ok) {
        const data = await response.json();
        setOptions(data);
      }
    } catch (error) {
      console.error('Failed to fetch options');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVariants = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/variants`);
      if (response.ok) {
        const data = await response.json();
        setVariants(data);
      }
    } catch (error) {
      console.error('Failed to fetch variants');
    }
  };

  const handleCreateOption = async (e: React.FormEvent) => {
    e.preventDefault();

    const values = optionValues.split(',').map(v => v.trim()).filter(Boolean);

    if (!optionName || values.length === 0) {
      alert('Please provide option name and values');
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}/variant-options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: optionName, values }),
      });

      if (response.ok) {
        await fetchOptions();
        setShowOptionForm(false);
        setOptionName('');
        setOptionValues('');
      } else {
        alert('Failed to create option');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleDeleteOption = async (optionId: string) => {
    if (!confirm('Are you sure you want to delete this option? This will affect all variants.')) {
      return;
    }

    try {
      const response = await fetch(
        `/api/products/${productId}/variant-options/${optionId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        await fetchOptions();
        await fetchVariants();
      } else {
        alert('Failed to delete option');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleCreateVariant = async (e: React.FormEvent) => {
    e.preventDefault();

    const optionValuesArray = Object.values(variantForm.selectedValues);

    if (options.length > 0 && optionValuesArray.length !== options.length) {
      alert('Please select a value for each option');
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}/variants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...variantForm,
          optionValues: optionValuesArray,
        }),
      });

      if (response.ok) {
        await fetchVariants();
        setShowVariantForm(false);
        resetVariantForm();
      } else {
        alert('Failed to create variant');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleUpdateVariant = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingVariant) return;

    const optionValuesArray = Object.values(variantForm.selectedValues);

    try {
      const response = await fetch(
        `/api/products/${productId}/variants/${editingVariant.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...variantForm,
            optionValues: optionValuesArray,
          }),
        }
      );

      if (response.ok) {
        await fetchVariants();
        setEditingVariant(null);
        resetVariantForm();
      } else {
        alert('Failed to update variant');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm('Are you sure you want to delete this variant?')) {
      return;
    }

    try {
      const response = await fetch(
        `/api/products/${productId}/variants/${variantId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        await fetchVariants();
      } else {
        alert('Failed to delete variant');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const resetVariantForm = () => {
    setVariantForm({
      sku: '',
      price: '',
      comparePrice: '',
      stock: '0',
      image: '',
      selectedValues: {},
    });
  };

  const startEditVariant = (variant: Variant) => {
    const parsedValues = JSON.parse(variant.optionValues);
    const selectedValues: Record<string, string> = {};

    options.forEach((option, index) => {
      selectedValues[option.id] = parsedValues[index] || '';
    });

    setVariantForm({
      sku: variant.sku || '',
      price: variant.price || '',
      comparePrice: variant.comparePrice || '',
      stock: variant.stock.toString(),
      image: variant.image || '',
      selectedValues,
    });
    setEditingVariant(variant);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Variant Options */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Variant Options</CardTitle>
            <Button onClick={() => setShowOptionForm(!showOptionForm)} size="sm">
              {showOptionForm ? 'Cancel' : 'Add Option'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showOptionForm && (
            <form onSubmit={handleCreateOption} className="space-y-4 border p-4 rounded">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Option Name (e.g., Color, Size)
                </label>
                <input
                  type="text"
                  value={optionName}
                  onChange={(e) => setOptionName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Color"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Values (comma-separated)
                </label>
                <input
                  type="text"
                  value={optionValues}
                  onChange={(e) => setOptionValues(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Red, Blue, Green"
                  required
                />
              </div>
              <Button type="submit">Create Option</Button>
            </form>
          )}

          {options.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No variant options. Add options like Size or Color to create variants.
            </p>
          ) : (
            <div className="space-y-2">
              {options.map((option) => (
                <div key={option.id} className="border p-3 rounded flex items-center justify-between">
                  <div>
                    <p className="font-medium">{option.name}</p>
                    <div className="flex gap-2 mt-2">
                      {option.values.map((val) => (
                        <Badge key={val.id} variant="outline">
                          {val.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteOption(option.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Variants */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Product Variants</CardTitle>
            {options.length > 0 && (
              <Button
                onClick={() => {
                  setShowVariantForm(true);
                  setEditingVariant(null);
                  resetVariantForm();
                }}
                size="sm"
              >
                Add Variant
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(showVariantForm || editingVariant) && (
            <form
              onSubmit={editingVariant ? handleUpdateVariant : handleCreateVariant}
              className="space-y-4 border p-4 rounded"
            >
              <div className="grid grid-cols-2 gap-4">
                {options.map((option) => (
                  <div key={option.id}>
                    <label className="block text-sm font-medium mb-1">
                      {option.name}
                    </label>
                    <select
                      value={variantForm.selectedValues[option.id] || ''}
                      onChange={(e) =>
                        setVariantForm({
                          ...variantForm,
                          selectedValues: {
                            ...variantForm.selectedValues,
                            [option.id]: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      <option value="">Select {option.name}</option>
                      {option.values.map((val) => (
                        <option key={val.id} value={val.value}>
                          {val.value}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    SKU (optional)
                  </label>
                  <input
                    type="text"
                    value={variantForm.sku}
                    onChange={(e) =>
                      setVariantForm({ ...variantForm, sku: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price (leave empty to use base price: ${basePrice})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={variantForm.price}
                    onChange={(e) =>
                      setVariantForm({ ...variantForm, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Compare Price (optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={variantForm.comparePrice}
                    onChange={(e) =>
                      setVariantForm({ ...variantForm, comparePrice: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input
                    type="number"
                    value={variantForm.stock}
                    onChange={(e) =>
                      setVariantForm({ ...variantForm, stock: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingVariant ? 'Update Variant' : 'Create Variant'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowVariantForm(false);
                    setEditingVariant(null);
                    resetVariantForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {variants.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No variants created yet. {options.length === 0 && 'Add variant options first.'}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Options</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((variant) => {
                  const values = JSON.parse(variant.optionValues);
                  return (
                    <TableRow key={variant.id}>
                      <TableCell>
                        <div className="flex gap-1">
                          {values.map((val: string, idx: number) => (
                            <Badge key={idx} variant="outline">
                              {val}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{variant.sku || '-'}</TableCell>
                      <TableCell>
                        ${variant.price || basePrice.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            variant.stock > 10
                              ? 'bg-green-100 text-green-800'
                              : variant.stock > 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {variant.stock}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditVariant(variant)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteVariant(variant.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
