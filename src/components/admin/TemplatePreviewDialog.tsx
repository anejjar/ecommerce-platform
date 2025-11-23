'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, X, Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TemplatePreviewDialogProps {
  content: string;
  templateType: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Sample data for different template types
const getSampleData = (templateType: string) => {
  const baseData = {
    order: {
      number: 'ORD-12345',
      id: 'abc123def456',
      status: 'SHIPPED',
      subtotal: '$99.99',
      tax: '$8.50',
      shipping: '$10.00',
      total: '$118.49',
      date: 'November 23, 2024',
      notes: 'Please gift wrap',
    },
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
    },
    shipping: {
      name: 'John Doe',
      address1: '123 Main Street',
      address2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
      phone: '+1 (555) 123-4567',
    },
    billing: {
      name: 'John Doe',
      address1: '123 Main Street',
      city: 'New York',
    },
    store: {
      name: 'My Awesome Store',
      email: 'support@store.com',
      phone: '+1 (555) 999-0000',
      url: 'https://mystore.com',
      logo: 'https://mystore.com/logo.png',
    },
    items: [
      {
        name: 'Blue T-Shirt',
        sku: 'TS-BLU-M',
        quantity: 2,
        price: '$29.99',
        total: '$59.98',
      },
      {
        name: 'Red Cap',
        sku: 'CAP-RED',
        quantity: 1,
        price: '$19.99',
        total: '$19.99',
      },
    ],
    payment: {
      method: 'Credit Card',
      status: 'PAID',
    },
  };

  return baseData;
};

// Simple Handlebars-like template processor
const processTemplate = (content: string, data: any): string => {
  let processed = content;

  // Replace simple variables like {{order.number}}
  processed = processed.replace(/\{\{([^}#\/]+)\}\}/g, (match, path) => {
    const value = path.split('.').reduce((obj: any, key: string) => {
      return obj?.[key.trim()];
    }, data);
    return value !== undefined ? String(value) : match;
  });

  // Process {{#each items}} loops
  processed = processed.replace(
    /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
    (match, arrayName, loopContent) => {
      const array = data[arrayName];
      if (!Array.isArray(array)) return match;

      return array
        .map((item) => {
          let itemContent = loopContent;
          // Replace variables inside loop (e.g., {{items.name}} becomes {{name}})
          itemContent = itemContent.replace(
            new RegExp(`\\{\\{${arrayName}\\.([^}]+)\\}\\}`, 'g'),
            (m, prop) => {
              return item[prop] !== undefined ? String(item[prop]) : m;
            }
          );
          return itemContent;
        })
        .join('');
    }
  );

  // Process helper functions
  processed = processed.replace(/\{\{formatDate\s+([^}]+)\}\}/g, (match, dateVar) => {
    const value = dateVar.split('.').reduce((obj: any, key: string) => {
      return obj?.[key.trim()];
    }, data);
    return value || match;
  });

  processed = processed.replace(/\{\{formatCurrency\s+([^}]+)\}\}/g, (match, amountVar) => {
    const value = amountVar.split('.').reduce((obj: any, key: string) => {
      return obj?.[key.trim()];
    }, data);
    return value || match;
  });

  return processed;
};

export function TemplatePreviewDialog({
  content,
  templateType,
  open,
  onOpenChange,
}: TemplatePreviewDialogProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handleResetZoom = () => setZoom(100);

  const { preview, error } = useMemo(() => {
    try {
      const sampleData = getSampleData(templateType);

      // For email templates, process Handlebars and render HTML
      if (templateType.includes('EMAIL')) {
        const processedHtml = processTemplate(content, sampleData);
        return {
          preview: (
            <div className="border rounded-lg bg-white">
              <div className="bg-gray-100 px-4 py-2 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">From: {sampleData.store.email}</div>
                  <Badge variant="secondary" className="text-xs">Sample Email</Badge>
                </div>
              </div>
              <div className="p-4">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: processedHtml }}
                />
              </div>
            </div>
          ),
          error: null,
        };
      }

      // For PDF templates (Invoice/Packing Slip), show JSON structure
      if (templateType === 'INVOICE' || templateType === 'PACKING_SLIP') {
        try {
          const parsed = JSON.parse(content);
          const processedJson = JSON.parse(processTemplate(JSON.stringify(parsed), sampleData));

          return {
            preview: (
              <div className="border rounded-lg bg-white p-6">
                <div className="mb-4">
                  <Badge variant="secondary">PDF Template Configuration</Badge>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Document Settings</h3>
                    <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                      <div><span className="font-medium">Format:</span> {processedJson.format || 'A4'}</div>
                      <div><span className="font-medium">Orientation:</span> {processedJson.orientation || 'portrait'}</div>
                      <div><span className="font-medium">Title:</span> {processedJson.title || 'Document'}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Header</h3>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      {processedJson.header?.logo && (
                        <div className="mb-2">
                          <span className="font-medium">Logo:</span> {processedJson.header.logo}
                        </div>
                      )}
                      {processedJson.header?.text && (
                        <div>{processedJson.header.text}</div>
                      )}
                    </div>
                  </div>

                  {processedJson.sections && (
                    <div>
                      <h3 className="font-semibold mb-2">Sections</h3>
                      <div className="space-y-2">
                        {processedJson.sections.map((section: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 p-3 rounded text-sm">
                            <div className="font-medium mb-1">{section.title || `Section ${idx + 1}`}</div>
                            {section.content && <div className="text-xs text-gray-600">{section.content}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-4">
                    This is a preview of the template configuration. The actual PDF will be generated based on these settings.
                  </div>
                </div>
              </div>
            ),
            error: null,
          };
        } catch (jsonError) {
          return {
            preview: null,
            error: 'Invalid JSON format. Please check your template configuration.',
          };
        }
      }

      return { preview: null, error: null };
    } catch (err) {
      console.error('Preview error:', err);
      return {
        preview: null,
        error: 'Failed to render preview. Please check your template syntax.',
      };
    }
  }, [content, templateType]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${
          isFullscreen
            ? 'max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] m-0 rounded-none'
            : 'max-w-[95vw] w-[95vw] max-h-[95vh]'
        } p-0 gap-0 overflow-hidden flex flex-col`}
      >
        {/* Header with Controls */}
        <div className="border-b bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Eye className="w-5 h-5 text-primary" />
                Template Preview
              </DialogTitle>
              <DialogDescription className="mt-1">
                Preview your template with sample data
              </DialogDescription>
            </div>

            {/* Preview Controls */}
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 border rounded-lg px-2 py-1 bg-background">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <button
                  onClick={handleResetZoom}
                  className="px-3 py-1 text-sm font-medium hover:bg-accent rounded transition-colors min-w-[60px]"
                  title="Reset Zoom"
                >
                  {zoom}%
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleZoomIn}
                  disabled={zoom >= 150}
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              {/* Fullscreen Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                title="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          <div
            className="transition-transform duration-200 origin-top"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center'
            }}
          >
            {error ? (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-3xl mx-auto">
                <h3 className="font-semibold text-lg mb-2">Preview Error</h3>
                <p>{error}</p>
              </div>
            ) : (
              <div className="mx-auto" style={{ maxWidth: templateType.includes('EMAIL') ? '600px' : '100%' }}>
                {preview}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-background px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {templateType.replace('_', ' ')}
            </Badge>
            {templateType.includes('EMAIL') && (
              <span className="text-xs text-muted-foreground">
                Email templates are shown at 600px width for optimal display
              </span>
            )}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
