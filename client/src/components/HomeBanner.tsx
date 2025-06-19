import React from "react";
import Container from "./Container";
import homeBanner from "../assets/homebanner.jpg";
import { useNavigate } from "react-router-dom";

const HomeBanner = () => {
  const navigate = useNavigate();
  return (
    <Container className="relative overflow-hidden w-full md:pb-0">
      <div className="relative">
        <img
          className="object-cover h-full w-full rounded-md"
          src={homeBanner}
          srcSet={homeBanner}
          alt="img"
        />
      </div>

      <div
        className="absolute md:top-5/12 md:ml-5 ml-2 top-5/12 gap-3 flex flex-col
      lg:top-7/12
      right-0/12 text-center
      "
      >
        <h2 className=" font-extrabold text-2xl md:text-6xl text-stone-100 shadow-black bg-cyan-20 bg-opacity-20 shadow-lg ">
          Auriculares XLR8
        </h2>
        <p className="font-semibold text-sm md:text-2xl text-stone-100">
          ¡Siente el sonido como nunca antes!
        </p>
        <p className="font-semibold text-sm md:text-1xl text-slate-800">
          Descubre nuestros audífonos de alta calidad con un diseño cómodo y un
          sonido envolvente
        </p>
        <button
          className="mx-auto rounded-full text-stone-100 bg-black text-sm text-center p-1.5 hover:text-black hover:bg-stone-100 md:w-50 w-40 duration-300
          hover:cursor-pointer
          "
          onClick={() => navigate("/product")}
        >
          Empezar a comprar
        </button>
      </div>
    </Container>
  );
};

export default HomeBanner;
