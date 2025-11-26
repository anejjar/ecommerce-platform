'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { FeatureCheck } from '@/components/admin/email/FeatureCheck';

export default function EditCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    preheader: '',
    type: 'NEWSLETTER',
    htmlContent: '',
    textContent: '',
    fromName: '',
    fromEmail: '',
    replyTo: '',
  });

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

      if (data.status !== 'DRAFT') {
        toast.error('Only draft campaigns can be edited');
        router.push(`/admin/marketing/email-campaigns/${params.id}`);
        return;
      }

      setFormData({
        name: data.name,
        subject: data.subject,
        preheader: data.preheader || '',
        type: data.type,
        htmlContent: data.htmlContent,
        textContent: data.textContent || '',
        fromName: data.fromName || '',
        fromEmail: data.fromEmail || '',
        replyTo: data.replyTo || '',
      });
    } catch (error) {
      console.error('Error fetching campaign:', error);
      toast.error('Failed to load campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/email-campaigns/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update campaign');
      }

      toast.success('Campaign updated successfully');
      router.push(`/admin/marketing/email-campaigns/${params.id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <FeatureCheck featureName="email_campaigns">
      <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/marketing/email-campaigns/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Campaign</h1>
          <p className="text-muted-foreground mt-1">Update your email campaign details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Basic information about your campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Monthly Newsletter - January 2025"
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Campaign Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEWSLETTER">Newsletter</SelectItem>
                  <SelectItem value="PROMOTIONAL">Promotional</SelectItem>
                  <SelectItem value="TRANSACTIONAL">Transactional</SelectItem>
                  <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
                  <SelectItem value="CUSTOM">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Check out our new products!"
                required
              />
            </div>

            <div>
              <Label htmlFor="preheader">Preheader Text (Optional)</Label>
              <Input
                id="preheader"
                value={formData.preheader}
                onChange={(e) => setFormData({ ...formData, preheader: e.target.value })}
                placeholder="Preview text that appears in inbox..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                This text appears after the subject line in many email clients
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Content</CardTitle>
            <CardDescription>Design your email content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="htmlContent">HTML Content</Label>
              <Textarea
                id="htmlContent"
                value={formData.htmlContent}
                onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                placeholder="<h1>Hello!</h1><p>Your email content here...</p>"
                rows={12}
                required
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Full HTML content of your email
              </p>
            </div>

            <div>
              <Label htmlFor="textContent">Plain Text Version (Optional)</Label>
              <Textarea
                id="textContent"
                value={formData.textContent}
                onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                placeholder="Plain text version for email clients that don't support HTML"
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sender Information</CardTitle>
            <CardDescription>Configure who the email is from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="fromName">From Name</Label>
                <Input
                  id="fromName"
                  value={formData.fromName}
                  onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                  placeholder="Your Store"
                />
              </div>

              <div>
                <Label htmlFor="fromEmail">From Email</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={formData.fromEmail}
                  onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                  placeholder="hello@yourstore.com"
                />
              </div>

              <div>
                <Label htmlFor="replyTo">Reply To</Label>
                <Input
                  id="replyTo"
                  type="email"
                  value={formData.replyTo}
                  onChange={(e) => setFormData({ ...formData, replyTo: e.target.value })}
                  placeholder="support@yourstore.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Link href={`/admin/marketing/email-campaigns/${params.id}`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
    </FeatureCheck>
  );
}
