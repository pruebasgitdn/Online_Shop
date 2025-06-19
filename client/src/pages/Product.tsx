import { useState } from "react";
import { CartItem, Favorite, ProductProps, QuitToFavo } from "../../type";
import { MdDone, MdStar } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { IoRemoveCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { calculatePercentage, formatPrice } from "../lib";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import {
  addToCart,
  removeFromCart,
  setTotalPrice,
  updateQuantity,
} from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { addToFavo, removeFromFavo } from "../redux/slices/favoriteSlice";
import {
  addToCartDB,
  addToFavoritesDB,
  deleteCartDB,
  deleteFavoriteDB,
  updateQuantityCartDB,
} from "../redux/thunks/userThunks";

interface Props {
  item: ProductProps;
}

const Product = ({ item }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  //ESTADOS REDUX
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector((state: RootState) => state.user);
  const cartState = useSelector((state: RootState) => state.cart);
  const favoState = useSelector((state: RootState) => state.favorites);

  const condensedUserState = userState.user ?? undefined;
  const quantityToString = quantity.toString();
  const userIdToString = condensedUserState?.id?.toString() ?? "";
  const productIdToString = item._id.toString() ?? "";

  const userIdToNum = Number(condensedUserState?.id);
  const isValidUuid = (uuid: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      uuid
    );

  const handleAddCart = (item: any) => {
    try {
      const rr: CartItem = {
        id: Date.now(),
        user_id: userState.user?.id || "Invitado",
        product_id: item?._id,
        quantity: 1,
        price: item.discountedPrice,
      };
      dispatch(addToCart(rr));
      dispatch(setTotalPrice());
      dispatch(
        addToCartDB({
          userId: userIdToString,
          productId: productIdToString,
          quantity: quantityToString,
        })
      );

      const userId = userState.user?.id;
      if (!userId) return;

      toast.success(`Se ha añadido ${item?.name} al carrito`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddFavo = async (item: any) => {
    try {
      const rr: Favorite = {
        id: Date.now(),
        user_id: userState.user?.id || "Invitado",
        product_id: item?._id,
      };
      dispatch(addToFavo(rr));
      toast.success("Se ha añadido al favoritos");

      const userId = userState.user?.id;
      if (!userId) return;

      await dispatch(
        addToFavoritesDB({
          userId: userId,
          productId: item?._id,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuitToCart = (item: any) => {
    try {
      const isInCart = cartState.cart.some((p) => p.product_id == item._id);

      if (isInCart) {
        dispatch(removeFromCart(item?._id)); //Remover del estado
        dispatch(
          //Remover del cart db
          deleteCartDB({
            productId: item._id,
            userId: userIdToString,
          })
        );
        toast.error("Producto eliminado del carrito");
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuitToFavo = ({ userSttatte, item_id }: QuitToFavo) => {
    const userID = userState.user?.id ?? "";
    if (userSttatte) {
      dispatch(
        deleteFavoriteDB({
          userId: userID,
          productId: item_id,
        })
      );
    }
    dispatch(removeFromFavo(item_id));

    console.log(userSttatte);
    console.log(item_id);
  };

  // REVISAR SI ESTA EN EL TAN
  const isInCart = cartState.cart.some((p) => p.product_id == item._id);

  const isInFavo = favoState.favorites.some((p) => p.product_id == item._id);

  return (
    <div
      className="relative group flex flex-col items-center justify-center border-0 border-gray-500 rounded-md hover:cursor-pointer p-4 
      hover:border-1 hover:bg-slate-100
     "
    >
      {/* DESCUENTO */}
      <div className="absolute top-0 left-0 p-1 rounded-md bg-black text-cyan-200 text-xs z-10">
        Descuento del {calculatePercentage(item)}%
      </div>

      {/* ICONOS */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2 z-10">
        <button
          className="bg-slate-300 rounded-full p-1 shadow hover:bg-gray-200 hover:cursor-pointer"
          title={isInFavo ? "Remover de Favoritos" : "Agregar a Favoritos"}
          onClick={() => {
            if (isInFavo) {
              // dispatch(removeFromFavo(item._id));
              handleQuitToFavo({
                userSttatte: condensedUserState,
                item_id: item._id,
              });

              toast.info("Se elimino de favoritos");
            } else {
              handleAddFavo(item);
            }
          }}
        >
          {isInFavo ? (
            <IoRemoveCircle size={18} className="text-slate-900" />
          ) : (
            <MdStar size={18} className="text-slate-900" />
          )}
        </button>

        <button
          className="bg-slate-300 rounded-full p-1 shadow hover:bg-gray-200 hover:cursor-pointer"
          onClick={() => navigate(`/product/${item._id}`)}
          title="Ver prodcuto"
        >
          <FaEye size={18} className="text-slate-900 " />
        </button>
      </div>

      {/* IMAGEN */}
      <div className="w-full h-50">
        <img
          srcSet={item?.images[0]}
          alt="img"
          className="h-full object-contain w-full  hover:scale-105  transition-transform duration-150 rounded-md"
        />
      </div>

      {/* CATEGORIA NOMBRE PRECIO */}
      <h3 className="text-slate-400 uppercase font-semibold text-xs">
        {item?.category}
      </h3>
      <h4 className="text-black font-bold text-center">{item?.name}</h4>

      <div className="flex justify-between gap-5 text-xs">
        <h4 className="line-through">{formatPrice(item?.regularPrice)}</h4>
        <h4 className="text-sky-500">{formatPrice(item?.discountedPrice)} </h4>
      </div>
      <div className="flex flex-row">
        <MdStar className="hover:text-yellow-400 text-slate-700" />
        <MdStar className="hover:text-yellow-400 text-slate-700" />
        <MdStar className="hover:text-yellow-400 text-slate-700" />
        <MdStar className="hover:text-yellow-400 text-slate-700" />
      </div>

      {/* BOTON CANTIDAD Y CARRO*/}
      {showModal ? (
        <>
          <div className="grid grid-rows-2 gap-1">
            <div className="flex gap-0.5">
              <button
                className="p-2 rounded-full bg-slate-300 text-black w-10 h-10
                hover:bg-slate-400 hover:cursor-pointer duration-200
                "
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
              <button className="p-2 rounded-md bg-none text-black w-10">
                {quantity}
              </button>
              <button
                className="p-2 rounded-full bg-slate-300 text-black w-10 h-10
                hover:bg-slate-400 hover:cursor-pointer duration-200
                "
                onClick={() => {
                  if (quantity > 1) {
                    setQuantity(quantity - 1);
                  }
                }}
              >
                -
              </button>
            </div>

            <div className="flex flex-row justify-center gap-1">
              <button
                className="h-6 w-full p-1 bg-red-500 rounded-md
                 hover:bg-red-600 hover:cursor-pointer duration-200
                "
                onClick={() => setShowModal(false)}
              >
                <FiX size={12} className=" text-white mx-auto" />
              </button>
              <button
                className="h-6 w-full p-1 bg-green-500 rounded-md
                 hover:bg-green-600 hover:cursor-pointer duration-200
                "
                onClick={async () => {
                  if (!userIdToString || !isValidUuid(userIdToString)) {
                    toast.error("ID de usuario inválido");
                    return;
                  }

                  dispatch(
                    updateQuantity({
                      product_id: item._id,
                      quantity: quantity,
                    })
                  );

                  await dispatch(
                    updateQuantityCartDB({
                      productId: item._id,
                      quantity: quantity,
                      userId: userIdToString,
                    })
                  );

                  setShowModal(false);
                }}
              >
                <MdDone size={12} className=" text-white mx-auto" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* BOTON CARRO */}
          <Button
            text={isInCart ? "Remover del carro" : "Añadir al carro"}
            className={`bg-slate-300 p-1 text-black rounded-md hover:bg-black hover:text-white text-sm my-1.5 ${
              isInCart ? "bg-black text-white" : ""
            }`}
            onClick={() => {
              if (isInCart) {
                //removefrom db userthunk
                // --- -- --- - -
                //- - -- - - - -- - -

                handleQuitToCart(item);
              } else {
                //addfrom db userthunk
                // --- -- --- - -
                //- - -- - - - -- - -

                handleAddCart(item);
                setShowModal(true);
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default Product;
