'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SocialMediaSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    social_facebook_url: '',
    social_twitter_url: '',
    social_instagram_url: '',
    social_linkedin_url: '',
    social_youtube_url: '',
    social_pinterest_url: '',
    social_tiktok_url: '',
    social_facebook_pixel_id: '',
    social_facebook_page_id: '',
    social_instagram_feed_token: '',
    social_twitter_widget_id: '',
    social_share_image: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings?category=social');
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
        body: JSON.stringify({ settings, category: 'social' }),
      });

      if (response.ok) {
        toast.success('Social media settings saved successfully');
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
        <h1 className="text-3xl font-bold">Social Media Settings</h1>
        <p className="text-gray-600 mt-2">Manage your social media presence and integrations</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Social Media Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Profiles</CardTitle>
            <CardDescription>Add links to your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="social_facebook_url" className="flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                Facebook Page URL
              </Label>
              <Input
                id="social_facebook_url"
                name="social_facebook_url"
                type="url"
                value={settings.social_facebook_url}
                onChange={handleChange}
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div>
              <Label htmlFor="social_twitter_url" className="flex items-center gap-2">
                <Twitter className="w-4 h-4" />
                Twitter/X Profile URL
              </Label>
              <Input
                id="social_twitter_url"
                name="social_twitter_url"
                type="url"
                value={settings.social_twitter_url}
                onChange={handleChange}
                placeholder="https://twitter.com/yourprofile"
              />
            </div>

            <div>
              <Label htmlFor="social_instagram_url" className="flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Instagram Profile URL
              </Label>
              <Input
                id="social_instagram_url"
                name="social_instagram_url"
                type="url"
                value={settings.social_instagram_url}
                onChange={handleChange}
                placeholder="https://instagram.com/yourprofile"
              />
            </div>

            <div>
              <Label htmlFor="social_linkedin_url" className="flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                LinkedIn Profile URL
              </Label>
              <Input
                id="social_linkedin_url"
                name="social_linkedin_url"
                type="url"
                value={settings.social_linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>

            <div>
              <Label htmlFor="social_youtube_url" className="flex items-center gap-2">
                <Youtube className="w-4 h-4" />
                YouTube Channel URL
              </Label>
              <Input
                id="social_youtube_url"
                name="social_youtube_url"
                type="url"
                value={settings.social_youtube_url}
                onChange={handleChange}
                placeholder="https://youtube.com/c/yourchannel"
              />
            </div>

            <div>
              <Label htmlFor="social_pinterest_url">Pinterest Profile URL</Label>
              <Input
                id="social_pinterest_url"
                name="social_pinterest_url"
                type="url"
                value={settings.social_pinterest_url}
                onChange={handleChange}
                placeholder="https://pinterest.com/yourprofile"
              />
            </div>

            <div>
              <Label htmlFor="social_tiktok_url">TikTok Profile URL</Label>
              <Input
                id="social_tiktok_url"
                name="social_tiktok_url"
                type="url"
                value={settings.social_tiktok_url}
                onChange={handleChange}
                placeholder="https://tiktok.com/@yourprofile"
              />
            </div>
          </CardContent>
        </Card>

        {/* Facebook Integration */}
        <Card>
          <CardHeader>
            <CardTitle>Facebook Integration</CardTitle>
            <CardDescription>Configure Facebook Pixel and page integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="social_facebook_pixel_id">Facebook Pixel ID</Label>
              <Input
                id="social_facebook_pixel_id"
                name="social_facebook_pixel_id"
                value={settings.social_facebook_pixel_id}
                onChange={handleChange}
                placeholder="123456789012345"
              />
              <p className="text-sm text-gray-500 mt-1">Used for tracking conversions and retargeting</p>
            </div>

            <div>
              <Label htmlFor="social_facebook_page_id">Facebook Page ID</Label>
              <Input
                id="social_facebook_page_id"
                name="social_facebook_page_id"
                value={settings.social_facebook_page_id}
                onChange={handleChange}
                placeholder="123456789012345"
              />
              <p className="text-sm text-gray-500 mt-1">Your Facebook business page ID</p>
            </div>
          </CardContent>
        </Card>

        {/* Instagram Integration */}
        <Card>
          <CardHeader>
            <CardTitle>Instagram Integration</CardTitle>
            <CardDescription>Display Instagram feed on your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="social_instagram_feed_token">Instagram Access Token</Label>
              <Textarea
                id="social_instagram_feed_token"
                name="social_instagram_feed_token"
                value={settings.social_instagram_feed_token}
                onChange={handleChange}
                rows={3}
                placeholder="Your Instagram API access token"
              />
              <p className="text-sm text-gray-500 mt-1">Required to display Instagram feed on your site</p>
            </div>
          </CardContent>
        </Card>

        {/* Twitter Integration */}
        <Card>
          <CardHeader>
            <CardTitle>Twitter Integration</CardTitle>
            <CardDescription>Embed Twitter timeline widget</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="social_twitter_widget_id">Twitter Widget ID</Label>
              <Input
                id="social_twitter_widget_id"
                name="social_twitter_widget_id"
                value={settings.social_twitter_widget_id}
                onChange={handleChange}
                placeholder="123456789012345678"
              />
              <p className="text-sm text-gray-500 mt-1">Get this from Twitter's widget configuration</p>
            </div>
          </CardContent>
        </Card>

        {/* Social Sharing */}
        <Card>
          <CardHeader>
            <CardTitle>Social Sharing</CardTitle>
            <CardDescription>Default image for social media sharing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="social_share_image">Default Share Image URL</Label>
              <Input
                id="social_share_image"
                name="social_share_image"
                type="url"
                value={settings.social_share_image}
                onChange={handleChange}
                placeholder="https://yourstore.com/images/share-image.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">Image shown when your store is shared on social media (1200x630px recommended)</p>
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
