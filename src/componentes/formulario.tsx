"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { ButtonPrimary } from "./formularios/ButtonPrimary";
import { Inputs } from "@/types/inputs";
import { useState } from "react";
import axios from "axios";
import Coockie from "js-cookie";
import { toast } from "react-toastify";

type FormularioProps = {
  Componente: React.ComponentType<any>;
  Schema: any;
  Texto: string;
  Ruta: string;
};

export const Formulario = ({ Componente, Schema, Texto, Ruta, }: FormularioProps) => {
  const [acordeonAbierto, setAcordeonAbierto] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(Schema) });

  const toggleAcordeon = () => setAcordeonAbierto(!acordeonAbierto);

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    const token = Coockie.get("token");
    if (!token) {
      toast.error("No hay token de autenticación");
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}${Ruta}`;

    toast.promise(
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
            return "Datos guardados correctamente";
          },
          autoClose: 1000 // Cerrar el toast después de 2 segundos,
        },
        error: {
          render() {
            return "Error al guardar los datos";


          },
        }
      }
    );

  };



  return (
    <>
      <div className="bg-white w-full rounded-2xl shadow-md ">
        <div
          className={`acordeon-titulo flex justify-between items-center py-4 px-6 cursor-pointer ${acordeonAbierto ? 'active' : ''}`}
          onClick={toggleAcordeon}
        >
          <h3 className="font-bold text-2xl">{Texto}</h3>
          <span className="acordeon-icono text-3xl">
            {acordeonAbierto ? '−' : '+'}
          </span>
        </div>

        <div className={`acordeon-contenido ${acordeonAbierto ? 'block' : 'hidden'} flex flex-col`}>
          <form 
            className="flex flex-col gap-y-4"
            onSubmit={handleSubmit(onSubmit)}>
            {Componente && (
              <Componente
                watch={watch}
                setValue={setValue}
                register={register}
                errors={errors}
              />
            )}

            <div className="bg-white p-5 flex justify-center">
              <ButtonPrimary
                type="submit"
                value={"Guardar"}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};