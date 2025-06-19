import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProductProps } from "../../../type";
import { getData } from "../../lib/index.ts";
import { config } from "../../../config.ts";

export const fetchProducts = createAsyncThunk<ProductProps[]>(
  "products/fetchAll",
  async () => {
    const endpointfetchProducst = `${config.baseUrl}/api/products/all_products`;
    const response = await getData(endpointfetchProducst);
    if (!response || response.status != 200)
      throw new Error("Error al cargar productos");

    return response.data.data || [];
  }
);

export const fetchProductById = createAsyncThunk<ProductProps[], string>(
  "products/fetchById",
  async (id) => {
    const endpoint = `${config.baseUrl}/api/products/product/${id}`;
    const response = await getData(endpoint);
    if (!response || response.status !== 200)
      throw new Error("Error al cargar el producto");

    return response.data.data;
  }
);

export const fetchCategories = createAsyncThunk<ProductProps[] | ProductProps>(
  "products/fetchCategories",
  async () => {
    const endpoint = `${config.baseUrl}/api/products/categories`;
    const reponse = await getData(endpoint);
    if (reponse.status == 404 || reponse.status != 200) {
      throw new Error("Error al cargar las categorias");
    }
    return reponse.data;
  }
);

export const fetchByCategorie = createAsyncThunk<ProductProps[], string>(
  "products/fetchByCategorie",
  async (category) => {
    const endpoint = `${config.baseUrl}/api/products/categories/${category}`;
    const reponse = await getData(endpoint);
    if (reponse.status == 404 || reponse.status != 200) {
      throw new Error("Error al cargar por categoria");
    }
    return reponse.data.data;
  }
);
