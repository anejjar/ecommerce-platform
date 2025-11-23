'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MediaGrid } from './MediaGrid';
import { MediaSidebar } from './MediaSidebar';
import { MediaUploader } from '../MediaUploader/MediaUploader';
import { MediaItem, MediaFilters } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Upload, Filter, RefreshCw, FolderPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const MediaLibrary: React.FC = () => {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [activeItem, setActiveItem] = useState<MediaItem | null>(null);
    const [showUploader, setShowUploader] = useState(false);
    const [filters, setFilters] = useState<MediaFilters>({
        search: '',
        folderId: null,
        type: null,
        sort: 'newest',
    });

    const fetchMedia = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.folderId) params.append('folderId', filters.folderId);
            if (filters.type) params.append('type', filters.type);
            if (filters.sort) params.append('sort', filters.sort);

            const res = await fetch(`/api/media?${params.toString()}`);
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            setItems(data.media);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load media');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchMedia();
    }, [fetchMedia]);

    const handleUploadComplete = () => {
        fetchMedia();
        setShowUploader(false);
        toast.success('Upload complete');
    };

    const handleUpdate = async (id: string, data: Partial<MediaItem>) => {
        const res = await fetch(`/api/media/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Failed to update');

        const updatedItem = await res.json();
        setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
        setActiveItem(updatedItem);
    };

    const handleDelete = async (id: string) => {
        const res = await fetch(`/api/media/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) throw new Error('Failed to delete');

        setItems(prev => prev.filter(item => item.id !== id));
        if (activeItem?.id === id) setActiveItem(null);
        setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    };

    const handleSelect = (item: MediaItem, multi: boolean) => {
        if (multi) {
            setSelectedItems(prev =>
                prev.includes(item.id)
                    ? prev.filter(id => id !== item.id)
                    : [...prev, item.id]
            );
        } else {
            setActiveItem(item);
        }
    };

    return (
        <div className="flex h-[calc(100vh-100px)] flex-col bg-background">
            {/* Enhanced Header */}
            <div className="border-b bg-card">
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Manage and organize your media assets
                            </p>
                        </div>
                        {!loading && (
                            <div className="flex items-center gap-4 pl-6 border-l">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{items.length}</div>
                                    <div className="text-xs text-muted-foreground">Total Files</div>
                                </div>
                                {selectedItems.length > 0 && (
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{selectedItems.length}</div>
                                        <div className="text-xs text-muted-foreground">Selected</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setShowUploader(!showUploader)}
                            variant={showUploader ? "secondary" : "default"}
                            className="gap-2"
                        >
                            <Upload className="h-4 w-4" />
                            {showUploader ? 'Cancel Upload' : 'Upload Files'}
                        </Button>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="flex items-center gap-3 px-6 pb-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by filename, alt text, or tags..."
                            className="pl-9 bg-background"
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                    </div>

                    <Select
                        value={filters.type || "all"}
                        onValueChange={(val) => setFilters(prev => ({ ...prev, type: val === "all" ? null : val }))}
                    >
                        <SelectTrigger className="w-[140px] bg-background">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="IMAGE">Images</SelectItem>
                            <SelectItem value="VIDEO">Videos</SelectItem>
                            <SelectItem value="DOCUMENT">Documents</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.sort || "newest"}
                        onValueChange={(val) => setFilters(prev => ({ ...prev, sort: val }))}
                    >
                        <SelectTrigger className="w-[140px] bg-background">
                            <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="name">Name (A-Z)</SelectItem>
                            <SelectItem value="size">File Size</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon" onClick={fetchMedia} title="Refresh">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {showUploader ? (
                        <MediaUploader onUploadComplete={handleUploadComplete} folderId={filters.folderId} />
                    ) : (
                        <MediaGrid
                            items={items}
                            selectedItems={selectedItems}
                            onSelect={handleSelect}
                            onItemClick={(item) => setActiveItem(item)}
                            loading={loading}
                            onUploadClick={() => setShowUploader(true)}
                        />
                    )}
                </div>

                {/* Sidebar */}
                {activeItem && (
                    <MediaSidebar
                        item={activeItem}
                        onClose={() => setActiveItem(null)}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </div>
    );
};
