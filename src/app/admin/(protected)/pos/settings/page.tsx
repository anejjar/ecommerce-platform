import { requirePermission } from '@/lib/permission-guard';
import SettingsClient from './SettingsClient';

export default async function PosSettingsPage() {
  await requirePermission('POS', 'UPDATE');
  return <SettingsClient />;
}
