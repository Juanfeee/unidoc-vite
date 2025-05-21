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
import { LabelRadio } from "../../../componentes/formularios/LabelRadio";
import TextInput from "../../../componentes/formularios/TextInput";
import { ButtonPrimary } from "../../../componentes/formularios/ButtonPrimary";
import { studySchemaUpdate } from "../../../validaciones/studySchema";
import { AdjuntarArchivo } from "../../../componentes/formularios/AdjuntarArchivo";
import { useArchivoPreview } from "../../../hooks/ArchivoPreview";
import { MostrarArchivo } from "../../../componentes/formularios/MostrarArchivo";
import { RolesValidos } from "../../../types/roles";
import { jwtDecode } from "jwt-decode";

type Inputs = {
  tipo_estudio: string;
  graduado: "Si" | "No";
  institucion: string;
  titulo_estudio: string;
  titulo_convalidado: "Si" | "No";
  fecha_inicio: string;

  fecha_fin?: string;
  resolucion_convalidacion?: string;
  fecha_graduacion?: string;
  posible_fecha_graduacion?: string;
  fecha_convalidacion?: string;
  archivo?: FileList;
};

const EditarEstudio = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = Cookies.get("token");
  if (!token) throw new Error("No authentication token found");
  const decoded = jwtDecode<{ rol: RolesValidos }>(token);
  const rol = decoded.rol;

  const { id } = useParams(); // Obtener el ID del estudio a través de la URL
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(studySchemaUpdate),
  });

  const archivoValue = watch("archivo");
  const { existingFile, setExistingFile } = useArchivoPreview(archivoValue);

  // Efecto para limpiar los campos de fecha de graduación y posible fecha de convalidación si el graduado es "No"
  const graduado = watch("graduado");
  const convalido = watch("titulo_convalidado");
  useEffect(() => {
    if (convalido === "No") {
      setValue("fecha_convalidacion", "");
      setValue("resolucion_convalidacion", "");
    }
  }, [convalido, setValue]);
  // Efecto para limpiar los campos de fecha de graduación y posible fecha de convalidación si el graduado es "No"
  useEffect(() => {
    if (graduado === "Si") {
      setValue("posible_fecha_graduacion", "");
    } else if (graduado === "No") {
      setValue("fecha_graduacion", "");
    }
  }, [graduado, setValue]);

  useEffect(() => {
    const fetchEstudio = async () => {
      try {
        const ENDPOINTS = {
          Aspirante: `${import.meta.env.VITE_API_URL}${
            import.meta.env.VITE_ENDPOINT_OBTENER_ESTUDIOS_ID_ASPIRANTE
          }`,
          Docente: `${import.meta.env.VITE_API_URL}${
            import.meta.env.VITE_ENDPOINT_OBTENER_ESTUDIOS_ID_DOCENTE
          }`,
        };
        const endpoint = ENDPOINTS[rol];
        const response = await axiosInstance.get(`${endpoint}/${id}`);
        if (response.data?.estudio) {
          const data = response.data.estudio;
          setValue("tipo_estudio", data.tipo_estudio || "");
          setValue("graduado", data.graduado || "");
          setValue("institucion", data.institucion || "");
          setValue("fecha_graduacion", data.fecha_graduacion || "");
          setValue("titulo_convalidado", data.titulo_convalidado || "");
          setValue("fecha_convalidacion", data.fecha_convalidacion || "");
          setValue(
            "resolucion_convalidacion",
            data.resolucion_convalidacion || ""
          );
          setValue(
            "posible_fecha_graduacion",
            data.posible_fecha_graduacion || ""
          );
          setValue("titulo_estudio", data.titulo_estudio || "");
          setValue("fecha_inicio", data.fecha_inicio || "");
          setValue("fecha_fin", data.fecha_fin || "");

          if (data.documentos_estudio && data.documentos_estudio.length > 0) {
            const archivo = data.documentos_estudio[0];
            setExistingFile({
              url: archivo.archivo_url,
              name: archivo.archivo.split("/").pop() || "Archivo existente",
            });
          }
        }
      } catch {
        console.log("");
      }
    };
    fetchEstudio();
  }, [id, setValue]);

  // Función para manejar el envío del formulario
  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("tipo_estudio", data.tipo_estudio);
      formData.append("graduado", data.graduado);
      formData.append("institucion", data.institucion);
      formData.append("fecha_graduacion", data.fecha_graduacion || "");
      formData.append("titulo_convalidado", data.titulo_convalidado);
      formData.append("fecha_convalidacion", data.fecha_convalidacion || "");
      formData.append(
        "resolucion_convalidacion",
        data.resolucion_convalidacion || ""
      );
      formData.append(
        "posible_fecha_graduacion",
        data.posible_fecha_graduacion || ""
      );
      formData.append("titulo_estudio", data.titulo_estudio);
      formData.append("fecha_inicio", data.fecha_inicio);
      formData.append("fecha_fin", data.fecha_fin || "");

      if (data.archivo && data.archivo.length > 0) {
        formData.append("archivo", data.archivo[0]);
      }

      const ENDPOINTS = {
        Aspirante: `${import.meta.env.VITE_API_URL}${
          import.meta.env.VITE_ENDPOINT_ACTUALIZAR_ESTUDIOS_ASPIRANTE
        }`,
        Docente: `${import.meta.env.VITE_API_URL}${
          import.meta.env.VITE_ENDPOINT_ACTUALIZAR_ESTUDIOS_DOCENTE
        }`,
      };
      const endpoint = ENDPOINTS[rol];
      const putPromise = axiosInstance.post(`${endpoint}/${id}`, formData);

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
                  error.response.data?.message ||
                  "Error al actualizar los datos."
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
    } catch (error) {
      console.error("Error en la actualización:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  console.log("errors", errors);
  return (
    <div className="flex flex-col bg-white p-8 rounded-xl shadow-md w-full max-w-4xl mx-auto gap-y-4">
      <div className="flex gap-x-4 col-span-full items-center">
        <Link to={"/editar/estudios"}>
          <ButtonRegresar />
        </Link>
        <h3 className="font-bold text-3xl col-span-full">Editar estudio</h3>
      </div>
      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Tipo de estudio */}
        <div className="">
          <InputLabel htmlFor="tipo_estudio" value="Tipo de estudio" />
          <SelectForm
            id="tipo_estudio"
            register={register("tipo_estudio")}
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
              label="Sí"
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
        {watch("graduado") === "Si" && (
          <div className="">
            <InputLabel htmlFor="fecha_grado" value="Fecha de grado" />
            <TextInput
              id="fecha_grado"
              type="date"
              {...register("fecha_graduacion")}
            />
            <InputErrors errors={errors} name="fecha_grado" />
          </div>
        )}

        {/* Posible fecha de graduación */}
        {watch("graduado") === "No" && (
          <div className="">
            <InputLabel
              htmlFor="posible_fecha_graduacion"
              value="Posible fecha de graduacion"
            />
            <TextInput
              id="posible_fecha_graduacion"
              type="date"
              {...register("posible_fecha_graduacion")}
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
            {...register("institucion")}
          />
          <InputErrors errors={errors} name="institucion" />
        </div>

        {/* Título */}
        <div className="">
          <InputLabel htmlFor="titulo" value="Título" />
          <TextInput
            id="titulo"
            placeholder="Título"
            {...register("titulo_estudio")}
          />
          <InputErrors errors={errors} name="titulo_estudio" />
        </div>

        {/* Convalidado */}
        <div className="flex flex-col w-full">
          <InputLabel htmlFor="convalido" value="¿Convalidó?" />
          <div className="flex flex-row flex-wrap gap-4 rounded-lg border-[1.8px] border-blue-600 bg-slate-100/40 h-[44px] px-4">
            <LabelRadio
              htmlFor="convalido-si"
              value="Si"
              inputProps={register("titulo_convalidado")}
              label="Sí"
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
        {watch("titulo_convalidado") === "Si" && (
          <>
            <div className="">
              <InputLabel
                htmlFor="fecha_convalidacion"
                value="Fecha de convalidación"
              />
              <TextInput
                id="fecha_convalidacion"
                type="date"
                {...register("fecha_convalidacion")}
              />
            </div>

            <div className="">
              <InputLabel
                htmlFor="resolucion_convalidacion"
                value="Resolución de convalidación"
              />
              <TextInput
                id="resolucion_convalidacion"
                placeholder="Resolución de convalidación"
                {...register("resolucion_convalidacion")}
              />
              <InputErrors errors={errors} name="resolucion_convalidacion" />
            </div>
          </>
        )}

        {/* Fecha de inicio */}
        <div className="">
          <InputLabel htmlFor="fecha_inicio" value="Fecha de inicio" />
          <TextInput
            type="date"
            id="fecha_inicio"
            {...register("fecha_inicio")}
          />
          <InputErrors errors={errors} name="fecha_inicio" />
        </div>

        {/* Fecha de fin */}
        <div className="">
          <InputLabel htmlFor="fecha_fin" value="Fecha de fin" />
          <TextInput type="date" id="fecha_fin" {...register("fecha_fin")} />
          <InputErrors errors={errors} name="fecha_fin" />
        </div>

        {/* Archivo */}
        <div className="col-span-full">
          <AdjuntarArchivo id="archivo" register={register("archivo")} />

          <InputErrors errors={errors} name="archivo" />
          <MostrarArchivo file={existingFile} />
        </div>

        {/* Botón para agregar estudio */}
        <div className="flex justify-center col-span-full">
          <ButtonPrimary
            value={isSubmitting ? "Enviando..." : "Editar estudio"}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default EditarEstudio;
