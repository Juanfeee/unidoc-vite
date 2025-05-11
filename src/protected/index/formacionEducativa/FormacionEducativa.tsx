import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/axiosConfig'
import AgregarLink from '../../../componentes/ButtonAgregar'
import EstadoDocumento from '../../../componentes/Estado'
import { AcademicIcono } from '../../../assets/icons/Iconos'

const FormacionEducativa = () => {

  const [estudios, setEstudios] = useState<any[]>([]);

  //Función para cargar los datos desde el servidor o sesionStorage
  const fetchDatos = async () => {
    try {
      // 1. Intentar cargar desde sesionStorage primero
      const cached = sessionStorage.getItem('estudios');
      if (cached) {
        setEstudios(JSON.parse(cached));
      }

      // 2. Hacer petición al servidor
      const response = await axiosInstance.get('/aspirante/obtener-estudios');


      // 3. Actualizar estado y sesionStorage
      if (response.data?.estudios) {
        setEstudios(response.data.estudios);
        sessionStorage.setItem('estudios', JSON.stringify(response.data.estudios));
      }

    } catch (error) {
      console.error('Error al cargar estudios:', error);
      // Si hay error, se mantienen los datos de cache (si existían)
    }
  };

  // Llamar la función cuando el componente se monta
  useEffect(() => {
    fetchDatos();
  }, []);

  if (!estudios) {
    return <div className="flex justify-center items-center h-full">Cargando...</div>;
  }



  return (
    <>
      <div className="flex flex-col gap-4 h-full max-w-[400px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="font-bold text-xl">Formación educativa</h4>
          <div className="flex gap-1">
            <Link to={'/agregar/estudio'}>
              <PlusIcon className="size-10 p-2 stroke-2" />
            </Link>
            <Link to={'/editar/estudios'}>
              <PencilSquareIcon className="size-10 p-2 stroke-2 " />
            </Link>
          </div>
        </div>
        <div>
          {estudios.length === 0 ? (
            <AgregarLink
              to="/agregar/estudio"
              texto="Agregar estudio"
            />
          ) : (
            <ul className="flex flex-col gap-6">
              {estudios.map((item, index) => (
                <li className="flex flex-col sm:flex-row gap-6 " key={index}>
                  <AcademicIcono />
                  <div className="text-[#637887] ">
                    <p className="font-semibold text-[#121417]">{item.tipo_estudio}</p>
                    <p>{item.titulo_estudio}</p>
                    <p>{item.institucion}</p>
                    <p>{item.fecha_graduacion}</p>
                    <EstadoDocumento documentos={item.documentos_estudio}  />
                  </div>
                </li>
              ))}
            </ul>
          )}

        </div>
      </div>
    </>
  )
}
export default FormacionEducativa