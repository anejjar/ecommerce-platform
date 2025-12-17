import { requirePermission } from '@/lib/permission-guard';
import OrdersClient from './OrdersClient';

export default async function PosOrdersPage() {
  await requirePermission('POS', 'VIEW');
  return <OrdersClient />;
}
