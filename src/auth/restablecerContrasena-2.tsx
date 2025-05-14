import { SubmitHandler, useForm } from "react-hook-form";
import { ButtonPrimary } from "../componentes/formularios/ButtonPrimary";
import InputErrors from "../componentes/formularios/InputErrors";
import { InputLabel } from "../componentes/formularios/InputLabel";
import TextInput from "../componentes/formularios/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useSearchParams } from "react-router-dom";
import { restablecerContrasenaSchema2 } from "../validaciones/restablecerContrasenaSchema";
import { useEffect } from "react";

type Inputs = {
  email: string;
  password: string;
  password_confirmation: string;
};

const RestablecerContrasena2 = () => {

  // Obtener los parámetros de búsqueda de la URL
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Inputs>({ 
    resolver: zodResolver(restablecerContrasenaSchema2),
    defaultValues: {
      email: email || "" // Establecer el valor predeterminado del email 
    }
  });



  const url = `${import.meta.env.VITE_API_URL}/auth/restablecer-contrasena-token`;

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!token) {
      toast.error("Token inválido o faltante.");
      return;
    }

    try {
      const response = await toast.promise(
        axios.post(
          url,
          { ...data, token },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            timeout: 10000,
          }
        ),
        {
          pending: "Cambiando contraseña...",
          success: "¡Tu contraseña ha sido restablecida con éxito!",
          error: {
            render({ data: error }) {
              if (axios.isAxiosError(error)) {
                if (error.code === "ECONNABORTED") {
                  return "Tiempo de espera agotado. Intente nuevamente";
                }
                if (error.response) {
                  switch (error.response.status) {
                    case 400:
                      return "Datos inválidos";
                    case 401:
                      return "Token inválido o expirado";
                    case 422:
                      return error.response.data?.message || "Datos inválidos. Verifica el formulario";
                    case 500:
                      return "Error en el servidor";
                    default:
                      return error.response.data?.message || "Error al restablecer la contraseña";
                  }
                }
                if (error.request) {
                  return "No se recibió respuesta del servidor";
                }
              }
              return "Error al restablecer la contraseña";
            },
          },
        }
      );

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      
      reset();

    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
    }
  };

  return (
    <form
      className="flex flex-col items-center justify-center h-screen"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex bg-white flex-col gap-4 px-8 py-4 w-[500px] min-h-[550px] shadow-lg justify-center relative rounded-3xl animacion-entrada">
        <div className="flex flex-col gap-2 w-full">
          <h3 className="font-bold text-2xl">Restablecer contraseña</h3>
          <h3>
            ¡Perfecto! <span className="text-yellow-500 font-bold">Ingresa</span> tu nueva 
            contraseña para <span className="text-green-600 font-bold">{email}</span>
          </h3>
        </div>
        <div className="">
          <InputLabel htmlFor="password" value="Nueva contraseña" />
          <TextInput
            id="password"
            type="password"
            placeholder="Ingresa tu nueva contraseña..."
            {...register("password")}
          />
          <InputErrors errors={errors} name="password" />
        </div>

        <div className="">
          <InputLabel htmlFor="password_confirmation" value="Confirmar contraseña" />
          <TextInput
            id="password_confirmation"
            type="password"
            placeholder="Confirma tu nueva contraseña..."
            {...register("password_confirmation")}
          />
          <InputErrors errors={errors} name="password_confirmation" />
        </div>

        <div className="">
          <ButtonPrimary
            className="w-full"
            value={isSubmitting ? "Procesando..." : "Restablecer contraseña"}
            type="submit"
            disabled={isSubmitting}
          />
        </div>

        <p className="text-base text-gray-500 text-center">
          <Link to="/" className="text-blue-500 hover:text-blue-600">
            Volver a iniciar sesión
          </Link>
        </p>

        <div className="absolute size-full right-0 rotate-5 rounded-3xl -z-10 bg-blue-500"></div>
      </div>
    </form>
  );
};

export default RestablecerContrasena2;