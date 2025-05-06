"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { epsSchema } from "../validaciones/epsSchema";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { InputLabel } from "../componentes/formularios/InputLabel";
import { SelectForm } from "../componentes/formularios/SelectForm";
import InputErrors from "../componentes/formularios/InputErrors";
import TextInput from "../componentes/formularios/TextInput";
import { ButtonPrimary } from "../componentes/formularios/ButtonPrimary";
import { AdjuntarArchivo } from "../componentes/formularios/AdjuntarArchivo";

type Inputs = {
  tipo_afiliacion: string;
  nombre_eps: string;
  estado_afiliacion: string;
  fecha_afiliacion_efectiva: string;
  fecha_finalizacion_afiliacion: string;
  tipo_afiliado: string;
  numero_afiliado: string;
  archivo: FileList | string;
};

export const EpsFormulario = () => {
  const [isEpsRegistered, setIsEpsRegistered] = useState(false); // Estado para saber si ya existe una EPS registrada

  const [existingFile, setExistingFile] = useState<{ url: string, name: string } | null>(null);



  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(epsSchema),
    defaultValues: {},
  });



  // Traer los datos del usuario al cargar el componente
  useEffect(() => {
    const fetchEpsData = async () => {
      const URL = `${import.meta.env.VITE_API_URL}/aspirante/obtener-eps`;
      try {
        const response = await axios.get(URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        const data = response.data.eps;
        console.log("Datos de EPS:", data); // Verifica los datos que llegan desde la API
        if (data) {
          setIsEpsRegistered(true); // Ya existe una EPS registrada
          setValue("tipo_afiliacion", data.tipo_afiliacion || "");
          setValue("nombre_eps", data.nombre_eps || "");
          setValue("estado_afiliacion", data.estado_afiliacion || "");
          setValue("fecha_afiliacion_efectiva", data.fecha_afiliacion_efectiva || "");
          setValue("fecha_finalizacion_afiliacion", data.fecha_finalizacion_afiliacion || "");
          setValue("tipo_afiliado", data.tipo_afiliado || "");
          setValue("numero_afiliado", data.numero_afiliado || "");
          setValue("archivo", data.archivo || "");


          if (data.documentos_eps && data.documentos_eps.length > 0) {
            const archivo = data.documentos_eps[0];
            setExistingFile({
              url: archivo.archivo_url,
              name: archivo.archivo.split("/").pop() || "Archivo existente",
            });

            // Cargar el archivo en el formulario (pero como no podemos establecer un File directamente, solo lo referenciamos)
            setValue("archivo", archivo.archivo_url); // Aquí solo ponemos la URL del archivo
          } 
        } else {
          console.log("No se encontraron datos de EPS");
        }
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      }
    };

    fetchEpsData();
  }, [setValue]);

  // Enviar los datos del formulario
  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const formData = new FormData();
    formData.append("tipo_afiliacion", data.tipo_afiliacion);
    formData.append("nombre_eps", data.nombre_eps);
    formData.append("estado_afiliacion", data.estado_afiliacion);
    formData.append("fecha_afiliacion_efectiva", data.fecha_afiliacion_efectiva);
    formData.append("fecha_finalizacion_afiliacion", data.fecha_finalizacion_afiliacion);
    formData.append("tipo_afiliado", data.tipo_afiliado);
    formData.append("numero_afiliado", data.numero_afiliado);
    formData.append("archivo", data.archivo instanceof FileList ? data.archivo[0] : data.archivo); // Solo el primer archivo si es un FileList

    // Agregar `_method` si es actualización
    if (isEpsRegistered) {
      formData.append("_method", "PUT");
    }

    const token = Cookies.get("token");
    const url = isEpsRegistered
      ? `${import.meta.env.VITE_API_URL}/aspirante/actualizar-eps` // Ruta para actualizar
      : `${import.meta.env.VITE_API_URL}/aspirante/crear-eps`; // Ruta para crear

    try {
      await toast.promise(
        axios.post(url, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 20000,
        }),
        {
          pending: "Enviando datos...",
          success: "Datos guardados correctamente",
          error: "Error al guardar los datos",
        }
      );
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };
  console.log("Formulario", watch());
  console.log("Errores", errors); // Verifica los errores del formulario

  return (
    <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Formulario EPS</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Tipo de afiliación */}
        <div>
          <InputLabel htmlFor="tipo_afiliacion" value="Tipo de afiliación" />
          <SelectForm
            id="tipo_afiliacion"
            register={register("tipo_afiliacion")}
            url="tipo-afiliacion"
            data_url="tipo_afiliacion_eps"
          />
          <InputErrors errors={errors} name="tipo_afiliacion" />
        </div>

        {/* Nombre de la EPS */}
        <div>
          <InputLabel htmlFor="nombre_eps" value="Nombre EPS" />
          <TextInput id="nombre_eps" {...register("nombre_eps")} placeholder="Nombre de EPS..." />
          <InputErrors errors={errors} name="nombre_eps" />
        </div>

        {/* Estado de afiliación */}
        <div>
          <InputLabel htmlFor="estado_afiliacion" value="Estado de afiliación" />
          <SelectForm
            id="estado_afiliacion"
            register={register("estado_afiliacion")}
            url="estado-afiliacion"
            data_url="estado_afiliacion_eps"
          />
          <InputErrors errors={errors} name="estado_afiliacion" />
        </div>

        {/* Fecha de afiliación efectiva */}
        <div>
          <InputLabel htmlFor="fecha_afiliacion_efectiva" value="Fecha afiliación efectiva" />
          <TextInput
            type="date"
            id="fecha_afiliacion_efectiva"
            {...register("fecha_afiliacion_efectiva")}
          />
          <InputErrors errors={errors} name="fecha_afiliacion_efectiva" />
        </div>

        {/* Fecha finalización */}
        <div>
          <InputLabel htmlFor="fecha_finalizacion_afiliacion" value="Fecha finalización afiliación" />
          <TextInput
            type="date"
            id="fecha_finalizacion_afiliacion"
            {...register("fecha_finalizacion_afiliacion")}
          />
          <InputErrors errors={errors} name="fecha_finalizacion_afiliacion" />
        </div>

        {/* Tipo afiliado */}
        <div>
          <InputLabel htmlFor="tipo_afiliado" value="Tipo afiliado" />
          <SelectForm
            id="tipo_afiliado"
            register={register("tipo_afiliado")}
            url="tipo-afiliado"
            data_url="tipo_afiliado_eps"
          />
          <InputErrors errors={errors} name="tipo_afiliado" />
        </div>

        {/* Número afiliado */}
        <div>
          <InputLabel htmlFor="numero_afiliado" value="Número afiliado" />
          <TextInput
            id="numero_afiliado"
            placeholder="Número afiliado..."
            {...register("numero_afiliado")}
          />
          <InputErrors errors={errors} name="numero_afiliado" />
        </div>

        {/* Archivo */}
        <div className="col-span-full">
          <AdjuntarArchivo
            id="archivo"
            register={register("archivo")}
          />
          <InputErrors errors={errors} name="archivo" />
        </div>
        {existingFile && (
          <div className="text-sm text-gray-700 mt-2">
            <p>Archivo cargado: <a href={existingFile.url} target="_blank" className="text-blue-600 underline">{existingFile.name}</a></p>
          </div>
        )}
        <div className="col-span-full text-center">
          <ButtonPrimary type="submit" value="Guardar" />
        </div>
      </form>
    </div>
  );
};