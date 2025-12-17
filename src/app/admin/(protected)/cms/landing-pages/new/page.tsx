import { requirePermission } from '@/lib/permission-guard';
import NewLandingPageClient from './NewLandingPageClient';

export default async function NewLandingPagePage() {
  await requirePermission('PAGE', 'CREATE');
  return <NewLandingPageClient />;
}
