import { useEffect, useState } from "react";
import { BiExit, BiSearch } from "react-icons/bi";
import {
  MdOutlineClose,
  MdOutlineStar,
  MdShoppingCart,
  MdArrowDropDown,
} from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import Container from "./Container";
import { useNavigate } from "react-router-dom";
import { getData, handleLogout } from "../lib";
import { config } from "../../config.ts";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { CategoryProps, ProductProps } from "../../../client/type.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store.ts";
import { supabase } from "../supabase.ts";
import Button from "./Button.tsx";

const Header = () => {
  const [searchText, SetSearchText] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const categories = [
    { title: "Inicio", link: "/" },
    { title: "Comprar", link: "/product" },
    { title: "Carrito", link: "/cart" },
    { title: "Favoritos", link: "/favorites" },
    { title: "Mi cuenta", link: "/login" },
  ];

  const [categoriesFetch, setCategoriesFetch] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState<ProductProps[]>(
    []
  );

  // ``
  //ESTADOS REDUX
  const cartState = useSelector((state: RootState) => state.cart);
  const favoState = useSelector((state: RootState) => state.favorites);
  const userState = useSelector((state: RootState) => state.user);
  const productState = useSelector((state: RootState) => state.product);
  const zz = userState.user?.address?.split("-");

  const allProducts = productState.allProducts;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = `${config.baseUrl}/api/categories/all_categories`;

        const response = await getData(endpoint);
        if (response.status == 200) {
          setCategoriesFetch(response.data.data);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const { data: sessionData } = await supabase.auth.getSession();
        console.log(user);
        console.log(sessionData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (searchText.trim() === "") {
      setSuggestedProducts([]);
      return;
    }

    const results = allProducts?.filter((product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );
    if (results != undefined) {
      setSuggestedProducts(results.slice(0, 5));
    }
  }, [searchText, allProducts]);

  const handleLogoutButton = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error.message;
      return;
    }
    handleLogout(dispatch);
    navigate("/");
  };
  return (
    <div className="w-full md:sticky md:top-0 md:z-20">
      <div className="bg-gray-200 shadow-md ">
        <div className="max-w-screen mx-auto h-20 flex items-center px-4 justify-between">
          <img
            src="src/assets/logo_png.png"
            alt="Company"
            className="w-36 h-full py-1.5 hover:cursor-pointer"
            onClick={() => navigate("/")}
          />

          <div className="hidden md:flex w-full mx-4 relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="rounded-full w-full px-2 bg-white focus:border-green-500 focus:outline-0 focus:border-b-amber-600 focus:border-2 hover:bg-slate-100 hover:cursor-pointer"
              value={searchText}
              onChange={(e) => SetSearchText(e.target.value)}
            />
            {searchText ? (
              <MdOutlineClose
                className="absolute top-1 right-4 hover:cursor-pointer"
                onClick={() => SetSearchText("")}
              />
            ) : (
              <BiSearch className="absolute top-1 right-4 hover:cursor-pointer" />
            )}
            {suggestedProducts.length > 0 && (
              <ul className="absolute top-10 left-0 w-full bg-white shadow-lg rounded-md z-50">
                {suggestedProducts.map((product) => (
                  <li
                    key={product._id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                    onClick={() => {
                      navigate(`/product/${product._id}`);
                      SetSearchText("");
                      setSuggestedProducts([]);
                    }}
                  >
                    {product.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex gap-5  relative items-center">
            {userState && userState.user ? (
              <div className="flex items-center justify-center">
                <div
                  className="flex flex-col items-center relative gap-0.5 text-xs p-3"
                  onClick={() => navigate("/profile")}
                >
                  <p className="text-sky-900 font-semibold hover:cursor-pointer hover:underline text-start">
                    {userState.user.email}
                  </p>
                  {userState.user.address !== "" && zz
                    ? `Enviar a ${zz[0]}-${zz[1]}-${zz[3]}`
                    : ""}
                </div>
              </div>
            ) : (
              <>
                <FaUserCircle
                  size={20}
                  className="hover:text-slate-600 cursor-pointer"
                  title="Ingresar"
                  onClick={() => navigate("/login")}
                />
              </>
            )}

            <div className="relative">
              <MdOutlineStar
                size={20}
                className="hover:text-slate-600 cursor-pointer"
                title="Favoritos"
                onClick={() => navigate("/favorites")}
              />
              {favoState && favoState.favorites.length > 0 ? (
                <span
                  className="absolute -top-4 left-0 text-xs rounded-full
                h-5 w-5 text-center
                bg-red-600 text-white font-bold p-1 z-0"
                >
                  {favoState.favorites.length}
                </span>
              ) : (
                <></>
              )}
            </div>

            <div className="relative">
              <MdShoppingCart
                size={20}
                className="hover:text-slate-600 cursor-pointer z-50 relative"
                onClick={() => navigate("/cart")}
                title="Carrito"
              />
              {cartState && cartState.cart.length > 0 ? (
                <span
                  className="absolute -top-4 -right-1 text-xs rounded-full
                h-5 w-5 text-center
                bg-red-600 text-white font-bold p-1 z-0"
                >
                  {cartState.cart.length}
                </span>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

        <div className="bg-cyan-950 w-full ">
          <Container className="w-full flex justify-evenly text-white text-sm py-5 items-center">
            <div className="flex items-center px-3 border-2 border-white rounded-sm p-1 hover:bg-cyan-900 cursor-pointer">
              <Menu>
                <MenuButton className="inline-flex gap-1">
                  Seleccionar Categoría <MdArrowDropDown size={20} />
                </MenuButton>
                <MenuItems
                  anchor="bottom"
                  className="bg-cyan-950 rounded-sm w-40 md:z-50"
                >
                  {/* grid grid-cols-2 */}
                  {categoriesFetch.map((cat: CategoryProps) => (
                    <MenuItem key={cat.name}>
                      <div
                        className="grid grid-cols-2 p-1 hover:bg-cyan-800 items-center gap-16 text-sm hover:cursor-pointer"
                        onClick={() => navigate(`product?category=${cat.name}`)}
                      >
                        <a
                          href=""
                          className="text-white p-1.5 text-center hover:opacity-75 "
                        >
                          {cat.name}
                        </a>
                        <img
                          src={cat.image}
                          alt="image"
                          className="h-10 w-10 rounded-md object-cover "
                        />
                      </div>
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            </div>

            <div className="hidden md:flex gap-10 uppercase cursor-pointer">
              {categories
                .filter((cat) => !(userState?.user && cat.link === "/login"))
                .map(({ title, link }) => (
                  <h3
                    key={title}
                    className="hover:text-slate-200 hover:scale-110 transition-transform duration-150"
                    onClick={() => navigate(link)}
                  >
                    {title}
                  </h3>
                ))}
              {userState.user ? (
                <>
                  <Button
                    text="ORDENES"
                    className="text-white uppercase hover:opacity-75 hover:scale-110 transition-transform duration-150"
                    onClick={() => {
                      navigate("/orders");
                    }}
                  />

                  <Button
                    text="Salir"
                    icon={<BiExit />}
                    className="text-white uppercase p-2 bg-red-600 hover:opacity-75 hover:scale-110 transition-transform duration-150"
                    onClick={() => {
                      handleLogoutButton();
                    }}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Header;
