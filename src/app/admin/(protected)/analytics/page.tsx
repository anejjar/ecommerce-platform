import { requirePermission } from '@/lib/permission-guard';
import AnalyticsClient from './AnalyticsClient';

export default async function AnalyticsPage() {
    await requirePermission('ANALYTICS', 'VIEW');
    return <AnalyticsClient />;
}
