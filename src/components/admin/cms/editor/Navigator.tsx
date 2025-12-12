/**
 * Navigator Panel Component
 *
 * Tree view displaying the hierarchical structure of blocks on the page.
 * Similar to Elementor's Navigator panel.
 *
 * Features:
 * - Hierarchical tree view of blocks
 * - Expand/collapse containers
 * - Drag-and-drop reordering
 * - Click to select blocks
 * - Visibility toggle
 * - Search/filter
 */

import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Search,
  Layers,
  Trash2,
  Copy,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { EditorBlock, NavigatorNode, ContainerType } from '@/types/editor';
import { blocksToNavigatorNodes, searchBlocks } from '@/lib/editor-utils';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface NavigatorProps {
  blocks: EditorBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onRemoveBlock?: (id: string) => void;
  onDuplicateBlock?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  onReorderBlocks?: (blocks: EditorBlock[]) => void;
  className?: string;
}

export const Navigator: React.FC<NavigatorProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onRemoveBlock,
  onDuplicateBlock,
  onToggleVisibility,
  onReorderBlocks,
  className,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Convert blocks to navigator nodes
  const navigatorNodes = useMemo(() => {
    if (searchQuery) {
      // Filter blocks by search
      const matchingBlocks = searchBlocks(blocks, searchQuery);
      const matchingIds = new Set(matchingBlocks.map((b) => b.id));

      // Auto-expand parents of matching blocks
      const newExpandedIds = new Set(expandedIds);
      matchingBlocks.forEach((block) => {
        let currentBlock = block;
        while (currentBlock.parentId) {
          newExpandedIds.add(currentBlock.parentId);
          currentBlock = blocks.find((b) => b.id === currentBlock.parentId)!;
          if (!currentBlock) break;
        }
      });
      setExpandedIds(newExpandedIds);

      return blocksToNavigatorNodes(blocks, selectedBlockId, newExpandedIds).filter((node) =>
        matchingIds.has(node.id)
      );
    }

    return blocksToNavigatorNodes(blocks, selectedBlockId, expandedIds);
  }, [blocks, selectedBlockId, expandedIds, searchQuery]);

  const toggleExpand = (nodeId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allContainerIds = blocks
      .filter((b) => b.containerType !== ContainerType.BLOCK && b.children && b.children.length > 0)
      .map((b) => b.id);
    setExpandedIds(new Set(allContainerIds));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  return (
    <div className={cn('flex flex-col h-full bg-white border-r', className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Layers className="w-4 h-4" />
            <span>Navigator</span>
            <span className="text-xs text-gray-500">({blocks.length})</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={expandAll}
              className="h-7 px-2 text-xs"
              title="Expand all"
            >
              Expand
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={collapseAll}
              className="h-7 px-2 text-xs"
              title="Collapse all"
            >
              Collapse
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 h-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto p-2">
        {navigatorNodes.length > 0 ? (
          <div className="space-y-0.5">
            {navigatorNodes.map((node) => (
              <NavigatorTreeNode
                key={node.id}
                node={node}
                onSelect={onSelectBlock}
                onToggleExpand={toggleExpand}
                onRemove={onRemoveBlock}
                onDuplicate={onDuplicateBlock}
                onToggleVisibility={onToggleVisibility}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Layers className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">
              {searchQuery ? 'No blocks found' : 'No blocks yet'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {searchQuery ? 'Try a different search' : 'Add blocks to your page'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Navigator Tree Node Component
 * Represents a single node in the tree view
 */
interface NavigatorTreeNodeProps {
  node: NavigatorNode;
  onSelect: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onRemove?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
}

const NavigatorTreeNode: React.FC<NavigatorTreeNodeProps> = ({
  node,
  onSelect,
  onToggleExpand,
  onRemove,
  onDuplicate,
  onToggleVisibility,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getIcon = () => {
    switch (node.type) {
      case ContainerType.SECTION:
        return (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h16M4 12h16M4 19h16" />
          </svg>
        );
      case ContainerType.FLEXBOX:
        return (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
          </svg>
        );
      case ContainerType.GRID:
        return (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        );
      default:
        return (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={cn(
          'group relative flex items-center gap-1 px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer',
          node.isSelected && 'bg-primary/10 text-primary font-medium',
          !node.isSelected && isHovered && 'bg-gray-100',
          !node.isVisible && 'opacity-50'
        )}
        style={{ paddingLeft: `${node.depth * 20 + 8}px` }}
        onClick={() => onSelect(node.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            className="flex-shrink-0 p-0.5 hover:bg-gray-200 rounded transition-colors"
          >
            {node.isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-4" />}

        {/* Icon */}
        <div className="flex-shrink-0 text-gray-500">{getIcon()}</div>

        {/* Label */}
        <div className="flex-1 truncate text-xs">{node.label}</div>

        {/* Action Buttons */}
        <div
          className={cn(
            'flex-shrink-0 flex items-center gap-0.5 transition-opacity',
            (isHovered || node.isSelected) ? 'opacity-100' : 'opacity-0'
          )}
        >
          {/* Visibility Toggle */}
          {onToggleVisibility && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(node.id);
              }}
              title={node.isVisible ? 'Hide' : 'Show'}
            >
              {node.isVisible ? (
                <Eye className="w-3 h-3" />
              ) : (
                <EyeOff className="w-3 h-3" />
              )}
            </Button>
          )}

          {/* Duplicate */}
          {onDuplicate && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(node.id);
              }}
              title="Duplicate"
            >
              <Copy className="w-3 h-3" />
            </Button>
          )}

          {/* Remove */}
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(node.id);
              }}
              title="Remove"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && node.isExpanded && (
        <div>
          {node.children!.map((child) => (
            <NavigatorTreeNode
              key={child.id}
              node={child}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
              onRemove={onRemove}
              onDuplicate={onDuplicate}
              onToggleVisibility={onToggleVisibility}
            />
          ))}
        </div>
      )}
    </div>
  );
};
