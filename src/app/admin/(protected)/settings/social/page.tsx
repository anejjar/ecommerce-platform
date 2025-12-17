import { requirePermission } from '@/lib/permission-guard';
import SocialClient from './SocialClient';

export default async function SocialSettingsPage() {
  await requirePermission('SETTINGS', 'VIEW');
  return <SocialClient />;
}
