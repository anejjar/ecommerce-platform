import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function robots(): Promise<MetadataRoute.Robots> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Default rules if no custom settings exist
    const defaultRules = {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/account/', '/cart', '/checkout', '/api/'],
    };

    let rules: MetadataRoute.Robots['rules'] = defaultRules;

    // Skip database call during build time when DATABASE_URL is not available
    if (process.env.DATABASE_URL) {
        try {
            // Fetch custom robots.txt content from settings
            const robotsSetting = await prisma.storeSetting.findUnique({
                where: { key: 'seo_robots_txt' },
            });

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
        } catch (error) {
            console.error('Error fetching robots.txt settings:', error);
            // Fall back to default rules on error
        }
    }

    return {
        rules,
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
