import { useEffect, useState } from "react";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import Subtitle from "../components/Subtitle";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import {
  handleEditAddressUser,
  handleEditUserInfo,
  handleLogout,
} from "../lib";
import { MdClose, MdDone, MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { DepartmentProp, FormAddressData, FormData } from "../../type";
import Swal from "sweetalert2";
import { supabase } from "../supabase";

const Profile = () => {
  const stateUser = useSelector((state: RootState) => state.user);
  const currentUser = stateUser.user;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteOwnImage, setDeleteOwnImage] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm();

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

  //CARGAR DATOS DEL FORMULARIO
  useEffect(() => {
    if (currentUser) {
      setValue("firstName", currentUser.firstName || "");
      setValue("lastName", currentUser.lastName || "");
      setValue("email", currentUser.email || "");
      setValue("phone", currentUser.phone || "");
    }
  }, [currentUser, setValue]);

  useEffect(() => {
    console.log(currentUser?.id);
    const reFetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", currentUser?.id);
        if (error) {
          console.log(error.message);
        } else {
          console.log(data[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    reFetchUser();
  }, [currentUser]);

  const handleLogButton = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error.message;
        return;
      }
      await handleLogout(dispatch);

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditForm = async (dataForm: FormData) => {
    try {
      setLoading(true);

      // const fieldsToUpdate: Partial<FormData> = {};
      // if (dataForm.firstName !== currentUser?.firstName)
      //   fieldsToUpdate.firstName = dataForm.firstName;
      // if (dataForm.lastName !== currentUser?.lastName)
      //   fieldsToUpdate.lastName = dataForm.lastName;
      // if (dataForm.email !== currentUser?.email)
      //   fieldsToUpdate.email = dataForm.email;
      // if (dataForm.phone !== currentUser?.phone)
      //   fieldsToUpdate.phone = dataForm.phone;
      // if (dataForm.avatar !== currentUser?.avatar)
      //   fieldsToUpdate.avatar = dataForm.avatar;

      // if (Object.keys(fieldsToUpdate).length === 0 && !deleteOwnImage) {
      //   return;
      // }
      console.log(dataForm);
      Swal.fire({
        text: "¿Quieres confirmar los cambios?",
        confirmButtonText: "Confirmar",
        confirmButtonColor: "green",
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await handleEditUserInfo({
            values: dataForm,
            deleteOwnImage,
            userId: currentUser?.id,
            dispatch,
          });

          Swal.fire({
            icon: "success",
            text: "Cambios confirmados y guardados",
          });
          // reset();
          setDeleteOwnImage(false);
          navigate("/profile");
        } else if (result.isDenied || result.isDismissed) {
          console.log("cancelado");
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
            userId: currentUser?.id,
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
    <Container className="bg-cyan-950 shadow-2xl shadow-cyan-800 rounded-md flex flex-col py-5 justify-center items-center my-6 w-11/12 md:w-8/12 lg:w-6/12 text-white">
      <Subtitle subtitulo="Información personal" className="text-white" />
      {currentUser && currentUser.firstName ? (
        <>
          <p className="mx-auto flex gap-5 items-center">
            {currentUser?.firstName} {currentUser?.lastName}
            <FaUser size={20} className="text-white" />
          </p>
        </>
      ) : (
        <></>
      )}
      {currentUser && currentUser.email ? (
        <>
          <p className="mx-auto flex gap-5 items-center">
            {currentUser?.email}
            <MdOutlineMail size={20} className="text-white" />
          </p>
        </>
      ) : (
        <></>
      )}
      {currentUser && currentUser.address ? (
        <>
          <p className="mx-auto text-green-400 text-xs flex gap-2 items-center py-2">
            <span className="text-white">Direccion actual:</span>
            {currentUser?.address}
          </p>
        </>
      ) : (
        <></>
      )}

      {/* EDIT FORM */}
      {showEditForm ? (
        <div
          className="shadow-2xl shadow-slate-800 flex flex-col py-5 text-blue-950 border-[1px] border-dashed border-white p-5 rounded-md mt-5 relative m-1.5 md:m-0 
        w-10/12
        "
        >
          <form action="" onSubmit={handleSubmit(handleEditForm)}>
            <MdClose
              size={20}
              className="absolute top-1 hover:cursor-pointer text-white left-11/12"
              onClick={() => setShowEditForm(!showEditForm)}
            />
            <p className="text-white italic">Editar Información personal.</p>

            {/* NOMBRES */}
            <div className="flex flex-row w-full gap-2">
              <div className="flex flex-col w-full">
                <input
                  type="text"
                  className="w-full  my-2 rounded-md bg-white p-1 focus:outline-0 text-sm placeholder:text-slate-700"
                  placeholder={currentUser?.firstName}
                  {...register("firstName", { minLength: 4 })}
                />
                {errors.firstName && (
                  <div className="flex">
                    <br />
                    <p className="text-red-500 text-xs">Mínimo 4 caracteres</p>
                  </div>
                )}
                <label htmlFor="ee" className="text-white text-xs">
                  Primer Nombre
                </label>
              </div>
              <div className="flex flex-col w-full">
                <input
                  type="text"
                  className="w-full  my-2 rounded-md bg-white p-1 focus:outline-0 text-sm placeholder:text-slate-700"
                  placeholder={currentUser?.lastName}
                  {...register("lastName", { minLength: 3 })}
                />
                {errors.lastName && (
                  <div className="flex">
                    <br />
                    <p className="text-red-500 text-xs">Mínimo 3 caracteres</p>
                  </div>
                )}
                <label htmlFor="last" className="text-white text-xs">
                  Segundo Nombre
                </label>
              </div>
            </div>

            {/* EMAIL PHONE */}
            <div className="flex flex-row w-full gap-2">
              <div className="flex flex-col w-full">
                <input
                  type="text"
                  className="w-full  my-2 rounded-md bg-white p-1 focus:outline-0 text-sm placeholder:text-slate-700"
                  placeholder={currentUser?.email}
                  {...register("email", {
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "El formato del email es inválido",
                    },
                  })}
                />
                {errors.email && (
                  <div className="flex">
                    <br />

                    <p className="text-red-500 text-xs">
                      El formato del email es inválido
                    </p>
                  </div>
                )}
                <label htmlFor="ee" className="text-white text-xs">
                  Email
                </label>
              </div>
              <div className="flex flex-col w-full">
                <input
                  type="text"
                  className="w-full  my-2 rounded-md bg-white p-1 focus:outline-0 text-sm placeholder:text-slate-700"
                  placeholder={currentUser?.phone}
                  {...register("phone", { maxLength: 20 })}
                />
                {errors.phone && (
                  <div className="flex">
                    <br />
                    <p className="text-red-500 text-xs">Maximo 20 caracteres</p>
                  </div>
                )}
                <label htmlFor="ee" className="text-white text-xs">
                  Télefono
                </label>
              </div>
            </div>

            <Button
              text="guardar cambios"
              className="w-full bg-emerald-600 text-white uppercase "
              type="submit"
              loading={loading}
              icon={<MdDone size={20} />}
            />
          </form>
        </div>
      ) : (
        <></>
      )}

      {/* EDIT ADRRESS FORM */}
      {showAddressForm ? (
        <div
          className="shadow-2xl shadow-slate-800 flexflex-col flex-wrap py-5 text-blue-950 border-[1px] border-dashed border-white p-5 rounded-md mt-5 relative m-1.5 
        w-10/12
        "
        >
          <MdClose
            size={20}
            className="absolute top-1 hover:cursor-pointer text-white left-11/12"
            onClick={() => setShowAddressForm(!showAddressForm)}
          />
          <p className="text-white italic">Editar Dirección personal.</p>
          {currentUser ? (
            <>
              <p className="text-green-400 text-xs py-2">
                <span className="text-white">Actual:</span>{" "}
                {currentUser.address}
              </p>
            </>
          ) : (
            <></>
          )}
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
                  <label htmlFor="departamento" className="text-white text-xs">
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

                  <label htmlFor="ciudad" className="text-white text-xs">
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
                  <label htmlFor="txt" className="text-white text-xs">
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
                  <label htmlFor="txt" className="text-white text-xs">
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
                  <label htmlFor="txt" className="text-white text-xs">
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
                  <label htmlFor="txt" className="text-white text-xs">
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
                <label htmlFor="txt" className="text-white text-xs">
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
                className="w-full bg-emerald-600 text-white uppercase "
                type="submit"
                icon={<MdDone size={20} />}
              />
            </form>
          </div>
        </div>
      ) : (
        <></>
      )}

      <div className="flex flex-row justify-between mt-4 w-full">
        <Button
          text={showEditForm ? "Cancelar" : "Editar Perfil"}
          className="bg-cyan-700 text-white rounded-md p-3 w-full mx-3 text-sm hover:opacity-75"
          icon={<CiEdit size={18} className="text-white" />}
          onClick={() => setShowEditForm(!showEditForm)}
        />
        <Button
          text={showAddressForm ? "Cancelar" : "Editar Dirección"}
          className="bg-green-700 text-white rounded-md p-3 w-full overflow-hidden mx-3 text-sm hover:opacity-75"
          icon={<CiEdit size={18} className="text-white" />}
          onClick={() => setShowAddressForm(!showAddressForm)}
        />
      </div>
      <div className="w-full py-2 flex justify-center items-center">
        <Button
          text="Cerrar Sesion"
          className="bg-red-600 text-white rounded-md p-3 w-12/12 overflow-hidden mx-3 text-sm hover:opacity-75 uppercase"
          onClick={() => {
            handleLogButton();
          }}
          icon={<IoMdClose size={18} className="text-white" />}
        />
      </div>
    </Container>
  );
};

export default Profile;
