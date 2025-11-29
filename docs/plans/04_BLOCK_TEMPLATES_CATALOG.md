# Block Templates Catalog - Complete Specifications

## Overview
Complete specifications for all 23 system block templates that will be included in the CMS Page Builder.

Each template includes:
- Visual mockup
- Default configuration
- Configuration schema
- Component code structure
- Use cases

---

## Hero Blocks (5 templates)

### 1. Hero - Background Image with CTA

**Visual:**
```
┌────────────────────────────────────────────────┐
│  [Background Image with overlay]               │
│                                                │
│         Welcome to Our Platform               │
│    Build amazing things with our tools        │
│                                                │
│            [Get Started →]                     │
│                                                │
└────────────────────────────────────────────────┘
```

**Default Config:**
```json
{
  "heading": "Welcome to Our Platform",
  "subheading": "Build amazing things with our tools",
  "backgroundImage": "/defaults/hero-bg-1.jpg",
  "backgroundPosition": "center",
  "backgroundSize": "cover",
  "ctaPrimaryText": "Get Started",
  "ctaPrimaryLink": "/signup",
  "ctaSecondaryText": "",
  "ctaSecondaryLink": "",
  "textColor": "#ffffff",
  "overlayColor": "#000000",
  "overlayOpacity": 0.5,
  "contentAlignment": "center",
  "contentVerticalAlign": "center",
  "minHeight": "600px",
  "maxWidth": "800px",
  "paddingTop": "80px",
  "paddingBottom": "80px"
}
```

**Config Schema:**
```json
{
  "fields": [
    {
      "name": "heading",
      "type": "text",
      "label": "Main Heading",
      "required": true,
      "maxLength": 100,
      "placeholder": "Enter your headline..."
    },
    {
      "name": "subheading",
      "type": "textarea",
      "label": "Subheading",
      "required": false,
      "maxLength": 250,
      "rows": 3
    },
    {
      "name": "backgroundImage",
      "type": "image",
      "label": "Background Image",
      "required": true,
      "accept": "image/*",
      "recommended": "Minimum 1920x1080px"
    },
    {
      "name": "backgroundPosition",
      "type": "select",
      "label": "Image Position",
      "options": [
        { "value": "top", "label": "Top" },
        { "value": "center", "label": "Center" },
        { "value": "bottom", "label": "Bottom" }
      ]
    },
    {
      "name": "ctaPrimaryText",
      "type": "text",
      "label": "Primary Button Text",
      "required": true
    },
    {
      "name": "ctaPrimaryLink",
      "type": "text",
      "label": "Primary Button Link",
      "required": true
    },
    {
      "name": "ctaSecondaryText",
      "type": "text",
      "label": "Secondary Button Text (Optional)"
    },
    {
      "name": "ctaSecondaryLink",
      "type": "text",
      "label": "Secondary Button Link"
    },
    {
      "name": "textColor",
      "type": "color",
      "label": "Text Color",
      "default": "#ffffff"
    },
    {
      "name": "overlayOpacity",
      "type": "slider",
      "label": "Overlay Darkness",
      "min": 0,
      "max": 1,
      "step": 0.1,
      "default": 0.5
    },
    {
      "name": "contentAlignment",
      "type": "select",
      "label": "Text Alignment",
      "options": [
        { "value": "left", "label": "Left" },
        { "value": "center", "label": "Center" },
        { "value": "right", "label": "Right" }
      ]
    },
    {
      "name": "minHeight",
      "type": "text",
      "label": "Section Height",
      "default": "600px",
      "placeholder": "600px, 80vh, etc."
    }
  ]
}
```

**Use Cases:**
- Landing page headers
- Product launches
- Event announcements
- Homepage hero sections

---

### 2. Hero - Video Background

**Visual:**
```
┌────────────────────────────────────────────────┐
│  [Auto-playing background video]               │
│                                                │
│       See Our Product in Action               │
│                                                │
│         [Watch Demo] [Sign Up]                 │
│                                                │
└────────────────────────────────────────────────┘
```

