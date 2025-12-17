import { requirePermission } from '@/lib/permission-guard';
import EmailCampaignsClient from './EmailCampaignsClient';

export default async function EmailCampaignsPage() {
    await requirePermission('EMAIL_CAMPAIGN', 'VIEW');
    return <EmailCampaignsClient />;
}
