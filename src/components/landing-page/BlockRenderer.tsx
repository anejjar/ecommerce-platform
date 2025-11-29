'use client';

import React from 'react';
import { BlockCategory } from '@prisma/client';
import { HeroBackgroundImage } from './blocks/HeroBackgroundImage';
import { HeroVideoBackground } from './blocks/HeroVideoBackground';
import { HeroSplitLayout } from './blocks/HeroSplitLayout';
import { HeroMinimal } from './blocks/HeroMinimal';
import { HeroGradient } from './blocks/HeroGradient';
import { FeaturesGrid } from './blocks/FeaturesGrid';
import { FeaturesAlternating } from './blocks/FeaturesAlternating';
import { FeaturesIconBoxes } from './blocks/FeaturesIconBoxes';
import { FeaturesScreenshots } from './blocks/FeaturesScreenshots';
import { CTABanner } from './blocks/CTABanner';
import { CTACard } from './blocks/CTACard';
import { CTASplit } from './blocks/CTASplit';
import { TestimonialsCarousel } from './blocks/TestimonialsCarousel';
import { TestimonialsGrid } from './blocks/TestimonialsGrid';
import { PricingTable } from './blocks/PricingTable';
import { PricingComparison } from './blocks/PricingComparison';
import { TeamGrid } from './blocks/TeamGrid';
import { StatsShowcase } from './blocks/StatsShowcase';
import { LogoGrid } from './blocks/LogoGrid';
import { NewsletterSignup } from './blocks/NewsletterSignup';
import { ContactForm } from './blocks/ContactForm';
import { FAQAccordion } from './blocks/FAQAccordion';
import { GalleryGrid } from './blocks/GalleryGrid';
import { NavigationBar } from './blocks/NavigationBar';
import { PageHeader } from './blocks/PageHeader';
import { Footer } from './blocks/Footer';
import { SocialLinks } from './blocks/SocialLinks';
import { Breadcrumbs } from './blocks/Breadcrumbs';
import { Divider } from './blocks/Divider';
import { Spacer } from './blocks/Spacer';
import { VideoPlayer } from './blocks/VideoPlayer';
import { TextContent } from './blocks/TextContent';

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
  landingPageId?: string;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, landingPageId }) => {
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
      case 'features-alternating':
        return <FeaturesAlternating config={block.config} />;
      case 'features-icon-boxes':
        return <FeaturesIconBoxes config={block.config} />;
      case 'features-screenshots':
        return <FeaturesScreenshots config={block.config} />;

      // CTA blocks
      case 'cta-full-width':
      case 'cta-banner':
        return <CTABanner config={block.config} />;
      case 'cta-card':
        return <CTACard config={block.config} />;
      case 'cta-split':
        return <CTASplit config={block.config} />;

      // Social proof blocks
      case 'testimonials-carousel':
        return <TestimonialsCarousel config={block.config} />;
      case 'testimonials-grid':
        return <TestimonialsGrid config={block.config} />;

      // Pricing blocks
      case 'pricing-table':
      case 'pricing-3-tier':
        return <PricingTable config={block.config} />;
      case 'pricing-comparison':
        return <PricingComparison config={block.config} />;

      // Team block
      case 'team-grid':
        return <TeamGrid config={block.config} />;

      // Stats block
      case 'stats-showcase':
        return <StatsShowcase config={block.config} />;

      // Logo grid
      case 'logo-grid':
        return <LogoGrid config={block.config} />;

      // Form blocks
      case 'newsletter-signup':
        return <NewsletterSignup config={block.config} landingPageId={landingPageId} />;
      case 'contact-form':
        return <ContactForm config={block.config} />;

      // FAQ block
      case 'faq-accordion':
        return <FAQAccordion config={block.config} />;

      // Gallery block
      case 'gallery-grid':
        return <GalleryGrid config={block.config} />;

      // Navigation block
      case 'navigation-bar':
        return <NavigationBar config={block.config} />;

      // Header block
      case 'page-header':
        return <PageHeader config={block.config} />;

      // Footer block
      case 'footer':
        return <Footer config={block.config} />;

      // Social links block
      case 'social-links':
        return <SocialLinks config={block.config} />;

      // Breadcrumbs block
      case 'breadcrumbs':
        return <Breadcrumbs config={block.config} />;

      // Divider block
      case 'divider':
        return <Divider config={block.config} />;

      // Spacer block
      case 'spacer':
        return <Spacer config={block.config} />;

      // Video player block
      case 'video-player':
        return <VideoPlayer config={block.config} />;

      // Text content block
      case 'text-content':
        return <TextContent config={block.config} />;

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
