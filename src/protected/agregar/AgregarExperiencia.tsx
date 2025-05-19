"use client";
import Cookies from 'js-cookie';
import axios from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { experienciaSchema } from '../../validaciones/experienceSchema';
import {useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router';
import { ButtonRegresar } from '../../componentes/formularios/ButtonRegresar';
import { InputLabel } from '../../componentes/formularios/InputLabel';
import { SelectForm } from '../../componentes/formularios/SelectForm';
import InputErrors from '../../componentes/formularios/InputErrors';
import TextInput from '../../componentes/formularios/TextInput';
import { ButtonPrimary } from '../../componentes/formularios/ButtonPrimary';
import { AdjuntarArchivo } from '../../componentes/formularios/AdjuntarArchivo';
import { LabelRadio } from '../../componentes/formularios/LabelRadio';
import { useArchivoPreview } from '../../hooks/ArchivoPreview';
import { MostrarArchivo } from '../../componentes/formularios/MostrarArchivo';

type Inputs = {
  tipo_experiencia: string;
  institucion_experiencia: string;
  trabajo_actual: "Si" | "No";
  cargo: string;
  intensidad_horaria: string;
  experiencia_universidad: "Si" | "No";
  fecha_inicio: string;
  fecha_finalizacion?: string;
  fecha_expedicion_certificado?: string;
  archivo: FileList;
};

const AgregarExperiencia = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    setValue,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(experienciaSchema),
    defaultValues: {
      experiencia_universidad: "No",
    },
  });


  const archivoValue = watch('archivo')
  const { existingFile } = useArchivoPreview(archivoValue);

  const experiencia_universidad = watch("experiencia_universidad");


  useEffect(() => {
    if (experiencia_universidad === "Si") {
      setValue("institucion_experiencia", "Corporación Universitaria Autónoma del Cauca");
    } else {
      setValue("institucion_experiencia", "");
    }
  }, [experiencia_universidad, setValue]);


  const trabajo_actual = watch("trabajo_actual");
  useEffect(() => {
    if (trabajo_actual === "Si") {
      setValue("fecha_finalizacion", "");
    }
  }, [trabajo_actual, setValue]);

  const onSubmit: SubmitHandler<Inputs> = async () => {
    setIsSubmitting(true);

    try {
    const formValues = {
      tipo_experiencia: watch('tipo_experiencia'),
      institucion_experiencia: watch('institucion_experiencia'),
      trabajo_actual: watch('trabajo_actual'),
      cargo: watch('cargo'),
      intensidad_horaria: watch('intensidad_horaria'),
      fecha_inicio: watch('fecha_inicio'),
      fecha_finalizacion: watch('fecha_finalizacion'),
      fecha_expedicion_certificado: watch('fecha_expedicion_certificado'),
      archivo: watch('archivo')
    };

    const formData = new FormData();
    formData.append('tipo_experiencia', formValues.tipo_experiencia);
    formData.append('institucion_experiencia', formValues.institucion_experiencia);
    formData.append('trabajo_actual', formValues.trabajo_actual);
    formData.append('cargo', formValues.cargo);
    formData.append('intensidad_horaria', formValues.intensidad_horaria);
    formData.append('fecha_inicio', formValues.fecha_inicio);
    formData.append('fecha_finalizacion', formValues.fecha_finalizacion || "");
    formData.append('fecha_expedicion_certificado', formValues.fecha_expedicion_certificado || "");

    if (formValues.archivo && formValues.archivo[0]) {
      formData.append('archivo', formValues.archivo[0]);
    }

    const token = Cookies.get("token");
    if (!token) {
      toast.error("No hay token de autenticación");
      return;
    }

    const url = `${import.meta.env.VITE_API_URL}/aspirante/crear-experiencia`;

    const postPromise = axios.post(url, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 20000
    });

    await toast.promise(postPromise, {
      pending: "Enviando datos...",
      success: {
        render() {
          // Redirige después de guardar
          setTimeout(() => {
            window.location.href = "/index";
          }, 1500);
          return "Datos guardados correctamente";
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
              if (errores && typeof errores === 'object') {
                const mensajes = Object.values(errores)
                  .flat()
                  .join('\n');
                return `Errores del formulario:\n${mensajes}`;
              }
              return error.response.data?.message || "Error al guardar los datos.";
            } else if (error.request) {
              return "No se recibió respuesta del servidor.";
            }
          }
          return "Error inesperado al guardar los datos.";
        },
        autoClose: 3000,
      },
    });
    }
    catch (error) {
      console.error("Error al enviar el formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex flex-col bg-white p-8 rounded-xl shadow-md w-full max-w-4xl mx-auto gap-y-4">
      <div className="flex gap-x-4 col-span-full items-center">
        <Link to={"/index"}>
          <ButtonRegresar />
        </Link>
        <h3 className="font-bold text-3xl col-span-full">Agregar experiencia</h3>
      </div>

      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Tipo de experiencia */}
        <div className="col-span-full">
          <InputLabel htmlFor="tipo_experiencia" value="Tipo de experiencia" />
          <SelectForm
            id="tipo_experiencia"
            register={register('tipo_experiencia')}
            url="tipos-experiencia"
            data_url="tipo_experiencia"
          />
          <InputErrors errors={errors} name="tipo_experiencia" />
        </div>

        {/* Experiencia en universidad en universidad del cauca */}
        <div className="col-span-full">
          <InputLabel htmlFor="experiencia_universidad" value="Experiencia en universidad autónoma" />
          <div className="flex flex-row flex-wrap gap-4 rounded-lg border-[1.8px] border-blue-600 bg-slate-100/40 h-[44px] px-4">
            <LabelRadio
              htmlFor="experiencia-si"
              value="Si"
              inputProps={register("experiencia_universidad")}
              label="Sí"
            />
            <LabelRadio
              htmlFor="experiencia_universidad-no"
              value="No"
              inputProps={register("experiencia_universidad")}
              label="No"
            />
          </div>
          <InputErrors errors={errors} name="experiencia_universidad" />
        </div>

        {/* Institución */}
        <div className="">
          <InputLabel htmlFor="institucion_experiencia" value="Institución" />
          <TextInput
            id="institucion_experiencia"
            placeholder="Institución"
            {...register('institucion_experiencia')}
          />
          <InputErrors errors={errors} name="institucion_experiencia" />
        </div>

        {/* Cargo */}
        <div className="">
          <InputLabel htmlFor="cargo" value="Cargo" />
          <TextInput
            id="cargo"
            placeholder="Cargo"
            {...register('cargo')}
          />
          <InputErrors errors={errors} name="cargo" />
        </div>

        {/* Trabajo actual */}
        <div className="flex flex-col w-full">
          <InputLabel htmlFor="trabajo_actual" value="¿Es su trabajo actual?" />
          <div className="flex flex-row flex-wrap gap-4 rounded-lg border-[1.8px] border-blue-600 bg-slate-100/40 h-[44px] px-4">
            <LabelRadio
              htmlFor="trabajo_actual-si"
              value="Si"
              inputProps={register("trabajo_actual")}
              label="Sí"
            />
            <LabelRadio
              htmlFor="trabajo_actual-no"
              value="No"
              inputProps={register("trabajo_actual")}
              label="No"
            />
          </div>
          <InputErrors errors={errors} name="trabajo_actual" />
        </div>

        {/* Intensidad horaria */}
        <div className="">
          <InputLabel htmlFor="intensidad_horaria" value="Intensidad horaria (Horas)" />
          <TextInput
            type="number"
            id="intensidad_horaria"
            placeholder="Intensidad horaria"
            {...register('intensidad_horaria')}
          />
          <InputErrors errors={errors} name="intensidad_horaria" />
        </div>

        {/* Fechas */}
        <div className="">
          <InputLabel htmlFor="fecha_inicio" value="Fecha de inicio" />
          <TextInput
            type="date"
            id="fecha_inicio"
            {...register('fecha_inicio')}
          />
          <InputErrors errors={errors} name="fecha_inicio" />
        </div>
        {watch("trabajo_actual") === "No" && (
          <div className="">
            <InputLabel htmlFor="fecha_finalizacion" value="Fecha de finalización" />
            <TextInput
              type="date"
              id="fecha_finalizacion"
              {...register('fecha_finalizacion')}
            />
            <InputErrors errors={errors} name="fecha_finalizacion" />
          </div>
        )}

        <div>
          <InputLabel htmlFor="fecha_expedicion_certificado" value="Fecha de expedición del certificado" />
          <TextInput
            type="date"
            id="fecha_expedicion_certificado"
            placeholder="Fecha expedicion de certificado"
            {...register('fecha_expedicion_certificado')}
          />
          <InputErrors errors={errors} name="fecha_expedicion_certificado" />
        </div>

        {/* Archivo */}
        <div className="col-span-full">
          <InputLabel htmlFor="archivo" value="Archivo" />
          <AdjuntarArchivo
            id="archivo"
            register={register('archivo')}
          />
          <InputErrors errors={errors} name="archivo" />
          <MostrarArchivo file={existingFile} />
        </div>

        {/* Botón */}
        <div className="flex justify-center col-span-full">
          <ButtonPrimary
            value={isSubmitting ? "Enviando..." : "Agregar experiencia"}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>

  );
};

export default AgregarExperiencia;