"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, SubmitHandler, useForm } from "react-hook-form";
import { rutSchema, rutSchemaUpdate } from "../validaciones/rutSchema";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { InputLabel } from "../componentes/formularios/InputLabel";
import TextInput from "../componentes/formularios/TextInput";
import InputErrors from "../componentes/formularios/InputErrors";
import { SelectForm } from "../componentes/formularios/SelectForm";
import { ButtonPrimary } from "../componentes/formularios/ButtonPrimary";
import { AdjuntarArchivo } from "../componentes/formularios/AdjuntarArchivo";
import { useArchivoPreview } from "../hooks/ArchivoPreview";
import { MostrarArchivo } from "../componentes/formularios/MostrarArchivo";


type Inputs = {
  numero_rut: string;
  razon_social: string;
  tipo_persona: string;
  codigo_ciiu: string;
  responsabilidades_tributarias: string;
  archivo: FileList;
};

export const Rut = () => {

  const [isRutRegistered, setIsRutRegistered] = useState(false);
  const schema = isRutRegistered ? rutSchemaUpdate : rutSchema;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
    },
  });

  const archivoValue = watch("archivo");

  const { existingFile, setExistingFile } = useArchivoPreview(archivoValue);

  //Traer los datos del usuario al cargar el componente
    const fetchUserData = async () => {
      const token = Cookies.get("token");
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/aspirante/obtener-rut`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 20000
        });
        const data = response.data.rut;
        if (data) {
          setIsRutRegistered(true);
          setValue("numero_rut", data.numero_rut);
          setValue("razon_social", data.razon_social);
          setValue("tipo_persona", data.tipo_persona);
          setValue("codigo_ciiu", data.codigo_ciiu);
          setValue("responsabilidades_tributarias", data.responsabilidades_tributarias);

          if (data.documentos_rut && data.documentos_rut.length > 0) {
            const archivo = data.documentos_rut[0];
            setExistingFile({
              url: archivo.archivo_url,
              name: archivo.archivo.split("/").pop() || "Archivo existente",
            });

          }
        } else {
          console.log("No se encontraron datos del RUT")
        }
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      }
    };

  useEffect(() => {
    fetchUserData();
  }
    , []);


  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const formData = new FormData();
    formData.append("numero_rut", data.numero_rut);
    formData.append("razon_social", data.razon_social);
    formData.append("tipo_persona", data.tipo_persona);
    formData.append("codigo_ciiu", data.codigo_ciiu);
    formData.append("responsabilidades_tributarias", data.responsabilidades_tributarias);
    
    if (data.archivo && data.archivo.length > 0) {
      formData.append("archivo", data.archivo[0]);
    }

    // Agregar `_method` si es actualización
    if (isRutRegistered) {
      formData.append("_method", "PUT");
    }
    const token = Cookies.get("token");

    const url = isRutRegistered
      ? `${import.meta.env.VITE_API_URL}/aspirante/actualizar-rut` // Ruta para actualizar
      : `${import.meta.env.VITE_API_URL}/aspirante/crear-rut`; // Ruta para crear
    try {
      await toast.promise(
        axios.post(url, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          timeout: 10000
        }),
        {
          pending: "Enviando datos...",
          success: {
            render() {
              setIsRutRegistered(true)
              return "Datos guardados correctamente";
            }
          },
          error: "Error al guardar los datos"
        }
      );
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  }

  return (

    <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Formulario RUT</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <div>
          <InputLabel htmlFor="numero_rut" value="Nombre RUT" />
          <TextInput
            className="w-full"
            id="numero_rut"
            type="text"
            placeholder="Nombre RUT..."
            {...register("numero_rut")}
          />
          <InputErrors errors={errors} name="nombre_rut" />
        </div>

        {/* Razón social */}
        <div>
          <InputLabel htmlFor="razon_social" value="Razón social" />
          <TextInput
            className="w-full"
            id="razon_social"
            type="text"
            placeholder="Razón social..."
            {...register("razon_social")}
          />
          <InputErrors errors={errors} name="razon_social" />
        </div>

        {/* Tipo persona */}
        <div>
          <InputLabel htmlFor="tipo_persona" value="Tipo persona" />
          <SelectForm
            id="tipo_persona"
            register={register("tipo_persona")}
            url="tipo-persona"
            data_url="tipo_persona"
          />
          <InputErrors errors={errors} name="tipo_persona" />
        </div>

        {/* Código CIIU */}
        <div>
          <InputLabel htmlFor="codigo_ciiu" value="Código CIIU" />
          <SelectForm
            id="codigo_ciiu"
            register={register("codigo_ciiu")}
            url="codigo-ciiu"
            data_url="codigo_ciiu"
          />
          <InputErrors errors={errors} name="codigo_ciiu" />
        </div>

        {/* Responsabilidades tributarias */}
        <div className="sm:col-span-2">
          <InputLabel htmlFor="responsabilidades_tributarias" value="Responsabilidades tributarias" />
          <TextInput
            className="w-full"
            id="responsabilidades_tributarias"
            type="text"
            placeholder="Responsabilidades tributarias..."
            {...register("responsabilidades_tributarias")}
          />
          <InputErrors errors={errors} name="responsabilidades_tributarias" />
        </div>

        {/* Archivo */}
        <div className="col-span-full">
          <AdjuntarArchivo
            id="archivo"
            register={register("archivo")}
            nombre="rut"
          />
          <InputErrors errors={errors} name="archivo" />
        </div>
        <MostrarArchivo file={existingFile} />

        <div className="col-span-full text-center">
          <ButtonPrimary type="submit" value="Guardar" />
        </div>

      </form>
    </div>

  );
};
