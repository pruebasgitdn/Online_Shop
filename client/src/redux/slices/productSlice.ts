import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductProps } from "../../../type";
import {
  fetchProducts,
  fetchProductById,
  fetchByCategorie,
} from "../thunks/productThunks";

interface Filters {
  category?: string | null;
  brand?: string | null;
  search?: string;
}

interface Props {
  selectedProduct?: ProductProps[] | [];
  allProducts?: ProductProps[] | [];
  error?: string | null;
  loading?: boolean | null;
  filters: Filters;
}

const initialState: Props = {
  selectedProduct: [],
  allProducts: [],
  loading: false,
  error: null,
  filters: {
    category: null,
    brand: null,
    search: "",
  },
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Filters>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.filters.category = action.payload;
    },
    setBrand: (state, action: PayloadAction<string | null>) => {
      state.filters.brand = action.payload;
    },
    setProducts: (state, action: PayloadAction<ProductProps[]>) => {
      state.allProducts = action.payload;
      state.loading = false;
      state.error = null;
    },
    setProduct: (state, action: PayloadAction<ProductProps[]>) => {
      state.selectedProduct = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const data = action.payload;
        state.allProducts = data;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al obtener la vuelta";
      })

      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })

      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al cargar el producto";
      })
      .addCase(fetchByCategorie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchByCategorie.fulfilled, (state, action) => {
        state.loading = false;
        state.allProducts = action.payload;
      })
      .addCase(fetchByCategorie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al cargar el producto";
      });
  },
});

export const { setFilters } = productSlice.actions;

export default productSlice.reducer;
