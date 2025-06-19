import React from "react";
import Container from "./Container";
import { FaTruck, FaMedal, FaTshirt } from "react-icons/fa";

const FooterTop = () => {
  return (
    <div className="rounded-sm bg-slate-300 text-gray-900">
      <h1 className="p-3 text-center md:text-3xl text-2xl ">
        Nuestro negocio es construido en base a la atencion con nuestros
        clientes.
      </h1>
      <Container
        className=" 
        flex flex-col  md:flex-row 
        justify-evenly items-center
       gap-5 my-2"
      >
        <div className="flex flex-col items-center justify-center px-2">
          <FaTruck className="size-8 md:size-12" />
          <h4>Envío gratis</h4>
          <p className="text-sm text-center">
            En realidad no es gratis, solo lo incluimos en el precio
          </p>
        </div>
        <div className="flex flex-col items-center justify-center px-2">
          <FaMedal className="size-8 md:size-12" />
          <h4 className="">2 años de garantía</h4>
          <p className="text-sm  text-center">
            Pero no lo envíes aquí. Si se rompe en los primeros dos años. lo
            reemplazaremos.
          </p>
          <hr />
          <p className="text-sm text-center">Después, tú decides.</p>
        </div>
        <div className="flex flex-col items-center justify-center px-2">
          <FaTshirt className="size-8 md:size-12" />
          <h4 className="">Cambios</h4>
          <p className="text-sm text-center">
            Si no te gusta, cámbialo a un amigo por algo suyo.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default FooterTop;
