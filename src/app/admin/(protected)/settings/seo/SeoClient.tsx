'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SEOSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    seo_meta_title: '',
    seo_meta_description: '',
    seo_meta_keywords: '',
    seo_og_title: '',
    seo_og_description: '',
    seo_og_image: '',
    seo_twitter_handle: '',
    seo_google_analytics_id: '',
    seo_google_search_console_id: '',
    seo_robots_txt: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings?category=seo');
      if (response.ok) {
        const data = await response.json();
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ settings, category: 'seo' }),
      });

      if (response.ok) {
        toast.success('SEO settings saved successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SEO Settings</h1>
        <p className="text-gray-600 mt-2">Manage search engine optimization settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Meta Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Meta Tags</CardTitle>
            <CardDescription>Default meta tags for your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="seo_meta_title">Meta Title</Label>
              <Input
                id="seo_meta_title"
                name="seo_meta_title"
                value={settings.seo_meta_title}
                onChange={handleChange}
                placeholder="E-Commerce Platform - Shop Quality Products Online"
              />
              <p className="text-sm text-gray-500 mt-1">Default title for pages (50-60 characters recommended)</p>
            </div>

            <div>
              <Label htmlFor="seo_meta_description">Meta Description</Label>
              <Textarea
                id="seo_meta_description"
                name="seo_meta_description"
                value={settings.seo_meta_description}
                onChange={handleChange}
                rows={3}
                placeholder="Discover amazing products at great prices..."
              />
              <p className="text-sm text-gray-500 mt-1">Default description (150-160 characters recommended)</p>
            </div>

            <div>
              <Label htmlFor="seo_meta_keywords">Meta Keywords</Label>
              <Input
                id="seo_meta_keywords"
                name="seo_meta_keywords"
                value={settings.seo_meta_keywords}
                onChange={handleChange}
                placeholder="e-commerce, online shopping, products"
              />
              <p className="text-sm text-gray-500 mt-1">Comma-separated keywords</p>
            </div>
          </CardContent>
        </Card>

        {/* Open Graph */}
        <Card>
          <CardHeader>
            <CardTitle>Open Graph (Social Media)</CardTitle>
            <CardDescription>Settings for Facebook, LinkedIn, and other platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="seo_og_title">OG Title</Label>
              <Input
                id="seo_og_title"
                name="seo_og_title"
                value={settings.seo_og_title}
                onChange={handleChange}
                placeholder="E-Commerce Platform"
              />
            </div>

            <div>
              <Label htmlFor="seo_og_description">OG Description</Label>
              <Textarea
                id="seo_og_description"
                name="seo_og_description"
                value={settings.seo_og_description}
                onChange={handleChange}
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="seo_og_image">OG Image URL</Label>
              <Input
                id="seo_og_image"
                name="seo_og_image"
                value={settings.seo_og_image}
                onChange={handleChange}
                placeholder="https://yourstore.com/og-image.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">Image shown when sharing on social media (1200x630px recommended)</p>
            </div>

            <div>
              <Label htmlFor="seo_twitter_handle">Twitter Handle</Label>
              <Input
                id="seo_twitter_handle"
                name="seo_twitter_handle"
                value={settings.seo_twitter_handle}
                onChange={handleChange}
                placeholder="@yourstore"
              />
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics & Tracking</CardTitle>
            <CardDescription>Integration IDs for analytics platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="seo_google_analytics_id">Google Analytics ID</Label>
              <Input
                id="seo_google_analytics_id"
                name="seo_google_analytics_id"
                value={settings.seo_google_analytics_id}
                onChange={handleChange}
                placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
              />
            </div>

            <div>
              <Label htmlFor="seo_google_search_console_id">Google Search Console Verification Code</Label>
              <Input
                id="seo_google_search_console_id"
                name="seo_google_search_console_id"
                value={settings.seo_google_search_console_id}
                onChange={handleChange}
                placeholder="verification code"
              />
            </div>
          </CardContent>
        </Card>

        {/* Robots.txt */}
        <Card>
          <CardHeader>
            <CardTitle>Robots.txt Configuration</CardTitle>
            <CardDescription>Control which pages search engines can crawl</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="seo_robots_txt">Custom Robots.txt Rules</Label>
              <Textarea
                id="seo_robots_txt"
                name="seo_robots_txt"
                value={settings.seo_robots_txt}
                onChange={handleChange}
                rows={10}
                placeholder={`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /account/`}
                className="font-mono text-sm"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter valid robots.txt rules. These will override the default rules.
                Leave empty to use defaults.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="lg">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
