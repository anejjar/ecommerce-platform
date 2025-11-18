'use client';

import { useState, useMemo } from 'react';
import { OrdersFilter } from './OrdersFilter';
import { OrdersTable } from './OrdersTable';

interface Order {
  id: string;
  orderNumber: string;
  total: any;
  status: string;
  paymentStatus: string;
  createdAt: Date;
  shippingAddress: {
    address1: string;
    address2: string | null;
    city: string;
    state: string | null;
    postalCode: string;
    country: string;
  } | null;
  user: {
    name: string | null;
    email: string;
  };
  items: any[];
}

interface OrdersListProps {
  orders: Order[];
}

export function OrdersList({ orders }: OrdersListProps) {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    paymentStatus: '',
    dateFrom: '',
    dateTo: '',
  });

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search filter - search in order number, customer name, or email
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.user.name?.toLowerCase().includes(searchLower) ||
          order.user.email.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Order status filter
      if (filters.status && order.status !== filters.status) {
        return false;
      }

      // Payment status filter
      if (filters.paymentStatus && order.paymentStatus !== filters.paymentStatus) {
        return false;
      }

      // Date from filter
      if (filters.dateFrom) {
        const orderDate = new Date(order.createdAt);
        const fromDate = new Date(filters.dateFrom);
        if (orderDate < fromDate) return false;
      }

      // Date to filter
      if (filters.dateTo) {
        const orderDate = new Date(order.createdAt);
        const toDate = new Date(filters.dateTo);
        // Set to end of day for the 'to' date
        toDate.setHours(23, 59, 59, 999);
        if (orderDate > toDate) return false;
      }

      return true;
    });
  }, [orders, filters]);

  return (
    <div className="space-y-4">
      <OrdersFilter onFilterChange={setFilters} />
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <p className="text-gray-500">
            No orders found matching your filters.
          </p>
        </div>
      ) : (
        <OrdersTable orders={filteredOrders} />
      )}
    </div>
  );
}
