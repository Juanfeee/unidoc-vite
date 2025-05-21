"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
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
import { RolesValidos } from "../types/roles";
import axiosInstance from "../utils/axiosConfig";
import { jwtDecode } from "jwt-decode";

type Inputs = {
  numero_rut: string;
  razon_social: string;
  tipo_persona: string;
  codigo_ciiu: string;
  responsabilidades_tributarias: string;
  archivo?: FileList;
};

export const Rut = () => {
  const token = Cookies.get("token");
  if (!token) throw new Error("No authentication token found");
  const decoded = jwtDecode<{ rol: RolesValidos }>(token);
  const rol = decoded.rol;
  
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
  });

  const archivoValue = watch("archivo");

  const { existingFile, setExistingFile } = useArchivoPreview(archivoValue);

  //Traer los datos del usuario al cargar el componente
  const fetchUserData = async () => {
    try {
      const ENDPOINTS = {
        Aspirante: `${import.meta.env.VITE_API_URL}${
          import.meta.env.VITE_ENDPOINT_OBTENER_RUT_ASPIRANTE
        }`,
        Docente: `${import.meta.env.VITE_API_URL}${
          import.meta.env.VITE_ENDPOINT_OBTENER_RUT_DOCENTE
        }`,
      };
      const endpoint = ENDPOINTS[rol];
      const response = await axiosInstance.get(endpoint);
      const data = response.data.rut;
      if (data) {
        setIsRutRegistered(true);
        setValue("numero_rut", data.numero_rut);
        setValue("razon_social", data.razon_social);
        setValue("tipo_persona", data.tipo_persona);
        setValue("codigo_ciiu", data.codigo_ciiu);
        setValue(
          "responsabilidades_tributarias",
          data.responsabilidades_tributarias
        );

        if (data.documentos_rut && data.documentos_rut.length > 0) {
          const archivo = data.documentos_rut[0];
          setExistingFile({
            url: archivo.archivo_url,
            name: archivo.archivo.split("/").pop() || "Archivo existente",
          });
        }
      } else {
        console.log("No se encontraron datos del RUT");
      }
    } catch (error) {
      console.error("Error al cargar los datos del usuario:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const formData = new FormData();
    formData.append("numero_rut", data.numero_rut);
    formData.append("razon_social", data.razon_social);
    formData.append("tipo_persona", data.tipo_persona);
    formData.append("codigo_ciiu", data.codigo_ciiu);
    formData.append(
      "responsabilidades_tributarias",
      data.responsabilidades_tributarias
    );

    if (data.archivo && data.archivo.length > 0) {
      formData.append("archivo", data.archivo[0]);
    }

    // Agregar `_method` si es actualización
    if (isRutRegistered) {
      formData.append("_method", "PUT");
    }

    const ENDPOINTS_POST = {
      Aspirante: {
        crear: import.meta.env.VITE_ENDPOINT_CREAR_RUT_ASPIRANTE,
        actualizar: import.meta.env.VITE_ENDPOINT_ACTUALIZAR_RUT_ASPIRANTE,
      },
      Docente: {
        crear: import.meta.env.VITE_ENDPOINT_CREAR_RUT_DOCENTE,
        actualizar: import.meta.env.VITE_ENDPOINT_ACTUALIZAR_RUT_DOCENTE,
      },
    };

    const url = `${import.meta.env.VITE_API_URL}${
      isRutRegistered
        ? ENDPOINTS_POST[rol].actualizar
        : ENDPOINTS_POST[rol].crear
    }`;
    try {
      await toast.promise(axiosInstance.post(url, formData), {
        pending: "Enviando datos...",
        success: {
          render() {
            setIsRutRegistered(true);
            return "Datos guardados correctamente";
          },
        },
        error: "Error al guardar los datos",
      });
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Formulario RUT</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        <div>
          <InputLabel htmlFor="numero_rut" value="Número RUT" />
          <TextInput
            className="w-full"
            id="numero_rut"
            type="text"
            placeholder="Número RUT..."
            {...register("numero_rut")}
          />
          <InputErrors errors={errors} name="numero_rut" />
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
          <InputLabel htmlFor="tipo_persona" value="Tipo de persona" />
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
          <InputLabel
            htmlFor="responsabilidades_tributarias"
            value="Responsabilidades tributarias"
          />
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
            nombre="RUT"
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
