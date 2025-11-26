'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Upload, Star } from 'lucide-react';
import { CheckoutSettings, TrustBadge, Testimonial } from '@/types/checkout-settings';
import { useState } from 'react';

interface Phase4TabProps {
  settings: CheckoutSettings;
  setSettings: (settings: CheckoutSettings) => void;
}

export function Phase4Tab({ settings, setSettings }: Phase4TabProps) {
  const [uploadingBadge, setUploadingBadge] = useState(false);
  const [uploadingTestimonial, setUploadingTestimonial] = useState(false);

  const addTrustBadge = () => {
    const newBadge: TrustBadge = {
      id: `badge_${Date.now()}`,
      url: '',
      alt: 'Trust Badge',
      position: 'footer',
    };
    setSettings({
      ...settings,
      trustBadges: [...(settings.trustBadges || []), newBadge],
    });
  };

  const updateTrustBadge = (id: string, updates: Partial<TrustBadge>) => {
    setSettings({
      ...settings,
      trustBadges: settings.trustBadges?.map((badge) =>
        badge.id === id ? { ...badge, ...updates } : badge
      ) || [],
    });
  };

  const deleteTrustBadge = (id: string) => {
    setSettings({
      ...settings,
      trustBadges: settings.trustBadges?.filter((badge) => badge.id !== id) || [],
    });
  };

  const handleBadgeUpload = async (id: string, file: File) => {
    setUploadingBadge(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'trust-badges');

    try {
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        updateTrustBadge(id, { url: data.url });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploadingBadge(false);
    }
  };

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: `testimonial_${Date.now()}`,
      name: '',
      text: '',
      rating: 5,
    };
    setSettings({
      ...settings,
      testimonials: [...(settings.testimonials || []), newTestimonial],
    });
  };

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    setSettings({
      ...settings,
      testimonials: settings.testimonials?.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ) || [],
    });
  };

  const deleteTestimonial = (id: string) => {
    setSettings({
      ...settings,
      testimonials: settings.testimonials?.filter((t) => t.id !== id) || [],
    });
  };

  const handleTestimonialImageUpload = async (id: string, file: File) => {
    setUploadingTestimonial(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'testimonials');

    try {
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        updateTestimonial(id, { image: data.url });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploadingTestimonial(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Trust Badges */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Trust Badges</CardTitle>
              <CardDescription>Upload trust badges to build credibility (up to 6)</CardDescription>
            </div>
            <Button
              onClick={addTrustBadge}
              disabled={(settings.trustBadges?.length || 0) >= 6}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Badge
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.trustBadges && settings.trustBadges.length > 0 ? (
            settings.trustBadges.map((badge) => (
              <Card key={badge.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    {badge.url ? (
                      <img src={badge.url} alt={badge.alt} className="h-16 w-16 object-contain border rounded" />
                    ) : (
                      <div className="h-16 w-16 border-2 border-dashed rounded flex items-center justify-center text-gray-400">
                        <Upload className="h-6 w-6" />
                      </div>
                    )}
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Alt Text</Label>
                          <Input
                            value={badge.alt}
                            onChange={(e) => updateTrustBadge(badge.id, { alt: e.target.value })}
                            placeholder="e.g., SSL Secure"
                          />
                        </div>
                        <div>
                          <Label>Position</Label>
                          <Select
                            value={badge.position}
                            onValueChange={(value: any) => updateTrustBadge(badge.id, { position: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="header">Header</SelectItem>
                              <SelectItem value="footer">Footer</SelectItem>
                              <SelectItem value="sidebar">Sidebar</SelectItem>
                              <SelectItem value="payment">Payment Section</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Link (optional)</Label>
                        <Input
                          value={badge.link || ''}
                          onChange={(e) => updateTrustBadge(badge.id, { link: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleBadgeUpload(badge.id, file);
                          }}
                          disabled={uploadingBadge}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTrustBadge(badge.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No trust badges added yet</p>
              <p className="text-sm mt-1">Click "Add Badge" to upload trust badges</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security & Guarantees */}
      <Card>
        <CardHeader>
          <CardTitle>Security & Guarantees</CardTitle>
          <CardDescription>Build trust with security messaging</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldToggle
            label="Show Security Seals"
            description="Display SSL and secure checkout badges"
            checked={settings.showSecuritySeals}
            onChange={(checked) => setSettings({ ...settings, showSecuritySeals: checked })}
          />

          <div>
            <Label htmlFor="moneyBackGuarantee">Money-Back Guarantee Message</Label>
            <Textarea
              id="moneyBackGuarantee"
              value={settings.moneyBackGuarantee || ''}
              onChange={(e) => setSettings({ ...settings, moneyBackGuarantee: e.target.value })}
              placeholder="e.g., 100% satisfaction guaranteed or your money back within 30 days"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer Service */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Service Contact</CardTitle>
          <CardDescription>Display customer service information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldToggle
            label="Show Customer Service Info"
            description="Display customer service contact details"
            checked={settings.customerServiceDisplay}
            onChange={(checked) => setSettings({ ...settings, customerServiceDisplay: checked })}
          />

          {settings.customerServiceDisplay && (
            <>
              <div>
                <Label htmlFor="customerServiceText">Customer Service Message</Label>
                <Textarea
                  id="customerServiceText"
                  value={settings.customerServiceText || ''}
                  onChange={(e) => setSettings({ ...settings, customerServiceText: e.target.value })}
                  placeholder="We're here to help! Contact us anytime."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="customerServicePhone">Phone Number</Label>
                  <Input
                    id="customerServicePhone"
                    value={settings.customerServicePhone || ''}
                    onChange={(e) => setSettings({ ...settings, customerServicePhone: e.target.value })}
                    placeholder="+212 XXX-XXXX"
                  />
                </div>
                <div>
                  <Label htmlFor="customerServiceEmail">Email Address</Label>
                  <Input
                    id="customerServiceEmail"
                    type="email"
                    value={settings.customerServiceEmail || ''}
                    onChange={(e) => setSettings({ ...settings, customerServiceEmail: e.target.value })}
                    placeholder="support@example.com"
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Social Proof */}
      <Card>
        <CardHeader>
          <CardTitle>Social Proof</CardTitle>
          <CardDescription>Leverage social proof to increase conversions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldToggle
            label="Show Order Count Ticker"
            description="Display number of recent orders"
            checked={settings.showOrderCount}
            onChange={(checked) => setSettings({ ...settings, showOrderCount: checked })}
          />

          {settings.showOrderCount && (
            <div className="pl-6">
              <Label htmlFor="orderCountText">Order Count Text</Label>
              <Input
                id="orderCountText"
                value={settings.orderCountText || ''}
                onChange={(e) => setSettings({ ...settings, orderCountText: e.target.value })}
                placeholder="X orders placed in the last hour"
              />
              <p className="text-xs text-muted-foreground mt-1">Use 'X' as placeholder for the count</p>
            </div>
          )}

          <FieldToggle
            label="Show Recent Purchases"
            description="Display popup notifications of recent purchases"
            checked={settings.showRecentPurchases}
            onChange={(checked) => setSettings({ ...settings, showRecentPurchases: checked })}
          />

          {settings.showRecentPurchases && (
            <div className="pl-6">
              <Label htmlFor="recentPurchaseDelay">Popup Delay (milliseconds)</Label>
              <Input
                id="recentPurchaseDelay"
                type="number"
                value={settings.recentPurchaseDelay || 5000}
                onChange={(e) => setSettings({ ...settings, recentPurchaseDelay: parseInt(e.target.value) })}
              />
            </div>
          )}

          <FieldToggle
            label="Show Trust Rating"
            description="Display overall customer rating"
            checked={settings.showTrustRating}
            onChange={(checked) => setSettings({ ...settings, showTrustRating: checked })}
          />

          {settings.showTrustRating && (
            <div className="pl-6 grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="trustRatingScore">Rating Score (0-5)</Label>
                <Input
                  id="trustRatingScore"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={settings.trustRatingScore || 4.8}
                  onChange={(e) => setSettings({ ...settings, trustRatingScore: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="trustRatingCount">Number of Reviews</Label>
                <Input
                  id="trustRatingCount"
                  type="number"
                  value={settings.trustRatingCount || 0}
                  onChange={(e) => setSettings({ ...settings, trustRatingCount: parseInt(e.target.value) })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Testimonials */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Customer Testimonials</CardTitle>
              <CardDescription>Showcase customer reviews and feedback</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={settings.showTestimonials}
                onCheckedChange={(checked) => setSettings({ ...settings, showTestimonials: checked })}
              />
              <Button onClick={addTestimonial} size="sm" disabled={!settings.showTestimonials}>
                <Plus className="h-4 w-4 mr-2" />
                Add Testimonial
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.showTestimonials && settings.testimonials && settings.testimonials.length > 0 ? (
            settings.testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    {testimonial.image ? (
                      <img src={testimonial.image} alt={testimonial.name} className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                        <Upload className="h-5 w-5" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleTestimonialImageUpload(testimonial.id, file);
                        }}
                        disabled={uploadingTestimonial}
                        className="mb-2"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTestimonial(testimonial.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={testimonial.name}
                      onChange={(e) => updateTestimonial(testimonial.id, { name: e.target.value })}
                      placeholder="Customer name"
                    />
                    <Input
                      value={testimonial.location || ''}
                      onChange={(e) => updateTestimonial(testimonial.id, { location: e.target.value })}
                      placeholder="Location (optional)"
                    />
                  </div>

                  <Textarea
                    value={testimonial.text}
                    onChange={(e) => updateTestimonial(testimonial.id, { text: e.target.value })}
                    placeholder="Testimonial text..."
                    rows={3}
                  />

                  <div className="flex items-center gap-2">
                    <Label>Rating:</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => updateTestimonial(testimonial.id, { rating: star })}
                          className={`${star <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          <Star className="h-5 w-5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    value={testimonial.date || ''}
                    onChange={(e) => updateTestimonial(testimonial.id, { date: e.target.value })}
                    placeholder="Date (optional, e.g., 'January 2025')"
                  />
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {!settings.showTestimonials ? (
                <p>Enable testimonials to start adding customer reviews</p>
              ) : (
                <>
                  <p>No testimonials added yet</p>
                  <p className="text-sm mt-1">Click "Add Testimonial" to showcase customer feedback</p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FieldToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label>{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
