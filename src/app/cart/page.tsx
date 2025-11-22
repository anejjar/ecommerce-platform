import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { CartContent } from '@/components/public/CartContent';

import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('metadata.cart');

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function CartPage() {
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
