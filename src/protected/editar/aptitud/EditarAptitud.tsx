import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { aptitudSchema } from '../../../validaciones/aptitudSchema';
import axiosInstance from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { ButtonRegresar } from '../../../componentes/formularios/ButtonRegresar';
import { InputLabel } from '../../../componentes/formularios/InputLabel';
import TextInput from '../../../componentes/formularios/TextInput';
import TextArea from '../../../componentes/formularios/TextArea';
import InputErrors from '../../../componentes/formularios/InputErrors';
import { ButtonPrimary } from '../../../componentes/formularios/ButtonPrimary';

type Inputs = {
  nombre_aptitud: string;
  descripcion_aptitud: string;
};


const EditarAptitud = () => {
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(aptitudSchema)
  });

  useEffect(() => {
    const fetchAptitud = async () => {
      try {
        const response = await axiosInstance.get(`/aspirante/obtener-aptitud/${id}`, {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` }
        });
        
        if (response.data?.aptitud) {
          setValue('nombre_aptitud', response.data.aptitud.nombre_aptitud);
          setValue('descripcion_aptitud', response.data.aptitud.descripcion_aptitud);
        }
      } catch (error) {
        console.error('Error al obtener la aptitud:', error);
        toast.error('Error al cargar los datos de la aptitud');
      }
    };

    fetchAptitud();
  }, [id, setValue]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);
    try {
      await toast.promise(
        axiosInstance.put(`/aspirante/actualizar-aptitud/${id}`, data, {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` }
        }),
        {
          pending: 'Actualizando aptitud...',
          success: {
            render() {
              setTimeout(() => {
                window.location.href = "/index";
              }, 1500);
              return "Aptitud actualizada correctamente";
            }
          },
          error: 'Error al actualizar la aptitud'
        }
      );
    } catch (error) {
      console.error('Error en la actualización:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full w-[600px] bg-white rounded-3xl p-8">
      <div className="flex gap-4 items-center">
        <Link to="/index">
          <ButtonRegresar />
        </Link>
        <h4 className="font-bold text-xl">Editar aptitud</h4>
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <InputLabel htmlFor="Aptitud" value="Aptitud" />
          <TextInput
            id="Aptitud"
            placeholder="Título de aptitud..."
            {...register('nombre_aptitud')}
          />
          <InputErrors errors={errors} name="nombre_aptitud" />
        </div>

        <div>
          <InputLabel htmlFor="Descripcion" value="Descripción" />
          <TextArea
            id="Descripcion"
            placeholder="Descripción de la aptitud..."
            {...register('descripcion_aptitud')}
          />
          <InputErrors errors={errors} name="descripcion_aptitud" />
        </div>

        <div className="flex justify-center">
          <ButtonPrimary
            value={isSubmitting ? "Actualizando..." : "Actualizar aptitud"}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default EditarAptitud;