import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { supabase } from "../supabase";
import Button from "../components/Button";
import { Controller, useForm } from "react-hook-form";
import Subtitle from "../components/Subtitle";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { handleSessionGoogle, handleUpdateUser } from "../lib";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Loading from "../components/Loading";

const CompleteProfile = () => {
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [newUser, setNewUser] = useState<boolean | undefined>(undefined);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const userId = userState.user?.id;

  useEffect(() => {
    const initSessionFromGoogle = async () => {
      await handleSessionGoogle(dispatch);

      const { data: existingUser, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        throw error;
      }
      console.log(existingUser);
      setNewUser(!existingUser);
    };
    initSessionFromGoogle();
  }, [dispatch, userId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: existingUser, error } = await supabase
          .from("users")
          .select("")
          .eq("id", userId)
          .maybeSingle();

        if (error) {
          console.log(error.message);
        } else if (
          !existingUser ||
          existingUser == null ||
          existingUser == undefined
        ) {
          setNewUser(true);
        } else if (existingUser) {
          setNewUser(false);
        } else {
          console.log(existingUser);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();

    console.log(userId);
  }, [userId, dispatch]);

  const onSubmit = async (formValues: any) => {
    if (!userId) return;

    try {
      // Registrar en la tabla users
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: userId,
          email: userState.user?.email,
          firstName: formValues.name,
          lastName: formValues.lastName,
          phone: formValues.phone,
        },
      ]);

      if (insertError) {
        toast.error(
          `Error al guardar el usuario en la base de datos ${insertError.message}.`
        );
        return;
      } else {
        toast.success("Perfil completado.");
        setNewUser(false); // Cambia a user viejo luego de insertar
        await handleUpdateUser(dispatch);
      }
    } catch (error) {
      console.error("Error general al insertar:", error);
    } finally {
      console.log(formValues);
    }
  };

  return (
    <Container>
      {newUser === undefined ? (
        // <p>Cargando...</p>
        <Loading />
      ) : newUser ? (
        <div className="bg-gray-200 shadow-slate-400 shadow-2xl rounded-md w-8/12 md:w-6/12 mx-auto">
          <Subtitle subtitulo="Completa tu perfil" />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-2 justify-center items-center flex-col md:flex-row">
              <div className="flex-col w-full p-2 block">
                <input
                  type="text"
                  className="w-full  my-2 rounded-md bg-white p-1 focus:outline-0 text-sm"
                  placeholder="Nombre"
                  {...register("name", { required: true, minLength: 4 })}
                />
                {errors.name && (
                  <div className="flex">
                    <br />
                    <p className="text-red-500 text-xs">
                      Campo requerido. minimo 4 caracteres
                    </p>
                  </div>
                )}
              </div>

              <div className="flex-col w-full block p-2 ">
                <input
                  type="text"
                  className="w-full  my-2 rounded-md bg-white p-1 focus:outline-0 text-sm"
                  placeholder="Apellido"
                  {...register("lastName", { required: true, minLength: 3 })}
                />
                {errors.lastName && (
                  <div className="flex">
                    <br />
                    <p className="text-red-500 text-xs">
                      Campo requerido. minimo 3 caracteres
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 justify-center items-center flex-col w-full">
              <div className="flex-col w-full block p-2 ">
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: true, maxLength: 20 }}
                  render={({ field: { onChange, value } }) => (
                    <PhoneInput
                      country={"co"}
                      value={value}
                      onChange={onChange}
                      inputStyle={{ width: "100%" }}
                    />
                  )}
                ></Controller>
                {errors.phone && (
                  <div className="flex">
                    <br />
                    <p className="text-red-500 text-xs">
                      Campo requerido. maximo 20 caracteres
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-5 justify-center p-2">
              <Button
                type="submit"
                text="Completar"
                className="bg-green-600 text-white p-4 w-auto hover:opacity-75   rounded-md"
              />
            </div>
          </form>
        </div>
      ) : (
        <>{navigate("/")}</>
      )}
    </Container>
  );
};

export default CompleteProfile;
