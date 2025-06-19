import React from "react";

const AddressForm = () => {
  return (
    <div className="flex flex-wrap gap-2 w-full border-[1px] border-dashed border-slate-400 rounded-md p-5 justify-center items-center">
      <h4 className="text-xs text-slate-500 block w-full text-center">
        Agregar direccion
      </h4>

      <div className="flex-col flex -mt-8">
        <label htmlFor="via" className="text-xs text-black">
          Departamento:
        </label>
        <select
          name="via"
          id=""
          className=" bg-white p-1 h-min  rounded-md focus:outline-0 text-xs"
        >
          <option value="">Calle</option>
          <option value="">Carrera</option>
          <option value="">Transversal</option>
          <option value="">Diagonal</option>
          <option value="">Avenida</option>
        </select>
      </div>
      <div className="flex-col flex -mt-8">
        <label htmlFor="via" className="text-xs text-black">
          Ciudad:
        </label>
        <select
          name="via"
          id=""
          className=" bg-white p-1 h-min  rounded-md focus:outline-0 text-xs"
        >
          <option value="">Calle</option>
          <option value="">Carrera</option>
          <option value="">Transversal</option>
          <option value="">Diagonal</option>
          <option value="">Avenida</option>
        </select>
      </div>

      <div className="flex-col flex">
        <input
          type="text"
          className="w-min  my-2 rounded-md bg-white p-1 focus:outline-0 text-sm"
          placeholder="..."
        />
        <p className="text-xs">Barrio</p>
      </div>
      <div className="flex-col flex">
        <input
          type="text"
          className="w-min  my-2 rounded-md bg-white p-1 focus:outline-0 text-sm"
          placeholder="..."
        />
        <p className="text-xs">Dirección Principal</p>
      </div>
      <div className="flex-col flex">
        <input
          type="text"
          className="w-min  my-2 rounded-md bg-white p-1 focus:outline-0 text-sm"
          placeholder="..."
        />
        <p className="text-xs">Complemento de dirección</p>
      </div>

      <div className="flex-col flex">
        <input
          type="text"
          className="w-min  my-2 rounded-md bg-white p-1 focus:outline-0 text-sm"
          placeholder="..."
        />
        <p className="text-xs">Código Postal</p>
      </div>
    </div>
  );
};

export default AddressForm;
