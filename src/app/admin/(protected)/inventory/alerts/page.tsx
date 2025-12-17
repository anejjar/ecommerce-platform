import { requirePermission } from '@/lib/permission-guard';
import AlertsClient from './AlertsClient';

export default async function AlertsPage() {
  await requirePermission('STOCK_ALERT', 'VIEW');
  return <AlertsClient />;
}
