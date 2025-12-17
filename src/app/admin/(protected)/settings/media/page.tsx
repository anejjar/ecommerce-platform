import { requirePermission } from '@/lib/permission-guard';
import MediaClient from './MediaClient';

export default async function MediaSettingsPage() {
  await requirePermission('MEDIA', 'VIEW');
  return <MediaClient />;
}