**Default Config:**
```json
{
  "heading": "See Our Product in Action",
  "subheading": "",
  "videoUrl": "/defaults/hero-video.mp4",
  "videoPoster": "/defaults/video-poster.jpg",
  "videoMuted": true,
  "videoLoop": true,
  "videoAutoplay": true,
  "fallbackImage": "/defaults/hero-bg-2.jpg",
  "ctaPrimaryText": "Watch Demo",
  "ctaPrimaryLink": "#demo",
  "ctaSecondaryText": "Sign Up",
  "ctaSecondaryLink": "/signup",
  "textColor": "#ffffff",
  "overlayOpacity": 0.3,
  "contentAlignment": "center",
  "minHeight": "700px"
}
```

**Use Cases:**
- SaaS product demos
- App showcases
- Video-first brands
- Tech products

---

### 3. Hero - Split Layout (Image Left, Text Right)

**Visual:**
```
┌──────────────────┬─────────────────────────────┐
│                  │  Transform Your Business    │
│                  │                             │
│   [Product       │  Our platform helps...      │
│    Image]        │                             │
│                  │  ✓ Feature 1                │
│                  │  ✓ Feature 2                │
│                  │  ✓ Feature 3                │
│                  │                             │
│                  │  [Get Started →]            │
└──────────────────┴─────────────────────────────┘
```

**Default Config:**
```json
{
  "heading": "Transform Your Business",
  "description": "Our platform helps you achieve more with less effort.",
  "features": [
    "Automated workflows",
    "Real-time analytics",
    "24/7 support"
  ],
  "image": "/defaults/product-screenshot.png",
  "imagePosition": "left",
  "imageWidth": "50%",
  "ctaText": "Get Started",
  "ctaLink": "/signup",
  "backgroundColor": "#f9fafb",
  "textColor": "#111827"
}
```

**Use Cases:**
- Product features
- App screenshots
- Service highlights
- B2B landing pages

---

### 4. Hero - Minimal with Badge

**Visual:**
```
┌────────────────────────────────────────────────┐
│                                                │
│         [🏆 Trusted by 10,000+ companies]      │
│                                                │
│           The Best Way to Manage               │
│              Your Projects                     │
│                                                │
│        Simple, powerful, and built for teams   │
│                                                │
│  [Email address...] [Get Started Free →]      │
│                                                │
│         ⭐⭐⭐⭐⭐ 4.9/5 from 2,000 reviews      │
│                                                │
└────────────────────────────────────────────────┘
```

**Default Config:**
```json
{
  "badge": "🏆 Trusted by 10,000+ companies",
  "heading": "The Best Way to Manage Your Projects",
  "subheading": "Simple, powerful, and built for teams",
  "showEmailCapture": true,
  "emailPlaceholder": "Enter your email",
  "ctaText": "Get Started Free",
  "trustIndicator": "⭐⭐⭐⭐⭐ 4.9/5 from 2,000 reviews",
  "backgroundColor": "#ffffff",
  "textColor": "#111827"
}
```

**Use Cases:**
- SaaS landing pages
- Lead generation
- Email capture
- Trust-building

---

### 5. Hero - Gradient Background

**Visual:**
```
┌────────────────────────────────────────────────┐
│  [Gradient: Blue → Purple]                     │
│                                                │
│       Build Something Amazing                  │
│                                                │
│    The modern platform for modern teams        │
│                                                │
│         [Start Building] [See Demo]            │
│                                                │
└────────────────────────────────────────────────┘
```

**Default Config:**
```json
{
  "heading": "Build Something Amazing",
  "subheading": "The modern platform for modern teams",
  "gradientFrom": "#3b82f6",
  "gradientTo": "#8b5cf6",
  "gradientDirection": "135deg",
  "ctaPrimaryText": "Start Building",
  "ctaPrimaryLink": "/signup",
  "ctaSecondaryText": "See Demo",
  "ctaSecondaryLink": "/demo",
  "textColor": "#ffffff",
  "minHeight": "600px"
}
```

**Use Cases:**
- Modern brands
- Tech startups
- Creative agencies
- App launches

---

## Feature Sections (4 templates)

### 6. Features - 3-Column Grid

