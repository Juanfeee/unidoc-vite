import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axiosInstance from "../../../utils/axiosConfig";
import { ButtonRegresar } from "../../../componentes/formularios/ButtonRegresar";
import { InputLabel } from "../../../componentes/formularios/InputLabel";
import { SelectForm } from "../../../componentes/formularios/SelectForm";
import InputErrors from "../../../componentes/formularios/InputErrors";
import TextInput from "../../../componentes/formularios/TextInput";
import { ButtonPrimary } from "../../../componentes/formularios/ButtonPrimary";
import { experienciaSchemaUpdate } from "../../../validaciones/experienceSchema";
import { AdjuntarArchivo } from "../../../componentes/formularios/AdjuntarArchivo";
import { LabelRadio } from "../../../componentes/formularios/LabelRadio";
import { useArchivoPreview } from "../../../hooks/ArchivoPreview";
import { MostrarArchivo } from "../../../componentes/formularios/MostrarArchivo";

type Inputs = {
  tipo_experiencia: string;
  institucion_experiencia: string;
  trabajo_actual: string;
  cargo: string;
  intensidad_horaria: string;
  experiencia_universidad: string;
  fecha_inicio: string;
  fecha_finalizacion: string;
  archivo: FileList;
  fecha_expedicion_certificado: string;
};

