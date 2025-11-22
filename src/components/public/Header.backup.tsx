'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, User, Search, Menu, Heart, X, ChevronDown } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { openCart } from '@/lib/redux/features/cartSlice';
import { Button } from '@/components/ui/button';
import { CartDrawer } from '@/components/public/CartDrawer';
import { useWishlist } from '@/hooks/useWishlist';
import { useSettings } from '@/contexts/SettingsContext';
import { LanguageSwitcher } from '@/components/public/LanguageSwitcher';
import { useState } from 'react';
import Image from 'next/image';

export function Header() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const { items: wishlistItems } = useWishlist();
  const { settings } = useSettings();

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistItemCount = wishlistItems.length;

  const storeName = settings.general_store_name || 'YourStore';
  const logo = settings.appearance_logo_url;

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            {logo ? (
              <Image
                src={logo}
                alt={storeName}
                width={200}
                height={60}
                className="h-10 lg:h-12 w-auto object-contain"
              />
            ) : (
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all">
                {storeName}
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/shop"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
            >
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/shop?featured=true"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
            >
              Featured
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/categories"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
            >
              Categories
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Language Switcher */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* Account Dropdown - Desktop */}
            <div className="hidden md:block relative">
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {session.user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden lg:block">
                      {session.user.name?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {accountDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setAccountDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                        <div className="px-4 py-3 border-b bg-gray-50">
                          <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                        </div>
                        <div className="py-2">
                          <Link
                            href="/account"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setAccountDropdownOpen(false)}
                          >
                            <User className="w-4 h-4 mr-3 text-gray-400" />
                            My Account
                          </Link>
                          <Link
                            href="/account/orders"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setAccountDropdownOpen(false)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-3 text-gray-400" />
                            My Orders
                          </Link>
                          <Link
                            href="/wishlist"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setAccountDropdownOpen(false)}
                          >
                            <Heart className="w-4 h-4 mr-3 text-gray-400" />
                            My Wishlist
                          </Link>
                          {session.user.role === 'ADMIN' && (
                            <Link
                              href="/admin"
                              className="flex items-center px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors border-t"
                              onClick={() => setAccountDropdownOpen(false)}
                            >
                              Admin Panel
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
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden lg:inline">Sign In</span>
                  </Button>
                </Link>
              )}
            </div>

            {/* Wishlist - Desktop */}
            {session && (
              <Link
                href="/wishlist"
                className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors hidden md:flex"
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
              className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
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
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-1">
              <Link
                href="/shop"
                className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/shop?featured=true"
                className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Featured
              </Link>
              <Link
                href="/categories"
                className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>

              {session ? (
                <>
                  <div className="border-t my-2"></div>
                  <Link
                    href="/account"
                    className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link
                    href="/account/orders"
                    className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/wishlist"
                    className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>My Wishlist</span>
                    {wishlistItemCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-semibold">
                        {wishlistItemCount}
                      </span>
                    )}
                  </Link>
                  {session.user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t my-2"></div>
                  <Link
                    href="/auth/signin"
                    className="px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer />
    </header>
  );
}