**Visual:**
```
┌────────────────────────────────────────────────┐
│          Why Choose Our Platform               │
│                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  [Icon]  │  │  [Icon]  │  │  [Icon]  │    │
│  │  Fast    │  │  Secure  │  │  Scalable│    │
│  │ Lightning│  │ Bank-grade│ │ Grows with│   │
│  │  speed   │  │ security │  │   you    │    │
│  └──────────┘  └──────────┘  └──────────┘    │
│                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  [Icon]  │  │  [Icon]  │  │  [Icon]  │    │
│  │  24/7    │  │  Easy    │  │  API     │    │
│  │ Support  │  │ Setup    │  │ Access   │    │
│  └──────────┘  └──────────┘  └──────────┘    │
└────────────────────────────────────────────────┘
```

**Default Config:**
```json
{
  "heading": "Why Choose Our Platform",
  "subheading": "Everything you need to succeed",
  "features": [
    {
      "icon": "⚡",
      "title": "Lightning Fast",
      "description": "Built for speed and performance"
    },
    {
      "icon": "🔒",
      "title": "Secure",
      "description": "Bank-grade security"
    },
    {
      "icon": "📈",
      "title": "Scalable",
      "description": "Grows with your business"
    },
    {
      "icon": "💬",
      "title": "24/7 Support",
      "description": "We're always here to help"
    },
    {
      "icon": "🎯",
      "title": "Easy Setup",
      "description": "Up and running in minutes"
    },
    {
      "icon": "🔌",
      "title": "API Access",
      "description": "Integrate with anything"
    }
  ],
  "columns": 3,
  "iconSize": "48px",
  "backgroundColor": "#ffffff"
}
```

**Use Cases:**
- Product features
- Service benefits
- Platform capabilities

---

### 7. Features - Alternating Layout

**Visual:**
```
┌────────────────────────────────────────────────┐
│  ┌────────────┐  Feature One                   │
│  │   [Image]  │  Description of feature one... │
│  │            │  • Benefit 1                   │
│  └────────────┘  • Benefit 2                   │
│                                                │
│  Feature Two      ┌────────────┐              │
│  Description...   │   [Image]  │              │
│  • Benefit 1      │            │              │
│  • Benefit 2      └────────────┘              │
│                                                │
│  ┌────────────┐  Feature Three                 │
│  │   [Image]  │  Description...                │
│  └────────────┘  • Benefit 1                   │
└────────────────────────────────────────────────┘
```

**Default Config:**
```json
{
  "features": [
    {
      "title": "Feature One",
      "description": "Description of feature one and how it helps users.",
      "image": "/defaults/feature-1.jpg",
      "imagePosition": "left",
      "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"]
    },
    {
      "title": "Feature Two",
      "description": "Description of feature two.",
      "image": "/defaults/feature-2.jpg",
      "imagePosition": "right",
      "benefits": ["Benefit 1", "Benefit 2"]
    }
  ]
}
```

---

### 8. Features - Icon Boxes

Similar to 3-column grid but with colored backgrounds and larger icons.

---

### 9. Features - With Screenshots

Features with actual product screenshots instead of icons.

---

## CTA Blocks (3 templates)

### 10. CTA - Full Width Banner

**Visual:**
```
┌────────────────────────────────────────────────┐
│  [Colored Background]                          │
│                                                │
│       Ready to Get Started?                    │
│    Start your free trial today. No credit card │
│    required.                                   │
│                                                │
│  [Email...] [Start Free Trial →]              │
│                                                │
└────────────────────────────────────────────────┘
```

**Default Config:**
```json
{
  "heading": "Ready to Get Started?",
  "description": "Start your free trial today. No credit card required.",
  "ctaText": "Start Free Trial",
  "ctaLink": "/signup",
  "showEmailCapture": true,
  "backgroundColor": "#3b82f6",
  "textColor": "#ffffff",
  "pattern": "none"
}
```

---

### 11. CTA - Card Style

