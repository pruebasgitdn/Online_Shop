import React, { useEffect, useState } from "react";
import {
  CartItem,
  DepartmentProp,
  FormAddressData,
  ProductProps,
} from "../../type";
import { loadStripe } from "@stripe/stripe-js";
import { config } from "../../config";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import Button from "./Button";
import { MdDone } from "react-icons/md";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { handleEditAddressUser } from "../lib";
import { useNavigate } from "react-router-dom";

type Props = {
  items: ProductProps[];
  cartExtra: CartItem[];
};

const PaymenButton = ({ items, cartExtra }: Props) => {
  const userState = useSelector((state: RootState) => state.user);
  const user = userState.user;
  console.log(user);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm();

  const publicKey =
    "pk_test_51RYEiOQpKrRxrAIZBkUxlZ3cCjfKKTDCMKZ0LA100DNQepzCXaJW6XuJHr2odlEixXYfx3TzVViM1Pj0kvG3Lw3200Pkm6jQRA";

  const stripePromise = loadStripe(publicKey);

  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;

      const endpoint = `${config?.baseUrl}/api/checkout/activos`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item: items,
          cartExtra: cartExtra,
        }),
      });

      const { id } = await response.json();

      if (stripe != null) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: id,
        });
        if (error) {
          console.log("Error en Stripe Checkout:", error.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const colombiaData: DepartmentProp = {
    Antioquia: ["Medellín", "Bello", "Envigado", "Itagüí", "Rionegro"],
    "Bogotá D.C.": ["Usaquén", "Suba", "Chapinero", "Kennedy", "Engativá"],
    "Valle del Cauca": ["Cali", "Palmira", "Buenaventura", "Tuluá", "Yumbo"],
    Cundinamarca: ["Soacha", "Chía", "Fusagasugá", "Zipaquirá", "Girardot"],
    Atlántico: [
      "Barranquilla",
      "Soledad",
      "Malambo",
      "Puerto Colombia",
      "Sabanagrande",
    ],
  };
  const departments = Object.keys(colombiaData);
  const watchedDepartment = watch("departamento"); //ATENTO AL CAMBIO CON EL OPTION
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  //SETEAR EL DEPARTAMENTO
  useEffect(() => {
    if (watchedDepartment !== selectedDepartment) {
      setSelectedDepartment(watchedDepartment);
    }
  }, [watchedDepartment, selectedDepartment]);

  const handleAddressForm = async (dataForm: FormAddressData) => {
    try {
      const {
        ciudad,
        barrio,
        direccion,
        complemento,
        codigo,
        referencias,
        departamento,
      } = dataForm;

      const dataObject: FormAddressData = {
        ciudad: ciudad,
        departamento: departamento,
        barrio: barrio,
        direccion: direccion,
        complemento: complemento,
        codigo: codigo,
        referencias: referencias,
      };

      const direccionCompleta = [
        dataObject.departamento,
        dataObject.ciudad,
        dataObject.barrio,
        dataObject.direccion,
        dataObject.complemento,
        dataObject.codigo,
        dataObject.referencias,
      ]
        .filter(Boolean) //Remover vacios o null
        .join(" - ");

      Swal.fire({
        text: "¿Quieres confirmar los cambios?",
        confirmButtonText: "Confirmar",
        confirmButtonColor: "green",
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await handleEditAddressUser({
            values: direccionCompleta,
            dispatch: dispatch,
            userId: user?.id,
          });
          Swal.fire({
            icon: "success",
            text: "Cambios confirmados y guardados",
          });
          navigate("/profile");
        } else if (result.isDenied || result.isDismissed) {
          console.log("Cancelado");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button
        className="w-full p-2 rounded-md text-center text-white bg-indigo-600 uppercase hover:cursor-pointer hover:opacity-75
      disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-black
      "
        onClick={handlePayment}
        disabled={
          user == null ||
          user == undefined ||
          user.address == null ||
          user.address == undefined
        }
      >
        PAGAR
      </button>

      {/* usuario verificacion */}
      {user == null || user == undefined ? (
        <div className="flex flex-col">
          <p className="text-red-600 text-sm">
            Ingrese a su cuenta. Para poder proceder al pago y la compra.
          </p>
          <div className="flex gap-2 text-sm">
            <p className="text-slate-800 underline underline-offset-2 ">
              No tiene cuenta?
            </p>
            <p className="text-emerald-700 hover:text-emerald-900 hover:cursor-pointer ">
              Registrarse
            </p>
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* direccion address verificacion */}
      {(user && user.address == null) ||
      user?.address == undefined ||
      user.address == "" ? (
        <div>
          <p className="text-xs text-red-500">
            Ingresa tu direccion para coordinar el envío del producto
          </p>
          <div className="flex flex-wrap gap-.5 w-full">
            <form
              action=""
              id="addressform"
              name="addressform"
              className="w-full"
              onSubmit={handleSubmit(handleAddressForm)}
            >
              <div className="flex flex-row w-full gap-2">
                <div className="flex flex-col w-full">
                  <select
                    id="departamento"
                    className=" rounded-md bg-white p-1 focus:outline-0 text-sm w-full"
                    {...register("departamento", { required: true })}
                  >
                    <option value="">Seleccione un departamento</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="departamento" className="text-black text-xs">
                    Departamento
                  </label>
                </div>
                <div className="flex flex-col w-full">
                  <select
                    id="ciudad"
                    className=" rounded-md bg-white p-1 focus:outline-0 text-sm w-full"
                    {...register("ciudad", { required: true })}
                  >
                    <option value="">Seleccione una ciudad</option>
                    {/* DE ACUERDO AL DEPART. SELECCIONADO */}
                    {selectedDepartment &&
                      colombiaData[selectedDepartment].map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                  </select>

                  <label htmlFor="ciudad" className="text-black text-xs">
                    Ciudad
                  </label>
                </div>
              </div>

              <div className="flex flex-row w-full gap-2">
                <div className="flex flex-col w-full">
                  <input
                    type="text"
                    className=" w-full mx-auto my-2 rounded-md bg-white p-1 focus:outline-0 text-sm"
                    {...register("barrio", {
                      required: true,
                      maxLength: 20,
                      minLength: 3,
                    })}
                  />
                  <label htmlFor="txt" className="text-black text-xs">
                    Barrio.
                  </label>
                  {errors.barrio && (
                    <div className="flex">
                      <br />
                      <p className="text-red-500 text-xs">
                        Minimo 3 caracteres , Maximo 20 caracteres
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <input
                    type="text"
                    className=" w-full mx-auto my-2 rounded-md bg-white p-1 focus:outline-0 text-sm"
                    placeholder="Ejm: Carrera 15 # 93-60"
                    {...register("direccion", {
                      required: true,
                      maxLength: 40,
                      minLength: 3,
                    })}
                  />
                  <label htmlFor="txt" className="text-black text-xs">
                    Direccion
                  </label>
                  {errors.direccion && (
                    <div className="flex">
                      <br />
                      <p className="text-red-500 text-xs">
                        Minimo 3 caracteres , Maximo 40 caracteres
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-row w-full gap-2">
                <div className="flex flex-col w-full">
                  <input
                    type="text"
                    className=" w-full mx-auto my-2 rounded-md bg-white p-1 focus:outline-0 text-sm"
                    {...register("complemento", {
                      maxLength: 25,
                      minLength: 3,
                    })}
                  />
                  <label htmlFor="txt" className="text-black text-xs">
                    Complemento de dirección. (Opcional)
                  </label>
                  {errors.complemento && (
                    <div className="flex">
                      <br />
                      <p className="text-red-500 text-xs">
                        Minimo 3 caracteres , Maximo 25 caracteres
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <input
                    type="text"
                    className=" w-full mx-auto my-2 rounded-md bg-white p-1 focus:outline-0 text-sm"
                    {...register("codigo", {
                      maxLength: 20,
                      minLength: 3,
                      required: true,
                    })}
                  />
                  <label htmlFor="txt" className="text-black text-xs">
                    Código Postal
                  </label>
                  {errors.codigo && (
                    <div className="flex">
                      <br />
                      <p className="text-red-500 text-xs">
                        Requerido. Minimo 3 caracteres , Maximo 20 caracteres
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col w-full my-4">
                <textarea
                  placeholder="Ingresa Detalles Adicionales"
                  id=""
                  className="bg-white rounded-md text-sm"
                  {...register("referencias", {
                    maxLength: 60,
                  })}
                />
                <label htmlFor="txt" className="text-black text-xs">
                  Referencias Adicionales. (Opcional)
                </label>
                {errors.referencias && (
                  <div className="flex">
                    <br />
                    <p className="text-red-500 text-xs">Maximo 60 caracteres</p>
                  </div>
                )}
              </div>
              <Button
                text="confirmar cambios"
                className="w-full bg-emerald-600 text-black uppercase "
                type="submit"
                icon={<MdDone size={20} />}
              />
            </form>
          </div>
        </div>
      ) : (
        <> </>
      )}
    </>
  );
};

export default PaymenButton;
