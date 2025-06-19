import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import { IoMdStar } from "react-icons/io";
import { FaRegEye } from "react-icons/fa";
import { LuSquareX } from "react-icons/lu";

import Loading from "./Loading";
import Container from "./Container";
import Button from "./Button";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchProductById, fetchProducts } from "../redux/thunks/productThunks";
import PaginatedProducts from "./PaginatedProducts";
import { formatPrice, calculateDisct } from "../lib";
import { addToCart, setTotalPrice } from "../redux/slices/cartSlice";
import { CartItem, ProductProps } from "../../type";

const ProductCard = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");

  // ESTADOS
  const [BigImage, setBigImage] = useState<string | null>(null);
  const [color, setColor] = useState("Sin seleccionar");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ESTADO REDUX
  const dispatch = useDispatch<AppDispatch>();
  const { selectedProduct, allProducts, loading } = useSelector(
    (state: RootState) => state.product
  );

  const userState = useSelector((state: RootState) => state.user);
  const cartState = useSelector((state: RootState) => state.cart);
  console.log(allProducts);

  // CATEGORIAS Y MARCAS
  const productsToUse = Array.isArray(allProducts) ? allProducts : [];

  const uniqueCategories = [...new Set(productsToUse.map((p) => p.category))];

  const uniqueBrands = Array.from(new Set(productsToUse?.map((p) => p.brand)));

  const colorBgs = [
    { color: "blue", item: "bg-blue-700", _base: "Azul" },
    { color: "green", item: "bg-green-700", _base: "Verde" },
    { color: "silver", item: "bg-zinc-400", _base: "Plateado" },
    { color: "gray", item: "bg-gray-600", _base: "Gris" },
    { color: "yellow", item: "bg-yellow-500", _base: "Amarillo" },
    { color: "red", item: "bg-red-700", _base: "Rojo" },
  ];

  // CONDICIONES USEEFFECT
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (!id) {
      dispatch(fetchProducts());
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // PRODUCTOS FILTRADOS PASADOS A PAGINAR
  const filteredProducts =
    productsToUse?.filter((p) => {
      const matchCategory = selectedCategory
        ? p.category === selectedCategory
        : true;
      const matchBrand = selectedBrand ? p.brand === selectedBrand : true;

      return matchCategory && matchBrand;
    }) || [];

  //LOADING
  useEffect(() => {
    if (loading) {
      setIsLoading(true);
    } else {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  const handleAddCart = (item: any) => {
    const rr: CartItem = {
      id: Date.now(),
      user_id: userState.user || "Invitado",
      product_id: item?._id,
      quantity: 1,
      price: item.discountedPrice,
    };
    dispatch(addToCart(rr));
    dispatch(setTotalPrice());
    console.log(rr);
  };

  const isInCart =
    selectedProduct && selectedProduct.length > 0
      ? cartState.cart.some(
          (cartItem) => cartItem.product_id === selectedProduct[0]?._id
        )
      : false;

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : id && selectedProduct ? (
        <Container>
          <div className="grid md:grid-cols-1 lg:grid-cols-2">
            <div className="flex justify-center items-center flex-row gap-5 p-1.5">
              <div>
                {selectedProduct.map((z) => (
                  <div className="flex flex-col" key={z._id}>
                    {z.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Imagen ${idx + 1} de ${z.name}`}
                        className={`hover:shadow-lg rounded-sm hover:cursor-pointer object-contain md:w-46 md:h-28 transition-all duration-300 hover:scale-110 w-24 h-24 ${
                          BigImage === img
                            ? "border-2 border-blue-500"
                            : "border border-gray-300"
                        }`}
                        onMouseEnter={() => setBigImage(img)}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <div className="w-full h-full p-2">
                {selectedProduct.length > 0 && (
                  <Zoom key={BigImage || selectedProduct[0].images[0]}>
                    <img
                      src={BigImage || selectedProduct[0].images[0]}
                      alt="Imagen principal"
                      className="w-full h-full object-fill ease-in-out rounded-md transition-all duration-500"
                    />
                  </Zoom>
                )}
              </div>
            </div>

            <div className="flex flex-col pt-10 items-center w-full gap-1.5 p-1.5">
              {selectedProduct.map((z) => (
                <div key={z._id}>
                  <h3 className="text-black text-3xl font-bold">{z.name}</h3>

                  <div className="flex flex-col lg:flex-row justify-between gap-20 font-semibold w-full">
                    <div className="flex flex-row gap-5">
                      <p className="line-through text-gray-500 text-xl">
                        {formatPrice(z.regularPrice)}
                      </p>
                      <p className="text-cyan-500 text-xl">
                        {formatPrice(z.discountedPrice)}
                      </p>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                      <div className="flex flex-row">
                        {[...Array(5)].map((_, idx) => (
                          <IoMdStar
                            key={idx}
                            className="text-slate-500 hover:text-yellow-500 hover:cursor-pointer"
                            size={20}
                          />
                        ))}
                      </div>
                      <p>({z.reviews} calificaciones)</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-5 w-full">
                    <div className="flex gap-2 items-center">
                      <FaRegEye size={20} />
                      <p> 50 personas están viendo esto</p>
                    </div>
                    <div>
                      <p className="text-emerald-800 font-semibold">
                        Estás ahorrando {calculateDisct(z)} tras la compra
                      </p>
                    </div>
                    <div className="w-full">
                      <div className="flex gap-2">
                        <p>Color:</p>
                        <span className="font-semibold">{color}</span>
                      </div>
                      <div className="flex flex-row gap-5 w-80">
                        {colorBgs
                          .filter((bg) => z.colors.includes(bg.color))
                          .map((bg, idx) => (
                            <div
                              key={idx}
                              className={`w-8 h-8 rounded-full cursor-pointer ${
                                bg.item
                              } border ${
                                color === bg.color
                                  ? "border-black border-2"
                                  : "border-white border-2"
                              }`}
                              title={bg.color}
                              onClick={() =>
                                setColor(
                                  color === bg.color
                                    ? "Sin seleccionar"
                                    : bg.color
                                )
                              }
                            ></div>
                          ))}
                      </div>
                      <Button
                        text="Limpiar."
                        className="bg-white border-[1px] border-slate-900 p-1 w-40 mt-2 hover:bg-gray-300 hover:duration-500"
                        onClick={() => setColor("Sin seleccionar")}
                        icon={<LuSquareX className="ml-2.5" />}
                      />
                    </div>
                    <div className="flex gap-2">
                      <p>Marca:</p>
                      <span className="font-semibold">{z.brand}</span>
                    </div>
                    <div className="flex gap-2">
                      <p>Categoría:</p>
                      <span className="font-semibold">{z.category}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                text={isInCart ? "Remover del carro" : "Añadir al carro"}
                className="bg-indigo-600 text-white font-semibold h-auto p-1.5 rounded-xl focus:outline-0 hover:opacity-85 uppercase"
                onClick={() => handleAddCart(selectedProduct[0])}
              />
            </div>
          </div>
        </Container>
      ) : (
        <Container className="flex flex-row w-full py-2">
          <div className="flex flex-col md:mt-10 mt-5 gap-2.5   border-r-2 border-slate-400 p-3 text-sm">
            {productsToUse && productsToUse.length > 0 ? (
              <>
                <h2 className="text-xl text-black font-semibold">
                  Categorias.
                </h2>

                {uniqueCategories?.map((p) => (
                  <div
                    onClick={() => {
                      if (selectedCategory?.toLowerCase() === p.toLowerCase()) {
                        setSelectedCategory("");
                      } else {
                        setSelectedCategory(p);
                      }
                    }}
                    key={p}
                    className={`${
                      selectedCategory === p
                        ? "underline text-green-700 font-extrabold   rounded-md p-0.5 bg-green-200"
                        : ""
                    } hover:cursor-pointer hover:bg-slate-200 rounded-md p-0.5 h-auto`}
                  >
                    {p}
                  </div>
                ))}

                <h2 className="text-xl text-black font-semibold">Marcas.</h2>
                {uniqueBrands?.map((p) => (
                  <div
                    onClick={() => {
                      if (selectedBrand?.toLowerCase() === p.toLowerCase()) {
                        setSelectedBrand("");
                      } else {
                        setSelectedBrand(p);
                      }
                    }}
                    key={p}
                    className={`${
                      selectedBrand === p
                        ? "underline text-green-700 font-extrabold   rounded-md p-0.5 bg-green-200"
                        : ""
                    } hover:cursor-pointer hover:bg-slate-200 rounded-md p-0.5 h-auto`}
                  >
                    {p}
                  </div>
                ))}
                <Button
                  text="Limpiar filtro"
                  className="bg-slate-500 rounded-full p-1 text-white text-sm h-auto"
                  onClick={() => {
                    dispatch(fetchProducts());
                    setSelectedCategory("");
                    setSelectedBrand("");
                  }}
                />
              </>
            ) : (
              <div>
                <p className="text-center text-red-800 font-bold text-xl">
                  No hay categorias{" "}
                </p>
              </div>
            )}
          </div>
          <div className="ml-2">
            {productsToUse && productsToUse.length > 0 ? (
              <div>
                <PaginatedProducts allProducts={filteredProducts} />
              </div>
            ) : (
              <div>
                <p className="text-center text-red-800 font-bold text-xl">
                  No se encontaron los productos{" "}
                </p>
              </div>
            )}
          </div>
        </Container>
      )}
    </div>
  );
};

export default ProductCard;
