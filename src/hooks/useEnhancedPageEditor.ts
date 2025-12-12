/**
 * Enhanced Page Editor Hook
 *
 * Supports:
 * - Nested containers with children
 * - Three-tab configuration (content, style, advanced)
 * - Move blocks between containers
 * - Visibility toggling
 * - Hover state management
 * - Clipboard operations
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { EditorBlock, PageData, ContainerType, ClipboardData, DeviceMode } from '@/types/editor';
import {
  buildBlockTree,
  flattenBlockTree,
  findBlockById,
  updateBlockInTree,
  removeBlockFromTree,
  duplicateBlock as utilDuplicateBlock,
  normalizeBlockOrders,
  splitConfigIntoTabs,
} from '@/lib/editor-utils';

interface UseEnhancedPageEditorProps {
  pageId: string;
  initialBlocks?: EditorBlock[];
  initialPageData?: Partial<PageData>;
  autoSaveEnabled?: boolean;
  autoSaveDelay?: number;
  templates?: any[];
}

export function useEnhancedPageEditor({
  pageId,
  initialBlocks = [],
  initialPageData = {},
  autoSaveEnabled = true,
  autoSaveDelay = 2000,
  templates = [],
}: UseEnhancedPageEditorProps) {
  const router = useRouter();

  // Core state
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks);
  const [pageData, setPageData] = useState<Partial<PageData>>(initialPageData);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>(DeviceMode.DESKTOP);
  const [clipboard, setClipboard] = useState<ClipboardData | null>(null);

  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedStateRef = useRef<string>('');

  // History state (Undo/Redo)
  const [history, setHistory] = useState<Array<{ blocks: EditorBlock[]; pageData: Partial<PageData> }>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const maxHistorySize = 50;
  const historyUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize blocks
  useEffect(() => {
    if (initialBlocks.length > 0 && blocks.length === 0) {
      setBlocks(initialBlocks);
      setHistory([{ blocks: initialBlocks, pageData: initialPageData }]);
      setHistoryIndex(0);
    }
  }, [initialBlocks, blocks.length, initialPageData]);

  // Save to history (debounced)
  const saveToHistory = useCallback(
    (blocksToSave: EditorBlock[], pageDataToSave: Partial<PageData>) => {
      if (historyUpdateTimeoutRef.current) {
        clearTimeout(historyUpdateTimeoutRef.current);
      }

      historyUpdateTimeoutRef.current = setTimeout(() => {
        setHistory((prev) => {
          const newHistory = prev.slice(0, historyIndex + 1);
          newHistory.push({ blocks: blocksToSave, pageData: pageDataToSave });

          if (newHistory.length > maxHistorySize) {
            newHistory.shift();
            return newHistory;
          }

          return newHistory;
        });
        setHistoryIndex((prev) => Math.min(prev + 1, maxHistorySize - 1));
      }, 500);
    },
    [historyIndex, maxHistorySize]
  );

  // Undo/Redo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      setBlocks(state.blocks);
      setPageData(state.pageData);
      setHistoryIndex(newIndex);
      setIsDirty(true);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      setBlocks(state.blocks);
      setPageData(state.pageData);
      setHistoryIndex(newIndex);
      setIsDirty(true);
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // LocalStorage backup
  const saveToLocalStorage = useCallback(
    (blocksToSave: EditorBlock[], pageDataToSave: Partial<PageData>) => {
      const storageKey = `cms-editor-${pageId}`;
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            blocks: blocksToSave,
            pageData: pageDataToSave,
            timestamp: Date.now(),
          })
        );
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    },
    [pageId]
  );

  const clearLocalStorage = useCallback(() => {
    const storageKey = `cms-editor-${pageId}`;
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }, [pageId]);

  // Load from localStorage
  useEffect(() => {
    const storageKey = `cms-editor-${pageId}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.blocks && parsed.blocks.length > 0) {
          setBlocks(parsed.blocks);
        }
        if (parsed.pageData) {
          setPageData(parsed.pageData);
        }
        setIsDirty(true);
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }, [pageId]);

  // Block operations
  const generateBlockId = () => `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addBlock = useCallback(
    (template: any, parentId?: string | null) => {
      const { contentConfig, styleConfig, advancedConfig } = splitConfigIntoTabs(
        template.defaultConfig || {},
        template.configSchema
      );

      const newBlock: EditorBlock = {
        id: generateBlockId(),
        templateId: template.id,
        containerType: ContainerType.BLOCK,
        parentId: parentId || null,
        contentConfig,
        styleConfig,
        advancedConfig,
        config: template.defaultConfig, // Keep for backwards compatibility
        order: blocks.filter((b) => b.parentId === parentId).length,
        isVisible: true,
        template,
      };

      setBlocks((prev) => {
        const updated = [...prev, newBlock];
        saveToHistory(updated, pageData);
        return updated;
      });
      setSelectedBlockId(newBlock.id);
      setIsDirty(true);
    },
    [blocks, pageData, saveToHistory]
  );

  const addContainerBlock = useCallback(
    (containerType: ContainerType, parentId?: string | null) => {
      // Find the appropriate container template based on container type
      const templateSlug =
        containerType === ContainerType.SECTION ? 'section-container' :
        containerType === ContainerType.FLEXBOX ? 'flexbox-container' :
        containerType === ContainerType.GRID ? 'grid-container' :
        'container';

      const containerTemplate = templates.find(t => t.slug === templateSlug);

      if (!containerTemplate) {
        toast.error(`Container template "${templateSlug}" not found. Please run the container templates seed script.`);
        console.error(`Container template not found for slug: ${templateSlug}`);
        return;
      }

      const newBlock: EditorBlock = {
        id: generateBlockId(),
        templateId: containerTemplate.id,
        template: containerTemplate,
        containerType,
        parentId: parentId || null,
        contentConfig: containerTemplate.defaultConfig || {},
        styleConfig: {},
        advancedConfig: {},
        layoutSettings:
          containerType === ContainerType.FLEXBOX
            ? {
                direction: 'row',
                wrap: 'nowrap',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                gap: 16,
              }
            : containerType === ContainerType.GRID
            ? {
                columns: 2,
                columnGap: 16,
                rowGap: 16,
              }
            : undefined,
        order: blocks.filter((b) => b.parentId === parentId).length,
        isVisible: true,
        children: [],
      };

      setBlocks((prev) => {
        const updated = [...prev, newBlock];
        saveToHistory(updated, pageData);
        return updated;
      });
      setSelectedBlockId(newBlock.id);
      setIsDirty(true);
    },
    [blocks, pageData, saveToHistory, templates]
  );

  const updateBlockConfig = useCallback(
    (blockId: string, tab: 'content' | 'style' | 'advanced', newConfig: any) => {
      setBlocks((prev) => {
        const updated = prev.map((block) => {
          if (block.id === blockId) {
            return {
              ...block,
              [`${tab}Config`]: newConfig,
            };
          }
          return block;
        });
        saveToHistory(updated, pageData);
        return updated;
      });
      setIsDirty(true);
    },
    [pageData, saveToHistory]
  );

  const removeBlock = useCallback(
    (blockId: string) => {
      setBlocks((prev) => {
        const blockTree = buildBlockTree(prev);
        const withoutBlock = removeBlockFromTree(blockTree, blockId);
        const flattened = flattenBlockTree(withoutBlock);
        const normalized = normalizeBlockOrders(flattened);
        saveToHistory(normalized, pageData);
        return normalized;
      });
      if (selectedBlockId === blockId) {
        setSelectedBlockId(null);
      }
      setIsDirty(true);
    },
    [selectedBlockId, pageData, saveToHistory]
  );

  const duplicateBlock = useCallback(
    (blockId: string) => {
      const blockToDuplicate = findBlockById(blocks, blockId);
      if (!blockToDuplicate) return;

      const duplicated = utilDuplicateBlock(blockToDuplicate, generateBlockId);

      setBlocks((prev) => {
        const updated = [...prev, duplicated];
        saveToHistory(updated, pageData);
        return updated;
      });
      setSelectedBlockId(duplicated.id);
      setIsDirty(true);
    },
    [blocks, pageData, saveToHistory]
  );

  const moveBlock = useCallback(
    (blockId: string, newParentId: string | null, newOrder: number) => {
      setBlocks((prev) => {
        const block = findBlockById(prev, blockId);
        if (!block) return prev;

        // Update block's parent and order
        const updatedBlock = {
          ...block,
          parentId: newParentId,
          order: newOrder,
        };

        const updated = prev.map((b) => (b.id === blockId ? updatedBlock : b));
        const normalized = normalizeBlockOrders(updated);
        saveToHistory(normalized, pageData);
        return normalized;
      });
      setIsDirty(true);
    },
    [pageData, saveToHistory]
  );

  const reorderBlocks = useCallback(
    (newBlocks: EditorBlock[]) => {
      const normalized = normalizeBlockOrders(newBlocks);
      setBlocks(normalized);
      saveToHistory(normalized, pageData);
      setIsDirty(true);
    },
    [pageData, saveToHistory]
  );

  const toggleBlockVisibility = useCallback(
    (blockId: string) => {
      setBlocks((prev) => {
        const updated = prev.map((block) =>
          block.id === blockId ? { ...block, isVisible: !block.isVisible } : block
        );
        saveToHistory(updated, pageData);
        return updated;
      });
      setIsDirty(true);
    },
    [pageData, saveToHistory]
  );

  // Clipboard operations
  const copyBlock = useCallback((blockId: string) => {
    const block = findBlockById(blocks, blockId);
    if (block) {
      setClipboard({
        type: 'block',
        data: block,
        timestamp: Date.now(),
      });
      toast.success('Block copied to clipboard');
    }
  }, [blocks]);

  const copyStyle = useCallback((blockId: string) => {
    const block = findBlockById(blocks, blockId);
    if (block && block.styleConfig) {
      setClipboard({
        type: 'style',
        data: block.styleConfig,
        timestamp: Date.now(),
      });
      toast.success('Style copied to clipboard');
    }
  }, [blocks]);

  const pasteBlock = useCallback(
    (parentId?: string | null) => {
      if (!clipboard || clipboard.type !== 'block') return;

      const block = clipboard.data as EditorBlock;
      const duplicated = utilDuplicateBlock(block, generateBlockId);
      duplicated.parentId = parentId || null;
      duplicated.order = blocks.filter((b) => b.parentId === parentId).length;

      setBlocks((prev) => {
        const updated = [...prev, duplicated];
        saveToHistory(updated, pageData);
        return updated;
      });
      setSelectedBlockId(duplicated.id);
      setIsDirty(true);
      toast.success('Block pasted');
    },
    [clipboard, blocks, pageData, saveToHistory]
  );

  const pasteStyle = useCallback(
    (blockId: string) => {
      if (!clipboard || clipboard.type !== 'style') return;

      updateBlockConfig(blockId, 'style', clipboard.data);
      toast.success('Style pasted');
    },
    [clipboard, updateBlockConfig]
  );

  // Page data operations
  const updatePageData = useCallback(
    (field: string, value: any) => {
      setPageData((prev) => {
        const updated = { ...prev, [field]: value };
        saveToHistory(blocks, updated);
        return updated;
      });
      setIsDirty(true);
    },
    [blocks, saveToHistory]
  );

  // Save page
  const savePage = useCallback(
    async (isAutoSave = false) => {
      setIsSaving(true);
      if (isAutoSave) {
        setAutoSaveStatus('saving');
      }

      try {
        // Save page data
        const pageResponse = await fetch(`/api/admin/cms/pages/${pageId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pageData),
        });

        if (!pageResponse.ok) {
          const errorData = await pageResponse.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to save page data');
        }

        // Sync blocks
        const blocksResponse = await fetch(`/api/admin/cms/pages/${pageId}/sync-blocks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blocks: blocks.map((block) => ({
              id: block.id,
              templateId: block.templateId,
              containerType: block.containerType,
              parentId: block.parentId,
              contentConfig: block.contentConfig,
              styleConfig: block.styleConfig,
              advancedConfig: block.advancedConfig,
              layoutSettings: block.layoutSettings,
              order: block.order,
              isVisible: block.isVisible,
              // Keep legacy config for backwards compatibility
              config: block.config || block.contentConfig,
            })),
          }),
        });

        if (!blocksResponse.ok) {
          throw new Error('Failed to save blocks');
        }

        const data = await blocksResponse.json();

        if (data.page?.blocks) {
          const updatedBlocks = data.page.blocks.map((block: any) => {
            const existingBlock = blocks.find(
              (b) => b.id === block.id || (b.templateId === block.templateId && b.order === block.order)
            );

            return {
              ...block,
              template: block.template || existingBlock?.template,
            };
          });

          setBlocks(updatedBlocks);
          lastSavedStateRef.current = JSON.stringify({ blocks: updatedBlocks, pageData });
        }

        setIsDirty(false);
        if (isAutoSave) {
          setAutoSaveStatus('saved');
          clearLocalStorage();
          setTimeout(() => setAutoSaveStatus('idle'), 2000);
        } else {
          toast.success('Page saved successfully');
          clearLocalStorage();
        }

        router.refresh();
      } catch (error: any) {
        console.error('Error saving page:', error);
        if (isAutoSave) {
          setAutoSaveStatus('error');
          setTimeout(() => setAutoSaveStatus('idle'), 3000);
        } else {
          toast.error(error.message || 'Failed to save page');
        }
      } finally {
        setIsSaving(false);
      }
    },
    [blocks, pageId, pageData, router, clearLocalStorage]
  );

  // Auto-save
  useEffect(() => {
    if (!autoSaveEnabled || !isDirty) {
      return;
    }

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    saveToLocalStorage(blocks, pageData);

    autoSaveTimeoutRef.current = setTimeout(() => {
      const currentState = JSON.stringify({ blocks, pageData });
      if (currentState !== lastSavedStateRef.current) {
        savePage(true);
      }
    }, autoSaveDelay);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [blocks, pageData, isDirty, autoSaveEnabled, autoSaveDelay, savePage, saveToLocalStorage]);

  return {
    // State
    blocks,
    pageData,
    selectedBlockId,
    hoveredBlockId,
    deviceMode,
    clipboard,
    isSaving,
    isDirty,
    autoSaveStatus,
    canUndo,
    canRedo,

    // Block operations
    addBlock,
    addContainerBlock,
    updateBlockConfig,
    removeBlock,
    duplicateBlock,
    moveBlock,
    reorderBlocks,
    toggleBlockVisibility,

    // Clipboard
    copyBlock,
    copyStyle,
    pasteBlock,
    pasteStyle,

    // Page operations
    updatePageData,
    savePage,

    // History
    undo,
    redo,

    // UI state
    setSelectedBlockId,
    setHoveredBlockId,
    setDeviceMode,
  };
}
