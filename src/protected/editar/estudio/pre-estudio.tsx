import { AcademicCapIcon, PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/axiosConfig'
import EliminarBoton from '../../../componentes/EliminarBoton';
import { AcademicIcono, PencilIcon } from '../../../assets/icons/Iconos';
import { ButtonRegresar } from '../../../componentes/formularios/ButtonRegresar';
import { set } from 'react-hook-form';

const PreEstudio = () => {
  const [estudios, setEstudios] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchDatos = async () => {
    try {
      setLoading(true);

      // Cargar desde sessionStorage si existe
      const cached = sessionStorage.getItem('estudios');
      if (cached) {
        setEstudios(JSON.parse(cached));
      }

      // Obtener datos del servidor
      const response = await axiosInstance.get('/aspirante/obtener-estudios');

      // Actualizar estado y sessionStorage
      if (response.data?.estudios) {
        setEstudios(response.data.estudios);
        sessionStorage.setItem('estudios', JSON.stringify(response.data.estudios));
      }
    } catch (error) {
      console.error('Error al obtener estudios:', error);
      // Fallback a sessionStorage si hay error
      const cached = sessionStorage.getItem('estudios');
      if (cached) {
        setEstudios(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/aspirante/eliminar-estudio/${id}`);
      // Actualizar estado y sessionStorage
      const nuevosEstudios = estudios.filter(e => e.id_estudio !== id);
      setEstudios(nuevosEstudios);
      sessionStorage.setItem('estudios', JSON.stringify(nuevosEstudios));
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  useEffect(() => {
    // Cargar datos iniciales desde cache para mejor UX
    const cached = sessionStorage.getItem('estudios');
    if (cached) {
      setEstudios(JSON.parse(cached));
    }
    fetchDatos();
  }, []);

  if (loading) {
    return <div className="flex flex-col gap-4 h-full w-[600px] bg-white rounded-3xl p-8 min-h-[600px]">Cargando...</div>;
  }

  return (
    <div className="flex flex-col gap-4 h-full sm:w-[600px] bg-white rounded-3xl p-8">
      <div className="flex flex-col gap-4">

        <Link to={'/index'}>
          <ButtonRegresar
          />
        </Link>
        <div className='flex gap-4 items-center justify-between'>
          <h4 className="font-bold text-xl">Formación educativa</h4>
          <Link to={'/agregar/estudio'}>
            <PlusIcon className="size-10 p-2 stroke-2" />
          </Link>
        </div>
      </div>

      <div>
        {estudios.length === 0 ? (
          <p>Aún no hay estudios agregados</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {estudios.map((item) => (
              <li
                key={item.id_estudio}
                className="flex flex-col sm:flex-row gap-6  w-full border-b-2 border-gray-200 p-2 md:items-center "
              >
                <div className="flex flex-col w-full text-[#637887]">
                  <p className="font-semibold text-[#121417]">{item.tipo_estudio}</p>
                  <p>{item.titulo_estudio}</p>
                  <p>{item.institucion}</p>
                  <p>{item.fecha_graduacion}</p>
                </div>
                <div className='flex gap-4 items-end'>

                  <Link
                    to={`/editar/estudio/${item.id_estudio}`}
                    className="flex items-center justify-center w-10 h-10 bg-[#F0F2F5] rounded-lg text-[#121417] hover:bg-[#E0E4E8] transition duration-300 ease-in-out"
                  >
                    <PencilIcon />

                  </Link>
                  <EliminarBoton
                    id={item.id_estudio}
                    onConfirmDelete={handleDelete}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PreEstudio;