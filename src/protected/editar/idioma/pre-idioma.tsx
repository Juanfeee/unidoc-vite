import { AcademicCapIcon, PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/axiosConfig'
import EliminarBoton from '../../../componentes/EliminarBoton'
import { GlobeIcon, PencilIcon } from '../../../assets/icons/Iconos'
import { ButtonRegresar } from '../../../componentes/formularios/ButtonRegresar'

const PreProduccion = () => {
  const [idiomas, setIdiomas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDatos = async () => {
    try {
      setLoading(true);
      // 1. Cargar desde caché primero
      const cached = sessionStorage.getItem('idiomas');
      if (cached) {
        setIdiomas(JSON.parse(cached));
      }

      // 2. Obtener datos del servidor
      const response = await axiosInstance.get('/aspirante/obtener-idiomas');

      // 3. Actualizar estado y caché
      if (response.data?.idiomas) {
        setIdiomas(response.data.idiomas);
        sessionStorage.setItem('idiomas', JSON.stringify(response.data.idiomas));
      }
    } catch (error) {
      console.error('Error al obtener idiomas:', error);
      // Fallback a caché si hay error
      const cached = sessionStorage.getItem('idiomas');
      if (cached) {
        setIdiomas(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/aspirante/eliminar-idioma/${id}`);
      // Actualizar estado y caché
      const nuevosIdiomas = idiomas.filter(i => i.id_idioma !== id);
      setIdiomas(nuevosIdiomas);
      sessionStorage.setItem('idiomas', JSON.stringify(nuevosIdiomas));
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  useEffect(() => {
    // Cargar datos iniciales desde caché
    const cached = sessionStorage.getItem('idiomas');
    if (cached) {
      setIdiomas(JSON.parse(cached));
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
          <h4 className="font-bold text-xl">Idiomas</h4>
          <Link to={'/agregar/idioma'}>
            <PlusIcon className="size-10 p-2 stroke-2" />
          </Link>
        </div>
      </div>

      <div>
        {idiomas.length === 0 ? (
          <p>No hay idiomas registrados.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {idiomas.map((item) => (
              <li
                key={item.id_idioma}
                className="flex flex-col sm:flex-row gap-6  w-full border-b-2 border-gray-200 p-2 md:items-center "
              >
                <div className="flex flex-col w-full text-[#637887]">
                  <p className="font-semibold text-[#121417]">{item.idioma}</p>
                  <p>Nivel: {item.nivel}</p>
                  <p>Institución: {item.institucion_idioma}</p>
                  <p>Fecha certificado: {item.fecha_certificado}</p>
                </div>
                <div className='flex gap-4 items-end'>


                  <Link
                    to={`/editar/idioma/${item.id_idioma}`}
                    className="flex items-center justify-center w-10 h-10 bg-[#F0F2F5] rounded-lg text-[#121417] hover:bg-[#E0E4E8] transition duration-300 ease-in-out"
                  >
                    <PencilIcon />
                  </Link>
                  <EliminarBoton
                    id={item.id_idioma}
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

export default PreProduccion;