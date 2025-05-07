
import { zodResolver } from "@hookform/resolvers/zod";
import { studySchema } from "../../validaciones/studySchema";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router";
import { ButtonRegresar } from "../../componentes/formularios/ButtonRegresar";
import { InputLabel } from "../../componentes/formularios/InputLabel";
import { SelectForm } from "../../componentes/formularios/SelectForm";
import InputErrors from "../../componentes/formularios/InputErrors";
import { LabelRadio } from "../../componentes/formularios/LabelRadio";
import TextInput from "../../componentes/formularios/TextInput";
import { ButtonPrimary } from "../../componentes/formularios/ButtonPrimary";
import Cookies from "js-cookie";
import axiosInstance from "../../utils/axiosConfig";
import { AdjuntarArchivo } from "../../componentes/formularios/AdjuntarArchivo";

type Inputs = {
  tipo_estudio: string;
  graduado: string;
  institucion: string;
  fecha_graduacion: string;
  titulo_convalidado: string;
  fecha_convalidacion: string;
  resolucion_convalidacion?: string;
  posible_fecha_graduacion?: string;
  titulo_estudio: string;
  fecha_inicio: string;
  fecha_fin: string;
  archivo: FileList;
}


const AgregarEstudio = () => {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Inputs>({ resolver: zodResolver(studySchema) });
  console.log("Formulario", watch());

  // Efecto para limpiar los campos de fecha de graduación y posible fecha de convalidación si el graduado es "No"
  const convalido = watch('titulo_convalidado');
  useEffect(() => {
    if (convalido === 'no') {
      setValue('fecha_convalidacion', '');
      setValue('resolucion_convalidacion', '');
    }
  }, [convalido, setValue]);
  // Efecto para limpiar los campos de fecha de graduación y posible fecha de convalidación si el graduado es "No"
  useEffect(() => {
    if (watch('graduado') === 'Si') {
      setValue('posible_fecha_graduacion', '');
    } else if (watch('graduado') === 'No') {
      setValue('fecha_graduacion', '');
    }
  }, [watch('graduado'), setValue]);

  // Efecto para limpiar los campos de fecha de convalidación y resolución de convalidación si el título no está convalidado
  useEffect(() => {
    if (watch('titulo_convalidado') === 'Si') {
      setValue('resolucion_convalidacion', '');
    } else if (watch('titulo_convalidado') === 'No') {
      setValue('fecha_convalidacion', '');
    }
  }, [watch('titulo_convalidado'), setValue]);

  // Función para manejar el envío del formulario
  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    setIsSubmitting(true); // 1. Desactivar el botón al iniciar el envío
    try {
      const formData = new FormData();
      formData.append("tipo_estudio", data.tipo_estudio);
      formData.append("graduado", data.graduado);
      formData.append("institucion", data.institucion);
      formData.append("fecha_graduacion", data.fecha_graduacion || '');
      formData.append("titulo_convalidado", data.titulo_convalidado);
      formData.append("fecha_convalidacion", data.fecha_convalidacion || '');
      formData.append("resolucion_convalidacion", data.resolucion_convalidacion || '');
      formData.append("posible_fecha_graduacion", data.posible_fecha_graduacion || '');
      formData.append("titulo_estudio", data.titulo_estudio);
      formData.append("fecha_inicio", data.fecha_inicio);
      formData.append("fecha_fin", data.fecha_fin || '');
      formData.append("archivo", data.archivo[0] || '');
  
      const token = Cookies.get("token");
      const url = `${import.meta.env.VITE_API_URL}/aspirante/crear-estudio`;
  
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
  //mostrar el formulario en consola


  return (
    <>
      <div className="flex flex-col bg-white p-8 rounded-xl shadow-md w-full max-w-4xl mx-auto gap-y-4">
        <div className="flex gap-x-4 col-span-full items-center">
          <Link to={"/index"}>
            <ButtonRegresar />
          </Link>
          <h3 className="font-bold text-3xl col-span-full">Agregar estudio</h3>
        </div>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          onSubmit={handleSubmit(onSubmit)} >

          {/* Tipo de estudio */}
          <div className="">
            <InputLabel htmlFor="tipo_estudio" value="Tipo de estudio" />
            <SelectForm
              id="tipo_estudio"
              register={register('tipo_estudio')}
              url="tipos-estudio"
              data_url="tipo_estudio"
            />
            <InputErrors errors={errors} name="tipo_estudio" />
          </div>

          {/* Graduado */}
          <div className="">
            <InputLabel htmlFor="graduado" value="Graduado" />
            <div className="flex flex-row flex-wrap gap-4 rounded-lg border-[1.8px] border-blue-600 bg-slate-100/40 h-[44px] px-4">
              <LabelRadio
                htmlFor="graduado-si"
                value="Si"
                inputProps={register("graduado")}
                label="Si"
              />
              <LabelRadio
                htmlFor="graduado-no"
                value="No"
                inputProps={register("graduado")}
                label="No"
              />
            </div>
            <InputErrors errors={errors} name="graduado" />
          </div>

          {/* Fecha de graduación */}
          {watch('graduado') === 'Si' && (
            <div className="">
              <InputLabel htmlFor="fecha_grado" value="Fecha de grado" />
              <TextInput
                id="fecha_grado"
                type="date"
                {...register('fecha_graduacion')}
              />
              <InputErrors errors={errors} name="fecha_grado" />
            </div>
          )}

          {/* Posible fecha de graduación */}
          {watch('graduado') === 'No' && (
            <div className="">
              <InputLabel htmlFor="posible_fecha_graduacion" value="Posible fecha de graduacion" />
              <TextInput
                id="posible_fecha_graduacion"
                type="date"
                {...register('posible_fecha_graduacion')}
              />
              <InputErrors errors={errors} name="posible_fecha_graduacion" />
            </div>
          )}


          {/* Institución */}
          <div className="">
            <InputLabel htmlFor="institucion" value="Institución" />
            <TextInput
              id="institucion"
              placeholder="Institución"
              {...register('institucion')}
            />
            <InputErrors errors={errors} name="institucion" />
          </div>

          {/* Título */}
          <div className="">
            <InputLabel htmlFor="titulo" value="Título" />
            <TextInput
              id="titulo"
              placeholder="Título"
              {...register('titulo_estudio')}
            />
            <InputErrors errors={errors} name="titulo_estudio" />
          </div>


          {/* Convalidado */}
          <div className="flex flex-col w-full">
            <InputLabel htmlFor="convalido" value="Convalido" />
            <div className="flex flex-row flex-wrap gap-4 rounded-lg border-[1.8px] border-blue-600 bg-slate-100/40 h-[44px] px-4">
              <LabelRadio
                htmlFor="convalido-si"
                value="Si"
                inputProps={register("titulo_convalidado")}
                label="Si"
              />
              <LabelRadio
                htmlFor="convalido-no"
                value="No"
                inputProps={register("titulo_convalidado")}
                label="No"
              />
            </div>
            <InputErrors errors={errors} name="titulo_convalidado" />
          </div>

          {/* Fecha de convalidación */}
          {watch('titulo_convalidado') === 'Si' && (
            <>
              <div className="">
                <InputLabel htmlFor="fecha_convalidacion" value="Fecha de convalidación" />
                <TextInput
                  id="fecha_convalidacion"
                  type="date"
                  {...register('fecha_convalidacion')}
                />
              </div>

              <div className="">
                <InputLabel htmlFor="resolucion_convalidacion" value="Resolución de convalidación" />
                <TextInput
                  id="resolucion_convalidacion"
                  placeholder="Resolución de convalidación"
                  {...register('resolucion_convalidacion')}
                />
              </div>
            </>
          )}


          {/* Fecha de inicio */}
          <div className="">
            <InputLabel htmlFor="fecha_inicio" value="Fecha de inicio" />
            <TextInput
              type="date"
              id="fecha_inicio"
              {...register('fecha_inicio')}
            />
            <InputErrors errors={errors} name="fecha_inicio" />
          </div>

          {/* Fecha de fin */}
          <div className="">
            <InputLabel htmlFor="fecha_fin" value="Fecha de fin" />
            <TextInput
              type="date"
              id="fecha_fin"
              {...register('fecha_fin')}
            />
            <InputErrors errors={errors} name="fecha_fin" />
          </div>


          {/* Archivo */}
          <div className="col-span-full">
            <AdjuntarArchivo
              id="archivo"
              register={register('archivo')}
              />

            <InputErrors errors={errors} name="archivo" />
          </div>

          {/* Botón para agregar estudio */}
          <div className="flex justify-center col-span-full">
            <ButtonPrimary 
              value={isSubmitting ? "Enviando..." : "Agregar estudio"}
              disabled={isSubmitting}
            
            />
          </div>

        </form>
      </div>

    </>

  )
}
export default AgregarEstudio