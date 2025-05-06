import { GlobeAmericasIcon } from '@heroicons/react/24/outline'
import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import axios from 'axios'
import axiosInstance from '../../../utils/axiosConfig'
import AgregarLink from '../../../componentes/ButtonAgregar'

const FormacionIdioma = () => {
  const [idiomas, setIdiomas] = useState<any[]>([])

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const response = await axiosInstance.get('/aspirante/obtener-idiomas')
        const datos = response.data
        setIdiomas(datos.idiomas)
      } catch (error) {
        console.error('Error al obtener los datos:', error)
      }
    }

    fetchDatos()
  }, [])

  if (!idiomas) {
    return <div className="flex justify-center items-center h-full">Cargando...</div>
  }

  return (
    <div className="flex flex-col gap-4 h-full max-w-[400px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="font-bold text-xl">Formación idioma</h4>
        <div className="flex gap-1">
          <Link to={'/agregar/idioma'}>
            <PlusIcon className="size-10 p-2 stroke-2" />
          </Link>
          <Link to={'/editar/idiomas'}>
            <PencilSquareIcon className="size-10 p-2 stroke-2" />
          </Link>
        </div>
      </div>
      <div>
        {idiomas.length === 0 ? (
          <AgregarLink
            to={'/agregar/idioma'}
            texto="Agregar idioma"
          />
        ) : (
          <ul className="flex flex-col gap-4">
            {idiomas.map((item, index) => (
              <li className="flex flex-col sm:flex-row gap-6" key={index}>
                <GlobeAmericasIcon className="size-12 p-2 rounded-lg bg-[#F0F2F5] text-[#121417]" />
                <div className="text-[#637887]">
                  <p className="font-semibold text-[#121417]">{item.idioma}</p>
                  <p>{item.institucion_idioma}</p>
                  <p>Nivel: {item.nivel}</p>
                  <p>Certificado: {item.fecha_certificado}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

  )
}

export default FormacionIdioma