'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Palette } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { ThemeConfig } from '@/lib/themes/theme-schema';
import { CompactColorPicker } from '@/components/ui/color-picker';

export default function AppearanceSettingsPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTheme, setActiveTheme] = useState<ThemeConfig | null>(null);
  const [themeId, setThemeId] = useState<string | null>(null);
  const [isBuiltIn, setIsBuiltIn] = useState(false);
  const [creatingCustom, setCreatingCustom] = useState(false);
  const [colors, setColors] = useState({
    primary: '#111827',
    secondary: '#6b7280',
    accent: '#3b82f6',
    background: '#ffffff',
    surface: '#f9fafb',
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    border: '#e5e7eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  });

  useEffect(() => {
    if (status === 'authenticated') {
      fetchActiveTheme();
    }
  }, [status]);

  const fetchActiveTheme = async () => {
    try {
      setLoading(true);
      // Get active theme
      const themeResponse = await fetch('/api/themes/active');
      if (themeResponse.ok) {
        const themeData = await themeResponse.json();
        if (themeData.theme) {
          setActiveTheme(themeData.theme);
          setColors({
            primary: themeData.theme.colors?.primary || '#111827',
            secondary: themeData.theme.colors?.secondary || '#6b7280',
            accent: themeData.theme.colors?.accent || '#3b82f6',
            background: themeData.theme.colors?.background || '#ffffff',
            surface: themeData.theme.colors?.surface || '#f9fafb',
            textPrimary: themeData.theme.colors?.text?.primary || '#111827',
            textSecondary: themeData.theme.colors?.text?.secondary || '#6b7280',
            textMuted: themeData.theme.colors?.text?.muted || '#9ca3af',
            border: themeData.theme.colors?.border || '#e5e7eb',
            success: themeData.theme.colors?.success || '#10b981',
            warning: themeData.theme.colors?.warning || '#f59e0b',
            error: themeData.theme.colors?.error || '#ef4444',
            info: themeData.theme.colors?.info || '#3b82f6',
          });
        }
      }

      // Get theme ID from admin API
      const adminResponse = await fetch('/api/admin/themes');
      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        const activeThemeData = adminData.themes?.find((t: any) => t.isActive);
        if (activeThemeData) {
          setThemeId(activeThemeData.id);
          setIsBuiltIn(activeThemeData.isBuiltIn || false);
        }
      }
    } catch (error) {
      console.error('Error fetching theme:', error);
      toast.error('Failed to load theme');
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (key: string, value: string) => {
    setColors((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCreateCustomTheme = async () => {
    if (!themeId) {
      toast.error('No active theme found.');
      return;
    }

    setCreatingCustom(true);

    try {
      const response = await fetch(`/api/admin/themes/${themeId}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: `${activeTheme?.metadata?.displayName || 'Custom'} Theme`,
          activate: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create custom theme');
      }

      const { theme } = await response.json();
      
      toast.success('Custom theme created and activated! You can now customize colors.');
      
      // Refresh the page to load the new theme
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error('Error creating custom theme:', error);
      toast.error(error.message || 'Failed to create custom theme');
    } finally {
      setCreatingCustom(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!themeId) {
      toast.error('No active theme found. Please activate a theme first.');
      return;
    }

    if (isBuiltIn) {
      toast.error('Cannot edit built-in themes. Please create or activate a custom theme first.');
      return;
    }

    setSaving(true);

    try {
      // Get current theme config
      const themeResponse = await fetch(`/api/admin/themes/${themeId}`);
      if (!themeResponse.ok) {
        throw new Error('Failed to fetch theme');
      }

      const { theme } = await themeResponse.json();
      const currentConfig = theme.themeConfig || {};

      // Update colors in theme config
      const updatedConfig: ThemeConfig = {
        ...currentConfig,
        colors: {
          ...currentConfig.colors,
          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent,
          background: colors.background,
          surface: colors.surface,
          text: {
            primary: colors.textPrimary,
            secondary: colors.textSecondary,
            muted: colors.textMuted,
          },
          border: colors.border,
          success: colors.success,
          warning: colors.warning,
          error: colors.error,
          info: colors.info,
        },
      };

      // Update theme
      const updateResponse = await fetch(`/api/admin/themes/${themeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeConfig: updatedConfig,
        }),
      });

      if (!updateResponse.ok) {
        const error = await updateResponse.json();
        throw new Error(error.error || 'Failed to update theme');
      }

      toast.success('Color palette updated successfully');
      
      // Refresh theme
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error('Error updating colors:', error);
      toast.error(error.message || 'Failed to update color palette');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!themeId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Appearance Settings</h1>
          <p className="text-muted-foreground mt-2">Customize your storefront color palette</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Palette className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Theme</h3>
              <p className="text-muted-foreground mb-6">
                Please activate a theme first to customize colors.
              </p>
              <Button asChild>
                <a href="/admin/themes">Go to Themes</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Appearance Settings</h1>
        <p className="text-muted-foreground mt-2">
          Customize your storefront color palette. Changes will apply to the active theme.
        </p>
      </div>

      {isBuiltIn && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-amber-600 mt-0.5">⚠️</div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 mb-1">Built-in Theme</h3>
                <p className="text-sm text-amber-800 mb-4">
                  You're currently using a built-in theme. To customize colors, create a custom copy of this theme.
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCreateCustomTheme}
                    disabled={creatingCustom}
                  >
                    {creatingCustom ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Palette className="w-4 h-4 mr-2" />
                        Create Custom Theme
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href="/admin/themes">Go to Themes</a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Primary Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Primary Colors</CardTitle>
            <CardDescription>Main brand colors used throughout the storefront</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="primary">Primary Color</Label>
                <p className="text-sm text-muted-foreground">Main brand color for buttons and accents</p>
                <CompactColorPicker
                  value={colors.primary}
                  onChange={(value) => handleColorChange('primary', value)}
                  disabled={isBuiltIn}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary">Secondary Color</Label>
                <p className="text-sm text-muted-foreground">Secondary brand color</p>
                <CompactColorPicker
                  value={colors.secondary}
                  onChange={(value) => handleColorChange('secondary', value)}
                  disabled={isBuiltIn}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accent">Accent Color</Label>
                <p className="text-sm text-muted-foreground">Highlight and accent color</p>
                <CompactColorPicker
                  value={colors.accent}
                  onChange={(value) => handleColorChange('accent', value)}
                  disabled={isBuiltIn}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Background Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Background Colors</CardTitle>
            <CardDescription>Page and surface background colors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="background">Background Color</Label>
                <p className="text-sm text-muted-foreground">Main page background</p>
                <CompactColorPicker
                  value={colors.background}
                  onChange={(value) => handleColorChange('background', value)}
                  disabled={isBuiltIn}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="surface">Surface Color</Label>
                <p className="text-sm text-muted-foreground">Card and surface backgrounds</p>
                <CompactColorPicker
                  value={colors.surface}
                  onChange={(value) => handleColorChange('surface', value)}
                  disabled={isBuiltIn}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="border">Border Color</Label>
                <p className="text-sm text-muted-foreground">Border and divider color</p>
                <CompactColorPicker
                  value={colors.border}
                  onChange={(value) => handleColorChange('border', value)}
                  disabled={isBuiltIn}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Text Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Text Colors</CardTitle>
            <CardDescription>Typography and text color hierarchy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="textPrimary">Primary Text</Label>
                <p className="text-sm text-muted-foreground">Main text color</p>
                <CompactColorPicker
                  value={colors.textPrimary}
                  onChange={(value) => handleColorChange('textPrimary', value)}
                  disabled={isBuiltIn}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="textSecondary">Secondary Text</Label>
                <p className="text-sm text-muted-foreground">Secondary text color</p>
                <CompactColorPicker
                  value={colors.textSecondary}
                  onChange={(value) => handleColorChange('textSecondary', value)}
                  disabled={isBuiltIn}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="textMuted">Muted Text</Label>
                <p className="text-sm text-muted-foreground">Muted/disabled text color</p>
                <CompactColorPicker
                  value={colors.textMuted}
                  onChange={(value) => handleColorChange('textMuted', value)}
                  disabled={isBuiltIn}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Status Colors</CardTitle>
            <CardDescription>Colors for success, warning, error, and info states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="success">Success Color</Label>
                <CompactColorPicker
                  value={colors.success}
                  onChange={(value) => handleColorChange('success', value)}
                  disabled={isBuiltIn}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warning">Warning Color</Label>
                <CompactColorPicker
                  value={colors.warning}
                  onChange={(value) => handleColorChange('warning', value)}
                  disabled={isBuiltIn}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="error">Error Color</Label>
                <CompactColorPicker
                  value={colors.error}
                  onChange={(value) => handleColorChange('error', value)}
                  disabled={isBuiltIn}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="info">Info Color</Label>
                <CompactColorPicker
                  value={colors.info}
                  onChange={(value) => handleColorChange('info', value)}
                  disabled={isBuiltIn}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => fetchActiveTheme()}
            disabled={saving}
          >
            Reset
          </Button>
          <Button type="submit" disabled={saving || isBuiltIn}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

