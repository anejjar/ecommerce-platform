import React from 'react';
import { MediaLibrary } from '@/components/media-manager/MediaLibrary/MediaLibrary';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Media Library | Admin',
    description: 'Manage your media assets',
};

export default function MediaPage() {
    return (
        <div className="h-full">
            <MediaLibrary />
        </div>
    );
}
