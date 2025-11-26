'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { Search, Filter, ChevronDown, ChevronRight, FileText, BookOpen } from 'lucide-react';
import { FeatureStats } from '@/components/admin/FeatureStats';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FeatureDocModal } from '@/components/admin/FeatureDocModal';
import { getFeatureDoc, FeatureDocumentation } from '@/lib/feature-docs';
import Link from 'next/link';

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
  const [selectedFeatureDoc, setSelectedFeatureDoc] = useState<FeatureDocumentation | null>(null);
  const [docModalOpen, setDocModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, ACTIVE, INACTIVE
  const [buildStatusFilter, setBuildStatusFilter] = useState('ALL'); // ALL, COMPLETED, PARTIAL, PENDING

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

  const handleViewDocs = (feature: FeatureFlag) => {
    const doc = getFeatureDoc(feature.name);
    if (doc) {
      setSelectedFeatureDoc(doc);
      setDocModalOpen(true);
    }
  };

  // Filter and Group features
  const filteredFeatures = useMemo(() => {
    return features.filter(feature => {
      const matchesSearch =
        feature.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && feature.enabled) ||
        (statusFilter === 'INACTIVE' && !feature.enabled);

      const featureDoc = getFeatureDoc(feature.name);
      const buildStatus = featureDoc?.status || 'pending';
      const matchesBuildStatus =
        buildStatusFilter === 'ALL' ||
        (buildStatusFilter === 'COMPLETED' && buildStatus === 'completed') ||
        (buildStatusFilter === 'PARTIAL' && buildStatus === 'partial') ||
        (buildStatusFilter === 'PENDING' && buildStatus === 'pending');

      return matchesSearch && matchesStatus && matchesBuildStatus;
    });
  }, [features, searchQuery, statusFilter, buildStatusFilter]);

  const groupedFeatures = useMemo(() => {
    return filteredFeatures.reduce((acc, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = [];
      }
      acc[feature.category].push(feature);
      return acc;
    }, {} as Record<string, FeatureFlag[]>);
  }, [filteredFeatures]);

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
      <div className="p-8 space-y-4">
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="h-12 bg-muted animate-pulse rounded-lg" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!session || session.user.role !== 'SUPERADMIN') return null;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feature Management</h1>
        <p className="text-muted-foreground mt-2">
          Control premium features, manage availability, and configure system capabilities.
        </p>
      </div>

      <FeatureStats features={features} />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={buildStatusFilter} onValueChange={setBuildStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Build Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Features</SelectItem>
              <SelectItem value="COMPLETED">Built ✓</SelectItem>
              <SelectItem value="PARTIAL">Partially Built</SelectItem>
              <SelectItem value="PENDING">Not Built Yet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {Object.keys(groupedFeatures).length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            No features found matching your filters.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
            <FeatureCategoryGroup
              key={category}
              category={category}
              features={categoryFeatures}
              getCategoryIcon={getCategoryIcon}
              toggleFeature={toggleFeature}
              onViewDocs={handleViewDocs}
              updating={updating}
            />
          ))}
        </div>
      )}

      <FeatureDocModal
        open={docModalOpen}
        onOpenChange={setDocModalOpen}
        feature={selectedFeatureDoc}
      />
    </div>
  );
}

function FeatureCategoryGroup({
  category,
  features,
  getCategoryIcon,
  toggleFeature,
  onViewDocs,
  updating
}: any) {
  const [isOpen, setIsOpen] = useState(true);

  const getBuildStatusBadge = (featureName: string) => {
    const featureDoc = getFeatureDoc(featureName);
    const buildStatus = featureDoc?.status || 'pending';

    if (buildStatus === 'completed') {
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900">
          Built ✓
        </Badge>
      );
    } else if (buildStatus === 'partial') {
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-900">
          Partially Built
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-200 dark:border-gray-700">
          Not Built Yet
        </Badge>
      );
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-semibold flex items-center gap-2 capitalize">
          <span>{getCategoryIcon(category)}</span>
          {category.replace(/_/g, ' ')}
          <Badge variant="secondary" className="ml-2 text-xs">
            {features.length}
          </Badge>
        </h2>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature: any) => (
            <Card key={feature.id} className={`transition-all hover:shadow-md ${feature.enabled ? 'border-primary/50 bg-primary/5' : 'opacity-80'}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <CardTitle className="text-base font-semibold leading-tight">
                      {feature.displayName}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1 font-mono">
                      {feature.name}
                    </CardDescription>
                  </div>
                  <Switch
                    checked={feature.enabled}
                    onCheckedChange={() => toggleFeature(feature.id, feature.enabled)}
                    disabled={updating === feature.id}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">
                  {feature.description || 'No description available.'}
                </p>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {feature.enabled && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-900">
                      Active
                    </Badge>
                  )}
                  {getBuildStatusBadge(feature.name)}
                </div>
                <div className="mt-3 flex gap-2">
                  <Link href={`/admin/features/docs/${feature.name}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                      View Docs
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDocs(feature)}
                    title="Quick view documentation"
                  >
                    <FileText className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
