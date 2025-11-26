'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, Bell, Mail, MessageSquare, Tag, Newspaper, Package } from 'lucide-react';

interface Preferences {
  emailMarketing: boolean;
  smsMarketing: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
  productUpdates: boolean;
}

const preferenceItems = [
  {
    key: 'orderUpdates' as keyof Preferences,
    label: 'Order Updates',
    description: 'Receive notifications about your order status and shipping updates',
    icon: Package,
    category: 'Essential',
    recommended: true,
  },
  {
    key: 'emailMarketing' as keyof Preferences,
    label: 'Email Marketing',
    description: 'Receive promotional emails about new products and special offers',
    icon: Mail,
    category: 'Marketing',
    recommended: false,
  },
  {
    key: 'smsMarketing' as keyof Preferences,
    label: 'SMS Marketing',
    description: 'Receive text messages about exclusive deals and flash sales',
    icon: MessageSquare,
    category: 'Marketing',
    recommended: false,
  },
  {
    key: 'promotions' as keyof Preferences,
    label: 'Promotions',
    description: 'Get notified about discounts, sales, and limited-time offers',
    icon: Tag,
    category: 'Marketing',
    recommended: false,
  },
  {
    key: 'newsletter' as keyof Preferences,
    label: 'Newsletter',
    description: 'Subscribe to our weekly newsletter with curated content and tips',
    icon: Newspaper,
    category: 'Content',
    recommended: false,
  },
  {
    key: 'productUpdates' as keyof Preferences,
    label: 'Product Updates',
    description: 'Learn about new product launches and feature announcements',
    icon: Bell,
    category: 'Content',
    recommended: false,
  },
];

export default function PreferencesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [preferences, setPreferences] = useState<Preferences>({
    emailMarketing: false,
    smsMarketing: false,
    orderUpdates: true,
    promotions: false,
    newsletter: false,
    productUpdates: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPreferences();
    }
  }, [status]);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/account/preferences');

      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }

      const data = await response.json();
      setPreferences(data.preferences);
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to load preferences');
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (key: keyof Preferences, checked: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: checked,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/account/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      toast.success('Preferences saved successfully!');
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to save preferences');
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(preferences).every((value) => value);
    const newPreferences = Object.keys(preferences).reduce(
      (acc, key) => ({
        ...acc,
        [key]: !allSelected,
      }),
      {} as Preferences
    );
    setPreferences(newPreferences);
    setHasChanges(true);
  };

  const groupedPreferences = preferenceItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof preferenceItems>);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Communication Preferences</h1>
        <p className="text-gray-600 mt-1">
          Manage how you want to hear from us
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Choose which communications you'd like to receive
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              type="button"
            >
              {Object.values(preferences).every((value) => value)
                ? 'Deselect All'
                : 'Select All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="space-y-6">
              {Object.entries(groupedPreferences).map(([category, items], categoryIndex) => (
                <div key={category}>
                  {categoryIndex > 0 && <Separator className="my-6" />}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">{category}</h3>
                  </div>
                  <div className="space-y-4">
                    {items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.key}
                          className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-shrink-0 mt-1">
                            <Icon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor={item.key}
                                className="text-base font-medium cursor-pointer"
                              >
                                {item.label}
                              </Label>
                              {item.recommended && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.description}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <Checkbox
                              id={item.key}
                              checked={preferences[item.key]}
                              onCheckedChange={(checked) =>
                                handlePreferenceChange(item.key, checked as boolean)
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <Separator className="my-6" />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">
                      About Your Privacy
                    </h4>
                    <p className="text-sm text-blue-800 mt-1">
                      We respect your privacy and will never share your information with
                      third parties. You can update these preferences at any time. Note
                      that order updates are recommended to stay informed about your
                      purchases.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={!hasChanges || saving}
                  className="w-full sm:w-auto"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Preferences'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={fetchPreferences}
                  disabled={!hasChanges || saving}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </div>

              {hasChanges && (
                <p className="text-sm text-amber-600">
                  You have unsaved changes. Click "Save Preferences" to apply them.
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Email:</span>{' '}
              {session?.user?.email || 'Not available'}
            </p>
            <p className="text-gray-600">
              Notifications will be sent to this email address. Update your email in
              account settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
