import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { CheckoutContent } from '@/components/public/CheckoutContent';

import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('metadata.checkout');

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function CheckoutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50">
        <CheckoutContent />
      </main>
      <Footer />
    </div>
  );
}
