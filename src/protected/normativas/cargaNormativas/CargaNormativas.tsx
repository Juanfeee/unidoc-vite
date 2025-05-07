import { DocumentTextIcon, ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

interface Documento {
  id_documento: number;
  archivo_url: string;
  estado: string;
  nombre_archivo: string;
  created_at: string;
  updated_at: string;
}

interface Normativa {
  id_normativa: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  documentosNormativa: Documento[];
  created_at: string;
  updated_at: string;
}

const ManualUsuario = () => {
  const [normativas, setNormativas] = useState<Normativa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNormativas = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Verificar conexión con el servidor
      try {
        await axios.get('http://localhost:8000', { timeout: 3000 });
      } catch (e) {
        console.log('El servidor está disponible pero puede tener CORS habilitado');
      }

      // 2. Obtener normativas
      const response = await axiosInstance.get('aspirante/obtener-normativas', {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`
        }
      });

      console.log('Respuesta del servidor:', response.data);

      if (!response.data?.normativas) {
        throw new Error('La respuesta no contiene el campo "normativas"');
      }

      if (response.data.normativas.length === 0) {
        toast.info('No hay normativas registradas en la base de datos');
      }

      setNormativas(response.data.normativas);
    } catch (err) {
      console.error('Error al obtener normativas:', err);
      setError('No se pudieron cargar las normativas. ' +
        (axios.isAxiosError(err) ? err.message : 'Error desconocido'));

      toast.error('Error al cargar normativas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNormativas();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p>Cargando normativas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-4">
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
    <div className="w-full max-w-sm mx-auto px-4 py-8 relative">
      {normativas.length === 0 ? (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <p className="text-blue-700">
            No hay manuales de usuario disponibles actualmente.
          </p>
        </div>
      ) : (
        normativas.map((normativa) => (
          <div key={normativa.id_normativa} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6 flex flex-col items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-500 mb-4" />
              <h2 className="text-lg font-bold text-gray-800 text-center">{normativa.nombre}</h2>
              <span className="text-xs text-gray-500 mb-4 text-center">
                {new Date(normativa.updated_at).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              
              <p className="text-sm text-gray-600 mb-6 text-center">
                {normativa.descripcion || 'Descripción no disponible'}
              </p>

              {normativa.documentosNormativa?.map((doc) => (
                <div key={doc.id_documento} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors w-full">
                  <div className="flex flex-col items-center">
                    <h3 className="text-sm font-medium text-gray-800 mb-2 text-center">
                      {doc.nombre_archivo || 'Documento adjunto'}
                    </h3>
                    <div className="flex flex-col items-center gap-2 mb-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {doc.estado || 'Activo'}
                      </span>
                      <span className="text-xs text-gray-400 text-center">
                        Subido: {new Date(doc.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <a
                      href={doc.archivo_url}
                      download={doc.nombre_archivo || 'documento'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm transition-colors"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      Descargar
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ManualUsuario;
