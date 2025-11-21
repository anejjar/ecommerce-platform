import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    comparePrice: string | null;
    stock: number;
    images: Array<{
      id: string;
      url: string;
      alt: string | null;
    }>;
    category: {
      id: string;
      name: string;
      slug: string;
    } | null;
  };
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  productIds: Set<string>; // For quick lookup
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  productIds: new Set(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
      state.productIds = new Set(action.payload.map((item) => item.productId));
      state.isLoading = false;
    },
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      state.items.unshift(action.payload);
      state.productIds.add(action.payload.productId);
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.productId !== productId);
      state.productIds.delete(productId);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearWishlist: (state) => {
      state.items = [];
      state.productIds = new Set();
      state.isLoading = false;
    },
  },
});

export const {
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  setLoading,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
