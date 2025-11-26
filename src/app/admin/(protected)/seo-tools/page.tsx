'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Link as LinkIcon, Code2, FileText, BarChart3 } from 'lucide-react';
import { UrlRedirectsTab } from '@/components/admin/seo/UrlRedirectsTab';
import { SchemaMarkupTab } from '@/components/admin/seo/SchemaMarkupTab';
import { SeoSettingsTab } from '@/components/admin/seo/SeoSettingsTab';
import { SeoAuditTab } from '@/components/admin/seo/SeoAuditTab';

export default function SEOToolsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced SEO Tools</h1>
          <p className="text-muted-foreground mt-2">
            Manage your store's search engine optimization, redirects, and structured data
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">
          PRO Feature
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="general" className="gap-2">
            <Search className="h-4 w-4" />
            General SEO
          </TabsTrigger>
          <TabsTrigger value="redirects" className="gap-2">
            <LinkIcon className="h-4 w-4" />
            URL Redirects
          </TabsTrigger>
          <TabsTrigger value="schema" className="gap-2">
            <Code2 className="h-4 w-4" />
            Schema Markup
          </TabsTrigger>
          <TabsTrigger value="sitemap" className="gap-2">
            <FileText className="h-4 w-4" />
            Sitemap & Robots
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            SEO Audit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <SeoSettingsTab />
        </TabsContent>

        <TabsContent value="redirects">
          <UrlRedirectsTab />
        </TabsContent>

        <TabsContent value="schema">
          <SchemaMarkupTab />
        </TabsContent>

        <TabsContent value="sitemap">
          <Card>
            <CardHeader>
              <CardTitle>Sitemap & Robots.txt</CardTitle>
              <CardDescription>
                Configure your XML sitemap and robots.txt file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-semibold mb-2">XML Sitemap</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Your sitemap is automatically generated and updated
                </p>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View Sitemap →
                </a>
              </div>

              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-semibold mb-2">Robots.txt</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Configure robots.txt from Settings → SEO Settings
                </p>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View Robots.txt →
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <SeoAuditTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
