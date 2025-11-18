'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Search } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface Customer {
  id: string;
  name: string | null;
  email: string;
}

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export default function CreateOrderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer search
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  // Product search
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // Order items
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Order details
  const [orderData, setOrderData] = useState({
    status: 'PENDING',
    paymentStatus: 'PENDING',
    tax: '0',
    shipping: '0',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: 'USA',
  });

  // Fetch customers
  useEffect(() => {
    if (customerSearch.length > 0) {
      fetchCustomers();
    }
  }, [customerSearch]);

  // Fetch products
  useEffect(() => {
    if (productSearch.length > 0) {
      fetchProducts();
    }
  }, [productSearch]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`/api/customers/search?q=${customerSearch}`);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Failed to fetch customers');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products/search?q=${productSearch}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products');
    }
  };

  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch(customer.email);
    setShowCustomerDropdown(false);
  };

  const addProduct = (product: Product) => {
    const existing = orderItems.find(item => item.productId === product.id);
    if (existing) {
      setOrderItems(
        orderItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
    setProductSearch('');
    setShowProductDropdown(false);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      setOrderItems(
        orderItems.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeItem = (productId: string) => {
    setOrderItems(orderItems.filter(item => item.productId !== productId));
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = parseFloat(orderData.tax) || 0;
    const shipping = parseFloat(orderData.shipping) || 0;
    return subtotal + tax + shipping;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomer) {
      alert('Please select a customer');
      return;
    }

    if (orderItems.length === 0) {
      alert('Please add at least one product');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedCustomer.id,
          items: orderItems,
          status: orderData.status,
          paymentStatus: orderData.paymentStatus,
          tax: parseFloat(orderData.tax) || 0,
          shipping: parseFloat(orderData.shipping) || 0,
          shippingAddress: {
            address1: orderData.shippingAddress,
            city: orderData.shippingCity,
            state: orderData.shippingState,
            postalCode: orderData.shippingZip,
            country: orderData.shippingCountry,
          },
        }),
      });

      if (response.ok) {
        const order = await response.json();
        alert('Order created successfully');
        router.push(`/admin/orders/${order.id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create order');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Order</h1>
          <p className="text-gray-600 mt-2">Create a new order manually</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Label htmlFor="customer">Search Customer *</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="customer"
                    placeholder="Search by name or email..."
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setShowCustomerDropdown(true);
                    }}
                    onFocus={() => setShowCustomerDropdown(true)}
                    className="pl-10"
                    required
                  />
                </div>
                {showCustomerDropdown && customers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {customers.map((customer) => (
                      <button
                        key={customer.id}
                        type="button"
                        onClick={() => selectCustomer(customer)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        <p className="font-medium">{customer.name || 'N/A'}</p>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {selectedCustomer && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-medium">{selectedCustomer.name || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Order Status</Label>
                <select
                  id="status"
                  value={orderData.status}
                  onChange={(e) =>
                    setOrderData({ ...orderData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div>
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <select
                  id="paymentStatus"
                  value={orderData.paymentStatus}
                  onChange={(e) =>
                    setOrderData({ ...orderData, paymentStatus: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="FAILED">Failed</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Label htmlFor="product">Add Product</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="product"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setShowProductDropdown(true);
                  }}
                  onFocus={() => setShowProductDropdown(true)}
                  className="pl-10"
                />
              </div>
              {showProductDropdown && products.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => addProduct(product)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex justify-between"
                    >
                      <span>{product.name}</span>
                      <span className="text-gray-600">
                        ${product.price.toFixed(2)} (Stock: {product.stock})
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {orderItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No items added. Search and add products above.
              </p>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-right">Price</th>
                      <th className="px-4 py-2 text-center">Quantity</th>
                      <th className="px-4 py-2 text-right">Total</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item) => (
                      <tr key={item.productId} className="border-t">
                        <td className="px-4 py-3">{item.productName}</td>
                        <td className="px-4 py-3 text-right">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.productId,
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-20 mx-auto text-center"
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={orderData.shippingAddress}
                  onChange={(e) =>
                    setOrderData({ ...orderData, shippingAddress: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={orderData.shippingCity}
                    onChange={(e) =>
                      setOrderData({ ...orderData, shippingCity: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={orderData.shippingState}
                    onChange={(e) =>
                      setOrderData({ ...orderData, shippingState: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zip">Postal Code *</Label>
                  <Input
                    id="zip"
                    value={orderData.shippingZip}
                    onChange={(e) =>
                      setOrderData({ ...orderData, shippingZip: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={orderData.shippingCountry}
                    onChange={(e) =>
                      setOrderData({ ...orderData, shippingCountry: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tax">Tax ($)</Label>
                <Input
                  id="tax"
                  type="number"
                  step="0.01"
                  min="0"
                  value={orderData.tax}
                  onChange={(e) =>
                    setOrderData({ ...orderData, tax: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="shipping">Shipping ($)</Label>
                <Input
                  id="shipping"
                  type="number"
                  step="0.01"
                  min="0"
                  value={orderData.shipping}
                  onChange={(e) =>
                    setOrderData({ ...orderData, shipping: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">${orderData.tax}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">${orderData.shipping}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !selectedCustomer || orderItems.length === 0}
              className="w-full"
            >
              {isSubmitting ? 'Creating Order...' : 'Create Order'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
