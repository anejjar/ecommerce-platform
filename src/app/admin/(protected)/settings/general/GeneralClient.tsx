'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    general_store_name: '',
    general_store_tagline: '',
    general_store_email: '',
    general_store_phone: '',
    general_store_address: '',
    general_currency: 'USD',
    general_currency_symbol: '$',
    general_timezone: 'America/New_York',
    general_date_format: 'MM/DD/YYYY',
    general_time_format: '12h',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings?category=general');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        body: JSON.stringify({ settings, category: 'general' }),
      });

      if (response.ok) {
        toast.success('General settings saved successfully');
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
        <h1 className="text-3xl font-bold">General Settings</h1>
        <p className="text-gray-600 mt-2">Manage your store's general information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Basic details about your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="general_store_name">Store Name</Label>
              <Input
                id="general_store_name"
                name="general_store_name"
                value={settings.general_store_name}
                onChange={handleChange}
                placeholder="My E-Commerce Store"
              />
            </div>

            <div>
              <Label htmlFor="general_store_tagline">Store Tagline</Label>
              <Input
                id="general_store_tagline"
                name="general_store_tagline"
                value={settings.general_store_tagline}
                onChange={handleChange}
                placeholder="Quality products at great prices"
              />
            </div>

            <div>
              <Label htmlFor="general_store_email">Contact Email</Label>
              <Input
                id="general_store_email"
                name="general_store_email"
                type="email"
                value={settings.general_store_email}
                onChange={handleChange}
                placeholder="contact@yourstore.com"
              />
            </div>

            <div>
              <Label htmlFor="general_store_phone">Phone Number</Label>
              <Input
                id="general_store_phone"
                name="general_store_phone"
                type="tel"
                value={settings.general_store_phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <Label htmlFor="general_store_address">Store Address</Label>
              <Textarea
                id="general_store_address"
                name="general_store_address"
                value={settings.general_store_address}
                onChange={handleChange}
                rows={3}
                placeholder="123 Main St, City, State 12345"
              />
            </div>
          </CardContent>
        </Card>

        {/* Regional Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Regional Settings</CardTitle>
            <CardDescription>Currency, timezone, and format preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="general_currency">Currency</Label>
                <select
                  id="general_currency"
                  name="general_currency"
                  value={settings.general_currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="MAD">MAD - Moroccan Dirham</option>
                </select>
              </div>

              <div>
                <Label htmlFor="general_currency_symbol">Currency Symbol</Label>
                <Input
                  id="general_currency_symbol"
                  name="general_currency_symbol"
                  value={settings.general_currency_symbol}
                  onChange={handleChange}
                  placeholder="$"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="general_timezone">Timezone</Label>
              <select
                id="general_timezone"
                name="general_timezone"
                value={settings.general_timezone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="general_date_format">Date Format</Label>
                <select
                  id="general_date_format"
                  name="general_date_format"
                  value={settings.general_date_format}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <Label htmlFor="general_time_format">Time Format</Label>
                <select
                  id="general_time_format"
                  name="general_time_format"
                  value={settings.general_time_format}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="12h">12-hour (AM/PM)</option>
                  <option value="24h">24-hour</option>
                </select>
              </div>
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
