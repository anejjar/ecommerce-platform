import { requirePermission } from '@/lib/permission-guard';
import AnalyticsClient from './AnalyticsClient';

export default async function LoyaltyAnalyticsPage() {
  await requirePermission('LOYALTY', 'VIEW');
  return <AnalyticsClient />;
}
