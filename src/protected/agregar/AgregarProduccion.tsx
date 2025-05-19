"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { productionSchema } from "../../validaciones/productionSchema";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router";
import { ButtonRegresar } from "../../componentes/formularios/ButtonRegresar";
import { SelectFormProduccionAcademica } from "../../componentes/formularios/SelectFormProduccion";
import InputErrors from "../../componentes/formularios/InputErrors";
import { InputLabel } from "../../componentes/formularios/InputLabel";
import TextInput from "../../componentes/formularios/TextInput";
import { ButtonPrimary } from "../../componentes/formularios/ButtonPrimary";
import { useState } from "react";
import { AdjuntarArchivo } from "../../componentes/formularios/AdjuntarArchivo";
import Cookies from "js-cookie";
import { MostrarArchivo } from "../../componentes/formularios/MostrarArchivo";
import { useArchivoPreview } from "../../hooks/ArchivoPreview";

type Inputs = {
  productos_academicos_id: number;
  ambito_divulgacion_id: number;
  titulo: string;
  numero_autores: number;
  medio_divulgacion: string;
  fecha_divulgacion: string;
  archivo: FileList;
};

const AgregarProduccion = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(productionSchema) });

  const archivoValue = watch("archivo");
  const { existingFile } = useArchivoPreview(archivoValue);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append(
        "ambito_divulgacion_id",
        data.ambito_divulgacion_id.toString()
      );
      formData.append("titulo", data.titulo);
      formData.append("numero_autores", data.numero_autores.toString());
      formData.append("medio_divulgacion", data.medio_divulgacion);
      formData.append("fecha_divulgacion", data.fecha_divulgacion);
      formData.append("archivo", data.archivo[0]);
      const token = Cookies.get("token");
      const url = `${import.meta.env.VITE_API_URL}/aspirante/crear-produccion`;

      await toast.promise(
        axios.post(url, formData, {
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
                  if (errores && typeof errores === "object") {
                    return `Errores: ${Object.values(errores)
                      .flat()
                      .join(", ")}`;
                  }
                  return (
                    error.response.data?.message ||
                    "Error al guardar los datos."
                  );
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
      console.error("Error al enviar los datos:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const produccionSeleccionado = watch("productos_academicos_id");
  return (
    <>
      <div className="flex flex-col bg-white p-8 rounded-xl shadow-md w-full max-w-4xl gap-y-4">
        <div className="flex gap-x-4 col-span-full">
          <Link to={"/index"}>
            <ButtonRegresar />
          </Link>
          <h3 className="font-bold text-3xl col-span-full">
            Agregar producción académica
          </h3>
        </div>
        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col w-full">
            <InputLabel
              htmlFor="productos_academicos_id"
              value="Productos académicos"
            />
            <SelectFormProduccionAcademica
              id="productos_academicos_id"
              register={register("productos_academicos_id", {
                valueAsNumber: true,
                required: true,
              })}
              url="productos-academicos"
            />
            <InputErrors errors={errors} name="productos_academicos_id" />
          </div>
          <div>
            <InputLabel
              htmlFor="ambito_divulgacion_id"
              value="Ámbito de divulgación"
            />
            <SelectFormProduccionAcademica
              id="ambito_divulgacion_id"
              register={register("ambito_divulgacion_id", {
                valueAsNumber: true,
                required: true,
              })}
              parentId={produccionSeleccionado}
              url="ambitos_divulgacion"
            />
            <InputErrors errors={errors} name="ambito_divulgacion_id" />
          </div>

          <div className="flex flex-col w-full">
            <InputLabel htmlFor="titulo" value="Título" />
            <TextInput
              id="titulo"
              placeholder="Título..."
              {...register("titulo")}
            />
            <InputErrors errors={errors} name="titulo" />
          </div>
          <div className="flex flex-col w-full">
            <InputLabel htmlFor="numero_autores" value="Número de autores" />
            <TextInput
              type="number"
              id="numero_autores"
              placeholder="Número de autores..."
              {...register("numero_autores", { valueAsNumber: true })}
            />
            <InputErrors errors={errors} name="numero_autores" />
          </div>
          <div className="flex flex-col w-full">
            <InputLabel
              htmlFor="medio_divulgacion"
              value="Medio de divulgación"
            />
            <TextInput
              id="medio_divulgacion"
              placeholder="Medio de divulgación..."
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
          <div className="col-span-full">
            <InputLabel htmlFor="archivo" value="Archivo" />
            <AdjuntarArchivo id="archivo" register={register("archivo")} />
            <InputErrors errors={errors} name="archivo" />
            <MostrarArchivo file={existingFile} />
          </div>
          <div className="flex justify-center col-span-full">
            <ButtonPrimary
              value={isSubmitting ? "Enviando..." : "Agregar producción"}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </>
  );
};
export default AgregarProduccion;
