
import { Link } from 'react-router'
import { ButtonRegresar } from '../../componentes/formularios/ButtonRegresar'
import { InputLabel } from '../../componentes/formularios/InputLabel'
import TextInput from '../../componentes/formularios/TextInput'
import InputErrors from '../../componentes/formularios/InputErrors'
import { aptitudSchema } from '../../validaciones/aptitudSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import TextArea from '../../componentes/formularios/TextArea'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/axiosConfig'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { ButtonPrimary } from '../../componentes/formularios/ButtonPrimary'

type Inputs = {
  nombre_aptitud: string
  descripcion_aptitud: string
}

const AgregarAptitudes = () => {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>({ resolver: zodResolver(aptitudSchema) });




  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    setIsSubmitting(true); // 1. Desactivar el botón al iniciar el envío
    try {
      const formData = new FormData();
      formData.append("nombre_aptitud", data.nombre_aptitud);
      formData.append("descripcion_aptitud", data.descripcion_aptitud);

      const token = Cookies.get("token");
      const url = `${import.meta.env.VITE_API_URL}/aspirante/crear-aptitud`;

      await toast.promise(
        axiosInstance.post(url, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 10000,
        }),
        {
          pending: "Enviando datos...",
          success: {
            render() {
              setTimeout(() => {
                window.location.href = "/index";
              }, 1500);
              return "Datos guardados correctamente";
            },
            autoClose: 1500,
          },
          error: {
            render({ data }) {
              const error = data;
              if (axios.isAxiosError(error)) {
                if (error.code === "ECONNABORTED") {
                  return "Tiempo de espera agotado. Intenta de nuevo.";
                } else if (error.response) {
                  const errores = error.response.data?.errors;
                  if (errores && typeof errores === 'object') {
                    return `Errores: ${Object.values(errores).flat().join(', ')}`;
                  }
                  return error.response.data?.message || "Error al guardar los datos.";
                } else if (error.request) {
                  return "No se recibió respuesta del servidor.";
                }
              }
              return "Error inesperado al guardar los datos.";
            },
            autoClose: 3000,
          },
        }
      );
    } catch (error) {
      console.error("Error en el envío:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  
  return (
    <div className="flex flex-col gap-4 h-full w-[600px] bg-white rounded-3xl p-8">
      <div className="flex gap-4 items-center">
        <div className="flex gap-1 ">
          <Link to={'/index'}>
            <ButtonRegresar
            />
          </Link>
        </div>
        <h4 className="font-bold text-xl">Agregar apitud</h4>
      </div>
      <form className="flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)} >

        <div className="">
          <InputLabel htmlFor="Aptitud" value="Aptitud" />
          <TextInput
            id="Aptitud"
            placeholder="Titulo de aptitud..."
            {...register('nombre_aptitud')}
          />
          <InputErrors errors={errors} name="nombre_aptitud" />
        </div>
        <div className="">
          <InputLabel htmlFor="Descripcion" value="Descripción" />
          <TextArea
            id="Descripcion"
            placeholder="Descripción de la aptitud..."
            {...register('descripcion_aptitud')}
          />
          <InputErrors errors={errors} name="descripcion_aptitud" />
        </div>
        <div className="flex justify-center col-span-full">
          <ButtonPrimary
            value={isSubmitting ? "Enviando..." : "Agregar estudio"}
            disabled={isSubmitting}

          />
        </div>
      </form>
    </div >
  )
}
export default AgregarAptitudes