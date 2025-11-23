'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getFeatureDoc } from '@/lib/feature-docs';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Lightbulb,
  Settings,
  ListChecks,
  Code,
  Link as LinkIcon,
  ArrowLeft,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

export default function FeatureDocPage({
  params,
}: {
  params: Promise<{ featureKey: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const feature = getFeatureDoc(resolvedParams.featureKey);

  if (!feature) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Documentation Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The documentation for feature "{resolvedParams.featureKey}" could not be found.
            </p>
            <Button onClick={() => router.push('/admin/features')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Features
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'partial':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'FREE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PRO':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ENTERPRISE':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push('/admin/features')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Features
        </Button>
      </div>

      {/* Title Section */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-3xl">{feature.title}</CardTitle>
              </div>
              <CardDescription className="text-lg mt-2">
                {feature.overview}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2">
              <Badge className={`${getTierColor(feature.tier)} border text-sm px-3 py-1`}>
                {feature.tier}
              </Badge>
              <Badge className={`${getStatusColor(feature.status)} border flex items-center gap-1.5 text-sm px-3 py-1`}>
                {getStatusIcon(feature.status)}
                {feature.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-yellow-600" />
            <CardTitle>Key Benefits</CardTitle>
          </div>
          <CardDescription>
            Why you should use this feature
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {feature.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-600" />
            <CardTitle>How It Works</CardTitle>
          </div>
          <CardDescription>
            Understanding the feature mechanism
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{feature.howItWorks}</p>
        </CardContent>
      </Card>

      {/* How to Use */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-purple-600" />
            <CardTitle>How to Use</CardTitle>
          </div>
          <CardDescription>
            Step-by-step guide to using this feature
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {feature.howToUse.map((step, index) => (
              <div key={step.step}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                    <p className="text-muted-foreground mb-2">{step.description}</p>
                    {step.location && (
                      <Link
                        href={step.location}
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1.5"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Go to {step.location}
                      </Link>
                    )}
                  </div>
                </div>
                {index < feature.howToUse.length - 1 && (
                  <Separator className="mt-6" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Setup Required */}
      {feature.setupRequired && feature.setupRequired.length > 0 && (
        <Card className="border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-orange-600" />
              <CardTitle className="text-orange-900 dark:text-orange-100">Setup Required</CardTitle>
            </div>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              Complete these steps before using this feature
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feature.setupRequired.map((step) => (
                <div key={step.step} className="flex gap-4 p-4 bg-white dark:bg-gray-950 rounded-lg border border-orange-300 dark:border-orange-800">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Details */}
      {feature.technicalDetails && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-gray-600" />
              <CardTitle>Technical Details</CardTitle>
            </div>
            <CardDescription>
              Developer information and implementation details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {feature.technicalDetails.database && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-blue-600">📊</span>
                    Database Schema
                  </h4>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border font-mono text-sm">
                    {feature.technicalDetails.database}
                  </div>
                </div>
              )}

              {feature.technicalDetails.apis && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-green-600">🔌</span>
                    API Endpoints
                  </h4>
                  <div className="space-y-2">
                    {feature.technicalDetails.apis.map((api, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-900 rounded border">
                        <code className="text-sm text-blue-600 dark:text-blue-400">{api}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {feature.technicalDetails.components && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-purple-600">⚛️</span>
                    Components
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {feature.technicalDetails.components.map((component, index) => (
                      <Badge key={index} variant="outline" className="font-mono">
                        {component}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related Features */}
      {feature.relatedFeatures && feature.relatedFeatures.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <LinkIcon className="h-6 w-6 text-green-600" />
              <CardTitle>Related Features</CardTitle>
            </div>
            <CardDescription>
              Features that work well with {feature.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-3">
              {feature.relatedFeatures.map((relatedKey, index) => {
                const relatedFeature = getFeatureDoc(relatedKey);
                return (
                  <Link
                    key={index}
                    href={`/admin/features/docs/${relatedKey}`}
                    className="p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <div className="font-medium mb-1">
                      {relatedFeature?.title || relatedKey.replace(/_/g, ' ')}
                    </div>
                    {relatedFeature && (
                      <Badge variant="secondary" className="text-xs">
                        {relatedFeature.status}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {feature.notes && feature.notes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feature.notes.map((note, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <span className="text-blue-600 text-lg mt-0.5">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Footer Actions */}
      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={() => router.push('/admin/features')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Features
        </Button>
        <div className="text-sm text-muted-foreground">
          Category: <Badge variant="secondary">{feature.category.replace(/_/g, ' ')}</Badge>
        </div>
      </div>
    </div>
  );
}
