'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmailSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    email_smtp_host: '',
    email_smtp_port: '587',
    email_smtp_username: '',
    email_smtp_password: '',
    email_from_address: '',
    email_from_name: '',
    email_enable_notifications: 'true',
    email_enable_order_confirmations: 'true',
    email_enable_shipping_updates: 'true',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings?category=email');
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
        body: JSON.stringify({ settings, category: 'email' }),
      });

      if (response.ok) {
        toast.success('Email settings saved successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally{
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
        <h1 className="text-3xl font-bold">Email Settings</h1>
        <p className="text-gray-600 mt-2">Configure SMTP and email notifications</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SMTP Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>SMTP Configuration</CardTitle>
            <CardDescription>Configure your email server settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email_smtp_host">SMTP Host</Label>
              <Input
                id="email_smtp_host"
                name="email_smtp_host"
                value={settings.email_smtp_host}
                onChange={handleChange}
                placeholder="smtp.gmail.com"
              />
            </div>

            <div>
              <Label htmlFor="email_smtp_port">SMTP Port</Label>
              <Input
                id="email_smtp_port"
                name="email_smtp_port"
                value={settings.email_smtp_port}
                onChange={handleChange}
                placeholder="587"
              />
              <p className="text-sm text-gray-500 mt-1">Common ports: 587 (TLS), 465 (SSL), 25 (unencrypted)</p>
            </div>

            <div>
              <Label htmlFor="email_smtp_username">SMTP Username</Label>
              <Input
                id="email_smtp_username"
                name="email_smtp_username"
                value={settings.email_smtp_username}
                onChange={handleChange}
                placeholder="your-email@gmail.com"
              />
            </div>

            <div>
              <Label htmlFor="email_smtp_password">SMTP Password</Label>
              <Input
                id="email_smtp_password"
                name="email_smtp_password"
                type="password"
                value={settings.email_smtp_password}
                onChange={handleChange}
                placeholder="••••••••"
              />
              <p className="text-sm text-gray-500 mt-1">For Gmail, use an App Password</p>
            </div>
          </CardContent>
        </Card>

        {/* From Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Sender Information</CardTitle>
            <CardDescription>Email address and name that will appear as sender</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email_from_address">From Email Address</Label>
              <Input
                id="email_from_address"
                name="email_from_address"
                type="email"
                value={settings.email_from_address}
                onChange={handleChange}
                placeholder="noreply@yourstore.com"
              />
            </div>

            <div>
              <Label htmlFor="email_from_name">From Name</Label>
              <Input
                id="email_from_name"
                name="email_from_name"
                value={settings.email_from_name}
                onChange={handleChange}
                placeholder="YourStore Team"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Enable or disable email notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email_enable_notifications">Enable Email Notifications</Label>
                <p className="text-sm text-gray-500">Send all automated emails</p>
              </div>
              <select
                id="email_enable_notifications"
                name="email_enable_notifications"
                value={settings.email_enable_notifications}
                onChange={handleChange}
                className="px-3 py-2 border rounded-md"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email_enable_order_confirmations">Order Confirmations</Label>
                <p className="text-sm text-gray-500">Send emails when orders are placed</p>
              </div>
              <select
                id="email_enable_order_confirmations"
                name="email_enable_order_confirmations"
                value={settings.email_enable_order_confirmations}
                onChange={handleChange}
                className="px-3 py-2 border rounded-md"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email_enable_shipping_updates">Shipping Updates</Label>
                <p className="text-sm text-gray-500">Send emails when order status changes</p>
              </div>
              <select
                id="email_enable_shipping_updates"
                name="email_enable_shipping_updates"
                value={settings.email_enable_shipping_updates}
                onChange={handleChange}
                className="px-3 py-2 border rounded-md"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
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
