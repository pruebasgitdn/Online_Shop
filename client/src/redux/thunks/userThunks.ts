import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../supabase";
import { CartItem, CartItemV002, Favorite } from "../../../type";

export const getUserById = createAsyncThunk<any[], string>(
  "user/fetchById",
  async (id) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id);
    if (error) {
      console.log(error.message);
      throw error;
    }

    return data || [];
  }
);

export const syncGuestFavorites = createAsyncThunk(
  "user/syncGuestFavorites",
  async (userId: string, thunkAPI) => {
    const state = thunkAPI.getState();
    // const cartState = state?.cart;
    const favoState = state?.favorites;

    console.log(favoState);

    //mapear el estado de cart para obtener items y posterirmete id de cada item
    const favoItems: Favorite[] = favoState.favorites.map((item: Favorite) => ({
      product_id: item.product_id,
      user_id: item.user_id,
    }));

    console.log(favoItems);

    //obtener ids de cada item
    const ids: number[] = favoItems.map((item) => item.product_id);
    console.log(ids);

    //almacenar prmesas
    const upsertPromises = ids.map((id) =>
      supabase.from("favorites").upsert({ product_id: id, user_id: userId })
    );

    //resolverlas todas
    const results = await Promise.all(upsertPromises);
    results.forEach(({ data, error }) => {
      if (error) {
        console.log("Error al sincronizar productos: ", error);
      } else {
        console.log("Producto agregado a favoritos:", data);
      }
    });
  }
);

export const addToFavoritesDB = createAsyncThunk(
  "user/addToFavoritesDB",
  async ({ userId, productId }: { userId: string; productId: string }) => {
    try {
      const { data: existing, error: checkError } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .maybeSingle();

      const messageExisting: string =
        "Este producto ya esta en tu lista de favoritos";
      if (checkError) throw checkError.message;
      else if (existing) return messageExisting;

      const { data, error } = await supabase
        .from("favorites")
        .insert({
          user_id: userId,
          product_id: productId,
        })
        .select();

      if (error) {
        throw error.message;
      }

      return data;
    } catch (error) {
      return error;
    }
  }
);

// inicio session obtener favos de esa sesion o id
export const getUserFavoritesDB = createAsyncThunk(
  "user/getUserFavoritesDB",
  async ({ userId }: { userId: string }) => {
    try {
      if (!userId) return "No se obtuvo el id del usuario";

      const { data: existing, error: checkError } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", userId);

      if (checkError) throw checkError.message;
      else if (existing) {
        console.log(existing);
      }
      return existing;
    } catch (error) {
      return error;
    }
  }
);

export const deleteFavoriteDB = createAsyncThunk(
  "user/deleteFavoriteDB",
  async ({ userId, productId }: { userId: string; productId: number }) => {
    try {
      if (!userId || !productId)
        return "No se obtuvo el id del usuario y/o el id del producto";

      console.log({ userId, productId });

      const { data: match, error: selectError } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (selectError) {
        console.error("Error al buscar el favorito:", selectError);
        throw selectError;
      }

      if (!match || match.length === 0) {
        console.warn("No se encontró ningún favorito con esos datos");
        return "No se encontró ningún favorito con ese usuario y producto";
      }

      console.log("Favorito encontrado, procediendo a eliminar...");

      // Eliminar el favorito
      const { data, error: deleteError } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (deleteError) {
        console.error("Error al eliminar el favorito:", deleteError);
        throw deleteError;
      }

      console.log("Resultado del delete:", data);

      return "Se eliminó el producto de favoritos";
    } catch (error) {
      return error;
    }
  }
);

