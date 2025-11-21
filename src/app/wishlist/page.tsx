import { Metadata } from 'next';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { WishlistContent } from '@/components/public/WishlistContent';

export const metadata: Metadata = {
  title: 'My Wishlist - E-Commerce Platform',
  description: 'View and manage your saved products',
};

export default function WishlistPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50">
        <WishlistContent />
      </main>
      <Footer />
    </div>
  );
}
