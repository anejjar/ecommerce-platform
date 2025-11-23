import { MediaLibrary, MediaFolder, MediaTag, MediaUsage } from '@prisma/client';

export type MediaItem = MediaLibrary & {
    folder?: MediaFolder | null;
    tags?: MediaTag[];
    usage?: MediaUsage[];
    uploadedBy?: {
        name: string | null;
        image: string | null;
    };
};

export type MediaViewMode = 'grid' | 'list';

export interface MediaFilters {
    search: string;
    folderId: string | null;
    type: string | null;
    sort: string;
}

export interface MediaFolderWithChildren extends MediaFolder {
    children?: MediaFolderWithChildren[];
    _count?: {
        media: number;
    };
}
