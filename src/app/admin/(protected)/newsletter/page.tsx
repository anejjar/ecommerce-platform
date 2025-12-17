import { requirePermission } from '@/lib/permission-guard';
import NewsletterClient from './NewsletterClient';

export default async function NewsletterPage() {
    await requirePermission('NEWSLETTER', 'VIEW');
    return <NewsletterClient />;
}
