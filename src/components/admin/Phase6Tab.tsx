'use client';

import { CheckoutSettings } from '@/types/checkout-settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  MapPin,
  MessageCircle,
  Zap,
  Globe,
  Mail,
  Smartphone,
  Info,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Phase6TabProps {
  settings: CheckoutSettings;
  setSettings: (settings: CheckoutSettings) => void;
}

const DEFAULT_WHATSAPP_TEMPLATE = `Hello! I'd like to place an order:

{items}

Total: {total}

Shipping to:
{customerName}
{address}

Order Reference: {orderReference}`;

export function Phase6Tab({ settings, setSettings }: Phase6TabProps) {
  const [copied, setCopied] = useState(false);

  const handleChange = (field: keyof CheckoutSettings, value: any) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(DEFAULT_WHATSAPP_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Address Input Method Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address Input Method
          </CardTitle>
          <CardDescription>
            Choose how customers enter their shipping address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={settings.addressInputMethod}
            onValueChange={(value: 'autocomplete' | 'dropdown') =>
              handleChange('addressInputMethod', value)
            }
          >
            <div className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem value="autocomplete" id="autocomplete" />
              <div className="flex-1">
                <Label htmlFor="autocomplete" className="font-medium cursor-pointer">
                  Address Autocomplete (OpenStreetMap)
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Customers type their address and select from autocomplete suggestions using free
                  OpenStreetMap API. Faster and more accurate for most users.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 space-y-0 mt-4">
              <RadioGroupItem value="dropdown" id="dropdown" />
              <div className="flex-1">
                <Label htmlFor="dropdown" className="font-medium cursor-pointer">
                  Region/City Dropdowns
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Customers select from predefined regions and cities. Best for limited delivery
                  areas or when you want strict control over locations.
                </p>
              </div>
            </div>
          </RadioGroup>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Current method: <strong>{settings.addressInputMethod === 'autocomplete' ? 'Autocomplete' : 'Region/City Dropdowns'}</strong>
              <br />
              {settings.addressInputMethod === 'dropdown' && (
                <span className="text-sm">
                  Manage regions and cities in the "Locations" tab.
                </span>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* WhatsApp Ordering Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            WhatsApp Ordering
          </CardTitle>
          <CardDescription>
            Allow customers to complete orders via WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable WhatsApp */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableWhatsApp" className="text-base">
                Enable WhatsApp Ordering
              </Label>
              <p className="text-sm text-muted-foreground">
                Show WhatsApp button in checkout with pre-filled order details
              </p>
            </div>
            <Switch
              id="enableWhatsApp"
              checked={settings.enableWhatsAppOrdering}
              onCheckedChange={(checked) =>
                handleChange('enableWhatsAppOrdering', checked)
              }
            />
          </div>

          {settings.enableWhatsAppOrdering && (
            <>
              {/* WhatsApp Business Number */}
              <div className="space-y-2">
                <Label htmlFor="whatsAppNumber">
                  WhatsApp Business Number *
                </Label>
                <Input
                  id="whatsAppNumber"
                  type="tel"
                  placeholder="+212 6XX XXX XXX"
                  value={settings.whatsAppBusinessNumber || ''}
                  onChange={(e) =>
                    handleChange('whatsAppBusinessNumber', e.target.value)
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Enter your WhatsApp business number with country code (e.g., +212XXXXXXXXX)
                </p>
              </div>

              {/* Button Text */}
              <div className="space-y-2">
                <Label htmlFor="whatsAppButtonText">
                  Button Text
                </Label>
                <Input
                  id="whatsAppButtonText"
                  placeholder="Order via WhatsApp"
                  value={settings.whatsAppButtonText || ''}
                  onChange={(e) =>
                    handleChange('whatsAppButtonText', e.target.value)
                  }
                />
              </div>

              {/* Button Position */}
              <div className="space-y-2">
                <Label>Button Position</Label>
                <RadioGroup
                  value={settings.whatsAppButtonPosition || 'secondary'}
                  onValueChange={(value: 'primary' | 'secondary' | 'both') =>
                    handleChange('whatsAppButtonPosition', value)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="primary" id="primary" />
                    <Label htmlFor="primary" className="font-normal cursor-pointer">
                      Primary (replace Place Order button)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="secondary" id="secondary" />
                    <Label htmlFor="secondary" className="font-normal cursor-pointer">
                      Secondary (below Place Order button)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both" className="font-normal cursor-pointer">
                      Both (show both buttons)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Message Template */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="whatsAppTemplate">
                    Message Template
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyTemplate}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy Default
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="whatsAppTemplate"
                  rows={8}
                  placeholder={DEFAULT_WHATSAPP_TEMPLATE}
                  value={settings.whatsAppMessageTemplate || ''}
                  onChange={(e) =>
                    handleChange('whatsAppMessageTemplate', e.target.value)
                  }
                  className="font-mono text-sm"
                />
                <div className="space-y-1">
                  <p className="text-xs font-medium">Available variables:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <code className="bg-muted px-2 py-1 rounded">{'{customerName}'}</code>
                    <code className="bg-muted px-2 py-1 rounded">{'{items}'}</code>
                    <code className="bg-muted px-2 py-1 rounded">{'{total}'}</code>
                    <code className="bg-muted px-2 py-1 rounded">{'{address}'}</code>
                    <code className="bg-muted px-2 py-1 rounded">{'{orderReference}'}</code>
                    <code className="bg-muted px-2 py-1 rounded">{'{phone}'}</code>
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Orders created via WhatsApp will be tracked separately and marked as
                  "WhatsApp" source in your order list and analytics.
                </AlertDescription>
              </Alert>
            </>
          )}
        </CardContent>
      </Card>

      {/* Conversion Optimizations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Conversion Optimizations
          </CardTitle>
          <CardDescription>
            Features to improve checkout experience and conversion rate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Guest Checkout */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="quickGuest" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Quick Guest Checkout
              </Label>
              <p className="text-sm text-muted-foreground">
                Start with email-only for guests, then show full form. Reduces initial friction.
              </p>
            </div>
            <Switch
              id="quickGuest"
              checked={settings.enableQuickGuestCheckout}
              onCheckedChange={(checked) =>
                handleChange('enableQuickGuestCheckout', checked)
              }
            />
          </div>

          {/* Inline Validation */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="inlineValidation" className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Real-time Inline Validation
              </Label>
              <p className="text-sm text-muted-foreground">
                Show validation errors as users type. Prevents form submission errors.
              </p>
            </div>
            <Switch
              id="inlineValidation"
              checked={settings.enableInlineValidation}
              onCheckedChange={(checked) =>
                handleChange('enableInlineValidation', checked)
              }
            />
          </div>

          {/* Mobile Optimization */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="mobileOpt" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Mobile Keyboard Optimization
              </Label>
              <p className="text-sm text-muted-foreground">
                Show appropriate keyboards (email, tel, numeric) on mobile devices.
              </p>
            </div>
            <Switch
              id="mobileOpt"
              checked={settings.enableMobileOptimization}
              onCheckedChange={(checked) =>
                handleChange('enableMobileOptimization', checked)
              }
            />
          </div>

          {/* Saved Address Quick Select */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="quickAddress" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                One-Click Saved Addresses
              </Label>
              <p className="text-sm text-muted-foreground">
                Highlight saved addresses with one-click selection for returning customers.
              </p>
            </div>
            <Switch
              id="quickAddress"
              checked={settings.enableSavedAddressQuick}
              onCheckedChange={(checked) =>
                handleChange('enableSavedAddressQuick', checked)
              }
            />
          </div>

          <Alert>
            <Zap className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              <strong>Recommended:</strong> Enable all optimizations for best conversion rates.
              These features have been tested to improve checkout completion by 20-40%.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
