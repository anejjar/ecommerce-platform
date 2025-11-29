import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PosCartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variantName?: string;
}

export type PosOrderType = 'DINE_IN' | 'TAKE_AWAY' | 'DELIVERY';

interface PosState {
  cart: PosCartItem[];
  orderType: PosOrderType;
  locationId: string | null;
  cashierId: string | null;
  activeSessionId: string | null;
  tableNumber: string | null;
  customerName: string | null;
}

const initialState: PosState = {
  cart: [],
  orderType: 'DINE_IN',
  locationId: null,
  cashierId: null,
  activeSessionId: null,
  tableNumber: null,
  customerName: null,
};

const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    addToPosCart: (state, action: PayloadAction<PosCartItem>) => {
      const existing = state.cart.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId
      );

      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.cart.push(action.payload);
      }
    },
    removeFromPosCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
    },
    updatePosCartQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.cart.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.cart = state.cart.filter((cartItem) => cartItem.id !== item.id);
        }
      }
    },
    clearPosCart: (state) => {
      state.cart = [];
    },
    setOrderType: (state, action: PayloadAction<PosOrderType>) => {
      state.orderType = action.payload;
    },
    setLocation: (state, action: PayloadAction<string | null>) => {
      state.locationId = action.payload;
    },
    setCashier: (state, action: PayloadAction<string | null>) => {
      state.cashierId = action.payload;
    },
    setActiveSession: (state, action: PayloadAction<string | null>) => {
      state.activeSessionId = action.payload;
    },
    setTableNumber: (state, action: PayloadAction<string | null>) => {
      state.tableNumber = action.payload;
    },
    setCustomerName: (state, action: PayloadAction<string | null>) => {
      state.customerName = action.payload;
    },
  },
});

export const {
  addToPosCart,
  removeFromPosCart,
  updatePosCartQuantity,
  clearPosCart,
  setOrderType,
  setLocation,
  setCashier,
  setActiveSession,
  setTableNumber,
  setCustomerName,
} = posSlice.actions;

export default posSlice.reducer;

