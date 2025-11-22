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
  productIds: string[]; // For quick lookup
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  productIds: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
      state.productIds = action.payload.map((item) => item.productId);
      state.isLoading = false;
    },
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      state.items.unshift(action.payload);
      if (!state.productIds.includes(action.payload.productId)) {
        state.productIds.push(action.payload.productId);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.productId !== productId);
      state.productIds = state.productIds.filter((id) => id !== productId);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearWishlist: (state) => {
      state.items = [];
      state.productIds = [];
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
