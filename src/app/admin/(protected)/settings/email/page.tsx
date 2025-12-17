import { requirePermission } from '@/lib/permission-guard';
import EmailClient from './EmailClient';

export default async function EmailSettingsPage() {
  await requirePermission('SETTINGS', 'VIEW');
  return <EmailClient />;
}
