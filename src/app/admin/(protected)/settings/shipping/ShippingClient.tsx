'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShippingSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    shipping_free_threshold: '50',
    shipping_flat_rate: '10',
    shipping_enable_free: 'true',
    shipping_enable_flat_rate: 'true',
    tax_rate_default: '10',
    tax_enable: 'true',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings?category=shipping');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        body: JSON.stringify({ settings, category: 'shipping' }),
      });

      if (response.ok) {
        toast.success('Shipping settings saved successfully');
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
        <h1 className="text-3xl font-bold">Shipping & Tax Settings</h1>
        <p className="text-gray-600 mt-2">Configure shipping rates and tax settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Free Shipping */}
        <Card>
          <CardHeader>
            <CardTitle>Free Shipping</CardTitle>
            <CardDescription>Offer free shipping based on order value</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="shipping_enable_free">Enable Free Shipping</Label>
                <p className="text-sm text-gray-500">Offer free shipping to customers</p>
              </div>
              <select
                id="shipping_enable_free"
                name="shipping_enable_free"
                value={settings.shipping_enable_free}
                onChange={handleChange}
                className="px-3 py-2 border rounded-md"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            {settings.shipping_enable_free === 'true' && (
              <div>
                <Label htmlFor="shipping_free_threshold">Free Shipping Threshold</Label>
                <Input
                  id="shipping_free_threshold"
                  name="shipping_free_threshold"
                  type="number"
                  step="0.01"
                  value={settings.shipping_free_threshold}
                  onChange={handleChange}
                  placeholder="50.00"
                />
                <p className="text-sm text-gray-500 mt-1">Orders above this amount get free shipping</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Flat Rate Shipping */}
        <Card>
          <CardHeader>
            <CardTitle>Flat Rate Shipping</CardTitle>
            <CardDescription>Charge a fixed amount for all orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="shipping_enable_flat_rate">Enable Flat Rate</Label>
                <p className="text-sm text-gray-500">Charge flat rate for shipping</p>
              </div>
              <select
                id="shipping_enable_flat_rate"
                name="shipping_enable_flat_rate"
                value={settings.shipping_enable_flat_rate}
                onChange={handleChange}
                className="px-3 py-2 border rounded-md"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            {settings.shipping_enable_flat_rate === 'true' && (
              <div>
                <Label htmlFor="shipping_flat_rate">Flat Rate Amount</Label>
                <Input
                  id="shipping_flat_rate"
                  name="shipping_flat_rate"
                  type="number"
                  step="0.01"
                  value={settings.shipping_flat_rate}
                  onChange={handleChange}
                  placeholder="10.00"
                />
                <p className="text-sm text-gray-500 mt-1">Fixed shipping cost for orders below free shipping threshold</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tax Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Tax Settings</CardTitle>
            <CardDescription>Configure tax rates for orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="tax_enable">Enable Tax</Label>
                <p className="text-sm text-gray-500">Apply tax to orders</p>
              </div>
              <select
                id="tax_enable"
                name="tax_enable"
                value={settings.tax_enable}
                onChange={handleChange}
                className="px-3 py-2 border rounded-md"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            {settings.tax_enable === 'true' && (
              <div>
                <Label htmlFor="tax_rate_default">Default Tax Rate (%)</Label>
                <Input
                  id="tax_rate_default"
                  name="tax_rate_default"
                  type="number"
                  step="0.01"
                  value={settings.tax_rate_default}
                  onChange={handleChange}
                  placeholder="10"
                />
                <p className="text-sm text-gray-500 mt-1">Tax percentage applied to orders</p>
              </div>
            )}
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
