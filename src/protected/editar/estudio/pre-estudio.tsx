import { AcademicCapIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/axiosConfig'
import ModalTrash from '../../../componentes/Modal';
import Modal from '../../../componentes/Modal';
import EliminarBoton from '../../../componentes/EliminarBoton';

const PreEstudio = () => {
  const [estudios, setEstudios] = useState<any[]>([]);





  const fetchDatos = async () => {
    try {
      const response = await axiosInstance.get('/aspirante/obtener-estudios');
      setEstudios(response.data.estudios);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  if (!estudios) {
    return <div className="flex flex-col gap-4 h-full w-[600px] bg-white rounded-3xl p-8 min-h-[600px]">Cargando...</div>;
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
          <p>Aun no hay estudios agregados</p>
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
                  <PencilSquareIcon className="size-12 p-2" />
                </Link>
                <EliminarBoton
                  id={item.id_estudio}
                  onConfirmDelete={async (id) => {
                    try {
                      await axiosInstance.delete(`/aspirante/eliminar-estudio/${id}`);
                      setEstudios(estudios.filter(e => e.id_estudio !== id));
                    } catch (err) {
                      console.error('Error al eliminar:', err);
                    }
                  }}
                />
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  );
};

export default PreEstudio;
