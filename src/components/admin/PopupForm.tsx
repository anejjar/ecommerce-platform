'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Eye } from 'lucide-react';

interface PopupFormProps {
  mode: 'create' | 'edit';
  popup?: any;
}

export function PopupForm({ mode, popup }: PopupFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: popup?.name || '',
    title: popup?.title || '',
    content: popup?.content || '',
    type: popup?.type || 'EXIT_INTENT',
    triggerValue: popup?.triggerValue || 5,
    target: popup?.target || 'ALL_PAGES',
    customUrls: popup?.customUrls || '',
    position: popup?.position || 'CENTER',
    width: popup?.width || 500,
    height: popup?.height || null,
    backgroundColor: popup?.backgroundColor || '#ffffff',
    textColor: popup?.textColor || '#000000',
    buttonText: popup?.buttonText || 'Get Offer',
    buttonColor: popup?.buttonColor || '#000000',
    buttonTextColor: popup?.buttonTextColor || '#ffffff',
    showCloseButton: popup?.showCloseButton !== undefined ? popup.showCloseButton : true,
    overlayColor: popup?.overlayColor || 'rgba(0,0,0,0.5)',
    imageUrl: popup?.imageUrl || '',
    frequency: popup?.frequency || 'once_per_session',
    delaySeconds: popup?.delaySeconds || 0,
    ctaType: popup?.ctaType || 'link',
    ctaUrl: popup?.ctaUrl || '',
    discountCode: popup?.discountCode || '',
    isActive: popup?.isActive || false,
    startDate: popup?.startDate || '',
    endDate: popup?.endDate || '',
    priority: popup?.priority || 0,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.content) {
      toast.error('Name and content are required');
      return;
    }

    setLoading(true);

    try {
      const url = mode === 'create'
        ? '/api/admin/popups'
        : `/api/admin/popups/${popup.id}`;

      const method = mode === 'create' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save popup');

      const data = await response.json();
      toast.success(mode === 'create' ? 'Popup created successfully' : 'Popup updated successfully');

      router.push('/admin/popups');
      router.refresh();
    } catch (error) {
      console.error('Error saving popup:', error);
      toast.error('Failed to save popup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1" />
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
        >
          <Eye className="w-4 h-4 mr-2" />
          {showPreview ? 'Hide' : 'Preview'}
        </Button>
        <Button type="submit" disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : mode === 'create' ? 'Create Popup' : 'Update Popup'}
        </Button>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="trigger">Trigger</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="cta">Call-to-Action</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* BASIC TAB */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Popup Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Welcome Discount Popup"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Internal name for identification (not shown to customers)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Popup Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g., Get 15% Off Your First Order!"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">
                  Content <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Enter your popup content (HTML supported)"
                  rows={8}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  HTML is supported. Keep it concise and compelling.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TRIGGER TAB */}
        <TabsContent value="trigger">
          <Card>
            <CardHeader>
              <CardTitle>Trigger Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Trigger Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXIT_INTENT">Exit Intent</SelectItem>
                    <SelectItem value="TIMED">Timed (After X seconds)</SelectItem>
                    <SelectItem value="SCROLL_BASED">Scroll Based (At X%)</SelectItem>
                    <SelectItem value="PAGE_LOAD">Page Load</SelectItem>
                    <SelectItem value="CLICK_TRIGGER">Click Trigger</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.type === 'TIMED' || formData.type === 'SCROLL_BASED') && (
                <div className="space-y-2">
                  <Label htmlFor="triggerValue">
                    {formData.type === 'TIMED' ? 'Seconds' : 'Scroll Percentage'}
                  </Label>
                  <Input
                    id="triggerValue"
                    type="number"
                    value={formData.triggerValue}
                    onChange={(e) => handleChange('triggerValue', parseInt(e.target.value))}
                    min={1}
                    max={formData.type === 'SCROLL_BASED' ? 100 : 300}
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData.type === 'TIMED'
                      ? 'Show popup after this many seconds'
                      : 'Show popup when user scrolls to this percentage'}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="target">Target Pages</Label>
                <Select value={formData.target} onValueChange={(value) => handleChange('target', value)}>
                  <SelectTrigger id="target">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL_PAGES">All Pages</SelectItem>
                    <SelectItem value="HOMEPAGE">Homepage Only</SelectItem>
                    <SelectItem value="PRODUCT_PAGES">Product Pages</SelectItem>
                    <SelectItem value="CART_PAGE">Cart Page</SelectItem>
                    <SelectItem value="CHECKOUT">Checkout</SelectItem>
                    <SelectItem value="BLOG">Blog Pages</SelectItem>
                    <SelectItem value="CUSTOM_URL">Custom URLs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.target === 'CUSTOM_URL' && (
                <div className="space-y-2">
                  <Label htmlFor="customUrls">Custom URLs (one per line)</Label>
                  <Textarea
                    id="customUrls"
                    value={formData.customUrls}
                    onChange={(e) => handleChange('customUrls', e.target.value)}
                    placeholder="/about&#10;/contact&#10;/products/special"
                    rows={4}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="frequency">Display Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value) => handleChange('frequency', value)}>
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once_per_session">Once Per Session</SelectItem>
                    <SelectItem value="once_per_day">Once Per Day</SelectItem>
                    <SelectItem value="once_per_week">Once Per Week</SelectItem>
                    <SelectItem value="always">Always Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delaySeconds">Initial Delay (seconds)</Label>
                <Input
                  id="delaySeconds"
                  type="number"
                  value={formData.delaySeconds}
                  onChange={(e) => handleChange('delaySeconds', parseInt(e.target.value))}
                  min={0}
                  max={60}
                />
                <p className="text-sm text-muted-foreground">
                  Wait this many seconds after page load before allowing popup to trigger
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DESIGN TAB */}
        <TabsContent value="design">
          <Card>
            <CardHeader>
              <CardTitle>Design & Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select value={formData.position} onValueChange={(value) => handleChange('position', value)}>
                  <SelectTrigger id="position">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CENTER">Center</SelectItem>
                    <SelectItem value="TOP">Top Bar</SelectItem>
                    <SelectItem value="BOTTOM">Bottom Bar</SelectItem>
                    <SelectItem value="TOP_LEFT">Top Left</SelectItem>
                    <SelectItem value="TOP_RIGHT">Top Right</SelectItem>
                    <SelectItem value="BOTTOM_LEFT">Bottom Left</SelectItem>
                    <SelectItem value="BOTTOM_RIGHT">Bottom Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={formData.width}
                    onChange={(e) => handleChange('width', parseInt(e.target.value))}
                    min={200}
                    max={1200}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Height (px, optional)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height || ''}
                    onChange={(e) => handleChange('height', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="Auto"
                    min={200}
                    max={800}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={formData.backgroundColor}
                      onChange={(e) => handleChange('backgroundColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.backgroundColor}
                      onChange={(e) => handleChange('backgroundColor', e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={formData.textColor}
                      onChange={(e) => handleChange('textColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.textColor}
                      onChange={(e) => handleChange('textColor', e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="overlayColor">Overlay Color</Label>
                <Input
                  id="overlayColor"
                  value={formData.overlayColor}
                  onChange={(e) => handleChange('overlayColor', e.target.value)}
                  placeholder="rgba(0,0,0,0.5)"
                />
                <p className="text-sm text-muted-foreground">
                  Background overlay color (supports rgba for transparency)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="showCloseButton"
                  checked={formData.showCloseButton}
                  onCheckedChange={(checked) => handleChange('showCloseButton', checked)}
                />
                <Label htmlFor="showCloseButton">Show Close Button</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CTA TAB */}
        <TabsContent value="cta">
          <Card>
            <CardHeader>
              <CardTitle>Call-to-Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={formData.buttonText}
                  onChange={(e) => handleChange('buttonText', e.target.value)}
                  placeholder="Get Offer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buttonColor">Button Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="buttonColor"
                      type="color"
                      value={formData.buttonColor}
                      onChange={(e) => handleChange('buttonColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.buttonColor}
                      onChange={(e) => handleChange('buttonColor', e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buttonTextColor">Button Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="buttonTextColor"
                      type="color"
                      value={formData.buttonTextColor}
                      onChange={(e) => handleChange('buttonTextColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.buttonTextColor}
                      onChange={(e) => handleChange('buttonTextColor', e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaType">CTA Type</Label>
                <Select value={formData.ctaType} onValueChange={(value) => handleChange('ctaType', value)}>
                  <SelectTrigger id="ctaType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="link">Link/URL</SelectItem>
                    <SelectItem value="email_capture">Email Capture</SelectItem>
                    <SelectItem value="discount_code">Show Discount Code</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.ctaType === 'link' && (
                <div className="space-y-2">
                  <Label htmlFor="ctaUrl">Button URL</Label>
                  <Input
                    id="ctaUrl"
                    type="url"
                    value={formData.ctaUrl}
                    onChange={(e) => handleChange('ctaUrl', e.target.value)}
                    placeholder="https://example.com/offer"
                  />
                </div>
              )}

              {formData.ctaType === 'discount_code' && (
                <div className="space-y-2">
                  <Label htmlFor="discountCode">Discount Code</Label>
                  <Input
                    id="discountCode"
                    value={formData.discountCode}
                    onChange={(e) => handleChange('discountCode', e.target.value)}
                    placeholder="WELCOME15"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ADVANCED TAB */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleChange('isActive', checked)}
                />
                <Label htmlFor="isActive">Active</Label>
                <p className="text-sm text-muted-foreground ml-2">
                  {formData.isActive ? 'Popup is currently active' : 'Popup is currently inactive'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date (Optional)</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', parseInt(e.target.value))}
                  min={0}
                  max={100}
                />
                <p className="text-sm text-muted-foreground">
                  If multiple popups match, higher priority shows first (0-100)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: formData.overlayColor }}
          onClick={() => setShowPreview(false)}
        >
          <Card
            className="relative shadow-2xl"
            style={{
              width: `${formData.width}px`,
              height: formData.height ? `${formData.height}px` : 'auto',
              backgroundColor: formData.backgroundColor,
              color: formData.textColor,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {formData.showCloseButton && (
              <button
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                onClick={() => setShowPreview(false)}
              >
                ×
              </button>
            )}
            <CardContent className="p-6 space-y-4">
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Popup"
                  className="w-full h-auto rounded"
                />
              )}
              {formData.title && (
                <h2 className="text-2xl font-bold">{formData.title}</h2>
              )}
              <div dangerouslySetInnerHTML={{ __html: formData.content }} />
              <Button
                type="button"
                style={{
                  backgroundColor: formData.buttonColor,
                  color: formData.buttonTextColor,
                }}
                className="w-full"
              >
                {formData.buttonText}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </form>
  );
}
