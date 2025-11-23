'use client';

import React from 'react';
import Image from 'next/image';
import { MediaItem as MediaItemType } from '../types';
import { formatBytes, getFileIcon } from '../utils';
import { FileIcon, Video, Music, FileText, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaItemProps {
    item: MediaItemType;
    selected: boolean;
    onSelect: (item: MediaItemType, multi: boolean) => void;
    onClick: (item: MediaItemType) => void;
}

export const MediaItem: React.FC<MediaItemProps> = ({ item, selected, onSelect, onClick }) => {
    const isImage = item.type === 'IMAGE';

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (e.ctrlKey || e.metaKey) {
            onSelect(item, true);
        } else {
            onClick(item);
        }
    };

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(item, true);
    };

    return (
        <div
            className={cn(
                "group relative aspect-square cursor-pointer rounded-lg border bg-card overflow-hidden transition-all hover:shadow-md",
                selected ? "border-primary ring-2 ring-primary ring-offset-2" : "border-border"
            )}
            onClick={handleClick}
        >
            {/* Selection Checkbox */}
            <div
                className={cn(
                    "absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-white transition-opacity",
                    selected ? "opacity-100 border-primary bg-primary text-primary-foreground" : "opacity-0 group-hover:opacity-100 border-gray-300"
                )}
                onClick={handleSelect}
            >
                {selected && <Check className="h-4 w-4" />}
            </div>

            {/* Preview */}
            <div className="relative h-full w-full bg-muted/20">
                {isImage && item.secureUrl ? (
                    <Image
                        src={item.secureUrl}
                        alt={item.altText || item.filename}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center p-4 text-muted-foreground">
                        {item.type === 'VIDEO' && <Video className="h-12 w-12 mb-2" />}
                        {item.type === 'AUDIO' && <Music className="h-12 w-12 mb-2" />}
                        {item.type === 'DOCUMENT' && <FileText className="h-12 w-12 mb-2" />}
                        {item.type === 'OTHER' && <FileIcon className="h-12 w-12 mb-2" />}
                        <span className="text-xs font-medium truncate w-full text-center">{item.filename}</span>
                    </div>
                )}
            </div>

            {/* Footer Info (visible on hover) */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <p className="truncate text-xs font-medium">{item.filename}</p>
                <p className="text-[10px] text-gray-300">{formatBytes(item.fileSize)}</p>
            </div>
        </div>
    );
};
