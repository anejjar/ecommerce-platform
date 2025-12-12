/**
 * Finder Command Palette
 *
 * Quick access to blocks, pages, settings, and actions.
 * Similar to Elementor's Finder (Ctrl+E) and modern command palettes.
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  FileText,
  Plus,
  Settings,
  Layers,
  Book,
  ExternalLink,
  ChevronRight,
  Command,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { BlockTemplate } from '@/types/editor';

interface FinderItem {
  id: string;
  type: 'block' | 'page' | 'action' | 'setting' | 'recent';
  label: string;
  description?: string;
  icon?: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

interface FinderProps {
  isOpen: boolean;
  onClose: () => void;
  blockTemplates?: BlockTemplate[];
  onAddBlock?: (template: BlockTemplate) => void;
  recentBlocks?: BlockTemplate[];
  onNavigate?: (path: string) => void;
}

export const Finder: React.FC<FinderProps> = ({
  isOpen,
  onClose,
  blockTemplates = [],
  onAddBlock,
  recentBlocks = [],
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  // Build all available items
  const allItems = useMemo(() => {
    const items: FinderItem[] = [];

    // Recent blocks
    if (recentBlocks.length > 0) {
      items.push(
        ...recentBlocks.slice(0, 5).map((template) => ({
          id: `recent-${template.id}`,
          type: 'recent' as const,
          label: template.name,
          description: 'Recently used',
          icon: <Layers className="w-4 h-4 text-blue-500" />,
          action: () => {
            if (onAddBlock) onAddBlock(template);
            onClose();
          },
          keywords: [template.name, template.category, 'recent'],
        }))
      );
    }

    // All block templates
    items.push(
      ...blockTemplates.map((template) => ({
        id: `block-${template.id}`,
        type: 'block' as const,
        label: template.name,
        description: template.description || template.category,
        icon: <Layers className="w-4 h-4 text-purple-500" />,
        action: () => {
          if (onAddBlock) onAddBlock(template);
          onClose();
        },
        keywords: [template.name, template.category, template.slug],
      }))
    );

    // Actions
    items.push(
      {
        id: 'create-page',
        type: 'action',
        label: 'Create New Page',
        description: 'Create a new CMS page',
        icon: <Plus className="w-4 h-4 text-green-500" />,
        action: () => {
          if (onNavigate) onNavigate('/admin/cms/pages/new');
          onClose();
        },
        keywords: ['create', 'new', 'page'],
      },
      {
        id: 'view-pages',
        type: 'action',
        label: 'View All Pages',
        description: 'Go to pages list',
        icon: <FileText className="w-4 h-4 text-blue-500" />,
        action: () => {
          if (onNavigate) onNavigate('/admin/cms/pages');
          onClose();
        },
        keywords: ['pages', 'list', 'view'],
      }
    );

    // Settings
    items.push(
      {
        id: 'page-settings',
        type: 'setting',
        label: 'Page Settings',
        description: 'Edit page metadata and SEO',
        icon: <Settings className="w-4 h-4 text-gray-500" />,
        action: () => {
          // This would open the page settings panel
          onClose();
        },
        keywords: ['settings', 'page', 'seo', 'metadata'],
      },
      {
        id: 'help',
        type: 'setting',
        label: 'Help & Documentation',
        description: 'View editor documentation',
        icon: <Book className="w-4 h-4 text-orange-500" />,
        action: () => {
          window.open('https://code.claude.com/docs', '_blank');
          onClose();
        },
        keywords: ['help', 'docs', 'documentation', 'guide'],
      }
    );

    return items;
  }, [blockTemplates, recentBlocks, onAddBlock, onClose, onNavigate]);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      // Show recent items first when no query
      return allItems.sort((a, b) => {
        if (a.type === 'recent' && b.type !== 'recent') return -1;
        if (a.type !== 'recent' && b.type === 'recent') return 1;
        return 0;
      });
    }

    const lowerQuery = query.toLowerCase();
    return allItems
      .filter((item) => {
        const searchText = [
          item.label,
          item.description,
          ...(item.keywords || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchText.includes(lowerQuery);
      })
      .sort((a, b) => {
        // Prioritize exact label matches
        const aLabelMatch = a.label.toLowerCase().startsWith(lowerQuery);
        const bLabelMatch = b.label.toLowerCase().startsWith(lowerQuery);
        if (aLabelMatch && !bLabelMatch) return -1;
        if (!aLabelMatch && bLabelMatch) return 1;
        return 0;
      });
  }, [allItems, query]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  // Reset selection when filtered items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (itemsRef.current) {
      const selectedElement = itemsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-200">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b bg-gray-50">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search blocks, pages, and actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-gray-500 bg-gray-100 border rounded">
            <Command className="w-3 h-3" />
            <span>E</span>
          </kbd>
        </div>

        {/* Results */}
        <div ref={itemsRef} className="max-h-[60vh] overflow-y-auto">
          {filteredItems.length > 0 ? (
            <div className="py-2">
              {filteredItems.map((item, index) => (
                <FinderItem
                  key={item.id}
                  item={item}
                  isSelected={index === selectedIndex}
                  onClick={() => {
                    setSelectedIndex(index);
                    item.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">No results found</p>
              <p className="text-xs text-gray-400 mt-1">
                Try searching for blocks, pages, or actions
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t bg-gray-50 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono">Enter</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono">Esc</kbd>
              Close
            </span>
          </div>
          <span>{filteredItems.length} results</span>
        </div>
      </div>
    </div>,
    document.body
  );
};

/**
 * Finder Item Component
 */
interface FinderItemProps {
  item: FinderItem;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

const FinderItem: React.FC<FinderItemProps> = ({ item, isSelected, onClick, onMouseEnter }) => {
  const getTypeLabel = () => {
    switch (item.type) {
      case 'block':
        return 'Block';
      case 'recent':
        return 'Recent';
      case 'action':
        return 'Action';
      case 'setting':
        return 'Setting';
      case 'page':
        return 'Page';
      default:
        return '';
    }
  };

  return (
    <button
      className={cn(
        'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
        isSelected ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-gray-50'
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      {/* Icon */}
      <div className="flex-shrink-0">{item.icon}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-gray-900 truncate">{item.label}</span>
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
            {getTypeLabel()}
          </span>
        </div>
        {item.description && (
          <p className="text-xs text-gray-500 truncate mt-0.5">{item.description}</p>
        )}
      </div>

      {/* Arrow */}
      <ChevronRight className={cn('w-4 h-4 text-gray-400 flex-shrink-0', isSelected && 'text-primary')} />
    </button>
  );
};

/**
 * useFinder Hook
 */
export function useFinder() {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return { isOpen, open, close, toggle };
}
