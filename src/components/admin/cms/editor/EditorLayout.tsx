import React, { useState, useEffect, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft, Loader2, Settings, X, PanelRightClose, PanelRightOpen, LayoutTemplate, Eye, PanelLeftClose, PanelLeftOpen, Search, CheckCircle2, AlertCircle, Undo2, Redo2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SidebarBlock } from './SidebarBlock';
import { Canvas } from './Canvas';
import { ConfigForm } from '../block-editor/ConfigForm';
import { PageSettingsForm } from './PageSettingsForm';
import { EditorBlock } from '@/hooks/usePageEditor';
import Link from 'next/link';
import { DevicePreview, DeviceType } from './DevicePreview';
import { useAdminSidebar } from '@/components/admin/AdminSidebarContext';
import { cn } from '@/lib/utils';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

interface EditorLayoutProps {
    pageTitle: string;
    pageId: string;
    pageSlug: string;
    pageData: any;
    blocks: EditorBlock[];
    templates: any[];
    selectedBlockId: string | null;
    isSaving: boolean;
    isDirty: boolean;
    autoSaveStatus?: 'idle' | 'saving' | 'saved' | 'error';
    onAddBlock: (template: any) => void;
    onSelectBlock: (id: string) => void;
    onRemoveBlock: (id: string) => void;
    onReorderBlocks: (blocks: EditorBlock[]) => void;
    onUpdateBlockConfig: (id: string, config: any) => void;
    onUpdatePageData: (field: string, value: any) => void;
    onSave: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    canUndo?: boolean;
    canRedo?: boolean;
    onDuplicateBlock?: (blockId: string) => void;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({
    pageTitle,
    pageId,
    pageSlug,
    pageData,
    blocks,
    templates,
    selectedBlockId,
    isSaving,
    isDirty,
    autoSaveStatus = 'idle',
    onAddBlock,
    onSelectBlock,
    onRemoveBlock,
    onReorderBlocks,
    onUpdateBlockConfig,
    onUpdatePageData,
    onSave,
    onUndo,
    onRedo,
    canUndo = false,
    canRedo = false,
    onDuplicateBlock
}) => {
    const selectedBlock = blocks.find(b => b.id === selectedBlockId);
    const [device, setDevice] = useState<DeviceType>('desktop');
    const { setIsCollapsed } = useAdminSidebar();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isBlockLibraryOpen, setIsBlockLibraryOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Collapse admin sidebar on mount
    useEffect(() => {
        setIsCollapsed(true);
        return () => setIsCollapsed(false);
    }, [setIsCollapsed]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger shortcuts when typing in inputs
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                // Allow Ctrl+S for save even in inputs
                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                    if (isDirty && !isSaving) {
                        onSave();
                    }
                }
                return;
            }

