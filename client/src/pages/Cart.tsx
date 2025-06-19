import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Container from "../components/Container";
import { formatPrice, postData } from "../lib";
import { ProductProps } from "../../type";
import { config } from "../../config";
import ItemCart from "../components/ItemCart";
import Button from "../components/Button";
import Title from "../components/Title";
import Limiter from "../components/Limiter";
import { useNavigate } from "react-router-dom";
import PaymenButton from "../components/PaymenButton";

const Cart = () => {
  const navigate = useNavigate();

  //ESTADO REDUX
  const cartState = useSelector((state: RootState) => state.cart);

  //ESTADOS
  const [idsCart, setIdsCart] = useState<number[] | []>([]);
  const [itemsCart, setitemsCart] = useState<ProductProps[]>([]);
  const shippingEstimate = 50000;

  // USEEEFFECTS
  useEffect(() => {
    const products = cartState.cart.map((p) => p.product_id);
    setIdsCart(products);
  }, [cartState.cart]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (idsCart.length === 0) return;

      try {
        const response = await postData(
          `${config.baseUrl}/api/products/get_cart_products`,
          { product_id: idsCart }
        );
        if (response.status === 200) {
          setitemsCart(response.data.data);
        }
      } catch (error) {
        console.error("Error al cargar productos del carrito:", error);
      }
    };

    fetchCartItems();
  }, [idsCart]);

  // CARRO CON CANTIDADES (AL OTRO COMPONENTE)
  const cartWithQuantities = itemsCart.map((product) => {
    // Buscar por concidencia
    const cartItem = cartState.cart.find(
      (item) => item.product_id == product._id
    );

    return {
      ...product,
      quantity: cartItem?.quantity || 1,
    };
  });

  //FUNCION OBTENER TOTAL
  const getTotal = () => {
    const xx = cartWithQuantities.reduce(
      (acc, item) => acc + item.discountedPrice * item.quantity,
      0
    );

    return formatPrice(xx + shippingEstimate);
  };

  console.log(cartWithQuantities);
  console.log(cartState.cart);
  console.log(itemsCart);

  return (
    <Container>
      <Title titulo="Carrito" />
      <Limiter className="w-full text-gray-300" />
      {cartState.cart && cartState.cart.length > 0 ? (
        <div className="flex flex-col lg:flex-row p-2 w-full gap-2 ">
          <div className="w-full">
            {cartWithQuantities.length > 0 ? (
              <div className="flex flex-col">
                {cartWithQuantities.map((item) => (
                  <ItemCart key={item._id} item={item} />
                ))}
              </div>
            ) : (
              <p>No hay productos en el carrito.</p>
            )}
          </div>
          <div
            className=" 
          p-2 rounded-md
          bg-gray-200 shadow-lg flex flex-col gap-2
            lg:w-1/2 lg:h-min  
          "
          >
            <h2 className="text-xl font-black">Resumen del pedido</h2>
            <h3>Subtotal</h3>
            <h3>Costos de envio {formatPrice(shippingEstimate)}</h3>
            <h3>Total Descuento</h3>
            <Limiter className="w-full" />
            <h3 className="text-xl font-black">TOTAL {getTotal()}</h3>
            {/* <Button
              text="PAGAR"
              className="bg-pink-900 text-white text-center rounded-sm p-4 mx-auto"
            /> */}
            <PaymenButton items={itemsCart} cartExtra={cartState.cart} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-2 rounded-md bg-gray-100 gap-10 shadow-2xl">
          <h3 className="text-slate-900 text-3xl font-semibold">
            Carrito de compras
          </h3>
          <h4 className="text-slate-800 text-xl">Tú carrito está vacio.</h4>
          <p className="text-slate-500 text-lg text-center w-8/12">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Consequatur optio adipisci temporibus, sint quae ullam, eligendi
            laudantium ex et corporis illo harum nesciunt, cum consequuntur nemo
          </p>
          <Button
            text="Ir a Comprar"
            className="bg-pink-950 text-white p-5 rounded-full hover:opacity-80 w-auto"
            onClick={() => navigate("/product")}
          />
        </div>
      )}
    </Container>
  );
};

export default Cart;
