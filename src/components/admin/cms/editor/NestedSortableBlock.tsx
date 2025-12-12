/**
 * Nested Sortable Block Component
 *
 * Enhanced version of SortableBlock with support for nested containers,
 * drop zones, and Elementor-style interactions.
 */

import React, { useState } from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Trash2,
  Settings,
  Move,
  Copy,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BlockPreview } from '../block-editor/BlockPreview';
import { Container, ContainerLabel } from './Container';
import { EditorBlock, ContainerType } from '@/types/editor';
import { isContainer } from '@/lib/editor-utils';

interface NestedSortableBlockProps {
  block: EditorBlock;
  isSelected: boolean;
  isHovered?: boolean;
  onSelect: () => void;
  onHover?: (blockId: string | null) => void;
  onToggleSettings?: () => void;
  onRemove: () => void;
  onDuplicate?: () => void;
  onToggleVisibility?: () => void;
  onAddBlockToContainer?: (containerId: string) => void;
  depth?: number;
  renderChildren?: (blocks: EditorBlock[]) => React.ReactNode;
}

export const NestedSortableBlock: React.FC<NestedSortableBlockProps> = ({
  block,
  isSelected,
  isHovered = false,
  onSelect,
  onHover,
  onToggleSettings,
  onRemove,
  onDuplicate,
  onToggleVisibility,
  onAddBlockToContainer,
  depth = 0,
  renderChildren,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = block.children && block.children.length > 0;
  const blockIsContainer = isContainer(block);

  // Sortable for dragging the block itself
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  // Droppable for accepting children (only if it's a container)
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `droppable-${block.id}`,
    disabled: !blockIsContainer,
    data: {
      type: 'container',
      accepts: 'block',
      blockId: block.id,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  const handleMouseEnter = () => {
    if (onHover && !isDragging) {
      onHover(block.id);
    }
  };

  const handleMouseLeave = () => {
    if (onHover && !isDragging) {
      onHover(null);
    }
  };

  // Render block content (either preview or container with children)
  const renderBlockContent = () => {
    if (blockIsContainer) {
      return (
        <Container
          block={block}
          isSelected={isSelected}
          isHovered={isHovered}
          onAddBlockToContainer={onAddBlockToContainer}
          className={cn(
            'min-h-[80px]',
            isOver && 'ring-2 ring-blue-400 ring-offset-2 bg-blue-50/20'
          )}
        >
          {hasChildren && isExpanded && renderChildren && (
            <div className="space-y-2 p-2">
              {renderChildren(block.children!)}
            </div>
          )}
        </Container>
      );
    }

    // Merge all config objects for the preview
    // Support both old single config and new three-tab config system
    const mergedConfig = block.config || {
      ...block.contentConfig,
      ...block.styleConfig,
      ...block.advancedConfig,
    };

    // Regular block preview
    return (
      <div className="pointer-events-none min-h-[100px] bg-white">
        {block.template ? (
          <BlockPreview
            template={block.template}
            config={mergedConfig}
          />
        ) : (
          <div className="flex items-center justify-center h-24 bg-gray-50 text-gray-400">
            Unknown Block Template
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group transition-all',
        depth > 0 && 'ml-4 border-l-2 border-gray-200 pl-3',
        !block.isVisible && 'opacity-50'
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Block Label and Controls */}
      <div
        className={cn(
          'absolute -top-3 left-0 right-0 flex items-center justify-between z-20 transition-all px-2',
          (isSelected || isHovered) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      >
        {/* Left: Block Name & Type Label */}
        <div className="flex items-center gap-2">
          {hasChildren && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-white/90 bg-white border shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}

          {isSelected && (
            <div className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
              {block.template?.name || 'Block'}
            </div>
          )}

          <ContainerLabel
            containerType={block.containerType}
            blockName={block.template?.name}
          />
        </div>

        {/* Right: Action Buttons */}
        <div
          className={cn(
            'flex items-center gap-1 bg-white shadow-md border rounded-lg p-1',
            (isSelected || isDragging) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'
          )}
        >
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-move p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-gray-900 transition-colors"
            title="Drag to reorder"
          >
            <Move className="h-3.5 w-3.5" />
          </div>

          <div className="w-px h-4 bg-gray-200" />

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-7 w-7 transition-colors',
              isSelected
                ? 'text-primary bg-primary/10'
                : 'text-gray-500 hover:text-primary hover:bg-primary/5'
            )}
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleSettings) {
                onToggleSettings();
              } else {
                onSelect();
              }
            }}
            title={isSelected ? 'Close Settings' : 'Open Settings'}
          >
            <Settings className="h-3.5 w-3.5" />
          </Button>

          <div className="w-px h-4 bg-gray-200" />

          {/* Visibility Toggle */}
          {onToggleVisibility && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility();
                }}
                title={block.isVisible ? 'Hide block' : 'Show block'}
              >
                {block.isVisible ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
              </Button>
              <div className="w-px h-4 bg-gray-200" />
            </>
          )}

          {/* Duplicate */}
          {onDuplicate && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate();
                }}
                title="Duplicate block"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <div className="w-px h-4 bg-gray-200" />
            </>
          )}

          {/* Remove */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-500 hover:text-red-600 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="Remove block"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Block Content Wrapper */}
      <div
        ref={blockIsContainer ? setDroppableRef : undefined}
        className={cn(
          'bg-white rounded-lg border shadow-sm overflow-hidden transition-all mt-2',
          isSelected ? 'border-primary/30 shadow-primary/10' : 'border-gray-200 hover:border-gray-300',
          isOver && 'border-blue-400 shadow-blue-100',
          !isExpanded && hasChildren && 'border-dashed'
        )}
      >
        {renderBlockContent()}
      </div>

      {/* Drop Zone Indicator */}
      {isOver && blockIsContainer && (
        <div className="absolute inset-0 pointer-events-none rounded-lg ring-2 ring-blue-400 ring-offset-2 bg-blue-50/10 flex items-center justify-center z-10">
          <div className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
            Drop here to add to container
          </div>
        </div>
      )}

      {/* Depth Indicator */}
      {depth > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-transparent"
          style={{ left: `-${depth * 16}px` }}
        />
      )}
    </div>
  );
};