const EditarExperiencia = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = useParams();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(experienciaSchemaUpdate),
    defaultValues: {
      
    },
  });

  const archivoValue = watch('archivo')
  const { existingFile, setExistingFile } = useArchivoPreview(archivoValue);
  const experiencia_universidad = watch("experiencia_universidad");

  useEffect(() => {
    if (experiencia_universidad === "Si") {
      setValue("institucion_experiencia", "Corporación Universidad del Cauca");
    } else {
      setValue("institucion_experiencia", "");
    }
  }, [experiencia_universidad, setValue]);
  useEffect(() => {

    const URL = `${import.meta.env.VITE_API_URL}/aspirante/obtener-experiencia/${id}`;

    axiosInstance
      .get(URL, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
      .then((response) => {
        const data = response.data.experiencia;
        console.log(data);
        setValue("tipo_experiencia", data.tipo_experiencia);
        setValue("institucion_experiencia", data.institucion_experiencia);
        setValue("trabajo_actual", data.trabajo_actual);
        setValue("cargo", data.cargo);
        setValue("intensidad_horaria", data.intensidad_horaria);
        setValue("fecha_inicio", data.fecha_inicio);
        setValue("fecha_finalizacion", data.fecha_finalizacion);

        if (data.documentos_experiencia && data.documentos_experiencia.length > 0) {
          const archivo = data.documentos_experiencia[0];
          setExistingFile({
            url: archivo.archivo_url,
            name: archivo.archivo.split("/").pop() || "Archivo existente",
          });
        }
      }).catch((error) => {
        console.error("Error al obtener la experiencia:", error);
      });
  }, [setValue]);


  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("tipo_experiencia", data.tipo_experiencia);
    formData.append("institucion_experiencia", data.institucion_experiencia);
    formData.append("trabajo_actual", data.trabajo_actual);
    formData.append("cargo", data.cargo);
    formData.append("intensidad_horaria", data.intensidad_horaria);
    formData.append("fecha_inicio", data.fecha_inicio);
    formData.append("fecha_finalizacion", data.fecha_finalizacion || "");
    formData.append("archivo", data.archivo[0] || '');


    const token = Cookies.get("token");
    const url = `${import.meta.env.VITE_API_URL}/aspirante/actualizar-experiencia/${id}`;

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
                const mensajes = Object.values(errores)
                  .flat()
                  .join("\n");
                return `Errores del formulario:\n${mensajes}`;
              }
              return error.response.data?.message || "Error al actualizar los datos.";
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

  console.log(errors);

  return (
    <div className="flex flex-col bg-white p-8 rounded-xl shadow-md w-full max-w-4xl mx-auto gap-y-4">
      <div className="flex gap-x-4 col-span-full items-center">
        <Link to={"/index"}>
          <ButtonRegresar />
        </Link>
        <h3 className="font-bold text-3xl col-span-full">Editar experiencia</h3>
      </div>

      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Tipo de experiencia */}
        <div className="col-span-full">
          <InputLabel htmlFor="tipo_experiencia" value="Tipo de experiencia" />
          <SelectForm
            id="tipo_experiencia"
            register={register('tipo_experiencia')}
            url="tipos-experiencia"
            data_url="tipo_experiencia"
          />
          <InputErrors errors={errors} name="tipo_experiencia" />
        </div>

        {/* Experiencia en universidad en universidad del cauca */}
        <div className="col-span-full">
          <InputLabel htmlFor="experiencia_universidad" value="Experiencia en universidad autónoma" />
          <div className="flex flex-row flex-wrap gap-4 rounded-lg border-[1.8px] border-blue-600 bg-slate-100/40 h-[44px] px-4">
            <LabelRadio
              htmlFor="experiencia-si"
              value="Si"
              inputProps={register("experiencia_universidad")}
              label="Si"
            />
            <LabelRadio
              htmlFor="experiencia_universidad-no"
              value="No"
              inputProps={register("experiencia_universidad")}
              label="No"
            />
          </div>
          <InputErrors errors={errors} name="experiencia_universidad" />
        </div>

        {/* Institución */}
        <div className="">
          <InputLabel htmlFor="institucion_experiencia" value="Institución" />
          <TextInput
            id="institucion_experiencia"
            placeholder="Institución"
            {...register('institucion_experiencia')}
          />
          <InputErrors errors={errors} name="institucion_experiencia" />
        </div>

        {/* Cargo */}
        <div className="">
          <InputLabel htmlFor="cargo" value="Cargo" />
          <TextInput
            id="cargo"
            placeholder="Cargo"
            {...register('cargo')}
          />
          <InputErrors errors={errors} name="cargo" />
        </div>

        {/* Trabajo actual */}
        <div className="flex flex-col w-full">
          <InputLabel htmlFor="trabajo_actual" value="¿Es su trabajo actual?" />
          <div className="flex flex-row flex-wrap gap-4 rounded-lg border-[1.8px] border-blue-600 bg-slate-100/40 h-[44px] px-4">
            <LabelRadio
              htmlFor="trabajo_actual-si"
              value="Si"
              inputProps={register("trabajo_actual")}
              label="Si"
            />
            <LabelRadio
              htmlFor="trabajo_actual-no"
              value="No"
              inputProps={register("trabajo_actual")}
              label="No"
            />
          </div>
          <InputErrors errors={errors} name="trabajo_actual" />
        </div>

        {/* Intensidad horaria */}
        <div className="">
          <InputLabel htmlFor="intensidad_horaria" value="Intensidad horaria (Horas)" />
          <TextInput
            type="number"
            id="intensidad_horaria"
            placeholder="Intensidad horaria"
            {...register('intensidad_horaria')}
          />
          <InputErrors errors={errors} name="intensidad_horaria" />
        </div>

        {/* Fechas */}
        <div className="">
          <InputLabel htmlFor="fecha_inicio" value="Fecha de inicio" />
          <TextInput
            type="date"
            id="fecha_inicio"
            {...register('fecha_inicio')}
          />
          <InputErrors errors={errors} name="fecha_inicio" />
        </div>
        <div className="">
          <InputLabel htmlFor="fecha_finalizacion" value="Fecha de finalización" />
          <TextInput
            type="date"
            id="fecha_finalizacion"
            {...register('fecha_finalizacion')}
          />
          <InputErrors errors={errors} name="fecha_finalizacion" />
        </div>


        {/* Archivo */}
        <div className="col-span-full">
          <InputLabel htmlFor="archivo" value="Archivo" />
          <AdjuntarArchivo
            id="archivo"
            register={register('archivo')}
          />
          <InputErrors errors={errors} name="archivo" />
          <MostrarArchivo file={existingFile} />
        </div>

        {/* Botón */}
        <div className="flex justify-center col-span-full">
          <ButtonPrimary
            value={isSubmitting ? "Enviando..." : "Editar experiencia"}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>

  );
};

export default EditarExperiencia;