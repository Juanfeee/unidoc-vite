"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { epsSchema, epsSchemaUpdate } from "../validaciones/epsSchema";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { InputLabel } from "../componentes/formularios/InputLabel";
import { SelectForm } from "../componentes/formularios/SelectForm";
import InputErrors from "../componentes/formularios/InputErrors";
import TextInput from "../componentes/formularios/TextInput";
import { ButtonPrimary } from "../componentes/formularios/ButtonPrimary";
import { AdjuntarArchivo } from "../componentes/formularios/AdjuntarArchivo";
import { MostrarArchivo } from "../componentes/formularios/MostrarArchivo";
import { useArchivoPreview } from "../hooks/ArchivoPreview";
import axiosInstance from "../utils/axiosConfig";
import { RolesValidos } from "../types/roles";
import { jwtDecode } from "jwt-decode";

type Inputs = {
  tipo_afiliacion: string;
  nombre_eps: string;
  estado_afiliacion: string;
  fecha_afiliacion_efectiva: string;
  fecha_finalizacion_afiliacion?: string;
  tipo_afiliado: string;
  numero_afiliado?: string;
  archivo?: FileList;
};

export const EpsFormulario = () => {
  const token = Cookies.get("token");
  if (!token) throw new Error("No authentication token found");
  const decoded = jwtDecode<{ rol: RolesValidos }>(token);
  const rol = decoded.rol;

  const [isEpsRegistered, setIsEpsRegistered] = useState(false);

  const schema = isEpsRegistered ? epsSchemaUpdate : epsSchema;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const archivoValue = watch("archivo");

  const { existingFile, setExistingFile } = useArchivoPreview(archivoValue);

  // Traer los datos del usuario al cargar el componente
  const fetchEpsData = async () => {
    try {
      const ENDPOINTS = {
        Aspirante: `${import.meta.env.VITE_API_URL}${
          import.meta.env.VITE_ENDPOINT_OBTENER_EPS_ASPIRANTE
        }`,
        Docente: `${import.meta.env.VITE_API_URL}${
          import.meta.env.VITE_ENDPOINT_OBTENER_EPS_DOCENTE
        }`,
      };
      const endpoint = ENDPOINTS[rol];
      const response = await axiosInstance.get(endpoint);

      const data = response.data.eps;
      if (data) {
        setIsEpsRegistered(true);
        setValue("tipo_afiliacion", data.tipo_afiliacion || "");
        setValue("nombre_eps", data.nombre_eps || "");
        setValue("estado_afiliacion", data.estado_afiliacion || "");
        setValue(
          "fecha_afiliacion_efectiva",
          data.fecha_afiliacion_efectiva || ""
        );
        setValue(
          "fecha_finalizacion_afiliacion",
          data.fecha_finalizacion_afiliacion || ""
        );
        setValue("tipo_afiliado", data.tipo_afiliado || "");
        setValue("numero_afiliado", data.numero_afiliado || "");

        if (data.documentos_eps && data.documentos_eps.length > 0) {
          const archivo = data.documentos_eps[0];
          setExistingFile({
            url: archivo.archivo_url,
            name: archivo.archivo.split("/").pop() || "Archivo existente",
          });
        }
      } else {
        setIsEpsRegistered(false);
        console.log("No se encontraron datos de EPS para el usuario.");
      }
    } catch (error) {
      console.error("Error al cargar los datos del usuario:", error);
    }
  };

  useEffect(() => {
    fetchEpsData();
  }, []);

  // Enviar los datos del formulario
  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const formData = new FormData();
    formData.append("tipo_afiliacion", data.tipo_afiliacion);
    formData.append("nombre_eps", data.nombre_eps);
    formData.append("estado_afiliacion", data.estado_afiliacion);
    formData.append(
      "fecha_afiliacion_efectiva",
      data.fecha_afiliacion_efectiva
    );
    formData.append(
      "fecha_finalizacion_afiliacion",
      data.fecha_finalizacion_afiliacion || ""
    );
    formData.append("tipo_afiliado", data.tipo_afiliado);
    formData.append("numero_afiliado", data.numero_afiliado || "");

    if (data.archivo && data.archivo.length > 0) {
      formData.append("archivo", data.archivo[0]);
    }

    // Agregar `_method` si es actualización
    if (isEpsRegistered) {
      formData.append("_method", "PUT");
    }
    const ENDPOINTS_POST = {
      Aspirante: {
        crear: import.meta.env.VITE_ENDPOINT_CREAR_EPS_ASPIRANTE,
        actualizar: import.meta.env.VITE_ENDPOINT_ACTUALIZAR_EPS_ASPIRANTE,
      },
      Docente: {
        crear: import.meta.env.VITE_ENDPOINT_CREAR_EPS_DOCENTE,
        actualizar: import.meta.env.VITE_ENDPOINT_ACTUALIZAR_EPS_DOCENTE,
      },
    };

    const url = `${import.meta.env.VITE_API_URL}${
      isEpsRegistered
        ? ENDPOINTS_POST[rol].actualizar
        : ENDPOINTS_POST[rol].crear
    }`;

    try {
      await toast.promise(axiosInstance.post(url, formData), {
        pending: "Enviando datos...",
        success: {
          render() {
            setIsEpsRegistered(true); // Actualiza el estado después de guardar
            return "Datos guardados correctamente";
          },
        },
        error: "Error al guardar los datos",
      });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  console.log("errors", errors);
  return (
    <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Formulario EPS</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
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
          <TextInput
            id="nombre_eps"
            {...register("nombre_eps")}
            placeholder="Nombre de EPS..."
          />
          <InputErrors errors={errors} name="nombre_eps" />
        </div>

        {/* Estado de afiliación */}
        <div>
          <InputLabel
            htmlFor="estado_afiliacion"
            value="Estado de afiliación"
          />
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
          <InputLabel
            htmlFor="fecha_afiliacion_efectiva"
            value="Fecha afiliación efectiva"
          />
          <TextInput
            type="date"
            id="fecha_afiliacion_efectiva"
            {...register("fecha_afiliacion_efectiva")}
          />
          <InputErrors errors={errors} name="fecha_afiliacion_efectiva" />
        </div>

        {/* Fecha finalización */}
        <div>
          <InputLabel
            htmlFor="fecha_finalizacion_afiliacion"
            value="Fecha finalización afiliación"
          />
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
            nombre="EPS"
          />
          <InputErrors errors={errors} name="archivo" />
          <MostrarArchivo file={existingFile} />
        </div>

        <div className="col-span-full text-center">
          <ButtonPrimary type="submit" value="Guardar" />
        </div>
      </form>
    </div>
  );
};
