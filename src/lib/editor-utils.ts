/**
 * CMS Page Editor Utility Functions
 *
 * Helper functions for working with the Elementor-style page builder,
 * including block tree manipulation, container operations, and more.
 */

import { EditorBlock, ContainerType, NavigatorNode } from '@/types/editor';

// ============================================
// Block Tree Traversal
// ============================================

/**
 * Build a hierarchical tree structure from flat blocks array
 */
export function buildBlockTree(blocks: EditorBlock[]): EditorBlock[] {
  const blockMap = new Map<string, EditorBlock>();
  const rootBlocks: EditorBlock[] = [];

  // First pass: Create map and initialize children arrays
  blocks.forEach(block => {
    blockMap.set(block.id, { ...block, children: [] });
  });

  // Second pass: Build hierarchy
  blocks.forEach(block => {
    const blockWithChildren = blockMap.get(block.id)!;

    if (block.parentId) {
      const parent = blockMap.get(block.parentId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(blockWithChildren);
      } else {
        // Parent not found, treat as root
        rootBlocks.push(blockWithChildren);
      }
    } else {
      rootBlocks.push(blockWithChildren);
    }
  });

  // Sort children by order
  const sortByOrder = (blocks: EditorBlock[]) => {
    blocks.sort((a, b) => a.order - b.order);
    blocks.forEach(block => {
      if (block.children && block.children.length > 0) {
        sortByOrder(block.children);
      }
    });
  };

  sortByOrder(rootBlocks);

  return rootBlocks;
}

/**
 * Flatten a hierarchical block tree into a flat array
 */
export function flattenBlockTree(blocks: EditorBlock[]): EditorBlock[] {
  const result: EditorBlock[] = [];

  const traverse = (block: EditorBlock) => {
    const { children, ...blockWithoutChildren } = block;
    result.push(blockWithoutChildren as EditorBlock);

    if (children && children.length > 0) {
      children.forEach(traverse);
    }
  };

  blocks.forEach(traverse);

  return result;
}

/**
 * Find a block by ID in the tree
 */
