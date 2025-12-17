import { requirePermission } from '@/lib/permission-guard';
import TranslationsClient from './TranslationsClient';

export default async function TranslationsPage() {
  await requirePermission('SETTINGS', 'VIEW');
  return <TranslationsClient />;
}
