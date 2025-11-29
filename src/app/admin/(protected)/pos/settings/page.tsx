'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, Printer, Keyboard, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';

interface POSSettings {
  general: {
    defaultPaymentMethod: 'CASH' | 'CARD' | 'DIGITAL_WALLET';
    defaultTaxRate: number;
    currencySymbol: string;
    receiptHeader: string;
    receiptFooter: string;
  };
  printer: {
    enabled: boolean;
    autoPrint: boolean;
    printerName: string;
    receiptTemplate: string;
  };
  keyboard: {
    shortcutsEnabled: boolean;
    showHints: boolean;
  };
  display: {
    gridColumns: number;
    showImages: boolean;
    largeTextMode: boolean;
  };
}

const defaultSettings: POSSettings = {
  general: {
    defaultPaymentMethod: 'CASH',
    defaultTaxRate: 10,
    currencySymbol: '$',
    receiptHeader: 'Thank you for your purchase!',
    receiptFooter: 'Visit us again soon!',
  },
  printer: {
    enabled: false,
    autoPrint: false,
    printerName: '',
    receiptTemplate: 'standard',
  },
  keyboard: {
    shortcutsEnabled: true,
    showHints: true,
  },
  display: {
    gridColumns: 4,
    showImages: true,
    largeTextMode: false,
  },
};

