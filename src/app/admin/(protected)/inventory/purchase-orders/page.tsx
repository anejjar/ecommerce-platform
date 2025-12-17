import { requirePermission } from '@/lib/permission-guard';
import PurchaseOrdersClient from './PurchaseOrdersClient';

export default async function PurchaseOrdersPage() {
  await requirePermission('PURCHASE_ORDER', 'VIEW');
  return <PurchaseOrdersClient />;
}
