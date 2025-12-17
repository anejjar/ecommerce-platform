'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Send, Eye, BarChart3, Trash2, Play, Pause, Loader2, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { CreateCampaignDialog } from '@/components/admin/email/CreateCampaignDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  type: string;
  status: string;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  recipientCount: number;
  createdAt: string;
  scheduledAt?: string;
  sentAt?: string;
}

export default function EmailCampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [featureEnabled, setFeatureEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    checkFeature();
  }, []);

  const checkFeature = async () => {
    try {
      const response = await fetch('/api/features/check?feature=email_campaigns');
      const data = await response.json();

      if (!data.enabled) {
        setFeatureEnabled(false);
        setLoading(false);
        return;
      }

      setFeatureEnabled(true);
      fetchCampaigns();
    } catch (error) {
      console.error('Error checking feature:', error);
      setFeatureEnabled(false);
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/admin/email-campaigns');
      if (!response.ok) throw new Error('Failed to fetch campaigns');
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const response = await fetch(`/api/admin/email-campaigns/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete campaign');

      toast.success('Campaign deleted');
      fetchCampaigns();
    } catch (error) {
      toast.error('Failed to delete campaign');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      DRAFT: { className: 'bg-gray-500/10 text-gray-600 border-gray-200', label: 'Draft' },
      SCHEDULED: { className: 'bg-blue-500/10 text-blue-600 border-blue-200', label: 'Scheduled' },
      SENDING: { className: 'bg-yellow-500/10 text-yellow-600 border-yellow-200', label: 'Sending' },
      SENT: { className: 'bg-green-500/10 text-green-600 border-green-200', label: 'Sent' },
      PAUSED: { className: 'bg-orange-500/10 text-orange-600 border-orange-200', label: 'Paused' },
      CANCELLED: { className: 'bg-red-500/10 text-red-600 border-red-200', label: 'Cancelled' },
    };

    const variant = variants[status] || variants.DRAFT;

    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  const getOpenRate = (campaign: Campaign) => {
    if (campaign.totalSent === 0) return '0%';
    return `${Math.round((campaign.totalOpened / campaign.totalSent) * 100)}%`;
  };

  const getClickRate = (campaign: Campaign) => {
    if (campaign.totalSent === 0) return '0%';
    return `${Math.round((campaign.totalClicked / campaign.totalSent) * 100)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (featureEnabled === false) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Campaigns</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage email marketing campaigns
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Lock className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Feature Not Enabled</h3>
            <p className="text-muted-foreground text-center mb-4">
              Email Campaign Builder is a PRO feature that needs to be enabled by a super admin.
            </p>
            <Link href="/admin/features">
              <Button>
                Go to Feature Management
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Campaigns</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage email marketing campaigns
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/marketing/email-campaigns/templates">
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Templates
            </Button>
          </Link>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((sum, c) => sum + c.totalSent, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Open Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.length > 0
                ? `${Math.round(
                    campaigns.reduce((sum, c) => {
                      const rate = c.totalSent > 0 ? (c.totalOpened / c.totalSent) * 100 : 0;
                      return sum + rate;
                    }, 0) / campaigns.length
                  )}%`
                : '0%'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Click Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.length > 0
                ? `${Math.round(
                    campaigns.reduce((sum, c) => {
                      const rate = c.totalSent > 0 ? (c.totalClicked / c.totalSent) * 100 : 0;
                      return sum + rate;
                    }, 0) / campaigns.length
                  )}%`
                : '0%'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>Manage your email marketing campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No campaigns found</p>
              <p className="text-sm">Create your first campaign to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Open Rate</TableHead>
                  <TableHead>Click Rate</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {campaign.subject}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{campaign.type.replace(/_/g, ' ')}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell>{campaign.totalSent.toLocaleString()}</TableCell>
                    <TableCell>{getOpenRate(campaign)}</TableCell>
                    <TableCell>{getClickRate(campaign)}</TableCell>
                    <TableCell>
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/marketing/email-campaigns/${campaign.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {campaign.status === 'DRAFT' && (
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/marketing/email-campaigns/${campaign.id}/edit`}>
                                Edit
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDelete(campaign.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreateCampaignDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          fetchCampaigns();
          setDialogOpen(false);
        }}
      />
    </div>
  );
}
