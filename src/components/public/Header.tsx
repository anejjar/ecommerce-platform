'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, User, Search, Menu, Heart, X, ChevronDown, Coffee } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { openCart } from '@/lib/redux/features/cartSlice';
import { Button } from '@/components/ui/button';
import { CartDrawer } from '@/components/public/CartDrawer';
import { useWishlist } from '@/hooks/useWishlist';
import { useSettings } from '@/contexts/SettingsContext';
import { LanguageSwitcher } from '@/components/public/LanguageSwitcher';
import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export function Header() {
  const t = useTranslations();
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const { items: wishlistItems } = useWishlist();
  const { settings } = useSettings();

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistItemCount = wishlistItems.length;

  const storeName = settings.general_store_name || 'Organicaf';
  const logo = settings.appearance_logo_url;

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Main Header */}
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              {logo ? (
                <Image
                  src={logo}
                  alt={storeName}
                  width={140}
                  height={50}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Coffee className="w-8 h-8 text-amber-800 group-hover:text-amber-900 transition-colors" />
                  <div className="text-2xl font-bold text-amber-900 tracking-tight">
                    {storeName}
                  </div>
                </div>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-amber-800 font-medium transition-colors"
              >
                {t('header.home')}
              </Link>
              <Link
                href="/shop"
                className="text-gray-700 hover:text-amber-800 font-medium transition-colors"
              >
                {t('header.shop')}
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-amber-800 font-medium transition-colors"
              >
                {t('header.about')}
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-amber-800 font-medium transition-colors"
              >
                {t('header.contact')}
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 hover:bg-amber-50 rounded-lg transition-colors"
                aria-label={t('common.search')}
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>

              {/* Language Switcher */}
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>

              {/* Account */}
              <div className="hidden md:block relative">
                {session ? (
                  <div className="relative">
                    <button
                      onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                      className="flex items-center gap-2 p-2 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </button>

                    {accountDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setAccountDropdownOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                          <div className="px-4 py-3 border-b bg-amber-50">
                            <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                          </div>
                          <div className="py-2">
                            <Link
                              href="/account"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                              onClick={() => setAccountDropdownOpen(false)}
                            >
                              <User className="w-4 h-4 mr-3 text-amber-700" />
                              {t('header.myAccount')}
                            </Link>
                            <Link
                              href="/account/orders"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                              onClick={() => setAccountDropdownOpen(false)}
                            >
                              <ShoppingCart className="w-4 h-4 mr-3 text-amber-700" />
                              {t('header.myOrders')}
                            </Link>
                            <Link
                              href="/wishlist"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                              onClick={() => setAccountDropdownOpen(false)}
                            >
                              <Heart className="w-4 h-4 mr-3 text-amber-700" />
                              {t('account.myWishlist')}
                            </Link>
                            {session.user.role === 'ADMIN' && (
                              <Link
                                href="/admin"
                                className="flex items-center px-4 py-2.5 text-sm text-amber-700 font-medium hover:bg-amber-50 transition-colors border-t"
                                onClick={() => setAccountDropdownOpen(false)}
                              >
                                {t('header.adminPanel')}
                              </Link>
                            )}
                          </div>
                          <div className="border-t">
                            <button
                              onClick={() => {
                                signOut();
                                setAccountDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              {t('header.signOut')}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <Link href="/auth/signin">
                    <Button variant="ghost" size="sm" className="gap-2 hover:bg-amber-50 hover:text-amber-900">
                      <User className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>

              {/* Wishlist */}
              {session && (
                <Link
                  href="/wishlist"
                  className="relative p-2.5 hover:bg-amber-50 rounded-lg transition-colors hidden md:flex"
                >
                  <Heart className="w-5 h-5 text-gray-700" />
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                      {wishlistItemCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => dispatch(openCart())}
                className="relative p-2.5 hover:bg-amber-50 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 hover:bg-amber-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t py-4 animate-in slide-in-from-top duration-200">
              <nav className="flex flex-col space-y-1">
                <Link
                  href="/"
                  className="px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-900 rounded-lg font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.home')}
                </Link>
                <Link
                  href="/shop"
                  className="px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-900 rounded-lg font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.shop')}
                </Link>
                <Link
                  href="/about"
                  className="px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-900 rounded-lg font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.about')}
                </Link>
                <Link
                  href="/contact"
                  className="px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-900 rounded-lg font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.contact')}
                </Link>

                {session ? (
                  <>
                    <div className="border-t my-2"></div>
                    <Link
                      href="/account"
                      className="px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-900 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('header.myAccount')}
                    </Link>
                    <Link
                      href="/account/orders"
                      className="px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-900 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('header.myOrders')}
                    </Link>
                    <Link
                      href="/wishlist"
                      className="px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-900 rounded-lg transition-colors flex items-center justify-between"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{t('account.myWishlist')}</span>
                      {wishlistItemCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-semibold">
                          {wishlistItemCount}
                        </span>
                      )}
                    </Link>
                    {session.user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="px-4 py-3 text-amber-700 font-medium hover:bg-amber-50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('header.adminPanel')}
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left font-medium"
                    >
                      {t('header.signOut')}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t my-2"></div>
                    <Link
                      href="/auth/signin"
                      className="px-4 py-3 text-amber-700 font-medium hover:bg-amber-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('header.signIn')}
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="absolute inset-0"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-in slide-in-from-top duration-300">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Search className="w-6 h-6 text-amber-800" />
                <input
                  type="text"
                  placeholder={t('header.searchPlaceholder')}
                  className="flex-1 text-lg outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-3">{t('header.popularSuggestions')}</p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/shop?category=coffee-beans"
                    className="px-4 py-2 bg-amber-50 text-amber-900 rounded-full text-sm hover:bg-amber-100 transition-colors"
                    onClick={() => setSearchOpen(false)}
                  >
                    ☕ {t('home.categories.beans.name')}
                  </Link>
                  <Link
                    href="/shop?category=machines"
                    className="px-4 py-2 bg-amber-50 text-amber-900 rounded-full text-sm hover:bg-amber-100 transition-colors"
                    onClick={() => setSearchOpen(false)}
                  >
                    🔧 {t('home.categories.machines.name')}
                  </Link>
                  <Link
                    href="/shop?category=spices"
                    className="px-4 py-2 bg-amber-50 text-amber-900 rounded-full text-sm hover:bg-amber-100 transition-colors"
                    onClick={() => setSearchOpen(false)}
                  >
                    🌶️ {t('home.categories.spices.name')}
                  </Link>
                  <Link
                    href="/shop?featured=true"
                    className="px-4 py-2 bg-amber-50 text-amber-900 rounded-full text-sm hover:bg-amber-100 transition-colors"
                    onClick={() => setSearchOpen(false)}
                  >
                    ⭐ {t('product.featured')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
