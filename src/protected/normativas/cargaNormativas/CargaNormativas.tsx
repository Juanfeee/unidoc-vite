/**
 * Componente para mostrar normativas y documentos asociados
 * Maneja estados de carga, error y muestra la lista de normativas
 * Permite visualizar documentos asociados a cada normativa
 */
import { DocumentTextIcon, EyeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

/* Interfaces */
interface Documento {
  id_documento: number;
  documentable_id: number;
  archivo: string;
  estado: string;
  archivo_url: string; // URL completa generada por el backend
}

interface Normativa {
  id_normativa: number;
  nombre: string;
  descripcion?: string; // Hacer opcional para manejar normativas sin descripción
  documentos_normativa?: Documento[]; // Ajuste para reflejar el nombre correcto del campo
}

const ManualUsuario = () => {
  const [normativas, setNormativas] = useState<Normativa[]>([]); // Inicializa como arreglo vacío
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNormativas = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get('aspirante/obtener-normativas', {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      if (!response.data?.normativas) {
        throw new Error('La respuesta no contiene el campo "normativas"');
      }

      if (response.data.normativas.length === 0) {
        toast.info('No hay normativas registradas en la base de datos');
      }

      setNormativas(response.data.normativas);
    } catch (err) {
      console.error('Error al obtener normativas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNormativas();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full bg-white rounded-lg shadow-sm p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-blue-600 font-medium">Cargando normativas...</p>
        <p className="text-gray-600 text-sm mt-2">Por favor espere un momento</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-4 w-full">
        <DocumentTextIcon className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-500 text-center mb-4">{error}</p>
        <button
          onClick={fetchNormativas}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <ArrowPathIcon className="h-5 w-5" />
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      {normativas.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 w-full bg-white rounded-lg shadow-sm p-6 text-center">
          <DocumentTextIcon className="h-12 w-12 text-blue-500 mb-4" />
          <p className="text-blue-600 font-medium">
            No hay normativas subidas actualmente.
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Por favor, intente más tarde.
          </p>
        </div>
      ) : (
        normativas.map((normativa) => (
          <div key={normativa.id_normativa} className="w-full">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden h-full">
              <div className="p-6 flex flex-col items-center">
                <DocumentTextIcon className="h-8 w-8 text-blue-500 mb-4" />
                <h2 className="text-lg font-bold text-gray-800 text-center mb-6">
                  {normativa.nombre}
                </h2>

                <p className="text-sm text-gray-600 mb-8 text-center">
                  {normativa.descripcion || 'Descripción no disponible'}
                </p>

                {/* Documentos asociados */}
                {normativa.documentos_normativa && normativa.documentos_normativa.length > 0 ? (
                  normativa.documentos_normativa.map((documento) => (
                    <div
                      key={documento.id_documento}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors w-full mb-4"
                    >
                      <div className="flex flex-col items-center">
                        <a
                          href={documento.archivo_url}
                          download={documento.archivo.split('/').pop()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm transition-colors"
                        >
                          <EyeIcon className="h-4 w-4" />
                          Visualizar normativa
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No hay documentos asociados a esta normativa.</p>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default ManualUsuario;
