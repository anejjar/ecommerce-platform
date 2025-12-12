/**
 * History Panel Component
 *
 * Visual history of all actions with timestamps.
 * Allows clicking any action to restore that state.
 * Similar to Elementor's History panel (Ctrl+H).
 */

import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  History,
  Plus,
  Trash2,
  Copy,
  Move,
  Edit,
  Eye,
  EyeOff,
  RotateCcw,
  X,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { EditorHistory } from '@/types/editor';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: EditorHistory[];
  currentIndex: number;
  onRestoreToIndex: (index: number) => void;
  onClearHistory?: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  onClose,
  history,
  currentIndex,
  onRestoreToIndex,
  onClearHistory,
}) => {
  // Group history by time periods
  const groupedHistory = useMemo(() => {
    const now = Date.now();
    const groups: {
      label: string;
      items: Array<{ index: number; item: EditorHistory }>;
    }[] = [];

    const today: Array<{ index: number; item: EditorHistory }> = [];
    const yesterday: Array<{ index: number; item: EditorHistory }> = [];
    const thisWeek: Array<{ index: number; item: EditorHistory }> = [];
    const older: Array<{ index: number; item: EditorHistory }> = [];

    history.forEach((item, index) => {
      const diff = now - item.timestamp;
      const dayInMs = 24 * 60 * 60 * 1000;

      if (diff < dayInMs) {
        today.push({ index, item });
      } else if (diff < 2 * dayInMs) {
        yesterday.push({ index, item });
      } else if (diff < 7 * dayInMs) {
        thisWeek.push({ index, item });
      } else {
        older.push({ index, item });
      }
    });

    if (today.length > 0) groups.push({ label: 'Today', items: today.reverse() });
    if (yesterday.length > 0) groups.push({ label: 'Yesterday', items: yesterday.reverse() });
    if (thisWeek.length > 0) groups.push({ label: 'This Week', items: thisWeek.reverse() });
    if (older.length > 0) groups.push({ label: 'Older', items: older.reverse() });

    return groups;
  }, [history]);

  if (!isOpen) return null;
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white sm:rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[90vh] sm:max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-gray-700" />
            <h2 className="font-semibold text-gray-900">History</h2>
            <span className="text-xs text-gray-500">({history.length} actions)</span>
          </div>
          <div className="flex items-center gap-1">
            {onClearHistory && history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearHistory}
                className="h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear All
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* History List */}
        <ScrollArea className="flex-1">
          {history.length > 0 ? (
            <div className="p-2">
              {groupedHistory.map((group) => (
                <div key={group.label} className="mb-4">
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {group.label}
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map(({ index, item }) => (
                      <HistoryItem
                        key={index}
                        item={item}
                        index={index}
                        isCurrent={index === currentIndex}
                        onClick={() => onRestoreToIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">No history yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Actions you perform will appear here
              </p>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="px-4 py-3 border-t bg-gray-50 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>Click any action to restore</span>
            <kbd className="px-2 py-1 bg-white border rounded font-mono">Ctrl+H</kbd>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

/**
 * History Item Component
 */
interface HistoryItemProps {
  item: EditorHistory;
  index: number;
  isCurrent: boolean;
  onClick: () => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, index, isCurrent, onClick }) => {
  const actionLabel = getActionLabel(item);
  const icon = getActionIcon(item);
  const time = formatTime(item.timestamp);

  return (
    <button
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all',
        isCurrent
          ? 'bg-primary/10 border-l-2 border-primary'
          : 'hover:bg-gray-100 border-l-2 border-transparent'
      )}
      onClick={onClick}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
          isCurrent ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-600'
        )}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{actionLabel}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>

      {/* Current indicator */}
      {isCurrent && (
        <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full animate-pulse" />
      )}
    </button>
  );
};

/**
 * Get action label from history item
 */
function getActionLabel(item: EditorHistory): string {
  const blockCount = item.blocks.length;

  // Try to determine the action type by comparing with previous state
  // This is simplified - in a real implementation, you'd store the action type
  if (blockCount === 0) {
    return 'Page created';
  }

  return `${blockCount} block${blockCount !== 1 ? 's' : ''}`;
}

/**
 * Get icon for action type
 */
function getActionIcon(item: EditorHistory): React.ReactNode {
  // This is simplified - in a real implementation, you'd have the action type stored
  const blockCount = item.blocks.length;

  if (blockCount === 0) {
    return <Plus className="w-4 h-4" />;
  }

  return <Edit className="w-4 h-4" />;
}

/**
 * Format timestamp
 */
function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // Less than 1 minute
  if (diff < 60000) {
    return 'Just now';
  }

  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }

  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }

  // Same day
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // This week
  const daysDiff = Math.floor(diff / 86400000);
  if (daysDiff < 7) {
    return `${daysDiff} day${daysDiff !== 1 ? 's' : ''} ago`;
  }

  // Older
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/**
 * useHistoryPanel Hook
 */
export function useHistoryPanel() {
  const [isOpen, setIsOpen] = React.useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return { isOpen, open, close, toggle };
}
