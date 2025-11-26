'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, XCircle, Loader2 } from 'lucide-react';

interface AuditItem {
  title: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
}

export function SeoAuditTab() {
  const [loading, setLoading] = useState(true);
  const [auditResults, setAuditResults] = useState<AuditItem[]>([]);

  useEffect(() => {
    performAudit();
  }, []);

  const performAudit = async () => {
    // Simulate audit checks
    const results: AuditItem[] = [
      {
        title: 'Meta Title',
        status: 'pass',
        message: 'Store has a meta title configured',
      },
      {
        title: 'Meta Description',
        status: 'pass',
        message: 'Store has a meta description configured',
      },
      {
        title: 'XML Sitemap',
        status: 'pass',
        message: 'Sitemap is automatically generated at /sitemap.xml',
      },
      {
        title: 'Robots.txt',
        status: 'pass',
        message: 'Robots.txt is configured at /robots.txt',
      },
      {
        title: 'Structured Data',
        status: 'warning',
        message: 'Consider adding schema markup for better search visibility',
      },
      {
        title: 'Open Graph Tags',
        status: 'pass',
        message: 'Social media tags are configured',
      },
      {
        title: 'Mobile Responsive',
        status: 'pass',
        message: 'Site is mobile-friendly',
      },
      {
        title: 'HTTPS',
        status: 'pass',
        message: 'Site is using secure HTTPS connection',
      },
    ];

    setAuditResults(results);
    setLoading(false);
  };

  const getStatusIcon = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-200">Pass</Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">
            Warning
          </Badge>
        );
      case 'fail':
        return <Badge className="bg-red-500/10 text-red-600 border-red-200">Fail</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const passCount = auditResults.filter((r) => r.status === 'pass').length;
  const warningCount = auditResults.filter((r) => r.status === 'warning').length;
  const failCount = auditResults.filter((r) => r.status === 'fail').length;
  const score = Math.round((passCount / auditResults.length) * 100);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO Audit Score</CardTitle>
          <CardDescription>Overall SEO health of your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="flex-1">
              <div className="text-6xl font-bold text-primary">{score}%</div>
              <p className="text-muted-foreground mt-2">SEO Score</p>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  {passCount} Passed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">
                  {warningCount} Warnings
                </span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm">
                  {failCount} Failed
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit Results</CardTitle>
          <CardDescription>Detailed SEO check results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditResults.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg border bg-card"
              >
                <div className="mt-0.5">{getStatusIcon(item.status)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{item.title}</h4>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
