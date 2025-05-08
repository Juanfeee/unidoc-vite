"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { productionSchema } from "../../validaciones/productionSchema";
import { ButtonRegresar } from "../../componentes/formularios/ButtonRegresar";
import { Link } from "react-router";
import { InputLabel } from "../../componentes/formularios/InputLabel";
import InputErrors from "../../componentes/formularios/InputErrors";
import TextInput from "../../componentes/formularios/TextInput";
import { ButtonPrimary } from "../../componentes/formularios/ButtonPrimary";
import { SelectFormProduccionAcademica } from "../../componentes/formularios/SelectFormProduccion";

type Inputs = {
  productos_academicos: number;
  titulo: string;
  ambitos_divulgacion: string;
  numero_autores: string;
  medio_divulgacion: string;
  fecha_divulgacion: string;
};

const AgregarProduccion = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(productionSchema) });

  const produccionSeleccionado = watch("productos_academicos");
  return (
    <>
      <form
        className="flex flex-col gap-y-4 rounded-md lg:w-[800px] xl:w-[1000px] 2xl:w-[1200px] m-auto relative"
        onSubmit={handleSubmit(() => {
          console.log("Formulario enviado");
          alert("Formulario enviado");
        })}
      >
        <div className="flex flex-col sm:grid grid-cols-3  
        bg-white gap-y-10  py-12 px-8 rounded-xl">
          <div className='flex gap-x-4 col-span-full' >
            <Link to={"/index"}>
              <ButtonRegresar />
            </Link>
            <h3 className="font-bold text-3xl col-span-full">
              Agregar producción académica
            </h3>
          </div>
          <div className="flex flex-col sm:grid sm:grid-cols-2 sm:col-span-full gap-4">
            <div className="flex flex-col w-full">
              <InputLabel htmlFor="productos_academicos" value="Productos academicos" />
              <SelectFormProduccionAcademica
                  id="productos_academicos"
                  register={register("productos_academicos")}
                  url="productos_academicos"
                />
              <InputErrors errors={errors} name="productos_academicos" />
            </div>
            <div>
              <InputLabel htmlFor="ambito_divulgacion" value="Ambito de divulgación" />
              <SelectFormProduccionAcademica
                id="ambitos_divulgacion"
                register={register("ambitos_divulgacion")}
                parentId={produccionSeleccionado}
                url="ambitos_divulgacion"
              />
              <InputErrors errors={errors} name="ambitos_divulgacion" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 col-span-full gap-4">
            <div className="flex flex-col w-full">
              <InputLabel htmlFor="titulo" value="Título" />
              <TextInput
                id="titulo"
                placeholder="Titulo"
                {...register("titulo")}
              />
              <InputErrors errors={errors} name="titulo" />
            </div>
            <div className="flex flex-col w-full">
              <InputLabel htmlFor="numero_autores" value="Número de autores" />
              <TextInput
                type="number"
                id="numero_autores"
                placeholder="Numero de autores..."
                {...register("numero_autores")}
              />
              <InputErrors errors={errors} name="numero_autores" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 col-span-full gap-4">
            <div className="flex flex-col w-full">
              <InputLabel
                htmlFor="medio_divulgacion"
                value="Medio de divulgación"
              />
              <TextInput
                id="medio_divulgacion"
                placeholder="medio_divulgacion"
                {...register("medio_divulgacion")}
              />
              <InputErrors errors={errors} name="medio_divulgacion" />
            </div>
            <div className="flex flex-col w-full">
              <InputLabel
                htmlFor="fecha_divulgacion"
                value="Fecha de divulgación"
              />
              <TextInput
                id="fecha_divulgacion"
                type="date"
                {...register("fecha_divulgacion")}
              />
              <InputErrors errors={errors} name="fecha_divulgacion" />
            </div>
          </div>
          <div className="flex justify-center col-span-full">
            <ButtonPrimary value="Agregar producción" />
          </div>
        </div>
      </form>
    </>
  );
};
export default AgregarProduccion;
