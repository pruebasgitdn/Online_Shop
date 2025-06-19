import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import { FaArrowLeft, FaArrowRight, FaBlog } from "react-icons/fa";
import { CiSaveDown2 } from "react-icons/ci";
import { AiFillProduct } from "react-icons/ai";
import { SiBookstack } from "react-icons/si";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const NotFound = () => {
  const path = useLocation(); // path
  const [namePath, setNamePath] = useState("");

  useEffect(() => {
    const name_path = path.pathname.replace("/", "").trim();
    console.log(name_path);
    setNamePath(name_path);
  }, [path.pathname]);

  const links = [
    {
      title: "Comprar",
      link: "/product",
      description: "Máxima coleccion de productos.",
      icon: <SiBookstack className="size-8" />,
    },
    {
      title: "Cuenta",
      link: "/profile",
      description: "Encuentra tú información aquí",
      icon: <CiSaveDown2 className="size-8" />,
    },
    {
      title: "Producto",
      link: "/product",
      description: "Aquí vas a encontrar todos los productos disponibles",
      icon: <AiFillProduct className="size-8" />,
    },
    {
      title: "Blog",
      link: "/",
      description: "Lee nuestras últimas noticias del mercado",
      icon: <FaBlog className="size-8" />,
    },
  ];

  const navigate = useNavigate();

  return (
    <Container className="flex flex-col items-center">
      <h1 className="text-red-700 font-bold text-3xl md:text-5xl">404</h1>
      <p className="text-black text-center font-mono">
        <span className="text-red-600 text-2xl underline">{namePath}</span> No
        existe. Con gusto otros sitios de interés.
      </p>
      <br />
      <div className="bg-gray-300 rounded-md w-1xl md:w-3xl text-center p-2 mx-2 gap-10 flex-col flex">
        {links.map((link) => (
          <div
            className="border-2 p-2 bg-white border-slate-500 rounded-md hover:cursor-pointer hover:opacity-80"
            onClick={() => navigate(link.link)}
          >
            <p className="flex justify-between items-center">
              <span className="flex flex-col items-center">
                <span className="text-blue-600">{link.title}</span>{" "}
                <span className="text-blue-800">{link.icon}</span>
              </span>
              <span>{link.description}</span>
              <span>
                <FaArrowRight />
              </span>
            </p>
          </div>
        ))}
      </div>
      <button
        className="rounded-4xl p-2 bg-cyan-700 text-white font-semibold text-center m-2 w-2/4 mx-auto flex items-center justify-center gap-3 hover:cursor-pointer hover:opacity-75"
        onClick={() => navigate("/")}
      >
        <span>
          {" "}
          <FaArrowLeft />
        </span>
        Empezar a comprar
      </button>
    </Container>
  );
};

export default NotFound;
