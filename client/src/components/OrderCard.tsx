import React from "react";
import { ProductProps } from "../../type";
import { useNavigate } from "react-router-dom";

interface Props {
  item: ProductProps;
}

const OrderCard = ({ item }: Props) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="shadow-gray-400 shadow-xl text-black m-1.5 rounded-md w-auto
      p-2 hover:cursor-pointer hover:opacity-80
    "
        onClick={() => navigate(`/product/${item._id}`)}
      >
        <img src={item.images[0]} className="object-fill h-20 mx-auto" alt="" />
        <h4 className="text-xs text-gray-600 italic">{item.name}</h4>
        <h4 className="text-xs text-gray-600 italic">{item.brand}</h4>
      </div>
    </>
  );
};

export default OrderCard;
