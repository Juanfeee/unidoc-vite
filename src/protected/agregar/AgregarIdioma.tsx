"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { languageSchema } from "../../validaciones/languageSchema";
import { SubmitHandler, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router";
import { ButtonRegresar } from "../../componentes/formularios/ButtonRegresar";
import { InputLabel } from "../../componentes/formularios/InputLabel";
import TextInput from "../../componentes/formularios/TextInput";
import InputErrors from "../../componentes/formularios/InputErrors";
import { SelectForm } from "../../componentes/formularios/SelectForm";
import { ButtonPrimary } from "../../componentes/formularios/ButtonPrimary";
import { AdjuntarArchivo } from "../../componentes/formularios/AdjuntarArchivo";
import { useArchivoPreview } from "../../hooks/ArchivoPreview";
import { MostrarArchivo } from "../../componentes/formularios/MostrarArchivo";

type Inputs = {
  idioma: string;
  institucion_idioma: string;
  nivel: string;
  fecha_certificado: string;
  archivo: FileList;
};

const AgregarIdioma = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(languageSchema),
  });

  const archivoValue = watch("archivo");
  const { existingFile } = useArchivoPreview(archivoValue);

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const formData = new FormData();

    // Agregar los datos al FormData
    formData.append("idioma", data.idioma);
    formData.append("institucion_idioma", data.institucion_idioma);
    formData.append("nivel", data.nivel);
    formData.append("fecha_certificado", data.fecha_certificado || "");
    formData.append("archivo", data.archivo[0]);

    const token = Cookies.get("token");
    const url = `${import.meta.env.VITE_API_URL}/aspirante/crear-idioma`;

    const postPromise = axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      timeout: 10000,
    });

    toast.promise(postPromise, {
      pending: "Enviando datos...",
      success: {
        render() {
          // Redirigir después de guardar
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
                const mensajes = Object.values(errores).flat().join("\n");
                return `Errores del formulario:\n${mensajes}`;
              }
              return (
                error.response.data?.message || "Error al guardar los datos."
              );
            } else if (error.request) {
              return "No se recibió respuesta del servidor.";
            }
          }
          return "Error inesperado al guardar los datos.";
        },
        autoClose: 3000,
      },
    });
  };

  return (
    <>
      <div className="flex flex-col bg-white p-8 rounded-xl shadow-md w-full max-w-4xl gap-y-4">
        <div className="flex gap-x-4 col-span-full items-center">
          <Link to={"/index"}>
            <ButtonRegresar />
          </Link>
          <h3 className="font-bold text-3xl col-span-full">Agregar idioma</h3>
        </div>

        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="">
            <InputLabel htmlFor="idioma" value="Idioma" />
            <TextInput
              id="idioma"
              placeholder="Ingrese el idioma"
              {...register("idioma")}
            />
            <InputErrors errors={errors} name="idioma" />
          </div>

          <div className="">
            <InputLabel htmlFor="institucion" value="Institución" />
            <TextInput
              id="institucion_idioma"
              placeholder="Nombre de la institución"
              {...register("institucion_idioma")}
            />
            <InputErrors errors={errors} name="institucion" />
          </div>

          <div className="">
            <InputLabel htmlFor="nivel_idioma" value="Nivel de idioma" />
            <SelectForm
              id="nivel"
              register={register("nivel")}
              url="niveles-idioma"
              data_url="nivel_idioma"
            />
            <InputErrors errors={errors} name="nivel_idioma" />
          </div>

          <div className="">
            <InputLabel
              htmlFor="fecha_certificado"
              value="Fecha de certificado"
            />
            <TextInput
              type="date"
              id="fecha_certificado"
              {...register("fecha_certificado")}
            />
            <InputErrors errors={errors} name="fecha_certificado" />
          </div>

          <div className="col-span-full">
            <AdjuntarArchivo id="archivo" register={register("archivo")} />
            <InputErrors errors={errors} name="archivo" />
            <MostrarArchivo file={existingFile} />
          </div>
          <div className="flex justify-center col-span-full">
            <ButtonPrimary value="Agregar estudio" />
          </div>
        </form>
      </div>
    </>
  );
};

export default AgregarIdioma;
