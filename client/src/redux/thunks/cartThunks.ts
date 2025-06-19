import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProductProps } from "../../../type";
import { getData } from "../../lib/index.ts";
import { config } from "../../../config.ts";

export const fetchCartItems = createAsyncThunk<ProductProps[]>(
  "cart/getCartProducts",
  async () => {
    const endpointfetchProducst = `${config.baseUrl}/api/products/get_cart_products`;
    const response = await getData(endpointfetchProducst);
    if (!response || response.status != 200)
      throw new Error("Error al cargar productos");

    return response.data;
  }
);
