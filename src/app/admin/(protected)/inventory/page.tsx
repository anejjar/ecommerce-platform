import { requirePermission } from '@/lib/permission-guard';
import InventoryDashboardClient from './InventoryDashboardClient';

export default async function InventoryDashboardPage() {
  await requirePermission('INVENTORY', 'VIEW');
  return <InventoryDashboardClient />;
}
