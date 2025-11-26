'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { CheckoutSettings, PromotionalBanner } from '@/types/checkout-settings';

interface Phase5TabProps {
  settings: CheckoutSettings;
  setSettings: (settings: CheckoutSettings) => void;
}

export function Phase5Tab({ settings, setSettings }: Phase5TabProps) {
  const addPromotionalBanner = () => {
    const newBanner: PromotionalBanner = {
      id: `banner_${Date.now()}`,
      message: '',
      type: 'info',
      position: 'top',
    };
    setSettings({
      ...settings,
      promotionalBanners: [...(settings.promotionalBanners || []), newBanner],
    });
  };

  const updatePromotionalBanner = (id: string, updates: Partial<PromotionalBanner>) => {
    setSettings({
      ...settings,
      promotionalBanners: settings.promotionalBanners?.map((banner) =>
        banner.id === id ? { ...banner, ...updates } : banner
      ) || [],
    });
  };

  const deletePromotionalBanner = (id: string) => {
    setSettings({
      ...settings,
      promotionalBanners: settings.promotionalBanners?.filter((banner) => banner.id !== id) || [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Countdown Timer */}
      <Card>
        <CardHeader>
          <CardTitle>Countdown Timer</CardTitle>
          <CardDescription>Create urgency with time-limited offers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldToggle
            label="Show Countdown Timer"
            description="Display countdown to create urgency"
            checked={settings.showCountdownTimer}
            onChange={(checked) => setSettings({ ...settings, showCountdownTimer: checked })}
          />

          {settings.showCountdownTimer && (
            <>
              <div>
                <Label htmlFor="countdownEndDate">End Date & Time</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <Input
                    id="countdownEndDate"
                    type="datetime-local"
                    value={settings.countdownEndDate ? new Date(settings.countdownEndDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setSettings({ ...settings, countdownEndDate: e.target.value ? new Date(e.target.value) : null })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="countdownText">Countdown Message</Label>
                <Input
                  id="countdownText"
                  value={settings.countdownText || ''}
                  onChange={(e) => setSettings({ ...settings, countdownText: e.target.value })}
                  placeholder="e.g., Limited Time Offer!"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Promotional Banners */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Promotional Banners</CardTitle>
              <CardDescription>Create scheduled promotional messages</CardDescription>
            </div>
            <Button onClick={addPromotionalBanner} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.promotionalBanners && settings.promotionalBanners.length > 0 ? (
            settings.promotionalBanners.map((banner, index) => (
              <Card key={banner.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">Banner #{index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePromotionalBanner(banner.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>

                  <div>
                    <Label>Banner Message</Label>
                    <Textarea
                      value={banner.message}
                      onChange={(e) => updatePromotionalBanner(banner.id, { message: e.target.value })}
                      placeholder="Your promotional message..."
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Banner Type</Label>
                      <Select
                        value={banner.type}
                        onValueChange={(value: any) => updatePromotionalBanner(banner.id, { type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Info (Blue)</SelectItem>
                          <SelectItem value="success">Success (Green)</SelectItem>
                          <SelectItem value="warning">Warning (Yellow)</SelectItem>
                          <SelectItem value="danger">Urgent (Red)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Position</Label>
                      <Select
                        value={banner.position}
                        onValueChange={(value: any) => updatePromotionalBanner(banner.id, { position: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top of Page</SelectItem>
                          <SelectItem value="middle">Middle</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Link URL (optional)</Label>
                      <Input
                        value={banner.link || ''}
                        onChange={(e) => updatePromotionalBanner(banner.id, { link: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label>Link Text (optional)</Label>
                      <Input
                        value={banner.linkText || ''}
                        onChange={(e) => updatePromotionalBanner(banner.id, { linkText: e.target.value })}
                        placeholder="e.g., Shop Now"
                      />
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                    <p>Schedule feature coming soon: Set start/end dates for automatic display</p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No promotional banners added yet</p>
              <p className="text-sm mt-1">Click "Add Banner" to create promotional messages</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Free Shipping Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Free Shipping Progress Bar</CardTitle>
          <CardDescription>Show customers how close they are to free shipping</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldToggle
            label="Show Free Shipping Bar"
            description="Display progress bar toward free shipping"
            checked={settings.showFreeShippingBar}
            onChange={(checked) => setSettings({ ...settings, showFreeShippingBar: checked })}
          />

          {settings.showFreeShippingBar && (
            <div>
              <Label htmlFor="freeShippingBarText">Progress Bar Text</Label>
              <Input
                id="freeShippingBarText"
                value={settings.freeShippingBarText || ''}
                onChange={(e) => setSettings({ ...settings, freeShippingBarText: e.target.value })}
                placeholder="Add {amount} more for free shipping!"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use {'{amount}'} as placeholder for remaining amount
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upsell Products */}
      <Card>
        <CardHeader>
          <CardTitle>Product Upsells</CardTitle>
          <CardDescription>Recommend products during checkout</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldToggle
            label="Show Upsell Products"
            description="Display product recommendations in checkout"
            checked={settings.showUpsells}
            onChange={(checked) => setSettings({ ...settings, showUpsells: checked })}
          />

          {settings.showUpsells && (
            <>
              <div>
                <Label htmlFor="upsellTitle">Upsell Section Title</Label>
                <Input
                  id="upsellTitle"
                  value={settings.upsellTitle || ''}
                  onChange={(e) => setSettings({ ...settings, upsellTitle: e.target.value })}
                  placeholder="You might also like..."
                />
              </div>

              <div>
                <Label>Upsell Position</Label>
                <Select
                  value={settings.upsellPosition || 'cart'}
                  onValueChange={(value: any) => setSettings({ ...settings, upsellPosition: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cart">In Cart Section</SelectItem>
                    <SelectItem value="below-form">Below Checkout Form</SelectItem>
                    <SelectItem value="modal">As Modal Popup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="upsellProducts">Product IDs (comma-separated)</Label>
                <Input
                  id="upsellProducts"
                  value={settings.upsellProducts?.join(', ') || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    upsellProducts: e.target.value.split(',').map(id => id.trim()).filter(Boolean)
                  })}
                  placeholder="product-id-1, product-id-2, product-id-3"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter product IDs to show as upsells (leave empty for automatic recommendations)
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Urgency Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Urgency & Scarcity</CardTitle>
          <CardDescription>Create urgency to encourage purchases</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldToggle
            label="Show Low Stock Warnings"
            description="Alert customers when items are low in stock"
            checked={settings.showLowStock}
            onChange={(checked) => setSettings({ ...settings, showLowStock: checked })}
          />

          {settings.showLowStock && (
            <>
              <div className="pl-6 space-y-3">
                <div>
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    value={settings.lowStockThreshold || 5}
                    onChange={(e) => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Show warning when stock is below this number
                  </p>
                </div>

                <div>
                  <Label htmlFor="lowStockText">Low Stock Message</Label>
                  <Input
                    id="lowStockText"
                    value={settings.lowStockText || ''}
                    onChange={(e) => setSettings({ ...settings, lowStockText: e.target.value })}
                    placeholder="Only X items left in stock!"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use 'X' as placeholder for stock count
                  </p>
                </div>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="scarcityMessage">General Scarcity Message</Label>
            <Textarea
              id="scarcityMessage"
              value={settings.scarcityMessage || ''}
              onChange={(e) => setSettings({ ...settings, scarcityMessage: e.target.value })}
              placeholder="e.g., High demand! 12 people are viewing this product right now."
              rows={2}
            />
          </div>

          <div>
            <Label>Urgency Badge Style</Label>
            <Select
              value={settings.urgencyBadgeStyle || 'warning'}
              onValueChange={(value: any) => setSettings({ ...settings, urgencyBadgeStyle: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warning">Warning (Yellow)</SelectItem>
                <SelectItem value="danger">Danger (Red)</SelectItem>
                <SelectItem value="info">Info (Blue)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Incentives */}
      <Card>
        <CardHeader>
          <CardTitle>Incentives & Rewards</CardTitle>
          <CardDescription>Encourage purchases with rewards and incentives</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Discount Code Field Position</Label>
            <Select
              value={settings.discountFieldPosition || 'top'}
              onValueChange={(value: any) => setSettings({ ...settings, discountFieldPosition: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top of Cart</SelectItem>
                <SelectItem value="bottom">Bottom of Cart</SelectItem>
                <SelectItem value="floating">Floating Button</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <FieldToggle
            label="Show Loyalty Points"
            description="Display points earned with this purchase"
            checked={settings.showLoyaltyPoints}
            onChange={(checked) => setSettings({ ...settings, showLoyaltyPoints: checked })}
          />

          {settings.showLoyaltyPoints && (
            <div className="pl-6">
              <Label htmlFor="loyaltyPointsText">Loyalty Points Message</Label>
              <Input
                id="loyaltyPointsText"
                value={settings.loyaltyPointsText || ''}
                onChange={(e) => setSettings({ ...settings, loyaltyPointsText: e.target.value })}
                placeholder="⭐ Earn 99 points with this order!"
              />
            </div>
          )}

          <FieldToggle
            label="Gift with Purchase"
            description="Offer a free gift above a certain amount"
            checked={settings.showGiftWithPurchase}
            onChange={(checked) => setSettings({ ...settings, showGiftWithPurchase: checked })}
          />

          {settings.showGiftWithPurchase && (
            <div className="pl-6 space-y-3">
              <div>
                <Label htmlFor="giftThreshold">Minimum Purchase Amount (MAD)</Label>
                <Input
                  id="giftThreshold"
                  type="number"
                  step="0.01"
                  value={settings.giftThreshold || ''}
                  onChange={(e) => setSettings({ ...settings, giftThreshold: parseFloat(e.target.value) || null })}
                  placeholder="500.00"
                />
              </div>
              <div>
                <Label htmlFor="giftDescription">Gift Description</Label>
                <Textarea
                  id="giftDescription"
                  value={settings.giftDescription || ''}
                  onChange={(e) => setSettings({ ...settings, giftDescription: e.target.value })}
                  placeholder="Get a free branded tote bag with orders over 500 MAD!"
                  rows={2}
                />
              </div>
            </div>
          )}

          <FieldToggle
            label="Referral Discount"
            description="Enable referral discount messaging"
            checked={settings.referralDiscountEnabled}
            onChange={(checked) => setSettings({ ...settings, referralDiscountEnabled: checked })}
          />

          {settings.referralDiscountEnabled && (
            <div className="pl-6">
              <Label htmlFor="referralDiscountText">Referral Message</Label>
              <Input
                id="referralDiscountText"
                value={settings.referralDiscountText || ''}
                onChange={(e) => setSettings({ ...settings, referralDiscountText: e.target.value })}
                placeholder="Referred by a friend? Get 10% off your first order!"
              />
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
