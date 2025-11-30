import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Card } from '@/components/ui/card';
import { HeroBackgroundImage } from '@/components/landing-page/blocks/HeroBackgroundImage';
import { HeroVideoBackground } from '@/components/landing-page/blocks/HeroVideoBackground';
import { HeroSplitLayout } from '@/components/landing-page/blocks/HeroSplitLayout';
import { HeroMinimal } from '@/components/landing-page/blocks/HeroMinimal';
import { HeroGradient } from '@/components/landing-page/blocks/HeroGradient';
import { FeaturesGrid } from '@/components/landing-page/blocks/FeaturesGrid';
import { FeaturesAlternating } from '@/components/landing-page/blocks/FeaturesAlternating';
import { FeaturesIconBoxes } from '@/components/landing-page/blocks/FeaturesIconBoxes';
import { FeaturesScreenshots } from '@/components/landing-page/blocks/FeaturesScreenshots';
import { CTABanner } from '@/components/landing-page/blocks/CTABanner';
import { CTACard } from '@/components/landing-page/blocks/CTACard';
import { CTASplit } from '@/components/landing-page/blocks/CTASplit';
import { TestimonialsCarousel } from '@/components/landing-page/blocks/TestimonialsCarousel';
import { TestimonialsGrid } from '@/components/landing-page/blocks/TestimonialsGrid';
import { PricingTable } from '@/components/landing-page/blocks/PricingTable';
import { PricingComparison } from '@/components/landing-page/blocks/PricingComparison';
import { TeamGrid } from '@/components/landing-page/blocks/TeamGrid';
import { StatsShowcase } from '@/components/landing-page/blocks/StatsShowcase';
import { LogoGrid } from '@/components/landing-page/blocks/LogoGrid';
import { NewsletterSignup } from '@/components/landing-page/blocks/NewsletterSignup';
import { ContactForm } from '@/components/landing-page/blocks/ContactForm';
import { FAQAccordion } from '@/components/landing-page/blocks/FAQAccordion';
import { GalleryGrid } from '@/components/landing-page/blocks/GalleryGrid';
import { NavigationBar } from '@/components/landing-page/blocks/NavigationBar';
import { PageHeader } from '@/components/landing-page/blocks/PageHeader';
import { Footer } from '@/components/landing-page/blocks/Footer';
import { SocialLinks } from '@/components/landing-page/blocks/SocialLinks';
import { Breadcrumbs } from '@/components/landing-page/blocks/Breadcrumbs';
import { Divider } from '@/components/landing-page/blocks/Divider';
import { Spacer } from '@/components/landing-page/blocks/Spacer';
import { VideoPlayer } from '@/components/landing-page/blocks/VideoPlayer';
import { TextContent } from '@/components/landing-page/blocks/TextContent';
import { ProductGrid } from '@/components/landing-page/blocks/ProductGrid';
import { ProductCardBlock } from '@/components/landing-page/blocks/ProductCardBlock';
import { ProductDescription } from '@/components/landing-page/blocks/ProductDescription';
import { AddToCartButton } from '@/components/landing-page/blocks/AddToCartButton';
import { CartSummary } from '@/components/landing-page/blocks/CartSummary';
import { ProductImageGallery } from '@/components/landing-page/blocks/ProductImageGallery';
import { ProductReviews } from '@/components/landing-page/blocks/ProductReviews';
import { RelatedProducts } from '@/components/landing-page/blocks/RelatedProducts';
import { ProductTabs } from '@/components/landing-page/blocks/ProductTabs';
import { BlogGrid } from '@/components/landing-page/blocks/BlogGrid';
import { BlogPostCard } from '@/components/landing-page/blocks/BlogPostCard';
import { BlogPostContent } from '@/components/landing-page/blocks/BlogPostContent';
import { BlogCategories } from '@/components/landing-page/blocks/BlogCategories';
import { RecentPostsWidget } from '@/components/landing-page/blocks/RecentPostsWidget';

interface BlockPreviewProps {
    template: {
        name: string;
        category: string;
        slug?: string;
        componentCode?: string;
    };
    config: any;
}

