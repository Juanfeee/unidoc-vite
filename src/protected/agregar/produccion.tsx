"use client";
import { AdjuntarArchivo } from "@/app/componentes/formularios/AdjuntarArchivo";
import { ButtonPrimary } from "@/app/componentes/formularios/ButtonPrimary";
import { ButtonRegresar } from "@/app/componentes/formularios/ButtonRegresar";
import InputErros from "@/app/componentes/formularios/InputErrors";
import { InputLabel } from "@/app/componentes/formularios/InputLabel";
import { SelectForm } from "@/app/componentes/formularios/SelectForm";
import TextInput from "@/app/componentes/formularios/TextInput";
import { productionSchema } from "@/validaciones/productionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

type Props = {};
type Inputs = {
  tipo_produccion: string;
  titulo: string;
  tipo_ambito_divulgacion: string;
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

  console.log("AgregarProduccion", watch());
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
            <Link href={"/index"}>
              <ButtonRegresar />
            </Link>
            <h3 className="font-bold text-3xl col-span-full">
              Agregar producción académica
            </h3>
          </div>
          <div className="flex flex-col sm:grid sm:grid-cols-2 sm:col-span-full gap-4">
            <div className="flex flex-col w-full">
              <InputLabel htmlFor="tipo_produccion" value="Tipo de estudio" />
              <SelectForm
                id="tipo_produccion"
                register={register("tipo_produccion")}
              />
              <InputErros errors={errors} name="tipo_produccion" />
            </div>
            <div className="flex flex-col w-full">
              <InputLabel
                htmlFor="tipo_ambito_divulgacion"
                value="Ambito divulgación"
              />
              <TextInput
                placeholder="Ambito divulgacion"
                id="tipo_ambito_divulgacion"
                {...register("tipo_ambito_divulgacion")}
              />
              <InputErros errors={errors} name="tipo_ambito_divulgacion" />
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
              <InputErros errors={errors} name="titulo" />
            </div>
            <div className="flex flex-col w-full">
              <InputLabel htmlFor="numero_autores" value="Número de autores" />
              <TextInput
                type="number"
                id="numero_autores"
                placeholder="Numero de autores..."
                {...register("numero_autores")}
              />
              <InputErros errors={errors} name="numero_autores" />
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
              <InputErros errors={errors} name="medio_divulgacion" />
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
              <InputErros errors={errors} name="fecha_divulgacion" />
            </div>
          </div>
          <AdjuntarArchivo
            id="adjuntar_archivo"
            value="Adjuntar archivo de producción académica"
          />
          <div className="flex justify-center col-span-full">
            <ButtonPrimary value="Agregar producción" />
          </div>
        </div>
      </form>
    </>
  );
};
export default AgregarProduccion;
