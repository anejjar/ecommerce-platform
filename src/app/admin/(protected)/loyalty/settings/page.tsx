import { requirePermission } from '@/lib/permission-guard';
import SettingsClient from './SettingsClient';

export default async function LoyaltySettingsPage() {
  await requirePermission('LOYALTY', 'UPDATE');
  return <SettingsClient />;
}
