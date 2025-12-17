import { requirePermission } from '@/lib/permission-guard';
import AppearanceClient from './AppearanceClient';

export default async function AppearanceSettingsPage() {
  await requirePermission('THEME', 'VIEW');
  return <AppearanceClient />;
}
