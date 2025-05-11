import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axiosInstance from "../../utils/axiosConfig";
import axios from "axios";
import { ButtonRegresar } from "../../componentes/formularios/ButtonRegresar";
import InputErrors from "../../componentes/formularios/InputErrors";
import { ButtonPrimary } from "../../componentes/formularios/ButtonPrimary";
import TextInput from "../../componentes/formularios/TextInput";
import { InputLabel } from "../../componentes/formularios/InputLabel";
import { zodResolver } from "@hookform/resolvers/zod";
import { cambiarContrasenaSchema } from "../../validaciones/cambiarContrasena";
import { jwtDecode } from "jwt-decode";


type Inputs = {
  archivo: FileList;
  password: string;
  new_password: string;
  new_password_confirmation: string;

};
type JwtPayload = {
  sub: number;
};

const CambiarContraseña = () => {

  const [isSubmitting, setIsSubmitting] = useState(false);


  const { register, handleSubmit, reset, formState: { errors } } = useForm<Inputs>({ resolver: zodResolver(cambiarContrasenaSchema) });

  const onSubmitPassword: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("password", data.password);
      formData.append("new_password", data.new_password);

      const token = Cookies.get("token");
      if (!token) throw new Error("Token no encontrado");

      const decodedToken = jwtDecode<JwtPayload>(token);
      const id_sub = decodedToken.sub;
      const url = `${import.meta.env.VITE_API_URL}/auth/actualizar-contrasena/${id_sub}`;

      try {
        const response = await axiosInstance.post(url, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Contraseña cambiada correctamente");
        reset();
      } catch (error: any) {
        console.error("Error en la petición:", error);
      }
    } catch (error) {
      console.error("Error general:", error);
      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  };






  return (
    <form onSubmit={handleSubmit(onSubmitPassword)}>

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Cambiar contraseña</h1>
        < div className="" >
          <InputLabel htmlFor="password" value="Contraseña actual" />
          <TextInput
            id="password"
            type="password"
            placeholder="Contraseña actual..."
            {...register("password")}
          />
          < InputErrors errors={errors} name="password" />
        </div>
        < div className="" >
          <InputLabel htmlFor="new_password" value="Nueva contraseña" />
          <TextInput
            id="new_password"
            type="new_password"
            placeholder="Nueva contraseña..."
            {...register("new_password")}
          />
          < InputErrors errors={errors} name="new_password" />
        </div>
        < div className="" >
          <InputLabel htmlFor="new_password_confirmation" value="Confirmar contraseña nueva" />
          <TextInput
            id="new_password_confirmation"
            type="password"
            placeholder="Confirmar contraseña nueva..."
            {...register("new_password_confirmation")}
          />
          < InputErrors errors={errors} name="new_password_confirmation" />
        </div>
        <div className="w-full flex justify-center">
          <ButtonPrimary
            value={isSubmitting ? "Guardando..." : "Cambiar contraseña"}
          />
        </div>
      </div>
    </form>
  );
};

export default CambiarContraseña;