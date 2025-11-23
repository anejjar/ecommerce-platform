'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { Globe, Check, AlertCircle, Loader2 } from 'lucide-react';
import { locales } from '@/i18n';

interface CategoryTranslation {
  id?: string;
  locale: string;
  name: string;
  description: string;
  slug: string;
}

interface CategoryTranslationManagerProps {
  categoryId: string;
  categoryName: string;
}

export function CategoryTranslationManager({
  categoryId,
  categoryName
}: CategoryTranslationManagerProps) {
  const [translations, setTranslations] = useState<CategoryTranslation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [activeLocale, setActiveLocale] = useState(locales[1] || 'fr');

  useEffect(() => {
    fetchTranslations();
  }, [categoryId]);

  const fetchTranslations = async () => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}/translations`);
      if (response.ok) {
        const data = await response.json();
        setTranslations(data.translations || []);
      }
    } catch (error) {
      console.error('Failed to fetch translations:', error);
      toast.error('Failed to load translations');
    } finally {
      setIsLoading(false);
    }
  };

  const getTranslation = (locale: string): CategoryTranslation => {
    const existing = translations.find(t => t.locale === locale);
    if (existing) return existing;

    return {
      locale,
      name: '',
      description: '',
      slug: '',
    };
  };

  const updateTranslation = (locale: string, field: keyof CategoryTranslation, value: string) => {
    const translation = getTranslation(locale);
    const updated = { ...translation, [field]: value };

    const index = translations.findIndex(t => t.locale === locale);
    if (index >= 0) {
      const newTranslations = [...translations];
      newTranslations[index] = updated;
      setTranslations(newTranslations);
    } else {
      setTranslations([...translations, updated]);
    }
  };

  const saveTranslation = async (locale: string) => {
    const translation = getTranslation(locale);

    if (!translation.name || !translation.slug) {
      toast.error('Name and slug are required');
      return;
    }

    setIsSaving(locale);
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}/translations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(translation),
      });

      if (response.ok) {
        toast.success(`Translation saved for ${locale.toUpperCase()}`);
        await fetchTranslations();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to save translation');
      }
    } catch (error) {
      console.error('Failed to save translation:', error);
      toast.error('Failed to save translation');
    } finally {
      setIsSaving(null);
    }
  };

  const deleteTranslation = async (locale: string) => {
    if (!confirm(`Delete ${locale.toUpperCase()} translation?`)) return;

    try {
      const response = await fetch(
        `/api/admin/categories/${categoryId}/translations/${locale}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        toast.success(`Translation deleted for ${locale.toUpperCase()}`);
        setTranslations(translations.filter(t => t.locale !== locale));
      } else {
        toast.error('Failed to delete translation');
      }
    } catch (error) {
      console.error('Failed to delete translation:', error);
      toast.error('Failed to delete translation');
    }
  };

  const generateSlug = (locale: string, name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    updateTranslation(locale, 'slug', slug);
  };

  const getTranslationStatus = (locale: string): 'complete' | 'partial' | 'missing' => {
    const translation = translations.find(t => t.locale === locale);
    if (!translation || !translation.id) return 'missing';
    if (translation.name && translation.slug) return 'complete';
    return 'partial';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Translations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const translationLocales = locales.filter(locale => locale !== 'en');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Translations
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Manage translations for "{categoryName}"
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeLocale} onValueChange={(value) => setActiveLocale(value as typeof activeLocale)}>
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${translationLocales.length}, 1fr)` }}>
            {translationLocales.map(locale => {
              const status = getTranslationStatus(locale);
              return (
                <TabsTrigger key={locale} value={locale} className="relative">
                  {locale.toUpperCase()}
                  {status === 'complete' && (
                    <Check className="h-3 w-3 text-green-500 absolute top-1 right-1" />
                  )}
                  {status === 'partial' && (
                    <AlertCircle className="h-3 w-3 text-yellow-500 absolute top-1 right-1" />
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {translationLocales.map(locale => {
            const translation = getTranslation(locale);
            const status = getTranslationStatus(locale);

            return (
              <TabsContent key={locale} value={locale} className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <Badge variant={
                    status === 'complete' ? 'default' :
                    status === 'partial' ? 'secondary' : 'outline'
                  }>
                    {status === 'complete' && 'Complete'}
                    {status === 'partial' && 'Partial'}
                    {status === 'missing' && 'Not Translated'}
                  </Badge>
                  {translation.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTranslation(locale)}
                    >
                      Delete
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`name-${locale}`}>
                    Category Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`name-${locale}`}
                    value={translation.name}
                    onChange={(e) => updateTranslation(locale, 'name', e.target.value)}
                    placeholder="Translated category name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`slug-${locale}`}>
                    Slug <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={`slug-${locale}`}
                      value={translation.slug}
                      onChange={(e) => updateTranslation(locale, 'slug', e.target.value)}
                      placeholder="category-slug"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => generateSlug(locale, translation.name)}
                      disabled={!translation.name}
                    >
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${locale}`}>Description</Label>
                  <Textarea
                    id={`description-${locale}`}
                    value={translation.description}
                    onChange={(e) => updateTranslation(locale, 'description', e.target.value)}
                    placeholder="Translated category description"
                    rows={4}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => saveTranslation(locale)}
                    disabled={isSaving === locale || !translation.name || !translation.slug}
                  >
                    {isSaving === locale ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Translation'
                    )}
                  </Button>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}
