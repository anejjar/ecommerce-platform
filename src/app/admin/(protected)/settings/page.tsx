import { requirePermission } from '@/lib/permission-guard';
import SettingsMainClient from './SettingsMainClient';

export default async function SettingsPage() {
  await requirePermission('SETTINGS', 'VIEW');
  return <SettingsMainClient />;
}