export const syncGuestCart = createAsyncThunk(
  "user/syncGuestCart",
  async (userId: string, thunkAPI) => {
    const state = thunkAPI.getState();
    // const cartState = state?.cart;
    const cartState = state?.cart;

    console.log(cartState);

    //mapear el estado de cart para obtener items y posterirmete id de cada item
    const cartItems: CartItemV002[] = cartState.cart.map(
      (item: CartItemV002) => ({
        id: Date.now(),
        quantity: item.quantity,
        product_id: item.product_id,
        user_id: item.user_id,
      })
    );

    console.log(cartItems);

    // //obtener ids de cada item
    const ids: number[] = cartItems.map((item) => item.product_id);
    const quantitys: number[] = cartItems.map((item) => item.quantity);

    //almacenar prmesas
    const upsertPromises = ids.map((id, index) =>
      supabase.from("cart").upsert({
        product_id: id,
        user_id: userId,
        quantity: quantitys[index],
      })
    );

    //resolverlas todas
    const results = await Promise.all(upsertPromises);
    results.forEach(({ data, error }) => {
      if (error) {
        console.log("Error al sincronizar productos: ", error);
      } else {
        console.log("Producto agregado a carrito:", data);
      }
    });
  }
);

export const addToCartDB = createAsyncThunk(
  "user/addToCartDB",
  async ({
    userId,
    productId,
    quantity,
  }: {
    userId: string;
    productId: string;
    quantity: string;
  }) => {
    try {
      const { data: existing, error: checkError } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .maybeSingle();

      const messageExisting: string = "Este producto ya esta en tu carrito";
      if (checkError) throw checkError.message;
      else if (existing) return messageExisting;

      const { data, error } = await supabase
        .from("cart")
        .insert({
          user_id: userId,
          product_id: productId,
          quantity: quantity,
        })
        .select();

      if (error) {
        throw error.message;
      }

      return data;
    } catch (error) {
      return error;
    }
  }
);

export const getUserCartDB = createAsyncThunk<CartItem[], string>(
  "user/getUserCartDB",
  async (userId: string) => {
    try {
      if (!userId) return [];

      const { data: cartItems, error: cartError } = await supabase
        .from("cart")
        .select(
          `*,
          products(_id,discountedPrice)
          `
        )
        .eq("user_id", userId);

      if (cartError) throw cartError;

      const enrichedCart: CartItem[] = cartItems.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        user_id: item.user_id,
        quantity: item.quantity,
        price: item.products?.discountedPrice ?? 0,
      }));

      return enrichedCart;
    } catch (error) {
      console.error("Error en getUserCartDB:", error);
      return [];
    }
  }
);

export const deleteCartDB = createAsyncThunk(
  "user/deleteCartDB",
  async ({ userId, productId }: { userId: string; productId: number }) => {
    try {
      if (!userId || !productId)
        return "No se obtuvo el id del usuario y/o el id del producto";

      console.log({ userId, productId });

      const { data: match, error: selectError } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (selectError) {
        console.error("Error al buscar el item del carrito:", selectError);
        throw selectError;
      }

      if (!match || match.length === 0) {
        console.warn("No se encontró ningún item del carrito con esos datos");
        return "No se encontró ningún item del carrito con ese usuario y producto";
      }

      console.log("Item del carro encontrado, procediendo a eliminar...");

      // Eliminar el favorito
      const { error: deleteError } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (deleteError) {
        console.error("Error al eliminar el item:", deleteError);
        throw deleteError;
      }

      return "Se eliminó el producto de favoritos";
    } catch (error) {
      return error;
    }
  }
);

//falta
export const updateQuantityCartDB = createAsyncThunk(
  "user/updateQuantityCartDB",
  async (
    {
      productId,
      quantity,
      userId,
    }: {
      productId: number;
      quantity: number;
      userId: string;
    },
    thunkAPI
  ) => {
    try {
      if (!userId || !productId || quantity < 1) {
        return thunkAPI.rejectWithValue(
          "Datos inválidos para actualizar el carrito"
        );
      }

      const { data, error } = await supabase
        .from("cart")
        .update({ quantity: quantity })
        .eq("product_id", productId)
        .eq("user_id", userId);

      if (error) {
        console.error("Error al actualizar la cantidad:", error);
        return thunkAPI.rejectWithValue(
          "No se pudo actualizar la cantidad del producto"
        );
      }

      if (!data || data.length === 0) {
        return thunkAPI.rejectWithValue("El producto no existe en el carrito");
      }

      return data;
    } catch (error) {
      console.error("Excepción al actualizar cantidad:", error);
      return thunkAPI.rejectWithValue(
        "Error inesperado al actualizar el carrito"
      );
    }
  }
);
