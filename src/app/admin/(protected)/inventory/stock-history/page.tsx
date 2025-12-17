import { requirePermission } from '@/lib/permission-guard';
import StockHistoryClient from './StockHistoryClient';

export default async function StockHistoryPage() {
  await requirePermission('INVENTORY', 'VIEW');
  return <StockHistoryClient />;
}
