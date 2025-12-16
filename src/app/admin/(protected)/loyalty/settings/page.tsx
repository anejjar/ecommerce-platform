'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import toast from 'react-hot-toast';
import { Loader2, Save, Settings } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

interface LoyaltySettings {
  id: string;
  pointsPerDollar: number;
  pointsPerReview: number;
  pointsPerReferral: number;
  pointsPerSocialShare: number;
  redemptionRate: number;
  pointsExpirationDays: number;
  enableEmailNotifications: boolean;
  minimumRedemptionPoints: number;
}

export default function LoyaltySettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<LoyaltySettings | null>(null);
  const { symbol: currencySymbol } = useCurrency();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/loyalty/settings');

      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data = await response.json();
      setSettings(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      const response = await fetch('/api/admin/loyalty/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update settings');
      }

      toast({
        title: 'Success',
        description: 'Loyalty settings updated successfully',
      });

      await fetchSettings();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load loyalty settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center space-x-2">
          <Settings className="h-8 w-8" />
          <span>Loyalty Program Settings</span>
        </h1>
        <p className="mt-2 text-gray-600">
          Configure how customers earn and redeem loyalty points
        </p>
      </div>

      <div className="space-y-6">
        {/* Points Earning */}
        <Card>
          <CardHeader>
            <CardTitle>Points Earning</CardTitle>
            <CardDescription>Configure how customers earn points</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pointsPerDollar">Points per {currencySymbol}1 Spent</Label>
                <Input
                  id="pointsPerDollar"
                  type="number"
                  min="0"
                  step="0.1"
                  value={settings.pointsPerDollar}
                  onChange={(e) =>
                    setSettings({ ...settings, pointsPerDollar: parseFloat(e.target.value) || 0 })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Base points earned per {currencySymbol}1 spent (before tier multipliers)
                </p>
              </div>

              <div>
                <Label htmlFor="pointsPerReview">Points per Product Review</Label>
                <Input
                  id="pointsPerReview"
                  type="number"
                  min="0"
                  value={settings.pointsPerReview}
                  onChange={(e) =>
                    setSettings({ ...settings, pointsPerReview: parseInt(e.target.value) || 0 })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Points awarded for writing a product review
                </p>
              </div>

              <div>
                <Label htmlFor="pointsPerReferral">Points per Referral</Label>
                <Input
                  id="pointsPerReferral"
                  type="number"
                  min="0"
                  value={settings.pointsPerReferral}
                  onChange={(e) =>
                    setSettings({ ...settings, pointsPerReferral: parseInt(e.target.value) || 0 })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Points awarded when referred friend makes first purchase
                </p>
              </div>

              <div>
                <Label htmlFor="pointsPerSocialShare">Points per Social Share</Label>
                <Input
                  id="pointsPerSocialShare"
                  type="number"
                  min="0"
                  value={settings.pointsPerSocialShare}
                  onChange={(e) =>
                    setSettings({ ...settings, pointsPerSocialShare: parseInt(e.target.value) || 0 })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Points awarded for social media shares
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Points Redemption */}
        <Card>
          <CardHeader>
            <CardTitle>Points Redemption</CardTitle>
            <CardDescription>Configure how customers redeem points</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="redemptionRate">Redemption Rate (Points per {currencySymbol}1)</Label>
                <Input
                  id="redemptionRate"
                  type="number"
                  min="1"
                  value={settings.redemptionRate}
                  onChange={(e) =>
                    setSettings({ ...settings, redemptionRate: parseInt(e.target.value) || 100 })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  How many points equal {currencySymbol}1 discount (default: 100 points = {currencySymbol}1)
                </p>
              </div>

              <div>
                <Label htmlFor="minimumRedemptionPoints">Minimum Redemption Points</Label>
                <Input
                  id="minimumRedemptionPoints"
                  type="number"
                  min="1"
                  value={settings.minimumRedemptionPoints}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      minimumRedemptionPoints: parseInt(e.target.value) || 100,
                    })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum points required for redemption
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Points Expiration */}
        <Card>
          <CardHeader>
            <CardTitle>Points Expiration</CardTitle>
            <CardDescription>Configure when points expire</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="pointsExpirationDays">Points Expiration (Days)</Label>
              <Input
                id="pointsExpirationDays"
                type="number"
                min="1"
                value={settings.pointsExpirationDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    pointsExpirationDays: parseInt(e.target.value) || 365,
                  })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of days before earned points expire (default: 365 days)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure customer notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-gray-600">
                  Send emails for points earned, tier upgrades, and expiration warnings
                </p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.enableEmailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enableEmailNotifications: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
