'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Upload, FileJson } from 'lucide-react';
import toast from 'react-hot-toast';

interface ThemeImporterProps {
  onImport: (file: File) => Promise<void>;
}

export function ThemeImporter({ onImport }: ThemeImporterProps) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/json' && !selectedFile.name.endsWith('.json')) {
        toast.error('Please select a JSON file');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    try {
      setUploading(true);
      await onImport(file);
      toast.success('Theme imported successfully');
      setOpen(false);
      setFile(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to import theme');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Import Theme
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Theme</DialogTitle>
          <DialogDescription>
            Upload a theme JSON file to import it into your store.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <FileJson className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <label htmlFor="theme-file" className="cursor-pointer">
              <input
                id="theme-file"
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button variant="outline" asChild>
                <span>Choose File</span>
              </Button>
            </label>
            {file && (
              <p className="mt-4 text-sm text-muted-foreground">
                Selected: {file.name}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!file || uploading}>
            {uploading ? 'Importing...' : 'Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

