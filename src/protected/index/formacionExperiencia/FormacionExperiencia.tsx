import { BriefcaseIcon } from '@heroicons/react/24/outline'
import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/axiosConfig'
import { toast } from 'react-toastify'
import AgregarLink from '../../../componentes/ButtonAgregar'

const FormacionExperiencia = () => {
  const [experiencias, setExperiencias] = useState<any[]>([])

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const response = await axiosInstance.get('/aspirante/obtener-experiencias')
        const datos = response.data
        setExperiencias(datos.experiencias)
      } catch (error) {
        console.error('Error al obtener los datos:', error)
      }
    }

    fetchDatos()
  }, [])

  if (!experiencias) {
    return <div className="flex justify-center items-center h-full">Cargando...</div>
  }

  return (
    <div className="flex flex-col gap-4 h-full max-w-[400px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="font-bold text-xl">Experiencia Profesional</h4>
        <div className="flex gap-1">
          <Link to={'/agregar/experiencia'}>
            <PlusIcon className="size-10 p-2 stroke-2" />
          </Link>
          <Link to={'/editar/experiencias'}>
            <PencilSquareIcon className="size-10 p-2 stroke-2" />
          </Link>
        </div>
      </div>
      <div>
        {experiencias.length === 0 ? (
          <AgregarLink
            to="/agregar/experiencia"
            texto="Agregar experiencia profesional"
          />
        ) : (
          <ul className="flex flex-col gap-4">
            {experiencias.map((item, index) => (
              <li className="flex flex-col sm:flex-row gap-6" key={index}>
                <BriefcaseIcon className="size-12 p-2 rounded-lg bg-[#F0F2F5] text-[#121417]" />
                <div className="text-[#637887]">
                  <p className="font-semibold text-[#121417]">{item.tipo_experiencia}</p>
                  <p>{item.cargo}</p>
                  <p>{item.institucion_experiencia}</p>
                  <p>{item.fecha_inicio} / {item.fecha_finalizacion || 'Actual'}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>

  )
}

export default FormacionExperiencia