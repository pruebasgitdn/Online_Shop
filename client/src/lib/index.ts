import { toast } from "react-toastify";
import {
  EditAddressUserProps,
  EditUserProps,
  Favorite,
  PartialOrder,
  ProductProps,
  SaveOrderInterface,
  UserTypes,
} from "../../type";
import { addToFavo, clearFavo } from "../redux/slices/favoriteSlice";
import { AppDispatch } from "../redux/store";
import { supabase } from "../supabase";
import {
  setLogin,
  setLogout,
  updateInfoUser,
  updateUser,
} from "../redux/slices/userSlice";
import { clearCart } from "../redux/slices/cartSlice";

export const getData = async (endpoint: string) => {
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response || !response.ok) {
      throw Error("ERROR. No se pudo obtener la data" + response?.statusText);
    }
    const data = await response.json();
    return {
      status: response.status,
      data: data,
    };
  } catch (error) {
    console.log(`No se pudo obtener el endpoint ${error}`);
    return {
      status: 500,
      data: null,
    };
  }
};

export const postData = async (endpoint: string, payload: any) => {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response || !response.ok) {
      throw Error("ERROR. No se pudo obtener la data" + response?.statusText);
    }
    const data = await response.json();
    return {
      status: response.status,
      data: data,
    };
  } catch (error) {
    console.log(`No se pudo obtener el endpoint ${error}`);
    return {
      status: 500,
      data: null,
    };
  }
};

export const formatPrice = (number: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export const calculatePercentage = (item: ProductProps) => {
  if (!item) return 0;

  const { discountedPrice, regularPrice } = item;

  if (!regularPrice || regularPrice === 0) return 0;

  const s = ((regularPrice - discountedPrice) / regularPrice) * 100;
  return Math.round(s);
};

export const calculateDisct = (item: ProductProps) => {
  if (!item) return 0;

  const { discountedPrice, regularPrice } = item;

  if (!regularPrice || regularPrice === 0) return 0;

  const s = regularPrice - discountedPrice;

  const formattedDiscount = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(s);

  return formattedDiscount;
};

export const handleAddFavo = (
  item: ProductProps,
  dispatch: any,
  user_id?: string
) => {
  const rr: Favorite = {
    id: Date.now(),
    user_id: user_id || "Invitado",
    product_id: item?._id,
  };
  dispatch(addToFavo(rr));
  toast.success("Se ha añadido al favoritos");
};

export const handleSessionUser = async (dispatch: AppDispatch) => {
  const { data: sessionData } = await supabase.auth.getSession();

  const session = sessionData?.session;
  const user = session?.user;

  //buscar por user.id en users y si tan despachar eso

  const { data: existingUser, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.id)
    .maybeSingle();

  if (error) {
    console.log(error.message);
  } else if (
    !existingUser ||
    existingUser == null ||
    existingUser == undefined
  ) {
    dispatch(
      setLogin({
        user: {
          email: user?.email,
          id: user?.id,
        },
        token: session?.access_token,
        isAuthenticated: true,
      })
    );
  } else if (existingUser) {
    dispatch(
      setLogin({
        user: {
          email: existingUser?.email,
          id: existingUser?.id,
          address: existingUser?.address,
          firstName: existingUser?.firstName,
          lastName: existingUser?.lastName,
          phone: existingUser?.phone,
        },
        token: session?.access_token,
        isAuthenticated: true,
      })
    );
  } else {
    return;
  }
};

// dispatch: AppDispatch
export const handleSessionGoogle = async (dispatch: AppDispatch) => {
  const { data: sessionData } = await supabase.auth.getSession();

  const session = sessionData?.session;
  const user = session?.user;

  const { data: existingUser, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.id)
    .maybeSingle();

  if (error) {
    console.log(error.message);
  } else if (
    !existingUser ||
    existingUser == null ||
    existingUser == undefined
  ) {
    dispatch(
      setLogin({
        user: {
          email: user?.email,
          id: user?.id,
        },
        token: session?.access_token,
        isAuthenticated: true,
      })
    );
  } else if (existingUser) {
    dispatch(
      setLogin({
        user: {
          email: existingUser?.email,
          id: existingUser?.id,
          address: existingUser?.address,
          firstName: existingUser?.firstName,
          lastName: existingUser?.lastName,
          phone: existingUser?.phone,
        },
        token: session?.access_token,
        isAuthenticated: true,
      })
    );
  } else {
    return;
  }
};

export const handleUpdateUser = async (dispatch: AppDispatch) => {
  const { data: sessionData } = await supabase.auth.getSession();

  const session = sessionData?.session;
  const user = session?.user;

  if (!user || !session) return;

  //Fetch a los datos actuales
  const { data: userProfile, error } = await supabase
    .from("users")
    .select("firstName, lastName, address, phone,email")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error.message);
    return;
  }

  dispatch(
    updateUser({
      id: user.id,
      email: user.email,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      phone: userProfile.phone,
    })
  );
};

