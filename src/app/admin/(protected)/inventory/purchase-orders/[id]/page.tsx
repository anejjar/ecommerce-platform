import { requirePermission } from '@/lib/permission-guard';
import PurchaseOrderDetailClient from './PurchaseOrderDetailClient';

export default async function PurchaseOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('PURCHASE_ORDER', 'VIEW');
  return <PurchaseOrderDetailClient params={params} />;
}
