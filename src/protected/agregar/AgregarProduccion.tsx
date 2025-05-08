"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { productionSchema } from "../../validaciones/productionSchema";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router";
import { ButtonRegresar } from "../../componentes/formularios/ButtonRegresar";
import { SelectFormProduccionAcademica } from "../../componentes/formularios/SelectFormProduccion";
import InputErrors from "../../componentes/formularios/InputErrors";
import { InputLabel } from "../../componentes/formularios/InputLabel";
import TextInput from "../../componentes/formularios/TextInput";
import { ButtonPrimary } from "../../componentes/formularios/ButtonPrimary";
import { useState } from "react";
import { AdjuntarArchivo } from "../../componentes/formularios/AdjuntarArchivo";
import Cookies from "js-cookie";
type Inputs = {
  productos_academicos: number;
  ambito_divulgacion_id: number;
  titulo: string;
  numero_autores: string;
  medio_divulgacion: string;
  fecha_divulgacion: string;
  archivo: FileList;
};

const AgregarProduccion = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${import.meta.env.VITE_API_URL}/aspirante/crear-produccion`;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(productionSchema) });


  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);
    // const {
    //   password_confirmation, // lo excluimos
    //   ...formData
    // } = data;

    // formData.municipio_id = 1;
    const formData = new FormData();
    formData.append("ambito_divulgacion_id", data.ambito_divulgacion_id.toString());
    formData.append("titulo", data.titulo);
    formData.append("numero_autores", data.numero_autores);
    formData.append("medio_divulgacion", data.medio_divulgacion);
    formData.append("fecha_divulgacion", data.fecha_divulgacion);
    formData.append("archivo", data.archivo[0]);


    const token = Cookies.get("token") 
    const registroPromise = axios.post(url, formData, {
      // Cabeceras de la petición
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,

      },
      timeout: 10000,
    });

    // Manejo de la respuesta usando toast.promise
    toast.promise(
      registroPromise, {
      pending: "Registrando... Por favor espera.",
      success: {
        render({ data }) {
          // Si la respuesta es exitosa, redirigimos y mostramos el mensaje
          return "¡Bienvenido! Redirigiendo...";
        },
        autoClose: 1000,
        onClose: () => navigate("/index"), // Redirige a la página principal
      },
      error: {
        render({ data }) {
          let errorMessage = "Error al registrar";

          if (axios.isAxiosError(data)) {
            if (data.code === 'ECONNABORTED') {
              errorMessage = "Tiempo de espera agotado. Intente nuevamente";
            } else if (data.response) {
              switch (data.response.status) {
                case 422:
                  errorMessage = "Email ya existe";
                  console.log(data.response.data.errors);
                  console.log(data.response.data.errors.ambitos_divulgacion_id);
                  break;
                case 500:
                  errorMessage = `Error en el servidor: ${data.response.data?.message || "Error desconocido"}`;

                  break;
                default:
                  errorMessage = "Error desconocido";
              }
            } else {
              errorMessage = "Error desconocido";
            }
          }

          return errorMessage;
        },
        autoClose: 5000,
      }
    }
    );

  };

  console.log(errors);
  console.log(watch());

  const produccionSeleccionado = watch("productos_academicos");
  return (
    <>
      <form
        className="flex flex-col gap-y-4 rounded-md lg:w-[800px] xl:w-[1000px] 2xl:w-[1200px] m-auto relative"
        onSubmit={handleSubmit((onSubmit))}
      >
        <div className="flex flex-col sm:grid grid-cols-3  
        bg-white gap-y-10  py-12 px-8 rounded-xl">
          <div className='flex gap-x-4 col-span-full' >
            <Link to={"/index"}>
              <ButtonRegresar />
            </Link>
            <h3 className="font-bold text-3xl col-span-full">
              Agregar producción académica
            </h3>
          </div>
          <div className="flex flex-col sm:grid sm:grid-cols-2 sm:col-span-full gap-4">
            <div className="flex flex-col w-full">
              <InputLabel htmlFor="productos_academicos" value="Productos academicos" />
              <SelectFormProduccionAcademica
                id="productos_academicos"
                register={register("productos_academicos")}
                url="productos-academicos"
              />
              <InputErrors errors={errors} name="productos_academicos" />
            </div>
            <div>
              <InputLabel htmlFor="ambito_divulgacion_id" value="Ambito de divulgación" />
              <SelectFormProduccionAcademica
                id="ambito_divulgacion_id"
                register={register("ambito_divulgacion_id", { valueAsNumber: true, required: true })}

                parentId={produccionSeleccionado}
                url="ambitos_divulgacion"
              />
              <InputErrors errors={errors} name="ambito_divulgacion_id" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 col-span-full gap-4">
            <div className="flex flex-col w-full">
              <InputLabel htmlFor="titulo" value="Título" />
              <TextInput
                id="titulo"
                placeholder="Titulo"
                {...register("titulo")}
              />
              <InputErrors errors={errors} name="titulo" />
            </div>
            <div className="flex flex-col w-full">
              <InputLabel htmlFor="numero_autores" value="Número de autores" />
              <TextInput
                type="number"
                id="numero_autores"
                placeholder="Numero de autores..."
                {...register("numero_autores")}
              />
              <InputErrors errors={errors} name="numero_autores" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 col-span-full gap-4">
            <div className="flex flex-col w-full">
              <InputLabel
                htmlFor="medio_divulgacion"
                value="Medio de divulgación"
              />
              <TextInput
                id="medio_divulgacion"
                placeholder="medio_divulgacion"
                {...register("medio_divulgacion")}
              />
              <InputErrors errors={errors} name="medio_divulgacion" />
            </div>
            <div className="flex flex-col w-full">
              <InputLabel
                htmlFor="fecha_divulgacion"
                value="Fecha de divulgación"
              />
              <TextInput
                id="fecha_divulgacion"
                type="date"
                {...register("fecha_divulgacion")}
              />
              <InputErrors errors={errors} name="fecha_divulgacion" />
            </div>
          </div>
          <div className="col-span-full">
            <InputLabel htmlFor="archivo" value="Archivo" />
            <AdjuntarArchivo
              id="archivo"
              register={register('archivo')}
            />
            <InputErrors errors={errors} name="archivo" />
          </div>
          <div className="flex justify-center col-span-full">
            <ButtonPrimary
              value={isSubmitting ? "Enviando..." : "Agregar producción"}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </form>
    </>
  );
};
export default AgregarProduccion;
