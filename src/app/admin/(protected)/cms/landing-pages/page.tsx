import { requirePermission } from '@/lib/permission-guard';
import LandingPagesClient from './LandingPagesClient';

export default async function LandingPagesPage() {
  await requirePermission('PAGE', 'VIEW');
  return <LandingPagesClient />;
}