export function findBlockById(
  blocks: EditorBlock[],
  blockId: string
): EditorBlock | null {
  for (const block of blocks) {
    if (block.id === blockId) {
      return block;
    }

    if (block.children && block.children.length > 0) {
      const found = findBlockById(block.children, blockId);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

/**
 * Find the parent of a block
 */
export function findBlockParent(
  blocks: EditorBlock[],
  blockId: string,
  parentBlock?: EditorBlock
): EditorBlock | null {
  for (const block of blocks) {
    if (block.children && block.children.some(child => child.id === blockId)) {
      return block;
    }

    if (block.children && block.children.length > 0) {
      const found = findBlockParent(block.children, blockId, block);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

/**
 * Get all ancestor blocks of a given block
 */
export function getBlockAncestors(
  blocks: EditorBlock[],
  blockId: string
): EditorBlock[] {
  const ancestors: EditorBlock[] = [];

  const findAncestors = (currentBlocks: EditorBlock[], targetId: string): boolean => {
    for (const block of currentBlocks) {
      if (block.children && block.children.some(child => child.id === targetId)) {
        ancestors.unshift(block);
        return true;
      }

      if (block.children && block.children.length > 0) {
        if (findAncestors(block.children, targetId)) {
          ancestors.unshift(block);
          return true;
        }
      }
    }

    return false;
  };

  findAncestors(blocks, blockId);

  return ancestors;
}

/**
 * Get all descendant blocks of a given block
 */
export function getBlockDescendants(block: EditorBlock): EditorBlock[] {
  const descendants: EditorBlock[] = [];

  const traverse = (currentBlock: EditorBlock) => {
    if (currentBlock.children && currentBlock.children.length > 0) {
      currentBlock.children.forEach(child => {
        descendants.push(child);
        traverse(child);
      });
    }
  };

  traverse(block);

  return descendants;
}

// ============================================
// Block Manipulation
// ============================================

/**
 * Update a block in the tree
 */
export function updateBlockInTree(
  blocks: EditorBlock[],
  blockId: string,
  updates: Partial<EditorBlock>
): EditorBlock[] {
  return blocks.map(block => {
    if (block.id === blockId) {
      return { ...block, ...updates };
    }

    if (block.children && block.children.length > 0) {
      return {
        ...block,
        children: updateBlockInTree(block.children, blockId, updates),
      };
    }

    return block;
  });
}

/**
 * Remove a block from the tree
 */
export function removeBlockFromTree(
  blocks: EditorBlock[],
  blockId: string
): EditorBlock[] {
  return blocks
    .filter(block => block.id !== blockId)
    .map(block => {
      if (block.children && block.children.length > 0) {
        return {
          ...block,
          children: removeBlockFromTree(block.children, blockId),
        };
      }
      return block;
    });
}

/**
 * Move a block to a new parent
 */
export function moveBlockToParent(
  blocks: EditorBlock[],
  blockId: string,
  newParentId: string | null,
  newOrder: number
): EditorBlock[] {
  // First, find and remove the block
  const block = findBlockById(blocks, blockId);
  if (!block) {
    return blocks;
  }

  const withoutBlock = removeBlockFromTree(blocks, blockId);

  // Update the block's parent and order
  const movedBlock = {
    ...block,
    parentId: newParentId,
    order: newOrder,
  };

  // If moving to root
  if (!newParentId) {
    return [...withoutBlock, movedBlock];
  }

  // Otherwise, add to new parent
  return updateBlockInTree(withoutBlock, newParentId, (parent) => ({
    ...parent,
    children: [...(parent.children || []), movedBlock],
  }));
}

/**
 * Duplicate a block
 */
export function duplicateBlock(
  block: EditorBlock,
  generateId: () => string
): EditorBlock {
  const newId = generateId();

  const duplicated: EditorBlock = {
    ...block,
    id: newId,
    order: block.order + 1,
  };

  // Recursively duplicate children
  if (block.children && block.children.length > 0) {
    duplicated.children = block.children.map(child =>
      duplicateBlock(child, generateId)
    );
  }

  return duplicated;
}

// ============================================
// Container Operations
// ============================================

/**
 * Check if a block is a container
 */
export function isContainer(block: EditorBlock): boolean {
  return block.containerType !== ContainerType.BLOCK;
}

/**
 * Check if a block can be dropped into another block
 */
export function canDropInto(
  draggedBlock: EditorBlock,
  targetBlock: EditorBlock
): boolean {
  // Can't drop into regular blocks
  if (!isContainer(targetBlock)) {
    return false;
  }

  // Can't drop a container into itself or its descendants
  if (draggedBlock.id === targetBlock.id) {
    return false;
  }

  const descendants = getBlockDescendants(draggedBlock);
  if (descendants.some(d => d.id === targetBlock.id)) {
    return false;
  }

  return true;
}

/**
 * Get the maximum nesting depth of a block tree
 */
export function getMaxDepth(blocks: EditorBlock[], currentDepth = 0): number {
  if (!blocks || blocks.length === 0) {
    return currentDepth;
  }

  let maxDepth = currentDepth;

  blocks.forEach(block => {
    if (block.children && block.children.length > 0) {
      const childDepth = getMaxDepth(block.children, currentDepth + 1);
      maxDepth = Math.max(maxDepth, childDepth);
    }
  });

  return maxDepth;
}

// ============================================
// Navigator Operations
// ============================================

/**
 * Convert editor blocks to navigator nodes
 */
export function blocksToNavigatorNodes(
  blocks: EditorBlock[],
  selectedBlockId: string | null,
  expandedIds: Set<string>,
  depth = 0
): NavigatorNode[] {
  return blocks.map(block => {
    const node: NavigatorNode = {
      id: block.id,
      label: block.template?.name || 'Untitled Block',
      type: block.containerType,
      isVisible: block.isVisible,
      isSelected: block.id === selectedBlockId,
      isExpanded: expandedIds.has(block.id),
      depth,
      children: block.children && block.children.length > 0
        ? blocksToNavigatorNodes(
            block.children,
            selectedBlockId,
            expandedIds,
            depth + 1
          )
        : undefined,
    };

    return node;
  });
}

// ============================================
// Configuration Helpers
// ============================================

/**
 * Merge content, style, and advanced configs for rendering
 */
export function mergeConfigs(block: EditorBlock): Record<string, any> {
  return {
    ...block.contentConfig,
    ...block.styleConfig,
    ...block.advancedConfig,
  };
}

/**
 * Split a flat config into three-tab structure
 */
export function splitConfigIntoTabs(
  config: Record<string, any>,
  schema: any
): {
  contentConfig: Record<string, any>;
  styleConfig: Record<string, any>;
  advancedConfig: Record<string, any>;
} {
  // This is a simplified version - in reality, you'd use the schema to determine
  // which fields belong in which tab
  const contentConfig: Record<string, any> = {};
  const styleConfig: Record<string, any> = {};
  const advancedConfig: Record<string, any> = {};

  Object.entries(config).forEach(([key, value]) => {
    // Style-related keys
    if (
      key.includes('color') ||
      key.includes('background') ||
      key.includes('font') ||
      key.includes('padding') ||
      key.includes('margin') ||
      key.includes('border')
    ) {
      styleConfig[key] = value;
    }
    // Advanced-related keys
    else if (
      key.includes('animation') ||
      key.includes('custom') ||
      key.includes('position') ||
      key.includes('zIndex')
    ) {
      advancedConfig[key] = value;
    }
    // Content by default
    else {
      contentConfig[key] = value;
    }
  });

  return { contentConfig, styleConfig, advancedConfig };
}

// ============================================
// Order/Reordering Helpers
// ============================================

/**
 * Reorder blocks within the same parent
 */
export function reorderBlocks(
  blocks: EditorBlock[],
  oldIndex: number,
  newIndex: number
): EditorBlock[] {
  const result = Array.from(blocks);
  const [removed] = result.splice(oldIndex, 1);
  result.splice(newIndex, 0, removed);

  // Update order values
  return result.map((block, index) => ({
    ...block,
    order: index,
  }));
}

/**
 * Update order values for all blocks to be sequential
 */
export function normalizeBlockOrders(blocks: EditorBlock[]): EditorBlock[] {
  return blocks.map((block, index) => {
    const updated = { ...block, order: index };

    if (block.children && block.children.length > 0) {
      updated.children = normalizeBlockOrders(block.children);
    }

    return updated;
  });
}

// ============================================
// Validation
// ============================================

/**
 * Validate block tree structure
 */
export function validateBlockTree(blocks: EditorBlock[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const blockIds = new Set<string>();

  const validate = (block: EditorBlock, ancestors: string[] = []): void => {
    // Check for duplicate IDs
    if (blockIds.has(block.id)) {
      errors.push(`Duplicate block ID: ${block.id}`);
    }
    blockIds.add(block.id);

    // Check for circular references
    if (ancestors.includes(block.id)) {
      errors.push(`Circular reference detected: ${block.id}`);
    }

    // Check children
    if (block.children) {
      // Non-containers shouldn't have children
      if (!isContainer(block)) {
        errors.push(`Non-container block ${block.id} has children`);
      }

      block.children.forEach(child => {
        validate(child, [...ancestors, block.id]);
      });
    }
  };

  blocks.forEach(block => validate(block));

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================
// Search & Filter
// ============================================

/**
 * Search blocks by text
 */
export function searchBlocks(
  blocks: EditorBlock[],
  query: string
): EditorBlock[] {
  const results: EditorBlock[] = [];
  const lowerQuery = query.toLowerCase();

  const search = (block: EditorBlock) => {
    const templateName = block.template?.name?.toLowerCase() || '';
    const configStr = JSON.stringify(block.contentConfig).toLowerCase();

    if (templateName.includes(lowerQuery) || configStr.includes(lowerQuery)) {
      results.push(block);
    }

    if (block.children && block.children.length > 0) {
      block.children.forEach(search);
    }
  };

  blocks.forEach(search);

  return results;
}
