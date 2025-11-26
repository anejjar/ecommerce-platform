import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function robots(): Promise<MetadataRoute.Robots> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Fetch custom robots.txt content from settings
    const robotsSetting = await prisma.storeSetting.findUnique({
        where: { key: 'seo_robots_txt' },
    });

    // Default rules if no custom settings exist
    const defaultRules = {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/account/', '/cart', '/checkout', '/api/'],
    };

    // If custom rules exist, parse them (simple implementation)
    // For a full raw robots.txt override, we might need a different approach,
    // but Next.js robots() returns an object.
    // If the user provides raw text, we might want to just return that if possible,
    // but Next.js types enforce the object structure.
    // So we'll stick to the object structure for now, or parse the text if we want to be fancy.
    // For simplicity and safety, we will stick to the default structure + any custom additions if we were to parse them.
    // BUT, the plan said "Textarea for editing robots.txt rules".
    // If the user pastes raw text, mapping it to the object is hard.
    // A better approach for "Textarea" is to serve a raw route, BUT `app/robots.ts` is the Next.js way.
    // Let's stick to the default safe rules for now, and maybe later allow specific user-agent overrides if needed.
    // Actually, let's just use the defaults for now as a baseline, and if we want to allow full customisation,
    // we might need to parse the textarea line by line.

    // Let's try to parse simple Allow/Disallow lines if provided, otherwise default.
    let rules: MetadataRoute.Robots['rules'] = defaultRules;

    if (robotsSetting?.value) {
        const lines = robotsSetting.value.split('\n');
        const customDisallow: string[] = [];
        const customAllow: string[] = [];

        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.toLowerCase().startsWith('disallow:')) {
                customDisallow.push(trimmed.substring(9).trim());
            } else if (trimmed.toLowerCase().startsWith('allow:')) {
                customAllow.push(trimmed.substring(6).trim());
            }
        });

        if (customDisallow.length > 0 || customAllow.length > 0) {
            rules = {
                userAgent: '*',
                allow: customAllow.length > 0 ? customAllow : '/',
                disallow: customDisallow.length > 0 ? customDisallow : ['/admin/', '/account/', '/cart', '/checkout', '/api/'],
            };
        }
    }

    return {
        rules,
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