export const BlockPreview: React.FC<BlockPreviewProps> = ({
    template,
    config
}) => {
    // Debug logging to check template data
    // console.log('BlockPreview template:', template);
    // console.log('BlockPreview config:', config);

    // Use config as a key to force re-render when config changes
    const configKey = JSON.stringify(config);

    const renderBlockContent = () => {
        // If we have a slug, try to match it to a component
        if (template.slug) {
            switch (template.slug) {
                case 'hero-background-image':
                    return <HeroBackgroundImage config={config} />;
                case 'hero-video-background':
                    return <HeroVideoBackground config={config} />;
                case 'hero-split-layout':
                    return <HeroSplitLayout config={config} />;
                case 'hero-minimal-badge':
                    return <HeroMinimal config={config} />;
                case 'hero-gradient':
                    return <HeroGradient config={config} />;
                case 'features-3-column-grid':
                case 'features-grid':
                    return <FeaturesGrid config={config} />;
                case 'features-alternating':
                    return <FeaturesAlternating config={config} />;
                case 'features-icon-boxes':
                    return <FeaturesIconBoxes config={config} />;
                case 'features-screenshots':
                    return <FeaturesScreenshots config={config} />;
                case 'cta-full-width':
                case 'cta-banner':
                    return <CTABanner config={config} />;
                case 'cta-card':
                    return <CTACard config={config} />;
                case 'cta-split':
                    return <CTASplit config={config} />;
                case 'testimonials-carousel':
                    return <TestimonialsCarousel config={config} />;
                case 'testimonials-grid':
                    return <TestimonialsGrid config={config} />;
                case 'pricing-table':
                case 'pricing-3-tier':
                    return <PricingTable config={config} />;
                case 'pricing-comparison':
                    return <PricingComparison config={config} />;
                case 'team-grid':
                    return <TeamGrid config={config} />;
                case 'stats-showcase':
                    return <StatsShowcase config={config} />;
                case 'logo-grid':
                    return <LogoGrid config={config} />;
                case 'newsletter-signup':
                    return <NewsletterSignup config={config} />;
                case 'contact-form':
                    return <ContactForm config={config} />;
                case 'faq-accordion':
                    return <FAQAccordion config={config} />;
                case 'gallery-grid':
                    return <GalleryGrid config={config} />;
                case 'navigation-bar':
                    return <NavigationBar config={config} />;
                case 'page-header':
                    return <PageHeader config={config} />;
                case 'footer':
                    return <Footer config={config} />;
                case 'social-links':
                    return <SocialLinks config={config} />;
                case 'breadcrumbs':
                    return <Breadcrumbs config={config} />;
                case 'divider':
                    return <Divider config={config} />;
                case 'spacer':
                    return <Spacer config={config} />;
                case 'video-player':
                    return <VideoPlayer config={config} />;
                case 'text-content':
                    return <TextContent config={config} />;
                
                // Product blocks
                case 'product-grid':
                    return <ProductGrid config={config} />;
                case 'product-card':
                    return <ProductCardBlock config={config} />;
                case 'product-description':
                    return <ProductDescription config={config} />;
                case 'add-to-cart-button':
                    return <AddToCartButton config={config} />;
                case 'cart-summary':
                    return <CartSummary config={config} />;
                case 'product-image-gallery':
                    return <ProductImageGallery config={config} />;
                case 'product-reviews':
                    return <ProductReviews config={config} />;
                case 'related-products':
                    return <RelatedProducts config={config} />;
                case 'product-tabs':
                    return <ProductTabs config={config} />;
                
                // Blog blocks
                case 'blog-grid':
                    return <BlogGrid config={config} />;
                case 'blog-post-card':
                    return <BlogPostCard config={config} />;
                case 'blog-post-content':
                    return <BlogPostContent config={config} />;
                case 'blog-categories':
                    return <BlogCategories config={config} />;
                case 'recent-posts-widget':
                    return <RecentPostsWidget config={config} />;
            }
        }

        // Fallback for unknown blocks or missing slugs
        return (
            <div className="p-8 text-center space-y-4">
                <p className="text-muted-foreground">
                    Preview not available for this block type.
                </p>
                <div className="text-xs text-left bg-gray-100 p-4 rounded overflow-auto max-h-[200px]">
                    <pre>{JSON.stringify(config, null, 2)}</pre>
                </div>
            </div>
        );
    };

    // Minimal messages for preview context
    // These provide fallback translations for components that use useTranslations()
    const minimalMessages = {
        product: {
            addedToCart: 'Added to cart',
            addToCart: 'Add to Cart',
            outOfStock: 'Out of Stock',
            featured: 'Featured',
        },
        cart: {
            emptyCart: 'Your cart is empty',
            addProducts: 'Add some products to your cart',
            continueShopping: 'Continue Shopping',
            item: 'item',
            items: 'items',
            subtotal: 'Subtotal',
            total: 'Total',
            proceedToCheckout: 'Proceed to Checkout',
            remove: 'Remove',
            each: 'each',
            orderSummary: 'Order Summary',
            tax: 'Tax',
            shipping: 'Shipping',
            free: 'Free',
            freeShippingProgress: 'Add {amount} more for free shipping',
            trustBadges: {
                secureCheckout: 'Secure Checkout',
            },
            freeReturns: 'Free Returns',
            shippingTime: 'Shipping: 3-5 Business Days',
        },
        wishlist: {
            title: 'My Wishlist',
            empty: 'Your wishlist is empty',
            emptyDesc: 'Save your favorite products to your wishlist and shop them later!',
            startShopping: 'Start Shopping',
            removed: 'Removed from wishlist',
            removeFailed: 'Failed to remove from wishlist',
            itemCount: '{count, plural, =0 {No items} one {1 item} other {# items}} saved',
            signInRequired: 'Please sign in to use the wishlist',
            added: 'Added to wishlist',
            addFailed: 'Failed to add to wishlist',
            saved: 'Saved',
            save: 'Save',
            removeFromWishlist: 'Remove from wishlist',
            addToWishlist: 'Add to wishlist',
        },
        common: {
            error: 'An error occurred',
            loading: 'Loading...',
        },
    };

    return (
        <NextIntlClientProvider locale="en" messages={minimalMessages}>
            <div className="w-full" key={configKey}>
                {/* We wrap the preview in a div that prevents interaction (links, buttons) 
                    so they don't interfere with the editor UI */}
                <div className="pointer-events-none select-none">
                    {renderBlockContent()}
                </div>
            </div>
        </NextIntlClientProvider>
    );
};
