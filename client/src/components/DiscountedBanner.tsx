import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "./Container";
import Title from "./Title";
import Subtitle from "./Subtitle";
import discountb from "../assets/discountb.jpg";
import dell from "../assets/dell-computer.svg";
import jbl from "../assets/jbl.svg";
import panasonic from "../assets/panasonic.svg";
import lg from "../assets/lg.svg";
import philips from "../assets/philips.svg";
import lenovo from "../assets/lenovo.svg";
import Limiter from "./Limiter";

const DiscountedBanner = () => {
  const navigate = useNavigate();
  const popularSearchItems = [
    {
      name: "Auriculares",
      link: `product?category=Auriculares`,
    },
    { name: "Cámaras y Fotos", link: `product?category=Cámara y Fotos` },
    { name: "Relojes Deportivos", link: `product?category=Relojes Deportivos` },
    { name: "Tablets", link: `product?category=Tablets` },
    { name: "Televisión", link: `product?category=Televisión` },
    {
      name: "Herramientas Elétricas",
      link: `product?category=Herramientas Eléctricas`,
    },
  ];

  return (
    <Container className="w-full py-0 ">
      <Title titulo="Descuentos" />
      <Limiter />
      <div className="flex flex-col justify-center gap-2">
        <div
          className="flex-wrap
          justify-center items-center flex gap-2
        "
        >
          {popularSearchItems.map(({ name, link }) => (
            <Link to={link} key={name}>
              <button
                className="
              w-32
              md:w-36
              rounded-full p-1.5 text-black border-1 border-black bg-slate-200 hover:bg-slate-300 duration-150 text-sm
              hover:cursor-pointer
              "
              >
                {name}
              </button>
            </Link>
          ))}
        </div>
        <div className="w-full h-70 relative hidden md:flex">
          <div
            className="
          grid grid-rows-2
          absolute right-1/12 top-2/4  items-center"
          >
            <div className="flex flex-row gap-2 items-center">
              <p className="text-white hover:text-indigo-950 font-semibold text-4xl hover:cursor-pointer">
                Auriculares Sony
              </p>
              <button
                className="rounded-full border-4 border-red-600 text-red-500 font-bold p-2 hover:bg-white duration-300 text-3xl hover:cursor-pointer"
                onClick={() => {
                  navigate("/product");
                }}
              >
                Descuento del 20 %
              </button>
            </div>

            <div>
              <h2 className="text-center  text-gray-800 cursive">
                Estás afuera jugando o saliendo a hacer algo.
              </h2>
            </div>
          </div>

          <img
            src={discountb}
            alt=""
            className="w-full rounded-md h-full object-fill"
          />
        </div>

        <div>
          <Subtitle subtitulo="Marcas que distribuimos." />
          <Limiter />
          <div
            className="grid grid-cols-2 
            md:flex
            md:items-center
            lg:items-center
            md:grid-cols-4 
            lg:grid-cols-6
            border-[2px] border-slate-800
            rounded-md
            "
          >
            <img src={dell} alt="" className="w-12 h-12 flex mx-auto" />
            <img src={jbl} alt="" className="w-12 h-12 flex mx-auto " />
            <img
              src={panasonic}
              alt=""
              className="w-12 h-12 md:flex lg:flex mx-auto hidden 
              lg:w-20 lg:h-20 md:w-16 md:h-16"
            />
            <img
              src={lg}
              alt=""
              className="w-12 h-12 md:flex lg:flex mx-auto hidden 
              lg:w-20 lg:h-20 md:w-16 md:h-16"
            />
            <img
              src={philips}
              alt=""
              className="w-12 h-12 md:flex lg:flex mx-auto md:col-span-2 lg:col-span-1 hidden lg:w-20 lg:h-20 md:w-16 md:h-16"
            />
            <img
              src={lenovo}
              alt=""
              className="w-12 h-12 md:flex lg:flex mx-auto md:col-span-2 lg:col-span-1 hidden lg:w-20 lg:h-20 md:w-16 md:h-16"
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default DiscountedBanner;
