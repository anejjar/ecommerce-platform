'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    Languages
} from 'lucide-react';

interface FeatureFlags {
    template_manager: boolean;
    [key: string]: boolean;
}

export default function SettingsPage() {
    const [enabledFeatures, setEnabledFeatures] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

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
            visible: true
        },
        {
            title: "Admin Users",
            description: "Manage admin accounts, roles, and permissions.",
            href: "/admin/users",
            icon: Users,
            visible: true
        },
        {
            title: "Activity Logs",
            description: "View audit logs of all administrative actions.",
            href: "/admin/activity-logs",
            icon: FileText,
            visible: true
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
            description: "Customize the look and feel of your store.",
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
                {settingsItems.filter(item => item.visible).map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link key={item.href} href={item.href} className="block h-full">
                            <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
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
        </div>
    );
}
