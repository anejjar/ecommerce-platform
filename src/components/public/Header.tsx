'use client';

import { Link, usePathname } from '@/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, User, Search, Menu, Heart, X, ChevronDown, Coffee } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { openCart } from '@/lib/redux/features/cartSlice';
import { Button } from '@/components/ui/button';
import { CartDrawer } from '@/components/public/CartDrawer';
import { useWishlist } from '@/hooks/useWishlist';
import { useSettings } from '@/contexts/SettingsContext';
import { SearchAutocomplete } from '@/components/public/SearchAutocomplete';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export function Header() {
  const t = useTranslations();
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items: wishlistItems } = useWishlist();
  const { settings } = useSettings();
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistItemCount = wishlistItems.length;

  const storeName = settings.general_store_name || 'Organicaf';
  const logo = settings.appearance_logo_url;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close account dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
    };
    if (accountDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [accountDropdownOpen]);

  // Check if a path is active
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname === '';
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={cn(
          'bg-white sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'shadow-md border-b border-amber-100/50'
            : 'shadow-sm border-b border-transparent'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Header */}
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              {logo ? (
                <Image
                  src={logo}
                  alt={storeName}
                  width={140}
                  height={50}
                  className="h-8 lg:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <Coffee className="w-7 h-7 lg:w-8 lg:h-8 text-amber-700 group-hover:text-amber-800 transition-all duration-300 group-hover:rotate-12" />
                    <div className="absolute inset-0 bg-amber-200/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-800 to-amber-900 bg-clip-text text-transparent tracking-tight group-hover:from-amber-900 group-hover:to-amber-950 transition-all duration-300">
                    {storeName}
                  </div>
                </div>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { href: '/', label: t('header.home') },
                { href: '/shop', label: t('header.shop') },
                { href: '/about', label: t('header.about') },
                { href: '/contact', label: t('header.contact') },
              ].map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg',
                      active
                        ? 'text-amber-900 bg-amber-50'
                        : 'text-gray-700 hover:text-amber-800 hover:bg-amber-50/50'
                    )}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1.5 lg:gap-2">
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="relative p-2.5 lg:p-3 hover:bg-amber-50 rounded-lg transition-all duration-200 group min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={t('common.search')}
              >
                <Search className="w-5 h-5 lg:w-5 text-gray-700 group-hover:text-amber-800 transition-colors" />
                <span className="absolute inset-0 bg-amber-200/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>

              {/* Account */}
              <div className="hidden md:block relative" ref={accountDropdownRef}>
                {session ? (
                  <div className="relative">
                    <button
                      onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                      className={cn(
                        'relative flex items-center gap-2 p-1.5 hover:bg-amber-50 rounded-lg transition-all duration-200 group',
                        accountDropdownOpen && 'bg-amber-50'
                      )}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm ring-2 ring-white group-hover:ring-amber-200 transition-all duration-200">
                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 text-gray-500 transition-transform duration-200',
                          accountDropdownOpen && 'rotate-180 text-amber-700'
                        )}
                      />
                    </button>

                    {accountDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white border border-amber-100 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3.5 border-b bg-gradient-to-r from-amber-50 to-amber-100/50">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-gray-600 truncate mt-0.5">
                            {session.user.email}
                          </p>
                        </div>
                        <div className="py-1.5">
                          <Link
                            href="/account"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 transition-colors group/item"
                            onClick={() => setAccountDropdownOpen(false)}
                          >
                            <User className="w-4 h-4 mr-3 text-amber-700 group-hover/item:scale-110 transition-transform" />
                            {t('header.myAccount')}
                          </Link>
                          <Link
                            href="/account/orders"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 transition-colors group/item"
                            onClick={() => setAccountDropdownOpen(false)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-3 text-amber-700 group-hover/item:scale-110 transition-transform" />
                            {t('header.myOrders')}
                          </Link>
                          <Link
                            href="/wishlist"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 transition-colors group/item"
                            onClick={() => setAccountDropdownOpen(false)}
                          >
                            <Heart className="w-4 h-4 mr-3 text-amber-700 group-hover/item:scale-110 transition-transform" />
                            {t('account.myWishlist')}
                            {wishlistItemCount > 0 && (
                              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold">
                                {wishlistItemCount}
                              </span>
                            )}
                          </Link>
                          {session.user.role === 'ADMIN' && (
                            <div className="border-t border-amber-100 my-1.5">
                              <Link
                                href="/admin"
                                className="flex items-center px-4 py-2.5 text-sm text-amber-700 font-medium hover:bg-amber-50 transition-colors group/item"
                                onClick={() => setAccountDropdownOpen(false)}
                              >
                                <span className="w-4 h-4 mr-3 flex items-center justify-center">
                                  <div className="w-2 h-2 bg-amber-600 rounded-full group-hover/item:scale-125 transition-transform" />
                                </span>
                                {t('header.adminPanel')}
                              </Link>
                            </div>
                          )}
                        </div>
                        <div className="border-t border-amber-100 bg-red-50/30">
                          <button
                            onClick={() => {
                              signOut();
                              setAccountDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                          >
                            {t('header.signOut')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/auth/signin">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 hover:bg-amber-50 hover:text-amber-900 transition-all duration-200"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden lg:inline">{t('header.signIn')}</span>
                    </Button>
                  </Link>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={() => dispatch(openCart())}
                className={cn(
                  'relative p-2.5 lg:p-3 hover:bg-amber-50 rounded-lg transition-all duration-200 group min-w-[44px] min-h-[44px] flex items-center justify-center',
                  cartItemCount > 0 && 'hover:scale-105'
                )}
              >
                <ShoppingCart className="w-5 h-5 lg:w-5 text-gray-700 group-hover:text-amber-800 transition-all duration-200 group-hover:scale-110" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-br from-amber-700 to-amber-900 text-white text-xs rounded-full w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center font-bold shadow-lg ring-2 ring-white animate-bounce">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2.5 hover:bg-amber-50 rounded-lg transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center group"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700 group-hover:rotate-90 transition-transform duration-200" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700 group-hover:scale-110 transition-transform duration-200" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent side="left" className="w-80 sm:w-96 p-0 flex flex-col">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-amber-50 to-amber-100/50">
                <div className="flex items-center gap-2.5">
                  {logo ? (
                    <Image
                      src={logo}
                      alt={storeName}
                      width={120}
                      height={40}
                      className="h-8 w-auto object-contain"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Coffee className="w-6 h-6 text-amber-800" />
                      <span className="text-lg font-bold text-amber-900">{storeName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Menu Content */}
              <nav className="flex-1 overflow-y-auto py-4">
                <div className="flex flex-col space-y-1 px-2">
                  {[
                    { href: '/', label: t('header.home'), icon: null },
                    { href: '/shop', label: t('header.shop'), icon: null },
                    { href: '/about', label: t('header.about'), icon: null },
                    { href: '/contact', label: t('header.contact'), icon: null },
                  ].map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'px-4 py-3.5 rounded-lg font-medium transition-all duration-200 min-h-[44px] flex items-center',
                          active
                            ? 'bg-amber-100 text-amber-900 font-semibold'
                            : 'text-gray-700 hover:bg-amber-50 hover:text-amber-900'
                        )}
                      >
                        {item.label}
                        {active && (
                          <span className="ml-auto w-2 h-2 bg-amber-600 rounded-full" />
                        )}
                      </Link>
                    );
                  })}

                  {session ? (
                    <>
                      <div className="border-t border-amber-100 my-3" />
                      <div className="px-4 py-3 bg-gradient-to-r from-amber-50/50 to-transparent rounded-lg mx-2 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center text-white text-base font-semibold shadow-md ring-2 ring-amber-200">
                            {session.user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {session.user.name}
                            </p>
                            <p className="text-xs text-gray-600 truncate mt-0.5">
                              {session.user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'px-4 py-3.5 rounded-lg transition-all duration-200 min-h-[44px] flex items-center',
                          isActive('/account')
                            ? 'bg-amber-100 text-amber-900 font-semibold'
                            : 'text-gray-700 hover:bg-amber-50 hover:text-amber-900'
                        )}
                      >
                        <User className="w-5 h-5 mr-3 text-amber-700" />
                        {t('header.myAccount')}
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3.5 text-gray-700 hover:bg-amber-50 hover:text-amber-900 rounded-lg transition-all duration-200 min-h-[44px] flex items-center"
                      >
                        <ShoppingCart className="w-5 h-5 mr-3 text-amber-700" />
                        {t('header.myOrders')}
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3.5 text-gray-700 hover:bg-amber-50 hover:text-amber-900 rounded-lg transition-all duration-200 min-h-[44px] flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Heart
                            className={cn(
                              'w-5 h-5 mr-3',
                              isActive('/wishlist') ? 'text-amber-800 fill-amber-200' : 'text-amber-700'
                            )}
                          />
                          <span>{t('account.myWishlist')}</span>
                        </div>
                        {wishlistItemCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-bold">
                            {wishlistItemCount}
                          </span>
                        )}
                      </Link>
                      {session.user.role === 'ADMIN' && (
                        <div className="border-t border-amber-100 my-2" />
                      )}
                      {session.user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-4 py-3.5 text-amber-700 font-semibold hover:bg-amber-50 rounded-lg transition-all duration-200 min-h-[44px] flex items-center"
                        >
                          <span className="w-5 h-5 mr-3 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 bg-amber-600 rounded-full" />
                          </span>
                          {t('header.adminPanel')}
                        </Link>
                      )}
                      <div className="border-t border-amber-100 my-2" />
                      <button
                        onClick={() => {
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                        className="px-4 py-3.5 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 text-left font-medium min-h-[44px] flex items-center"
                      >
                        {t('header.signOut')}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="border-t border-amber-100 my-3" />
                      <Link
                        href="/auth/signin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3.5 text-amber-700 font-semibold hover:bg-amber-50 rounded-lg transition-all duration-200 min-h-[44px] flex items-center"
                      >
                        <User className="w-5 h-5 mr-3" />
                        {t('header.signIn')}
                      </Link>
                    </>
                  )}

                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-8 md:pt-16 lg:pt-20 px-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery('');
            }}
          />
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl animate-in slide-in-from-top-4 duration-300 max-h-[85vh] overflow-hidden flex flex-col border border-amber-100">
            <div className="p-4 md:p-6 flex-shrink-0 bg-gradient-to-r from-amber-50/50 to-transparent border-b border-amber-100">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Search className="w-5 h-5 md:w-6 md:h-6 text-amber-800" />
                </div>
                <div className="flex-1">
                  <SearchAutocomplete
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSubmit={(value) => {
                      router.push(`/shop?search=${encodeURIComponent(value)}`);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    onClose={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    placeholder={t('header.searchPlaceholder')}
                  />
                </div>
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="p-2 hover:bg-amber-50 rounded-lg transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0 group"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700 group-hover:rotate-90 transition-all duration-200" />
                </button>
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
