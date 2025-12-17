import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatCurrencyServer, getCurrencySymbol } from '@/lib/server-currency';
import { formatCurrencyWithSymbol } from '@/lib/formatting';
import { requirePermission } from '@/lib/permission-guard';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // Require VIEW permission for CUSTOMER resource
  await requirePermission('CUSTOMER', 'VIEW');

  const params = await searchParams;
  const pageParam = parseInt(params.page || '1', 10);
  const page = pageParam > 0 ? pageParam : 1;
  const limit = 20; // Customers per page
  const skip = (page - 1) * limit;

  // Get total count and customers with pagination
  const [customersData, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
      },
      include: {
        orders: {
          select: {
            id: true,
            total: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.user.count({
      where: {
        role: 'CUSTOMER',
      },
    }),
  ]);

  // Convert Decimal fields to strings for client components
  const customers = customersData.map(customer => ({
    ...customer,
    orders: customer.orders.map(order => ({
      ...order,
      total: order.total.toString(),
    })),
  }));

  // Get currency symbol for formatting
  const currencySymbol = await getCurrencySymbol();
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground mt-2">
            Showing {customers.length > 0 ? skip + 1 : 0} to {Math.min(skip + limit, total)} of {total} customers
          </p>
        </div>
        <Button asChild>
          <a href="/api/customers/export" download>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </a>
        </Button>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <p className="text-muted-foreground">No customers yet</p>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => {
                  const totalSpent = customer.orders.reduce(
                    (sum, order) => sum + Number(order.total),
                    0
                  );

                  return (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.name || 'N/A'}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer._count.orders}</TableCell>
                      <TableCell>{formatCurrencyWithSymbol(totalSpent, currencySymbol)}</TableCell>
                      <TableCell>
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="link" asChild className="p-0 h-auto">
                          <Link href={`/admin/customers/${customer.id}`}>
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Link href={`/admin/customers?page=${page - 1}`}>
                <Button
                  variant="outline"
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              </Link>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Link href={`/admin/customers?page=${page + 1}`}>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
