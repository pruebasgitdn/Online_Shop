import { AppDispatch } from "./src/redux/store";

export interface UserTypes {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  id: string | undefined;
  phone?: string | undefined;
  address?: string | undefined;
}

export interface EditUserProps {
  userId?: string | undefined;
  values: Partial<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string | undefined;
  }>;
  deleteOwnImage?: boolean;
  currentAvatarUrl?: string | null | undefined;
  dispatch?: AppDispatch;
}

export interface EditAddressUserProps {
  userId: string | undefined;
  values: string;
  dispatch?: AppDispatch;
}
export interface UserTT {
  currentUser: {
    firstName?: string;
    lastName?: string;
    email?: string;
    id?: string;
    address?: string;
    phone?: string | number | undefined;
  };
}

export interface FormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | undefined;
}

export interface FormAddressData {
  departamento: string;
  ciudad: string;
  barrio: string;
  direccion: string;
  codigo?: string;
  complemento?: string;
  referencias?: string;
}

export type DepartmentProp = Record<string, string[]>;
export interface ProductProps {
  _id: number;
  _base: string;
  reviews: number;
  rating: number;
  quantity: number;
  overView: string;
  name: string;
  isStock: boolean;
  isNew: boolean;
  images: [string];
  discountedPrice: number;
  regularPrice: number;
  description: string;
  colors: [string];
  category: string;
  brand: string;
}

export interface CategoryProps {
  id: number;
  image: string;
  base: string;
  name: string;
  description: string;
}

export interface BlogProps {
  _id: number;
  image: string;
  title: string;
  description: string;
  _base: string;
}

export interface OrderTypes {
  orderItems: [ProductProps];
  paymentId: string;
  paymentMethod: string;
  userEmail: string;
}

export interface Favorite {
  id: number;
  user_id: string | UserTypes;
  product_id: number;
}

export interface CartItem {
  id: number;
  user_id: string | UserTypes;
  product_id: number;
  quantity: number;
  price: number;
}

export interface QuitToFavo {
  userSttatte?: UserTypes;
  item_id: number;
}

export interface CartItemV002 {
  id: number;
  user_id: string | UserTypes;
  product_id: number;
  quantity: number;
}

export interface SaveOrderInterface {
  user_id: string;
  session_id: string;
  items: CartItem[];
  total: number;
  info_address: string;
}

export interface PartialOrder {
  items: CartItem[];
  total: number;
  info_address: string;
}
