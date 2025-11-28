import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export interface EditorBlock {
    id: string;
    templateId: string;
    config: any;
    order: number;
    template?: {
        id: string;
        name: string;
        slug: string;
        category: string;
        componentCode: string;
        defaultConfig: any;
        configSchema: any;
    };
}

interface UsePageEditorProps {
    pageId: string;
    initialBlocks?: EditorBlock[];
    initialPageData?: any;
    autoSaveEnabled?: boolean;
    autoSaveDelay?: number;
}

export function usePageEditor({ 
    pageId, 
    initialBlocks = [], 
    initialPageData = {},
    autoSaveEnabled = true,
    autoSaveDelay = 2000
}: UsePageEditorProps) {
    const router = useRouter();
    const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks);
    const [pageData, setPageData] = useState(initialPageData);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedStateRef = useRef<string>('');
    
    // Undo/Redo state
    const [history, setHistory] = useState<Array<{ blocks: EditorBlock[]; pageData: any }>>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const maxHistorySize = 50;
    const configUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pageDataUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize blocks if provided later (e.g. after fetch) - only if blocks array is empty
    useEffect(() => {
        if (initialBlocks.length > 0 && blocks.length === 0) {
            setBlocks(initialBlocks);
            // Initialize history with initial state
            setHistory([{ blocks: initialBlocks, pageData: initialPageData }]);
            setHistoryIndex(0);
        }
    }, [initialBlocks, blocks.length, initialPageData]);

    // Save state to history
    const saveToHistory = useCallback((blocksToSave: EditorBlock[], pageDataToSave: any) => {
        setHistory(prev => {
            const newHistory = prev.slice(0, historyIndex + 1);
            newHistory.push({ blocks: blocksToSave, pageData: pageDataToSave });
            
            // Limit history size
            if (newHistory.length > maxHistorySize) {
                newHistory.shift();
                return newHistory;
            }
            
            return newHistory;
        });
        setHistoryIndex(prev => Math.min(prev + 1, maxHistorySize - 1));
    }, [historyIndex, maxHistorySize]);

    // Undo function
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

    // Redo function
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

    // Check if undo/redo is available
    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    // Load from localStorage on mount
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

    // Save to localStorage as backup
    const saveToLocalStorage = useCallback((blocksToSave: EditorBlock[], pageDataToSave: any) => {
        const storageKey = `cms-editor-${pageId}`;
        try {
            localStorage.setItem(storageKey, JSON.stringify({
                blocks: blocksToSave,
                pageData: pageDataToSave,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    }, [pageId]);

    // Clear localStorage after successful save
    const clearLocalStorage = useCallback(() => {
        const storageKey = `cms-editor-${pageId}`;
        try {
            localStorage.removeItem(storageKey);
        } catch (error) {
            console.error('Failed to clear localStorage:', error);
        }
    }, [pageId]);

    const addBlock = useCallback((template: any) => {
        const newBlock: EditorBlock = {
            id: `temp-${Date.now()}`, // Temporary ID until saved
            templateId: template.id,
            config: template.defaultConfig || {},
            order: blocks.length,
            template: template
        };

        setBlocks(prev => {
            const updated = [...prev, newBlock];
            saveToHistory(updated, pageData);
            return updated;
        });
        setSelectedBlockId(newBlock.id);
        setIsDirty(true);
    }, [blocks.length, pageData, saveToHistory]);

    const updateBlockConfig = useCallback((blockId: string, newConfig: any) => {
        setBlocks(prev => {
            const updated = prev.map(block =>
                block.id === blockId ? { ...block, config: newConfig } : block
            );
            // Debounce history saves for config updates (only save every 500ms)
            if (configUpdateTimeoutRef.current) {
                clearTimeout(configUpdateTimeoutRef.current);
            }
            configUpdateTimeoutRef.current = setTimeout(() => {
                saveToHistory(updated, pageData);
            }, 500);
            return updated;
        });
        setIsDirty(true);
    }, [pageData, saveToHistory]);

    const removeBlock = useCallback((blockId: string) => {
        setBlocks(prev => {
            const updated = prev.filter(block => block.id !== blockId);
            saveToHistory(updated, pageData);
            return updated;
        });
        if (selectedBlockId === blockId) {
            setSelectedBlockId(null);
        }
        setIsDirty(true);
    }, [selectedBlockId, pageData, saveToHistory]);

    const duplicateBlock = useCallback((blockId: string) => {
        const blockToDuplicate = blocks.find(b => b.id === blockId);
        if (!blockToDuplicate) return;

        const newBlock: EditorBlock = {
            id: `temp-${Date.now()}`,
            templateId: blockToDuplicate.templateId,
            config: { ...blockToDuplicate.config },
            order: blockToDuplicate.order + 1,
            template: blockToDuplicate.template
        };

        setBlocks(prev => {
            const index = prev.findIndex(b => b.id === blockId);
            const updated = [
                ...prev.slice(0, index + 1),
                newBlock,
                ...prev.slice(index + 1).map(b => ({ ...b, order: b.order + 1 }))
            ];
            saveToHistory(updated, pageData);
            return updated;
        });
        setSelectedBlockId(newBlock.id);
        setIsDirty(true);
    }, [blocks, pageData, saveToHistory]);

    const reorderBlocks = useCallback((newBlocks: EditorBlock[]) => {
        // Update order property based on index
        const orderedBlocks = newBlocks.map((block, index) => ({
            ...block,
            order: index
        }));
        setBlocks(orderedBlocks);
        saveToHistory(orderedBlocks, pageData);
        setIsDirty(true);
    }, [pageData, saveToHistory]);

    const updatePageData = useCallback((field: string, value: any) => {
        setPageData(prev => {
            const updated = { ...prev, [field]: value };
            // Debounce history saves for page data updates
            if (pageDataUpdateTimeoutRef.current) {
                clearTimeout(pageDataUpdateTimeoutRef.current);
            }
            pageDataUpdateTimeoutRef.current = setTimeout(() => {
                saveToHistory(blocks, updated);
            }, 500);
            return updated;
        });
        setIsDirty(true);
    }, [blocks, saveToHistory]);

    const savePage = useCallback(async (isAutoSave = false) => {
        setIsSaving(true);
        if (isAutoSave) {
            setAutoSaveStatus('saving');
        }
        try {
            // Save page data first
            const pageResponse = await fetch(`/api/admin/landing-pages/${pageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: pageData.title,
                    slug: pageData.slug,
                    description: pageData.description,
                    seoTitle: pageData.seoTitle,
                    seoDescription: pageData.seoDescription,
                    seoKeywords: pageData.seoKeywords,
                    status: pageData.status,
                }),
            });

            if (!pageResponse.ok) {
                const errorData = await pageResponse.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to save page data');
            }

            // Then sync blocks
            const blocksResponse = await fetch(`/api/admin/landing-pages/${pageId}/sync-blocks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    blocks: blocks.map(block => ({
                        id: block.id,
                        templateId: block.templateId,
                        config: block.config,
                        order: block.order,
                    })),
                }),
            });

            if (!blocksResponse.ok) {
                throw new Error('Failed to save blocks');
            }

            const data = await blocksResponse.json();

            // Update blocks with the server response (to get real IDs for temp blocks)
            if (data.page?.blocks) {
                const updatedBlocks = data.page.blocks.map((block: any) => ({
                    id: block.id,
                    templateId: block.templateId,
                    config: block.config,
                    order: block.order,
                    template: block.template,
                }));
                setBlocks(updatedBlocks);
                
                // Update last saved state
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
            
            // Refresh will reload the page data from server
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
    }, [blocks, pageId, pageData, router, clearLocalStorage]);

    // Auto-save effect
    useEffect(() => {
        if (!autoSaveEnabled || !isDirty) {
            return;
        }

        // Clear existing timeout
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }

        // Save current state to localStorage
        saveToLocalStorage(blocks, pageData);

        // Set new timeout for auto-save
        autoSaveTimeoutRef.current = setTimeout(() => {
            const currentState = JSON.stringify({ blocks, pageData });
            // Only auto-save if state has changed since last save
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
        blocks,
        pageData,
        selectedBlockId,
        setSelectedBlockId,
        addBlock,
        updateBlockConfig,
        updatePageData,
        removeBlock,
        reorderBlocks,
        savePage,
        isSaving,
        isDirty,
        autoSaveStatus,
        undo,
        redo,
        canUndo,
        canRedo,
        duplicateBlock
    };
}
