import { redirect } from 'next/navigation';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function LandingPageDetails({ params }: PageProps) {
    const { id } = await params;
    redirect(`/admin/cms/landing-pages/${id}/editor`);
}
