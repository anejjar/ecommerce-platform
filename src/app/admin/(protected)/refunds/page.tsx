import { requirePermission } from '@/lib/permission-guard';
import RefundsClient from './RefundsClient';

export default async function RefundsPage() {
    await requirePermission('REFUND', 'VIEW');
    return <RefundsClient />;
}
