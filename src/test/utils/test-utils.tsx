import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import cartReducer from '@/lib/redux/features/cartSlice';
import wishlistReducer from '@/lib/redux/features/wishlistSlice';

// Mock translations
const messages = {
  product: {
    addedToCart: 'Added to cart',
    featured: 'Featured',
    outOfStock: 'Out of Stock',
    addToCart: 'Add to Cart',
    home: 'Home',
    shop: 'Shop',
    description: 'Description',
    sku: 'SKU',
    quantity: 'Quantity',
    total: 'Total',
    buyNow: 'Buy Now',
    off: 'OFF',
    save: 'Save',
    inStock: 'In Stock',
    available: 'available',
    selectOptions: 'Please select all options',
    freeShipping: 'Free shipping over $50',
    moneyBack: '30-day money back guarantee',
    secureCheckout: 'Secure checkout',
    relatedProducts: 'Related Products',
  },
  cart: {
    title: 'Shopping Cart',
    emptyCart: 'Your cart is empty',
    addProducts: 'Start adding some products!',
    continueShopping: 'Continue Shopping',
    each: 'each',
    remove: 'Remove',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    tax: 'Tax',
    shipping: 'Shipping',
    free: 'FREE',
    total: 'Total',
    proceedToCheckout: 'Proceed to Checkout',
    itemRemoved: 'Item removed from cart',
    item: 'item',
    items: 'items',
    checkout: 'Checkout',
    viewCart: 'View Cart',
    shippingTaxesCalculated: 'Shipping and taxes calculated at checkout',
    freeReturns: 'Free returns within 30 days',
    shippingTime: '2-5 business days delivery',
    freeShippingProgress: 'Add ${amount} more for free shipping',
    trustBadges: {
      secureCheckout: 'Secure checkout',
    },
  },
  common: {
    loading: 'Loading...',
    search: 'Search',
    error: 'An error occurred',
    note: 'Note:',
    optional: 'Optional',
    submitting: 'Submitting...',
    cancel: 'Cancel',
    save: 'Save',
  },
  header: {
    home: 'Home',
    shop: 'Shop',
    about: 'About',
    contact: 'Contact',
    myAccount: 'My Account',
    myOrders: 'My Orders',
    adminPanel: 'Admin Panel',
    signOut: 'Sign Out',
    signIn: 'Sign In',
    cart: {
      title: 'Cart',
    },
    searchPlaceholder: 'Search products...',
    popularSuggestions: 'Popular suggestions',
  },
  wishlist: {
    signInRequired: 'Please sign in to add items to your wishlist',
    removed: 'Removed from wishlist',
    removeFailed: 'Failed to remove from wishlist',
    added: 'Added to wishlist',
    addFailed: 'Failed to add to wishlist',
    addToWishlist: 'Add to wishlist',
    removeFromWishlist: 'Remove from wishlist',
    saved: 'Saved',
    save: 'Save',
  },
  newsletter: {
    enterEmail: 'Please enter your email',
    success: 'Successfully subscribed!',
    error: 'Subscription failed',
    genericError: 'An error occurred',
    thankYou: 'Thank you for subscribing!',
    name: 'Name',
    namePlaceholder: 'Your name',
    email: 'Email',
    emailPlaceholder: 'your@email.com',
    subscribe: 'Subscribe',
    subscribing: 'Subscribing...',
    disclaimer: 'We respect your privacy. Unsubscribe at any time.',
  },
  reviews: {
    title: 'Customer Reviews',
    basedOn: 'Based on',
    reviewCountPlural: 'reviews',
    reviewCountSingular: 'review',
    star: 'star',
    writeReview: 'Write a Review',
    signInToReview: 'Sign in to write a review',
    rating: 'Rating',
    stars: 'stars',
    excellent: 'Excellent',
    good: 'Good',
    average: 'Average',
    poor: 'Poor',
    terrible: 'Terrible',
    reviewTitle: 'Review Title',
    titlePlaceholder: 'Summarize your experience',
    review: 'Review',
    commentPlaceholder: 'Share your thoughts...',
    submitReview: 'Submit Review',
    submitSuccess: 'Review submitted successfully!',
    submitError: 'Failed to submit review',
    noReviews: 'No reviews yet. Be the first to review!',
    verifiedPurchase: 'Verified Purchase',
    by: 'by',
  },
  shop: {
    title: 'Shop',
    searchPlaceholder: 'Search products...',
    sort: {
      newest: 'Newest',
      priceLowHigh: 'Price: Low to High',
      priceHighLow: 'Price: High to Low',
      nameAZ: 'Name: A-Z',
    },
    filters: 'Filters',
    activeFilters: 'Active filters:',
    filterSearch: 'Search:',
    filterCategory: 'Category:',
    filterFeatured: 'Featured Only',
    clearAll: 'Clear all',
    categories: 'Categories',
    allCategories: 'All Categories',
    noProducts: 'No products found',
    noProductsDesc: 'Try adjusting your filters',
    clearFilters: 'Clear Filters',
  },
  account: {
    dashboard: 'Account Dashboard',
    memberSince: 'Member since',
    totalOrders: 'Total Orders',
    accountStatus: 'Account Status',
    active: 'Active',
    accountType: 'Account Type',
    quickActions: 'Quick Actions',
    orderHistory: 'Order History',
    viewOrderHistoryDesc: 'View your past orders',
    browseCatalogDesc: 'Browse our product catalog',
    myWishlist: 'My Wishlist',
  },
  checkout: {
    contactInfo: 'Contact Information',
    email: 'Email',
    password: 'Password',
    createAccount: 'Create an account',
    shippingAddress: 'Shipping Address',
    firstName: 'First Name',
    lastName: 'Last Name',
    address: 'Address',
    city: 'City',
    state: 'State',
    phone: 'Phone',
    placeOrder: 'Place Order',
    placingOrder: 'Placing Order...',
    discountCode: 'Discount Code',
    enterCode: 'Enter code',
    apply: 'Apply',
    discount: 'Discount',
    discountApplied: 'Discount applied',
    discountAppliedLabel: 'Discount:',
    invalidDiscount: 'Invalid discount code',
    failedToApplyDiscount: 'Failed to apply discount',
    enterEmail: 'Please enter your email',
    passwordLength: 'Password must be at least 6 characters',
    orderSuccess: 'Order placed successfully!',
    orderFailed: 'Failed to place order',
    qty: 'Qty:',
    agreeToTerms: 'By placing your order you agree to our terms and conditions',
    paymentNote: 'This is a demo. No actual payment will be processed.',
  },
  auth: {
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign In',
  },
  footer: {
    products: 'Products',
    customerService: 'Customer Service',
    account: 'Account',
    about: 'About Us',
    contactUs: 'Contact Us',
    shippingInfo: 'Shipping Info',
    returns: 'Returns',
    faq: 'FAQ',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    copyright: '© {year} {storeName}. All rights reserved.',
  },
  home: {
    categories: {
      beans: { name: 'Coffee Beans' },
      machines: { name: 'Coffee Machines' },
      spices: { name: 'Spices' },
      packs: { name: 'Gift Packs' },
    },
  },
  success: {
    addedToCart: 'Added to cart successfully!',
  },
  errors: {
    somethingWentWrong: 'Something went wrong',
  },
};

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  store?: any;
  session?: any;
  locale?: string;
}

export function createMockStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      cart: cartReducer,
      wishlist: wishlistReducer,
    },
    preloadedState,
  });
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = createMockStore(preloadedState),
    session = null,
    locale = 'en',
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider session={session}>
        <Provider store={store}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Provider>
      </SessionProvider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Mock next/navigation
export const mockPush = vi.fn();
export const mockRouter = {
  push: mockPush,
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
};

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
export { renderWithProviders as render };
