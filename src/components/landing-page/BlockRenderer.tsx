'use client';

import React from 'react';
import { BlockCategory } from '@prisma/client';
import { HeroBackgroundImage } from './blocks/HeroBackgroundImage';
import { HeroVideoBackground } from './blocks/HeroVideoBackground';
import { HeroSplitLayout } from './blocks/HeroSplitLayout';
import { HeroMinimal } from './blocks/HeroMinimal';
import { HeroGradient } from './blocks/HeroGradient';
import { FeaturesGrid } from './blocks/FeaturesGrid';
import { CTABanner } from './blocks/CTABanner';
import { TestimonialsCarousel } from './blocks/TestimonialsCarousel';

interface BlockRendererProps {
  block: {
    id: string;
    templateId: string;
    config: any;
    customCss?: string | null;
    customClasses?: string | null;
    hideOnMobile?: boolean;
    hideOnTablet?: boolean;
    hideOnDesktop?: boolean;
    template: {
      id: string;
      name: string;
      slug: string;
      category: BlockCategory;
      componentCode?: string;
    };
  };
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block }) => {
  // Responsive visibility classes
  const visibilityClasses = [
    block.hideOnMobile && 'hidden md:block',
    block.hideOnTablet && 'md:hidden lg:block',
    block.hideOnDesktop && 'lg:hidden',
    block.customClasses,
  ]
    .filter(Boolean)
    .join(' ');

  // Render based on template slug
  const renderBlockContent = () => {
    switch (block.template.slug) {
      // Hero blocks
      case 'hero-background-image':
        return <HeroBackgroundImage config={block.config} />;

      case 'hero-video-background':
        return <HeroVideoBackground config={block.config} />;

      case 'hero-split-layout':
        return <HeroSplitLayout config={block.config} />;

      case 'hero-minimal-badge':
        return <HeroMinimal config={block.config} />;

      case 'hero-gradient':
        return <HeroGradient config={block.config} />;

      // Feature blocks
      case 'features-3-column-grid':
      case 'features-grid':
        return <FeaturesGrid config={block.config} />;

      // CTA blocks
      case 'cta-full-width-banner':
      case 'cta-banner':
        return <CTABanner config={block.config} />;

      // Social proof blocks
      case 'testimonials-carousel':
        return <TestimonialsCarousel config={block.config} />;

      // Default fallback: render from componentCode
      default:
        if (block.template.componentCode) {
          return (
            <div
              dangerouslySetInnerHTML={{
                __html: interpolateConfig(block.template.componentCode, block.config),
              }}
            />
          );
        }

        return (
          <div className="p-8 bg-gray-100 text-center">
            <p className="text-gray-600">
              Block template "{block.template.name}" not implemented yet
            </p>
          </div>
        );
    }
  };

  return (
    <div
      id={`block-${block.id}`}
      className={visibilityClasses}
      data-block-id={block.id}
      data-template-slug={block.template.slug}
    >
      {/* Custom CSS for this block */}
      {block.customCss && (
        <style dangerouslySetInnerHTML={{ __html: block.customCss }} />
      )}

      {/* Render block content */}
      {renderBlockContent()}
    </div>
  );
};

/**
 * Interpolate config values into template HTML
 * Replaces {{variableName}} with config values
 */
function interpolateConfig(template: string, config: any): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return config[key] !== undefined ? escapeHtml(String(config[key])) : match;
  });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
