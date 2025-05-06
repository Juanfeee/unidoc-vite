"use client"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "../validaciones/registerSchema"
import axios from "axios"
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"

import { SelectForm } from "../componentes/formularios/SelectForm"
import { LabelRadio } from "../componentes/formularios/LabelRadio"
import { ButtonPrimary } from "../componentes/formularios/ButtonPrimary"
import { InputLabel } from "../componentes/formularios/InputLabel"
import TextInput from "../componentes/formularios/TextInput"
import InputErrors from "../componentes/formularios/InputErrors"

type Inputs = {
  pais: string
  departamento: string
  municipio: string
  email: string
  password: string
  password_confirmation: string
  primer_nombre: string
  segundo_nombre?: string
  primer_apellido: string
  segundo_apellido?: string
  fecha_nacimiento: string
  genero: "Masculino" | "Femenino" | "Otro"
  estado_civil: string
  tipo_identificacion: string
  numero_identificacion: string
}

interface LocationOption {
  value: string;
  label: string;
}

const Registro = () => {

  useEffect(() => {
    document.title = "Registro"
  })

  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL + "/auth/registrar-usuario";

  // States for all selects
  const [tipoIdentificacion, setTipoIdentificacion] = useState<LocationOption[]>([]);
  const [estadoCivil, setEstadoCivil] = useState<LocationOption[]>([]);
  const [paises, setPaises] = useState<LocationOption[]>([]);
  const [departamentos, setDepartamentos] = useState<LocationOption[]>([]);
  const [municipios, setMunicipios] = useState<LocationOption[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onChange",
    resolver: zodResolver(registerSchema),
  });

  // Fetch tipo identificación
  useEffect(() => {
    const fetchTipoIdentificacion = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/constantes/tipos-documento`, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        });

        const tipos = response.data.tipos_documento;
        setTipoIdentificacion(tipos.map((tipo: string) => ({
          value: tipo,
          label: tipo
        })));
      } catch (error) {
        console.error("Error al cargar las opciones de tipo de identificación", error);
      }
    };

    fetchTipoIdentificacion();
  }, []);

  // Fetch estado civil
  useEffect(() => {
    const fetchEstadoCivil = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/constantes/estado-civil`, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        });

        const estados = response.data.estado_civil;
        setEstadoCivil(estados.map((estado: string) => ({
          value: estado,
          label: estado
        })));
      } catch (error) {
        console.error("Error al cargar las opciones de estado civil", error);
      }
    };

    fetchEstadoCivil();
  }, []);

  // Fetch países
  useEffect(() => {
    const fetchPaises = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/ubicaciones/paises`, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        });

        if (Array.isArray(response.data)) {
          const opcionesFormateadas = response.data.map((pais: { id_pais: number; nombre: string }) => ({
            value: pais.id_pais.toString(),
            label: pais.nombre
          }));
          setPaises(opcionesFormateadas);
        }
      } catch (error) {
        console.error("Error al cargar las opciones de paises", error);
      }
    };

    fetchPaises();
  }, []);

  // Fetch departamentos based on selected país
  useEffect(() => {
    const paisId = watch("pais");

    const fetchDepartamentos = async () => {
      if (!paisId) {
        setDepartamentos([]);
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/ubicaciones/departamentos/${paisId}`, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        });

        if (Array.isArray(response.data)) {
          const opcionesFormateadas = response.data.map((depto: { id_departamento: number; nombre: string }) => ({
            value: depto.id_departamento.toString(),
            label: depto.nombre
          }));
          setDepartamentos(opcionesFormateadas);
          setMunicipios([]);
        }
      } catch (error) {
        console.error("Error al cargar las opciones de departamentos", error);
      }
    };

    fetchDepartamentos();
  }, [watch("pais")]);

  // Fetch municipios based on selected departamento
  useEffect(() => {
    const departamentoId = watch("departamento");

    const fetchMunicipios = async () => {
      if (!departamentoId) {
        setMunicipios([]);
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/ubicaciones/municipios/${departamentoId}`, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        });

        if (Array.isArray(response.data)) {
          const opcionesFormateadas = response.data.map((muni: { id_municipio: number; nombre: string }) => ({
            value: muni.id_municipio.toString(),
            label: muni.nombre
          }));
          setMunicipios(opcionesFormateadas);
        }
      } catch (error) {
        console.error("Error al cargar las opciones de municipios", error);
      }
    };

    fetchMunicipios();
  }, [watch("departamento")]);

  const [step, setStep] = React.useState(1);


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
      return await trigger(["pais", "departamento", "municipio"]);
    }
    if (step === 5) {
      return await trigger(["email", "password", "password_confirmation"]);
    }
    return true;
  };


  const handleNext = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };


  const handlePrev = () => {
    setStep((prev) => prev - 1);
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = {
      ...data,
      municipio_id: data.municipio
    };

    try {

      await axios.post(url, formData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });

      toast.success("¡Bienvenido! Redirigiendo...", {
        autoClose: 1000,
        position: "top-center",
        onClose: () => navigate("/")
      });
    } catch (error) {
      let errorMessage = "Error al registrar";

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = "Tiempo de espera agotado. Intente nuevamente";
        } else if (error.response) {
          switch (error.response.status) {
            case 422:
              errorMessage = "Email ya existe";
              break;
            case 500:
              errorMessage = "Error en el servidor";
              break;
            default:
              errorMessage = "Error desconocido";
          }

        }
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000
      });
    }

  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex bg-white flex-col gap-4 px-8 py-8 w-[500px] min-h-[550px] shadow-lg justify-around relative rounded-3xl">
        <div className='flex flex-col gap-x-2 w-full justify-between'>
          <h3 className="font-bold text-2xl">Registro</h3>
        </div>

        <div className="">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className='font-semibold text-xl'>
                <h3>¿Eres nuevo? <span className='text-blue-500 font-bold'>Empecemos</span> con tu nombre</h3>
              </div>
              <div>
                <InputLabel htmlFor="primer_nombre" value="Primer nombre" />
                <TextInput
                  id="primer_nombre"
                  type="text"
                  placeholder="Primer nombre..."
                  {...register("primer_nombre")}
                />
                <InputErrors errors={errors} name="primer_nombre" />
              </div>

              <div>
                <InputLabel htmlFor="segundo_nombre" value="Segundo nombre" />
                <TextInput
                  id="segundo_nombre"
                  type="text"
                  placeholder="Segundo nombre..."
                  {...register("segundo_nombre")}
                />
                <InputErrors errors={errors} name="segundo_nombre" />
              </div>

              <div>
                <InputLabel htmlFor="primer_apellido" value="Primer apellido" />
                <TextInput
                  id="primer_apellido"
                  type="text"
                  placeholder="Primer apellido..."
                  {...register("primer_apellido")}
                />
                <InputErrors errors={errors} name="primer_apellido" />
              </div>

              <div>
                <InputLabel htmlFor="segundo_apellido" value="Segundo apellido" />
                <TextInput
                  id="segundo_apellido"
                  type="text"
                  placeholder="Segundo apellido..."
                  {...register("segundo_apellido")}
                />
                <InputErrors errors={errors} name="segundo_apellido" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className='font-semibold text-xl'>
                <h3>¡Sigamos con tu <span className='text-blue-500 font-bold'>identificación</span>!</h3>
              </div>
              <div>
                <InputLabel htmlFor="tipo_identificacion" value="Tipo identificación" />
                <SelectForm
                  id="tipo_identificacion"
                  options={tipoIdentificacion}
                  register={register("tipo_identificacion")}
                />
                <InputErrors errors={errors} name="tipo_identificacion" />
              </div>

              <div>
                <InputLabel htmlFor="numero_identificacion" value="Número identificación" />
                <TextInput
                  id="numero_identificacion"
                  type="number"
                  placeholder="Número identificación..."
                  {...register("numero_identificacion")}
                />
                <InputErrors errors={errors} name="numero_identificacion" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className='flex flex-col gap-4'>
              <div className='font-semibold text-xl'>
                <h3>Ya falta poco, <span className='text-yellow-500 font-bold'>completa</span> esta información.</h3>
              </div>
              <div>
                <InputLabel htmlFor="estado_civil" value="Estado civil" />
                <SelectForm
                  id="estado_civil"
                  options={estadoCivil}
                  register={register("estado_civil")}
                />
                <InputErrors errors={errors} name="estado_civil" />
              </div>
              <div>
                <InputLabel htmlFor="fecha_nacimiento" value="Fecha de nacimiento" />
                <TextInput
                  id="fecha_nacimiento"
                  type="date"
                  {...register("fecha_nacimiento")}
                />
                <InputErrors errors={errors} name="fecha_nacimiento" />
              </div>

              <div>
                <InputLabel htmlFor="genero" value="Género" />
                <div className="flex flex-row flex-wrap gap-4 rounded-lg border-[1.8px] border-blue-600 bg-slate-100/40 p-4">
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
          )}

          {step === 4 && (
            <div className="flex flex-col gap-4">
              <div className='font-semibold text-xl'>
                <h3>Ahora cuéntanos sobre tu <span className='text-blue-500 font-bold'>ubicación</span></h3>
              </div>
              <div>
                <InputLabel htmlFor="pais" value="País" />
                <SelectForm
                  id="pais"
                  options={paises}
                  register={register("pais")}
                />
                <InputErrors errors={errors} name="pais" />
              </div>

              <div>
                <InputLabel htmlFor="departamento" value="Departamento" />
                <SelectForm
                  id="departamento"
                  options={departamentos}
                  register={register("departamento")}
                />
                <InputErrors errors={errors} name="departamento" />
              </div>

              <div>
                <InputLabel htmlFor="municipio" value="Municipio" />
                <SelectForm
                  id="municipio"
                  options={municipios}
                  register={register("municipio")}
                />
                <InputErrors errors={errors} name="municipio" />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-4">
              <div className='font-semibold text-xl'>
                <h3>
                  ¡Genial! Ahora tu
                  <span className='text-blue-500 font-bold'> correo</span> y
                  <span className='text-yellow-500 font-bold'> contraseña</span>
                </h3>
              </div>
              <div>
                <InputLabel htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  type="text"
                  placeholder="Email..."
                  {...register("email")}
                />
                <InputErrors errors={errors} name="email" />
              </div>

              <div>
                <InputLabel htmlFor="password" value="Contraseña" />
                <TextInput
                  id="password"
                  type="password"
                  placeholder="Contraseña..."
                  {...register("password")}
                />
                <InputErrors errors={errors} name="password" />
              </div>
              <div>
                <InputLabel htmlFor="password_confirmation" value="Confirmar contraseña" />
                <TextInput
                  id="password_confirmation"
                  type="password"
                  placeholder="Confirmar contraseña..."
                  {...register("password_confirmation")}
                />
                <InputErrors errors={errors} name="password_confirmation" />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-8">
          {step > 1 && (
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-16 rounded-2xl'
              type="button"
              onClick={handlePrev}
            >
              Anterior
            </button>
          )}
          {step < 5 ? (
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-16 rounded-2xl'
              type="button"
              onClick={handleNext}
            >
              Siguiente
            </button>
          ) : (
            <ButtonPrimary
              className="w-full bg-green-500 text-white hover:bg-green-600"
              type="submit"
              value="Registrarse"
            />
          )}
        </div>

        <p className="text-base text-gray-500 text-center">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/inicio-sesion" className="text-blue-500 hover:text-blue-600">
            Iniciar sesión
          </Link>
        </p>
        <div className='absolute size-full right-0 rotate-5 rounded-3xl -z-10 bg-blue-500'></div>
      </div>
    </form>
  );
};

export default Registro;