import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useParams } from "react-router-dom"; 
import Cookies from "js-cookie";
import axiosInstance from "../../../utils/axiosConfig";
import { ButtonRegresar } from "../../../componentes/formularios/ButtonRegresar";
import { InputLabel } from "../../../componentes/formularios/InputLabel";
import { SelectForm } from "../../../componentes/formularios/SelectForm";
import InputErrors from "../../../componentes/formularios/InputErrors";
import { LabelRadio } from "../../../componentes/formularios/LabelRadio";
import TextInput from "../../../componentes/formularios/TextInput";
import { ButtonPrimary } from "../../../componentes/formularios/ButtonPrimary";
import { studySchema } from "../../../validaciones/studySchema";
import { AdjuntarArchivo } from "../../../componentes/formularios/AdjuntarArchivo";

type Inputs = {
  tipo_estudio: string;
  graduado: string;
  institucion: string;
  fecha_graduacion: string;
  titulo_convalidado: string;
  fecha_convalidacion: string;
  resolucion_convalidacion?: string;
  posible_fecha_graduacion?: string;
  titulo_estudio: string;
  fecha_inicio: string;
  fecha_fin: string;
  archivo: FileList;
};

const EditarEstudio = () => {
  const { id } = useParams();  // Obtener el ID del estudio a través de la URL
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(studySchema),
   });


  
  // Efecto para limpiar los campos de fecha de graduación y posible fecha de convalidación si el graduado es "No"
  const convalido = watch('titulo_convalidado');
  const graduado = watch('graduado');
  const titulo_convalidado = watch('titulo_convalidado');

  useEffect(() => {
    if (convalido === 'no') {
      setValue('fecha_convalidacion', '');
      setValue('resolucion_convalidacion', '');
    }
  }, [convalido, setValue]);
 // Efecto para limpiar los campos de fecha de graduación y posible fecha de convalidación si el graduado es "No"
  useEffect(() => {
    if (graduado === 'Si') {
      setValue('posible_fecha_graduacion', '');
    } else if (graduado === 'No') {
      setValue('fecha_graduacion', '');
    }
  }, [graduado, setValue]);

  // Efecto para limpiar los campos de fecha de convalidación y resolución de convalidación si el título no está convalidado
  useEffect(() => {
    if (titulo_convalidado === 'Si') {
      setValue('resolucion_convalidacion', '');
    } else if (titulo_convalidado === 'No') {
      setValue('fecha_convalidacion', '');
    }
  }, [titulo_convalidado, setValue]);



  useEffect(() => {
    const fetchEstudio = async () => {
      try {
        const token = Cookies.get("token");
        const { data } = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/aspirante/obtener-estudio/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Verificar los datos que llegan desde la API
        console.log("Datos del estudio:", data);
  
        setValue('tipo_estudio', data.estudio.tipo_estudio);
        setValue('graduado', data.estudio.graduado);
        setValue('institucion', data.estudio.institucion);
        setValue('fecha_graduacion', data.estudio.fecha_graduacion || '');
        setValue('titulo_convalidado', data.estudio.titulo_convalidado);
        setValue('fecha_convalidacion', data.estudio.fecha_convalidacion || '');
        setValue('resolucion_convalidacion', data.estudio.resolucion_convalidacion || '');
        setValue('posible_fecha_graduacion', data.estudio.posible_fecha_graduacion || '');
        setValue('titulo_estudio', data.estudio.titulo_estudio);
        setValue('fecha_inicio', data.estudio.fecha_inicio);
        setValue('fecha_fin', data.estudio.fecha_fin || '');
  
        // Verifica si los valores están correctos
        console.log(watch());
      } catch (error) {
        toast.error("Error al cargar los datos del estudio.");
      }
    };
  
    fetchEstudio();
  }, [id, setValue, watch]);
  
  // Función para manejar el envío del formulario
  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append("tipo_estudio", data.tipo_estudio);
    formData.append("graduado", data.graduado);
    formData.append("institucion", data.institucion);
    formData.append("fecha_graduacion", data.fecha_graduacion || '');
    formData.append("titulo_convalidado", data.titulo_convalidado);
    formData.append("fecha_convalidacion", data.fecha_convalidacion || '');
    formData.append("resolucion_convalidacion", data.resolucion_convalidacion || '');
    formData.append("posible_fecha_graduacion", data.posible_fecha_graduacion || '');
    formData.append("titulo_estudio", data.titulo_estudio);
    formData.append("fecha_inicio", data.fecha_inicio);
    formData.append("fecha_fin", data.fecha_fin || '');
    formData.append("archivo", data.archivo[0]);

    const token = Cookies.get("token");
    const url = `${import.meta.env.VITE_API_URL}/aspirante/actualizar-estudio/${id}`;

    const putPromise = axiosInstance.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      timeout: 10000,
    });

    toast.promise(putPromise, {
      pending: "Actualizando datos...",
      success: {
        render() {
          // Redirige después de actualizar
          setTimeout(() => {
            window.location.href = "/index";
          }, 1500);
          return "Datos actualizados correctamente";
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
              return error.response.data?.message || "Error al actualizar los datos.";
            } else if (error.request) {
              return "No se recibió respuesta del servidor.";
            }
          }
          return "Error inesperado al actualizar los datos.";
        },
        autoClose: 3000,
      },
    });
  };

  return (
    <form className='flex flex-col gap-y-4 rounded-md lg:w-[800px] xl:w-[1000px] 2xl:w-[1200px] m-auto relative'
    onSubmit={handleSubmit(onSubmit)} >
    <div className='flex flex-col sm:grid grid-cols-3 gap-x-8 bg-white gap-y-6 py-12 px-8 rounded-xl' >
      <div className='flex gap-x-4 col-span-full items-center'>
        <Link to={"/editar/estudios"}>
          <ButtonRegresar />
        </Link>
        < h3 className="font-bold text-3xl col-span-full" > Editar estudio </h3>
      </div>
      < div className='flex flex-col sm:grid sm:grid-cols-3 sm:col-span-full gap-4' >
        <div className='flex flex-col w-full' >
          <InputLabel htmlFor='tipo_estudio' value='Tipo de estudio' />
          <SelectForm
            id='tipo_estudio'
            register={register('tipo_estudio')}
            url='tipos-estudio'
            data_url='tipo_estudio'
          />
          <InputErrors errors={errors} name="tipo_estudio" />
        </div>

        < div className='flex flex-col w-full' >
          <InputLabel htmlFor='graduado' value='Graduado' />
          <div className="flex flex-row flex-wrap gap-4 rounded-lg border-[1.8px] border-blue-600 bg-slate-100/40 h-[44px] px-4">
            <LabelRadio
              htmlFor="graduado-si"
              value="Si"
              inputProps={register("graduado")}
              label="Si"
            />
            <LabelRadio
              htmlFor="graduado-no"
              value="No"
              inputProps={register("graduado")}
              label="No"
            />
          </div>
          <InputErrors errors={errors} name="graduado" />
        </div>
        {watch('graduado') === 'Si' && (
          <>
            < div className='flex flex-col w-full' >
              <InputLabel htmlFor='fecha_grado' value='Fecha de grado' />
              <TextInput
                id='fecha_grado'
                type='date'
                {...register('fecha_graduacion')} />
              < InputErrors errors={errors} name="fecha_grado" />
            </div>
          </>
        )
        } {watch('graduado') === 'No' && (
          <>
            < div className='flex flex-col w-full' >
              <InputLabel htmlFor='posible_fecha_graduacion' value='Posible fecha de graduacion' />
              <TextInput
                id='posible_fecha_graduacion'
                type='date'
                {...register('posible_fecha_graduacion')} />
              < InputErrors errors={errors} name="posible_fecha_convalidacion" />
            </div>
          </>
        )}

      </div>


      < div className='grid grid-cols-1 sm:grid-cols-2 col-span-full gap-4' >
        <div className='flex flex-col w-full' >
          <InputLabel htmlFor='institucion' value='Institución' />
          <TextInput
            id='institucion'
            placeholder='Institución'
            {...register('institucion')}
          />
          < InputErrors errors={errors} name="institucion" />
        </div>
        < div className='flex flex-col w-full' >
          <InputLabel htmlFor='titulo' value='Título' />
          <TextInput
            id='titulo'
            placeholder='Título'
            {...register('titulo_estudio')}
          />
          < InputErrors errors={errors} name="titulo_estudio" />
        </div>
      </div>
      < div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 col-span-full gap-4' >
        <div className='flex flex-col w-full' >
          < div className="" >
            <InputLabel htmlFor="convalido" value="Convalido" />

            <div className="flex flex-row flex-wrap gap-4 rounded-lg border-[1.8px] border-blue-600 bg-slate-100/40 p-4">
              <LabelRadio
                htmlFor="convalido-si"
                value="Si"
                inputProps={register("titulo_convalidado")}
                label="Si"
              />
              <LabelRadio
                htmlFor="convalido-no"
                value="No"
                inputProps={register("titulo_convalidado")}
                label="No"
              />
            </div>
            <InputErrors errors={errors} name="titulo_convalidado" />
          </div>
          {
            watch('titulo_convalidado') === 'Si' && (
              <>
                <div className='flex flex-col w-full' >
                  <InputLabel htmlFor='fecha_convalidacion' value='Fecha de convalidación' />
                  <TextInput
                    id='fecha_convalidacion'
                    type='date'
                    {...register('fecha_convalidacion')}
                  />
                </div>
                < div className='flex flex-col w-full' >
                  <InputLabel htmlFor='resolucion_convalidacion' value='Resolución de convalidación' />
                  <TextInput
                    id='resolucion_convalidacion'
                    placeholder='Resolución de convalidación'
                    {...register('resolucion_convalidacion')}
                  />
                </div>
              </>
            )}
        </div>
        < div className='grid grid-cols-1 sm:grid-cols-2 col-span-full gap-4' >
          <div className='flex flex-col' >
            <InputLabel htmlFor='fecha_inicio' value='Fecha de inicio' />
            <TextInput
              type='date'
              id='fecha_inicio'
              {...register('fecha_inicio')}
            />
            < InputErrors errors={errors} name="fecha_inicio" />
          </div>
          < div className='flex flex-col' >
            <InputLabel htmlFor='fecha_fin' value='Fecha de fin' />
            <TextInput
              type='date'
              id='fecha_fin'
              {...register('fecha_fin')}
            />
            < InputErrors errors={errors} name="fecha_fin" />
          </div>
        </div>
        <div>
          <InputLabel htmlFor="archivo" value="Archivo" />
            <AdjuntarArchivo
              id="archivo"
              register={register('archivo')}
              />
          <InputErrors errors={errors} name="archivo" />
        </div>
        <div className='flex justify-center col-span-full' >
          <ButtonPrimary value='Guardar estudio' />
        </div>
      </div>
    </div>
  </form>
  );
};

export default EditarEstudio;
