import React from "react";
import Container from "../components/Container";
import { TbCloudCancel } from "react-icons/tb";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <div className="border-[1px] border-gray-300 shadow-2xl rounded-md p-3 shadow-gray-400 flex flex-col text-center">
        <h2 className="text-red-700 uppercase underline underline-offset-2">
          Has cancelado el pago
        </h2>
        <p className="text-gray-700 flex items-center gap-2 justify-center">
          El pago ha sido cancelado
          <TbCloudCancel className="text-red-600" size={25} />
        </p>
        <div className="flex flex-col justify-center items-center gap-2 m-5">
          <Button
            text="Inicio"
            className="bg-cyan-800 text-white w-80 p-3 rounded-full text-sm hover:opacity-75"
            onClick={() => {
              navigate("/");
            }}
          />
          <Button
            text="Comprar"
            className="bg-emerald-500 text-white w-80 p-3 rounded-full text-sm hover:opacity-75"
            onClick={() => {
              navigate("/product");
            }}
          />
        </div>
      </div>
    </Container>
  );
};

export default Cancel;
