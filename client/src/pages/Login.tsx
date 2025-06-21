import { useState } from "react";
import Container from "../components/Container";
import Button from "../components/Button";
import { FcGoogle } from "react-icons/fc";
import loginimg from "../assets/loginimg.jpg";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { supabase } from "../supabase";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { handleSessionUser } from "../lib";
import { IoMdEye } from "react-icons/io";
import { BsEyeFill } from "react-icons/bs";
import {
  getUserCartDB,
  getUserFavoritesDB,
  syncGuestCart,
  syncGuestFavorites,
} from "../redux/thunks/userThunks";
import { updateFavo } from "../redux/slices/favoriteSlice";
import { updateCart } from "../redux/slices/cartSlice";
import { CartItem } from "../../type";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  const onSubmit = async (dataForm: any) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: dataForm?.email,
        password: dataForm?.password,
      });

      if (error) {
        toast.error(`Error: ${error.message}`);
        return;
      }

      //Id del user logueado
      console.log(data);

      //Verificar si tan ->Id del tan logueado
      if (!data.user.id) {
        toast.error("No se pudo obtener el usuario después del login.");
        return;
      }

      //Sincronizar favoritos del usuario si antes tenia
      await handleSessionUser(dispatch);
      dispatch(syncGuestFavorites(data.user.id));

      //Obtener favoritos de la bd genetal
      const responseGetUsersFavo = await dispatch(
        getUserFavoritesDB({ userId: data.user.id })
      );

      //Actualizar estado general del favo de acuerdo a la db geneal de todo y el usuario
      const responsePayload = responseGetUsersFavo.payload;
      if (responsePayload && Array.isArray(responsePayload)) {
        dispatch(updateFavo(responsePayload));
      }

      //Carrito
      //Sincronizar
      dispatch(syncGuestCart(data.user.id));

      //Obtener de ld bd los del usuario
      const responseGetUsersCart = await dispatch(getUserCartDB(data.user.id));

      const payUpdateCart = responseGetUsersCart.payload as CartItem[];
      dispatch(updateCart(payUpdateCart));

      toast.success("Inicio sesion exitoso");
      navigate("/complete-profile");
    } catch (error) {
      console.log(error);
      toast.error(`Error: ${error}`);
    }
  };

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
    } catch (error) {
      console.log(error);
      toast.error(`Error: ${error}`);
    }
  };

  return (
    <Container>
      <div className="grid grid-cols-12 w-full gap-6">
        <div
          className="bg-slate-200 w-full md:col-span-8
            rounded-md shadow-2xl shadow-slate-400 p-4 gap-4
            flex flex-col h-auto
            col-span-12 justify-center
            m-2"
        >
          <form
            action=""
            className="flex-col flex gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              placeholder="Usuario / Email"
              className="block my-2 focus:outline-0 border-b-[1px] border-gray-400 rounded-sm focus:bg-white mx-auto
            md:w-10/12 w-full
            lg:w-8/12"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <div className="flex mx-auto">
                <br />
                <p className="text-red-500 text-xs">Email requerido</p>
              </div>
            )}

            <div className="items-center justify-center flex relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                className="my-2 rounded-sm focus:outline-0 mx-auto focus:bg-white
                 border-b-[1px] border-gray-400
                md:w-10/12 w-full
                lg:w-8/12"
                {...register("password", { required: true, minLength: 8 })}
              />
              <Button
                text=""
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1.5 left-11/12 md:left-9/12 transform w-auto text-gray-400 "
                icon={
                  showPassword ? <IoMdEye size={20} /> : <BsEyeFill size={20} />
                }
              ></Button>
            </div>
            {errors.password && (
              <div className="flex mx-auto">
                <br />
                <p className="text-red-500 text-xs">Contraseña requerida</p>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <Button
                text="Iniciar sesión."
                type="submit"
                className="bg-purple-950 text-white w-8/12 mx-auto rounded-full p-2 hover:opacity-75"
              />
              <Button
                text="Continuar con google."
                className="bg-gray-200 text-slate-800 w-8/12 mx-auto rounded-full p-2 border-[1px] border-slate-400 hover:opacity-75"
                icon={<FcGoogle size={20} />}
                onClick={() => handleGoogleLogin()}
              />
            </div>
          </form>

          <div className="flex flex-row justify-center gap-8 text-sm">
            <p className="hover:underline hover:cursor-pointer">
              No tienes cuenta?
            </p>
            <Button
              text="Registrarse."
              className="p-3 bg-green-400 text-white w-auto rounded-full text-sm"
              onClick={() => navigate("/register")}
            />
          </div>
        </div>
        <div className="md:flex hidden w-full  col-span-4">
          <img
            src={loginimg}
            alt="img"
            className="object-fit w-full rounded-md"
          />
        </div>
      </div>
    </Container>
  );
};

export default Login;
