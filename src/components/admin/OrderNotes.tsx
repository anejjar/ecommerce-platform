'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, MessageSquare } from 'lucide-react';

interface OrderNote {
  id: string;
  note: string;
  isInternal: boolean;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
}

interface OrderNotesProps {
  orderId: string;
}

export function OrderNotes({ orderId }: OrderNotesProps) {
  const [notes, setNotes] = useState<OrderNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isInternal, setIsInternal] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [orderId]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/notes`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Failed to fetch notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note: newNote,
          isInternal,
        }),
      });

      if (response.ok) {
        const note = await response.json();
        setNotes([note, ...notes]);
        setNewNote('');
      } else {
        alert('Failed to add note');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(`/api/orders/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotes(notes.filter((note) => note.id !== noteId));
      } else {
        alert('Failed to delete note');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Order Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Note Form */}
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note about this order..."
            className="w-full px-3 py-2 border rounded-md min-h-[80px] resize-y"
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                disabled={isSubmitting}
              />
              <span>Internal note (not visible to customer)</span>
            </label>
            <Button
              onClick={handleAddNote}
              disabled={isSubmitting || !newNote.trim()}
            >
              {isSubmitting ? 'Adding...' : 'Add Note'}
            </Button>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-3">
          {isLoading ? (
            <p className="text-gray-500 text-center py-4">Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No notes yet</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className={`p-4 rounded-lg border ${
                  note.isInternal
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">
                        {note.user.name || note.user.email}
                      </span>
                      {note.isInternal && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                          Internal
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{note.note}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