**Visual:**
```
┌────────────────────────────────────────────────┐
│                                                │
│   ┌──────────────────────────────────────┐    │
│   │  💡                                  │    │
│   │  Ready to transform your workflow?    │    │
│   │  Join 10,000+ happy users             │    │
│   │                                       │    │
│   │  [Get Started Free]                   │    │
│   └──────────────────────────────────────┘    │
│                                                │
└────────────────────────────────────────────────┘
```

---

### 12. CTA - Split (Image + CTA)

**Visual:**
```
┌──────────────────┬─────────────────────────────┐
│                  │  One more thing...          │
│   [Decorative    │                             │
│    Image]        │  Don't miss out on our      │
│                  │  exclusive features         │
│                  │                             │
│                  │  [Get Access Now →]         │
└──────────────────┴─────────────────────────────┘
```

---

## Social Proof (3 templates)

### 13. Testimonials - Carousel

**Visual:**
```
┌────────────────────────────────────────────────┐
│          What Our Customers Say                │
│                                                │
│  ← ┌──────────────────────────────────────┐ → │
│    │ "This product changed everything for  │   │
│    │  our business. Highly recommended!"   │   │
│    │                                       │   │
│    │  - John Doe, CEO at Company          │   │
│    │  ⭐⭐⭐⭐⭐                            │   │
│    └──────────────────────────────────────┘   │
│                                                │
│              • • •  (pagination)               │
└────────────────────────────────────────────────┘
```

**Default Config:**
```json
{
  "heading": "What Our Customers Say",
  "testimonials": [
    {
      "quote": "This product changed everything for our business.",
      "author": "John Doe",
      "role": "CEO",
      "company": "Acme Corp",
      "avatar": "/avatars/1.jpg",
      "rating": 5
    },
    {
      "quote": "Best investment we've made this year.",
      "author": "Jane Smith",
      "role": "CTO",
      "company": "Tech Inc",
      "avatar": "/avatars/2.jpg",
      "rating": 5
    }
  ],
  "autoplay": true,
  "autoplayInterval": 5000,
  "showRating": true,
  "showAvatar": true
}
```

---

### 14. Testimonials - Grid

---

### 15. Logo Grid - Clients/Partners

**Visual:**
```
┌────────────────────────────────────────────────┐
│        Trusted by Leading Companies            │
│                                                │
│  [Logo] [Logo] [Logo] [Logo] [Logo] [Logo]    │
│                                                │
└────────────────────────────────────────────────┘
```

**Default Config:**
```json
{
  "heading": "Trusted by Leading Companies",
  "logos": [
    { "url": "/logos/company1.svg", "alt": "Company 1" },
    { "url": "/logos/company2.svg", "alt": "Company 2" },
    { "url": "/logos/company3.svg", "alt": "Company 3" }
  ],
  "columns": 6,
  "grayscale": true,
  "hoverEffect": "color"
}
```

---

## Pricing (2 templates)

### 16. Pricing - 3-Tier

**Visual:**
```
┌────────────────────────────────────────────────┐
│             Choose Your Plan                   │
│                                                │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ │  Starter │ │   Pro    │ │ Enterprise│        │
│ │   $9/mo  │ │  $29/mo  │ │  Custom   │        │
│ │          │ │ POPULAR  │ │           │        │
│ │ • 10 GB  │ │ • 100 GB │ │ • Unlimited│        │
│ │ • 1 user │ │ • 5 users│ │ • Unlimited│        │
│ │ [Start]  │ │ [Start]  │ │ [Contact] │        │
│ └──────────┘ └──────────┘ └──────────┘        │
└────────────────────────────────────────────────┘
```

**Default Config:**
```json
{
  "heading": "Choose Your Plan",
  "subheading": "Simple, transparent pricing",
  "plans": [
    {
      "name": "Starter",
      "price": "$9",
      "period": "/month",
      "features": ["10 GB storage", "1 user", "Basic support"],
      "ctaText": "Start Free Trial",
      "ctaLink": "/signup?plan=starter",
      "highlighted": false
    },
    {
      "name": "Pro",
      "price": "$29",
      "period": "/month",
      "badge": "POPULAR",
      "features": ["100 GB storage", "5 users", "Priority support", "Advanced analytics"],
      "ctaText": "Start Free Trial",
      "ctaLink": "/signup?plan=pro",
      "highlighted": true
    },
    {
      "name": "Enterprise",
      "price": "Custom",
      "period": "",
      "features": ["Unlimited storage", "Unlimited users", "24/7 support", "Custom integrations"],
      "ctaText": "Contact Sales",
      "ctaLink": "/contact",
      "highlighted": false
    }
  ],
  "showAnnualToggle": true,
  "annualDiscount": "Save 20%"
}
```

