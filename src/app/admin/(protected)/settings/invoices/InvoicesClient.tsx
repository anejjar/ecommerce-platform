'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Loader2,
    Save,
    Settings as SettingsIcon,
    Palette,
    FileText,
    Mail,
    DollarSign,
    Zap,
    Image as ImageIcon,
    Eye,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { InvoiceSettings } from '@/types/invoice';
import { MediaPicker } from '@/components/media-manager/MediaPicker/MediaPicker';

export default function InvoiceSettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [featureEnabled, setFeatureEnabled] = useState<boolean | null>(null);
    const [settings, setSettings] = useState<InvoiceSettings | null>(null);
    const [showLogoMediaPicker, setShowLogoMediaPicker] = useState(false);

    // Check feature flag
    useEffect(() => {
        const checkFeatureFlag = async () => {
            try {
                const response = await fetch('/api/features/enabled');
                if (response.ok) {
                    const data = await response.json();
                    const isEnabled = data.features?.includes('invoice_generator');
                    setFeatureEnabled(isEnabled);
                }
            } catch (error) {
                console.error('Error checking feature flag:', error);
                setFeatureEnabled(false);
            }
        };

        if (status !== 'loading' && session) {
            checkFeatureFlag();
        }
    }, [status, session]);

    useEffect(() => {
        if (status === 'loading') return;
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            router.push('/admin/dashboard');
            return;
        }

        if (featureEnabled !== null) {
            fetchSettings();
        }
    }, [session, status, router, featureEnabled]);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/invoices/settings');
            if (response.ok) {
                const data = await response.json();
                setSettings(data);
            } else if (response.status === 404) {
                // Settings don't exist yet, create defaults
                const defaultSettings = getDefaultSettings();
                setSettings(defaultSettings);
            }
        } catch (error) {
            console.error('Error fetching invoice settings:', error);
            toast.error('Failed to load invoice settings');
        } finally {
            setLoading(false);
        }
    };

    const getDefaultSettings = (): InvoiceSettings => {
        return {
            id: '',
            invoiceNumberPrefix: 'INV',
            invoiceNumberFormat: '{{prefix}}-{{number}}',
            nextInvoiceNumber: 1,
            defaultDueDays: 30,
            primaryColor: '#000000',
            secondaryColor: '#666666',
            accentColor: '#3182ce',
            fontFamily: 'Helvetica',
            fontSize: 10,
            autoSendOnCreate: false,
            sendCopyToAdmin: false,
            taxLabel: 'Tax',
            showTaxBreakdown: true,
            showPaymentLink: true,
            showQRCode: false,
            enableSignatures: false,
            multiLanguage: false,
            defaultLanguage: 'en',
            showFooter: true,
            currency: 'USD',
            currencySymbol: '$',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    };

    const handleSave = async () => {
        if (!settings) return;

        try {
            setSaving(true);
            const response = await fetch('/api/invoices/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                toast.success('Invoice settings saved successfully');
                await fetchSettings();
            } else {
                const error = await response.json();
                toast.error(error.message || 'Failed to save settings');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save invoice settings');
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (key: keyof InvoiceSettings, value: any) => {
        if (!settings) return;
        setSettings({ ...settings, [key]: value });
    };

    if (loading || featureEnabled === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            </div>
        );
    }

    if (!featureEnabled) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Premium Feature</CardTitle>
                        <CardDescription>
                            Invoice management is a premium feature. Please upgrade to access this functionality.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Invoice Settings</h1>
                    <p className="text-gray-600 mt-1">
                        Configure invoice templates, branding, and automation settings
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="general">
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="branding">
                        <Palette className="mr-2 h-4 w-4" />
                        Branding
                    </TabsTrigger>
                    <TabsTrigger value="templates">
                        <FileText className="mr-2 h-4 w-4" />
                        Templates
                    </TabsTrigger>
                    <TabsTrigger value="email">
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                    </TabsTrigger>
                    <TabsTrigger value="tax">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Tax & Currency
                    </TabsTrigger>
                    <TabsTrigger value="advanced">
                        <Zap className="mr-2 h-4 w-4" />
                        Advanced
                    </TabsTrigger>
                </TabsList>

                {/* General Settings Tab */}
                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                            <CardDescription>
                                Configure invoice numbering, default terms, and basic settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="invoiceNumberPrefix">Invoice Number Prefix</Label>
                                    <Input
                                        id="invoiceNumberPrefix"
                                        value={settings.invoiceNumberPrefix}
                                        onChange={(e) => updateSetting('invoiceNumberPrefix', e.target.value)}
                                        placeholder="INV"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="invoiceNumberFormat">Number Format</Label>
                                    <Input
                                        id="invoiceNumberFormat"
                                        value={settings.invoiceNumberFormat}
                                        onChange={(e) => updateSetting('invoiceNumberFormat', e.target.value)}
                                        placeholder="{{prefix}}-{{number}}"
                                    />
                                    <p className="text-sm text-gray-500">
                                        Use {'{{prefix}}'} and {'{{number}}'} as placeholders
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nextInvoiceNumber">Next Invoice Number</Label>
                                <Input
                                    id="nextInvoiceNumber"
                                    type="number"
                                    value={settings.nextInvoiceNumber}
                                    onChange={(e) => updateSetting('nextInvoiceNumber', parseInt(e.target.value) || 1)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="defaultDueDays">Default Due Days</Label>
                                <Input
                                    id="defaultDueDays"
                                    type="number"
                                    value={settings.defaultDueDays}
                                    onChange={(e) => updateSetting('defaultDueDays', parseInt(e.target.value) || 30)}
                                />
                                <p className="text-sm text-gray-500">
                                    Number of days until invoice is due (from invoice date)
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="defaultTerms">Default Terms & Conditions</Label>
                                <Textarea
                                    id="defaultTerms"
                                    value={settings.defaultTerms || ''}
                                    onChange={(e) => updateSetting('defaultTerms', e.target.value)}
                                    rows={4}
                                    placeholder="Enter default terms and conditions..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="defaultNotes">Default Notes</Label>
                                <Textarea
                                    id="defaultNotes"
                                    value={settings.defaultNotes || ''}
                                    onChange={(e) => updateSetting('defaultNotes', e.target.value)}
                                    rows={3}
                                    placeholder="Enter default notes for invoices..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Branding Tab */}
                <TabsContent value="branding" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Branding</CardTitle>
                            <CardDescription>
                                Customize your invoice appearance with logo, colors, and company information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Company Logo</Label>
                                <div className="flex items-center gap-4">
                                    {settings.logoUrl && (
                                        <img
                                            src={settings.logoUrl}
                                            alt="Company logo"
                                            className="h-20 w-auto object-contain"
                                        />
                                    )}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowLogoMediaPicker(true)}
                                    >
                                        <ImageIcon className="mr-2 h-4 w-4" />
                                        {settings.logoUrl ? 'Change Logo' : 'Upload Logo'}
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="companyName">Company Name</Label>
                                    <Input
                                        id="companyName"
                                        value={settings.companyName || ''}
                                        onChange={(e) => updateSetting('companyName', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="companyEmail">Company Email</Label>
                                    <Input
                                        id="companyEmail"
                                        type="email"
                                        value={settings.companyEmail || ''}
                                        onChange={(e) => updateSetting('companyEmail', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="companyAddress">Company Address</Label>
                                <Textarea
                                    id="companyAddress"
                                    value={settings.companyAddress || ''}
                                    onChange={(e) => updateSetting('companyAddress', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="companyPhone">Company Phone</Label>
                                    <Input
                                        id="companyPhone"
                                        value={settings.companyPhone || ''}
                                        onChange={(e) => updateSetting('companyPhone', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="companyWebsite">Company Website</Label>
                                    <Input
                                        id="companyWebsite"
                                        value={settings.companyWebsite || ''}
                                        onChange={(e) => updateSetting('companyWebsite', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="companyTaxId">Tax ID / VAT Number</Label>
                                    <Input
                                        id="companyTaxId"
                                        value={settings.companyTaxId || ''}
                                        onChange={(e) => updateSetting('companyTaxId', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="primaryColor">Primary Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="primaryColor"
                                            type="color"
                                            value={settings.primaryColor}
                                            onChange={(e) => updateSetting('primaryColor', e.target.value)}
                                            className="w-20"
                                        />
                                        <Input
                                            value={settings.primaryColor}
                                            onChange={(e) => updateSetting('primaryColor', e.target.value)}
                                            placeholder="#000000"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="secondaryColor"
                                            type="color"
                                            value={settings.secondaryColor}
                                            onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                                            className="w-20"
                                        />
                                        <Input
                                            value={settings.secondaryColor}
                                            onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                                            placeholder="#666666"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="accentColor">Accent Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="accentColor"
                                            type="color"
                                            value={settings.accentColor}
                                            onChange={(e) => updateSetting('accentColor', e.target.value)}
                                            className="w-20"
                                        />
                                        <Input
                                            value={settings.accentColor}
                                            onChange={(e) => updateSetting('accentColor', e.target.value)}
                                            placeholder="#3182ce"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fontFamily">Font Family</Label>
                                    <Select
                                        value={settings.fontFamily}
                                        onValueChange={(value) => updateSetting('fontFamily', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                                            <SelectItem value="Arial">Arial</SelectItem>
                                            <SelectItem value="Times">Times</SelectItem>
                                            <SelectItem value="Courier">Courier</SelectItem>
                                            <SelectItem value="Georgia">Georgia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fontSize">Font Size</Label>
                                    <Input
                                        id="fontSize"
                                        type="number"
                                        value={settings.fontSize}
                                        onChange={(e) => updateSetting('fontSize', parseInt(e.target.value) || 10)}
                                        min="8"
                                        max="16"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="headerText">Header Text</Label>
                                <Textarea
                                    id="headerText"
                                    value={settings.headerText || ''}
                                    onChange={(e) => updateSetting('headerText', e.target.value)}
                                    rows={2}
                                    placeholder="Optional header text to display on invoices..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="footerText">Footer Text</Label>
                                <Textarea
                                    id="footerText"
                                    value={settings.footerText || ''}
                                    onChange={(e) => updateSetting('footerText', e.target.value)}
                                    rows={2}
                                    placeholder="Optional footer text to display on invoices..."
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="showFooter">Show Footer</Label>
                                    <p className="text-sm text-gray-500">Display footer text on invoices</p>
                                </div>
                                <Switch
                                    id="showFooter"
                                    checked={settings.showFooter}
                                    onCheckedChange={(checked) => updateSetting('showFooter', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Templates Tab */}
                <TabsContent value="templates" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Templates</CardTitle>
                            <CardDescription>
                                Select and customize invoice templates
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label>Default Template</Label>
                                <Select
                                    value={settings.defaultTemplateId || 'default'}
                                    onValueChange={(value) => updateSetting('defaultTemplateId', value === 'default' ? null : value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select default template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">Use System Default</SelectItem>
                                        <SelectItem value="classic-professional">Classic Professional</SelectItem>
                                        <SelectItem value="modern-minimal">Modern Minimal</SelectItem>
                                        <SelectItem value="colorful-branded">Colorful Branded</SelectItem>
                                        <SelectItem value="elegant-corporate">Elegant Corporate</SelectItem>
                                        <SelectItem value="receipt-style">Receipt Style</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-sm text-gray-500 mt-1">
                                    This template will be used by default for new invoices
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-4">Available Templates</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { id: 'classic-professional', name: 'Classic Professional', desc: 'Traditional professional invoice with clean layout' },
                                        { id: 'modern-minimal', name: 'Modern Minimal', desc: 'Clean minimalist design focused on clarity' },
                                        { id: 'colorful-branded', name: 'Colorful Branded', desc: 'Vibrant design with accent colors and branding' },
                                        { id: 'elegant-corporate', name: 'Elegant Corporate', desc: 'Sophisticated corporate design with professional styling' },
                                        { id: 'receipt-style', name: 'Receipt Style', desc: 'Compact receipt-style invoice perfect for quick transactions' },
                                    ].map((template) => (
                                        <Card
                                            key={template.id}
                                            className={`cursor-pointer transition-all ${
                                                settings.defaultTemplateId === template.id
                                                    ? 'border-blue-500 border-2'
                                                    : 'hover:border-gray-400'
                                            }`}
                                            onClick={() => updateSetting('defaultTemplateId', template.id)}
                                        >
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-lg">{template.name}</CardTitle>
                                                    {settings.defaultTemplateId === template.id && (
                                                        <Badge>Default</Badge>
                                                    )}
                                                </div>
                                                <CardDescription>{template.desc}</CardDescription>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <p className="text-sm text-gray-500">
                                    Template customization and preview features will be available in a future update.
                                    You can customize invoice appearance using the Branding tab above.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Email Tab */}
                <TabsContent value="email" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Settings</CardTitle>
                            <CardDescription>
                                Configure email templates and automation for sending invoices
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="emailSubjectTemplate">Email Subject Template</Label>
                                <Input
                                    id="emailSubjectTemplate"
                                    value={settings.emailSubjectTemplate || ''}
                                    onChange={(e) => updateSetting('emailSubjectTemplate', e.target.value)}
                                    placeholder="Invoice {{invoiceNumber}} from {{companyName}}"
                                />
                                <p className="text-sm text-gray-500">
                                    Use {'{{invoiceNumber}}'} and {'{{companyName}}'} as placeholders
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="emailBodyTemplate">Email Body Template</Label>
                                <Textarea
                                    id="emailBodyTemplate"
                                    value={settings.emailBodyTemplate || ''}
                                    onChange={(e) => updateSetting('emailBodyTemplate', e.target.value)}
                                    rows={6}
                                    placeholder="Enter email body template..."
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="autoSendOnCreate">Auto-send on Create</Label>
                                    <p className="text-sm text-gray-500">
                                        Automatically send invoice email when invoice is created
                                    </p>
                                </div>
                                <Switch
                                    id="autoSendOnCreate"
                                    checked={settings.autoSendOnCreate}
                                    onCheckedChange={(checked) => updateSetting('autoSendOnCreate', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="sendCopyToAdmin">Send Copy to Admin</Label>
                                    <p className="text-sm text-gray-500">
                                        Send a copy of invoice emails to admin email
                                    </p>
                                </div>
                                <Switch
                                    id="sendCopyToAdmin"
                                    checked={settings.sendCopyToAdmin}
                                    onCheckedChange={(checked) => updateSetting('sendCopyToAdmin', checked)}
                                />
                            </div>

                            {settings.sendCopyToAdmin && (
                                <div className="space-y-2">
                                    <Label htmlFor="adminEmail">Admin Email</Label>
                                    <Input
                                        id="adminEmail"
                                        type="email"
                                        value={settings.adminEmail || ''}
                                        onChange={(e) => updateSetting('adminEmail', e.target.value)}
                                        placeholder="admin@example.com"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tax & Currency Tab */}
                <TabsContent value="tax" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tax & Currency</CardTitle>
                            <CardDescription>
                                Configure tax settings and currency options
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                                    <Input
                                        id="defaultTaxRate"
                                        type="number"
                                        step="0.01"
                                        value={settings.defaultTaxRate || ''}
                                        onChange={(e) =>
                                            updateSetting('defaultTaxRate', parseFloat(e.target.value) || undefined)
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="taxLabel">Tax Label</Label>
                                    <Input
                                        id="taxLabel"
                                        value={settings.taxLabel}
                                        onChange={(e) => updateSetting('taxLabel', e.target.value)}
                                        placeholder="Tax"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="showTaxBreakdown">Show Tax Breakdown</Label>
                                    <p className="text-sm text-gray-500">
                                        Display detailed tax breakdown on invoices
                                    </p>
                                </div>
                                <Switch
                                    id="showTaxBreakdown"
                                    checked={settings.showTaxBreakdown}
                                    onCheckedChange={(checked) => updateSetting('showTaxBreakdown', checked)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Currency Code</Label>
                                    <Input
                                        id="currency"
                                        value={settings.currency || 'USD'}
                                        onChange={(e) => updateSetting('currency', e.target.value)}
                                        placeholder="USD"
                                    />
                                    <p className="text-sm text-gray-500">
                                        ISO currency code (e.g., USD, EUR, GBP)
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currencySymbol">Currency Symbol</Label>
                                    <Input
                                        id="currencySymbol"
                                        value={settings.currencySymbol || '$'}
                                        onChange={(e) => updateSetting('currencySymbol', e.target.value)}
                                        placeholder="$"
                                    />
                                    <p className="text-sm text-gray-500">
                                        Symbol to display with amounts (e.g., $, €, £)
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Advanced Tab */}
                <TabsContent value="advanced" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Advanced Settings</CardTitle>
                            <CardDescription>
                                Configure advanced features like QR codes, signatures, and custom fields
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="showQRCode">Show QR Code</Label>
                                    <p className="text-sm text-gray-500">
                                        Display QR code on invoices for quick payment
                                    </p>
                                </div>
                                <Switch
                                    id="showQRCode"
                                    checked={settings.showQRCode}
                                    onCheckedChange={(checked) => updateSetting('showQRCode', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="enableSignatures">Enable Digital Signatures</Label>
                                    <p className="text-sm text-gray-500">
                                        Allow digital signatures on invoices
                                    </p>
                                </div>
                                <Switch
                                    id="enableSignatures"
                                    checked={settings.enableSignatures}
                                    onCheckedChange={(checked) => updateSetting('enableSignatures', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="showPaymentLink">Show Payment Link</Label>
                                    <p className="text-sm text-gray-500">
                                        Display payment link on invoices
                                    </p>
                                </div>
                                <Switch
                                    id="showPaymentLink"
                                    checked={settings.showPaymentLink}
                                    onCheckedChange={(checked) => updateSetting('showPaymentLink', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="multiLanguage">Multi-Language Support</Label>
                                    <p className="text-sm text-gray-500">
                                        Enable multiple languages for invoices
                                    </p>
                                </div>
                                <Switch
                                    id="multiLanguage"
                                    checked={settings.multiLanguage}
                                    onCheckedChange={(checked) => updateSetting('multiLanguage', checked)}
                                />
                            </div>

                            {settings.multiLanguage && (
                                <div className="space-y-2">
                                    <Label htmlFor="defaultLanguage">Default Language</Label>
                                    <Select
                                        value={settings.defaultLanguage}
                                        onValueChange={(value) => updateSetting('defaultLanguage', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="fr">French</SelectItem>
                                            <SelectItem value="es">Spanish</SelectItem>
                                            <SelectItem value="de">German</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Media Picker Dialog */}
            {showLogoMediaPicker && (
                <MediaPicker
                    open={showLogoMediaPicker}
                    onOpenChange={setShowLogoMediaPicker}
                    onSelect={(media: any) => {
                        if (media && media.secureUrl) {
                            updateSetting('logoUrl', media.secureUrl);
                            setShowLogoMediaPicker(false);
                        }
                    }}
                    type="IMAGE"
                />
            )}
        </div>
    );
}

