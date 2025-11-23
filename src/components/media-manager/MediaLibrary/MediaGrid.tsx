'use client';

import React from 'react';
import { MediaItem } from './MediaItem';
import { MediaItem as MediaItemType } from '../types';
import { Loader2, ImageIcon, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaGridProps {
    items: MediaItemType[];
    selectedItems: string[];
    onSelect: (item: MediaItemType, multi: boolean) => void;
    onItemClick: (item: MediaItemType) => void;
    loading: boolean;
    onUploadClick?: () => void;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
    items,
    selectedItems,
    onSelect,
    onItemClick,
    loading,
    onUploadClick,
}) => {
    if (loading && items.length === 0) {
        return (
            <div className="flex h-64 w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-350px)] px-4">
                <div className="w-full max-w-3xl border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="relative mb-6 group">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500"></div>
                        <div className="relative bg-background rounded-full p-6 shadow-sm ring-1 ring-border group-hover:scale-110 transition-transform duration-500">
                            <div className="bg-primary/10 rounded-full p-4">
                                <ImageIcon className="h-12 w-12 text-primary" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold tracking-tight mb-2">No media files yet</h3>
                    <p className="text-muted-foreground mb-8 max-w-md text-center text-base">
                        Upload images, videos, or documents to start building your library.
                        Your assets will be available across your entire store.
                    </p>

                    <div className="flex items-center gap-4 mb-12">
                        {onUploadClick && (
                            <Button onClick={onUploadClick} size="lg" className="h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                                <Upload className="h-5 w-5 mr-2" />
                                Upload Files
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-12 w-full max-w-2xl border-t pt-8">
                        <div className="flex flex-col items-center gap-2 group cursor-default">
                            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <ImageIcon className="h-6 w-6" />
                            </div>
                            <div className="text-center">
                                <h4 className="font-semibold text-sm">Images</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, WebP</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2 group cursor-default">
                            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <h4 className="font-semibold text-sm">Videos</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">MP4, WebM</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2 group cursor-default">
                            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <h4 className="font-semibold text-sm">Documents</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">PDF, DOC, TXT</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {items.map((item) => (
                <MediaItem
                    key={item.id}
                    item={item}
                    selected={selectedItems.includes(item.id)}
                    onSelect={onSelect}
                    onClick={onItemClick}
                />
            ))}
        </div>
    );
};
