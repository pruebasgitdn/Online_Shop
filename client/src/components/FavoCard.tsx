import React from "react";
import { CartItem, ProductProps } from "../../type";
import { formatPrice } from "../lib";
import Button from "./Button";
import { UseSelector, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import {
  addToCart,
  removeFromCart,
  setTotalPrice,
} from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { removeFromFavo } from "../redux/slices/favoriteSlice";
import {
  addToCartDB,
  deleteCartDB,
  deleteFavoriteDB,
} from "../redux/thunks/userThunks";

interface Props {
  item: ProductProps;
}

const FavoCard = ({ item }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector((state: RootState) => state.user);
  const cartState = useSelector((state: RootState) => state.cart);

  const userIdToString = userState.user?.id?.toString() ?? "";

  const handleAddCart = async (item: any) => {
    const rr: CartItem = {
      id: Date.now(),
      user_id: userState.user || "Invitado",
      product_id: item?._id,
      quantity: 1,
      price: item.discountedPrice,
    };
    dispatch(addToCart(rr));
    dispatch(setTotalPrice());

    toast.success("Se ha añadido al carrito");
  };

  //ICON
  const removeFavoFromStateAndBD = async () => {
    try {
      dispatch(removeFromFavo(item._id));

      await dispatch(
        deleteFavoriteDB({
          userId: userIdToString,
          productId: item._id,
        })
      );
      toast.success(`Se removio ${item.name} de favoritos`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveCart = async () => {
    try {
      dispatch(removeFromCart(item._id)); //estado
      await dispatch(
        //db supabase
        deleteCartDB({
          userId: userIdToString,
          productId: item._id,
        })
      );

      toast.info(`Se removio ${item.name} del carrito`);
    } catch (error) {
      console.log(error);
    }
  };

  const isInCart = cartState.cart.some((p) => p.product_id == item._id);

  return (
    <div className="rounded-md shadow-2xl my-5 grid grid-cols-12 gap-2 relative">
      <div className="col-span-3">
        <img
          src={item.images[0]}
          alt="image"
          className="w-auto md:h-48 rounded-md object-contain"
        />
      </div>
      <div className="col-span-9 flex flex-col gap-3 relative">
        <IoMdCloseCircleOutline
          className="absolute top-0 left-11/12 hover:bg-gray-300 hover:cursor-pointer rounded-full"
          title="Quitar"
          size={25}
          onClick={() => {
            removeFavoFromStateAndBD();
          }}
        />
        <h2>{item.name}</h2>
        <p className="text-xs">{item.description}</p>
        <h2 className="text-gray-600 text-sm">
          Marca: <span className="text-black font-bold">{item.brand}</span>
        </h2>
        <h2 className="text-gray-600 text-sm">
          Categoria:{" "}
          <span className="text-black font-bold">{item.category}</span>
        </h2>
        <div className="flex gap-5 items-center">
          <h2 className="line-through">{formatPrice(item.regularPrice)}</h2>
          <h2 className="text-green-600">
            {formatPrice(item.discountedPrice)}
          </h2>
          <Button
            text={isInCart ? "Quitar del carro" : "Añadir al carro"}
            className={`
                 w-auto bg-indigo-800 rounded-full p-3 text-sm my-2 text-white hover:opacity-75
                  ${isInCart ? "bg-purple-950" : "bg-green-600"}`}
            onClick={() => {
              if (isInCart) {
                handleRemoveCart();
              } else {
                handleAddCart(item);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FavoCard;
