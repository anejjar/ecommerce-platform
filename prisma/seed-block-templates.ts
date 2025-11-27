import { PrismaClient, BlockCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding block templates...');

    // Hero Blocks (5 templates)
    const heroBackgroundImage = await prisma.blockTemplate.create({
        data: {
            name: 'Hero - Background Image with CTA',
            slug: 'hero-background-image',
            description: 'Full-width hero section with background image, heading, subheading, and CTA buttons',
            category: BlockCategory.HERO,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                heading: 'Welcome to Our Platform',
                subheading: 'Build amazing things with our tools',
                backgroundImage: '/defaults/hero-bg-1.jpg',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                ctaPrimaryText: 'Get Started',
                ctaPrimaryLink: '/signup',
                ctaSecondaryText: '',
                ctaSecondaryLink: '',
                textColor: '#ffffff',
                overlayColor: '#000000',
                overlayOpacity: 0.5,
                contentAlignment: 'center',
                contentVerticalAlign: 'center',
                minHeight: '600px',
                maxWidth: '800px',
                paddingTop: '80px',
                paddingBottom: '80px',
            },
            configSchema: {
                fields: [
                    { name: 'heading', type: 'text', label: 'Main Heading', required: true, maxLength: 100 },
                    { name: 'subheading', type: 'textarea', label: 'Subheading', required: false, maxLength: 250, rows: 3 },
                    { name: 'backgroundImage', type: 'image', label: 'Background Image', required: true, accept: 'image/*', recommended: 'Minimum 1920x1080px' },
                    {
                        name: 'backgroundPosition', type: 'select', label: 'Image Position', options: [
                            { value: 'top', label: 'Top' },
                            { value: 'center', label: 'Center' },
                            { value: 'bottom', label: 'Bottom' }
                        ]
                    },
                    { name: 'ctaPrimaryText', type: 'text', label: 'Primary Button Text', required: true },
                    { name: 'ctaPrimaryLink', type: 'text', label: 'Primary Button Link', required: true },
                    { name: 'ctaSecondaryText', type: 'text', label: 'Secondary Button Text (Optional)' },
                    { name: 'ctaSecondaryLink', type: 'text', label: 'Secondary Button Link' },
                    { name: 'textColor', type: 'color', label: 'Text Color', default: '#ffffff' },
                    { name: 'overlayOpacity', type: 'slider', label: 'Overlay Darkness', min: 0, max: 1, step: 0.1, default: 0.5 },
                    {
                        name: 'contentAlignment', type: 'select', label: 'Text Alignment', options: [
                            { value: 'left', label: 'Left' },
                            { value: 'center', label: 'Center' },
                            { value: 'right', label: 'Right' }
                        ]
                    },
                    { name: 'minHeight', type: 'text', label: 'Section Height', default: '600px', placeholder: '600px, 80vh, etc.' }
                ]
            },
            componentCode: `
export default function HeroBackgroundImage({ config }) {
  return (
    <section 
      className="relative overflow-hidden" 
      style={{ minHeight: config.minHeight }}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: \`url(\${config.backgroundImage})\`,
          backgroundPosition: config.backgroundPosition,
          backgroundSize: config.backgroundSize
        }}
      />
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundColor: config.overlayColor,
          opacity: config.overlayOpacity
        }}
      />
      <div className="relative container mx-auto px-4 h-full flex items-center justify-center" style={{ paddingTop: config.paddingTop, paddingBottom: config.paddingBottom }}>
        <div className="text-center" style={{ maxWidth: config.maxWidth, textAlign: config.contentAlignment, color: config.textColor }}>
          <h1 className="text-5xl font-bold mb-4">{config.heading}</h1>
          {config.subheading && <p className="text-xl mb-8">{config.subheading}</p>}
          <div className="flex gap-4 justify-center">
            <a href={config.ctaPrimaryLink} className="btn btn-primary">{config.ctaPrimaryText}</a>
            {config.ctaSecondaryText && <a href={config.ctaSecondaryLink} className="btn btn-secondary">{config.ctaSecondaryText}</a>}
          </div>
        </div>
      </div>
    </section>
  );
}`,
        },
    });

    const heroVideo = await prisma.blockTemplate.create({
        data: {
            name: 'Hero - Video Background',
            slug: 'hero-video-background',
            description: 'Hero section with auto-playing background video',
            category: BlockCategory.HERO,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                heading: 'See Our Product in Action',
                subheading: '',
                videoUrl: '/defaults/hero-video.mp4',
                videoPoster: '/defaults/video-poster.jpg',
                videoMuted: true,
                videoLoop: true,
                videoAutoplay: true,
                fallbackImage: '/defaults/hero-bg-2.jpg',
                ctaPrimaryText: 'Watch Demo',
                ctaPrimaryLink: '#demo',
                ctaSecondaryText: 'Sign Up',
                ctaSecondaryLink: '/signup',
                textColor: '#ffffff',
                overlayOpacity: 0.3,
                contentAlignment: 'center',
                minHeight: '700px',
            },
            configSchema: {
                fields: [
                    { name: 'heading', type: 'text', label: 'Main Heading', required: true },
                    { name: 'subheading', type: 'textarea', label: 'Subheading' },
                    { name: 'videoUrl', type: 'text', label: 'Video URL', required: true },
                    { name: 'videoPoster', type: 'image', label: 'Video Poster Image' },
                    { name: 'ctaPrimaryText', type: 'text', label: 'Primary Button Text', required: true },
                    { name: 'ctaPrimaryLink', type: 'text', label: 'Primary Button Link', required: true },
                ]
            },
            componentCode: `export default function HeroVideo({ config }) { /* Video hero implementation */ }`,
        },
    });

    const heroSplit = await prisma.blockTemplate.create({
        data: {
            name: 'Hero - Split Layout',
            slug: 'hero-split-layout',
            description: 'Split hero with image on one side and content on the other',
            category: BlockCategory.HERO,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                heading: 'Transform Your Business',
                description: 'Our platform helps you achieve more with less effort.',
                features: ['Automated workflows', 'Real-time analytics', '24/7 support'],
                image: '/defaults/product-screenshot.png',
                imagePosition: 'left',
                imageWidth: '50%',
                ctaText: 'Get Started',
                ctaLink: '/signup',
                backgroundColor: '#f9fafb',
                textColor: '#111827',
            },
            configSchema: {
                fields: [
                    { name: 'heading', type: 'text', label: 'Heading', required: true },
                    { name: 'description', type: 'textarea', label: 'Description' },
                    { name: 'image', type: 'image', label: 'Image', required: true },
                    {
                        name: 'imagePosition', type: 'select', label: 'Image Position', options: [
                            { value: 'left', label: 'Left' },
                            { value: 'right', label: 'Right' }
                        ]
                    },
                ]
            },
            componentCode: `export default function HeroSplit({ config }) { /* Split hero implementation */ }`,
        },
    });

    const heroMinimal = await prisma.blockTemplate.create({
        data: {
            name: 'Hero - Minimal with Badge',
            slug: 'hero-minimal-badge',
            description: 'Clean hero section with trust badge and email capture',
            category: BlockCategory.HERO,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                badge: '🏆 Trusted by 10,000+ companies',
                heading: 'The Best Way to Manage Your Projects',
                subheading: 'Simple, powerful, and built for teams',
                showEmailCapture: true,
                emailPlaceholder: 'Enter your email',
                ctaText: 'Get Started Free',
                trustIndicator: '⭐⭐⭐⭐⭐ 4.9/5 from 2,000 reviews',
                backgroundColor: '#ffffff',
                textColor: '#111827',
            },
            configSchema: {
                fields: [
                    { name: 'badge', type: 'text', label: 'Badge Text' },
                    { name: 'heading', type: 'text', label: 'Heading', required: true },
                    { name: 'subheading', type: 'text', label: 'Subheading' },
                    { name: 'showEmailCapture', type: 'checkbox', label: 'Show Email Capture' },
                    { name: 'ctaText', type: 'text', label: 'CTA Button Text', required: true },
                ]
            },
            componentCode: `export default function HeroMinimal({ config }) { /* Minimal hero implementation */ }`,
        },
    });

    const heroGradient = await prisma.blockTemplate.create({
        data: {
            name: 'Hero - Gradient Background',
            slug: 'hero-gradient',
            description: 'Modern hero with gradient background',
            category: BlockCategory.HERO,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                heading: 'Build Something Amazing',
                subheading: 'The modern platform for modern teams',
                gradientFrom: '#3b82f6',
                gradientTo: '#8b5cf6',
                gradientDirection: '135deg',
                ctaPrimaryText: 'Start Building',
                ctaPrimaryLink: '/signup',
                ctaSecondaryText: 'See Demo',
                ctaSecondaryLink: '/demo',
                textColor: '#ffffff',
                minHeight: '600px',
            },
            configSchema: {
                fields: [
                    { name: 'heading', type: 'text', label: 'Heading', required: true },
                    { name: 'subheading', type: 'text', label: 'Subheading' },
                    { name: 'gradientFrom', type: 'color', label: 'Gradient Start Color' },
                    { name: 'gradientTo', type: 'color', label: 'Gradient End Color' },
                    { name: 'ctaPrimaryText', type: 'text', label: 'Primary Button Text', required: true },
                    { name: 'ctaPrimaryLink', type: 'text', label: 'Primary Button Link', required: true },
                ]
            },
            componentCode: `export default function HeroGradient({ config }) { /* Gradient hero implementation */ }`,
        },
    });

    console.log('✅ Created 5 Hero block templates');

    // Feature Sections (4 templates)
    const features3Column = await prisma.blockTemplate.create({
        data: {
            name: 'Features - 3-Column Grid',
            slug: 'features-3-column-grid',
            description: 'Feature grid with icons in 3 columns',
            category: BlockCategory.FEATURES,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                heading: 'Why Choose Our Platform',
                subheading: 'Everything you need to succeed',
                features: [
                    { icon: '⚡', title: 'Lightning Fast', description: 'Built for speed and performance' },
                    { icon: '🔒', title: 'Secure', description: 'Bank-grade security' },
                    { icon: '📈', title: 'Scalable', description: 'Grows with your business' },
                    { icon: '💬', title: '24/7 Support', description: "We're always here to help" },
                    { icon: '🎯', title: 'Easy Setup', description: 'Up and running in minutes' },
                    { icon: '🔌', title: 'API Access', description: 'Integrate with anything' },
                ],
                columns: 3,
                iconSize: '48px',
                backgroundColor: '#ffffff',
            },
            configSchema: {
                fields: [
                    { name: 'heading', type: 'text', label: 'Heading', required: true },
                    { name: 'subheading', type: 'text', label: 'Subheading' },
                    {
                        name: 'features', type: 'repeater', label: 'Features', fields: [
                            { name: 'icon', type: 'text', label: 'Icon (emoji or URL)' },
                            { name: 'title', type: 'text', label: 'Title', required: true },
                            { name: 'description', type: 'textarea', label: 'Description' },
                        ]
                    },
                    {
                        name: 'columns', type: 'select', label: 'Columns', options: [
                            { value: 2, label: '2 Columns' },
                            { value: 3, label: '3 Columns' },
                            { value: 4, label: '4 Columns' },
                        ]
                    },
                ]
            },
            componentCode: `export default function Features3Column({ config }) { /* 3-column features implementation */ }`,
        },
    });

    const featuresAlternating = await prisma.blockTemplate.create({
        data: {
            name: 'Features - Alternating Layout',
            slug: 'features-alternating',
            description: 'Features with alternating image and text layout',
            category: BlockCategory.FEATURES,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                features: [
                    {
                        title: 'Feature One',
                        description: 'Description of feature one and how it helps users.',
                        image: '/defaults/feature-1.jpg',
                        imagePosition: 'left',
                        benefits: ['Benefit 1', 'Benefit 2', 'Benefit 3'],
                    },
                    {
                        title: 'Feature Two',
                        description: 'Description of feature two.',
                        image: '/defaults/feature-2.jpg',
                        imagePosition: 'right',
                        benefits: ['Benefit 1', 'Benefit 2'],
                    },
                ],
            },
            configSchema: {
                fields: [
                    {
                        name: 'features', type: 'repeater', label: 'Features', fields: [
                            { name: 'title', type: 'text', label: 'Title', required: true },
                            { name: 'description', type: 'textarea', label: 'Description' },
                            { name: 'image', type: 'image', label: 'Image', required: true },
                            {
                                name: 'imagePosition', type: 'select', label: 'Image Position', options: [
                                    { value: 'left', label: 'Left' },
                                    { value: 'right', label: 'Right' },
                                ]
                            },
                        ]
                    },
                ]
            },
            componentCode: `export default function FeaturesAlternating({ config }) { /* Alternating features implementation */ }`,
        },
    });

    const featuresIconBoxes = await prisma.blockTemplate.create({
        data: {
            name: 'Features - Icon Boxes',
            slug: 'features-icon-boxes',
            description: 'Features with colored background boxes and large icons',
            category: BlockCategory.FEATURES,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                heading: 'Our Features',
                features: [
                    { icon: '⚡', title: 'Fast', description: 'Lightning speed', color: '#3b82f6' },
                    { icon: '🔒', title: 'Secure', description: 'Bank-grade security', color: '#10b981' },
                    { icon: '📈', title: 'Scalable', description: 'Grows with you', color: '#f59e0b' },
                ],
            },
            configSchema: {
                fields: [
                    { name: 'heading', type: 'text', label: 'Heading' },
                    {
                        name: 'features', type: 'repeater', label: 'Features', fields: [
                            { name: 'icon', type: 'text', label: 'Icon' },
                            { name: 'title', type: 'text', label: 'Title', required: true },
                            { name: 'description', type: 'text', label: 'Description' },
                            { name: 'color', type: 'color', label: 'Box Color' },
                        ]
                    },
                ]
            },
            componentCode: `export default function FeaturesIconBoxes({ config }) { /* Icon boxes implementation */ }`,
        },
    });

    const featuresScreenshots = await prisma.blockTemplate.create({
        data: {
            name: 'Features - With Screenshots',
            slug: 'features-screenshots',
            description: 'Features showcasing product screenshots',
            category: BlockCategory.FEATURES,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                heading: 'See It In Action',
                features: [
                    { title: 'Dashboard', description: 'Powerful analytics', screenshot: '/defaults/screenshot-1.png' },
                    { title: 'Reports', description: 'Detailed insights', screenshot: '/defaults/screenshot-2.png' },
                ],
            },
            configSchema: {
                fields: [
                    { name: 'heading', type: 'text', label: 'Heading' },
                    {
                        name: 'features', type: 'repeater', label: 'Features', fields: [
                            { name: 'title', type: 'text', label: 'Title', required: true },
                            { name: 'description', type: 'text', label: 'Description' },
                            { name: 'screenshot', type: 'image', label: 'Screenshot', required: true },
                        ]
                    },
                ]
            },
            componentCode: `export default function FeaturesScreenshots({ config }) { /* Screenshots implementation */ }`,
        },
    });

    console.log('✅ Created 4 Feature block templates');

    // CTA Blocks (3 templates)
    const ctaFullWidth = await prisma.blockTemplate.create({
        data: {
            name: 'CTA - Full Width Banner',
            slug: 'cta-full-width',
            description: 'Full-width call-to-action banner',
            category: BlockCategory.CTA,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                heading: 'Ready to Get Started?',
                description: 'Start your free trial today. No credit card required.',
                ctaText: 'Start Free Trial',
                ctaLink: '/signup',
                showEmailCapture: true,
                backgroundColor: '#3b82f6',
                textColor: '#ffffff',
                pattern: 'none',
            },
            configSchema: {
                fields: [
                    { name: 'heading', type: 'text', label: 'Heading', required: true },
                    { name: 'description', type: 'textarea', label: 'Description' },
                    { name: 'ctaText', type: 'text', label: 'Button Text', required: true },
                    { name: 'ctaLink', type: 'text', label: 'Button Link', required: true },
                    { name: 'showEmailCapture', type: 'checkbox', label: 'Show Email Capture' },
                    { name: 'backgroundColor', type: 'color', label: 'Background Color' },
                    { name: 'textColor', type: 'color', label: 'Text Color' },
                ]
            },
            componentCode: `export default function CTAFullWidth({ config }) { /* Full width CTA implementation */ }`,
        },
    });

    const ctaCard = await prisma.blockTemplate.create({
        data: {
            name: 'CTA - Card Style',
            slug: 'cta-card',
            description: 'Centered CTA in a card format',
            category: BlockCategory.CTA,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                icon: '💡',
                heading: 'Ready to transform your workflow?',
                subheading: 'Join 10,000+ happy users',
                ctaText: 'Get Started Free',
                ctaLink: '/signup',
            },
            configSchema: {
                fields: [
                    { name: 'icon', type: 'text', label: 'Icon' },
                    { name: 'heading', type: 'text', label: 'Heading', required: true },
                    { name: 'subheading', type: 'text', label: 'Subheading' },
                    { name: 'ctaText', type: 'text', label: 'Button Text', required: true },
                    { name: 'ctaLink', type: 'text', label: 'Button Link', required: true },
                ]
            },
            componentCode: `export default function CTACard({ config }) { /* Card CTA implementation */ }`,
        },
    });

    const ctaSplit = await prisma.blockTemplate.create({
        data: {
            name: 'CTA - Split Layout',
            slug: 'cta-split',
            description: 'CTA with image on one side',
            category: BlockCategory.CTA,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                heading: 'One more thing...',
                description: "Don't miss out on our exclusive features",
                ctaText: 'Get Access Now',
                ctaLink: '/signup',
                image: '/defaults/cta-image.jpg',
                imagePosition: 'left',
            },
            configSchema: {
                fields: [
                    { name: 'heading', type: 'text', label: 'Heading', required: true },
                    { name: 'description', type: 'textarea', label: 'Description' },
                    { name: 'ctaText', type: 'text', label: 'Button Text', required: true },
                    { name: 'ctaLink', type: 'text', label: 'Button Link', required: true },
                    { name: 'image', type: 'image', label: 'Image', required: true },
                    {
                        name: 'imagePosition', type: 'select', label: 'Image Position', options: [
                            { value: 'left', label: 'Left' },
                            { value: 'right', label: 'Right' },
                        ]
                    },
                ]
            },
            componentCode: `export default function CTASplit({ config }) { /* Split CTA implementation */ }`,
        },
    });

    console.log('✅ Created 3 CTA block templates');

    // Testimonials (2 templates)
    const testimonialsCarousel = await prisma.blockTemplate.create({
        data: {
            name: 'Testimonials - Carousel',
            slug: 'testimonials-carousel',
            description: 'Rotating testimonials carousel',
            category: BlockCategory.TESTIMONIALS,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                heading: 'What Our Customers Say',
                testimonials: [
                    {
                        quote: 'This product changed everything for our business.',
                        author: 'John Doe',
                        role: 'CEO',
                        company: 'Acme Corp',
                        avatar: '/avatars/1.jpg',
                        rating: 5,
                    },
                    {
                        quote: "Best investment we've made this year.",
                        author: 'Jane Smith',
                        role: 'CTO',
                        company: 'Tech Inc',
                        avatar: '/avatars/2.jpg',
                        rating: 5,
                    },
                ],
                autoplay: true,
                autoplayInterval: 5000,
                showRating: true,
                showAvatar: true,
            },
            configSchema: {
                fields: [
                    { name: 'heading', type: 'text', label: 'Heading' },
                    {
                        name: 'testimonials', type: 'repeater', label: 'Testimonials', fields: [
                            { name: 'quote', type: 'textarea', label: 'Quote', required: true },
                            { name: 'author', type: 'text', label: 'Author Name', required: true },
                            { name: 'role', type: 'text', label: 'Role' },
                            { name: 'company', type: 'text', label: 'Company' },
                            { name: 'avatar', type: 'image', label: 'Avatar' },
                            { name: 'rating', type: 'number', label: 'Rating (1-5)', min: 1, max: 5 },
                        ]
                    },
                    { name: 'autoplay', type: 'checkbox', label: 'Auto-play' },
                    { name: 'showRating', type: 'checkbox', label: 'Show Ratings' },
                    { name: 'showAvatar', type: 'checkbox', label: 'Show Avatars' },
                ]
            },
            componentCode: `export default function TestimonialsCarousel({ config }) { /* Carousel implementation */ }`,
        },
    });

    const testimonialsGrid = await prisma.blockTemplate.create({
        data: {
            name: 'Testimonials - Grid',
            slug: 'testimonials-grid',
            description: 'Testimonials displayed in a grid layout',
            category: BlockCategory.TESTIMONIALS,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                heading: 'Loved by Thousands',
                testimonials: [
                    { quote: 'Amazing product!', author: 'John Doe', role: 'CEO', rating: 5 },
                    { quote: 'Highly recommended!', author: 'Jane Smith', role: 'CTO', rating: 5 },
                    { quote: 'Best tool ever!', author: 'Mike Johnson', role: 'Designer', rating: 5 },
                ],
                columns: 3,
            },
            configSchema: {
                fields: [
                    { name: 'heading', type: 'text', label: 'Heading' },
                    {
                        name: 'testimonials', type: 'repeater', label: 'Testimonials', fields: [
                            { name: 'quote', type: 'textarea', label: 'Quote', required: true },
                            { name: 'author', type: 'text', label: 'Author', required: true },
                            { name: 'role', type: 'text', label: 'Role' },
                            { name: 'rating', type: 'number', label: 'Rating', min: 1, max: 5 },
                        ]
                    },
                ]
            },
            componentCode: `export default function TestimonialsGrid({ config }) { /* Grid implementation */ }`,
        },
    });

    const logoGrid = await prisma.blockTemplate.create({
        data: {
            name: 'Logo Grid - Clients/Partners',
            slug: 'logo-grid',
            description: 'Grid of client or partner logos',
            category: BlockCategory.LOGO_GRID,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                heading: 'Trusted by Leading Companies',
                logos: [
                    { url: '/logos/company1.svg', alt: 'Company 1' },
                    { url: '/logos/company2.svg', alt: 'Company 2' },
                    { url: '/logos/company3.svg', alt: 'Company 3' },
                ],
                columns: 6,
                grayscale: true,
                hoverEffect: 'color',
            },
            configSchema: {
                fields: [
                    { name: 'heading', type: 'text', label: 'Heading' },
                    {
                        name: 'logos', type: 'repeater', label: 'Logos', fields: [
                            { name: 'url', type: 'image', label: 'Logo Image', required: true },
                            { name: 'alt', type: 'text', label: 'Alt Text', required: true },
                        ]
                    },
                    { name: 'columns', type: 'number', label: 'Columns', min: 3, max: 8 },
                    { name: 'grayscale', type: 'checkbox', label: 'Grayscale by Default' },
                ]
            },
            componentCode: `export default function LogoGrid({ config }) { /* Logo grid implementation */ }`,
        },
    });

    console.log('✅ Created 3 Social Proof block templates');

    // Pricing (2 templates)
    const pricing3Tier = await prisma.blockTemplate.create({
        data: {
            name: 'Pricing - 3-Tier',
            slug: 'pricing-3-tier',
            description: 'Three-column pricing table',
            category: BlockCategory.PRICING,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                heading: 'Choose Your Plan',
                subheading: 'Simple, transparent pricing',
                plans: [
                    {
                        name: 'Starter',
                        price: '$9',
                        period: '/month',
                        features: ['10 GB storage', '1 user', 'Basic support'],
                        ctaText: 'Start Free Trial',
                        ctaLink: '/signup?plan=starter',
                        highlighted: false,
                    },
                    {
                        name: 'Pro',
                        price: '$29',
                        period: '/month',
                        badge: 'POPULAR',
                        features: ['100 GB storage', '5 users', 'Priority support', 'Advanced analytics'],
                        ctaText: 'Start Free Trial',
                        ctaLink: '/signup?plan=pro',
                        highlighted: true,
                    },
                    {
                        name: 'Enterprise',
                        price: 'Custom',
                        period: '',
                        features: ['Unlimited storage', 'Unlimited users', '24/7 support', 'Custom integrations'],
                        ctaText: 'Contact Sales',
                        ctaLink: '/contact',
                        highlighted: false,
                    },
                ],
                showAnnualToggle: true,
                annualDiscount: 'Save 20%',
            },
            configSchema: {
                fields: [
                    { name: 'heading', type: 'text', label: 'Heading' },
                    { name: 'subheading', type: 'text', label: 'Subheading' },
                    {
                        name: 'plans', type: 'repeater', label: 'Plans', fields: [
                            { name: 'name', type: 'text', label: 'Plan Name', required: true },
                            { name: 'price', type: 'text', label: 'Price', required: true },
                            { name: 'period', type: 'text', label: 'Period (e.g., /month)' },
                            { name: 'badge', type: 'text', label: 'Badge (e.g., POPULAR)' },
                            { name: 'features', type: 'array', label: 'Features' },
                            { name: 'ctaText', type: 'text', label: 'Button Text', required: true },
                            { name: 'ctaLink', type: 'text', label: 'Button Link', required: true },
                            { name: 'highlighted', type: 'checkbox', label: 'Highlight This Plan' },
                        ]
                    },
                ]
            },
            componentCode: `export default function Pricing3Tier({ config }) { /* 3-tier pricing implementation */ }`,
        },
    });

    const pricingComparison = await prisma.blockTemplate.create({
        data: {
            name: 'Pricing - Comparison Table',
            slug: 'pricing-comparison',
            description: 'Detailed feature comparison table',
            category: BlockCategory.PRICING,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                heading: 'Compare Plans',
                plans: ['Starter', 'Pro', 'Enterprise'],
                features: [
                    { name: 'Storage', values: ['10 GB', '100 GB', 'Unlimited'] },
                    { name: 'Users', values: ['1', '5', 'Unlimited'] },
                    { name: 'Support', values: ['Email', 'Priority', '24/7'] },
                ],
            },
            configSchema: {
                fields: [
                    { name: 'heading', type: 'text', label: 'Heading' },
                    { name: 'plans', type: 'array', label: 'Plan Names' },
                    {
                        name: 'features', type: 'repeater', label: 'Features', fields: [
                            { name: 'name', type: 'text', label: 'Feature Name', required: true },
                            { name: 'values', type: 'array', label: 'Values for Each Plan' },
                        ]
                    },
                ]
            },
            componentCode: `export default function PricingComparison({ config }) { /* Comparison table implementation */ }`,
        },
    });

    console.log('✅ Created 2 Pricing block templates');

    // Forms (2 templates)
    const newsletterSignup = await prisma.blockTemplate.create({
        data: {
            name: 'Newsletter Signup',
            slug: 'newsletter-signup',
            description: 'Email newsletter subscription form',
            category: BlockCategory.FORM,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                heading: 'Stay in the Loop',
                description: 'Get weekly updates and exclusive offers',
                emailPlaceholder: 'Enter your email...',
                ctaText: 'Subscribe',
                benefits: ['Weekly newsletter', 'No spam', 'Unsubscribe anytime'],
            },
            configSchema: {
                fields: [
                    { name: 'heading', type: 'text', label: 'Heading', required: true },
                    { name: 'description', type: 'textarea', label: 'Description' },
                    { name: 'emailPlaceholder', type: 'text', label: 'Email Placeholder' },
                    { name: 'ctaText', type: 'text', label: 'Button Text', required: true },
                    { name: 'benefits', type: 'array', label: 'Benefits List' },
                ]
            },
            componentCode: `export default function NewsletterSignup({ config }) { /* Newsletter form implementation */ }`,
        },
    });

    const contactForm = await prisma.blockTemplate.create({
        data: {
            name: 'Contact Form',
            slug: 'contact-form',
            description: 'Simple contact form',
            category: BlockCategory.FORM,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                heading: 'Get in Touch',
                description: "We'd love to hear from you",
                fields: ['name', 'email', 'message'],
                ctaText: 'Send Message',
            },
            configSchema: {
                fields: [
                    { name: 'heading', type: 'text', label: 'Heading', required: true },
                    { name: 'description', type: 'text', label: 'Description' },
                    { name: 'ctaText', type: 'text', label: 'Button Text', required: true },
                ]
            },
            componentCode: `export default function ContactForm({ config }) { /* Contact form implementation */ }`,
        },
    });

    console.log('✅ Created 2 Form block templates');

    // Content (4 templates)
    const faqAccordion = await prisma.blockTemplate.create({
        data: {
            name: 'FAQ - Accordion',
            slug: 'faq-accordion',
            description: 'Frequently asked questions with accordion',
            category: BlockCategory.FAQ,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                heading: 'Frequently Asked Questions',
                faqs: [
                    {
                        question: 'How does pricing work?',
                        answer: 'Our pricing is simple and transparent. Choose a plan that fits your needs and pay monthly or annually.',
                    },
                    {
                        question: 'What features are included?',
                        answer: 'All plans include our core features. Higher tiers unlock advanced capabilities.',
                    },
                ],
                defaultOpen: 0,
                allowMultipleOpen: false,
            },
            configSchema: {
                fields: [
                    { name: 'heading', type: 'text', label: 'Heading' },
                    {
                        name: 'faqs', type: 'repeater', label: 'FAQs', fields: [
                            { name: 'question', type: 'text', label: 'Question', required: true },
                            { name: 'answer', type: 'textarea', label: 'Answer', required: true },
                        ]
                    },
                    { name: 'defaultOpen', type: 'number', label: 'Default Open Index' },
                    { name: 'allowMultipleOpen', type: 'checkbox', label: 'Allow Multiple Open' },
                ]
            },
            componentCode: `export default function FAQAccordion({ config }) { /* FAQ accordion implementation */ }`,
        },
    });

    const statsShowcase = await prisma.blockTemplate.create({
        data: {
            name: 'Stats/Metrics Showcase',
            slug: 'stats-showcase',
            description: 'Display key metrics and statistics',
            category: BlockCategory.STATS,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                heading: 'The Numbers Speak for Themselves',
                stats: [
                    { value: '10,000+', label: 'Customers' },
                    { value: '99.9%', label: 'Uptime' },
                    { value: '24/7', label: 'Support' },
                    { value: '50M+', label: 'Transactions' },
                    { value: '4.9★', label: 'Rating' },
                    { value: '150+', label: 'Countries' },
                ],
                columns: 3,
            },
            configSchema: {
                fields: [
                    { name: 'heading', type: 'text', label: 'Heading' },
                    {
                        name: 'stats', type: 'repeater', label: 'Statistics', fields: [
                            { name: 'value', type: 'text', label: 'Value', required: true },
                            { name: 'label', type: 'text', label: 'Label', required: true },
                        ]
                    },
                    { name: 'columns', type: 'number', label: 'Columns', min: 2, max: 6 },
                ]
            },
            componentCode: `export default function StatsShowcase({ config }) { /* Stats showcase implementation */ }`,
        },
    });

    const teamGrid = await prisma.blockTemplate.create({
        data: {
            name: 'Team Grid',
            slug: 'team-grid',
            description: 'Team member grid with photos',
            category: BlockCategory.TEAM,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                heading: 'Meet Our Team',
                members: [
                    { name: 'John Doe', role: 'CEO', photo: '/team/john.jpg', bio: 'Founder and CEO' },
                    { name: 'Jane Smith', role: 'CTO', photo: '/team/jane.jpg', bio: 'Technology leader' },
                    { name: 'Mike Johnson', role: 'Designer', photo: '/team/mike.jpg', bio: 'Creative director' },
                ],
                columns: 3,
            },
            configSchema: {
                fields: [
                    { name: 'heading', type: 'text', label: 'Heading' },
                    {
                        name: 'members', type: 'repeater', label: 'Team Members', fields: [
                            { name: 'name', type: 'text', label: 'Name', required: true },
                            { name: 'role', type: 'text', label: 'Role', required: true },
                            { name: 'photo', type: 'image', label: 'Photo', required: true },
                            { name: 'bio', type: 'textarea', label: 'Bio' },
                        ]
                    },
                ]
            },
            componentCode: `export default function TeamGrid({ config }) { /* Team grid implementation */ }`,
        },
    });

    const galleryGrid = await prisma.blockTemplate.create({
        data: {
            name: 'Gallery - Image Grid',
            slug: 'gallery-grid',
            description: 'Image gallery in grid layout',
            category: BlockCategory.GALLERY,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                heading: 'Gallery',
                images: [
                    { url: '/gallery/1.jpg', alt: 'Image 1', caption: 'Caption 1' },
                    { url: '/gallery/2.jpg', alt: 'Image 2', caption: 'Caption 2' },
                    { url: '/gallery/3.jpg', alt: 'Image 3', caption: 'Caption 3' },
                ],
                columns: 3,
                lightbox: true,
            },
            configSchema: {
                fields: [
                    { name: 'heading', type: 'text', label: 'Heading' },
                    {
                        name: 'images', type: 'repeater', label: 'Images', fields: [
                            { name: 'url', type: 'image', label: 'Image', required: true },
                            { name: 'alt', type: 'text', label: 'Alt Text', required: true },
                            { name: 'caption', type: 'text', label: 'Caption' },
                        ]
                    },
                    { name: 'columns', type: 'number', label: 'Columns', min: 2, max: 6 },
                    { name: 'lightbox', type: 'checkbox', label: 'Enable Lightbox' },
                ]
            },
            componentCode: `export default function GalleryGrid({ config }) { /* Gallery grid implementation */ }`,
        },
    });

    console.log('✅ Created 4 Content block templates');

    const count = await prisma.blockTemplate.count();
    console.log(`\n🎉 Successfully seeded ${count} block templates!`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding block templates:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
