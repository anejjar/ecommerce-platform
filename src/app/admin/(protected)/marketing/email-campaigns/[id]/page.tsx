import { requirePermission } from '@/lib/permission-guard';
import CampaignDetailClient from './CampaignDetailClient';

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('EMAIL_CAMPAIGN', 'VIEW');
  return <CampaignDetailClient params={params} />;
}
