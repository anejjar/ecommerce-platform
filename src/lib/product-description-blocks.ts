export type BlockType = 'hero' | 'image-text' | 'features' | 'gallery' | 'testimonials' | 'faq' | 'cta' | 'text' | 'video' | 'comparison' | 'benefits' | 'stats' | 'pricing-table';

export interface ProductDescriptionBlock {
  id: string;
  type: BlockType;
  config: Record<string, any>;
  order: number;
}

export interface ProductDescriptionData {
  version: '1.0';
  blocks: ProductDescriptionBlock[];
}

/**
 * Check if content is JSON (blocks) or HTML (legacy)
 */
export function isBlockFormat(content: string | null): boolean {
  if (!content) return false;
  const trimmed = content.trim();
  if (!trimmed.startsWith('{')) return false;
  
  try {
    const parsed = JSON.parse(trimmed);
    return parsed && typeof parsed === 'object' && 'version' in parsed && Array.isArray(parsed.blocks);
  } catch {
    return false;
  }
}

/**
 * Serialize blocks to JSON string for storage
 */
export function serializeBlocks(blocks: ProductDescriptionBlock[]): string {
  if (blocks.length === 0) {
    return ''; // Return empty string if no blocks
  }
  const data: ProductDescriptionData = {
    version: '1.0',
    blocks: blocks.sort((a, b) => a.order - b.order),
  };
  return JSON.stringify(data);
}

/**
 * Deserialize JSON string to blocks
 */
export function deserializeBlocks(content: string | null): ProductDescriptionBlock[] {
  if (!content) return [];
  
  try {
    const data: ProductDescriptionData = JSON.parse(content);
    if (data.version === '1.0' && Array.isArray(data.blocks)) {
      return data.blocks;
    }
  } catch (e) {
    // Not valid JSON, return empty array
  }
  
  return [];
}

/**
 * Generate a unique block ID
 */
export function generateBlockId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get default config for a block type
 */
export function getDefaultBlockConfig(type: BlockType): Record<string, any> {
  switch (type) {
    case 'hero':
      return {
        image: '',
        headline: '',
        subheadline: '',
        ctaText: '',
        ctaLink: '',
        backgroundColor: '',
      };
    case 'image-text':
      return {
        image: '',
        imagePosition: 'left',
        heading: '',
        text: '',
        backgroundColor: '',
      };
    case 'features':
      return {
        heading: '',
        features: [
          { icon: '', title: '', description: '' },
        ],
        layout: 'grid',
        columns: 3,
      };
    case 'gallery':
      return {
        heading: '',
        images: [],
        layout: 'grid',
        columns: 3,
      };
    case 'testimonials':
      return {
        heading: '',
        testimonials: [
          { name: '', role: '', image: '', text: '', rating: 5 },
        ],
        layout: 'grid',
      };
    case 'faq':
      return {
        heading: '',
        questions: [
          { question: '', answer: '' },
        ],
      };
    case 'cta':
      return {
        heading: '',
        text: '',
        buttonText: '',
        buttonLink: '',
        backgroundColor: '',
        backgroundImage: '',
      };
    case 'text':
      return {
        content: '',
        alignment: 'left',
        textSize: 'base',
      };
    case 'video':
      return {
        videoUrl: '',
        heading: '',
        description: '',
        autoplay: false,
        loop: false,
      };
    case 'comparison':
      return {
        heading: '',
        columns: [
          { title: '', features: [] },
          { title: '', features: [] },
        ],
      };
    case 'benefits':
      return {
        heading: '',
        benefits: [
          { icon: '', title: '', description: '' },
        ],
        layout: 'grid',
        columns: 2,
      };
    case 'stats':
      return {
        heading: '',
        stats: [
          { value: '', label: '', icon: '' },
        ],
        layout: 'grid',
        columns: 4,
      };
    case 'pricing-table':
      return {
        heading: '',
        plans: [
          { name: '', price: '', features: [], ctaText: '', ctaLink: '', highlighted: false },
        ],
      };
    default:
      return {};
  }
}

/**
 * Get block display name
 */
export function getBlockDisplayName(type: BlockType): string {
  const names: Record<BlockType, string> = {
    'hero': 'Hero Section',
    'image-text': 'Image + Text',
    'features': 'Features',
    'gallery': 'Image Gallery',
    'testimonials': 'Testimonials',
    'faq': 'FAQ',
    'cta': 'Call to Action',
    'text': 'Normal Text',
    'video': 'Video',
    'comparison': 'Comparison Table',
    'benefits': 'Benefits',
    'stats': 'Statistics',
    'pricing-table': 'Pricing Table',
  };
  return names[type] || type;
}

/**
 * Get block category
 */
export function getBlockCategory(type: BlockType): string {
  const categories: Record<BlockType, string> = {
    'hero': 'content',
    'image-text': 'content',
    'features': 'content',
    'gallery': 'media',
    'testimonials': 'social',
    'faq': 'content',
    'cta': 'action',
    'text': 'content',
    'video': 'media',
    'comparison': 'content',
    'benefits': 'content',
    'stats': 'content',
    'pricing-table': 'action',
  };
  return categories[type] || 'content';
}

/**
 * Get block description
 */
export function getBlockDescription(type: BlockType): string {
  const descriptions: Record<BlockType, string> = {
    'hero': 'Large image with headline and call-to-action',
    'image-text': 'Side-by-side image and text content',
    'features': 'List of product features or benefits',
    'gallery': 'Grid of product images',
    'testimonials': 'Customer reviews and testimonials',
    'faq': 'Frequently asked questions',
    'cta': 'Call-to-action banner',
    'text': 'Plain text content with formatting options',
    'video': 'Embed video from YouTube, Vimeo, or direct URL',
    'comparison': 'Compare features across different options',
    'benefits': 'Highlight product benefits with icons',
    'stats': 'Display statistics and key numbers',
    'pricing-table': 'Show pricing plans and features',
  };
  return descriptions[type] || '';
}

