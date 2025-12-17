import { requirePermission } from '@/lib/permission-guard';
import { isFeatureEnabled } from '@/lib/features';
import { notFound } from 'next/navigation';
import TrafficAnalyticsClient from './TrafficAnalyticsClient';

export default async function TrafficAnalyticsPage() {
  // Check if feature is enabled
  const featureEnabled = await isFeatureEnabled('traffic_analytics');
  if (!featureEnabled) {
    notFound();
  }

  // Check permissions
  await requirePermission('ANALYTICS', 'VIEW');

  return <TrafficAnalyticsClient />;
}
