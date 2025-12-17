import React from 'react';
import { MediaLibrary } from '@/components/media-manager/MediaLibrary/MediaLibrary';
import { Metadata } from 'next';
import { requirePermission } from '@/lib/permission-guard';

export const metadata: Metadata = {
    title: 'Media Library | Admin',
    description: 'Manage your media assets',
};

export default async function MediaPage() {
    await requirePermission('MEDIA', 'VIEW');

    return (
        <div className="h-full">
            <MediaLibrary />
        </div>
    );
}
