'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChangePasswordDialog } from '@/components/admin/ChangePasswordDialog';
import {
    Settings,
    Users,
    FileText,
    Search,
    Mail,
    LayoutTemplate,
    Truck,
    Share2,
    Palette,
    Languages,
    Lock,
    User,
    ShoppingCart,
    AlertTriangle,
    Image,
    Receipt
} from 'lucide-react';

interface FeatureFlags {
    template_manager: boolean;
    [key: string]: boolean;
}

export default function SettingsPage() {
    const [enabledFeatures, setEnabledFeatures] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const response = await fetch('/api/features/enabled');
                if (response.ok) {
                    const data = await response.json();
                    setEnabledFeatures(data.features || []);
                }
            } catch (error) {
                console.error('Error fetching features:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatures();
    }, []);

    const settingsItems = [
        {
            title: "General",
            description: "Configure general store settings, currency, and timezone.",
            href: "/admin/settings/general",
            icon: Settings,
            visible: true,
            premium: false
        },
        {
            title: "Admin Users",
            description: "Manage admin accounts, roles, and permissions.",
            href: "/admin/users",
            icon: Users,
            visible: enabledFeatures.includes('multi_admin')
        },
        {
            title: "Activity Logs",
            description: "View audit logs of all administrative actions.",
            href: "/admin/activity-logs",
            icon: FileText,
            visible: enabledFeatures.includes('activity_log')
        },
        {
            title: "SEO",
            description: "Manage search engine optimization settings and metadata.",
            href: "/admin/settings/seo",
            icon: Search,
            visible: true
        },
        {
            title: "Email",
            description: "Configure email settings, SMTP, and sender details.",
            href: "/admin/settings/email",
            icon: Mail,
            visible: true
        },
        {
            title: "Templates",
            description: "Manage templates for invoices, packing slips, and emails.",
            href: "/admin/templates",
            icon: LayoutTemplate,
            visible: enabledFeatures.includes('template_manager')
        },
        {
            title: "Invoice Settings",
            description: "Configure invoice templates, branding, numbering, and automation. Premium invoice management system.",
            href: "/admin/settings/invoices",
            icon: Receipt,
            visible: enabledFeatures.includes('invoice_generator'),
            premium: true
        },
        {
            title: "Checkout Settings",
            description: "Customize checkout fields, messages, and region/city management. Premium features include branding, trust elements, and marketing tools.",
            href: "/admin/settings/checkout",
            icon: ShoppingCart,
            visible: true,
            premium: false
        },
        {
            title: "Shipping & Tax",
            description: "Configure shipping zones, rates, and tax rules.",
            href: "/admin/settings/shipping",
            icon: Truck,
            visible: true
        },
        {
            title: "Social Media",
            description: "Manage social media links and integrations.",
            href: "/admin/settings/social",
            icon: Share2,
            visible: true
        },
        {
            title: "Appearance",
            description: "Customize your storefront color palette and visual appearance.",
            href: "/admin/settings/appearance",
            icon: Palette,
            visible: true
        },
        {
            title: "Translations",
            description: "Manage languages and translations.",
            href: "/admin/settings/translations",
            icon: Languages,
            visible: true
        },
        {
            title: "Media Library",
            description: "View and manage all uploaded media files.",
            href: "/admin/settings/media",
            icon: Image,
            visible: true
        },
        {
            title: "Stock Alerts",
            description: "Monitor low stock products and configure alert thresholds.",
            href: "/admin/settings/stock-alerts",
            icon: AlertTriangle,
            visible: true
        }
    ];

    if (loading) {
        return (
            <div className="space-y-8">
                <div>
                    <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-4 w-96 bg-muted animate-pulse rounded" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your store configuration and preferences.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Profile & Security Card */}
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <User className="w-5 h-5" />
                            </div>
                            <CardTitle className="text-lg">Profile & Security</CardTitle>
                        </div>
                        <CardDescription>
                            Manage your account password and security settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setChangePasswordOpen(true)}
                        >
                            <Lock className="w-4 h-4 mr-2" />
                            Change Password
                        </Button>
                    </CardContent>
                </Card>

                {/* Other Settings Cards */}
                {settingsItems.filter(item => item.visible).map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link key={item.href} href={item.href} className="block h-full">
                            <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer relative">
                                {item.premium && (
                                    <div className="absolute top-3 right-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                                            PREMIUM
                                        </span>
                                    </div>
                                )}
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <CardTitle className="text-lg">{item.title}</CardTitle>
                                    </div>
                                    <CardDescription>
                                        {item.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* Change Password Dialog */}
            <ChangePasswordDialog
                open={changePasswordOpen}
                onOpenChange={setChangePasswordOpen}
            />
        </div>
    );
}
