import { Link, useParams } from "react-router";
import { ButtonRegresar } from "../../../componentes/formularios/ButtonRegresar";
import { InputLabel } from "../../../componentes/formularios/InputLabel";
import { SelectFormProduccionAcademica } from "../../../componentes/formularios/SelectFormProduccion";
import InputErrors from "../../../componentes/formularios/InputErrors";
import TextInput from "../../../componentes/formularios/TextInput";
import { MostrarArchivo } from "../../../componentes/formularios/MostrarArchivo";
import { ButtonPrimary } from "../../../componentes/formularios/ButtonPrimary";
import { AdjuntarArchivo } from "../../../componentes/formularios/AdjuntarArchivo";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productionSchemaUpdate } from "../../../validaciones/productionSchema";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useArchivoPreview } from "../../../hooks/ArchivoPreview";
import axiosInstance from "../../../utils/axiosConfig";
import { toast } from "react-toastify";
import axios from "axios";

type Inputs = {
  titulo: string;
  productos_academicos: number;
  ambito_divulgacion_id: number;
  numero_autores: number;
  medio_divulgacion: string;
  fecha_divulgacion: string;
  archivo?: FileList;
};

const EditarProduccion = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(productionSchemaUpdate) });

  const archivoValue = watch("archivo");
  const { existingFile, setExistingFile } = useArchivoPreview(archivoValue);

  const fetchProduccionAcademica = async () => {
    const URL = import.meta.env.VITE_API_URL;

    try {
      const response = await axiosInstance.get(
        `${URL}/aspirante/obtener-produccion/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const produccionAcademica = response.data.produccion;

      const respAmbito = await axiosInstance.get(
        `${URL}/tiposProduccionAcademica/ambito-divulgacion-completo/${produccionAcademica.ambito_divulgacion_id}`
      );

      setValue("productos_academicos", respAmbito.data.producto_academico_id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setValue("ambito_divulgacion_id", respAmbito.data.id_ambito_divulgacion);
      setValue("titulo", produccionAcademica.titulo);
      setValue("numero_autores", produccionAcademica.numero_autores);
      setValue("medio_divulgacion", produccionAcademica.medio_divulgacion);
      setValue("fecha_divulgacion", produccionAcademica.fecha_divulgacion);

      if (
        produccionAcademica.documentos_produccion_academica &&
        produccionAcademica.documentos_produccion_academica.length > 0
      ) {
        const archivo = produccionAcademica.documentos_produccion_academica[0];
        setExistingFile({
          url: archivo.archivo_url,
          name: archivo.archivo.split("/").pop() || "Archivo existente",
        });
      }
    } catch (error) {
      console.error("Error al obtener la producción académica:", error);
    }
  };

  useEffect(() => {
    fetchProduccionAcademica();
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append(
      "ambito_divulgacion_id",
      data.ambito_divulgacion_id.toString()
    );
    formData.append("titulo", data.titulo);
    formData.append("numero_autores", data.numero_autores.toString());
    formData.append("medio_divulgacion", data.medio_divulgacion);
    formData.append("fecha_divulgacion", data.fecha_divulgacion);
    
    if (data.archivo && data.archivo.length > 0) {
      formData.append("archivo", data.archivo[0]);
    }

    const token = Cookies.get("token");
    const url = `${
      import.meta.env.VITE_API_URL
    }/aspirante/actualizar-produccion/${id}`;

    const putPromise = axiosInstance.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      timeout: 10000,
    });

    toast.promise(putPromise, {
      pending: "Actualizando datos...",
      success: {
        render() {
          // Redirige después de actualizar
          setTimeout(() => {
            window.location.href = "/index";
          }, 1500);
          return "Datos actualizados correctamente";
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
                error.response.data?.message || "Error al actualizar los datos."
              );
            } else if (error.request) {
              return "No se recibió respuesta del servidor.";
            }
          }
          return "Error inesperado al actualizar los datos.";
        },
        autoClose: 3000,
      },
    });
  };

  const produccionSeleccionado = watch("productos_academicos");

  return (
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
            htmlFor="productos_academicos"
            value="Productos academicos"
          />
          <SelectFormProduccionAcademica
            id="productos_academicos"
            register={register("productos_academicos")}
            url="productos-academicos"
          />
          <InputErrors errors={errors} name="productos_academicos" />
        </div>
        <div>
          <InputLabel
            htmlFor="ambito_divulgacion_id"
            value="Ambito de divulgación"
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
          <TextInput id="titulo" placeholder="Titulo" {...register("titulo")} />
          <InputErrors errors={errors} name="titulo" />
        </div>
        <div className="flex flex-col w-full">
          <InputLabel htmlFor="numero_autores" value="Número de autores" />
          <TextInput
            type="number"
            id="numero_autores"
            placeholder="Numero de autores..."
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
            placeholder="medio divulgacion"
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
            value={isSubmitting ? "Enviando..." : "Editar producción"}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default EditarProduccion;
