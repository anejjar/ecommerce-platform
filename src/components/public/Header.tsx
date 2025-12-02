'use client';

import { Link, usePathname } from '@/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, User, Search, Menu, Heart, X, ChevronDown } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { openCart } from '@/lib/redux/features/cartSlice';
import { Button } from '@/components/ui/button';
import { CartDrawer } from '@/components/public/CartDrawer';
import { useWishlist } from '@/hooks/useWishlist';
import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/hooks/useTheme';
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
  const { theme } = useTheme();
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistItemCount = wishlistItems.length;

  const storeName = settings.general_store_name || 'Store';
  const logo = settings.appearance_logo_url;

  // Handle scroll effect - subtle background change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
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

  // Get theme styles - use theme values or fallbacks
  const headerBg = scrolled 
    ? (theme?.components?.header?.backgroundColor ?? '#ffffff')
    : (theme?.components?.header?.backgroundColor ?? 'rgba(255, 255, 255, 0.95)');
  const headerText = theme?.components?.header?.textColor ?? '#111827';
  const headerHeight = theme?.components?.header?.height ?? '72px';
  const headerSticky = theme?.components?.header?.sticky ?? true;
  const headerShadow = theme?.components?.header?.shadow ?? true;
  const headerBorder = theme?.components?.header?.borderBottom ?? true;
  const primaryColor = theme?.colors?.primary ?? '#111827';
  const borderColor = theme?.colors?.border ?? '#e5e7eb';

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300 backdrop-blur-md',
          headerSticky && 'sticky',
          scrolled && headerShadow ? 'shadow-sm' : 'shadow-none',
          headerBorder && scrolled ? 'border-b' : 'border-b border-transparent'
        )}
        style={{
          backgroundColor: headerBg,
          color: headerText,
          minHeight: headerHeight,
          borderColor: scrolled ? borderColor : 'transparent',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: theme?.layout?.containerMaxWidth || '1280px' }}>
          {/* Main Header */}
          <div className="flex items-center justify-between" style={{ minHeight: headerHeight }}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              {logo ? (
                <Image
                  src={logo}
                  alt={storeName}
                  width={140}
                  height={50}
                  className="h-8 lg:h-10 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
                  priority
                />
              ) : (
                <span className="text-xl lg:text-2xl font-medium tracking-tight" style={{ color: primaryColor }}>
                  {storeName}
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
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
                      'relative text-sm font-medium transition-colors duration-200',
                      active
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {item.label}
                    {active && (
                      <span 
                        className="absolute -bottom-1 left-0 right-0 h-px" 
                        style={{ backgroundColor: primaryColor }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="relative p-2 hover:opacity-70 transition-opacity duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={t('common.search')}
              >
                <Search className="w-5 h-5" style={{ color: headerText }} />
              </button>

              {/* Account */}
              <div className="hidden md:block relative" ref={accountDropdownRef}>
                {session ? (
                  <div className="relative">
                    <button
                      onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                      className={cn(
                        'relative flex items-center gap-2 p-1.5 hover:opacity-70 transition-opacity duration-200',
                        accountDropdownOpen && 'opacity-70'
                      )}
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform duration-200',
                          accountDropdownOpen && 'rotate-180'
                        )}
                        style={{ color: headerText }}
                      />
                    </button>

                    {accountDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-sm font-medium text-foreground truncate">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {session.user.email}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/account"
                            className="flex items-center px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                            onClick={() => setAccountDropdownOpen(false)}
                          >
                            <User className="w-4 h-4 mr-3 text-muted-foreground" />
                            {t('header.myAccount')}
                          </Link>
                          <Link
                            href="/account/orders"
                            className="flex items-center px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                            onClick={() => setAccountDropdownOpen(false)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-3 text-muted-foreground" />
                            {t('header.myOrders')}
                          </Link>
                          <Link
                            href="/wishlist"
                            className="flex items-center justify-between px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                            onClick={() => setAccountDropdownOpen(false)}
                          >
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 mr-3 text-muted-foreground" />
                              {t('account.myWishlist')}
                            </div>
                            {wishlistItemCount > 0 && (
                              <span className="text-xs bg-destructive text-destructive-foreground rounded-full px-2 py-0.5 font-medium">
                                {wishlistItemCount}
                              </span>
                            )}
                          </Link>
                          {session.user.role === 'ADMIN' && (
                            <div className="border-t border-border my-1">
                              <Link
                                href="/admin"
                                className="flex items-center px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                                onClick={() => setAccountDropdownOpen(false)}
                              >
                                <span className="w-4 h-4 mr-3 flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                                </span>
                                {t('header.adminPanel')}
                              </Link>
                            </div>
                          )}
                        </div>
                        <div className="border-t border-border">
                          <button
                            onClick={() => {
                              signOut();
                              setAccountDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors font-medium"
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
                      className="gap-2"
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
                className="relative p-2 hover:opacity-70 transition-opacity duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5" style={{ color: headerText }} />
                {cartItemCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 hover:opacity-70 transition-opacity duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" style={{ color: headerText }} />
                ) : (
                  <Menu className="w-6 h-6" style={{ color: headerText }} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-80 sm:w-96 p-0 flex flex-col">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              {logo ? (
                <Image
                  src={logo}
                  alt={storeName}
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <span className="text-lg font-medium tracking-tight">{storeName}</span>
              )}
            </div>
          </div>

          {/* Mobile Menu Content */}
          <nav className="flex-1 overflow-y-auto py-6">
            <div className="flex flex-col space-y-1 px-4">
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
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'px-4 py-3 rounded-lg font-medium transition-colors duration-200 min-h-[44px] flex items-center',
                      active
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {session ? (
                <>
                  <div className="border-t border-border my-4" />
                  <div className="px-4 py-3 bg-muted/50 rounded-lg mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-white"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'px-4 py-3 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center',
                      isActive('/account')
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <User className="w-5 h-5 mr-3" />
                    {t('header.myAccount')}
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors duration-200 min-h-[44px] flex items-center"
                  >
                    <ShoppingCart className="w-5 h-5 mr-3" />
                    {t('header.myOrders')}
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors duration-200 min-h-[44px] flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 mr-3" />
                      <span>{t('account.myWishlist')}</span>
                    </div>
                    {wishlistItemCount > 0 && (
                      <span className="text-xs bg-destructive text-destructive-foreground rounded-full px-2 py-1 font-medium">
                        {wishlistItemCount}
                      </span>
                    )}
                  </Link>
                  {session.user.role === 'ADMIN' && (
                    <>
                      <div className="border-t border-border my-2" />
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 font-medium text-foreground hover:bg-muted rounded-lg transition-colors duration-200 min-h-[44px] flex items-center"
                      >
                        <span className="w-5 h-5 mr-3 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                        </span>
                        {t('header.adminPanel')}
                      </Link>
                    </>
                  )}
                  <div className="border-t border-border my-2" />
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-destructive hover:bg-muted rounded-lg transition-colors duration-200 text-left font-medium min-h-[44px] flex items-center"
                  >
                    {t('header.signOut')}
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-border my-4" />
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 font-medium text-foreground hover:bg-muted rounded-lg transition-colors duration-200 min-h-[44px] flex items-center"
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

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-8 md:pt-16 lg:pt-20 px-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery('');
            }}
          />
          <div className="relative w-full max-w-3xl bg-card border border-border rounded-lg shadow-lg animate-in slide-in-from-top-4 duration-300 max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-4 md:p-6 flex-shrink-0 border-b border-border">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 bg-muted rounded-lg">
                  <Search className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
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
                  className="p-2 hover:bg-muted rounded-lg transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
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
