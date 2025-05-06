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
import { experienciaSchema } from "../../../validaciones/experienceSchema";

type Inputs = {
  tipo_experiencia: string;
  institucion_experiencia: string;
  trabajo_actual: string;
  cargo: string;
  intensidad_horaria: string;
  experiencia_radio: string;
  fecha_inicio: string;
  fecha_finalizacion: string;
  archivo: FileList;
};

const EditarExperiencia = () => {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(experienciaSchema),
    defaultValues: {
      experiencia_radio: "no",
      trabajo_actual: "no",
    },
  });

  const experiencia_radio = watch("experiencia_radio");
  const tipo_experiencia = watch("tipo_experiencia");
  const trabajo_actual = watch("trabajo_actual");
  const [labelText, setLabelText] = useState("Fecha de finalización");

  useEffect(() => {
    const fetchExperiencia = async () => {
      try {
        const token = Cookies.get("token");
        const { data } = await axiosInstance.get(
          `${import.meta.env.VITE_API_URL}/aspirante/obtener-experiencia/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Datos de la experiencia:", data);

        setValue("tipo_experiencia", data.experiencia.tipo_experiencia);
        setValue("institucion_experiencia", data.experiencia.institucion_experiencia);
        setValue("trabajo_actual", data.experiencia.trabajo_actual);
        setValue("cargo", data.experiencia.cargo);
        setValue("intensidad_horaria", data.experiencia.intensidad_horaria);
        setValue("experiencia_radio", data.experiencia.experiencia_radio);
        setValue("fecha_inicio", data.experiencia.fecha_inicio);
        setValue("fecha_finalizacion", data.experiencia.fecha_finalizacion || "");
        
        console.log(watch());
      } catch (error) {
        toast.error("Error al cargar los datos de la experiencia.");
      }
    };

    fetchExperiencia();
  }, [id, setValue, watch]);

  useEffect(() => {
    if (trabajo_actual === "Si") {
      setLabelText("Fecha de expedición de la certificación");
    } else {
      setLabelText("Fecha de finalización");
    }
  }, [trabajo_actual]);

  useEffect(() => {
    if (
      tipo_experiencia === "docencia_universitaria" ||
      tipo_experiencia === "docencia_no_universitaria"
    ) {
      setValue("cargo", "Docente");
    } else {
      setValue("cargo", "");
    }
  }, [tipo_experiencia, setValue]);

  useEffect(() => {
    if (experiencia_radio === "Si") {
      setValue("institucion_experiencia", "Universidad Autonoma de Colombia");
    } else {
      setValue("institucion_experiencia", "");
    }
  }, [experiencia_radio, setValue]);

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("tipo_experiencia", data.tipo_experiencia);
    formData.append("institucion_experiencia", data.institucion_experiencia);
    formData.append("trabajo_actual", data.trabajo_actual);
    formData.append("cargo", data.cargo);
    formData.append("intensidad_horaria", data.intensidad_horaria);
    formData.append("experiencia_radio", data.experiencia_radio);
    formData.append("fecha_inicio", data.fecha_inicio);
    formData.append("fecha_finalizacion", data.fecha_finalizacion || "");
    formData.append("archivo", data.archivo[0]);
    
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

  return (
    <form
      className="flex flex-col gap-y-4 rounded-md lg:w-[800px] xl:w-[1000px] 2xl:w-[1200px] m-auto relative"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col sm:grid grid-cols-3 gap-x-8 bg-white gap-y-6 py-12 px-8 rounded-xl">
        <div className="flex gap-x-4 col-span-full">
          <Link to={"/index"}>
            <ButtonRegresar />
          </Link>
          <h3 className="font-bold text-3xl col-span-full">Editar experiencia</h3>
        </div>

        <div className="flex flex-col sm:grid md:grid-cols-2 sm:col-span-full gap-4">
          <div className="flex flex-col w-full">
            <InputLabel htmlFor="tipo_experiencia" value="Tipo de experiencia" />
            <SelectForm
              id="tipo_experiencia"
              register={register("tipo_experiencia")}
              url="tipos-experiencia"
              data_url="tipo_experiencia"
            />
            <InputErrors errors={errors} name="tipo_experiencia" />
          </div>

          <div className="flex flex-col w-full">
            <InputLabel htmlFor="si" value="Experiencia en universidad autonoma" />
            <div className="flex flex-wrap justify-start px-2 sm:justify-star items-center gap-x-6 lg:gap-x-8 rounded-md border-2 bg-[#F7FAFC] border-[#D1DBE8] sm:h-11">
              <label className="flex items-center gap-x-1 cursor-pointer">
                <TextInput
                  type="radio"
                  id="si_experiencia"
                  value="Si"
                  {...register("experiencia_radio")}
                />
                <span>Si</span>
              </label>
              <label className="flex items-center gap-x-1 cursor-pointer">
                <TextInput
                  type="radio"
                  id="no_experiencia"
                  value="No"
                  {...register("experiencia_radio")}
                />
                <span>No</span>
              </label>
            </div>
            <InputErrors errors={errors} name="experiencia_radio" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 col-span-full gap-4">
          <div className="flex flex-col w-full">
            <InputLabel htmlFor="institucion_experiencia" value="Institución" />
            <TextInput
              id="institucion_experiencia"
              placeholder="Institución"
              {...register("institucion_experiencia")}
            />
            <InputErrors errors={errors} name="institucion_experiencia" />
          </div>
          <div className="flex flex-col w-full">
            <InputLabel htmlFor="cargo" value="Cargo" />
            <TextInput id="cargo" placeholder="Cargo" {...register("cargo")} />
            <InputErrors errors={errors} name="cargo" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 col-span-full gap-4">
          <div className="flex flex-col w-full">
            <InputLabel htmlFor="" value="¿Es su trabajo actual?" />
            <div className="flex flex-wrap justify-start px-4 sm:justify-star items-center gap-x-6 lg:gap-x-8 rounded-md border-2 bg-[#F7FAFC] border-[#D1DBE8] sm:h-11">
              <label className="flex items-center gap-x-1 cursor-pointer">
                <TextInput
                  type="radio"
                  id="si_trabajo_actual"
                  value="Si"
                  {...register("trabajo_actual")}
                />
                <span>Si</span>
              </label>
              <label className="flex items-center gap-x-1 cursor-pointer">
                <TextInput
                  type="radio"
                  id="no_trabajo_actual"
                  value="No"
                  {...register("trabajo_actual")}
                />
                <span>No</span>
              </label>
            </div>
            <InputErrors errors={errors} name="trabajo_actual" />
          </div>
          <div className="flex flex-col w-full">
            <InputLabel
              htmlFor="intensidad_horaria"
              value="Intensidad horaria (Horas)"
            />
            <TextInput
              type="number"
              id="intensidad_horaria"
              placeholder="Intensidad horaria"
              {...register("intensidad_horaria")}
            />
            <InputErrors errors={errors} name="intensidad_horaria" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 col-span-full gap-4">
          <div className="flex flex-col">
            <InputLabel htmlFor="fecha_inicio" value="Fecha de inicio" />
            <TextInput
              type="date"
              id="fecha_inicio"
              {...register("fecha_inicio")}
            />
            <InputErrors errors={errors} name="fecha_inicio" />
          </div>
          <div className="flex flex-col">
            <InputLabel htmlFor="fecha_finalizacion" value={labelText} />
            <TextInput
              type="date"
              id="fecha_finalizacion"
              {...register("fecha_finalizacion")}
            />
            <InputErrors errors={errors} name="fecha_finalizacion" />
          </div>
        </div>

        <div>
          <InputLabel htmlFor="archivo" value="Archivo" />
          <input
            type="file"
            id="archivo"
            {...register("archivo")}
            accept=".pdf, .jpg, .png"
            className="w-full h-11 rounded-lg border-[1.8px] border-blue-600 bg-slate-100/40 p-3 text-sm text-slate-950/90 placeholder-slate-950/60 outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition duration-300 ease-in-out"
          />
          <InputErrors errors={errors} name="archivo" />
        </div>

        <div className="flex justify-center col-span-full">
          <ButtonPrimary type="submit" value="Guardar cambios" />
        </div>
      </div>
    </form>
  );
};

export default EditarExperiencia;