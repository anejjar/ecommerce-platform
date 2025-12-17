import { requirePermission } from '@/lib/permission-guard';
import EditCampaignClient from './EditCampaignClient';

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('EMAIL_CAMPAIGN', 'UPDATE');
  return <EditCampaignClient params={params} />;
}
