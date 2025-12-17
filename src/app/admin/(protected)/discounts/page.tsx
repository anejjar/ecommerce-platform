import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requirePermission, checkPermission } from '@/lib/permission-guard';

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
import { Plus } from 'lucide-react';

export default async function DiscountsPage() {
    await requirePermission('DISCOUNT', 'VIEW');
    const { hasAccess: canCreate } = await checkPermission('DISCOUNT', 'CREATE');

    const discountsData = await prisma.discountCode.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { orders: true },
            },
        },
    });

    // Serialize Decimal fields
    const discounts = discountsData.map((discount) => ({
        ...discount,
        value: discount.value.toString(),
        minOrderAmount: discount.minOrderAmount?.toString() || null,
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Discount Codes</h1>
                    <p className="text-gray-600 mt-2">Manage coupons and promotions</p>
                </div>
                {canCreate && (
                    <Link href="/admin/discounts/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Discount
                        </Button>
                    </Link>
                )}
            </div>

            {discounts.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-gray-50">
                    <p className="text-gray-500">No discount codes found</p>
                    {canCreate && (
                        <Link href="/admin/discounts/new" className="text-blue-600 hover:underline mt-2 inline-block">
                            Create your first discount
                        </Link>
                    )}
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Usage</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Dates</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {discounts.map((discount) => {
                                const isActive =
                                    discount.isActive &&
                                    (!discount.endDate || new Date(discount.endDate) > new Date()) &&
                                    (!discount.maxUses || discount.usedCount < discount.maxUses);

                                return (
                                    <TableRow key={discount.id}>
                                        <TableCell className="font-medium font-mono">
                                            {discount.code}
                                        </TableCell>
                                        <TableCell>
                                            {discount.type === 'PERCENTAGE' ? 'Percentage' : 'Fixed Amount'}
                                        </TableCell>
                                        <TableCell>
                                            {discount.type === 'PERCENTAGE'
                                                ? `${discount.value}%`
                                                : `$${discount.value}`}
                                        </TableCell>
                                        <TableCell>
                                            {discount.usedCount} / {discount.maxUses || '∞'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={isActive ? 'default' : 'secondary'}
                                                className={isActive ? 'bg-green-600' : 'bg-gray-500'}
                                            >
                                                {isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {new Date(discount.startDate).toLocaleDateString()}
                                            {discount.endDate && ` - ${new Date(discount.endDate).toLocaleDateString()}`}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
