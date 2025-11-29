'use client';

import { useState, useCallback } from 'react';
import { ProductDescriptionBlock, BlockType, generateBlockId, getDefaultBlockConfig, serializeBlocks, deserializeBlocks } from '@/lib/product-description-blocks';
import { BlockLibrary } from './ProductDescriptionBuilder/BlockLibrary';
import { PreviewCanvas } from './ProductDescriptionBuilder/PreviewCanvas';
import { BlockConfigPanel } from './ProductDescriptionBuilder/BlockConfigPanel';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ProductDescriptionBuilderProps {
  content: string | null;
  onChange: (content: string) => void;
}

export function ProductDescriptionBuilder({ content, onChange }: ProductDescriptionBuilderProps) {
  const [blocks, setBlocks] = useState<ProductDescriptionBlock[]>(() => {
    return deserializeBlocks(content);
  });
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(true);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId) || null;

  // Update parent when blocks change
  const handleBlocksChange = useCallback((newBlocks: ProductDescriptionBlock[]) => {
    setBlocks(newBlocks);
    // Only serialize if there are blocks, otherwise send empty string
    const serialized = newBlocks.length > 0 ? serializeBlocks(newBlocks) : '';
    onChange(serialized);
  }, [onChange]);

  // Add a new block
  const handleAddBlock = useCallback((type: BlockType, position?: number) => {
    const newBlock: ProductDescriptionBlock = {
      id: generateBlockId(),
      type,
      config: getDefaultBlockConfig(type),
      order: position !== undefined ? position : blocks.length,
    };

    const newBlocks = [...blocks];
    if (position !== undefined) {
      // Insert at position and reorder others
      newBlocks.splice(position, 0, newBlock);
      newBlocks.forEach((block, index) => {
        block.order = index;
      });
    } else {
      newBlocks.push(newBlock);
    }

    handleBlocksChange(newBlocks);
    setSelectedBlockId(newBlock.id);
  }, [blocks, handleBlocksChange]);

  // Update block config
  const handleUpdateBlock = useCallback((blockId: string, config: Record<string, any>) => {
    const newBlocks = blocks.map(block =>
      block.id === blockId ? { ...block, config } : block
    );
    handleBlocksChange(newBlocks);
  }, [blocks, handleBlocksChange]);

  // Delete a block
  const handleDeleteBlock = useCallback((blockId: string) => {
    const newBlocks = blocks
      .filter(block => block.id !== blockId)
      .map((block, index) => ({ ...block, order: index }));
    handleBlocksChange(newBlocks);
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  }, [blocks, handleBlocksChange, selectedBlockId]);

  // Duplicate a block
  const handleDuplicateBlock = useCallback((blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    const newBlock: ProductDescriptionBlock = {
      ...block,
      id: generateBlockId(),
      order: block.order + 1,
    };

    const newBlocks = [...blocks];
    newBlocks.splice(block.order + 1, 0, newBlock);
    newBlocks.forEach((b, index) => {
      b.order = index;
    });

    handleBlocksChange(newBlocks);
    setSelectedBlockId(newBlock.id);
  }, [blocks, handleBlocksChange]);

  // Reorder blocks
  const handleReorderBlocks = useCallback((fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, moved);
    newBlocks.forEach((block, index) => {
      block.order = index;
    });
    handleBlocksChange(newBlocks);
  }, [blocks, handleBlocksChange]);

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden bg-white relative">
      {/* Left Sidebar - Block Library */}
      {isLibraryOpen ? (
        <div className="w-[300px] border-r bg-gray-50 overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between p-2 border-b bg-white">
            <h3 className="font-semibold text-sm">Blocks</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLibraryOpen(false)}
              className="h-6 w-6 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <BlockLibrary onAddBlock={handleAddBlock} />
          </div>
        </div>
      ) : (
        <div className="absolute left-0 top-0 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLibraryOpen(true)}
            className="rounded-r-none border-r-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Main Area - Preview Canvas */}
      <div className="flex-1 overflow-y-auto bg-white">
        <PreviewCanvas
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          onSelectBlock={(blockId) => {
            setSelectedBlockId(blockId);
            setIsConfigPanelOpen(true);
          }}
          onDeleteBlock={handleDeleteBlock}
          onDuplicateBlock={handleDuplicateBlock}
          onReorderBlocks={handleReorderBlocks}
        />
      </div>

      {/* Right Panel - Block Configuration */}
      {selectedBlock && isConfigPanelOpen ? (
        <div className="w-[350px] border-l bg-gray-50 overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between p-2 border-b bg-white">
            <h3 className="font-semibold text-sm">Block Settings</h3>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsConfigPanelOpen(false)}
                className="h-6 w-6 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedBlockId(null);
                  setIsConfigPanelOpen(false);
                }}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <BlockConfigPanel
              block={selectedBlock}
              onUpdate={(config) => handleUpdateBlock(selectedBlock.id, config)}
              onClose={() => {
                setSelectedBlockId(null);
                setIsConfigPanelOpen(false);
              }}
              onDelete={() => {
                handleDeleteBlock(selectedBlock.id);
                setSelectedBlockId(null);
                setIsConfigPanelOpen(false);
              }}
            />
          </div>
        </div>
      ) : selectedBlock && !isConfigPanelOpen ? (
        <div className="absolute right-0 top-0 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsConfigPanelOpen(true)}
            className="rounded-l-none border-l-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}

