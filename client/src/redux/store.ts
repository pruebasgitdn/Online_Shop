// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slices/userSlice.ts";
import { productSlice } from "./slices/productSlice.ts";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import { combineReducers } from "redux";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { cartSlice } from "./slices/cartSlice.ts";
import { FavoSlice } from "./slices/favoriteSlice.ts";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "product", "cart", "favorites"],
};

const rootReducer = combineReducers({
  user: userSlice.reducer,
  product: productSlice.reducer,
  cart: cartSlice.reducer,
  favorites: FavoSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
