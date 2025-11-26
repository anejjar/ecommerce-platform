'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

interface StockHistoryFilters {
  search: string;
  changeType: string;
  supplierId: string;
  startDate: string;
  endDate: string;
}

interface StockHistoryItem {
  id: string;
  changeType: string;
  quantityBefore: number;
  quantityAfter: number;
  quantityChange: number;
  reason: string | null;
  createdAt: string;
  product: {
    id: string;
    name: string;
    sku: string | null;
    slug: string;
  } | null;
  supplier: {
    id: string;
    name: string;
  } | null;
  user: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

interface StockHistoryTableProps {
  filters: StockHistoryFilters;
}

const changeTypeColors: Record<string, string> = {
  SALE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  REFUND: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  RESTOCK: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  ADJUSTMENT: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  DAMAGE: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  RETURN: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  TRANSFER: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
};

export function StockHistoryTable({ filters }: StockHistoryTableProps) {
  const [history, setHistory] = useState<StockHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 50;

  useEffect(() => {
    fetchHistory();
  }, [filters, page]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters.search) {
        // We'll search by product name/SKU on the backend
        params.append('search', filters.search);
      }
      if (filters.changeType && filters.changeType !== 'all') {
        params.append('changeType', filters.changeType);
      }
      if (filters.supplierId && filters.supplierId !== 'all') {
        params.append('supplierId', filters.supplierId);
      }
      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }

      const response = await fetch(`/api/admin/inventory/stock-history?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch stock history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-12">
        <div className="text-center text-muted-foreground">Loading stock history...</div>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          <p>No stock history found</p>
          <p className="text-sm mt-2">Try adjusting your filters</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Change Type</TableHead>
                <TableHead className="text-center">Qty Before</TableHead>
                <TableHead className="text-center">Qty After</TableHead>
                <TableHead className="text-center">Change</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-sm">
                    {new Date(item.createdAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>
                    {item.product ? (
                      <Link
                        href={`/admin/products/${item.product.slug}`}
                        className="font-medium hover:text-primary hover:underline"
                      >
                        {item.product.name}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">Deleted Product</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {item.product?.sku || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={changeTypeColors[item.changeType] || ''}>
                      {item.changeType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {item.quantityBefore}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {item.quantityAfter}
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center justify-center gap-1 ${item.quantityChange > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {item.quantityChange > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="font-medium">
                        {item.quantityChange > 0 ? '+' : ''}{item.quantityChange}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.supplier ? (
                      <Link
                        href={`/admin/inventory/suppliers/${item.supplier.id}`}
                        className="text-sm hover:text-primary hover:underline"
                      >
                        {item.supplier.name}
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{item.reason || '-'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {item.user?.name || item.user?.email || 'System'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <div className="text-sm">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
