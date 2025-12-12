/**
 * Context Menu Component
 *
 * Right-click context menu for blocks with common actions.
 * Matches Elementor's context menu functionality.
 */

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Copy,
  Clipboard,
  Trash2,
  Eye,
  EyeOff,
  Palette,
  Code,
  Save,
  ArrowUp,
  ArrowDown,
  Maximize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContextMenuItem as ContextMenuItemType } from '@/types/editor';

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItemType[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    // Adjust position if menu would go off screen
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = x;
      let adjustedY = y;

      if (x + rect.width > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 10;
      }

      if (y + rect.height > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 10;
      }

      setPosition({ x: adjustedX, y: adjustedY });
    }
  }, [x, y]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[9999] min-w-[200px] bg-white rounded-lg shadow-2xl border border-gray-200 py-1 animate-in fade-in zoom-in-95 duration-100"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {items.map((item, index) => {
        if (item.separator) {
          return <div key={`separator-${index}`} className="h-px bg-gray-200 my-1" />;
        }

        if (item.submenu) {
          return (
            <ContextMenuItemWithSubmenu key={item.id} item={item} onClose={onClose} />
          );
        }

        return <ContextMenuItem key={item.id} item={item} onClick={onClose} />;
      })}
    </div>,
    document.body
  );
};

/**
 * Context Menu Item Component
 */
interface ContextMenuItemProps {
  item: ContextMenuItemType;
  onClick: () => void;
}

const ContextMenuItem: React.FC<ContextMenuItemProps> = ({ item, onClick }) => {
  const handleClick = () => {
    if (!item.disabled) {
      item.action();
      onClick();
    }
  };

  return (
    <button
      className={cn(
        'w-full flex items-center justify-between px-3 py-2 text-sm transition-colors',
        item.disabled
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 cursor-pointer'
      )}
      onClick={handleClick}
      disabled={item.disabled}
    >
      <div className="flex items-center gap-3">
        {item.icon && <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>}
        <span>{item.label}</span>
      </div>
      {item.shortcut && (
        <span className="text-xs text-gray-500 font-mono">{item.shortcut}</span>
      )}
    </button>
  );
};

/**
 * Context Menu Item with Submenu
 */
interface ContextMenuItemWithSubmenuProps {
  item: ContextMenuItemType;
  onClose: () => void;
}

const ContextMenuItemWithSubmenu: React.FC<ContextMenuItemWithSubmenuProps> = ({
  item,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={itemRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 text-sm transition-colors',
          item.disabled
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
        )}
        disabled={item.disabled}
      >
        <div className="flex items-center gap-3">
          {item.icon && <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>}
          <span>{item.label}</span>
        </div>
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {isOpen && item.submenu && (
        <div className="absolute left-full top-0 ml-1 min-w-[180px] bg-white rounded-lg shadow-2xl border border-gray-200 py-1 animate-in fade-in slide-in-from-left-1 duration-100">
          {item.submenu.map((subitem) => (
            <ContextMenuItem key={subitem.id} item={subitem} onClick={onClose} />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * useContextMenu Hook
 * Manages context menu state and position
 */
interface UseContextMenuOptions {
  items: ContextMenuItemType[];
}

export function useContextMenu({ items }: UseContextMenuOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    position,
    handleContextMenu,
    handleClose,
    ContextMenu: isOpen ? (
      <ContextMenu x={position.x} y={position.y} items={items} onClose={handleClose} />
    ) : null,
  };
}

/**
 * Common Context Menu Items Factory
 * Generates standard context menu items for blocks
 */
interface CreateBlockContextMenuOptions {
  onCopy?: () => void;
  onPaste?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onCopyStyle?: () => void;
  onPasteStyle?: () => void;
  onToggleVisibility?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onSaveAsTemplate?: () => void;
  onResetStyle?: () => void;
  isVisible?: boolean;
  canPaste?: boolean;
  canPasteStyle?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export function createBlockContextMenu(
  options: CreateBlockContextMenuOptions
): ContextMenuItemType[] {
  const items: ContextMenuItemType[] = [];

  // Copy/Paste group
  if (options.onCopy) {
    items.push({
      id: 'copy',
      label: 'Copy',
      icon: <Copy className="w-4 h-4" />,
      action: options.onCopy,
      shortcut: 'Ctrl+C',
    });
  }

  if (options.onPaste) {
    items.push({
      id: 'paste',
      label: 'Paste',
      icon: <Clipboard className="w-4 h-4" />,
      action: options.onPaste,
      shortcut: 'Ctrl+V',
      disabled: !options.canPaste,
    });
  }

  if (options.onDuplicate) {
    items.push({
      id: 'duplicate',
      label: 'Duplicate',
      icon: <Copy className="w-4 h-4" />,
      action: options.onDuplicate,
      shortcut: 'Ctrl+D',
    });
  }

  if (items.length > 0) {
    items.push({ id: 'sep1', separator: true } as any);
  }

  // Style group
  if (options.onCopyStyle) {
    items.push({
      id: 'copy-style',
      label: 'Copy Style',
      icon: <Palette className="w-4 h-4" />,
      action: options.onCopyStyle,
    });
  }

  if (options.onPasteStyle) {
    items.push({
      id: 'paste-style',
      label: 'Paste Style',
      icon: <Palette className="w-4 h-4" />,
      action: options.onPasteStyle,
      disabled: !options.canPasteStyle,
    });
  }

  if (options.onResetStyle) {
    items.push({
      id: 'reset-style',
      label: 'Reset Style',
      icon: <Palette className="w-4 h-4" />,
      action: options.onResetStyle,
    });
  }

  if (options.onCopyStyle || options.onPasteStyle || options.onResetStyle) {
    items.push({ id: 'sep2', separator: true } as any);
  }

  // Move group
  if (options.onMoveUp) {
    items.push({
      id: 'move-up',
      label: 'Move Up',
      icon: <ArrowUp className="w-4 h-4" />,
      action: options.onMoveUp,
      disabled: !options.canMoveUp,
    });
  }

  if (options.onMoveDown) {
    items.push({
      id: 'move-down',
      label: 'Move Down',
      icon: <ArrowDown className="w-4 h-4" />,
      action: options.onMoveDown,
      disabled: !options.canMoveDown,
    });
  }

  if ((options.onMoveUp || options.onMoveDown) && (options.onToggleVisibility || options.onSaveAsTemplate)) {
    items.push({ id: 'sep3', separator: true } as any);
  }

  // Visibility toggle
  if (options.onToggleVisibility) {
    items.push({
      id: 'toggle-visibility',
      label: options.isVisible ? 'Hide' : 'Show',
      icon: options.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />,
      action: options.onToggleVisibility,
    });
  }

  // Save as template
  if (options.onSaveAsTemplate) {
    items.push({
      id: 'save-template',
      label: 'Save as Template',
      icon: <Save className="w-4 h-4" />,
      action: options.onSaveAsTemplate,
    });
  }

  if ((options.onToggleVisibility || options.onSaveAsTemplate) && options.onDelete) {
    items.push({ id: 'sep4', separator: true } as any);
  }

  // Delete
  if (options.onDelete) {
    items.push({
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4 text-red-600" />,
      action: options.onDelete,
      shortcut: 'Del',
    });
  }

  return items;
}
