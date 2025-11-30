import { Page } from '@prisma/client';
import { Header } from './Header';
import { Footer } from './Footer';
import { BlockRenderer } from '@/components/landing-page/BlockRenderer';

interface PageOverrideRendererProps {
  page: Page & {
    blocks?: any[];
  };
}

export function PageOverrideRenderer({ page }: PageOverrideRendererProps) {
  const useLayout = page.useStorefrontLayout ?? true;
  const hasBlocks = page.useBlockEditor && page.blocks && page.blocks.length > 0;
  const hasContent = page.content && page.content.trim().length > 0;

  const content = (
    <>
      {/* Custom CSS */}
      {page.customCss && (
        <style dangerouslySetInnerHTML={{ __html: page.customCss }} />
      )}

      {/* Render rich text content if present */}
      {hasContent && (
        <div className="prose prose-lg max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: page.content || '' }} />
        </div>
      )}

      {/* Render blocks if present */}
      {hasBlocks && (
        <div className="page-blocks">
          {page.blocks
            ?.filter((block: any) => block.isVisible !== false)
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
            .map((block: any) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
        </div>
      )}

      {/* Custom JS */}
      {page.customJs && (
        <script dangerouslySetInnerHTML={{ __html: page.customJs }} />
      )}
    </>
  );

  if (useLayout) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-12">
            {content}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {content}
      </div>
    </div>
  );
}

