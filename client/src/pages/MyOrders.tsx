import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import { formatPrice, getProductsById, getUserOrders } from "../lib";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CartItem, PartialOrder, ProductProps } from "../../type";
import OrderCard from "../components/OrderCard";
import Title from "../components/Title";
import Limiter from "../components/Limiter";

const MyOrders = () => {
  const userState = useSelector((state: RootState) => state.user);
  const user = userState.user;
  const [orders, setOrders] = useState<PartialOrder[]>([]); // Estado para almacenar las órdenes
  const [products, setProducts] = useState<ProductProps[]>([]); // Estado para almacenar los productos

  const handleUserOrders = async () => {
    if (!user?.id) return;

    const fetchedOrders = await getUserOrders(user.id);
    if (fetchedOrders && fetchedOrders.length > 0) {
      setOrders(fetchedOrders); // Almacena las órdenes en el estado

      const allIds = fetchedOrders.flatMap((order) =>
        order.items.map((item: CartItem) => item.product_id)
      ); // Obtiene todos los IDs de productos

      const pp = await getProductsById(allIds);
      setProducts(pp);
      console.log("Productos:", pp);
      console.log("Órdenes:", fetchedOrders);
    } else {
      console.log("No se encontraron órdenes.");
    }
  };

  useEffect(() => {
    handleUserOrders();
  }, [user]);

  return (
    <Container>
      <Title titulo="Mis órdenes" />
      <Limiter className="w-full text-gray-300" />
      {orders.length > 0 ? (
        <div className="flex flex-col">
          {orders.map((order, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-bold">Orden #{index + 1}</h3>
              <h4 className="text-sm text-gray-800">
                Dirección: {order.info_address}
              </h4>
              <h4 className="text-sm text-black underline underline-offset-2">
                Total: {formatPrice(order.total)}
              </h4>
              <div className="flex flex-row">
                {order.items.map((item: CartItem) => {
                  const product = products.find(
                    (p) => p._id === item.product_id
                  );
                  return product ? (
                    <OrderCard key={product._id} item={product} />
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>No hay productos aún.</>
      )}
    </Container>
  );
};

export default MyOrders;
