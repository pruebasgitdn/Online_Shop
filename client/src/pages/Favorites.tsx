import { useState, useEffect } from "react";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { ProductProps } from "../../type";
import { postData } from "../lib";
import { config } from "../../config";
import Container from "../components/Container";
import Title from "../components/Title";
import Limiter from "../components/Limiter";
import Button from "../components/Button";
import FavoCard from "../components/FavoCard";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const navigate = useNavigate();

  //REDUX
  const favoState = useSelector((state: RootState) => state.favorites);

  //ESTADOS LOCALES
  const [idsFavo, setIdsFavo] = useState<number[] | []>([]);
  const [itemsFavo, setItemsFavo] = useState<ProductProps[]>([]);

  useEffect(() => {
    const favoProducts = favoState.favorites.map((p) => p.product_id);

    setIdsFavo(favoProducts);
  }, [favoState.favorites]);

  useEffect(() => {
    const fetchItems = async () => {
      if (idsFavo.length === 0) return;
      try {
        const response = await postData(
          `${config.baseUrl}/api/products/get_cart_products`,
          { product_id: idsFavo }
        );

        if (response.status === 200) {
          setItemsFavo(response.data.data);
        }
      } catch (error) {
        console.error("Error al cargar productos del servidor:", error);
      }
    };

    fetchItems();
  }, [idsFavo]);

  console.log(itemsFavo);

  return (
    <Container>
      <Title titulo="Favoritos" />
      <Limiter className="w-full text-gray-300" />
      {favoState.favorites && favoState.favorites.length > 0 ? (
        <div className="w-full ">
          {itemsFavo.length > 0 ? (
            <div className="flex flex-col">
              {itemsFavo.map((p) => (
                <FavoCard item={p} key={p._id} />
              ))}
            </div>
          ) : (
            <div>No hay Productos favoritos </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-2 rounded-md bg-gray-100 gap-10 shadow-2xl">
          <h3 className="text-slate-900 text-3xl font-semibold">Favoritos</h3>
          <h4 className="text-slate-800 text-xl">
            No tienes productos favoritos por ahora.
          </h4>
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

export default Favorites;
