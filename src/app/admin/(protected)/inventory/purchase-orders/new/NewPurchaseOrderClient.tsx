'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PurchaseOrderForm } from '@/components/admin/PurchaseOrderForm';
import { ArrowLeft } from 'lucide-react';

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supplierId = searchParams.get('supplierId');

  const handleSuccess = (orderId: string) => {
    router.push(`/admin/inventory/purchase-orders/${orderId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/inventory/purchase-orders">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Purchase Order</h1>
          <p className="text-muted-foreground mt-2">Create a new order from your supplier</p>
        </div>
      </div>

      <PurchaseOrderForm
        onSuccess={handleSuccess}
        defaultSupplierId={supplierId || undefined}
      />
    </div>
  );
}
