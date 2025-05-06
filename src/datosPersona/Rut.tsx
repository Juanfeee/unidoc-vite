"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { rutSchema } from "../validaciones/rutSchema";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { InputLabel } from "../componentes/formularios/InputLabel";
import TextInput from "../componentes/formularios/TextInput";
import InputErrors from "../componentes/formularios/InputErrors";
import { SelectForm } from "../componentes/formularios/SelectForm";
import { ButtonPrimary } from "../componentes/formularios/ButtonPrimary";

type Inputs = {
  numero_rut: string;
  razon_social: string;
  tipo_persona: string;
  codigo_ciiu: string;
  responsabilidades_tributarias: string;
  archivo: FileList;
};

export const Rut = () => {
  const [isRutRegistered, setIsRutRegistered] = useState(false); // Estado para verificar si ya existe un RUT

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(rutSchema),
    defaultValues: {},
  });

  // Cargar los datos del usuario al montar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("token");
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/aspirante/obtener-rut`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 20000,
        });

        const data = response.data.rut;
        if (data) {
          setIsRutRegistered(true); // Ya existe un RUT registrado
          setValue("numero_rut", data.numero_rut);
          setValue("razon_social", data.razon_social);
          setValue("tipo_persona", data.tipo_persona);
          setValue("codigo_ciiu", data.codigo_ciiu);
          setValue("responsabilidades_tributarias", data.responsabilidades_tributarias);
        } else {
          setIsRutRegistered(false); // No hay RUT registrado
        }
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, [setValue]);

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

    // Agregar `_method` para indicar al backend que es una solicitud `PUT`
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
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 10000,
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

  return (
    <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Formulario RUT</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Número RUT */}
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

        <div className="col-span-full text-center">
          <ButtonPrimary type="submit" value="Guardar" />
        </div>
      </form>
    </div>
  );
};