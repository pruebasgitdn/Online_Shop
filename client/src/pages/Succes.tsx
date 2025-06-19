import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../redux/store";
import Container from "../components/Container";
import Loading from "../components/Loading";
import { DeleteCartFiles, SaveOrder } from "../lib";
import { clearCart } from "../redux/slices/cartSlice";
import Button from "../components/Button";
import { IoCloudDone } from "react-icons/io5";

const Succes = () => {
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  //estado carro y user
  const cartState = useSelector((state: RootState) => state.cart);
  const userState = useSelector((state: RootState) => state.user);

  const cart = cartState.cart;
  const user = userState.user;

  //LOADING
  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  useEffect(() => {
    const executeOrder = async () => {
      const total = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      try {
        setLoading(true);

        if (!hasSaved && sessionId && user?.id && cart.length > 0) {
          setHasSaved(true);

          //guardar orden
          await SaveOrder({
            user_id: user?.id,
            session_id: sessionId,
            items: cart,
            total: total,
            info_address: user?.address,
          });

          //eliminar datos del carro de supabase
          await DeleteCartFiles(user?.id);

          //eliminar del estado puesto que tan si sabe
          dispatch(clearCart());
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (!sessionId) {
      navigate("/");
    }
    if (sessionId && cart.length > 0 && user?.id && !hasSaved) {
      executeOrder();
    }

    console.log(sessionId);
  }, [sessionId, navigate, cart, user, dispatch, hasSaved]);

  return (
    <Container>
      {loading && <Loading />}
      <div className="rounded-md shadow-gray-800 py-10 shadow-2xl flex flex-col items-center justify-center gap-y-5">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          {loading
            ? "Tú orden de pago se esta procesando"
            : "Pago aceptado por supergear.com"}
        </h2>
        <IoCloudDone size={50} className="text-green-400" />
        <p>
          {loading ? "Una vez hecho" : "Ahora"} podrás ver tus ordenes o
          continuar comprando con nosotros.
        </p>
        <div className="flex items-center gap-x-5">
          <Link to={"/orders"}>
            <Button
              text="Ver Mis Ordenes"
              className="bg-black text-slate-100 w-full rounded-full text-sm font-semibold hover:opacity-75 duration-300 p-2"
            ></Button>
          </Link>
          <Link to={"/product"}>
            <Button
              text="Comprar"
              className="bg-black text-slate-100 w-full rounded-full text-sm font-semibold hover:opacity-75 duration-300 p-2"
            ></Button>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default Succes;
