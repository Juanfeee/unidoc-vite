import { useForm } from "react-hook-form";
import { AdjuntarArchivo } from "../../../componentes/formularios/AdjuntarArchivo";
import { ButtonPrimary } from "../../../componentes/formularios/ButtonPrimary";
import InputErrors from "../../../componentes/formularios/InputErrors";
import { InputLabel } from "../../../componentes/formularios/InputLabel";
import { MostrarArchivo } from "../../../componentes/formularios/MostrarArchivo";

import TextInput from "../../../componentes/formularios/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { convocatoriaSchema } from "../../../validaciones/talento-humano.ts/convocatoriaSchema";
import TextArea from "../../../componentes/formularios/TextArea";
import { useArchivoPreview } from "../../../hooks/ArchivoPreview";
import { Link } from "react-router";
import { ButtonRegresar } from "../../../componentes/formularios/ButtonRegresar";
import { SelectLocales } from "../../../componentes/formularios/SelectsLocales";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosConfig";

type Inputs = {
  nombre_convocatoria: string;
  tipo: string;
  fecha_publicacion: string;
  fecha_cierre: string;
  descripcion: string;
  estado_convocatoria: "Abierta" | "Cerrada" | "Finalizada";
  archivo: FileList;
};

const AgregarConvocatoria = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(convocatoriaSchema),
  });

  const archivoValue = watch("archivo");
  const { existingFile } = useArchivoPreview(archivoValue);

  const onSubmit = async (data: Inputs) => {
    const { ...formData } = data;
      const url = `${import.meta.env.VITE_API_URL}/talentoHumano/crear-convocatoria`;
    try {
      await toast.promise(
        axiosInstance.post( url, formData)
      );
    }
  };

  console.log(watch());
  return (
    <div className="flex flex-col bg-white p-8 rounded-xl shadow-md w-full max-w-4xl gap-y-4">
      <div className="flex gap-x-4 col-span-full items-center">
        <Link to={"/talento-humano"}>
          <ButtonRegresar />
        </Link>
        <h3 className="font-bold text-3xl col-span-full">
          Agregar convocatoria
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
            value={isSubmitting ? "Enviando..." : "Agregar estudio"}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default AgregarConvocatoria;
