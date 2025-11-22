'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Plus, Download, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TranslationsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (selectedLanguage) {
      fetchTranslations(selectedLanguage);
    }
  }, [selectedLanguage]);

  const fetchLanguages = async () => {
    try {
      const response = await fetch('/api/translations');
      if (response.ok) {
        const data = await response.json();
        setLanguages(data.languages || []);
        if (data.languages?.length > 0 && !selectedLanguage) {
          setSelectedLanguage(data.languages[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };

  const fetchTranslations = async (locale: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/translations?locale=${locale}`);
      if (response.ok) {
        const data = await response.json();
        setTranslations(data.translations || {});
      }
    } catch (error) {
      console.error('Error fetching translations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslationChange = (key: string, value: string) => {
    setTranslations({
      ...translations,
      [key]: value,
    });
  };

  const handleAddTranslation = () => {
    if (newKey && newValue) {
      setTranslations({
        ...translations,
        [newKey]: newValue,
      });
      setNewKey('');
      setNewValue('');
    }
  };

  const handleDeleteTranslation = (key: string) => {
    const updated = { ...translations };
    delete updated[key];
    setTranslations(updated);
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch('/api/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale: selectedLanguage,
          translations,
        }),
      });

      if (response.ok) {
        toast.success('Translations saved successfully');
      } else {
        toast.error('Failed to save translations');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(translations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedLanguage}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          setTranslations(imported);
          toast.success('Translations imported successfully');
        } catch (error) {
          toast.error('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Translation Management</h1>
        <p className="text-gray-600 mt-2">Manage translations for all languages</p>
      </div>

      {/* Language Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Language</CardTitle>
          <CardDescription>Choose a language to edit its translations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {languages.map((lang) => (
              <Button
                key={lang}
                variant={selectedLanguage === lang ? 'default' : 'outline'}
                onClick={() => setSelectedLanguage(lang)}
              >
                {lang.toUpperCase()}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Translations
            </>
          )}
        </Button>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" onClick={() => document.getElementById('import-file')?.click()}>
          <Upload className="w-4 h-4 mr-2" />
          Import
          <input
            id="import-file"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
        </Button>
      </div>

      {/* Add New Translation */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Translation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Translation key (e.g., homepage.title)"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder="Translation value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
            </div>
            <Button onClick={handleAddTranslation}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Translations List */}
      <Card>
        <CardHeader>
          <CardTitle>Translations ({Object.keys(translations).length})</CardTitle>
          <CardDescription>Edit existing translations for {selectedLanguage.toUpperCase()}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : Object.keys(translations).length === 0 ? (
            <p className="text-center text-gray-500 py-8">No translations found</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Object.entries(translations).map(([key, value]) => (
                <div key={key} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Label className="text-xs text-gray-500">{key}</Label>
                    <Input
                      value={typeof value === 'string' ? value : JSON.stringify(value)}
                      onChange={(e) => handleTranslationChange(key, e.target.value)}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteTranslation(key)}
                    className="mt-5"
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
