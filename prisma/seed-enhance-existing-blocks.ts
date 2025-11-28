import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Enhancing existing blocks with tabs and more settings...');

    // ============================================
    // ENHANCE FEATURES BLOCKS
    // ============================================

    const features3Column = await prisma.blockTemplate.findUnique({
        where: { slug: 'features-3-column-grid' }
    });

    if (features3Column) {
        await prisma.blockTemplate.update({
            where: { slug: 'features-3-column-grid' },
            data: {
                configSchema: {
                    tabs: [
                        {
                            id: 'content',
                            label: 'Content',
                            fields: [
                                { type: 'heading', label: 'Section Header' },
                                { name: 'heading', type: 'text', label: 'Heading', required: true },
                                { name: 'subheading', type: 'textarea', label: 'Subheading', rows: 2 },
                                { name: 'description', type: 'richtext', label: 'Description' },
                                { type: 'separator' },
                                { type: 'heading', label: 'Features' },
                                {
                                    name: 'features',
                                    type: 'repeater',
                                    label: 'Features',
                                    itemLabel: 'Feature {index}',
                                    fields: [
                                        { name: 'icon', type: 'text', label: 'Icon (emoji or URL)' },
                                        { name: 'iconImage', type: 'image', label: 'Icon Image (if not emoji)' },
                                        { name: 'title', type: 'text', label: 'Title', required: true },
                                        { name: 'description', type: 'textarea', label: 'Description', rows: 3 },
                                        { name: 'link', type: 'url', label: 'Link (optional)' },
                                    ]
                                },
                            ]
                        },
                        {
                            id: 'layout',
                            label: 'Layout',
                            fields: [
                                {
                                    name: 'columns',
                                    type: 'select',
                                    label: 'Columns',
                                    options: [
                                        { value: 2, label: '2 Columns' },
                                        { value: 3, label: '3 Columns' },
                                        { value: 4, label: '4 Columns' },
                                        { value: 6, label: '6 Columns' }
                                    ]
                                },
                                { name: 'iconSize', type: 'text', label: 'Icon Size', placeholder: '48px' },
                                { name: 'gap', type: 'text', label: 'Gap Between Items', placeholder: '24px' },
                            ]
                        },
                        {
                            id: 'style',
                            label: 'Style',
                            fields: [
                                { name: 'backgroundColor', type: 'color', label: 'Background Color' },
                                { name: 'textColor', type: 'color', label: 'Text Color' },
                                { name: 'headingColor', type: 'color', label: 'Heading Color' },
                                { name: 'cardBackground', type: 'color', label: 'Card Background Color' },
                                { name: 'cardBorder', type: 'checkbox', label: 'Show Card Border' },
                                { name: 'cardShadow', type: 'checkbox', label: 'Show Card Shadow' },
                            ]
                        }
                    ]
                }
            }
        });
        console.log('✅ Enhanced features-3-column-grid');
    }

    // ============================================
    // ENHANCE CTA BLOCKS
    // ============================================

    const ctaFullWidth = await prisma.blockTemplate.findUnique({
        where: { slug: 'cta-full-width' }
    });

    if (ctaFullWidth) {
        await prisma.blockTemplate.update({
            where: { slug: 'cta-full-width' },
            data: {
                configSchema: {
                    tabs: [
                        {
                            id: 'content',
                            label: 'Content',
                            fields: [
                                { name: 'heading', type: 'text', label: 'Heading', required: true },
                                { name: 'description', type: 'textarea', label: 'Description', rows: 3 },
                                { type: 'separator' },
                                { type: 'heading', label: 'Call to Action' },
                                { name: 'ctaText', type: 'text', label: 'Button Text', required: true },
                                { name: 'ctaLink', type: 'url', label: 'Button Link', required: true },
                                { name: 'ctaStyle', type: 'select', label: 'Button Style',
                                    options: [
                                        { value: 'primary', label: 'Primary' },
                                        { value: 'secondary', label: 'Secondary' },
                                        { value: 'outline', label: 'Outline' },
                                        { value: 'ghost', label: 'Ghost' }
                                    ] },
                                { name: 'showSecondaryCTA', type: 'checkbox', label: 'Show Secondary Button' },
                                { name: 'secondaryCTAText', type: 'text', label: 'Secondary Button Text',
                                    condition: { field: 'showSecondaryCTA', operator: 'equals', value: true } },
                                { name: 'secondaryCTALink', type: 'url', label: 'Secondary Button Link',
                                    condition: { field: 'showSecondaryCTA', operator: 'equals', value: true } },
                            ]
                        },
                        {
                            id: 'style',
                            label: 'Style',
                            fields: [
                                { name: 'backgroundColor', type: 'color', label: 'Background Color' },
                                { name: 'backgroundImage', type: 'image', label: 'Background Image' },
                                { name: 'textColor', type: 'color', label: 'Text Color' },
                                { name: 'overlayColor', type: 'color', label: 'Overlay Color' },
                                { name: 'overlayOpacity', type: 'slider', label: 'Overlay Opacity', min: 0, max: 1, step: 0.1 },
                                { name: 'alignment', type: 'select', label: 'Content Alignment',
                                    options: [
                                        { value: 'left', label: 'Left' },
                                        { value: 'center', label: 'Center' },
                                        { value: 'right', label: 'Right' }
                                    ] },
                            ]
                        },
                        {
                            id: 'layout',
                            label: 'Layout',
                            fields: [
                                { name: 'paddingTop', type: 'text', label: 'Padding Top', placeholder: '80px' },
                                { name: 'paddingBottom', type: 'text', label: 'Padding Bottom', placeholder: '80px' },
                                { name: 'maxWidth', type: 'text', label: 'Content Max Width', placeholder: '800px' },
                            ]
                        }
                    ]
                }
            }
        });
        console.log('✅ Enhanced cta-full-width');
    }

    // ============================================
    // ENHANCE TESTIMONIALS BLOCKS
    // ============================================

    const testimonialsCarousel = await prisma.blockTemplate.findUnique({
        where: { slug: 'testimonials-carousel' }
    });

    if (testimonialsCarousel) {
        await prisma.blockTemplate.update({
            where: { slug: 'testimonials-carousel' },
            data: {
                configSchema: {
                    tabs: [
                        {
                            id: 'content',
                            label: 'Content',
                            fields: [
                                { type: 'heading', label: 'Section Header' },
                                { name: 'heading', type: 'text', label: 'Heading' },
                                { name: 'subheading', type: 'textarea', label: 'Subheading' },
                                { type: 'separator' },
                                { type: 'heading', label: 'Testimonials' },
                                {
                                    name: 'testimonials',
                                    type: 'repeater',
                                    label: 'Testimonials',
                                    itemLabel: 'Testimonial {index}',
                                    fields: [
                                        { name: 'quote', type: 'textarea', label: 'Quote', required: true, rows: 4 },
                                        { name: 'author', type: 'text', label: 'Author Name', required: true },
                                        { name: 'role', type: 'text', label: 'Author Role/Title' },
                                        { name: 'company', type: 'text', label: 'Company' },
                                        { name: 'avatar', type: 'image', label: 'Avatar Image' },
                                        { name: 'rating', type: 'number', label: 'Rating (1-5)', min: 1, max: 5 },
                                    ]
                                },
                            ]
                        },
                        {
                            id: 'carousel',
                            label: 'Carousel',
                            fields: [
                                { name: 'autoplay', type: 'checkbox', label: 'Autoplay' },
                                { name: 'autoplaySpeed', type: 'number', label: 'Autoplay Speed (ms)', min: 1000, max: 10000, step: 500,
                                    condition: { field: 'autoplay', operator: 'equals', value: true } },
                                { name: 'showDots', type: 'checkbox', label: 'Show Dots' },
                                { name: 'showArrows', type: 'checkbox', label: 'Show Arrows' },
                                { name: 'slidesToShow', type: 'number', label: 'Slides to Show', min: 1, max: 5 },
                            ]
                        },
                        {
                            id: 'style',
                            label: 'Style',
                            fields: [
                                { name: 'backgroundColor', type: 'color', label: 'Background Color' },
                                { name: 'textColor', type: 'color', label: 'Text Color' },
                                { name: 'cardBackground', type: 'color', label: 'Card Background' },
                                { name: 'cardShadow', type: 'checkbox', label: 'Card Shadow' },
                                { name: 'showStars', type: 'checkbox', label: 'Show Star Rating' },
                            ]
                        }
                    ]
                }
            }
        });
        console.log('✅ Enhanced testimonials-carousel');
    }

    // ============================================
    // ENHANCE PRICING BLOCKS
    // ============================================

    const pricing3Tier = await prisma.blockTemplate.findUnique({
        where: { slug: 'pricing-3-tier' }
    });

    if (pricing3Tier) {
        await prisma.blockTemplate.update({
            where: { slug: 'pricing-3-tier' },
            data: {
                configSchema: {
                    tabs: [
                        {
                            id: 'content',
                            label: 'Content',
                            fields: [
                                { type: 'heading', label: 'Section Header' },
                                { name: 'heading', type: 'text', label: 'Heading' },
                                { name: 'subheading', type: 'textarea', label: 'Subheading' },
                                { type: 'separator' },
                                { type: 'heading', label: 'Pricing Plans' },
                                {
                                    name: 'plans',
                                    type: 'repeater',
                                    label: 'Pricing Plans',
                                    itemLabel: 'Plan {index}',
                                    fields: [
                                        { name: 'name', type: 'text', label: 'Plan Name', required: true },
                                        { name: 'price', type: 'text', label: 'Price', required: true, placeholder: '29' },
                                        { name: 'currency', type: 'text', label: 'Currency', placeholder: '$' },
                                        { name: 'period', type: 'text', label: 'Period', placeholder: '/month' },
                                        { name: 'description', type: 'textarea', label: 'Description', rows: 2 },
                                        { name: 'highlighted', type: 'checkbox', label: 'Highlighted Plan' },
                                        { name: 'ctaText', type: 'text', label: 'Button Text', required: true },
                                        { name: 'ctaLink', type: 'url', label: 'Button Link', required: true },
                                        {
                                            name: 'features',
                                            type: 'repeater',
                                            label: 'Features',
                                            fields: [
                                                { name: 'text', type: 'text', label: 'Feature', required: true },
                                                { name: 'included', type: 'checkbox', label: 'Included', default: true },
                                            ]
                                        },
                                    ]
                                },
                            ]
                        },
                        {
                            id: 'style',
                            label: 'Style',
                            fields: [
                                { name: 'backgroundColor', type: 'color', label: 'Background Color' },
                                { name: 'cardBackground', type: 'color', label: 'Card Background' },
                                { name: 'highlightedColor', type: 'color', label: 'Highlighted Plan Color' },
                                { name: 'cardShadow', type: 'checkbox', label: 'Card Shadow' },
                                { name: 'cardBorder', type: 'checkbox', label: 'Card Border' },
                            ]
                        },
                        {
                            id: 'layout',
                            label: 'Layout',
                            fields: [
                                {
                                    name: 'columns',
                                    type: 'select',
                                    label: 'Columns',
                                    options: [
                                        { value: 2, label: '2 Columns' },
                                        { value: 3, label: '3 Columns' },
                                        { value: 4, label: '4 Columns' }
                                    ]
                                },
                                { name: 'gap', type: 'text', label: 'Gap Between Cards', placeholder: '24px' },
                            ]
                        }
                    ]
                }
            }
        });
        console.log('✅ Enhanced pricing-3-tier');
    }

    // ============================================
    // ENHANCE FAQ BLOCK
    // ============================================

    const faqAccordion = await prisma.blockTemplate.findUnique({
        where: { slug: 'faq-accordion' }
    });

    if (faqAccordion) {
        await prisma.blockTemplate.update({
            where: { slug: 'faq-accordion' },
            data: {
                configSchema: {
                    tabs: [
                        {
                            id: 'content',
                            label: 'Content',
                            fields: [
                                { type: 'heading', label: 'Section Header' },
                                { name: 'heading', type: 'text', label: 'Heading' },
                                { name: 'subheading', type: 'textarea', label: 'Subheading' },
                                { type: 'separator' },
                                { type: 'heading', label: 'Questions & Answers' },
                                {
                                    name: 'faqs',
                                    type: 'repeater',
                                    label: 'FAQs',
                                    itemLabel: 'FAQ {index}',
                                    fields: [
                                        { name: 'question', type: 'text', label: 'Question', required: true },
                                        { name: 'answer', type: 'richtext', label: 'Answer', required: true },
                                        { name: 'category', type: 'text', label: 'Category (optional)' },
                                    ]
                                },
                            ]
                        },
                        {
                            id: 'settings',
                            label: 'Settings',
                            fields: [
                                { name: 'defaultOpen', type: 'number', label: 'Default Open Index (-1 for none)', min: -1, max: 100 },
                                { name: 'allowMultipleOpen', type: 'checkbox', label: 'Allow Multiple Open' },
                                { name: 'showCategories', type: 'checkbox', label: 'Show Categories' },
                            ]
                        },
                        {
                            id: 'style',
                            label: 'Style',
                            fields: [
                                { name: 'backgroundColor', type: 'color', label: 'Background Color' },
                                { name: 'textColor', type: 'color', label: 'Text Color' },
                                { name: 'headerBackground', type: 'color', label: 'Header Background' },
                                { name: 'headerTextColor', type: 'color', label: 'Header Text Color' },
                                { name: 'borderColor', type: 'color', label: 'Border Color' },
                            ]
                        }
                    ]
                }
            }
        });
        console.log('✅ Enhanced faq-accordion');
    }

    // ============================================
    // ENHANCE GALLERY BLOCK
    // ============================================

    const galleryGrid = await prisma.blockTemplate.findUnique({
        where: { slug: 'gallery-grid' }
    });

    if (galleryGrid) {
        await prisma.blockTemplate.update({
            where: { slug: 'gallery-grid' },
            data: {
                configSchema: {
                    tabs: [
                        {
                            id: 'content',
                            label: 'Content',
                            fields: [
                                { type: 'heading', label: 'Section Header' },
                                { name: 'heading', type: 'text', label: 'Heading' },
                                { name: 'subheading', type: 'textarea', label: 'Subheading' },
                                { type: 'separator' },
                                { type: 'heading', label: 'Images' },
                                {
                                    name: 'images',
                                    type: 'repeater',
                                    label: 'Images',
                                    itemLabel: 'Image {index}',
                                    fields: [
                                        { name: 'url', type: 'image', label: 'Image', required: true },
                                        { name: 'alt', type: 'text', label: 'Alt Text', required: true },
                                        { name: 'caption', type: 'text', label: 'Caption' },
                                        { name: 'link', type: 'url', label: 'Link (optional)' },
                                    ]
                                },
                            ]
                        },
                        {
                            id: 'layout',
                            label: 'Layout',
                            fields: [
                                {
                                    name: 'columns',
                                    type: 'select',
                                    label: 'Columns',
                                    options: [
                                        { value: 2, label: '2 Columns' },
                                        { value: 3, label: '3 Columns' },
                                        { value: 4, label: '4 Columns' },
                                        { value: 5, label: '5 Columns' },
                                        { value: 6, label: '6 Columns' }
                                    ]
                                },
                                { name: 'gap', type: 'text', label: 'Gap Between Images', placeholder: '8px' },
                                { name: 'aspectRatio', type: 'select', label: 'Aspect Ratio',
                                    options: [
                                        { value: 'auto', label: 'Auto' },
                                        { value: '1:1', label: 'Square (1:1)' },
                                        { value: '16:9', label: 'Widescreen (16:9)' },
                                        { value: '4:3', label: 'Standard (4:3)' },
                                        { value: '3:2', label: 'Photo (3:2)' }
                                    ] },
                            ]
                        },
                        {
                            id: 'settings',
                            label: 'Settings',
                            fields: [
                                { name: 'lightbox', type: 'checkbox', label: 'Enable Lightbox' },
                                { name: 'showCaptions', type: 'checkbox', label: 'Show Captions' },
                                { name: 'lazyLoad', type: 'checkbox', label: 'Lazy Load Images' },
                            ]
                        },
                        {
                            id: 'style',
                            label: 'Style',
                            fields: [
                                { name: 'backgroundColor', type: 'color', label: 'Background Color' },
                                { name: 'imageBorderRadius', type: 'text', label: 'Image Border Radius', placeholder: '8px' },
                                { name: 'imageShadow', type: 'checkbox', label: 'Image Shadow' },
                                { name: 'hoverEffect', type: 'select', label: 'Hover Effect',
                                    options: [
                                        { value: 'none', label: 'None' },
                                        { value: 'zoom', label: 'Zoom' },
                                        { value: 'fade', label: 'Fade' },
                                        { value: 'lift', label: 'Lift' }
                                    ] },
                            ]
                        }
                    ]
                }
            }
        });
        console.log('✅ Enhanced gallery-grid');
    }

    console.log('\n🎉 Successfully enhanced existing blocks!');
}

main()
    .catch((e) => {
        console.error('❌ Error enhancing blocks:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