---

### 17. Pricing - Comparison Table

Full feature comparison table with checkmarks.

---

## Forms (2 templates)

### 18. Newsletter Signup

**Visual:**
```
┌────────────────────────────────────────────────┐
│         Stay in the Loop                       │
│    Get weekly updates and exclusive offers     │
│                                                │
│  [Enter your email...] [Subscribe →]          │
│                                                │
│  ✓ Weekly newsletter  ✓ No spam  ✓ Unsubscribe│
└────────────────────────────────────────────────┘
```

---

### 19. Contact Form

**Visual:**
```
┌────────────────────────────────────────────────┐
│            Get in Touch                        │
│                                                │
│  Name: _________________________________       │
│  Email: ________________________________       │
│  Message: ______________________________       │
│           ______________________________       │
│           ______________________________       │
│                                                │
│                      [Send Message →]          │
└────────────────────────────────────────────────┘
```

---

## Content (3 templates)

### 20. FAQ - Accordion

**Visual:**
```
┌────────────────────────────────────────────────┐
│      Frequently Asked Questions                │
│                                                │
│  ▼ How does pricing work?                     │
│    Our pricing is simple and transparent...   │
│                                                │
│  ▶ What features are included?                │
│                                                │
│  ▶ Can I cancel anytime?                      │
│                                                │
│  ▶ Do you offer refunds?                      │
└────────────────────────────────────────────────┘
```

**Default Config:**
```json
{
  "heading": "Frequently Asked Questions",
  "faqs": [
    {
      "question": "How does pricing work?",
      "answer": "Our pricing is simple and transparent. Choose a plan that fits your needs and pay monthly or annually."
    },
    {
      "question": "What features are included?",
      "answer": "All plans include our core features. Higher tiers unlock advanced capabilities."
    }
  ],
  "defaultOpen": 0,
  "allowMultipleOpen": false
}
```

---

### 21. Stats/Metrics Showcase

**Visual:**
```
┌────────────────────────────────────────────────┐
│     The Numbers Speak for Themselves           │
│                                                │
│    10,000+        99.9%         24/7          │
│   Customers      Uptime       Support          │
│                                                │
│      50M+          4.9★        150+           │
│   Transactions   Rating       Countries        │
└────────────────────────────────────────────────┘
```

---

### 22. Team Grid

**Visual:**
```
┌────────────────────────────────────────────────┐
│             Meet Our Team                      │
│                                                │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │ [Photo] │  │ [Photo] │  │ [Photo] │       │
│  │ John    │  │ Jane    │  │ Mike    │       │
│  │ CEO     │  │ CTO     │  │ Designer│       │
│  └─────────┘  └─────────┘  └─────────┘       │
└────────────────────────────────────────────────┘
```

---

### 23. Gallery - Image Grid

**Visual:**
```
┌────────────────────────────────────────────────┐
│             Our Gallery                        │
│                                                │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│  │[img] │ │[img] │ │[img] │ │[img] │         │
│  └──────┘ └──────┘ └──────┘ └──────┘         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│  │[img] │ │[img] │ │[img] │ │[img] │         │
│  └──────┘ └──────┘ └──────┘ └──────┘         │
└────────────────────────────────────────────────┘
```

---

## Summary

**Total System Blocks:** 23

**By Category:**
- Hero: 5 templates
- Features: 4 templates
- CTA: 3 templates
- Social Proof: 3 templates
- Pricing: 2 templates
- Forms: 2 templates
- Content: 4 templates

**All blocks include:**
- Complete default configuration
- Full config schema
- Responsive design
- Accessibility support
- Mobile optimized
- SEO friendly

**Next:** Page Builder Integration Details →
