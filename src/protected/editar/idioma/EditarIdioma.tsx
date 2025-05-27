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
import { languageSchemaUpdate } from "../../../validaciones/languageSchema";
import { AdjuntarArchivo } from "../../../componentes/formularios/AdjuntarArchivo";
import { useArchivoPreview } from "../../../hooks/ArchivoPreview";
import { MostrarArchivo } from "../../../componentes/formularios/MostrarArchivo";
import { RolesValidos } from "../../../types/roles";
import { jwtDecode } from "jwt-decode";

type Inputs = {
  idioma: string;
  institucion_idioma: string;
  nivel: string;
  fecha_certificado: string;
  archivo?: FileList;
};

const EditarIdioma = () => {
  const token = Cookies.get("token");
  if (!token) throw new Error("No authentication token found");
  const decoded = jwtDecode<{ rol: RolesValidos }>(token);
  const rol = decoded.rol;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(languageSchemaUpdate),
  });

  const archivoValue = watch("archivo");
  const { existingFile, setExistingFile } = useArchivoPreview(archivoValue);

  useEffect(() => {


    const fetchIdioma = async () => {
      try {
        const ENDPOINTS = {
          Aspirante: `${import.meta.env.VITE_API_URL}${
            import.meta.env.VITE_ENDPOINT_OBTENER_IDIOMAS_ID_ASPIRANTE
          }`,
          Docente: `${import.meta.env.VITE_API_URL}${
            import.meta.env.VITE_ENDPOINT_OBTENER_IDIOMAS_ID_DOCENTE
          }`,
        };
        const endpoint = ENDPOINTS[rol];
        const response = await axiosInstance.get(`${endpoint}/${id}`);

        const data = response.data.idioma;
        setValue("idioma", data.idioma);
        setValue("institucion_idioma", data.institucion_idioma);
        setValue("nivel", data.nivel);
        setValue("fecha_certificado", data.fecha_certificado);

        if (data.documentos_idioma && data.documentos_idioma.length > 0) {
          const archivo = data.documentos_idioma[0];
          setExistingFile({
            url: archivo.archivo_url,
            name: archivo.archivo.split("/").pop() || "Archivo existente",
          });
        }
      } catch (error) {
        console.error("Error al obtener el idioma:", error);
      }
    };
    fetchIdioma();
  }, [id, setValue]);

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("idioma", data.idioma);
      formData.append("institucion_idioma", data.institucion_idioma);
      formData.append("nivel", data.nivel);
      formData.append("fecha_certificado", data.fecha_certificado || "");
      if (data.archivo && data.archivo.length > 0) {
        formData.append("archivo", data.archivo[0]);
      }

      const ENDPOINTS = {
        Aspirante: `${import.meta.env.VITE_API_URL}${
          import.meta.env.VITE_ENDPOINT_ACTUALIZAR_IDIOMAS_ASPIRANTE
        }`,
        Docente: `${import.meta.env.VITE_API_URL}${
          import.meta.env.VITE_ENDPOINT_ACTUALIZAR_IDIOMAS_DOCENTE
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
      console.error("Error al enviar el formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col bg-white p-8 rounded-xl shadow-md w-full max-w-4xl mx-auto gap-y-4">
        <div className="flex gap-x-4 col-span-full">
          <Link to={"/index"}>
            <ButtonRegresar />
          </Link>
          <h3 className="font-bold text-3xl col-span-full">Editar idioma</h3>
        </div>
        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="">
            <InputLabel htmlFor="idioma" value="Idioma *" />
            <TextInput
              id="idioma"
              placeholder="Ingrese el idioma"
              {...register("idioma")}
            />
            <InputErrors errors={errors} name="idioma" />
          </div>

          <div className="">
            <InputLabel htmlFor="institucion" value="Institución *" />
            <TextInput
              id="institucion_idioma"
              placeholder="Nombre de la institución"
              {...register("institucion_idioma")}
            />
            <InputErrors errors={errors} name="institucion_idioma" />
          </div>

          <div className="">
            <InputLabel htmlFor="nivel_idioma" value="Nivel de idioma *" />
            <SelectForm
              id="nivel"
              register={register("nivel")}
              url="niveles-idioma"
              data_url="nivel_idioma"
            />
            <InputErrors errors={errors} name="nivel" />
          </div>

          <div className="">
            <InputLabel
              htmlFor="fecha_certificado"
              value="Fecha de certificado *"
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
            <ButtonPrimary
              value={isSubmitting ? "Enviando..." : "Editar idioma"}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default EditarIdioma;