            // Ctrl+S - Save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                if (isDirty && !isSaving) {
                    onSave();
                }
            }
            // Ctrl+Z - Undo
            else if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                if (canUndo && onUndo) {
                    onUndo();
                }
            }
            // Ctrl+Y or Ctrl+Shift+Z - Redo
            else if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
                e.preventDefault();
                if (canRedo && onRedo) {
                    onRedo();
                }
            }
            // Delete - Remove selected block
            else if (e.key === 'Delete' && selectedBlockId) {
                e.preventDefault();
                onRemoveBlock(selectedBlockId);
            }
            // Arrow Up/Down - Navigate blocks
            else if (e.key === 'ArrowUp' && selectedBlockId) {
                e.preventDefault();
                const currentIndex = blocks.findIndex(b => b.id === selectedBlockId);
                if (currentIndex > 0) {
                    onSelectBlock(blocks[currentIndex - 1].id);
                }
            }
            else if (e.key === 'ArrowDown' && selectedBlockId) {
                e.preventDefault();
                const currentIndex = blocks.findIndex(b => b.id === selectedBlockId);
                if (currentIndex < blocks.length - 1) {
                    onSelectBlock(blocks[currentIndex + 1].id);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isDirty, isSaving, canUndo, canRedo, onUndo, onRedo, onSave, selectedBlockId, blocks, onSelectBlock, onRemoveBlock]);

    // Toggle settings when block is selected/deselected via gear icon
    const handleBlockSelect = (id: string) => {
        if (selectedBlockId === id && isSettingsOpen) {
            // If clicking the same block's gear icon, toggle settings panel
            setIsSettingsOpen(false);
        } else {
            // Select block and open settings
            onSelectBlock(id);
            setIsSettingsOpen(true);
        }
    };

    // Handle block click (not gear icon) - just select
    const handleBlockClick = (id: string) => {
        onSelectBlock(id);
        setIsSettingsOpen(true);
    };

    // Filter templates based on search query
    const filteredTemplates = useMemo(() => {
        if (!searchQuery.trim()) {
            return templates;
        }
        const query = searchQuery.toLowerCase().trim();
        return templates.filter(template => {
            const nameMatch = template.name?.toLowerCase().includes(query);
            const descriptionMatch = template.description?.toLowerCase().includes(query);
            const categoryMatch = template.category?.toLowerCase().replace('_', ' ').includes(query);
            const slugMatch = template.slug?.toLowerCase().includes(query);
            return nameMatch || descriptionMatch || categoryMatch || slugMatch;
        });
    }, [templates, searchQuery]);

    // Group templates by category
    const templatesByCategory = useMemo(() => {
        return filteredTemplates.reduce((acc, template) => {
            const category = template.category;
            if (!acc[category]) acc[category] = [];
            acc[category].push(template);
            return acc;
        }, {} as Record<string, any[]>);
    }, [filteredTemplates]);

    return (
        <div className="fixed inset-0 lg:left-[70px] z-30 bg-background flex flex-col">
            {/* Header */}
            <header className="h-16 border-b flex items-center justify-between px-6 bg-white/80 backdrop-blur-sm shrink-0 z-20">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/cms/landing-pages" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="font-semibold text-base">{pageData.title || pageTitle}</h1>
                            <span className="text-xs text-muted-foreground">Page Editor</span>
                        </div>
                    </div>

                    <div className="h-6 w-px bg-gray-200" />

                    <DevicePreview device={device} onChange={setDevice} />
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            if (isSettingsOpen && !selectedBlockId) {
                                // If page settings is already open, toggle it closed
                                setIsSettingsOpen(false);
                            } else {
                                // Otherwise, open page settings
                                onSelectBlock(''); // Deselect block to show page settings
                                setIsSettingsOpen(true);
                            }
                        }}
                        className={cn("gap-2", isSettingsOpen && !selectedBlockId && "bg-accent")}
                    >
                        <Settings className="h-4 w-4" />
                        Page Settings
                    </Button>

                    <div className="h-6 w-px bg-gray-200" />

                    {/* Undo/Redo buttons */}
                    {onUndo && onRedo && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onUndo}
                                disabled={!canUndo}
                                title="Undo (Ctrl+Z)"
                                className="h-8 w-8"
                            >
                                <Undo2 className={cn("h-4 w-4", !canUndo && "text-gray-300")} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onRedo}
                                disabled={!canRedo}
                                title="Redo (Ctrl+Y)"
                                className="h-8 w-8"
                            >
                                <Redo2 className={cn("h-4 w-4", !canRedo && "text-gray-300")} />
                            </Button>
                            <div className="h-6 w-px bg-gray-200" />
                        </>
                    )}

                    {/* Auto-save status indicator */}
                    {autoSaveStatus !== 'idle' && (
                        <div className={cn(
                            "flex items-center gap-2 text-xs px-3 py-1.5 rounded-md transition-all",
                            autoSaveStatus === 'saving' && "bg-blue-50 text-blue-700",
                            autoSaveStatus === 'saved' && "bg-green-50 text-green-700",
                            autoSaveStatus === 'error' && "bg-red-50 text-red-700"
                        )}>
                            {autoSaveStatus === 'saving' && (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span>Auto-saving...</span>
                                </>
                            )}
                            {autoSaveStatus === 'saved' && (
                                <>
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span>Auto-saved</span>
                                </>
                            )}
                            {autoSaveStatus === 'error' && (
                                <>
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    <span>Auto-save failed</span>
                                </>
                            )}
                        </div>
                    )}

                    <Link href={`/en/landing/${pageSlug}`} target="_blank">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                        >
                            <Eye className="h-4 w-4" />
                            Preview
                        </Button>
                    </Link>

                    <Button
                        size="sm"
                        onClick={onSave}
                        disabled={!isDirty || isSaving}
                        className="min-w-[120px]"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className="ml-2"
                    >
                        {isSettingsOpen ? (
                            <PanelRightClose className="h-5 w-5 text-muted-foreground" />
                        ) : (
                            <PanelRightOpen className="h-5 w-5 text-muted-foreground" />
                        )}
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative min-h-0">
                {/* Left Sidebar - Block Library (Collapsible) */}
                <div
                    className={cn(
                        "border-r flex flex-col bg-white shrink-0 shadow-sm transition-all duration-300 ease-in-out min-h-0",
                        isBlockLibraryOpen ? "w-72" : "w-0 border-r-0 overflow-hidden"
                    )}
                >
                    <div className={cn(
                        "border-b bg-gray-50/50 shrink-0 transition-opacity",
                        !isBlockLibraryOpen && "opacity-0"
                    )}>
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
                                <h2 className="font-semibold text-sm">Block Library</h2>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => setIsBlockLibraryOpen(false)}
                                title="Collapse Block Library"
                            >
                                <PanelLeftClose className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>
                        {isBlockLibraryOpen && (
                            <div className="px-4 pb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Search blocks..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 h-9 text-sm"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    {isBlockLibraryOpen && (
                        <ScrollArea className="flex-1 min-h-0">
                            <div className="p-4 space-y-6 pb-8">
                                {Object.keys(templatesByCategory).length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                                        <p className="text-sm font-medium text-muted-foreground mb-1">
                                            No blocks found
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Try a different search term
                                        </p>
                                    </div>
                                ) : (
                                    Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
                                        <div key={category}>
                                            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3 px-1 tracking-wider">
                                                {category.replace('_', ' ')}
                                                {searchQuery && (
                                                    <span className="ml-2 text-muted-foreground/70">
                                                        ({categoryTemplates.length})
                                                    </span>
                                                )}
                                            </h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {(categoryTemplates as any[]).map(template => (
                                                    <SidebarBlock
                                                        key={template.id}
                                                        template={template}
                                                        onAdd={() => onAddBlock(template)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                {/* Toggle Button for Block Library (when collapsed) */}
                {!isBlockLibraryOpen && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-10 w-6 rounded-r-md rounded-l-none border-l-0 shadow-md bg-white hover:bg-gray-50"
                        onClick={() => setIsBlockLibraryOpen(true)}
                        title="Expand Block Library"
                    >
                        <PanelLeftOpen className="h-4 w-4 text-muted-foreground" />
                    </Button>
                )}

                {/* Center - Canvas */}
                <div className="flex-1 flex flex-col overflow-hidden relative bg-gray-50 h-full">
                    <ScrollArea className="flex-1 h-full">
                        <div className="min-h-full py-6 px-4 flex justify-center">
                            <Canvas
                                blocks={blocks}
                                selectedBlockId={selectedBlockId}
                                onSelectBlock={handleBlockClick}
                                onToggleBlockSettings={handleBlockSelect}
                                onRemoveBlock={onRemoveBlock}
                                onReorderBlocks={onReorderBlocks}
                                onDuplicateBlock={onDuplicateBlock}
                                device={device}
                            />
                        </div>
                    </ScrollArea>
                </div>

                {/* Right Sidebar - Inspector (Collapsible) */}
                <div
                    className={cn(
                        "w-80 xl:w-96 border-l flex flex-col bg-white shrink-0 transition-all duration-300 ease-in-out absolute right-0 top-0 bottom-0 z-20 shadow-lg lg:static lg:shadow-none min-h-0",
                        !isSettingsOpen && "translate-x-full lg:w-0 lg:translate-x-0 lg:border-l-0 lg:overflow-hidden opacity-0 lg:opacity-100"
                    )}
                >
                    <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between h-[57px] shrink-0">
                        <h2 className="font-semibold text-sm">
                            {selectedBlock ? 'Block Settings' : 'Page Settings'}
                        </h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 lg:hidden"
                            onClick={() => setIsSettingsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    {isSettingsOpen && (
                        <ScrollArea className="flex-1 min-h-0">
                            <div className="p-4 pb-8">
                                {selectedBlock ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                                            <span className="text-sm font-medium text-gray-900">
                                                {selectedBlock.template?.name}
                                            </span>
                                            <span className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-1 bg-white rounded border">
                                                {selectedBlock.template?.category}
                                            </span>
                                        </div>

                                        <ConfigForm
                                            schema={selectedBlock.template?.configSchema}
                                            data={selectedBlock.config}
                                            onChange={(newConfig) => onUpdateBlockConfig(selectedBlock.id, newConfig)}
                                        />
                                    </div>
                                ) : (
                                    <PageSettingsForm
                                        pageData={pageData}
                                        onChange={onUpdatePageData}
                                    />
                                )}
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </div>
        </div>
    );
};
