import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Favorite } from "../../../type";

interface Props {
  favorites: Favorite[];
  loading: boolean;
  error: string | [];
}

const initialState: Props = {
  favorites: [],
  loading: false,
  error: [],
};

export const FavoSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavo: (state, action: PayloadAction<Favorite>) => {
      //si existe
      const existingCartProduct = state.favorites.find(
        (item) => item.product_id == action.payload.product_id
      );

      if (existingCartProduct) {
        return;
      } else {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavo: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(
        (item) => item.product_id !== action.payload
      );
    },
    clearFavo: (state) => {
      state.favorites = [];
    },
    updateFavo: (state, action: PayloadAction<Favorite[]>) => {
      state.favorites = action.payload;
    },
  },
});

export const { addToFavo, removeFromFavo, clearFavo, updateFavo } =
  FavoSlice.actions;

export default FavoSlice.reducer;
