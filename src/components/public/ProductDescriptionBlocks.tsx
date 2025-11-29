'use client';

import { deserializeBlocks, isBlockFormat } from '@/lib/product-description-blocks';
import { HeroBlock } from './product-blocks/HeroBlock';
import { ImageTextBlock } from './product-blocks/ImageTextBlock';
import { FeaturesBlock } from './product-blocks/FeaturesBlock';
import { GalleryBlock } from './product-blocks/GalleryBlock';
import { TestimonialsBlock } from './product-blocks/TestimonialsBlock';
import { FAQBlock } from './product-blocks/FAQBlock';
import { CTABlock } from './product-blocks/CTABlock';
import { TextBlock } from './product-blocks/TextBlock';
import { VideoBlock } from './product-blocks/VideoBlock';
import { ComparisonBlock } from './product-blocks/ComparisonBlock';
import { BenefitsBlock } from './product-blocks/BenefitsBlock';
import { StatsBlock } from './product-blocks/StatsBlock';
import { PricingTableBlock } from './product-blocks/PricingTableBlock';

interface ProductDescriptionBlocksProps {
  content: string | null;
}

export function ProductDescriptionBlocks({ content }: ProductDescriptionBlocksProps) {
  if (!content || !content.trim()) {
    return null;
  }

  // Check if it's block format
  if (!isBlockFormat(content)) {
    return null;
  }

  const blocks = deserializeBlocks(content);

  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {blocks.map((block) => {
        if (!block || !block.type) return null;
        
        switch (block.type) {
          case 'hero':
            return <HeroBlock key={block.id} config={block.config || {}} />;
          case 'image-text':
            return <ImageTextBlock key={block.id} config={block.config || {}} />;
          case 'features':
            return <FeaturesBlock key={block.id} config={block.config || {}} />;
          case 'gallery':
            return <GalleryBlock key={block.id} config={block.config || {}} />;
          case 'testimonials':
            return <TestimonialsBlock key={block.id} config={block.config || {}} />;
          case 'faq':
            return <FAQBlock key={block.id} config={block.config || {}} />;
          case 'cta':
            return <CTABlock key={block.id} config={block.config || {}} />;
          case 'text':
            return <TextBlock key={block.id} config={block.config || {}} />;
          case 'video':
            return <VideoBlock key={block.id} config={block.config || {}} />;
          case 'comparison':
            return <ComparisonBlock key={block.id} config={block.config || {}} />;
          case 'benefits':
            return <BenefitsBlock key={block.id} config={block.config || {}} />;
          case 'stats':
            return <StatsBlock key={block.id} config={block.config || {}} />;
          case 'pricing-table':
            return <PricingTableBlock key={block.id} config={block.config || {}} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

