'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { openCart } from '@/lib/redux/features/cartSlice';
import { Button } from '@/components/ui/button';
import { CartDrawer } from '@/components/public/CartDrawer';
import { useState } from 'react';

export function Header() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            YourStore
          </Link>

          {/* Search bar - desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            {/* Account */}
            <div className="hidden md:block">
              {session ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 hover:text-blue-600">
                    <User className="w-5 h-5" />
                    <span className="text-sm">{session.user.name || 'Account'}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      href="/account"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      My Orders
                    </Link>
                    {session.user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 hover:bg-gray-100 border-t"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 border-t text-red-600"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    <User className="w-5 h-5 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative hover:text-blue-600">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation - desktop */}
        <nav className="hidden md:flex items-center gap-6 pb-4 border-t pt-4">
          <Link href="/shop" className="hover:text-blue-600 font-medium">
            All Products
          </Link>
          <Link href="/shop?featured=true" className="hover:text-blue-600">
            Featured
          </Link>
          <Link href="/categories" className="hover:text-blue-600">
            Categories
          </Link>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t mt-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <nav className="flex flex-col gap-3">
              <Link href="/shop" className="hover:text-blue-600 font-medium py-2">
                All Products
              </Link>
              <Link href="/shop?featured=true" className="hover:text-blue-600 py-2">
                Featured
              </Link>
              <Link href="/categories" className="hover:text-blue-600 py-2">
                Categories
              </Link>
              {session ? (
                <>
                  <Link href="/account" className="hover:text-blue-600 py-2 border-t">
                    My Account
                  </Link>
                  <Link href="/account/orders" className="hover:text-blue-600 py-2">
                    My Orders
                  </Link>
                  {session.user.role === 'ADMIN' && (
                    <Link href="/admin" className="hover:text-blue-600 py-2">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="text-left hover:text-blue-600 py-2 text-red-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth/signin" className="hover:text-blue-600 py-2 border-t">
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
