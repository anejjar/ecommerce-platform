import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default async function CustomersPage() {
  const customersData = await prisma.user.findMany({
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
  });

  // Convert Decimal fields to strings for client components
  const customers = customersData.map(customer => ({
    ...customer,
    orders: customer.orders.map(order => ({
      ...order,
      total: order.total.toString(),
    })),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground mt-2">Manage your customer base</p>
        </div>
        <Button asChild>
          <a href="/api/customers/export" download>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No customers yet</p>
            </div>
          ) : (
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
                      <TableCell>${totalSpent.toFixed(2)}</TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
