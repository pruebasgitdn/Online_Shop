import React from "react";
import Container from "./Container";
import h1 from "../assets/h1.jpg";
import h2 from "../assets/h2.jpg";
import h3 from "../assets/h3.jpg";
import { useNavigate } from "react-router-dom";

const Highligths = () => {
  const navigate = useNavigate();
  return (
    <Container className="grid grid-rows-3 md:grid-rows-2 md:grid-cols-4 justify-center items-center md:gap-1 gap-1.5 w-full max-w-full py-0">
      <div
        className="min-h-[100px]  rounded-md w-full 
      inline-flex relative text-sm
      hover:scale-90 transition-transform duration-300
      md:col-span-2
      "
      >
        <img
          src={h3}
          alt="h1"
          className="h-auto w-full rounded-md object-cover"
        />
        <div
          className="absolute top-5/12 left-1/12 
        md:left-1
        lg:top-4/12 lg:right-2/12
        flex-col flex justify-center items-center"
        >
          <h3 className="my-3 text-xl text-fuchsia-950 font-semibold">
            Nuevas ofertas a los mejores precios
          </h3>
          <p className=" text-black font-bold">Desde 50.000 COP</p>
          <button
            className="rounded-full bg-transparent p-2 duration-200 hover:cursor-pointer shadow-black shadow-2xl mt-10"
            onClick={() => {
              navigate("/product");
            }}
          >
            Más detalles.
          </button>
        </div>
      </div>

      <div
        className="min-h-[100px] rounded-md w-full inline-flex relative text-sm
       hover:scale-90 transition-transform duration-300
       md:col-span-2
      "
      >
        <img
          src={h2}
          alt="h1"
          className="h-auto w-full rounded-md object-cover"
        />
        <div
          className="absolute top-5/12 right-1/12
        md:right-1  
        lg:top-4/12 lg:right-1/12
        flex-col flex justify-center items-center"
        >
          <h3 className="my-3 text-xl text-fuchsia-950 font-semibold">
            Nuevas ofertas a los mejores precios
          </h3>
          <p className="bottom-0 relative text-black font-bold">
            Desde 50.000 COP
          </p>
          <button
            className="rounded-full bg-transparent mt-10 p-2 duration-200 hover:cursor-pointer shadow-black shadow-2xl"
            onClick={() => {
              navigate("/product");
            }}
          >
            Más detalles.
          </button>
        </div>
      </div>

      <div
        className="min-h-[100px] md:py-0 rounded-md w-full 
      inline-flex relative text-sm
      hover:scale-90 transition-transform duration-300
      md:col-span-4 -mt-26 md:-mt-6 lg:-mt-8
      "
      >
        <img
          src={h1}
          alt="h1"
          className="h-auto w-full rounded-md object-fill"
        />
        <div
          className="absolute top-3/12 right-1/12 
        lg:top-4/12 lg:right-2/12
        flex-col flex justify-center items-center"
        >
          <h3 className="my-3 text-xl text-fuchsia-950 font-semibold">
            Nuevas ofertas a los mejores precios
          </h3>
          <p className="bottom-0 relative text-black font-bold">
            Desde 50.000 COP
          </p>
          <button
            className="rounded-full bg-transparent mt-8  p-2 duration-200 hover:cursor-pointer shadow-black shadow-2xl"
            onClick={() => {
              navigate("/product");
            }}
          >
            Más detalles.
          </button>
        </div>
      </div>
    </Container>
  );
};

export default Highligths;
