import { requirePermission } from '@/lib/permission-guard';
import BackupClient from './BackupClient';

export default async function BackupPage() {
  await requirePermission('BACKUP', 'VIEW');
  return <BackupClient />;
}
