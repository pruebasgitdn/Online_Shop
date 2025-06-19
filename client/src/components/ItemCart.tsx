import { ProductProps } from "../../type";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { MdOutlineDone } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";
import { formatPrice } from "../lib";
import { AppDispatch, RootState } from "../redux/store";
import { removeFromCart, updateQuantity } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { deleteCartDB, updateQuantityCartDB } from "../redux/thunks/userThunks";
import { useState } from "react";

type ProductWithQuantity = ProductProps & { quantity: number };

interface Props {
  item: ProductWithQuantity;
}

const ItemCart = ({ item }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector((state: RootState) => state.user);
  const condensedUserState = userState.user;
  const userIDtoString = condensedUserState?.id?.toString() ?? "";
  const productIdToString = item._id.toString() ?? "";
  const productQuantityToString = item.quantity.toString() ?? "";
  const [quantity, setQuantity] = useState(1);

  const handleRemove = (item: ProductProps) => {
    dispatch(removeFromCart(item._id));
    dispatch(
      deleteCartDB({
        userId: userIDtoString,
        productId: item._id,
      })
    );
    toast.success("Se ha removido del carro");
  };

  const handleUpdateQuantity = async (item: ProductProps) => {
    dispatch(
      updateQuantity({
        product_id: item._id,
        quantity: item.quantity - 1,
      })
    );
    await dispatch(
      updateQuantityCartDB({
        userId: userIDtoString,
        productId: item.quantity,
        quantity: item.quantity,
      })
    );
  };

  return (
    <div className="bg-gray-100 w-full rounded-md p-2 grid grid-cols-12 my-1">
      {/*imagen*/}
      <div className="col-span-4">
        <img
          src={item.images[0]}
          alt="img"
          className="rounded-md w-20 h-20 md:w-42 md:h-42 object-fill mx-auto"
        />
      </div>
      {/*info*/}
      <div className="col-span-8 relative">
        <span className="absolute top-2 right-4">
          <IoCloseCircleOutline
            size={20}
            className="hover:cursor-pointer"
            onClick={() => handleRemove(item)}
          />
        </span>
        <div className="flex flex-col gap-2">
          <h2>{item.name}</h2>
          <p className="text-xs flex gap-1.5">
            Marca:
            <span className="font-bold">{item.brand} </span>
          </p>
          <p className="text-xs flex gap-1.5">
            Categoria:
            <span className="font-bold">{item.category} </span>
          </p>

          {/*CANTIDAD*/}
          <div className="flex flex-row items-center gap-10">
            <h2> {formatPrice(item.discountedPrice)}</h2>
            <Button
              className="rounded-full h-8 w-8   hover:bg-gray-300 hover:rounded-full"
              text=""
              icon={<CiCircleMinus size={25} className="text-slate-900" />}
              onClick={async () => {
                dispatch(
                  updateQuantity({
                    product_id: item._id,
                    quantity: item.quantity - 1,
                  })
                );
                await dispatch(
                  updateQuantityCartDB({
                    userId: userIDtoString,
                    productId: item._id,
                    quantity: item.quantity - 1,
                  })
                );
              }}
            />
            {item.quantity}
            <Button
              className="rounded-full h-8 w-8 hover:bg-gray-300 hover:rounded-full"
              text=""
              icon={<CiCirclePlus size={25} className="text-slate-900" />}
              onClick={async () => {
                dispatch(
                  updateQuantity({
                    product_id: item._id,
                    quantity: item.quantity + 1,
                  })
                );

                await dispatch(
                  updateQuantityCartDB({
                    userId: userIDtoString,
                    productId: item._id,
                    quantity: item.quantity + 1,
                  })
                );
              }}
            />
          </div>
          {item.isStock ? (
            <div className="flex flex-row gap-2 items-center">
              <span>
                <MdOutlineDone size={25} className="text-green-500" />
              </span>
              <p className="text-sm">En stock</p>
            </div>
          ) : (
            <div className="flex flex-row gap-2 items-center">
              <span>
                <MdOutlineDone size={25} className="text-red-500" />
              </span>
              <p className="text-sm">Sin stock</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCart;
