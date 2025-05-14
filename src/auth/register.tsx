"use client"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "../validaciones/registerSchema"
import axios from "axios"
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom";
import React from "react"

import { SelectForm } from "../componentes/formularios/SelectForm"
import { LabelRadio } from "../componentes/formularios/LabelRadio"
import { ButtonPrimary } from "../componentes/formularios/ButtonPrimary"
import { InputLabel } from "../componentes/formularios/InputLabel"
import TextInput from "../componentes/formularios/TextInput"
import InputErrors from "../componentes/formularios/InputErrors"
import { SelectFormUbicaciones } from "../componentes/formularios/SelectFormUbicacion"

type Inputs = {
  primer_nombre: string;
  primer_apellido: string;
  segundo_nombre?: string;
  segundo_apellido?: string;
  pais: number;
  departamento: number;
  municipio_id: number;
  email: string;
  password: string;
  password_confirmation: string;
  fecha_nacimiento: string;
  genero: "Masculino" | "Femenino" | "Otro";
  tipo_identificacion: string;
  numero_identificacion: string;
  estado_civil: string;
};



const Registro = () => {



  const navigate = useNavigate();
  //Url de la API
  const url = import.meta.env.VITE_API_URL + "/auth/registrar-usuario";
  
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onChange",
    resolver: zodResolver(registerSchema)
  });



  // Estado para el paso del formulario
  const [step, setStep] = React.useState(1);

  // Validacion de los campos del formulario
  const validateStep = async () => {
    if (step === 1) {
      return await trigger(["primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido"]);
    }
    if (step === 2) {
      return await trigger(["tipo_identificacion", "numero_identificacion"]);
    }
    if (step === 3) {
      return await trigger(["estado_civil", "fecha_nacimiento", "genero"]);
    }
    if (step === 4) {
      return await trigger(["pais","departamento", "municipio_id"]);
    }
    if (step === 5) {
      return await trigger(["email", "password", "password_confirmation"]);
    }
    return true;
  };

  // Validar y pasar al siguiente paso 
  const handleNext = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  // Manejo del paso anterior del formulario
  const handlePrev = () => {
    setStep((prev) => prev - 1);
  }


  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const {
      password_confirmation,
      pais,
      departamento,
      ...formData
    } = data;



    const registroPromise = axios.post(url, formData, {
      // Cabeceras de la petición
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Manejo de la respuesta usando toast.promise
    toast.promise(
      registroPromise, {
      pending: "Registrando... Por favor espera.",
      success: {
        render() {
          // Si la respuesta es exitosa, redirigimos y mostramos el mensaje
          return "¡Bienvenido! Redirigiendo...";
        },
        autoClose: 1000,
        onClose: () => navigate("/"), // Redirige a la página principal
      },
      error: {
        render({ data }) {
          let errorMessage = "Error al registrar";

          if (axios.isAxiosError(data)) {
            if (data.code === 'ECONNABORTED') {
              errorMessage = "Tiempo de espera agotado. Intente nuevamente";
            } else if (data.response) {
              switch (data.response.status) {
                case 422:
                  errorMessage = "Email ya existe o numero de identificación ya existe";

                  break;
                case 500:
                  errorMessage = `Error en el servidor: ${data.response.data?.message || "Error desconocido"}`;

                  break;
                default:
                  errorMessage = "Error desconocido";
              }
            } else {
              errorMessage = "Error desconocido";
            }
          }

          return errorMessage;
        },
        autoClose: 5000,
      }
    }
    );


  };


  const paisSeleccionado = watch("pais");
  const departamentoSeleccionado = watch("departamento");


  return (
      <form
        className="flex flex-col items-center justify-center h-screen"
        onSubmit={handleSubmit(onSubmit)} >

        <div className="flex bg-white flex-col gap-4 px-8 py-8 w-[500px] min-h-[550px] shadow-lg justify-around relative rounded-3xl" >
          <div className='flex flex-col gap-x-2 w-full justify-between ' >
            < h3 className="font-bold text-2xl" > Registro </h3>
          </div>
          < div
            className=""
          >
            {step === 1 && (
              <>
                < div className="flex flex-col gap-4" >
                  <div className='font-semibold text-xl' >
                    <h3>¿Eres nuevo? <span className='text-blue-500 font-bold'>Empecemos</span> con tu nombre</h3>
                  </div>
                  <div className="" >
                    <InputLabel htmlFor="primer_nombre" value="Primer nombre" />
                    <TextInput
                      id="primer_nombre"
                      type="text"
                      placeholder="Primer nombre..."
                      {...register("primer_nombre")}
                    />
                    < InputErrors errors={errors} name="primer_nombre" />
                  </div>

                  < div className="" >
                    <InputLabel htmlFor="segundo_nombre" value="Segundo nombre" />
                    <TextInput
                      id="segundo_nombre"
                      type="text"
                      placeholder="Segundo nombre..."
                      {...register("segundo_nombre")}
                    />
                    < InputErrors errors={errors} name="segundo_nombre" />
                  </div>

                  < div className="" >
                    <InputLabel htmlFor="primer_apellido" value="Primer apellido" />
                    <TextInput
                      id="primer_apellido"
                      type="text"
                      placeholder="Primer apellido..."
                      {...register("primer_apellido")}
                    />
                    < InputErrors errors={errors} name="primer_apellido" />
                  </div>

                  < div className="" >
                    <InputLabel htmlFor="segundo_apellido" value="Segundo apellido" />
                    <TextInput
                      id="segundo_apellido"
                      type="text"
                      placeholder="Segundo apellido..."
                      {...register("segundo_apellido")}
                    />
                    < InputErrors errors={errors} name="segundo_apellido" />
                  </div>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                < div className="flex flex-col gap-4" >
                  <div className='font-semibold text-xl' >
                    <h3>¡Sigamos con tu <span className='text-blue-500 font-bold'>identificación</span>!</h3>

                  </div>
                  <div className="" >
                    <InputLabel htmlFor="tipo_identificacion" value="Tipo identificación" />
                    <SelectForm
                      id="tipo_identificacion"
                      register={register("tipo_identificacion")}
                      url="tipos-documento"
                      data_url="tipos_documento"
                    />
                    < InputErrors errors={errors} name="tipo_identificacion" />
                  </div>

                  < div className="" >
                    <InputLabel htmlFor="identificación" value="Numero identificación" />
                    <TextInput
                      id="numero_identificacion"
                      type="number"
                      placeholder="Numero identificación..."
                      {...register("numero_identificacion")}
                    />
                    < InputErrors errors={errors} name="numero_identificacion" />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                < div className='flex flex-col gap-4' >
                  <div className='font-semibold text-xl' >
                    <h3>
                      Ya falta poco, <span className='text-yellow-500 font-bold'>completa</span> esta información.
                    </h3>


                  </div>
                  <div className="" >
                    <InputLabel htmlFor="estado_civil" value="Estado civil" />
                    <SelectForm
                      id="estado_civil"
                      register={register("estado_civil")}
                      url="estado-civil"
                      data_url="estado_civil"
                    />

                    <InputErrors errors={errors} name="estado_civil" />
                  </div>
                  < div className="" >
                    <InputLabel
                      htmlFor="fecha_nacimiento"
                      value="Fecha de nacimiento"
                    />
                    <TextInput
                      id="fecha_nacimiento"
                      type="date"
                      {...register("fecha_nacimiento")}
                    />
                    < InputErrors errors={errors} name="fecha_nacimiento" />
                  </div>

                  < div className="" >
                    <InputLabel htmlFor="genero" value="Género" />

                    <div className="flex flex-row flex-wrap gap-4 rounded-lg border-[1.8px] border-blue-600 bg-slate-100/40 min-h-[44px] px-4">
                      <LabelRadio
                        htmlFor="genero-masculino"
                        value="Masculino"
                        inputProps={register("genero")}
                        label="Masculino"
                      />
                      <LabelRadio
                        htmlFor="genero-femenino"
                        value="Femenino"
                        inputProps={register("genero")}
                        label="Femenino"
                      />
                      <LabelRadio
                        htmlFor="genero-otro"
                        value="Otro"
                        inputProps={register("genero")}
                        label="Otro"
                      />
                    </div>
                    <InputErrors errors={errors} name="genero" />
                  </div>
                </div>
              </>
            )}
            {step === 4 && (
              <>
                < div className="flex flex-col gap-4" >
                  <div className='font-semibold text-xl' >
                    <h3>
                      ¡Sigamos!
                      Ahora tu
                      <span className='text-blue-500 font-bold'> lugar </span> de 
                      <span className='text-yellow-500 font-bold'> nacimiento</span>
                    </h3>

                  </div>
                  <div>
                    <InputLabel htmlFor="pais" value="País" />
                    <SelectFormUbicaciones
                      id="pais"
                      register={register("pais", { valueAsNumber: true, required: true })}
                      url="paises"
                    />
                    <InputErrors errors={errors} name="pais" />
                  </div>

                  <div>
                    <InputLabel htmlFor="departamento" value="Departamento" />
                    <SelectFormUbicaciones
                      id="departamento"
                      register={register("departamento", { valueAsNumber: true, required: true })}
                      parentId={paisSeleccionado}
                      disabled={!paisSeleccionado}
                      url="departamentos"
                    />
                    <InputErrors errors={errors} name="departamento" />
                  </div>

                  <div>
                    <InputLabel htmlFor="municipio_id" value="Municipio" />
                    <SelectFormUbicaciones
                      id="municipio_id"
                      register={register("municipio_id", { valueAsNumber: true, required: true })}
                      parentId={departamentoSeleccionado}
                      disabled={!departamentoSeleccionado}
                      url="municipios"
                    />
                    <InputErrors errors={errors} name="municipio_id" />
                  </div>
                </div>
              </>
            )}
            {step === 5 && (
              <>
                < div className="flex flex-col gap-4" >
                  <div className='font-semibold text-xl' >
                    <h3>
                      ¡Genial!
                      Ahora tu
                      <span className='text-blue-500 font-bold'> correo</span> y
                      <span className='text-yellow-500 font-bold'> contraseña</span>
                    </h3>

                  </div>
                  <div className="" >
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                      id="email"
                      type="text"
                      placeholder="Email..."
                      {...register("email")}
                    />
                    < InputErrors errors={errors} name="email" />
                  </div>

                  < div className="" >
                    <InputLabel htmlFor="password" value="Contraseña" />
                    <TextInput
                      id="password"
                      type="password"
                      placeholder="Contraseña..."
                      {...register("password")}
                    />
                    < InputErrors errors={errors} name="password" />
                  </div>
                  < div className="" >
                    <InputLabel htmlFor="password_confirmation" value="Confirmar contraseña" />
                    <TextInput
                      id="password_confirmation"
                      type="password"
                      placeholder="Confirmar contraseña..."
                      {...register("password_confirmation")}
                    />
                    < InputErrors errors={errors} name="password_confirmation" />
                  </div>
                </div>
              </>
            )}

          </div>
          <div className="flex justify-center gap-8" >
            {step > 1 && <button className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-16 rounded-2xl' type="button" onClick={handlePrev}>Anterior</button>}
            {step < 5 ? (<button className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-16 rounded-2xl' type="button" onClick={handleNext}>Siguiente</button>) : (
              <ButtonPrimary
                className="w-full bg-green-500 text-white hover:bg-green-600"

                type='submit'
                value='Registrarse'
              />
            )}
          </div>
          <p className="text-base text-gray-500 text-center">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/inicio-sesion" className="text-blue-500 hover:text-blue-600">
              Iniciar sesión
            </Link>
          </p>
          <div className='absolute size-full right-0 rotate-5 rounded-3xl -z-10  bg-blue-500'></div>
        </div>
      </form>

  )
}
export default Registro