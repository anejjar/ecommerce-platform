import { PrismaClient, BlockCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding enhanced and new essential blocks...');

    // ============================================
    // ENHANCE EXISTING HERO BLOCKS WITH TABS
    // ============================================

    // Update Hero Background Image with enhanced settings
    const heroBgImage = await prisma.blockTemplate.findUnique({
        where: { slug: 'hero-background-image' }
    });

    if (heroBgImage) {
        await prisma.blockTemplate.update({
            where: { slug: 'hero-background-image' },
            data: {
                configSchema: {
                    tabs: [
                        {
                            id: 'content',
                            label: 'Content',
                            fields: [
                                { type: 'heading', label: 'Main Content', description: 'Configure the hero section content' },
                                { name: 'heading', type: 'text', label: 'Main Heading', required: true, maxLength: 100 },
                                { name: 'subheading', type: 'textarea', label: 'Subheading', maxLength: 250, rows: 3 },
                                { name: 'description', type: 'richtext', label: 'Description' },
                                { type: 'separator' },
                                { type: 'heading', label: 'Call to Action' },
                                { name: 'ctaPrimaryText', type: 'text', label: 'Primary Button Text', required: true },
                                { name: 'ctaPrimaryLink', type: 'url', label: 'Primary Button Link', required: true },
                                { name: 'ctaSecondaryText', type: 'text', label: 'Secondary Button Text (Optional)' },
                                { name: 'ctaSecondaryLink', type: 'url', label: 'Secondary Button Link' },
                                { name: 'showSecondaryCTA', type: 'checkbox', label: 'Show Secondary Button', 
                                    condition: { field: 'ctaSecondaryText', operator: 'isNotEmpty' } },
                            ]
                        },
                        {
                            id: 'media',
                            label: 'Media',
                            fields: [
                                { name: 'backgroundImage', type: 'image', label: 'Background Image', required: true, recommended: 'Minimum 1920x1080px' },
                                { name: 'backgroundPosition', type: 'select', label: 'Image Position', 
                                    options: [
                                        { value: 'top', label: 'Top' },
                                        { value: 'center', label: 'Center' },
                                        { value: 'bottom', label: 'Bottom' },
                                        { value: 'left', label: 'Left' },
                                        { value: 'right', label: 'Right' }
                                    ] },
                                { name: 'backgroundSize', type: 'select', label: 'Image Size',
                                    options: [
                                        { value: 'cover', label: 'Cover' },
                                        { value: 'contain', label: 'Contain' },
                                        { value: 'auto', label: 'Auto' }
                                    ] },
                                { name: 'backgroundRepeat', type: 'select', label: 'Repeat',
                                    options: [
                                        { value: 'no-repeat', label: 'No Repeat' },
                                        { value: 'repeat', label: 'Repeat' },
                                        { value: 'repeat-x', label: 'Repeat X' },
                                        { value: 'repeat-y', label: 'Repeat Y' }
                                    ] },
                            ]
                        },
                        {
                            id: 'style',
                            label: 'Style',
                            fields: [
                                { name: 'textColor', type: 'color', label: 'Text Color' },
                                { name: 'overlayColor', type: 'color', label: 'Overlay Color' },
                                { name: 'overlayOpacity', type: 'slider', label: 'Overlay Opacity', min: 0, max: 1, step: 0.1 },
                                { name: 'contentAlignment', type: 'select', label: 'Text Alignment',
                                    options: [
                                        { value: 'left', label: 'Left' },
                                        { value: 'center', label: 'Center' },
                                        { value: 'right', label: 'Right' }
                                    ] },
                                { name: 'contentVerticalAlign', type: 'select', label: 'Vertical Alignment',
                                    options: [
                                        { value: 'top', label: 'Top' },
                                        { value: 'center', label: 'Center' },
                                        { value: 'bottom', label: 'Bottom' }
                                    ] },
                            ]
                        },
                        {
                            id: 'layout',
                            label: 'Layout',
                            fields: [
                                { name: 'minHeight', type: 'text', label: 'Minimum Height', placeholder: '600px, 80vh, etc.' },
                                { name: 'maxWidth', type: 'text', label: 'Content Max Width', placeholder: '800px, 1200px, etc.' },
                                { name: 'paddingTop', type: 'text', label: 'Padding Top', placeholder: '80px' },
                                { name: 'paddingBottom', type: 'text', label: 'Padding Bottom', placeholder: '80px' },
                                { name: 'paddingLeft', type: 'text', label: 'Padding Left', placeholder: '20px' },
                                { name: 'paddingRight', type: 'text', label: 'Padding Right', placeholder: '20px' },
                            ]
                        }
                    ]
                }
            }
        });
        console.log('✅ Enhanced hero-background-image block');
    }

    // ============================================
    // NEW ESSENTIAL BLOCKS
    // ============================================

    // Navigation Block
    const navigation = await prisma.blockTemplate.create({
        data: {
            name: 'Navigation Bar',
            slug: 'navigation-bar',
            description: 'Responsive navigation bar with logo, menu items, and CTA button',
            category: BlockCategory.NAVIGATION,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                logo: '/logo.png',
                logoText: 'Your Brand',
                showLogo: true,
                menuItems: [
                    { label: 'Home', link: '/', type: 'link' },
                    { label: 'About', link: '/about', type: 'link' },
                    { label: 'Services', link: '/services', type: 'link' },
                    { label: 'Contact', link: '/contact', type: 'link' },
                ],
                ctaButton: { text: 'Get Started', link: '/signup', show: true },
                sticky: true,
                backgroundColor: '#ffffff',
                textColor: '#111827',
                mobileMenuStyle: 'hamburger',
            },
            configSchema: {
                tabs: [
                    {
                        id: 'content',
                        label: 'Content',
                        fields: [
                            { name: 'logo', type: 'image', label: 'Logo Image' },
                            { name: 'logoText', type: 'text', label: 'Logo Text (if no image)' },
                            { name: 'showLogo', type: 'checkbox', label: 'Show Logo' },
                            { type: 'separator' },
                            { type: 'heading', label: 'Menu Items' },
                            {
                                name: 'menuItems',
                                type: 'repeater',
                                label: 'Menu Items',
                                itemLabel: 'Menu Item {index}',
                                fields: [
                                    { name: 'label', type: 'text', label: 'Label', required: true },
                                    { name: 'link', type: 'url', label: 'Link', required: true },
                                    { name: 'type', type: 'select', label: 'Type',
                                        options: [
                                            { value: 'link', label: 'Link' },
                                            { value: 'dropdown', label: 'Dropdown' },
                                            { value: 'button', label: 'Button' }
                                        ] },
                                    { name: 'openInNewTab', type: 'checkbox', label: 'Open in New Tab' },
                                ]
                            },
                            { type: 'separator' },
                            { type: 'heading', label: 'Call to Action' },
                            { name: 'showCTA', type: 'checkbox', label: 'Show CTA Button' },
                            { name: 'ctaText', type: 'text', label: 'CTA Button Text',
                                condition: { field: 'showCTA', operator: 'equals', value: true } },
                            { name: 'ctaLink', type: 'url', label: 'CTA Button Link',
                                condition: { field: 'showCTA', operator: 'equals', value: true } },
                        ]
                    },
                    {
                        id: 'style',
                        label: 'Style',
                        fields: [
                            { name: 'backgroundColor', type: 'color', label: 'Background Color' },
                            { name: 'textColor', type: 'color', label: 'Text Color' },
                            { name: 'hoverColor', type: 'color', label: 'Hover Color' },
                            { name: 'sticky', type: 'checkbox', label: 'Sticky Navigation' },
                            { name: 'transparentOnTop', type: 'checkbox', label: 'Transparent on Scroll' },
                        ]
                    },
                    {
                        id: 'mobile',
                        label: 'Mobile',
                        fields: [
                            { name: 'mobileMenuStyle', type: 'select', label: 'Mobile Menu Style',
                                options: [
                                    { value: 'hamburger', label: 'Hamburger Menu' },
                                    { value: 'fullscreen', label: 'Fullscreen Overlay' },
                                    { value: 'sidebar', label: 'Sidebar' }
                                ] },
                            { name: 'mobileBreakpoint', type: 'number', label: 'Mobile Breakpoint (px)', min: 320, max: 1024 },
                        ]
                    }
                ]
            },
            componentCode: `export default function NavigationBar({ config }) { /* Navigation implementation */ }`,
        },
    });

    // Header Block
    const header = await prisma.blockTemplate.create({
        data: {
            name: 'Page Header',
            slug: 'page-header',
            description: 'Page header with title, breadcrumbs, and optional background',
            category: BlockCategory.HEADER,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                title: 'Page Title',
                subtitle: 'Page subtitle or description',
                showBreadcrumbs: true,
                backgroundImage: '',
                backgroundColor: '#f9fafb',
                textColor: '#111827',
                alignment: 'left',
                paddingTop: '60px',
                paddingBottom: '60px',
            },
            configSchema: {
                tabs: [
                    {
                        id: 'content',
                        label: 'Content',
                        fields: [
                            { name: 'title', type: 'text', label: 'Page Title', required: true },
                            { name: 'subtitle', type: 'textarea', label: 'Subtitle' },
                            { name: 'showBreadcrumbs', type: 'checkbox', label: 'Show Breadcrumbs' },
                        ]
                    },
                    {
                        id: 'style',
                        label: 'Style',
                        fields: [
                            { name: 'backgroundImage', type: 'image', label: 'Background Image' },
                            { name: 'backgroundColor', type: 'color', label: 'Background Color' },
                            { name: 'textColor', type: 'color', label: 'Text Color' },
                            { name: 'alignment', type: 'select', label: 'Text Alignment',
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
                            { name: 'paddingTop', type: 'text', label: 'Padding Top' },
                            { name: 'paddingBottom', type: 'text', label: 'Padding Bottom' },
                        ]
                    }
                ]
            },
            componentCode: `export default function PageHeader({ config }) { /* Header implementation */ }`,
        },
    });

    // Footer Block
    const footer = await prisma.blockTemplate.create({
        data: {
            name: 'Footer',
            slug: 'footer',
            description: 'Site footer with columns, links, social media, and copyright',
            category: BlockCategory.FOOTER,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                columns: [
                    {
                        title: 'Company',
                        links: [
                            { label: 'About Us', link: '/about' },
                            { label: 'Careers', link: '/careers' },
                            { label: 'Contact', link: '/contact' },
                        ]
                    },
                    {
                        title: 'Resources',
                        links: [
                            { label: 'Blog', link: '/blog' },
                            { label: 'Documentation', link: '/docs' },
                            { label: 'Support', link: '/support' },
                        ]
                    },
                ],
                showSocialLinks: true,
                socialLinks: [
                    { platform: 'facebook', url: 'https://facebook.com' },
                    { platform: 'twitter', url: 'https://twitter.com' },
                    { platform: 'instagram', url: 'https://instagram.com' },
                ],
                copyrightText: '© 2024 Your Company. All rights reserved.',
                backgroundColor: '#111827',
                textColor: '#ffffff',
            },
            configSchema: {
                tabs: [
                    {
                        id: 'content',
                        label: 'Content',
                        fields: [
                            { type: 'heading', label: 'Footer Columns' },
                            {
                                name: 'columns',
                                type: 'repeater',
                                label: 'Footer Columns',
                                itemLabel: 'Column {index}',
                                fields: [
                                    { name: 'title', type: 'text', label: 'Column Title', required: true },
                                    {
                                        name: 'links',
                                        type: 'repeater',
                                        label: 'Links',
                                        fields: [
                                            { name: 'label', type: 'text', label: 'Label', required: true },
                                            { name: 'link', type: 'url', label: 'Link', required: true },
                                            { name: 'openInNewTab', type: 'checkbox', label: 'Open in New Tab' },
                                        ]
                                    },
                                ]
                            },
                            { type: 'separator' },
                            { type: 'heading', label: 'Social Media' },
                            { name: 'showSocialLinks', type: 'checkbox', label: 'Show Social Links' },
                            {
                                name: 'socialLinks',
                                type: 'repeater',
                                label: 'Social Links',
                                itemLabel: '{platform}',
                                fields: [
                                    { name: 'platform', type: 'select', label: 'Platform', required: true,
                                        options: [
                                            { value: 'facebook', label: 'Facebook' },
                                            { value: 'twitter', label: 'Twitter' },
                                            { value: 'instagram', label: 'Instagram' },
                                            { value: 'linkedin', label: 'LinkedIn' },
                                            { value: 'youtube', label: 'YouTube' },
                                            { value: 'github', label: 'GitHub' },
                                            { value: 'tiktok', label: 'TikTok' },
                                        ] },
                                    { name: 'url', type: 'url', label: 'URL', required: true },
                                ],
                                condition: { field: 'showSocialLinks', operator: 'equals', value: true }
                            },
                            { type: 'separator' },
                            { type: 'heading', label: 'Copyright' },
                            { name: 'copyrightText', type: 'text', label: 'Copyright Text' },
                        ]
                    },
                    {
                        id: 'style',
                        label: 'Style',
                        fields: [
                            { name: 'backgroundColor', type: 'color', label: 'Background Color' },
                            { name: 'textColor', type: 'color', label: 'Text Color' },
                            { name: 'linkColor', type: 'color', label: 'Link Color' },
                            { name: 'linkHoverColor', type: 'color', label: 'Link Hover Color' },
                        ]
                    }
                ]
            },
            componentCode: `export default function Footer({ config }) { /* Footer implementation */ }`,
        },
    });

    // Social Links Block
    const socialLinks = await prisma.blockTemplate.create({
        data: {
            name: 'Social Media Links',
            slug: 'social-links',
            description: 'Social media icon links in various layouts',
            category: BlockCategory.SOCIAL,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                socialLinks: [
                    { platform: 'facebook', url: 'https://facebook.com', label: 'Facebook' },
                    { platform: 'twitter', url: 'https://twitter.com', label: 'Twitter' },
                    { platform: 'instagram', url: 'https://instagram.com', label: 'Instagram' },
                ],
                layout: 'horizontal',
                iconSize: '24px',
                showLabels: false,
                spacing: '16px',
            },
            configSchema: {
                tabs: [
                    {
                        id: 'content',
                        label: 'Content',
                        fields: [
                            {
                                name: 'socialLinks',
                                type: 'repeater',
                                label: 'Social Links',
                                itemLabel: '{platform}',
                                fields: [
                                    { name: 'platform', type: 'select', label: 'Platform', required: true,
                                        options: [
                                            { value: 'facebook', label: 'Facebook' },
                                            { value: 'twitter', label: 'Twitter' },
                                            { value: 'instagram', label: 'Instagram' },
                                            { value: 'linkedin', label: 'LinkedIn' },
                                            { value: 'youtube', label: 'YouTube' },
                                            { value: 'github', label: 'GitHub' },
                                            { value: 'tiktok', label: 'TikTok' },
                                            { value: 'pinterest', label: 'Pinterest' },
                                            { value: 'snapchat', label: 'Snapchat' },
                                        ] },
                                    { name: 'url', type: 'url', label: 'URL', required: true },
                                    { name: 'label', type: 'text', label: 'Label (optional)' },
                                ]
                            },
                        ]
                    },
                    {
                        id: 'style',
                        label: 'Style',
                        fields: [
                            { name: 'layout', type: 'select', label: 'Layout',
                                options: [
                                    { value: 'horizontal', label: 'Horizontal' },
                                    { value: 'vertical', label: 'Vertical' },
                                    { value: 'grid', label: 'Grid' }
                                ] },
                            { name: 'iconSize', type: 'text', label: 'Icon Size', placeholder: '24px' },
                            { name: 'showLabels', type: 'checkbox', label: 'Show Labels' },
                            { name: 'spacing', type: 'text', label: 'Spacing', placeholder: '16px' },
                            { name: 'iconColor', type: 'color', label: 'Icon Color' },
                            { name: 'hoverColor', type: 'color', label: 'Hover Color' },
                        ]
                    }
                ]
            },
            componentCode: `export default function SocialLinks({ config }) { /* Social links implementation */ }`,
        },
    });

    // Breadcrumbs Block
    const breadcrumbs = await prisma.blockTemplate.create({
        data: {
            name: 'Breadcrumbs',
            slug: 'breadcrumbs',
            description: 'Navigation breadcrumbs for page hierarchy',
            category: BlockCategory.BREADCRUMBS,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                items: [
                    { label: 'Home', link: '/' },
                    { label: 'Category', link: '/category' },
                    { label: 'Current Page', link: '', current: true },
                ],
                separator: '/',
                showHomeIcon: true,
                textColor: '#6b7280',
                activeColor: '#111827',
            },
            configSchema: {
                tabs: [
                    {
                        id: 'content',
                        label: 'Content',
                        fields: [
                            {
                                name: 'items',
                                type: 'repeater',
                                label: 'Breadcrumb Items',
                                itemLabel: '{label}',
                                fields: [
                                    { name: 'label', type: 'text', label: 'Label', required: true },
                                    { name: 'link', type: 'url', label: 'Link' },
                                    { name: 'current', type: 'checkbox', label: 'Current Page' },
                                ]
                            },
                        ]
                    },
                    {
                        id: 'style',
                        label: 'Style',
                        fields: [
                            { name: 'separator', type: 'select', label: 'Separator',
                                options: [
                                    { value: '/', label: 'Slash (/)' },
                                    { value: '>', label: 'Arrow (>)' },
                                    { value: '•', label: 'Bullet (•)' },
                                    { value: '→', label: 'Arrow (→)' },
                                    { value: '|', label: 'Pipe (|)' }
                                ] },
                            { name: 'showHomeIcon', type: 'checkbox', label: 'Show Home Icon' },
                            { name: 'textColor', type: 'color', label: 'Text Color' },
                            { name: 'activeColor', type: 'color', label: 'Active Color' },
                            { name: 'hoverColor', type: 'color', label: 'Hover Color' },
                        ]
                    }
                ]
            },
            componentCode: `export default function Breadcrumbs({ config }) { /* Breadcrumbs implementation */ }`,
        },
    });

    // Divider Block
    const divider = await prisma.blockTemplate.create({
        data: {
            name: 'Divider / Separator',
            slug: 'divider',
            description: 'Visual divider line to separate content sections',
            category: BlockCategory.DIVIDER,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                style: 'solid',
                color: '#e5e7eb',
                width: '100%',
                thickness: '1px',
                spacing: '40px',
            },
            configSchema: {
                tabs: [
                    {
                        id: 'style',
                        label: 'Style',
                        fields: [
                            { name: 'style', type: 'select', label: 'Line Style',
                                options: [
                                    { value: 'solid', label: 'Solid' },
                                    { value: 'dashed', label: 'Dashed' },
                                    { value: 'dotted', label: 'Dotted' },
                                    { value: 'double', label: 'Double' },
                                    { value: 'gradient', label: 'Gradient' }
                                ] },
                            { name: 'color', type: 'color', label: 'Color' },
                            { name: 'width', type: 'text', label: 'Width', placeholder: '100%, 50%, 200px' },
                            { name: 'thickness', type: 'text', label: 'Thickness', placeholder: '1px, 2px, etc.' },
                            { name: 'spacing', type: 'text', label: 'Vertical Spacing', placeholder: '40px' },
                            { name: 'alignment', type: 'select', label: 'Alignment',
                                options: [
                                    { value: 'left', label: 'Left' },
                                    { value: 'center', label: 'Center' },
                                    { value: 'right', label: 'Right' }
                                ] },
                        ]
                    }
                ]
            },
            componentCode: `export default function Divider({ config }) { /* Divider implementation */ }`,
        },
    });

    // Spacer Block
    const spacer = await prisma.blockTemplate.create({
        data: {
            name: 'Spacer / Whitespace',
            slug: 'spacer',
            description: 'Add vertical spacing between sections',
            category: BlockCategory.SPACER,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                height: '60px',
                mobileHeight: '40px',
                backgroundColor: 'transparent',
            },
            configSchema: {
                tabs: [
                    {
                        id: 'layout',
                        label: 'Layout',
                        fields: [
                            { name: 'height', type: 'text', label: 'Height', placeholder: '60px, 5rem, 10vh' },
                            { name: 'mobileHeight', type: 'text', label: 'Mobile Height', placeholder: '40px' },
                            { name: 'backgroundColor', type: 'color', label: 'Background Color' },
                        ]
                    }
                ]
            },
            componentCode: `export default function Spacer({ config }) { /* Spacer implementation */ }`,
        },
    });

    // Video Block (Enhanced)
    const videoBlock = await prisma.blockTemplate.create({
        data: {
            name: 'Video Player',
            slug: 'video-player',
            description: 'Embed video with custom controls and styling',
            category: BlockCategory.VIDEO,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                videoUrl: '',
                videoType: 'youtube',
                autoplay: false,
                loop: false,
                muted: false,
                controls: true,
                poster: '',
                aspectRatio: '16:9',
                maxWidth: '100%',
            },
            configSchema: {
                tabs: [
                    {
                        id: 'content',
                        label: 'Content',
                        fields: [
                            { name: 'videoUrl', type: 'url', label: 'Video URL', required: true },
                            { name: 'videoType', type: 'select', label: 'Video Type',
                                options: [
                                    { value: 'youtube', label: 'YouTube' },
                                    { value: 'vimeo', label: 'Vimeo' },
                                    { value: 'direct', label: 'Direct URL' },
                                    { value: 'self-hosted', label: 'Self-Hosted' }
                                ] },
                            { name: 'poster', type: 'image', label: 'Poster Image (thumbnail)' },
                        ]
                    },
                    {
                        id: 'settings',
                        label: 'Settings',
                        fields: [
                            { name: 'autoplay', type: 'checkbox', label: 'Autoplay' },
                            { name: 'loop', type: 'checkbox', label: 'Loop' },
                            { name: 'muted', type: 'checkbox', label: 'Muted' },
                            { name: 'controls', type: 'checkbox', label: 'Show Controls' },
                        ]
                    },
                    {
                        id: 'style',
                        label: 'Style',
                        fields: [
                            { name: 'aspectRatio', type: 'select', label: 'Aspect Ratio',
                                options: [
                                    { value: '16:9', label: '16:9 (Widescreen)' },
                                    { value: '4:3', label: '4:3 (Standard)' },
                                    { value: '1:1', label: '1:1 (Square)' },
                                    { value: '21:9', label: '21:9 (Ultrawide)' }
                                ] },
                            { name: 'maxWidth', type: 'text', label: 'Max Width', placeholder: '100%, 1200px' },
                            { name: 'borderRadius', type: 'text', label: 'Border Radius', placeholder: '8px' },
                        ]
                    }
                ]
            },
            componentCode: `export default function VideoPlayer({ config }) { /* Video player implementation */ }`,
        },
    });

    // Text Content Block (Enhanced)
    const textContent = await prisma.blockTemplate.create({
        data: {
            name: 'Text Content',
            slug: 'text-content',
            description: 'Rich text content block with formatting options',
            category: BlockCategory.CONTENT,
            isSystem: true,
            isActive: true,
            defaultConfig: {
                content: '<p>Enter your text content here...</p>',
                maxWidth: '800px',
                textAlign: 'left',
                textColor: '#111827',
                backgroundColor: 'transparent',
            },
            configSchema: {
                tabs: [
                    {
                        id: 'content',
                        label: 'Content',
                        fields: [
                            { name: 'content', type: 'richtext', label: 'Content', required: true },
                        ]
                    },
                    {
                        id: 'style',
                        label: 'Style',
                        fields: [
                            { name: 'maxWidth', type: 'text', label: 'Max Width', placeholder: '800px, 100%' },
                            { name: 'textAlign', type: 'select', label: 'Text Alignment',
                                options: [
                                    { value: 'left', label: 'Left' },
                                    { value: 'center', label: 'Center' },
                                    { value: 'right', label: 'Right' },
                                    { value: 'justify', label: 'Justify' }
                                ] },
                            { name: 'textColor', type: 'color', label: 'Text Color' },
                            { name: 'backgroundColor', type: 'color', label: 'Background Color' },
                            { name: 'padding', type: 'text', label: 'Padding', placeholder: '20px' },
                        ]
                    }
                ]
            },
            componentCode: `export default function TextContent({ config }) { /* Text content implementation */ }`,
        },
    });

    console.log('✅ Created 8 new essential blocks');
    console.log('✅ Enhanced existing hero blocks');

    const count = await prisma.blockTemplate.count();
    console.log(`\n🎉 Total block templates: ${count}`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding enhanced blocks:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