export default function POSSettingsPage() {
  const [settings, setSettings] = useState<POSSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    setIsLoading(true);
    try {
      const saved = localStorage.getItem('pos_settings');
      if (saved) {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('pos_settings', JSON.stringify(settings));
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateGeneral = (field: keyof POSSettings['general'], value: any) => {
    setSettings({
      ...settings,
      general: { ...settings.general, [field]: value },
    });
  };

  const updatePrinter = (field: keyof POSSettings['printer'], value: any) => {
    setSettings({
      ...settings,
      printer: { ...settings.printer, [field]: value },
    });
  };

  const updateKeyboard = (field: keyof POSSettings['keyboard'], value: any) => {
    setSettings({
      ...settings,
      keyboard: { ...settings.keyboard, [field]: value },
    });
  };

  const updateDisplay = (field: keyof POSSettings['display'], value: any) => {
    setSettings({
      ...settings,
      display: { ...settings.display, [field]: value },
    });
  };

  if (isLoading) {
    return <div className="p-6">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">POS Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your POS system preferences</p>
        </div>
        <Button onClick={saveSettings} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="printer">
            <Printer className="h-4 w-4 mr-2" />
            Printer
          </TabsTrigger>
          <TabsTrigger value="keyboard">
            <Keyboard className="h-4 w-4 mr-2" />
            Keyboard
          </TabsTrigger>
          <TabsTrigger value="display">
            <Monitor className="h-4 w-4 mr-2" />
            Display
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure default POS behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="defaultPaymentMethod">Default Payment Method</Label>
                <Select
                  value={settings.general.defaultPaymentMethod}
                  onValueChange={(value: any) => updateGeneral('defaultPaymentMethod', value)}
                >
                  <SelectTrigger id="defaultPaymentMethod" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="CARD">Card</SelectItem>
                    <SelectItem value="DIGITAL_WALLET">Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                <Input
                  id="defaultTaxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.general.defaultTaxRate}
                  onChange={(e) => updateGeneral('defaultTaxRate', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="currencySymbol">Currency Symbol</Label>
                <Input
                  id="currencySymbol"
                  value={settings.general.currencySymbol}
                  onChange={(e) => updateGeneral('currencySymbol', e.target.value)}
                  className="mt-1"
                  maxLength={3}
                />
              </div>
              <div>
                <Label htmlFor="receiptHeader">Receipt Header Text</Label>
                <Textarea
                  id="receiptHeader"
                  value={settings.general.receiptHeader}
                  onChange={(e) => updateGeneral('receiptHeader', e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="receiptFooter">Receipt Footer Text</Label>
                <Textarea
                  id="receiptFooter"
                  value={settings.general.receiptFooter}
                  onChange={(e) => updateGeneral('receiptFooter', e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Printer Settings */}
        <TabsContent value="printer">
          <Card>
            <CardHeader>
              <CardTitle>Printer Settings</CardTitle>
              <CardDescription>Configure receipt printing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="printerEnabled">Enable Receipt Printing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow printing receipts from the POS system
                  </p>
                </div>
                <Switch
                  id="printerEnabled"
                  checked={settings.printer.enabled}
                  onCheckedChange={(checked) => updatePrinter('enabled', checked)}
                />
              </div>
              {settings.printer.enabled && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoPrint">Auto-Print Receipts</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically print receipt after order completion
                      </p>
                    </div>
                    <Switch
                      id="autoPrint"
                      checked={settings.printer.autoPrint}
                      onCheckedChange={(checked) => updatePrinter('autoPrint', checked)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="printerName">Printer Name</Label>
                    <Input
                      id="printerName"
                      value={settings.printer.printerName}
                      onChange={(e) => updatePrinter('printerName', e.target.value)}
                      className="mt-1"
                      placeholder="Enter printer name or IP address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="receiptTemplate">Receipt Template</Label>
                    <Select
                      value={settings.printer.receiptTemplate}
                      onValueChange={(value) => updatePrinter('receiptTemplate', value)}
                    >
                      <SelectTrigger id="receiptTemplate" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keyboard Settings */}
        <TabsContent value="keyboard">
          <Card>
            <CardHeader>
              <CardTitle>Keyboard Shortcuts</CardTitle>
              <CardDescription>Configure keyboard shortcuts and hints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="shortcutsEnabled">Enable Keyboard Shortcuts</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow using keyboard shortcuts for faster operations
                  </p>
                </div>
                <Switch
                  id="shortcutsEnabled"
                  checked={settings.keyboard.shortcutsEnabled}
                  onCheckedChange={(checked) => updateKeyboard('shortcutsEnabled', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showHints">Show Shortcut Hints</Label>
                  <p className="text-sm text-muted-foreground">
                    Display keyboard shortcut hints in the UI
                  </p>
                </div>
                <Switch
                  id="showHints"
                  checked={settings.keyboard.showHints}
                  onCheckedChange={(checked) => updateKeyboard('showHints', checked)}
                />
              </div>
              {settings.keyboard.shortcutsEnabled && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Available Shortcuts:</h4>
                  <ul className="space-y-1 text-sm">
                    <li><kbd className="px-2 py-1 bg-background rounded border">Enter</kbd> - Place order</li>
                    <li><kbd className="px-2 py-1 bg-background rounded border">Esc</kbd> - Clear cart</li>
                    <li><kbd className="px-2 py-1 bg-background rounded border">F1</kbd> - Cash payment</li>
                    <li><kbd className="px-2 py-1 bg-background rounded border">F2</kbd> - Card payment</li>
                    <li><kbd className="px-2 py-1 bg-background rounded border">F3</kbd> - Digital wallet</li>
                    <li><kbd className="px-2 py-1 bg-background rounded border">1-9</kbd> - Set quantity</li>
                    <li><kbd className="px-2 py-1 bg-background rounded border">+/-</kbd> - Adjust quantity</li>
                    <li><kbd className="px-2 py-1 bg-background rounded border">Delete</kbd> - Remove item</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>Customize the POS interface appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="gridColumns">Product Grid Columns</Label>
                <Select
                  value={settings.display.gridColumns.toString()}
                  onValueChange={(value) => updateDisplay('gridColumns', parseInt(value))}
                >
                  <SelectTrigger id="gridColumns" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Columns</SelectItem>
                    <SelectItem value="3">3 Columns</SelectItem>
                    <SelectItem value="4">4 Columns</SelectItem>
                    <SelectItem value="5">5 Columns</SelectItem>
                    <SelectItem value="6">6 Columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showImages">Show Product Images</Label>
                  <p className="text-sm text-muted-foreground">
                    Display product images in the grid
                  </p>
                </div>
                <Switch
                  id="showImages"
                  checked={settings.display.showImages}
                  onCheckedChange={(checked) => updateDisplay('showImages', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="largeTextMode">Large Text Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Increase font sizes for better visibility
                  </p>
                </div>
                <Switch
                  id="largeTextMode"
                  checked={settings.display.largeTextMode}
                  onCheckedChange={(checked) => updateDisplay('largeTextMode', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

