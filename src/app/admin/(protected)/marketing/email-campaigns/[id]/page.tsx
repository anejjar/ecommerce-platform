'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Send, Edit, Trash2, Mail, Eye, MousePointer } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { SendCampaignDialog } from '@/components/admin/email/SendCampaignDialog';
import { FeatureCheck } from '@/components/admin/email/FeatureCheck';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  preheader?: string;
  type: string;
  status: string;
  htmlContent: string;
  textContent?: string;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  totalUnsubscribed: number;
  recipientCount: number;
  createdAt: string;
  scheduledAt?: string;
  sentAt?: string;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
  recipients?: Array<{
    id: string;
    email: string;
    name?: string;
    sent: boolean;
    sentAt?: string;
    opened: boolean;
    openedAt?: string;
    clicked: boolean;
    clickedAt?: string;
    bounced: boolean;
  }>;
}

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchCampaign();
    }
  }, [params.id]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/admin/email-campaigns/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch campaign');
      const data = await response.json();
      setCampaign(data);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      toast.error('Failed to load campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const response = await fetch(`/api/admin/email-campaigns/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete campaign');

      toast.success('Campaign deleted');
      router.push('/admin/marketing/email-campaigns');
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

  const getOpenRate = () => {
    if (!campaign || campaign.totalSent === 0) return 0;
    return Math.round((campaign.totalOpened / campaign.totalSent) * 100);
  };

  const getClickRate = () => {
    if (!campaign || campaign.totalSent === 0) return 0;
    return Math.round((campaign.totalClicked / campaign.totalSent) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Campaign not found</p>
        <Link href="/admin/marketing/email-campaigns">
          <Button className="mt-4">Back to Campaigns</Button>
        </Link>
      </div>
    );
  }

  return (
    <FeatureCheck featureName="email_campaigns">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/marketing/email-campaigns">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
              {getStatusBadge(campaign.status)}
            </div>
            <p className="text-muted-foreground mt-1">{campaign.subject}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {campaign.status === 'DRAFT' && (
            <>
              <Link href={`/admin/marketing/email-campaigns/${campaign.id}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button onClick={() => setSendDialogOpen(true)}>
                <Send className="h-4 w-4 mr-2" />
                Send Campaign
              </Button>
            </>
          )}
          {campaign.status !== 'SENT' && campaign.status !== 'SENDING' && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.totalSent.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Opens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.totalOpened.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{getOpenRate()}% rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MousePointer className="h-4 w-4" />
              Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.totalClicked.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{getClickRate()}% rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bounced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.totalBounced}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unsubscribed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.totalUnsubscribed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Type</div>
              <div className="mt-1">
                <Badge variant="outline">{campaign.type.replace(/_/g, ' ')}</Badge>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Subject Line</div>
              <div className="mt-1">{campaign.subject}</div>
            </div>
            {campaign.preheader && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Preheader</div>
                <div className="mt-1 text-sm">{campaign.preheader}</div>
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-muted-foreground">From</div>
              <div className="mt-1">
                {campaign.fromName || 'Store'} &lt;{campaign.fromEmail || 'store@example.com'}&gt;
              </div>
            </div>
            {campaign.replyTo && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Reply To</div>
                <div className="mt-1">{campaign.replyTo}</div>
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-muted-foreground">Created</div>
              <div className="mt-1">{new Date(campaign.createdAt).toLocaleString()}</div>
            </div>
            {campaign.sentAt && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Sent</div>
                <div className="mt-1">{new Date(campaign.sentAt).toLocaleString()}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-muted/50 max-h-96 overflow-auto">
              <div dangerouslySetInnerHTML={{ __html: campaign.htmlContent }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recipients */}
      {campaign.recipients && campaign.recipients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recipients ({campaign.recipients.length})</CardTitle>
            <CardDescription>Recipient engagement details</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Opened</TableHead>
                  <TableHead>Clicked</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaign.recipients.slice(0, 100).map((recipient) => (
                  <TableRow key={recipient.id}>
                    <TableCell className="font-medium">{recipient.email}</TableCell>
                    <TableCell>
                      {recipient.sent ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-600">
                          Sent
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {recipient.opened ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {recipient.clicked ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {recipient.bounced && (
                        <Badge variant="outline" className="bg-red-500/10 text-red-600">
                          Bounced
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {campaign.recipients.length > 100 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Showing first 100 recipients
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <SendCampaignDialog
        campaignId={campaign.id}
        open={sendDialogOpen}
        onOpenChange={setSendDialogOpen}
        onSuccess={fetchCampaign}
      />
    </div>
    </FeatureCheck>
  );
}
