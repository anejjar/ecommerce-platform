'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Eye, X, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface PosOrder {
  id: string;
  orderNumber: string;
  orderType: 'DINE_IN' | 'TAKE_AWAY' | 'DELIVERY';
  paymentMethod: 'CASH' | 'CARD' | 'DIGITAL_WALLET' | 'SPLIT';
  total: number;
  status: string;
  location: {
    id: string;
    name: string;
  } | null;
  cashier: {
    id: string;
    user: {
      name: string | null;
    } | null;
  } | null;
  createdAt: string;
  orderId: string | null;
}

export default function POSOrdersPage() {
  const [orders, setOrders] = useState<PosOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<PosOrder | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    orderType: 'all',
    locationId: 'all',
    dateFrom: '',
    dateTo: '',
  });
  const [locations, setLocations] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    fetchLocations();
    fetchOrders();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/pos/locations');
      if (response.ok) {
        const data = await response.json();
        setLocations(data || []);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.orderType !== 'all') {
        params.append('orderType', filters.orderType);
      }
      if (filters.locationId !== 'all') {
        params.append('locationId', filters.locationId);
      }
      if (filters.dateFrom) {
        params.append('startDate', filters.dateFrom);
      }
      if (filters.dateTo) {
        params.append('endDate', filters.dateTo);
      }

      const response = await fetch(`/api/pos/orders?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.location?.name.toLowerCase().includes(searchLower) ||
          order.cashier?.user?.name?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      return true;
    });
  }, [orders, filters.search]);

  const handleViewDetails = async (order: PosOrder) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      const response = await fetch(`/api/pos/orders/${orderId}/cancel`, {
        method: 'POST',
      });
      if (response.ok) {
        toast.success('Order cancelled successfully');
        fetchOrders();
      } else {
        toast.error('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('An error occurred');
    }
  };

  const getOrderTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      DINE_IN: 'bg-blue-100 text-blue-800',
      TAKE_AWAY: 'bg-green-100 text-green-800',
      DELIVERY: 'bg-purple-100 text-purple-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      CASH: 'bg-green-100 text-green-800',
      CARD: 'bg-blue-100 text-blue-800',
      DIGITAL_WALLET: 'bg-purple-100 text-purple-800',
      SPLIT: 'bg-orange-100 text-orange-800',
    };
    return colors[method] || 'bg-gray-100 text-gray-800';
  };

  const exportToCSV = () => {
    const headers = ['Order Number', 'Type', 'Payment Method', 'Total', 'Location', 'Cashier', 'Date', 'Status'];
    const rows = filteredOrders.map((order) => [
      order.orderNumber,
      order.orderType,
      order.paymentMethod,
      (order.total || 0).toFixed(2),
      order.location?.name || 'N/A',
      order.cashier?.user?.name || 'N/A',
      format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm'),
      order.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pos-orders-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Orders exported to CSV');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">POS Orders</h1>
          <p className="text-muted-foreground mt-1">View and manage all POS orders</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg bg-muted/30">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-8"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.orderType} onValueChange={(value) => setFilters({ ...filters, orderType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Order Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="DINE_IN">Dine In</SelectItem>
            <SelectItem value="TAKE_AWAY">Take Away</SelectItem>
            <SelectItem value="DELIVERY">Delivery</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.locationId} onValueChange={(value) => setFilters({ ...filters, locationId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc.id} value={loc.id}>
                {loc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="date"
          placeholder="From Date"
          value={filters.dateFrom}
          onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
        />
        <Input
          type="date"
          placeholder="To Date"
          value={filters.dateTo}
          onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
        />
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="text-center py-12">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-semibold">{order.orderNumber}</TableCell>
                  <TableCell>
                    <Badge className={getOrderTypeBadge(order.orderType)}>
                      {order.orderType.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentMethodBadge(order.paymentMethod)}>
                      {order.paymentMethod.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">${(order.total || 0).toFixed(2)}</TableCell>
                  <TableCell>{order.location?.name || 'N/A'}</TableCell>
                  <TableCell>{order.cashier?.user?.name || 'N/A'}</TableCell>
                  <TableCell>{format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}</TableCell>
                  <TableCell>
                    <Badge variant={order.orderId ? 'default' : 'secondary'}>
                      {order.orderId ? 'Completed' : 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!order.orderId && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Type</p>
                  <p className="font-semibold">{selectedOrder.orderType.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-semibold">{selectedOrder.paymentMethod.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">{selectedOrder.location?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cashier</p>
                  <p className="font-semibold">{selectedOrder.cashier?.user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-semibold text-lg">${(selectedOrder.total || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold">
                    {format(new Date(selectedOrder.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

