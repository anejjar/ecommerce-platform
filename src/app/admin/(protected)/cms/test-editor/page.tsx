import { requirePermission } from '@/lib/permission-guard';
import TestEditorClient from './TestEditorClient';

export default async function TestEditorPage() {
  await requirePermission('CMS', 'MANAGE');
  return <TestEditorClient />;
}
