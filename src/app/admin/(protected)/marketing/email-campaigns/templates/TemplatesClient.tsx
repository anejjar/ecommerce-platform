'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, Eye, Edit, Trash2, Loader2, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { FeatureCheck } from '@/components/admin/email/FeatureCheck';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  category?: string;
  subject: string;
  htmlContent: string;
  usageCount: number;
  createdAt: string;
}

const PRE_BUILT_TEMPLATES = [
  {
    name: 'Welcome Email',
    category: 'transactional',
    subject: 'Welcome to {{store_name}}!',
    description: 'Welcome new customers to your store',
    htmlContent: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
    <h1 style="color: white; margin: 0;">Welcome to Our Store!</h1>
  </div>
  <div style="padding: 40px; background: #f8f9fa;">
    <h2>Hi {{customer_name}},</h2>
    <p style="font-size: 16px; line-height: 1.6;">
      Thank you for joining our community! We're thrilled to have you here.
    </p>
    <p style="font-size: 16px; line-height: 1.6;">
      As a welcome gift, here's a special discount code just for you:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
        WELCOME10
      </div>
      <p style="margin-top: 10px; color: #666;">10% off your first order</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{shop_url}}" style="background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Start Shopping
      </a>
    </div>
    <p style="color: #666; font-size: 14px;">
      If you have any questions, feel free to reach out to our support team.
    </p>
  </div>
  <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
    <p>© {{year}} {{store_name}}. All rights reserved.</p>
  </div>
</div>`,
  },
  {
    name: 'Order Confirmation',
    category: 'transactional',
    subject: 'Order Confirmation - #{{order_number}}',
    description: 'Confirm customer orders with details',
    htmlContent: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #2563eb; padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
  </div>
  <div style="padding: 40px;">
    <p style="font-size: 16px;">Hi {{customer_name}},</p>
    <p style="font-size: 16px; line-height: 1.6;">
      Thank you for your order! We've received your order and it's being processed.
    </p>
    <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
      <h3 style="margin-top: 0;">Order #{{order_number}}</h3>
      <p><strong>Order Date:</strong> {{order_date}}</p>
      <p><strong>Total:</strong> $ {{order_total}}</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{order_url}}" style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
        View Order Details
      </a>
    </div>
  </div>
  <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
    <p>© {{year}} {{store_name}}</p>
  </div>
</div>`,
  },
  {
    name: 'Newsletter',
    category: 'newsletter',
    subject: '{{month}} Newsletter - New Products & Updates',
    description: 'Monthly newsletter template',
    htmlContent: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #10b981; padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0;">{{month}} Newsletter</h1>
    <p style="color: white; opacity: 0.9;">Catch up on what's new!</p>
  </div>
  <div style="padding: 40px;">
    <h2>What's New This Month</h2>
    <p style="font-size: 16px; line-height: 1.6;">
      We've been busy! Here's what's happening at {{store_name}}.
    </p>

    <div style="margin: 30px 0;">
      <h3>New Products</h3>
      <p>Check out our latest additions to the store...</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="{{shop_url}}" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Shop New Arrivals
        </a>
      </div>
    </div>

    <div style="margin: 30px 0;">
      <h3>Featured Blog Post</h3>
      <p>Read our latest article: {{blog_title}}</p>
      <a href="{{blog_url}}" style="color: #10b981;">Read More →</a>
    </div>
  </div>
  <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
    <p>© {{year}} {{store_name}}</p>
    <a href="{{unsubscribe_url}}" style="color: #999;">Unsubscribe</a>
  </div>
</div>`,
  },
  {
    name: 'Promotional Sale',
    category: 'promotional',
    subject: '🎉 {{sale_name}} - Up to {{discount}}% Off!',
    description: 'Promotional sale announcement',
    htmlContent: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 50px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 36px;">{{sale_name}}</h1>
    <p style="color: white; font-size: 24px; margin: 10px 0;">Up to {{discount}}% OFF</p>
    <p style="color: white; opacity: 0.9;">Limited Time Only!</p>
  </div>
  <div style="padding: 40px; text-align: center;">
    <h2>Don't Miss Out!</h2>
    <p style="font-size: 18px; line-height: 1.6;">
      Our biggest sale of the season is here. Shop now before it's gone!
    </p>
    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; text-align: left;">
      <strong>Sale Ends:</strong> {{sale_end_date}}
    </div>
    <div style="margin: 30px 0;">
      <a href="{{shop_url}}" style="background: #f5576c; color: white; padding: 18px 50px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 18px; font-weight: bold;">
        Shop Now
      </a>
    </div>
    <p style="color: #666; font-size: 14px;">
      Use code <strong>{{coupon_code}}</strong> at checkout
    </p>
  </div>
  <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
    <p>© {{year}} {{store_name}}</p>
  </div>
</div>`,
  },
];

// Replace template variables with sample data for preview
const replaceTemplateVariables = (html: string) => {
  const sampleData: Record<string, string> = {
    store_name: 'My Store',
    customer_name: 'John Doe',
    order_number: 'ORD-12345',
    order_date: new Date().toLocaleDateString(),
    order_total: '149.99',
    order_url: '#',
    shop_url: '#',
    year: new Date().getFullYear().toString(),
    month: new Date().toLocaleDateString('en-US', { month: 'long' }),
    blog_title: 'How to Choose the Perfect Product',
    blog_url: '#',
    sale_name: 'Summer Sale',
    discount: '50',
    sale_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    coupon_code: 'SAVE50',
    unsubscribe_url: '#',
  };

  let result = html;
  Object.entries(sampleData).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  });
  return result;
};

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/email-templates');
      if (!response.ok) throw new Error('Failed to fetch templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (template: any) => {
    try {
      const response = await fetch('/api/admin/email-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });

      if (!response.ok) throw new Error('Failed to create template');

      toast.success('Template created successfully');
      fetchTemplates();
    } catch (error) {
      toast.error('Failed to create template');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const response = await fetch(`/api/admin/email-templates/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete template');

      toast.success('Template deleted');
      fetchTemplates();
    } catch (error) {
      toast.error('Failed to delete template');
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/marketing/email-campaigns">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
              <p className="text-muted-foreground mt-1">
                Pre-designed templates for your email campaigns
              </p>
            </div>
          </div>
        </div>

      {/* Pre-built Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Pre-built Templates</CardTitle>
          <CardDescription>
            Start with these professional templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PRE_BUILT_TEMPLATES.map((template, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-white opacity-80" />
                </div>
                <CardHeader>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setPreviewTemplate(template);
                        setPreviewOpen(true);
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleCreateTemplate(template)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Use
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Saved Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Your Templates ({templates.length})</CardTitle>
          <CardDescription>Manage your saved email templates</CardDescription>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No templates yet</p>
              <p className="text-sm">Create a template from the pre-built options above</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        {template.category && (
                          <Badge variant="outline" className="mt-2">
                            {template.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {template.description || template.subject}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span>Used {template.usageCount} times</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setPreviewTemplate(template);
                          setPreviewOpen(true);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(template.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
            <DialogDescription>{previewTemplate?.subject}</DialogDescription>
          </DialogHeader>
          <div className="border rounded-lg p-4 bg-white">
            <div dangerouslySetInnerHTML={{ __html: replaceTemplateVariables(previewTemplate?.htmlContent || '') }} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </FeatureCheck>
  );
}
