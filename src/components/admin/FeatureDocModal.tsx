'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FeatureDocumentation } from '@/lib/feature-docs';
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
} from 'lucide-react';
import Link from 'next/link';

interface FeatureDocModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: FeatureDocumentation | null;
}

export function FeatureDocModal({ open, onOpenChange, feature }: FeatureDocModalProps) {
  if (!feature) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />;
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{feature.title}</DialogTitle>
              <DialogDescription className="text-base">
                {feature.overview}
              </DialogDescription>
            </div>
            <div className="flex flex-col gap-2">
              <Badge className={`${getTierColor(feature.tier)} border`}>
                {feature.tier}
              </Badge>
              <Badge className={`${getStatusColor(feature.status)} border flex items-center gap-1`}>
                {getStatusIcon(feature.status)}
                {feature.status}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <div className="p-6 pt-0 space-y-6">
            {/* Benefits */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <h3 className="text-lg font-semibold">Key Benefits</h3>
              </div>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* How It Works */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Settings className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">How It Works</h3>
              </div>
              <p className="text-sm text-muted-foreground">{feature.howItWorks}</p>
            </div>

            <Separator />

            {/* How to Use */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ListChecks className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">How to Use</h3>
              </div>
              <div className="space-y-4">
                {feature.howToUse.map((step) => (
                  <div key={step.step} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      {step.location && !step.location.includes('[') && (
                        <Link
                          href={step.location}
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {step.location}
                        </Link>
                      )}
                      {step.location && step.location.includes('[') && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <ExternalLink className="h-3 w-3" />
                          {step.location.replace(/\[.*?\]/g, '...')} (dynamic route)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Setup Required */}
            {feature.setupRequired && feature.setupRequired.length > 0 && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <h3 className="text-lg font-semibold">Setup Required</h3>
                  </div>
                  <div className="space-y-3 bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-900">
                    {feature.setupRequired.map((step) => (
                      <div key={step.step} className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-semibold">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Technical Details */}
            {feature.technicalDetails && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Technical Details</h3>
                  </div>
                  <div className="space-y-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border">
                    {feature.technicalDetails.database && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Database</p>
                        <p className="text-sm font-mono">{feature.technicalDetails.database}</p>
                      </div>
                    )}
                    {feature.technicalDetails.apis && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">API Endpoints</p>
                        <ul className="space-y-1">
                          {feature.technicalDetails.apis.map((api, index) => (
                            <li key={index} className="text-sm font-mono text-blue-600">{api}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {feature.technicalDetails.components && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Components</p>
                        <div className="flex flex-wrap gap-2">
                          {feature.technicalDetails.components.map((component, index) => (
                            <Badge key={index} variant="outline" className="font-mono text-xs">
                              {component}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Related Features */}
            {feature.relatedFeatures && feature.relatedFeatures.length > 0 && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <LinkIcon className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold">Related Features</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {feature.relatedFeatures.map((relatedKey, index) => (
                      <Badge key={index} variant="secondary">
                        {relatedKey.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Notes */}
            {feature.notes && feature.notes.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold mb-2">Additional Notes</h3>
                  <ul className="space-y-1">
                    {feature.notes.map((note, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <div className="p-6 pt-4 border-t flex justify-between items-center">
          <Link href={`/admin/features/docs/${feature.key}`}>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Documentation
            </Button>
          </Link>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
