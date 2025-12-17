import { requirePermission } from '@/lib/permission-guard';
import PagesClient from './PagesClient';

export default async function PagesPage() {
    await requirePermission('PAGE', 'VIEW');
    return <PagesClient />;
}
