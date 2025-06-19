import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserTypes } from "../../../type";
import {
  addToCartDB,
  deleteCartDB,
  deleteFavoriteDB,
  getUserById,
  getUserCartDB,
  getUserFavoritesDB,
  syncGuestCart,
  syncGuestFavorites,
  updateQuantityCartDB,
} from "../thunks/userThunks";

interface Props {
  user: UserTypes | null;
  token?: string | null;
  error?: string | null;
  loading?: boolean;
  isAuthenticated: boolean;
}

const initialState: Props = {
  user: null,
  token: null,
  error: null,
  loading: false,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action: PayloadAction<UserTypes>) => {
      state.user = {
        //COMPLETE PROFILE
        id: state.user?.id,
        firstName: action.payload.firstName || state.user?.firstName,
        lastName: action.payload.lastName || state.user?.lastName,
        email: action.payload.email || state.user?.email,
        phone: action.payload.phone || state.user?.phone,
        address: action.payload.address || state.user?.address,
      };
    },
    updateInfoUser: (state, action: PayloadAction<UserTypes>) => {
      //EDIT PROFILE
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserById.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getUserById.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(syncGuestFavorites.rejected, (state) => {
        state.loading = false;
      })
      .addCase(syncGuestFavorites.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getUserFavoritesDB.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getUserFavoritesDB.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteFavoriteDB.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteFavoriteDB.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(syncGuestCart.rejected, (state) => {
        state.loading = false;
      })
      .addCase(syncGuestCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addToCartDB.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addToCartDB.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getUserCartDB.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getUserCartDB.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateQuantityCartDB.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateQuantityCartDB.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteCartDB.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteCartDB.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const { setLogin, setLogout, updateUser, updateInfoUser } =
  userSlice.actions;

export default userSlice.reducer;
