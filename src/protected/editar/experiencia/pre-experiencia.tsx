import { AcademicCapIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/axiosConfig'
import ModalTrash from '../../../componentes/Modal';
import Modal from '../../../componentes/Modal';
import EliminarBoton from '../../../componentes/EliminarBoton';

const PreExperiencia = () => {
  const [experiencias, setExperiencias] = useState<any[]>([])

  const fetchDatos = async () => {
    try {
      const response = await axiosInstance.get('/aspirante/obtener-experiencias')
      setExperiencias(response.data.experiencias)
    } catch (error) {
      console.error('Error al obtener los datos:', error)
    }
  }

  useEffect(() => {
    fetchDatos()
  }, [])

  if (!experiencias || experiencias.length === 0) {
    return <div className="flex justify-center items-center h-full">Cargando...</div>
  }

  return (
    <div className="flex flex-col gap-4 h-full w-[600px] bg-white rounded-3xl p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="font-bold text-xl">Experiencia Profesional</h4>
        <div className="flex gap-1">
          <Link to={'/agregar/experiencia'}>
            <PlusIcon className="size-10 p-2 stroke-2" />
          </Link>
        </div>
      </div>

      <div>
        {experiencias.length === 0 ? (
          <p>No hay experiencias registradas.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {experiencias.map((item) => (
              <li
                key={item.id_experiencia}
                className="flex flex-col sm:flex-row gap-6 justify-around w-full border-b-2 border-gray-200 p-2"
              >
                <div className="flex flex-row gap-4 w-full">
                  <AcademicCapIcon className="size-12 p-2 rounded-lg bg-[#F0F2F5] text-[#121417]" />
                  <div className="text-[#637887]">
                    <p className="font-semibold text-[#121417]">{item.tipo_experiencia}</p>
                    <p>Institución: {item.institucion_experiencia}</p>
                    <p>Cargo: {item.cargo}</p>
                    <p>Desde: {item.fecha_inicio} - Hasta: {item.fecha_finalizacion || 'Actual'}</p>
                  </div>
                </div>
                <Link
                  to={`/editar/experiencia/${item.id_experiencia}`}
                  className="flex items-center justify-center w-10 h-10 bg-[#F0F2F5] rounded-lg text-[#121417] hover:bg-[#E0E4E8] transition duration-300 ease-in-out"
                >
                  <PencilSquareIcon className="size-12 p-2 rounded-lg bg-[#F0F2F5] text-[#121417]" />
                </Link>
                <EliminarBoton
                  id={item.id_experiencia}
                  onConfirmDelete={async (id) => {
                    try {
                      await axiosInstance.delete(`/aspirante/eliminar-experiencia/${id}`)
                      setExperiencias(experiencias.filter(e => e.id_experiencia !== id))
                    } catch (err) {
                      console.error('Error al eliminar:', err)
                    }
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default PreExperiencia