export const handleLogout = async (dispatch: AppDispatch) => {
  try {
    toast.info("Sesion cerrada");

    dispatch(setLogout());
    dispatch(clearFavo());
    dispatch(clearCart());
  } catch (error) {
    console.log(error);
  }
};

export const handleEditUserInfo = async ({
  values,
  userId,
  currentAvatarUrl,
  dispatch,
}: EditUserProps) => {
  try {
    // const fieldsToUpdate: Partial<UserTT> = {};

    console.log(values);
    console.log(currentAvatarUrl);

    // // 3. Setear campos a actualizar
    const fieldsToUpdate: UserTypes = {
      id: userId,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
    };
    if (values.firstName && fieldsToUpdate)
      fieldsToUpdate.firstName = values.firstName;

    if (values.lastName && fieldsToUpdate)
      fieldsToUpdate.lastName = values.lastName;

    if (values.email && fieldsToUpdate) fieldsToUpdate.email = values.email;

    if (values.phone && fieldsToUpdate) fieldsToUpdate.phone = values.phone;

    if (Object.keys(fieldsToUpdate).length === 0) {
      console.log("No hay cambios que guardar");
      return;
    } else {
      console.log(fieldsToUpdate);
    }

    // 4. Actualizar usuario en tabla
    const { error: updateError } = await supabase
      .from("users")
      .update(fieldsToUpdate)
      .eq("id", userId);

    if (updateError) throw new Error(updateError.message);

    // 5. Refrescar datos
    const { data: updatedUser, error: getUserError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (getUserError) throw new Error(getUserError.message);
    else console.log(updatedUser);

    //6. Despachar al estado
    if (dispatch) dispatch(updateInfoUser(updatedUser));
  } catch (error) {
    console.error("handleEditUserInfo error:", error);
  }
};

export const handleEditAddressUser = async ({
  values,
  userId,
  dispatch,
}: EditAddressUserProps) => {
  try {
    console.log(values);

    const { data, error: UpdateError } = await supabase
      .from("users")
      .update({
        address: values,
      })
      .eq("id", userId);

    if (UpdateError) {
      console.log(UpdateError.message);
    } else {
      console.log(data);
    }

    if (dispatch) {
      dispatch(
        updateUser({
          id: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: values,
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
};

export const SaveOrder = async ({
  user_id,
  session_id,
  items,
  total,
  info_address,
}: SaveOrderInterface) => {
  try {
    // Verificar si ya existe
    const { data: existingOrders, error: fetchError } = await supabase
      .from("orders")
      .select()
      .eq("session_id", session_id);

    if (fetchError) throw fetchError.message;

    // Si ya existe no insertar
    if (existingOrders && existingOrders.length > 0) {
      console.log("Orden ya registrada con este session_id");
      return;
    }

    // Insertar nueva orden
    const { error } = await supabase.from("orders").insert({
      user_id,
      session_id,
      items,
      total,
      info_address,
    });

    if (error) throw error.message;

    toast.info("Se guardó la orden correctamente");
  } catch (error) {
    console.log("Error al guardar la orden:", error);
  }
};

export const DeleteCartFiles = async (user_id: string) => {
  try {
    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("user_id", user_id);

    if (error) throw error.message;
    toast.info("Se actualizo el carro");
  } catch (error) {
    console.log(error);
  }
};

export const getUserOrders = async (
  user_id: string
): Promise<PartialOrder[]> => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("total, items, info_address")
      .eq("user_id", user_id);

    if (error) throw error.message;

    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getProductsById = async (ids: number[]) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .in("_id", ids);

    if (error) {
      console.log("Error al traer productos: ", error);
      return [];
    }

    console.log("Productos", data);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
