import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlockRenderer } from '@/components/landing-page/BlockRenderer';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

interface LandingPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

async function getLandingPage(slug: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/landing-pages/${slug}`, {
    cache: 'no-store', // TODO: Change to ISR with revalidation
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPage(slug);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || page.description,
    openGraph: {
      title: page.ogTitle || page.seoTitle || page.title,
      description: page.ogDescription || page.seoDescription || page.description,
      images: page.ogImage ? [{ url: page.ogImage }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.ogTitle || page.seoTitle || page.title,
      description: page.ogDescription || page.seoDescription || page.description,
      images: page.ogImage ? [page.ogImage] : [],
    },
    keywords: page.seoKeywords || undefined,
  };
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { slug } = await params;
  const page = await getLandingPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="landing-page">
      {/* Inject custom CSS if provided */}
      {page.customCss && (
        <style dangerouslySetInnerHTML={{ __html: page.customCss }} />
      )}

      {/* Render all blocks */}
      <div className="landing-page-blocks">
        {page.blocks
          .filter((block: any) => block.isVisible)
          .sort((a: any, b: any) => a.order - b.order)
          .map((block: any) => (
            <BlockRenderer key={block.id} block={block} landingPageId={page.id} />
          ))}
      </div>

      {/* Inject custom JS if provided */}
      {page.customJs && (
        <script dangerouslySetInnerHTML={{ __html: page.customJs }} />
      )}
    </div>
  );
}
