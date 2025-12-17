import { requirePermission } from '@/lib/permission-guard';
import GeneralClient from './GeneralClient';

export default async function GeneralSettingsPage() {
  await requirePermission('SETTINGS', 'VIEW');
  return <GeneralClient />;
}
