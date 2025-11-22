'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';

interface FeatureFlag {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  enabled: boolean;
  category: string;
  tier: 'FREE' | 'PRO' | 'ENTERPRISE';
  createdAt: Date;
  updatedAt: Date;
}

export default function FeaturesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [features, setFeatures] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Redirect if not SUPERADMIN
  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user.role !== 'SUPERADMIN') {
      router.push('/admin/dashboard');
    }
  }, [session, status, router]);

  // Fetch features
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'SUPERADMIN') return;

    fetchFeatures();
  }, [session, status]);

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/features');
      if (!response.ok) throw new Error('Failed to fetch features');

      const data = await response.json();
      setFeatures(data);
    } catch (error) {
      console.error('Error fetching features:', error);
      toast.error('Failed to load features');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = async (featureId: string, currentState: boolean) => {
    setUpdating(featureId);
    try {
      const response = await fetch(`/api/features/${featureId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !currentState }),
      });

      if (!response.ok) throw new Error('Failed to update feature');

      const updatedFeature = await response.json();

      setFeatures((prev) =>
        prev.map((f) => (f.id === featureId ? updatedFeature : f))
      );

      toast.success(
        `${updatedFeature.displayName} ${updatedFeature.enabled ? 'enabled' : 'disabled'}`
      );
    } catch (error) {
      console.error('Error updating feature:', error);
      toast.error('Failed to update feature');
    } finally {
      setUpdating(null);
    }
  };

  // Group features by category
  const groupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, FeatureFlag[]>);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'FREE':
        return 'bg-gray-100 text-gray-800';
      case 'PRO':
        return 'bg-blue-100 text-blue-800';
      case 'ENTERPRISE':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      analytics: '📊',
      operations: '⚙️',
      marketing: '📢',
      financial: '💰',
      customer_experience: '👥',
    };
    return icons[category] || '🎯';
  };

  if (status === 'loading' || loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-96 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'SUPERADMIN') {
    return null;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Feature Management</h1>
        <p className="text-gray-600 mt-2">
          Control which premium features are enabled for your store. Toggle features on/off to activate or deactivate functionality.
        </p>
      </div>

      {features.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 mb-4">No features configured yet.</p>
            <p className="text-sm text-gray-400">
              Features will appear here once they are added to the database.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{getCategoryIcon(category)}</span>
                  <span className="capitalize">{category.replace(/_/g, ' ')}</span>
                  <Badge variant="outline" className="ml-2">
                    {categoryFeatures.length} {categoryFeatures.length === 1 ? 'feature' : 'features'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryFeatures.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold">{feature.displayName}</h3>
                          <Badge className={getTierColor(feature.tier)}>
                            {feature.tier}
                          </Badge>
                          {feature.enabled && (
                            <Badge className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                          )}
                        </div>
                        {feature.description && (
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          ID: {feature.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={feature.enabled}
                          onCheckedChange={() => toggleFeature(feature.id, feature.enabled)}
                          disabled={updating === feature.id}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">About Feature Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• <strong>FREE</strong>: Features available to all users</li>
            <li>• <strong>PRO</strong>: Premium features for paying customers</li>
            <li>• <strong>ENTERPRISE</strong>: Advanced features for enterprise plans</li>
            <li>• Features are completely hidden when disabled (no UI, no routes, no API access)</li>
            <li>• Changes take effect immediately after toggling</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
