'use client';

import { MediaLibrary } from '@/components/media-manager/MediaLibrary/MediaLibrary';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MediaManagementPage() {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <MediaLibrary />
        </div>
    );
}
