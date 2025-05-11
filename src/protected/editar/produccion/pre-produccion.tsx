import { BeakerIcon, PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosConfig';
import EliminarBoton from '../../../componentes/EliminarBoton';
import { SubmitHandler } from 'react-hook-form';




const PreProduccion = () => {
  const [producciones, setProducciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDatos = async () => {
    try {
      setLoading(true);
      const cached = sessionStorage.getItem('producciones');
      if (cached) {
        setProducciones(JSON.parse(cached));
      }

      const response = await axiosInstance.get('/aspirante/obtener-producciones');
      if (response.data?.producciones) {
        setProducciones(response.data.producciones);
        sessionStorage.setItem('producciones', JSON.stringify(response.data.producciones));
      }
    } catch (error) {
      console.error('Error al obtener producciones:', error);
      const cached = sessionStorage.getItem('producciones');
      if (cached) {
        setProducciones(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };
const handleDelete = async (id: number) => {
  try {
    // Realizar la solicitud para eliminar el item en el backend
    await axiosInstance.delete(`/aspirante/eliminar-produccion/${id}`);

    // Filtrar la producción eliminada
    const nuevas = producciones.filter(p => p.id_produccion_academica !== id);

    // Actualizar el estado
    setProducciones(nuevas);

    // Actualizar el sessionStorage
    sessionStorage.setItem('producciones', JSON.stringify(nuevas));
  } catch (err) {
    console.error('Error al eliminar:', err);
  }
};


  useEffect(() => {
    const cached = sessionStorage.getItem('producciones');
    if (cached) {
      setProducciones(JSON.parse(cached));
    }
    fetchDatos();
  }, []);



  if (loading) {
    return <div className="flex flex-col gap-4 h-full w-[600px] bg-white rounded-3xl p-8 min-h-[600px]">Cargando...</div>;
  }

  return (
    <div className="flex flex-col gap-4 h-full w-[600px] bg-white rounded-3xl p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="font-bold text-xl">Producciones Académicas</h4>
        <div className="flex gap-1">
          <Link to={'/agregar/produccion'}>
            <PlusIcon className="size-10 p-2 stroke-2" />
          </Link>
        </div>
      </div>

      <div>
        {producciones.length === 0 ? (
          <p>No hay producciones registradas.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {producciones.map((item) => (
              <li
                key={item.id_produccion_academica}
                className="flex flex-col sm:flex-row gap-6 justify-around w-full border-b-2 border-gray-200 p-2"
              >
                <div className="flex flex-row gap-4 w-full">
                  <BeakerIcon className="size-12 p-2 rounded-lg bg-[#F0F2F5] text-[#121417]" />
                  <div className="text-[#637887]">
                    <p className="font-semibold text-[#121417]">{item.titulo}</p>
                    <p className="font-semibold text-[#121417]">{item.nombre_producto_academico}</p>
                    <p className="font-semibold text-[#121417]">{item.nombre_ambito_divulgacion}</p>
                    <p>{item.rol}</p>
                    <p>{item.medio_divulgacion}</p>
                    <p>{item.numero_autores} autores</p>
                    <p>{item.fecha_divulgacion}</p>
                  </div>
                </div>
                <Link
                  to={`/editar/produccion/${item.id_produccion_academica}`}
                  className="flex items-center justify-center w-10 h-10 bg-[#F0F2F5] rounded-lg text-[#121417] hover:bg-[#E0E4E8] transition duration-300 ease-in-out"
                >
                  <PencilSquareIcon className="size-6" />
                </Link>
                <EliminarBoton
                  id={item.id_produccion_academica}
                  onConfirmDelete={handleDelete}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PreProduccion;
