import { requirePermission } from '@/lib/permission-guard';
import NewPurchaseOrderClient from './NewPurchaseOrderClient';

export default async function NewPurchaseOrderPage() {
  await requirePermission('PURCHASE_ORDER', 'CREATE');
  return <NewPurchaseOrderClient />;
}
