// Mock product data
export const mockProduct = {
  id: '1',
  name: 'Premium Coffee Beans',
  slug: 'premium-coffee-beans',
  price: '29.99',
  comparePrice: '39.99',
  stock: 50,
  featured: true,
  sku: 'COFFEE-001',
  description: 'Premium organic coffee beans from Ethiopia',
  images: [
    { id: 'img1', url: '/images/coffee1.jpg', alt: 'Coffee beans' },
    { id: 'img2', url: '/images/coffee2.jpg', alt: 'Coffee beans close-up' },
  ],
  category: {
    id: 'cat1',
    name: 'Coffee Beans',
    slug: 'coffee-beans',
  },
  variantOptions: [],
  variants: [],
};

export const mockProductWithVariants = {
  ...mockProduct,
  id: '2',
  name: 'Coffee Beans - Multiple Sizes',
  variantOptions: [
    {
      id: 'opt1',
      name: 'Size',
      position: 0,
      values: [
        { id: 'val1', value: '250g', position: 0 },
        { id: 'val2', value: '500g', position: 1 },
        { id: 'val3', value: '1kg', position: 2 },
      ],
    },
  ],
  variants: [
    {
      id: 'var1',
      sku: 'COFFEE-250G',
      price: '15.99',
      comparePrice: '19.99',
      stock: 20,
      image: null,
      optionValues: '["250g"]',
    },
    {
      id: 'var2',
      sku: 'COFFEE-500G',
      price: '29.99',
      comparePrice: '39.99',
      stock: 15,
      image: null,
      optionValues: '["500g"]',
    },
    {
      id: 'var3',
      sku: 'COFFEE-1KG',
      price: '55.99',
      comparePrice: '69.99',
      stock: 10,
      image: null,
      optionValues: '["1kg"]',
    },
  ],
};

export const mockProducts = [
  mockProduct,
  {
    ...mockProduct,
    id: '2',
    name: 'Espresso Blend',
    slug: 'espresso-blend',
    price: '24.99',
    comparePrice: null,
    featured: false,
  },
  {
    ...mockProduct,
    id: '3',
    name: 'Decaf Coffee',
    slug: 'decaf-coffee',
    price: '19.99',
    comparePrice: '24.99',
    stock: 0,
    featured: false,
  },
];

export const mockCategories = [
  { id: 'cat1', name: 'Coffee Beans', slug: 'coffee-beans' },
  { id: 'cat2', name: 'Coffee Machines', slug: 'machines' },
  { id: 'cat3', name: 'Spices', slug: 'spices' },
];

// Mock cart items
export const mockCartItem = {
  id: '1',
  productId: '1',
  name: 'Premium Coffee Beans',
  price: 29.99,
  quantity: 2,
  image: '/images/coffee1.jpg',
};

export const mockCartItems = [
  mockCartItem,
  {
    id: '2',
    productId: '2',
    name: 'Espresso Blend',
    price: 24.99,
    quantity: 1,
    image: '/images/espresso.jpg',
  },
];

// Mock reviews
export const mockReview = {
  id: 'rev1',
  rating: 5,
  title: 'Excellent coffee!',
  comment: 'Best coffee I have ever tasted. Highly recommend!',
  verified: true,
  createdAt: '2024-01-15T10:00:00Z',
  user: {
    name: 'John Doe',
    email: 'john@example.com',
  },
};

export const mockReviews = [
  mockReview,
  {
    id: 'rev2',
    rating: 4,
    title: 'Very good',
    comment: 'Great quality beans, fast delivery.',
    verified: true,
    createdAt: '2024-01-14T09:00:00Z',
    user: {
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
  },
  {
    id: 'rev3',
    rating: 5,
    title: null,
    comment: 'Love it!',
    verified: false,
    createdAt: '2024-01-13T08:00:00Z',
    user: {
      name: null,
      email: 'customer@example.com',
    },
  },
];

// Mock user session
export const mockSession = {
  user: {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'CUSTOMER',
    image: null,
  },
  expires: '2025-12-31',
};

export const mockAdminSession = {
  user: {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
    image: null,
  },
  expires: '2025-12-31',
};

// Mock user account data
export const mockUserAccount = {
  name: 'Test User',
  email: 'test@example.com',
  role: 'CUSTOMER',
  createdAt: new Date('2024-01-01'),
  _count: {
    orders: 5,
  },
};

// Mock settings context
export const mockSettings = {
  general_store_name: 'Organicaf',
  general_store_tagline: 'Premium organic coffee',
  general_store_email: 'info@organicaf.com',
  general_store_phone: '+212 7 00 49 49 30',
  general_store_address: 'Fès, Morocco',
  appearance_logo_url: null,
  social_facebook_url: 'https://facebook.com/organicaf',
  social_twitter_url: 'https://twitter.com/organicaf',
  social_instagram_url: 'https://instagram.com/organicaf',
  social_linkedin_url: null,
  social_youtube_url: null,
};

// Mock wishlist items
export const mockWishlistItems = [
  {
    id: 'wish1',
    productId: '1',
    product: mockProduct,
    createdAt: new Date('2024-01-15'),
  },
];
