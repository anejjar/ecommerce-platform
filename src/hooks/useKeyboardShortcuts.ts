/**
 * Keyboard Shortcuts Hook
 *
 * Global keyboard shortcut handler for the editor.
 * Matches Elementor's keyboard shortcuts.
 */

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
  preventDefault?: boolean;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  shortcuts: KeyboardShortcut[];
}

export function useKeyboardShortcuts({ enabled = true, shortcuts }: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in inputs, textareas, or contenteditable
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
        const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatches = shortcut.alt ? event.altKey : !event.altKey;
        const metaMatches = shortcut.meta ? event.metaKey : !event.metaKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.action();
          break;
        }
      }
    },
    [enabled, shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * Create editor keyboard shortcuts
 */
export function createEditorShortcuts(handlers: {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onOpenFinder?: () => void;
  onOpenHistory?: () => void;
  onToggleDeviceMode?: () => void;
  onShowHelp?: () => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
}): KeyboardShortcut[] {
  const shortcuts: KeyboardShortcut[] = [];

  if (handlers.onSave) {
    shortcuts.push({
      key: 's',
      ctrl: true,
      description: 'Save page',
      action: handlers.onSave,
    });
  }

  if (handlers.onUndo) {
    shortcuts.push({
      key: 'z',
      ctrl: true,
      description: 'Undo',
      action: handlers.onUndo,
    });
  }

  if (handlers.onRedo) {
    shortcuts.push({
      key: 'z',
      ctrl: true,
      shift: true,
      description: 'Redo',
      action: handlers.onRedo,
    });
    shortcuts.push({
      key: 'y',
      ctrl: true,
      description: 'Redo',
      action: handlers.onRedo,
    });
  }

  if (handlers.onCopy) {
    shortcuts.push({
      key: 'c',
      ctrl: true,
      description: 'Copy selected block',
      action: handlers.onCopy,
    });
  }

  if (handlers.onPaste) {
    shortcuts.push({
      key: 'v',
      ctrl: true,
      description: 'Paste block',
      action: handlers.onPaste,
    });
  }

  if (handlers.onDuplicate) {
    shortcuts.push({
      key: 'd',
      ctrl: true,
      description: 'Duplicate selected block',
      action: handlers.onDuplicate,
    });
  }

  if (handlers.onDelete) {
    shortcuts.push({
      key: 'Delete',
      description: 'Delete selected block',
      action: handlers.onDelete,
    });
    shortcuts.push({
      key: 'Backspace',
      description: 'Delete selected block',
      action: handlers.onDelete,
    });
  }

  if (handlers.onOpenFinder) {
    shortcuts.push({
      key: 'e',
      ctrl: true,
      description: 'Open Finder',
      action: handlers.onOpenFinder,
    });
    shortcuts.push({
      key: 'k',
      ctrl: true,
      description: 'Open Finder',
      action: handlers.onOpenFinder,
    });
  }

  if (handlers.onOpenHistory) {
    shortcuts.push({
      key: 'h',
      ctrl: true,
      description: 'Open History',
      action: handlers.onOpenHistory,
    });
  }

  if (handlers.onToggleDeviceMode) {
    shortcuts.push({
      key: 'm',
      ctrl: true,
      description: 'Toggle device mode',
      action: handlers.onToggleDeviceMode,
    });
  }

  if (handlers.onShowHelp) {
    shortcuts.push({
      key: '/',
      ctrl: true,
      description: 'Show keyboard shortcuts',
      action: handlers.onShowHelp,
    });
  }

  if (handlers.onSelectAll) {
    shortcuts.push({
      key: 'a',
      ctrl: true,
      description: 'Select all blocks',
      action: handlers.onSelectAll,
    });
  }

  if (handlers.onDeselectAll) {
    shortcuts.push({
      key: 'Escape',
      description: 'Deselect all',
      action: handlers.onDeselectAll,
    });
  }

  return shortcuts;
}

/**
 * Format shortcut for display
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];

  if (shortcut.ctrl || shortcut.meta) {
    parts.push('Ctrl');
  }
  if (shortcut.shift) {
    parts.push('Shift');
  }
  if (shortcut.alt) {
    parts.push('Alt');
  }

  parts.push(shortcut.key.charAt(0).toUpperCase() + shortcut.key.slice(1));

  return parts.join('+');
}
