import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/axiosConfig'
import AgregarLink from '../../../componentes/ButtonAgregar'
import EstadoDocumento from '../../../componentes/Estado'
import { useObtenerAno } from '../../../hooks/TomarAno';
import { BriefIcon } from '../../../assets/icons/Iconos'

const FormacionExperiencia = () => {
  const [experiencias, setExperiencias] = useState<any[]>([])
  const { obtenerAno} = useObtenerAno();

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        // 1. Intentar cargar desde sesionStorage primero
        const cached = sessionStorage.getItem('experiencias');
        if (cached) {
          setExperiencias(JSON.parse(cached));
        }

        // 2. Hacer petición al servidor
        const response = await axiosInstance.get('/aspirante/obtener-experiencias');

        // 3. Actualizar estado y sessionStorage
        if (response.data?.experiencias) {
          setExperiencias(response.data.experiencias);
          sessionStorage.setItem('experiencias', JSON.stringify(response.data.experiencias));
        }

      } catch (error) {
        console.error('Error al cargar experiencias:', error);
        // Si hay error, se mantienen los datos de cache (si existían)
      }
    };

    fetchDatos();
  }, []);

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
          <ul className="flex flex-col gap-6">
            {experiencias.map((item, index) => (
              <li className="flex flex-col sm:flex-row gap-6 " key={index}>
                <BriefIcon />
                <div className="text-[#637887]">
                  <p className="font-semibold text-[#121417]">{item.tipo_experiencia}</p>
                  <p>{item.cargo}</p>
                  <p>{item.institucion_experiencia}</p>
                  <p>{obtenerAno(item.fecha_inicio)} / {item.fecha_finalizacion ? obtenerAno(item.fecha_finalizacion) : 'Actual'}</p>
                  <EstadoDocumento documentos={item.documentos_experiencia} />
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