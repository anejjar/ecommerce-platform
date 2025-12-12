/**
 * Enhanced Canvas Component with Nested Drag-and-Drop
 *
 * Supports:
 * - Nested containers with children
 * - Drag-and-drop between containers
 * - Visual drop indicators
 * - Multiple device preview modes
 */

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { NestedSortableBlock } from './NestedSortableBlock';
import { EditorBlock, ContainerType } from '@/types/editor';
import { DeviceType } from './DevicePreview';
import { cn } from '@/lib/utils';
import { buildBlockTree, findBlockById, isContainer, canDropInto } from '@/lib/editor-utils';

interface NestedCanvasProps {
  blocks: EditorBlock[];
  selectedBlockId: string | null;
  hoveredBlockId?: string | null;
  onSelectBlock: (id: string) => void;
  onHoverBlock?: (id: string | null) => void;
  onToggleBlockSettings?: (id: string) => void;
  onRemoveBlock: (id: string) => void;
  onReorderBlocks: (blocks: EditorBlock[]) => void;
  onMoveBlock?: (blockId: string, newParentId: string | null, newOrder: number) => void;
  onDuplicateBlock?: (blockId: string) => void;
  onToggleVisibility?: (blockId: string) => void;
  onAddBlockToContainer?: (containerId: string) => void;
  device: DeviceType;
}

export const NestedCanvas: React.FC<NestedCanvasProps> = ({
  blocks,
  selectedBlockId,
  hoveredBlockId,
  onSelectBlock,
  onHoverBlock,
  onToggleBlockSettings,
  onRemoveBlock,
  onReorderBlocks,
  onMoveBlock,
  onDuplicateBlock,
  onToggleVisibility,
  onAddBlockToContainer,
  device,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before dragging starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Build hierarchical tree from flat blocks
  const blockTree = buildBlockTree(blocks);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over?.id as string | null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const activeBlock = findBlockById(blocks, active.id as string);
    const overBlock = findBlockById(blocks, over.id as string);

    if (!activeBlock) {
      return;
    }

    // Check if dropping into a container
    if (over.data.current?.type === 'container' && overBlock) {
      // Validate drop
      if (canDropInto(activeBlock, overBlock)) {
        // Move block into container
        if (onMoveBlock) {
          onMoveBlock(activeBlock.id, overBlock.id, 0);
        }
      }
      return;
    }

    // Otherwise, reorder at the same level
    if (overBlock && activeBlock.parentId === overBlock.parentId) {
      const parentBlocks = activeBlock.parentId
        ? findBlockById(blocks, activeBlock.parentId)?.children || []
        : blockTree;

      const oldIndex = parentBlocks.findIndex((b) => b.id === active.id);
      const newIndex = parentBlocks.findIndex((b) => b.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        // Reorder blocks
        const reordered = [...parentBlocks];
        const [removed] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, removed);

        // Update order values
        const withUpdatedOrder = reordered.map((block, index) => ({
          ...block,
          order: index,
        }));

        // If at root level, update directly
        if (!activeBlock.parentId) {
          onReorderBlocks(withUpdatedOrder);
        } else {
          // Update parent's children
          // This needs to bubble up to update the full blocks array
          // For now, we'll call onReorderBlocks with the full updated tree
          // (This will be handled better by the usePageEditor hook)
          const updatedBlocks = blocks.map((b) => {
            if (b.parentId === activeBlock.parentId) {
              const newBlock = withUpdatedOrder.find((ub) => ub.id === b.id);
              return newBlock || b;
            }
            return b;
          });
          onReorderBlocks(updatedBlocks);
        }
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
  };

  const getWidthClass = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'max-w-full';
    }
  };

  // Recursively render blocks and their children
  const renderBlocks = (blocksToRender: EditorBlock[], depth = 0): React.ReactNode => {
    return blocksToRender.map((block) => (
      <NestedSortableBlock
        key={block.id}
        block={block}
        isSelected={selectedBlockId === block.id}
        isHovered={hoveredBlockId === block.id}
        onSelect={() => onSelectBlock(block.id)}
        onHover={onHoverBlock}
        onToggleSettings={
          onToggleBlockSettings
            ? () => onToggleBlockSettings(block.id)
            : undefined
        }
        onRemove={() => onRemoveBlock(block.id)}
        onDuplicate={
          onDuplicateBlock ? () => onDuplicateBlock(block.id) : undefined
        }
        onToggleVisibility={
          onToggleVisibility ? () => onToggleVisibility(block.id) : undefined
        }
        onAddBlockToContainer={onAddBlockToContainer}
        depth={depth}
        renderChildren={(children) => renderBlocks(children, depth + 1)}
      />
    ));
  };

  const activeBlock = activeId ? findBlockById(blocks, activeId) : null;

  return (
    <div
      className={cn('transition-all duration-300 ease-in-out w-full mx-auto', getWidthClass())}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            className={cn(
              'min-h-[600px] bg-white shadow-lg border border-gray-200 transition-all',
              device === 'desktop' && 'rounded-none',
              device === 'tablet' && 'rounded-lg border-[3px] border-gray-400 my-8',
              device === 'mobile' && 'rounded-[2rem] border-[12px] border-gray-800 my-8 shadow-2xl'
            )}
            style={{
              minHeight: device === 'desktop' ? '100vh' : '600px'
            }}
          >
            {/* Canvas Content */}
            <div className={cn(
              'min-h-full',
              device === 'mobile' && 'rounded-[1.5rem] overflow-hidden'
            )}>
              {/* Render block tree */}
              <div className="space-y-0">{renderBlocks(blockTree)}</div>

              {/* Empty state */}
              {blocks.length === 0 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-16 m-4 text-center bg-gradient-to-br from-gray-50 to-gray-100/50">
                  <div className="max-w-md mx-auto">
                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      Start Building Your Page
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Drag blocks from the left panel to add them to your canvas.
                    </p>
                    <p className="text-xs text-gray-500">
                      Click blocks to configure • Drag to reorder • Nest in containers
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SortableContext>

        {/* Drag Overlay - shows dragged block while dragging */}
        <DragOverlay>
          {activeBlock ? (
            <div className="bg-white rounded-lg border-2 border-primary shadow-2xl p-4 opacity-90 rotate-2 scale-105">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                {activeBlock.template?.name || 'Block'}
                {isContainer(activeBlock) && (
                  <span className="text-xs text-gray-500">
                    ({activeBlock.containerType})
                  </span>
                )}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
