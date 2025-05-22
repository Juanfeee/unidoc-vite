import { useForm } from "react-hook-form";
import { AdjuntarArchivo } from "../../../componentes/formularios/AdjuntarArchivo";
import { ButtonPrimary } from "../../../componentes/formularios/ButtonPrimary";
import InputErrors from "../../../componentes/formularios/InputErrors";
import { InputLabel } from "../../../componentes/formularios/InputLabel";
import { MostrarArchivo } from "../../../componentes/formularios/MostrarArchivo";
import TextInput from "../../../componentes/formularios/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  convocatoriaSchema,
  convocatoriaSchemaUpdate,
} from "../../../validaciones/talento-humano.ts/convocatoriaSchema";
import TextArea from "../../../componentes/formularios/TextArea";
import { useArchivoPreview } from "../../../hooks/ArchivoPreview";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ButtonRegresar } from "../../../componentes/formularios/ButtonRegresar";
import { SelectLocales } from "../../../componentes/formularios/SelectsLocales";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosConfig";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

type Inputs = {
  nombre_convocatoria: string;
  tipo: string;
  fecha_publicacion: string;
  fecha_cierre: string;
  descripcion: string;
  estado_convocatoria: "Abierta" | "Cerrada" | "Finalizada";
  archivo?: FileList;
};

const Convocatoria = () => {
  const { id } = useParams();
  // Estados para manejar la carga y el registro de la convocatoria
  const [isConvocatoriaRegistered, setIsConvocatoriaRegistered] =
    useState(false);

  const schema = isConvocatoriaRegistered
    ? convocatoriaSchemaUpdate
    : convocatoriaSchema;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const archivoValue = watch("archivo");
  const { existingFile, setExistingFile } = useArchivoPreview(archivoValue);

  const fetchDatos = async () => {
    if (!id) return;
    const URL = `${
      import.meta.env.VITE_API_URL
    }/talentoHumano/obtener-convocatoria/${id}`;
    try {
      const response = await axiosInstance.get(URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = response.data.convocatoria;
      setIsConvocatoriaRegistered(true);
      setValue("nombre_convocatoria", data.nombre_convocatoria);
      setValue("tipo", data.tipo);
      setValue("fecha_publicacion", data.fecha_publicacion);
      setValue("fecha_cierre", data.fecha_cierre);
      setValue("descripcion", data.descripcion);
      setValue("estado_convocatoria", data.estado_convocatoria);

      if (
        data.documentos_convocatoria &&
        data.documentos_convocatoria.length > 0
      ) {
        const archivo = data.documentos_convocatoria[0];
        setExistingFile({
          url: archivo.archivo_url,
          name: archivo.archivo.split("/").pop() || "Archivo existente",
        });
      }
    } catch (error) {
      console.error("Error al obtener convocatorias:", error);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const onSubmit = async (data: Inputs) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("nombre_convocatoria", data.nombre_convocatoria);
    formData.append("tipo", data.tipo);
    formData.append("fecha_publicacion", data.fecha_publicacion);
    formData.append("fecha_cierre", data.fecha_cierre);
    formData.append("descripcion", data.descripcion);
    formData.append("estado_convocatoria", data.estado_convocatoria);
    if (data.archivo && data.archivo.length > 0) {
      formData.append("archivo", data.archivo[0]);
    }

    if (isConvocatoriaRegistered) {
      formData.append("_method", "PUT");
    }

    const url = isConvocatoriaRegistered
      ? `/talentoHumano/actualizar-convocatoria/${id}`
      : "/talentoHumano/crear-convocatoria";

    const token = Cookies.get("token");
    try {
      await toast.promise(
        axiosInstance.post(url, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }),
        {
          pending: "Creando convocatoria...",
          success: {
            render() {
              setTimeout(() => {
                navigate("/talento-humano/convocatorias");

              }, 1500);
              return "Convocatoria creada con éxito";
            },
            autoClose: 1500,
          },
          error: "Error al crear la convocatoria",
        }
      );
    } catch (error) {
      console.error("Error al crear la convocatoria:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(watch());
  return (
    <div className="flex flex-col bg-white p-8 rounded-xl shadow-md w-full max-w-4xl gap-y-4">
      <div className="flex gap-x-4 col-span-full items-center">
        <Link to={"/talento-humano/convocatorias"}>
          <ButtonRegresar />
        </Link>
        <h3 className="font-bold text-3xl col-span-full">
          {isConvocatoriaRegistered
            ? "Editar convocatoria"
            : "Agregar convocatoria"}
        </h3>
      </div>
      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Tipo de estudio */}
        <div className="">
          <InputLabel
            htmlFor="estado_convocatoria"
            value="Estado de convocatoria"
          />
          <SelectLocales
            id="estado_convocatoria"
            register={register("estado_convocatoria")}
          />
          <InputErrors errors={errors} name="estado_convocatoria" />
        </div>

        {/* Institución */}
        <div className="">
          <InputLabel
            htmlFor="nombre_convocatoria"
            value="Nombre de convocatoria"
          />
          <TextInput
            id="nombre_convocatoria"
            placeholder="Nombre de convocatoria"
            {...register("nombre_convocatoria")}
          />
          <InputErrors errors={errors} name="nombre_convocatoria" />
        </div>

        {/* Título */}
        <div className="">
          <InputLabel htmlFor="tipo" value="Tipo" />
          <TextInput id="tipo" placeholder="tipo" {...register("tipo")} />
          <InputErrors errors={errors} name="tipo" />
        </div>
        {/* Fecha de publicación */}
        <div className="">
          <InputLabel
            htmlFor="fecha_publicacion"
            value="Fecha de publicación"
          />
          <TextInput
            type="date"
            id="fecha_publicacion"
            {...register("fecha_publicacion")}
          />
          <InputErrors errors={errors} name="fecha_publicacion" />
        </div>

        {/* Fecha de cierre */}
        <div className="">
          <InputLabel htmlFor="fecha_cierre" value="Fecha de cierre" />
          <TextInput
            type="date"
            id="fecha_cierre"
            {...register("fecha_cierre")}
          />
          <InputErrors errors={errors} name="fecha_cierre" />
        </div>

        <div className="col-span-full">
          <InputLabel htmlFor="descripcion" value="Descripcion" />
          <TextArea
            id="descripcion"
            placeholder="Descripcion"
            {...register("descripcion")}
          />
          <InputErrors errors={errors} name="descripcion" />
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
            value={
              isSubmitting
                ? "Procesando..."
                : isConvocatoriaRegistered
                ? "Actualizar convocatoria"
                : "Crear convocatoria"
            }
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default Convocatoria;
