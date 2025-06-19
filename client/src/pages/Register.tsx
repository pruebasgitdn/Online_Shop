import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import Button from "../components/Button";
import logint from "../assets/logint.jpg";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { supabase } from "../supabase";
import { IoMdEye } from "react-icons/io";
import { BsEyeFill } from "react-icons/bs";
import { handleSessionGoogle } from "../lib";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  type FormData = {
    email: string;
    password: string;
    confirmPassword: string;
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const onSubmit = async (dataForm: any) => {
    const { email, password } = dataForm;
    try {
      // 1. Crear cuenta
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        toast.error(`Error: ${error.message}`);
        return;
      }

      const userId = data?.user?.id;
      if (!userId) {
        toast.error("No se pudo obtener el ID del usuario.");
        return;
      }

      toast.info("Registro exitoso. Confirma el correo e inicia sesión.");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(`Error: ${error}`);
    }
  };

  useEffect(() => {
    const gg = async () => {
      const ttt = await supabase.auth.getUser();
      console.log(ttt);
    };
    gg();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: import.meta.env.VITE_CLIENT_ORIGIN + "/complete-profile",
        },
      });

      if (error) {
        toast.error(`Error: ${error.message}`);
        console.log(error.message);
        return;
      }

      await handleSessionGoogle(dispatch);
      navigate("/complete-profile");
    } catch (error) {
      console.log(error);
      toast.error(`Error: ${error}`);
    }
  };

  return (
    <Container>
      <div className="grid grid-cols-12 w-full gap-6">
        <div
          className="bg-slate-100 w-full md:col-span-8
            rounded-md shadow-2xl shadow-slate-400 p-4 gap-4
            flex flex-col h-auto
            col-span-12 md:gap-8 justify-center
            
        "
        >
          <form action="" className="" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3 md:my-7 my-4 justify-center items-center">
              <div className="w-full">
                <input
                  type="email"
                  placeholder="Correo"
                  className="block my-2 focus:outline-0 border-b-[1px] border-gray-400 rounded-sm focus:bg-white mx-auto w-full"
                  {...register("email", {
                    required: true,
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
                      El formato del email es inválido / Requerido
                    </p>
                  </div>
                )}
              </div>

              <div className="w-full relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  className="block my-2 focus:outline-0 border-b-[1px] border-gray-400 rounded-sm  focus:bg-white mx-auto w-full"
                  {...register("password", { required: true, minLength: 8 })}
                />
                {errors.password && (
                  <div className="flex">
                    <br />
                    <p className="text-red-500 text-xs">
                      Contraseña requerido (mínimo 8 caracteres)
                    </p>
                  </div>
                )}
                <Button
                  text=""
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1 left-10/12 md:left-11/12 transform w-auto text-gray-400"
                  icon={
                    showPassword ? (
                      <IoMdEye size={20} />
                    ) : (
                      <BsEyeFill size={20} />
                    )
                  }
                />
              </div>

              <div className="w-full relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirmar contraseña"
                  className="block my-2 focus:outline-0 border-b-[1px] border-gray-400 rounded-sm focus:bg-white mx-auto w-full"
                  {...register("confirmPassword", {
                    required: "Confirma tu contraseña",
                    validate: (value) =>
                      value === watch("password") ||
                      "Las contraseñas no coinciden",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    Las contraseñas no coinciden
                  </p>
                )}
                <Button
                  text=""
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1 left-10/12 md:left-11/12 transform w-auto text-gray-400"
                  icon={
                    showPassword ? (
                      <IoMdEye size={20} />
                    ) : (
                      <BsEyeFill size={20} />
                    )
                  }
                />
              </div>
            </div>

            <Button
              text="Registrarse."
              type="submit"
              className="bg-green-500 text-white w-full  mx-auto rounded-full p-4 hover:opacity-75  text-sm"
            />

            <Button
              text="Continuar con google."
              type="submit"
              className="bg-gray-200 border-[1px] border-slate-400 mt-1.5 text-slate-800 w-full  mx-auto rounded-full p-4 hover:opacity-75 text-sm"
              icon={<FcGoogle size={20} />}
              onClick={handleGoogleLogin}
            />
          </form>

          <div className="flex flex-row justify-center gap-8 text-sm items-center">
            <p className="hover:underline hover:cursor-pointer">
              Ya tienes cuenta?
            </p>
            <Button
              text="Login."
              className="p-4 bg-green-400 text-white w-auto rounded-full text-sm"
              onClick={() => navigate("/login")}
            />
          </div>
        </div>
        <div className="md:flex hidden w-full col-span-4">
          <img
            src={logint}
            alt="img"
            className="object-fit w-full rounded-md"
          />
        </div>
      </div>
    </Container>
  );
};

export default Register;
