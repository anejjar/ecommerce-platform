'use client';

import { ProductDescriptionBlock } from '@/lib/product-description-blocks';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2, Copy, Plus } from 'lucide-react';
import { HeroBlock } from '../product-blocks/HeroBlock';
import { ImageTextBlock } from '../product-blocks/ImageTextBlock';
import { FeaturesBlock } from '../product-blocks/FeaturesBlock';
import { GalleryBlock } from '../product-blocks/GalleryBlock';
import { TestimonialsBlock } from '../product-blocks/TestimonialsBlock';
import { FAQBlock } from '../product-blocks/FAQBlock';
import { CTABlock } from '../product-blocks/CTABlock';
import { TextBlock } from '../product-blocks/TextBlock';
import { VideoBlock } from '../product-blocks/VideoBlock';
import { ComparisonBlock } from '../product-blocks/ComparisonBlock';
import { BenefitsBlock } from '../product-blocks/BenefitsBlock';
import { StatsBlock } from '../product-blocks/StatsBlock';
import { PricingTableBlock } from '../product-blocks/PricingTableBlock';

interface PreviewCanvasProps {
  blocks: ProductDescriptionBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
  onDuplicateBlock: (blockId: string) => void;
  onReorderBlocks: (fromIndex: number, toIndex: number) => void;
}

function renderBlock(block: ProductDescriptionBlock) {
  switch (block.type) {
    case 'hero':
      return <HeroBlock config={block.config} />;
    case 'image-text':
      return <ImageTextBlock config={block.config} />;
    case 'features':
      return <FeaturesBlock config={block.config} />;
    case 'gallery':
      return <GalleryBlock config={block.config} />;
    case 'testimonials':
      return <TestimonialsBlock config={block.config} />;
    case 'faq':
      return <FAQBlock config={block.config} />;
    case 'cta':
      return <CTABlock config={block.config} />;
    case 'text':
      return <TextBlock config={block.config} />;
    case 'video':
      return <VideoBlock config={block.config} />;
    case 'comparison':
      return <ComparisonBlock config={block.config} />;
    case 'benefits':
      return <BenefitsBlock config={block.config} />;
    case 'stats':
      return <StatsBlock config={block.config} />;
    case 'pricing-table':
      return <PricingTableBlock config={block.config} />;
    default:
      return null;
  }
}

export function PreviewCanvas({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onReorderBlocks,
}: PreviewCanvasProps) {
  if (blocks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center p-8">
        <div>
          <p className="text-gray-500 mb-4">No blocks yet. Add a block from the sidebar to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {blocks.map((block, index) => {
        const isSelected = block.id === selectedBlockId;
        
        return (
          <div key={block.id} className="relative group">
            {/* Block Container */}
            <div
              className={`border-2 rounded-lg transition-all relative ${
                isSelected
                  ? 'border-blue-500 shadow-lg'
                  : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => onSelectBlock(block.id)}
            >
              {/* Block Controls - Top Right Corner */}
              <div className={`absolute top-2 right-2 flex gap-1 transition-opacity z-20 bg-white rounded shadow-sm p-1 ${
                isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateBlock(block.id);
                  }}
                  title="Duplicate"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this block?')) {
                      onDeleteBlock(block.id);
                    }
                  }}
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Reorder Controls - Left Side */}
              {index > 0 && (
                <div className={`absolute left-2 top-2 transition-opacity z-20 ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 bg-white rounded shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderBlocks(index, index - 1);
                    }}
                    title="Move Up"
                  >
                    <GripVertical className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}

              {/* Block Content */}
              <div className="bg-white rounded-lg">
                {renderBlock(block)}
              </div>
            </div>

            {/* Add Block Button Between Blocks */}
            {index < blocks.length - 1 && (
              <div className="flex justify-center my-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    // This will be handled by parent to add block at position
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Block
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

