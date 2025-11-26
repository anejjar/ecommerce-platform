'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateCampaignDialog({ open, onOpenChange, onSuccess }: CreateCampaignDialogProps) {
  const [creating, setCreating] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await fetch('/api/admin/email-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create campaign');
      }

      toast.success('Campaign created successfully');
      onSuccess();
      resetForm();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setFormData({
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Create a new email marketing campaign. You can edit the content and design later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
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

            <div>
              <Label htmlFor="htmlContent">Email Content (HTML)</Label>
              <Textarea
                id="htmlContent"
                value={formData.htmlContent}
                onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                placeholder="<h1>Hello!</h1><p>Your email content here...</p>"
                rows={8}
                required
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can use our template builder later for easier editing
              </p>
            </div>

            <div>
              <Label htmlFor="textContent">Plain Text Version (Optional)</Label>
              <Textarea
                id="textContent"
                value={formData.textContent}
                onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                placeholder="Plain text version for email clients that don't support HTML"
                rows={4}
              />
            </div>

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
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Campaign
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
