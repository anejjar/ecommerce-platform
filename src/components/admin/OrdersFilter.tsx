'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Calendar } from 'lucide-react';

interface OrdersFilterProps {
  onFilterChange: (filters: {
    search: string;
    status: string;
    paymentStatus: string;
    dateFrom: string;
    dateTo: string;
  }) => void;
}

export function OrdersFilter({ onFilterChange }: OrdersFilterProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({ search: value, status, paymentStatus, dateFrom, dateTo });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({ search, status: value, paymentStatus, dateFrom, dateTo });
  };

  const handlePaymentStatusChange = (value: string) => {
    setPaymentStatus(value);
    onFilterChange({ search, status, paymentStatus: value, dateFrom, dateTo });
  };

  const handleDateFromChange = (value: string) => {
    setDateFrom(value);
    onFilterChange({ search, status, paymentStatus, dateFrom: value, dateTo });
  };

  const handleDateToChange = (value: string) => {
    setDateTo(value);
    onFilterChange({ search, status, paymentStatus, dateFrom, dateTo: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="search"
            placeholder="Order # or customer..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Order Status</Label>
        <select
          id="status"
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentStatus">Payment</Label>
        <select
          id="paymentStatus"
          value={paymentStatus}
          onChange={(e) => handlePaymentStatusChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">All Payments</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateFrom">From Date</Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="dateFrom"
            type="date"
            value={dateFrom}
            onChange={(e) => handleDateFromChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateTo">To Date</Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="dateTo"
            type="date"
            value={dateTo}
            onChange={(e) => handleDateToChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
}
