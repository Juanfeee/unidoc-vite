import { AcademicCapIcon } from '@heroicons/react/24/outline'
import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import axios from 'axios'
import axiosInstance from '../../../utils/axiosConfig'


const FormacionEducativa = () => {

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
  
  if(!estudios) {
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
            <Link to={'/ver/estudios'}>
              <PencilSquareIcon className="size-10 p-2 stroke-2" />
            </Link>
          </div>
        </div>
        <div>
          <ul className='flex flex-col gap-4'>
            {estudios.map((item, index) => (
              <li className="flex flex-col sm:flex-row gap-6" key={index}>
                <AcademicCapIcon className="size-12 p-2 rounded-lg bg-[#F0F2F5] text-[#121417]" />
                <div className="text-[#637887]">
                  <p className="font-semibold text-[#121417]">{item.tipo_estudio}</p>
                  <p>{item.titulo_estudio}</p>
                  <p>{item.institucion}</p>
                  <p>{item.fecha_graduacion}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
export default FormacionEducativa