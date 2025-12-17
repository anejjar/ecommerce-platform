import { requirePermission } from '@/lib/permission-guard';
import StockAlertsClient from './StockAlertsClient';

export default async function StockAlertsPage() {
  await requirePermission('STOCK_ALERT', 'VIEW');
  return <StockAlertsClient />;
}
