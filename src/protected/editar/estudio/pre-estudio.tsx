import { AcademicCapIcon, PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/axiosConfig'

const PreEstudio = () => {
  const [estudios, setEstudios] = useState<any[]>([]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const response = await axiosInstance.get('/aspirante/obtener-estudios');
        const datos = response.data;
        setEstudios(datos.estudios);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchDatos();
  }, []);

  if (!estudios || estudios.length === 0) {
    return <div className="flex justify-center items-center h-full">Cargando...</div>;
  }

  return (
    <div className="flex flex-col gap-4 h-full w-[600px] bg-white rounded-3xl p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="font-bold text-xl">Formación educativa</h4>
        <div className="flex gap-1">
          <Link to={'/agregar/estudio'}>
            <PlusIcon className="size-10 p-2 stroke-2" />
          </Link>
        </div>
      </div>

      <div>
        {estudios.length === 0 ? (
          <p>No hay estudios disponibles.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {estudios.map((item) => (
              <li
                key={item.id_estudio}
                className="flex flex-col sm:flex-row gap-6 justify-around w-full border-b-2 border-gray-200 p-2"
              >
                <div className="flex flex-row gap-4 w-full">
                  <AcademicCapIcon className="size-12 p-2 rounded-lg bg-[#F0F2F5] text-[#121417]" />
                  <div className="text-[#637887]">
                    <p className="font-semibold text-[#121417]">{item.tipo_estudio}</p>
                    <p>{item.titulo_estudio}</p>
                    <p>{item.institucion}</p>
                    <p>{item.fecha_graduacion}</p>
                  </div>
                </div>
                <Link
                  to={`/editar/estudio/${item.id_estudio}`}
                  className="flex items-center justify-center w-10 h-10 bg-[#F0F2F5] rounded-lg text-[#121417] hover:bg-[#E0E4E8] transition duration-300 ease-in-out"
                >
                  <PencilSquareIcon className="size-12 p-2 rounded-lg bg-[#F0F2F5] text-[#121417]" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PreEstudio;
