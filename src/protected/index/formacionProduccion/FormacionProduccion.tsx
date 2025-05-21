import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router'
import axiosInstance from '../../../utils/axiosConfig';
import { useEffect, useState } from 'react';
import AgregarLink from '../../../componentes/ButtonAgregar';
import EstadoDocumento from '../../../componentes/Estado';
import { BeakerIcons } from '../../../assets/icons/Iconos';
import Cookies from 'js-cookie';
import { RolesValidos } from '../../../types/roles';
import { jwtDecode } from 'jwt-decode';

const FormacionProduccion = () => {

  const [produccion, setProduccion] = useState<any[]>([]);
  //Función para cargar los datos desde el servidor o sessionStorage
  const fetchDatos = async () => {
    try {
      // 1. Intentar cargar desde sessionStorage primero
      const cachedData = sessionStorage.getItem('producciones');
      if (cachedData) {
        setProduccion(JSON.parse(cachedData));
      }

        const token = Cookies.get("token");
        if (!token) throw new Error("No authentication token found");
        const decoded = jwtDecode<{ rol: RolesValidos }>(token);
        const rol = decoded.rol;

      const ENDPOINTS = {
        Aspirante: `${import.meta.env.VITE_API_URL}${
          import.meta.env.VITE_ENDPOINT_OBTENER_PRODUCCIONES_ASPIRANTE
        }`,
        Docente: `${import.meta.env.VITE_API_URL}${
          import.meta.env.VITE_ENDPOINT_OBTENER_PRODUCCIONES_DOCENTE
        }`,
      };
      const endpoint = ENDPOINTS[rol];

      const response = await axiosInstance.get(endpoint);

      // 3. Actualizar estado y sessionStorage
      if (response.data?.producciones) {
        const producciones = response.data.producciones;
        setProduccion(producciones);
        sessionStorage.setItem('producciones', JSON.stringify(producciones));
      }

    } catch (error) {
      console.error('Error al cargar produccion:', error);
      // Si hay error, se mantienen los datos de cache (si existían)
    }

  };


  useEffect(() => {
    fetchDatos();
  }
    , []);

  if (!produccion) {
    return <div className="flex justify-center items-center h-full">Cargando...</div>;
  }
  

  return (
    <>
      <div className="flex flex-col gap-4 h-full max-w-[400px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="font-bold text-xl">Formación Producción</h4>
          <div className="flex gap-1">
            <Link to={'/agregar/produccion'}>
              <PlusIcon className="size-10 p-2 stroke-2" />
            </Link>
            <Link to={'/editar/producciones'}>
              <PencilSquareIcon className="size-10 p-2 stroke-2" />
            </Link>
          </div>
        </div>
        <div>
          {produccion.length === 0 ? (
            <AgregarLink to="/agregar/produccion" texto="Agregar producción" />
          ) : (
            <ul className='flex flex-col  gap-6'>
              {produccion.map((item, index) => (
                <li key={index} className="flex flex-col sm:flex-row gap-6 ">
                  <BeakerIcons />
                  <div className="text-[#637887]">
                    <p className="font-semibold text-[#121417]">{item.titulo}</p>
                    <p>{item.rol}</p>
                    <p>{item.medio_divulgacion}</p>
                    <p>{item.numero_autores} autores</p>
                    <p>{item.fecha_divulgacion}</p>
                    <EstadoDocumento documentos={item.documentos_produccion_academica} />
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
export default FormacionProduccion