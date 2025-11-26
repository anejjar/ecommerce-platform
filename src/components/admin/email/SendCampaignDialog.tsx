'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Send, TestTube } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SendCampaignDialogProps {
  campaignId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function SendCampaignDialog({ campaignId, open, onOpenChange, onSuccess }: SendCampaignDialogProps) {
  const [sending, setSending] = useState(false);
  const [sendMode, setSendMode] = useState<'all' | 'test' | 'custom'>('all');
  const [testEmail, setTestEmail] = useState('');
  const [customEmails, setCustomEmails] = useState('');

  const handleSend = async () => {
    setSending(true);

    try {
      const body: any = {};

      if (sendMode === 'test') {
        if (!testEmail) {
          toast.error('Please enter a test email address');
          setSending(false);
          return;
        }
        body.testEmail = testEmail;
      } else if (sendMode === 'all') {
        // Send to all newsletter subscribers
        body.sendToAll = true;
      } else if (sendMode === 'custom') {
        if (!customEmails) {
          toast.error('Please enter at least one email address');
          setSending(false);
          return;
        }
        // Split by comma or newline and trim
        const emails = customEmails
          .split(/[,\n]/)
          .map(e => e.trim())
          .filter(e => e.length > 0);

        if (emails.length === 0) {
          toast.error('Please enter valid email addresses');
          setSending(false);
          return;
        }

        body.recipientEmails = emails;
      }

      const response = await fetch(`/api/admin/email-campaigns/${campaignId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send campaign');
      }

      const result = await response.json();

      if (sendMode === 'test') {
        toast.success(`Test email sent to ${testEmail}`);
      } else {
        toast.success(result.message || 'Campaign sent successfully');
      }

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setSendMode('all');
    setTestEmail('');
    setCustomEmails('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Campaign</DialogTitle>
          <DialogDescription>
            Choose how you want to send this email campaign
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup value={sendMode} onValueChange={(value: any) => setSendMode(value)}>
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="flex-1 cursor-pointer">
                <div className="font-medium">Send to All Subscribers</div>
                <div className="text-sm text-muted-foreground">
                  Send to all active newsletter subscribers
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="test" id="test" />
              <Label htmlFor="test" className="flex-1 cursor-pointer">
                <div className="font-medium">Send Test Email</div>
                <div className="text-sm text-muted-foreground">
                  Send a test to verify design and content
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="flex-1 cursor-pointer">
                <div className="font-medium">Custom Recipient List</div>
                <div className="text-sm text-muted-foreground">
                  Send to specific email addresses
                </div>
              </Label>
            </div>
          </RadioGroup>

          {sendMode === 'test' && (
            <div>
              <Label htmlFor="testEmail">Test Email Address</Label>
              <Input
                id="testEmail"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="your-email@example.com"
              />
            </div>
          )}

          {sendMode === 'custom' && (
            <div>
              <Label htmlFor="customEmails">Email Addresses</Label>
              <Textarea
                id="customEmails"
                value={customEmails}
                onChange={(e) => setCustomEmails(e.target.value)}
                placeholder="email1@example.com, email2@example.com&#10;or one per line"
                rows={5}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter email addresses separated by commas or new lines
              </p>
            </div>
          )}

          {sendMode === 'all' && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Note:</strong> This will send the campaign to all active newsletter subscribers.
                This action cannot be undone.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending}>
            {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {sendMode === 'test' ? (
              <>
                <TestTube className="mr-2 h-4 w-4" />
                Send Test
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Campaign
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
