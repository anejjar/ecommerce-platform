'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Lock } from 'lucide-react';
import Link from 'next/link';

interface FeatureCheckProps {
  featureName: string;
  children: React.ReactNode;
}

export function FeatureCheck({ featureName, children }: FeatureCheckProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    checkFeature();
  }, []);

  const checkFeature = async () => {
    try {
      const response = await fetch(`/api/features/check?feature=${featureName}`);
      const data = await response.json();

      setEnabled(data.enabled);
    } catch (error) {
      console.error('Error checking feature:', error);
      setEnabled(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!enabled) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Lock className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Feature Not Enabled</h3>
            <p className="text-muted-foreground text-center mb-4 max-w-md">
              This feature needs to be enabled by a super admin in the feature management page.
            </p>
            <div className="flex gap-2">
              <Link href="/admin/features">
                <Button>
                  Go to Feature Management
                </Button>
              </Link>
              <Link href="/admin/marketing/email-campaigns">
                <Button variant="outline">
                  Back to Campaigns
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
