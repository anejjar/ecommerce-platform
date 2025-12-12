/**
 * Enhanced Editor Layout
 *
 * Complete Elementor-style editor layout with all new features integrated:
 * - Navigator panel with tree view
 * - Nested canvas with containers
 * - Three-tab settings panel
 * - Finder command palette (Ctrl+E)
 * - History panel (Ctrl+H)
 * - Keyboard shortcuts
 * - Context menus
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Save,
  ArrowLeft,
  Loader2,
  Settings,
  X,
  PanelRightClose,
  PanelRightOpen,
  LayoutTemplate,
  Eye,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  CheckCircle2,
  AlertCircle,
  Undo2,
  Redo2,
  Command,
  History,
  Plus,
  Grid3x3,
  Layers,
  FileText,
  Image,
  Video,
  Heading,
  Mouse,
  MessageSquare,
  Palette,
  Smartphone,
  ShoppingCart,
  Newspaper,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SidebarBlock } from './SidebarBlock';
import { NestedCanvas } from './NestedCanvas';
import { Navigator } from './Navigator';
import { SettingsTabs } from './SettingsTabs';
import { Finder, useFinder } from './Finder';
import { HistoryPanel, useHistoryPanel } from './HistoryPanel';
import { PageSettingsForm } from './PageSettingsForm';
import { EditorBlock, BlockTemplate, ContainerType, DeviceMode } from '@/types/editor';
import Link from 'next/link';
import { DevicePreview, DeviceType } from './DevicePreview';
import { useAdminSidebar } from '@/components/admin/AdminSidebarContext';
import { cn } from '@/lib/utils';
import { useKeyboardShortcuts, createEditorShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useContextMenu, createBlockContextMenu } from './ContextMenu';
import { EditorHistory } from '@/types/editor';

interface EnhancedEditorLayoutProps {
  pageTitle: string;
  pageId: string;
  pageSlug: string;
  pageData: any;
  blocks: EditorBlock[];
  templates: BlockTemplate[];
  selectedBlockId: string | null;
  hoveredBlockId?: string | null;
  deviceMode?: DeviceMode;
  isSaving: boolean;
  isDirty: boolean;
  autoSaveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  history?: EditorHistory[];
  historyIndex?: number;
  canUndo?: boolean;
  canRedo?: boolean;
  clipboard?: any;

  // Block operations
  onAddBlock: (template: BlockTemplate, parentId?: string | null) => void;
  onAddContainerBlock?: (containerType: ContainerType) => void;
  onSelectBlock: (id: string) => void;
  onHoverBlock?: (id: string | null) => void;
  onRemoveBlock: (id: string) => void;
  onReorderBlocks: (blocks: EditorBlock[]) => void;
  onMoveBlock?: (blockId: string, newParentId: string | null, newOrder: number) => void;
  onUpdateBlockConfig: (id: string, tab: 'content' | 'style' | 'advanced', config: any) => void;
  onDuplicateBlock?: (blockId: string) => void;
  onToggleVisibility?: (blockId: string) => void;

  // Clipboard operations
  onCopyBlock?: (blockId: string) => void;
  onPasteBlock?: (parentId?: string | null) => void;
  onCopyStyle?: (blockId: string) => void;
  onPasteStyle?: (blockId: string) => void;

  // Page operations
  onUpdatePageData: (field: string, value: any) => void;
  onSave: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onRestoreHistory?: (index: number) => void;

  // Device
  onSetDeviceMode?: (mode: DeviceMode) => void;
}

export const EnhancedEditorLayout: React.FC<EnhancedEditorLayoutProps> = ({
  pageTitle,
  pageId,
  pageSlug,
  pageData,
  blocks,
  templates,
  selectedBlockId,
  hoveredBlockId,
  deviceMode = DeviceMode.DESKTOP,
  isSaving,
  isDirty,
  autoSaveStatus = 'idle',
  history = [],
  historyIndex = -1,
  canUndo = false,
  canRedo = false,
  clipboard,
  onAddBlock,
  onAddContainerBlock,
  onSelectBlock,
  onHoverBlock,
  onRemoveBlock,
  onReorderBlocks,
  onMoveBlock,
  onUpdateBlockConfig,
  onDuplicateBlock,
  onToggleVisibility,
  onCopyBlock,
  onPasteBlock,
  onCopyStyle,
  onPasteStyle,
  onUpdatePageData,
  onSave,
  onUndo,
  onRedo,
  onRestoreHistory,
  onSetDeviceMode,
}) => {
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
  const [device, setDevice] = useState<DeviceType>(deviceMode as DeviceType);
  const { setIsCollapsed } = useAdminSidebar();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBlockLibraryOpen, setIsBlockLibraryOpen] = useState(true);
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Finder and History panels
  const finder = useFinder();
  const historyPanel = useHistoryPanel();

  // Collapse admin sidebar on mount
  useEffect(() => {
    setIsCollapsed(true);
    return () => setIsCollapsed(false);
  }, [setIsCollapsed]);

  // Sync device mode
  useEffect(() => {
    if (onSetDeviceMode) {
      onSetDeviceMode(device as DeviceMode);
    }
  }, [device, onSetDeviceMode]);

  // Keyboard shortcuts
  const shortcuts = useMemo(
    () =>
      createEditorShortcuts({
        onSave: () => {
          if (isDirty && !isSaving) {
            onSave();
          }
        },
        onUndo,
        onRedo,
        onCopy: selectedBlockId && onCopyBlock ? () => onCopyBlock(selectedBlockId) : undefined,
        onPaste: onPasteBlock,
        onDuplicate: selectedBlockId && onDuplicateBlock ? () => onDuplicateBlock(selectedBlockId) : undefined,
        onDelete: selectedBlockId ? () => onRemoveBlock(selectedBlockId) : undefined,
        onOpenFinder: finder.open,
        onOpenHistory: historyPanel.open,
        onToggleDeviceMode: () => {
          const modes: DeviceType[] = ['desktop', 'tablet', 'mobile'];
          const currentIndex = modes.indexOf(device);
          const nextIndex = (currentIndex + 1) % modes.length;
          setDevice(modes[nextIndex]);
        },
        onDeselectAll: () => onSelectBlock(''),
      }),
    [isDirty, isSaving, onSave, onUndo, onRedo, selectedBlockId, onCopyBlock, onPasteBlock, onDuplicateBlock, onRemoveBlock, finder, historyPanel, device]
  );

  useKeyboardShortcuts({
    enabled: true,
    shortcuts,
  });

  // Toggle settings when block is selected
  const handleBlockSelect = (id: string) => {
    if (selectedBlockId === id && isSettingsOpen) {
      setIsSettingsOpen(false);
    } else {
      onSelectBlock(id);
      setIsSettingsOpen(true);
    }
  };

  // Filter templates based on search query
  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) {
      return templates;
    }
    const query = searchQuery.toLowerCase().trim();
    return templates.filter((template) => {
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
    }, {} as Record<string, BlockTemplate[]>);
  }, [filteredTemplates]);

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    const iconClass = "h-3.5 w-3.5 text-gray-500";
    switch (category) {
      case 'HERO':
        return <Heading className={iconClass} />;
      case 'CONTENT':
        return <FileText className={iconClass} />;
      case 'FEATURES':
        return <Layers className={iconClass} />;
      case 'CTA':
        return <Mouse className={iconClass} />;
      case 'SOCIAL_PROOF':
        return <MessageSquare className={iconClass} />;
      case 'PRICING':
        return <ShoppingCart className={iconClass} />;
      case 'TEAM':
      case 'STATS':
        return <Palette className={iconClass} />;
      case 'FORM':
        return <MessageSquare className={iconClass} />;
      case 'FAQ':
        return <MessageSquare className={iconClass} />;
      case 'GALLERY':
        return <Image className={iconClass} />;
      case 'NAVIGATION':
      case 'LAYOUT':
        return <LayoutTemplate className={iconClass} />;
      case 'PRODUCT':
        return <ShoppingCart className={iconClass} />;
      case 'BLOG':
        return <Newspaper className={iconClass} />;
      case 'MEDIA':
        return <Video className={iconClass} />;
      default:
        return <Layers className={iconClass} />;
    }
  };

  return (
    <div className="fixed inset-0 lg:left-[70px] z-30 bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 border-b flex items-center justify-between px-4 sm:px-6 bg-white/95 backdrop-blur-sm shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/cms/pages"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
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

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Finder Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={finder.open}
            className="gap-2"
            title="Open Finder (Ctrl+E)"
          >
            <Command className="h-4 w-4" />
            <span className="hidden md:inline">Finder</span>
          </Button>

          {/* History Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={historyPanel.open}
            className="gap-2"
            title="Open History (Ctrl+H)"
          >
            <History className="h-4 w-4" />
            <span className="hidden md:inline">History</span>
          </Button>

          <div className="h-6 w-px bg-gray-200" />

          {/* Container buttons */}
          {onAddContainerBlock && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddContainerBlock(ContainerType.SECTION)}
                className="gap-2"
                title="Add Section Container"
              >
                <Layers className="h-4 w-4" />
                <span className="hidden lg:inline">Section</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddContainerBlock(ContainerType.GRID)}
                className="gap-2"
                title="Add Grid Container"
              >
                <Grid3x3 className="h-4 w-4" />
                <span className="hidden lg:inline">Grid</span>
              </Button>
              <div className="h-6 w-px bg-gray-200" />
            </>
          )}

          {/* Page Settings */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (isSettingsOpen && !selectedBlockId) {
                setIsSettingsOpen(false);
              } else {
                onSelectBlock('');
                setIsSettingsOpen(true);
              }
            }}
            className={cn('gap-2', isSettingsOpen && !selectedBlockId && 'bg-accent')}
            title="Page Settings"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">Page</span>
          </Button>

          <div className="h-6 w-px bg-gray-200" />

          {/* Undo/Redo */}
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
                <Undo2 className={cn('h-4 w-4', !canUndo && 'opacity-40')} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRedo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
                className="h-8 w-8"
              >
                <Redo2 className={cn('h-4 w-4', !canRedo && 'opacity-40')} />
              </Button>
              <div className="h-6 w-px bg-gray-200" />
            </>
          )}

          {/* Auto-save status */}
          {autoSaveStatus !== 'idle' && (
            <div
              className={cn(
                'flex items-center gap-2 text-xs px-2 sm:px-3 py-1.5 rounded-md',
                autoSaveStatus === 'saving' && 'bg-blue-50 text-blue-700',
                autoSaveStatus === 'saved' && 'bg-green-50 text-green-700',
                autoSaveStatus === 'error' && 'bg-red-50 text-red-700'
              )}
            >
              {autoSaveStatus === 'saving' && (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              )}
              {autoSaveStatus === 'saved' && (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Saved</span>
                </>
              )}
              {autoSaveStatus === 'error' && (
                <>
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Error</span>
                </>
              )}
            </div>
          )}

          {/* Preview */}
          <Link href={`/en/landing/${pageSlug}`} target="_blank">
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </Link>

          {/* Save */}
          <Button
            size="sm"
            onClick={onSave}
            disabled={!isDirty || isSaving}
            className="min-w-[100px]"
            title={!isDirty ? 'No changes' : 'Save (Ctrl+S)'}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>

          {/* Toggle settings panel */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            title={isSettingsOpen ? 'Close settings' : 'Open settings'}
          >
            {isSettingsOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative min-h-0">
        {/* Left Sidebar - Navigator + Block Library */}
        <div
          className={cn(
            'border-r flex flex-col bg-white shrink-0 shadow-sm transition-all duration-300 min-h-0',
            isBlockLibraryOpen || isNavigatorOpen ? 'w-80' : 'w-0 border-r-0 overflow-hidden'
          )}
        >
          {/* Navigator Panel */}
          {isNavigatorOpen && (
            <div className="h-1/2 border-b flex flex-col min-h-0">
              <Navigator
                blocks={blocks}
                selectedBlockId={selectedBlockId}
                onSelectBlock={onSelectBlock}
                onRemoveBlock={onRemoveBlock}
                onDuplicateBlock={onDuplicateBlock}
                onToggleVisibility={onToggleVisibility}
                onReorderBlocks={onReorderBlocks}
              />
            </div>
          )}

          {/* Block Library */}
          {isBlockLibraryOpen && (
            <div className="flex-1 flex flex-col min-h-0 bg-white">
              <div className="p-3 border-b shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded">
                      <LayoutTemplate className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <h2 className="font-semibold text-sm">Elements</h2>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {filteredTemplates.length} items
                  </span>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search widgets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-8 text-sm"
                  />
                </div>
              </div>
              <ScrollArea className="flex-1 min-h-0">
                <div className="p-3 space-y-4">
                  {Object.entries(templatesByCategory).length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      No widgets found
                    </div>
                  ) : (
                    Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
                      <div key={category}>
                        <div className="flex items-center gap-2 mb-2 px-1">
                          {getCategoryIcon(category)}
                          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            {category.replace('_', ' ')}
                          </h3>
                          <span className="text-xs text-gray-400">
                            ({categoryTemplates.length})
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {categoryTemplates.map((template) => (
                            <SidebarBlock
                              key={template.id}
                              template={template}
                              onAdd={() => {
                                // Check if selected block is a container
                                const selectedBlock = blocks.find(b => b.id === selectedBlockId);
                                const isSelectedContainer = selectedBlock &&
                                  (selectedBlock.containerType === 'SECTION' ||
                                   selectedBlock.containerType === 'FLEXBOX' ||
                                   selectedBlock.containerType === 'GRID');

                                // If selected block is a container, add block to it
                                if (isSelectedContainer) {
                                  onAddBlock(template, selectedBlockId);
                                } else {
                                  onAddBlock(template);
                                }
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
          <ScrollArea className="flex-1 min-h-0">
            <div className={cn(
              'min-h-full flex justify-center',
              device === 'desktop' ? 'p-0' : 'py-6 px-4'
            )}>
              <NestedCanvas
                blocks={blocks}
                selectedBlockId={selectedBlockId}
                hoveredBlockId={hoveredBlockId}
                onSelectBlock={onSelectBlock}
                onHoverBlock={onHoverBlock}
                onToggleBlockSettings={handleBlockSelect}
                onRemoveBlock={onRemoveBlock}
                onReorderBlocks={onReorderBlocks}
                onMoveBlock={onMoveBlock}
                onDuplicateBlock={onDuplicateBlock}
                onToggleVisibility={onToggleVisibility}
                onAddBlockToContainer={(containerId) => {
                  // Select the container
                  onSelectBlock(containerId);
                  // Open block library if closed
                  if (!isBlockLibraryOpen) {
                    setIsBlockLibraryOpen(true);
                  }
                }}
                device={device}
              />
            </div>
          </ScrollArea>
        </div>

        {/* Right Sidebar - Settings */}
        <div
          className={cn(
            'w-96 border-l flex flex-col bg-white shrink-0 transition-all duration-300 min-h-0',
            !isSettingsOpen && 'w-0 border-l-0 overflow-hidden'
          )}
        >
          <div className="p-4 border-b flex items-center justify-between shrink-0">
            <h2 className="font-semibold text-sm">
              {selectedBlock ? selectedBlock.template?.name || 'Block' : 'Page Settings'}
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          {isSettingsOpen && (
            <div className="flex-1 min-h-0">
              {selectedBlock ? (
                <SettingsTabs
                  block={selectedBlock}
                  onUpdateConfig={(tab, config) => onUpdateBlockConfig(selectedBlock.id, tab, config)}
                />
              ) : (
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <PageSettingsForm pageData={pageData} onChange={onUpdatePageData} />
                  </div>
                </ScrollArea>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Finder Dialog */}
      <Finder
        isOpen={finder.isOpen}
        onClose={finder.close}
        blockTemplates={templates}
        onAddBlock={onAddBlock}
      />

      {/* History Panel */}
      <HistoryPanel
        isOpen={historyPanel.isOpen}
        onClose={historyPanel.close}
        history={history}
        currentIndex={historyIndex}
        onRestoreToIndex={onRestoreHistory || (() => {})}
      />
    </div>
  );
};
