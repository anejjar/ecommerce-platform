'use client';

import { Link } from '@/navigation';
import { Facebook, Twitter, Instagram, Mail, Linkedin, Youtube, MapPin, Phone } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/hooks/useTheme';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/public/LanguageSwitcher';

export function Footer() {
  const t = useTranslations();
  const { settings } = useSettings();
  const { theme } = useTheme();

  const storeName = settings.general_store_name || 'Store';
  const storeTagline = settings.general_store_tagline || '';
  const storeEmail = settings.general_store_email;
  const storePhone = settings.general_store_phone;
  const storeAddress = settings.general_store_address;

  // Get theme styles - use theme values or fallbacks
  const footerBg = theme?.components?.footer?.backgroundColor ?? '#ffffff';
  const footerText = theme?.components?.footer?.textColor ?? '#111827';
  const borderColor = theme?.colors?.border ?? '#e5e7eb';
  const primaryColor = theme?.colors?.primary ?? '#111827';

  const socialLinks = [
    { url: settings.social_facebook_url, icon: Facebook, label: 'Facebook' },
    { url: settings.social_twitter_url, icon: Twitter, label: 'Twitter' },
    { url: settings.social_instagram_url, icon: Instagram, label: 'Instagram' },
    { url: settings.social_linkedin_url, icon: Linkedin, label: 'LinkedIn' },
    { url: settings.social_youtube_url, icon: Youtube, label: 'YouTube' },
  ].filter(link => link.url);

  return (
    <footer
      className="mt-auto border-t"
      style={{
        backgroundColor: footerBg,
        color: footerText,
        borderColor: borderColor,
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20" style={{ maxWidth: theme?.layout?.containerMaxWidth || '1280px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* About */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-medium mb-4">{storeName}</h3>
            {storeTagline && (
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {storeTagline}
              </p>
            )}

            {/* Contact Information */}
            {(storeEmail || storePhone || storeAddress) && (
              <div className="space-y-3 mb-6">
                {storeEmail && (
                  <a
                    href={`mailto:${storeEmail}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {storeEmail}
                  </a>
                )}
                {storePhone && (
                  <a
                    href={`tel:${storePhone}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {storePhone}
                  </a>
                )}
                {storeAddress && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{storeAddress}</span>
                  </div>
                )}
              </div>
            )}

            {/* Social Media Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-2">
                {socialLinks.map(({ url, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-medium mb-4 uppercase tracking-wider">{t('footer.products')}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/shop?featured=true" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('product.featured')}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('header.shop')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-medium mb-4 uppercase tracking-wider">{t('footer.customerService')}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.shippingInfo')}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.returns')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-medium mb-4 uppercase tracking-wider">{t('footer.account')}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/account" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('header.myAccount')}
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('header.myOrders')}
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('account.myWishlist')}
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('header.cart.title')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: borderColor }}>
          <p className="text-sm text-muted-foreground">
            {t('footer.copyright', { year: new Date().getFullYear(), storeName })}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                {t('footer.terms')}
              </Link>
            </div>
            <LanguageSwitcher variant="inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
