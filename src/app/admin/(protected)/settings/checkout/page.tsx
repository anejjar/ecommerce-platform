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
    Plus,
    Trash2,
    MapPin,
    Settings as SettingsIcon,
    Palette,
    Layout,
    Type,
    Eye,
    Monitor,
    Tablet,
    Smartphone,
    GripVertical,
    RotateCcw,
    Shield,
    Megaphone
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { CheckoutPreview } from '@/components/admin/CheckoutPreview';
import { CheckoutSettings, CustomField, DEFAULT_FIELD_ORDER, FIELD_DISPLAY_NAMES } from '@/types/checkout-settings';
import { Phase4Tab } from '@/components/admin/Phase4Tab';
import { Phase5Tab } from '@/components/admin/Phase5Tab';

interface Region {
    id: string;
    name: string;
    isActive: boolean;
    _count?: { cities: number };
}

interface City {
    id: string;
    name: string;
    regionId: string;
    isActive: boolean;
    region?: { id: string; name: string };
}

type ViewMode = 'desktop' | 'tablet' | 'mobile';

export default function CheckoutSettingsEnhancedPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewMode, setPreviewMode] = useState<ViewMode>('desktop');
    const [featureEnabled, setFeatureEnabled] = useState<boolean | null>(null);

    // Checkout settings
    const [settings, setSettings] = useState<CheckoutSettings | null>(null);

    // Region & City management
    const [regions, setRegions] = useState<Region[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [newRegionName, setNewRegionName] = useState('');
    const [newCityName, setNewCityName] = useState('');
    const [selectedRegionForCity, setSelectedRegionForCity] = useState('');
    const [addingRegion, setAddingRegion] = useState(false);
    const [addingCity, setAddingCity] = useState(false);

    // Logo upload
    const [uploadingLogo, setUploadingLogo] = useState(false);

    // Check feature flag
    useEffect(() => {
        const checkFeatureFlag = async () => {
            try {
                const response = await fetch('/api/features/enabled');
                if (response.ok) {
                    const data = await response.json();
                    const isEnabled = data.features?.includes('checkout_customization');
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
    }, [status, session, router]);

    useEffect(() => {
        if (status === 'loading') return;
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            router.push('/admin/dashboard');
            return;
        }

        // Fetch data for all users (basic + premium settings)
        if (featureEnabled !== null) {
            fetchData();
        }
    }, [session, status, router, featureEnabled]);

    const fetchData = async () => {
        try {
            setLoading(true);
            await Promise.all([fetchCheckoutSettings(), fetchRegions(), fetchCities()]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCheckoutSettings = async () => {
        try {
            const response = await fetch('/api/admin/checkout-settings');
            if (response.ok) {
                const data = await response.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Error fetching checkout settings:', error);
        }
    };

    const fetchRegions = async () => {
        try {
            const response = await fetch('/api/admin/regions');
            if (response.ok) {
                const data = await response.json();
                setRegions(data);
            }
        } catch (error) {
            console.error('Error fetching regions:', error);
        }
    };

    const fetchCities = async () => {
        try {
            const response = await fetch('/api/admin/cities');
            if (response.ok) {
                const data = await response.json();
                setCities(data);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const saveCheckoutSettings = async () => {
        if (!settings) return;

        setSaving(true);
        try {
            const response = await fetch('/api/admin/checkout-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                toast.success('Checkout settings saved successfully!');
            } else {
                throw new Error('Failed to save settings');
            }
        } catch (error) {
            toast.error('Failed to save checkout settings');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const resetCheckoutSettings = async () => {
        if (!confirm('Are you sure you want to reset all checkout customization settings to default? This action cannot be undone.')) {
            return;
        }

        setSaving(true);
        try {
            const response = await fetch('/api/admin/checkout-settings', {
                method: 'DELETE',
            });

            if (response.ok) {
                const data = await response.json();
                setSettings(data.settings);
                toast.success('Checkout settings reset to default successfully!');
            } else {
                throw new Error('Failed to reset settings');
            }
        } catch (error) {
            toast.error('Failed to reset checkout settings');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        setUploadingLogo(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'checkout-branding');

        try {
            const response = await fetch('/api/media/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setSettings({ ...settings!, logoUrl: data.url });
                toast.success('Logo uploaded successfully!');
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            toast.error('Failed to upload logo');
        } finally {
            setUploadingLogo(false);
        }
    };

    const addCustomField = () => {
        const newField: CustomField = {
            id: `custom_${Date.now()}`,
            name: `custom_field_${Date.now()}`,
            label: 'New Custom Field',
            type: 'text',
            required: false,
            position: (settings?.customFields?.length || 0) + 1,
        };

        setSettings({
            ...settings!,
            customFields: [...(settings?.customFields || []), newField],
        });
    };

    const updateCustomField = (id: string, updates: Partial<CustomField>) => {
        setSettings({
            ...settings!,
            customFields: settings?.customFields?.map((field) =>
                field.id === id ? { ...field, ...updates } : field
            ) || [],
        });
    };

    const deleteCustomField = (id: string) => {
        setSettings({
            ...settings!,
            customFields: settings?.customFields?.filter((field) => field.id !== id) || [],
        });
    };

    const addRegion = async () => {
        if (!newRegionName.trim()) {
            toast.error('Please enter a region name');
            return;
        }

        setAddingRegion(true);
        try {
            const response = await fetch('/api/admin/regions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newRegionName }),
            });

            if (response.ok) {
                toast.success('Region added successfully!');
                setNewRegionName('');
                fetchRegions();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to add region');
            }
        } catch (error) {
            toast.error('Failed to add region');
        } finally {
            setAddingRegion(false);
        }
    };

    const deleteRegion = async (id: string) => {
        if (!confirm('Are you sure? This will delete all cities in this region.')) return;

        try {
            const response = await fetch(`/api/admin/regions/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Region deleted successfully!');
                fetchRegions();
                fetchCities();
            } else {
                toast.error('Failed to delete region');
            }
        } catch (error) {
            toast.error('Failed to delete region');
        }
    };

    const addCity = async () => {
        if (!newCityName.trim()) {
            toast.error('Please enter a city name');
            return;
        }
        if (!selectedRegionForCity) {
            toast.error('Please select a region');
            return;
        }

        setAddingCity(true);
        try {
            const response = await fetch('/api/admin/cities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newCityName,
                    regionId: selectedRegionForCity,
                }),
            });

            if (response.ok) {
                toast.success('City added successfully!');
                setNewCityName('');
                fetchCities();
                fetchRegions();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to add city');
            }
        } catch (error) {
            toast.error('Failed to add city');
        } finally {
            setAddingCity(false);
        }
    };

    const deleteCity = async (id: string) => {
        if (!confirm('Are you sure you want to delete this city?')) return;

        try {
            const response = await fetch(`/api/admin/cities/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('City deleted successfully!');
                fetchCities();
                fetchRegions();
            } else {
                toast.error('Failed to delete city');
            }
        } catch (error) {
            toast.error('Failed to delete city');
        }
    };

    if (status === 'loading' || loading || featureEnabled === null) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                {featureEnabled === null && (
                    <p className="ml-3 text-muted-foreground">Checking feature access...</p>
                )}
            </div>
        );
    }

    // Always render page - show basic settings for all users
    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role) || !settings) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pb-4 -mx-8 px-8 pt-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold tracking-tight">Checkout Settings</h1>
                        <p className="text-muted-foreground mt-2">
                            {featureEnabled
                                ? "Advanced checkout customization with branding, trust elements, and marketing features"
                                : "Manage basic checkout settings and location configurations"}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                            variant={showPreview ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setShowPreview(!showPreview)}
                            className="whitespace-nowrap"
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            {showPreview ? 'Hide' : 'Show'} Preview
                        </Button>
                        {featureEnabled && (
                            <Button
                                variant="outline"
                                onClick={resetCheckoutSettings}
                                disabled={saving}
                                size="lg"
                                className="whitespace-nowrap"
                            >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Reset to Default
                            </Button>
                        )}
                        <Button
                            onClick={saveCheckoutSettings}
                            disabled={saving}
                            size="lg"
                            className="whitespace-nowrap"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save All Settings
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Settings Panel */}
            <div className="space-y-6">
                <Tabs defaultValue="customization" className="space-y-6">
                    {/* Improved Tabs with better responsive design */}
                    <div className="overflow-x-auto -mx-2 px-2">
                        <TabsList className="inline-flex w-auto min-w-full">
                            {/* Always visible: Basic settings */}
                            <TabsTrigger value="customization" className="flex items-center gap-2">
                                <SettingsIcon className="h-4 w-4" />
                                <span>Basic Settings</span>
                            </TabsTrigger>
                            <TabsTrigger value="locations" className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>Locations</span>
                            </TabsTrigger>

                            {/* Premium tabs - conditionally shown */}
                            {featureEnabled ? (
                                <>
                                    {/* Branding Tab */}
                                    <TabsTrigger value="branding" className="flex items-center gap-2">
                                        <Palette className="h-4 w-4" />
                                        <span>Branding</span>
                                    </TabsTrigger>

                                    {/* Layout Tab */}
                                    <TabsTrigger value="layout" className="flex items-center gap-2">
                                        <Layout className="h-4 w-4" />
                                        <span>Layout</span>
                                    </TabsTrigger>

                                    {/* Fields Tab */}
                                    <TabsTrigger value="fields" className="flex items-center gap-2">
                                        <Type className="h-4 w-4" />
                                        <span>Fields</span>
                                    </TabsTrigger>

                                    {/* Trust Tab */}
                                    <TabsTrigger value="trust" className="flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        <span>Trust</span>
                                    </TabsTrigger>

                                    {/* Marketing Tab */}
                                    <TabsTrigger value="marketing" className="flex items-center gap-2">
                                        <Megaphone className="h-4 w-4" />
                                        <span>Marketing</span>
                                    </TabsTrigger>
                                </>
                            ) : (
                                <TabsTrigger disabled className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                                    <span>🔒</span>
                                    <span>Premium Features</span>
                                    <Badge variant="outline" className="ml-1 text-xs">Upgrade to PRO</Badge>
                                </TabsTrigger>
                            )}
                        </TabsList>
                    </div>

                    {/* Branding Tab */}
                    <TabsContent value="branding" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Brand Identity</CardTitle>
                                <CardDescription>Customize your checkout's visual appearance</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Logo Upload */}
                                <div className="space-y-2">
                                    <Label>Checkout Logo</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Upload your store logo to display at the top of the checkout page
                                    </p>
                                    {settings.logoUrl && (
                                        <div className="mb-2 p-4 border rounded-lg bg-muted/50 flex items-center justify-center">
                                            <img src={settings.logoUrl} alt="Logo" className="h-12 object-contain" />
                                        </div>
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        disabled={uploadingLogo}
                                    />
                                    {uploadingLogo && <p className="text-sm text-muted-foreground">Uploading...</p>}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Primary Color */}
                                    <div className="space-y-2">
                                        <Label htmlFor="primaryColor">Primary Color</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Main color for buttons and accents
                                        </p>
                                        <div className="flex gap-2">
                                            <Input
                                                id="primaryColor"
                                                type="color"
                                                value={settings.primaryColor || '#000000'}
                                                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                                className="w-20 h-10 cursor-pointer"
                                            />
                                            <Input
                                                type="text"
                                                value={settings.primaryColor || '#000000'}
                                                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                                placeholder="#000000"
                                                className="font-mono"
                                            />
                                        </div>
                                    </div>

                                    {/* Secondary Color */}
                                    <div className="space-y-2">
                                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                                        <p className="text-sm text-muted-foreground">Color for secondary elements</p>
                                        <div className="flex gap-2">
                                            <Input
                                                id="secondaryColor"
                                                type="color"
                                                value={settings.secondaryColor || '#666666'}
                                                onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                                className="w-20 h-10 cursor-pointer"
                                            />
                                            <Input
                                                type="text"
                                                value={settings.secondaryColor || '#666666'}
                                                onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                                placeholder="#666666"
                                                className="font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    {/* Button Style */}
                                    <div className="space-y-2">
                                        <Label htmlFor="buttonStyle">Button Style</Label>
                                        <Select
                                            value={settings.buttonStyle || 'rounded'}
                                            onValueChange={(value: any) => setSettings({ ...settings, buttonStyle: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="rounded">Rounded</SelectItem>
                                                <SelectItem value="square">Square</SelectItem>
                                                <SelectItem value="pill">Pill</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Font Family */}
                                    <div className="space-y-2">
                                        <Label htmlFor="fontFamily">Font Family</Label>
                                        <Select
                                            value={settings.fontFamily || 'system'}
                                            onValueChange={(value: any) => setSettings({ ...settings, fontFamily: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="system">System</SelectItem>
                                                <SelectItem value="inter">Inter</SelectItem>
                                                <SelectItem value="roboto">Roboto</SelectItem>
                                                <SelectItem value="opensans">Open Sans</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Page Width */}
                                    <div className="space-y-2">
                                        <Label htmlFor="pageWidth">Page Width</Label>
                                        <Select
                                            value={settings.pageWidth || 'normal'}
                                            onValueChange={(value: any) => setSettings({ ...settings, pageWidth: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="narrow">Narrow</SelectItem>
                                                <SelectItem value="normal">Normal</SelectItem>
                                                <SelectItem value="wide">Wide</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Layout Tab */}
                    <TabsContent value="layout" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Layout Configuration</CardTitle>
                                <CardDescription>Control the structure and flow of your checkout</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Checkout Layout */}
                                <div>
                                    <Label htmlFor="checkoutLayout">Checkout Type</Label>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Choose between single-page or multi-step checkout
                                    </p>
                                    <Select
                                        value={settings.checkoutLayout || 'single'}
                                        onValueChange={(value: any) => setSettings({ ...settings, checkoutLayout: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="single">Single Page</SelectItem>
                                            <SelectItem value="multi-step">Multi-Step</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Progress Style */}
                                {settings.checkoutLayout === 'multi-step' && (
                                    <div>
                                        <Label htmlFor="progressStyle">Progress Indicator</Label>
                                        <Select
                                            value={settings.progressStyle || 'steps'}
                                            onValueChange={(value: any) => setSettings({ ...settings, progressStyle: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="steps">Step Numbers</SelectItem>
                                                <SelectItem value="bar">Progress Bar</SelectItem>
                                                <SelectItem value="none">No Indicator</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* Order Summary Position */}
                                <div>
                                    <Label htmlFor="orderSummaryPosition">Order Summary Position</Label>
                                    <Select
                                        value={settings.orderSummaryPosition || 'right'}
                                        onValueChange={(value: any) => setSettings({ ...settings, orderSummaryPosition: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="right">Right Sidebar</SelectItem>
                                            <SelectItem value="top">Above Form</SelectItem>
                                            <SelectItem value="collapsible">Collapsible</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Messages Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Custom Messages</CardTitle>
                                <CardDescription>Add custom messages to enhance the checkout experience</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="checkoutBanner">Checkout Banner</Label>
                                    <Textarea
                                        id="checkoutBanner"
                                        value={settings.checkoutBanner || ''}
                                        onChange={(e) => setSettings({ ...settings, checkoutBanner: e.target.value })}
                                        placeholder="e.g., Free shipping on orders over 500 MAD!"
                                        rows={3}
                                    />
                                    <div className="mt-2">
                                        <Label htmlFor="bannerType">Banner Type</Label>
                                        <Select
                                            value={settings.checkoutBannerType || 'info'}
                                            onValueChange={(value) => setSettings({ ...settings, checkoutBannerType: value })}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="info">Info (Blue)</SelectItem>
                                                <SelectItem value="success">Success (Green)</SelectItem>
                                                <SelectItem value="warning">Warning (Yellow)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="thankYouMessage">Thank You Message</Label>
                                    <Textarea
                                        id="thankYouMessage"
                                        value={settings.thankYouMessage || ''}
                                        onChange={(e) => setSettings({ ...settings, thankYouMessage: e.target.value })}
                                        placeholder="Thank you for your order! We'll process it shortly."
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Fields Tab */}
                    <TabsContent value="fields" className="space-y-6">
                        {/* Field Visibility */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Field Visibility</CardTitle>
                                <CardDescription>Control which fields are shown in the checkout form</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FieldToggle
                                    label="Phone Number Field"
                                    description="Show phone number input in checkout"
                                    checked={settings.showPhone}
                                    onChange={(checked) => setSettings({ ...settings, showPhone: checked })}
                                />

                                {settings.showPhone && (
                                    <div className="pl-6">
                                        <FieldToggle
                                            label="Require Phone Number"
                                            description="Make phone number a required field"
                                            checked={settings.requirePhone}
                                            onChange={(checked) => setSettings({ ...settings, requirePhone: checked })}
                                        />
                                    </div>
                                )}

                                <FieldToggle
                                    label="Company Field"
                                    description="Show company name input in checkout"
                                    checked={settings.showCompany}
                                    onChange={(checked) => setSettings({ ...settings, showCompany: checked })}
                                />

                                <FieldToggle
                                    label="Address Line 2"
                                    description="Show second address line (apartment, suite, etc.)"
                                    checked={settings.showAddressLine2}
                                    onChange={(checked) => setSettings({ ...settings, showAddressLine2: checked })}
                                />

                                <FieldToggle
                                    label="Order Notes"
                                    description="Allow customers to add notes to their order"
                                    checked={settings.enableOrderNotes}
                                    onChange={(checked) => setSettings({ ...settings, enableOrderNotes: checked })}
                                />

                                {settings.enableOrderNotes && (
                                    <div className="pl-6">
                                        <Label htmlFor="orderNotesLabel">Order Notes Label</Label>
                                        <Input
                                            id="orderNotesLabel"
                                            value={settings.orderNotesLabel || ''}
                                            onChange={(e) => setSettings({ ...settings, orderNotesLabel: e.target.value })}
                                            placeholder="Order notes (optional)"
                                            className="mt-2"
                                        />
                                    </div>
                                )}

                                <div className="border-t pt-4 mt-4">
                                    <h4 className="font-semibold mb-3">Additional Fields</h4>
                                </div>

                                <FieldToggle
                                    label="Alternative Phone Number"
                                    description="Show field for a second phone number"
                                    checked={settings.showAlternativePhone}
                                    onChange={(checked) => setSettings({ ...settings, showAlternativePhone: checked })}
                                />

                                <FieldToggle
                                    label="Delivery Instructions"
                                    description="Allow customers to provide delivery instructions"
                                    checked={settings.showDeliveryInstructions}
                                    onChange={(checked) => setSettings({ ...settings, showDeliveryInstructions: checked })}
                                />

                                {settings.showDeliveryInstructions && (
                                    <div className="pl-6">
                                        <Label htmlFor="deliveryInstructionsLabel">Delivery Instructions Label</Label>
                                        <Input
                                            id="deliveryInstructionsLabel"
                                            value={settings.deliveryInstructionsLabel || ''}
                                            onChange={(e) =>
                                                setSettings({ ...settings, deliveryInstructionsLabel: e.target.value })
                                            }
                                            placeholder="Delivery instructions"
                                            className="mt-2"
                                        />
                                    </div>
                                )}

                                <FieldToggle
                                    label="Gift Message"
                                    description="Allow customers to add a gift message"
                                    checked={settings.showGiftMessage}
                                    onChange={(checked) => setSettings({ ...settings, showGiftMessage: checked })}
                                />

                                {settings.showGiftMessage && (
                                    <div className="pl-6">
                                        <Label htmlFor="giftMessageLabel">Gift Message Label</Label>
                                        <Input
                                            id="giftMessageLabel"
                                            value={settings.giftMessageLabel || ''}
                                            onChange={(e) => setSettings({ ...settings, giftMessageLabel: e.target.value })}
                                            placeholder="Gift message"
                                            className="mt-2"
                                        />
                                    </div>
                                )}

                                <FieldToggle
                                    label="Preferred Delivery Date"
                                    description="Show date picker for preferred delivery date"
                                    checked={settings.showDeliveryDate}
                                    onChange={(checked) => setSettings({ ...settings, showDeliveryDate: checked })}
                                />
                            </CardContent>
                        </Card>

                        {/* Custom Fields */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Custom Fields</CardTitle>
                                        <CardDescription>Add up to 5 custom fields to collect additional information</CardDescription>
                                    </div>
                                    <Button
                                        onClick={addCustomField}
                                        disabled={(settings.customFields?.length || 0) >= 5}
                                        size="sm"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Field
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {settings.customFields && settings.customFields.length > 0 ? (
                                    settings.customFields.map((field, index) => (
                                        <Card key={field.id} className="p-4">
                                            <div className="flex items-start gap-4">
                                                <GripVertical className="h-5 w-5 text-muted-foreground mt-2 cursor-move" />
                                                <div className="flex-1 space-y-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <Label>Field Label</Label>
                                                            <Input
                                                                value={field.label}
                                                                onChange={(e) =>
                                                                    updateCustomField(field.id, { label: e.target.value })
                                                                }
                                                                placeholder="e.g., Company Tax ID"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Field Type</Label>
                                                            <Select
                                                                value={field.type}
                                                                onValueChange={(value: any) =>
                                                                    updateCustomField(field.id, { type: value })
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="text">Text</SelectItem>
                                                                    <SelectItem value="textarea">Text Area</SelectItem>
                                                                    <SelectItem value="select">Dropdown</SelectItem>
                                                                    <SelectItem value="checkbox">Checkbox</SelectItem>
                                                                    <SelectItem value="date">Date</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Label>Placeholder</Label>
                                                        <Input
                                                            value={field.placeholder || ''}
                                                            onChange={(e) =>
                                                                updateCustomField(field.id, { placeholder: e.target.value })
                                                            }
                                                            placeholder="Placeholder text..."
                                                        />
                                                    </div>

                                                    {field.type === 'select' && (
                                                        <div>
                                                            <Label>Options (comma-separated)</Label>
                                                            <Input
                                                                value={field.options?.join(', ') || ''}
                                                                onChange={(e) =>
                                                                    updateCustomField(field.id, {
                                                                        options: e.target.value.split(',').map((o) => o.trim()),
                                                                    })
                                                                }
                                                                placeholder="Option 1, Option 2, Option 3"
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <Switch
                                                                checked={field.required}
                                                                onCheckedChange={(checked) =>
                                                                    updateCustomField(field.id, { required: checked })
                                                                }
                                                            />
                                                            <Label className="text-sm">Required field</Label>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => deleteCustomField(field.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>No custom fields added yet</p>
                                        <p className="text-sm mt-1">Click "Add Field" to create your first custom field</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Phase 4: Trust & Security Tab */}
                    <TabsContent value="trust" className="space-y-6">
                        <Phase4Tab settings={settings} setSettings={setSettings} />
                    </TabsContent>

                    {/* Phase 5: Marketing & Conversion Tab */}
                    <TabsContent value="marketing" className="space-y-6">
                        <Phase5Tab settings={settings} setSettings={setSettings} />
                    </TabsContent>

                    {/* Basic Customization Tab (Original Settings) */}
                    <TabsContent value="customization" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Shipping Settings</CardTitle>
                                <CardDescription>Configure shipping costs and thresholds</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="defaultShippingCost">Default Shipping Cost (MAD)</Label>
                                    <Input
                                        id="defaultShippingCost"
                                        type="number"
                                        step="0.01"
                                        value={settings.defaultShippingCost}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                defaultShippingCost: parseFloat(e.target.value) || 0,
                                            })
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (MAD)</Label>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Orders above this amount get free shipping (leave empty to disable)
                                    </p>
                                    <Input
                                        id="freeShippingThreshold"
                                        type="number"
                                        step="0.01"
                                        value={settings.freeShippingThreshold || ''}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                freeShippingThreshold: e.target.value ? parseFloat(e.target.value) : null,
                                            })
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Guest Checkout</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Allow customers to checkout without creating an account
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.enableGuestCheckout}
                                        onCheckedChange={(checked) => setSettings({ ...settings, enableGuestCheckout: checked })}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Regions & Cities Tab (Keep existing functionality) */}
                    <TabsContent value="locations" className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Regions</CardTitle>
                                    <CardDescription>Manage Moroccan regions for checkout</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input
                                            value={newRegionName}
                                            onChange={(e) => setNewRegionName(e.target.value)}
                                            placeholder="Region name"
                                            onKeyPress={(e) => e.key === 'Enter' && addRegion()}
                                        />
                                        <Button onClick={addRegion} disabled={addingRegion}>
                                            {addingRegion ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                        </Button>
                                    </div>

                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {regions.map((region) => (
                                            <div key={region.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{region.name}</p>
                                                    <p className="text-sm text-muted-foreground">{region._count?.cities || 0} cities</p>
                                                </div>
                                                <Button variant="ghost" size="sm" onClick={() => deleteRegion(region.id)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Cities</CardTitle>
                                    <CardDescription>Manage cities within regions</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Select value={selectedRegionForCity} onValueChange={setSelectedRegionForCity}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select region" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {regions.map((region) => (
                                                    <SelectItem key={region.id} value={region.id}>
                                                        {region.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <div className="flex gap-2">
                                            <Input
                                                value={newCityName}
                                                onChange={(e) => setNewCityName(e.target.value)}
                                                placeholder="City name"
                                                onKeyPress={(e) => e.key === 'Enter' && addCity()}
                                            />
                                            <Button onClick={addCity} disabled={addingCity}>
                                                {addingCity ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {cities.map((city) => (
                                            <div key={city.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{city.name}</p>
                                                    <p className="text-sm text-muted-foreground">{city.region?.name}</p>
                                                </div>
                                                <Button variant="ghost" size="sm" onClick={() => deleteCity(city.id)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            {/* Preview Modal - Opens as a popup overlay */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-[98vw] max-h-[98vh] w-[98vw] h-[98vh] overflow-auto p-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-4">
                            Checkout Preview

                            {/* Device Preview Buttons */}
                            <div className="flex gap-2 ml-auto">
                                <Button
                                    variant={previewMode === 'desktop' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setPreviewMode('desktop')}
                                >
                                    <Monitor className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={previewMode === 'tablet' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setPreviewMode('tablet')}
                                >
                                    <Tablet className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={previewMode === 'mobile' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setPreviewMode('mobile')}
                                >
                                    <Smartphone className="h-4 w-4" />
                                </Button>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    {/* Preview Content */}
                    <div className="mt-4">
                        {settings && <CheckoutPreview settings={settings} viewMode={previewMode} />}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Helper component for field toggles
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
