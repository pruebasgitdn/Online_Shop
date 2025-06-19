import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, CartItemV002 } from "../../../type";
import { fetchCartItems } from "../thunks/cartThunks";

interface Props {
  cart: CartItem[];
  totalPrice: number;
  loading: boolean;
  error: string | [];
}

const initialState: Props = {
  cart: [],
  totalPrice: 0,
  loading: false,
  error: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      //si existe
      const existingCartProduct = state.cart.find(
        (item) => item.product_id == action.payload.product_id
      );

      if (existingCartProduct) {
        existingCartProduct.quantity += action.payload.quantity;
      } else {
        state.cart.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cart = state.cart.filter(
        (item) => item.product_id !== action.payload
      );
    },
    clearCart: (state) => {
      state.cart = [];
      state.totalPrice = 0;
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ product_id: number; quantity: number }>
    ) => {
      //Encontrar el imem
      const item = state.cart.find(
        (item) => item.product_id == action.payload.product_id
      );

      //Si lo encuentra actualiza
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    setTotalPrice: (state) => {
      state.totalPrice = state.cart.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      );
    },
    updateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.cart = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al obtener la vuelta";
      })
      .addCase(fetchCartItems.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
  setTotalPrice,
  updateCart,
} = cartSlice.actions;

export default cartSlice.reducer;
