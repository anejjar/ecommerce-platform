'use client';

import { ProductDescriptionBlock } from '@/lib/product-description-blocks';
import { Button } from '@/components/ui/button';
import { X, Trash2 } from 'lucide-react';
import { HeroBlockEditor } from '../product-blocks/HeroBlockEditor';
import { ImageTextBlockEditor } from '../product-blocks/ImageTextBlockEditor';
import { FeaturesBlockEditor } from '../product-blocks/FeaturesBlockEditor';
import { GalleryBlockEditor } from '../product-blocks/GalleryBlockEditor';
import { TestimonialsBlockEditor } from '../product-blocks/TestimonialsBlockEditor';
import { FAQBlockEditor } from '../product-blocks/FAQBlockEditor';
import { CTABlockEditor } from '../product-blocks/CTABlockEditor';
import { TextBlockEditor } from '../product-blocks/TextBlockEditor';
import { VideoBlockEditor } from '../product-blocks/VideoBlockEditor';
import { ComparisonBlockEditor } from '../product-blocks/ComparisonBlockEditor';
import { BenefitsBlockEditor } from '../product-blocks/BenefitsBlockEditor';
import { StatsBlockEditor } from '../product-blocks/StatsBlockEditor';
import { PricingTableBlockEditor } from '../product-blocks/PricingTableBlockEditor';

interface BlockConfigPanelProps {
  block: ProductDescriptionBlock;
  onUpdate: (config: Record<string, any>) => void;
  onClose: () => void;
  onDelete?: () => void;
}

export function BlockConfigPanel({ block, onUpdate, onClose, onDelete }: BlockConfigPanelProps) {
  const renderEditor = () => {
    switch (block.type) {
      case 'hero':
        return <HeroBlockEditor config={block.config} onUpdate={onUpdate} />;
      case 'image-text':
        return <ImageTextBlockEditor config={block.config} onUpdate={onUpdate} />;
      case 'features':
        return <FeaturesBlockEditor config={block.config} onUpdate={onUpdate} />;
      case 'gallery':
        return <GalleryBlockEditor config={block.config} onUpdate={onUpdate} />;
      case 'testimonials':
        return <TestimonialsBlockEditor config={block.config} onUpdate={onUpdate} />;
      case 'faq':
        return <FAQBlockEditor config={block.config} onUpdate={onUpdate} />;
      case 'cta':
        return <CTABlockEditor config={block.config} onUpdate={onUpdate} />;
      case 'text':
        return <TextBlockEditor config={block.config} onUpdate={onUpdate} />;
      case 'video':
        return <VideoBlockEditor config={block.config} onUpdate={onUpdate} />;
      case 'comparison':
        return <ComparisonBlockEditor config={block.config} onUpdate={onUpdate} />;
      case 'benefits':
        return <BenefitsBlockEditor config={block.config} onUpdate={onUpdate} />;
      case 'stats':
        return <StatsBlockEditor config={block.config} onUpdate={onUpdate} />;
      case 'pricing-table':
        return <PricingTableBlockEditor config={block.config} onUpdate={onUpdate} />;
      default:
        return <div>Unknown block type</div>;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {renderEditor()}
      {onDelete && (
        <div className="pt-4 border-t">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm('Are you sure you want to delete this block?')) {
                onDelete();
              }
            }}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Block
          </Button>
        </div>
      )}
    </div>
  );
}

