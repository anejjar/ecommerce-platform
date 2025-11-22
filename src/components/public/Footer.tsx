'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Linkedin, Youtube, MapPin, Phone, Coffee } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations();
  const { settings } = useSettings();

  const storeName = settings.general_store_name || 'Organicaf';
  const storeTagline = settings.general_store_tagline || 'Torréfaction artisanale de café organique depuis 1996';
  const storeEmail = settings.general_store_email;
  const storePhone = settings.general_store_phone || '+212 7 00 49 49 30';
  const storeAddress = settings.general_store_address || 'Fès, Maroc';

  const socialLinks = [
    { url: settings.social_facebook_url, icon: Facebook, label: 'Facebook' },
    { url: settings.social_twitter_url, icon: Twitter, label: 'Twitter' },
    { url: settings.social_instagram_url, icon: Instagram, label: 'Instagram' },
    { url: settings.social_linkedin_url, icon: Linkedin, label: 'LinkedIn' },
    { url: settings.social_youtube_url, icon: Youtube, label: 'YouTube' },
  ].filter(link => link.url);

  return (
    <footer className="bg-gradient-to-br from-amber-950 via-amber-900 to-amber-950 text-amber-100 mt-auto">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="w-8 h-8 text-amber-400" />
              <h3 className="text-white text-2xl font-bold">{storeName}</h3>
            </div>
            <p className="text-sm text-amber-200 mb-6">
              {storeTagline}
            </p>

            {/* Contact Information */}
            <div className="space-y-3">
              {storeEmail && (
                <a
                  href={`mailto:${storeEmail}`}
                  className="flex items-center gap-2 text-sm hover:text-amber-300 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {storeEmail}
                </a>
              )}
              {storePhone && (
                <a
                  href={`tel:${storePhone}`}
                  className="flex items-center gap-2 text-sm hover:text-amber-300 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {storePhone}
                </a>
              )}
              {storeAddress && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{storeAddress}</span>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-6">
                {socialLinks.map(({ url, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-amber-800/50 rounded-full hover:bg-amber-700 hover:text-white transition-all"
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">{t('footer.products')}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/shop?category=coffee-beans" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <span>☕</span> {t('home.categories.beans.name')}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=machines" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <span>🔧</span> {t('home.categories.machines.name')}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=spices" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <span>🌶️</span> {t('home.categories.spices.name')}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=pack-degustation" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <span>🎁</span> {t('home.categories.packs.name')}
                </Link>
              </li>
              <li>
                <Link href="/shop?featured=true" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <span>⭐</span> {t('product.featured')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">{t('footer.customerService')}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-amber-300 transition-colors">
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-300 transition-colors">
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-amber-300 transition-colors">
                  {t('footer.shippingInfo')}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-amber-300 transition-colors">
                  {t('footer.returns')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-amber-300 transition-colors">
                  {t('footer.faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">{t('footer.account')}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/account" className="hover:text-amber-300 transition-colors">
                  {t('header.myAccount')}
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-amber-300 transition-colors">
                  {t('header.myOrders')}
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-amber-300 transition-colors">
                  {t('account.myWishlist')}
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-amber-300 transition-colors">
                  {t('header.cart')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-amber-800/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-amber-200">
            {t('footer.copyright', { year: new Date().getFullYear(), storeName })}
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="hover:text-amber-300 transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href="/terms" className="hover:text-amber-300 transition-colors">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
