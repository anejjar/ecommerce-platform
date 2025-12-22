import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { CartContent } from '@/components/public/CartContent';
import { PageOverrideRenderer } from '@/components/public/PageOverrideRenderer';
import { getPageOverride } from '@/lib/page-overrides';

import { getTranslations } from 'next-intl/server';

// Force dynamic rendering for user-specific cart data
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const t = await getTranslations('metadata.cart');

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function CartPage() {
  // Check for page override
  const overridePage = await getPageOverride('CART');
  if (overridePage) {
    return <PageOverrideRenderer page={overridePage} />;
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50">
        <CartContent />
      </main>
      <Footer />
    </div>
  );
}
