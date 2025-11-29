'use client';

import { BlockType, getBlockDisplayName, getBlockDescription, getBlockCategory } from '@/lib/product-description-blocks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Image, FileText, Star, HelpCircle, ShoppingCart, Grid3x3, Video, BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import { useState, useMemo } from 'react';

interface BlockLibraryProps {
  onAddBlock: (type: BlockType, position?: number) => void;
}

const blockTypes: BlockType[] = [
  'hero', 
  'image-text', 
  'features', 
  'gallery', 
  'testimonials', 
  'faq', 
  'cta',
  'text',
  'video',
  'comparison',
  'benefits',
  'stats',
  'pricing-table',
];

const blockIcons: Record<BlockType, React.ReactNode> = {
  'hero': <Image className="w-5 h-5" />,
  'image-text': <FileText className="w-5 h-5" />,
  'features': <Grid3x3 className="w-5 h-5" />,
  'gallery': <Image className="w-5 h-5" />,
  'testimonials': <Star className="w-5 h-5" />,
  'faq': <HelpCircle className="w-5 h-5" />,
  'cta': <ShoppingCart className="w-5 h-5" />,
  'text': <FileText className="w-5 h-5" />,
  'video': <Video className="w-5 h-5" />,
  'comparison': <BarChart3 className="w-5 h-5" />,
  'benefits': <TrendingUp className="w-5 h-5" />,
  'stats': <BarChart3 className="w-5 h-5" />,
  'pricing-table': <DollarSign className="w-5 h-5" />,
};

export function BlockLibrary({ onAddBlock }: BlockLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set(blockTypes.map(type => getBlockCategory(type)));
    return ['all', ...Array.from(cats)];
  }, []);

  const filteredBlocks = useMemo(() => {
    return blockTypes.filter(type => {
      const matchesSearch = getBlockDisplayName(type).toLowerCase().includes(searchQuery.toLowerCase()) ||
        getBlockDescription(type).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || getBlockCategory(type) === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Blocks</h3>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-xs"
            >
              {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Block List */}
      <div className="space-y-2">
        {filteredBlocks.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No blocks found</p>
        ) : (
          filteredBlocks.map(type => (
            <button
              key={type}
              onClick={() => onAddBlock(type)}
              className="w-full text-left p-3 border rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-gray-400 group-hover:text-gray-600">
                  {blockIcons[type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900">
                    {getBlockDisplayName(type)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getBlockDescription(type)}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

