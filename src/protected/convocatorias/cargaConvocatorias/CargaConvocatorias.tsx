// Importación de dependencias
import { DocumentTextIcon, EyeIcon, ArrowPathIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosConfig'; // Instancia configurada de axios
import { toast } from 'react-toastify'; // Para notificaciones
import Cookies from 'js-cookie'; // Manejo de cookies
import { Link } from 'react-router-dom'; // Navegación

// Interfaces para tipado
interface Documento {
    id_documento: number;
    documentable_id: number;
    archivo: string;
    estado: string;
    archivo_url: string;
}

interface Convocatoria {
    id_convocatoria: number;
    nombre_convocatoria: string;
    tipo: string;
    fecha_publicacion: string;
    fecha_cierre: string;
    descripcion?: string;
    estado_convocatoria: string;
    documentos_convocatoria?: Documento[];
}

const ListaConvocatorias = () => {
    // Estados del componente
    const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [postulando, setPostulando] = useState<number | null>(null);

    /**
     * Función para obtener las convocatorias desde el API
     */
    const fetchConvocatorias = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.get('aspirante/ver-convocatorias', {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
            });

            if (!response.data?.convocatorias) {
                throw new Error('La respuesta no contiene el campo "convocatorias"');
            }

            setConvocatorias(response.data.convocatorias);
        } catch (err) {
            console.error('Error al obtener convocatorias:', err);
            setError('Error al cargar las convocatorias. Por favor intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Muestra un diálogo de confirmación antes de postularse
     * @param idConvocatoria - ID de la convocatoria a la que se desea postular
     */
    const confirmarPostulacion = (idConvocatoria: number) => {
        const convocatoria = convocatorias.find(c => c.id_convocatoria === idConvocatoria);

        toast.info(
            <div className="p-4 text-center">
                <p className="font-medium mb-4">¿Estás seguro que deseas postularte a "{convocatoria?.nombre_convocatoria}"?</p>
                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => {
                            toast.dismiss();
                            handlePostularse(idConvocatoria);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Sí, postularme
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                    >
                        No
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeButton: false,
                closeOnClick: false,
                draggable: false,
                className: 'w-full max-w-xs'
            }
        );
    };

    /**
     * Maneja el proceso de postulación a una convocatoria
     * @param idConvocatoria - ID de la convocatoria a la que se postula
     */
    const handlePostularse = async (idConvocatoria: number) => {
        try {
            setPostulando(idConvocatoria);

            await axiosInstance.post(
                `aspirante/crear-postulacion/${idConvocatoria}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                }
            );

            toast.success('¡Postulación enviada correctamente!');

            // Actualiza el estado de la convocatoria en la lista
            setConvocatorias(prevConvocatorias =>
                prevConvocatorias.map(conv =>
                    conv.id_convocatoria === idConvocatoria
                        ? { ...conv, estado_usuario: 'Postulado' }
                        : conv
                )
            );
        } catch (error: any) {
            console.error('Error al postularse:', error);

            // Manejo de diferentes tipos de errores
            let errorMessage = 'Ocurrió un error al postularse';
            if (error.response) {
                switch (error.response.status) {
                    case 403:
                        errorMessage = 'Esta convocatoria está cerrada y no admite más postulaciones';
                        break;
                    case 409:
                        errorMessage = 'Ya te has postulado a esta convocatoria';
                        break;
                    default:
                        errorMessage = error.response.data?.message || errorMessage;
                }
            }

            toast.error(errorMessage);
        } finally {
            setPostulando(null);
        }
    };

    // Efecto para cargar las convocatorias al montar el componente
    useEffect(() => {
        fetchConvocatorias();
    }, []);

    // Estados de carga
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 w-full bg-white rounded-lg shadow-sm p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-blue-600 font-medium">Cargando convocatorias...</p>
                <p className="text-gray-600 text-sm mt-2">Por favor espere un momento</p>
            </div>
        );
    }

    // Manejo de errores
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 p-4 w-full">
                <DocumentTextIcon className="h-12 w-12 text-red-500 mb-4" />
                <p className="text-red-500 text-center mb-4">{error}</p>
                <button
                    onClick={fetchConvocatorias}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    <ArrowPathIcon className="h-5 w-5" />
                    Reintentar
                </button>
            </div>
        );
    }

    // Renderizado principal
    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Información de convocatorias</h1>
                <Link
                    to="/ver/postulaciones"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md w-full sm:w-auto justify-center"
                >
                    <CheckIcon className="h-5 w-5" />
                    Ver mis postulaciones
                </Link>
            </div>

            {/* Lista de convocatorias */}
            {convocatorias.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 w-full bg-white rounded-lg shadow-sm p-6 text-center">
                    <DocumentTextIcon className="h-12 w-12 text-blue-500 mb-4" />
                    <p className="text-blue-600 font-medium">
                        No hay convocatorias disponibles actualmente.
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                        Por favor, intente más tarde.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {convocatorias.map((convocatoria) => (
                        <div key={convocatoria.id_convocatoria} className="w-full">
                            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden h-full flex flex-col justify-between">
                                <div className="p-6">
                                    {/* Encabezado de la convocatoria */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                                        <h2 className="text-lg font-bold text-gray-800">
                                            {convocatoria.nombre_convocatoria}
                                        </h2>
                                    </div>

                                    {/* Información básica */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Tipo:</p>
                                            <p className="text-gray-700">{convocatoria.tipo}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Estado:</p>
                                            <p className="text-gray-700 capitalize underline">
                                                {convocatoria.estado_convocatoria.toLowerCase()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Fechas */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Fecha publicación:</p>
                                            <p className="text-gray-700">
                                                {new Date(convocatoria.fecha_publicacion).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Fecha cierre:</p>
                                            <p className="text-gray-700">
                                                {new Date(convocatoria.fecha_cierre).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Descripción */}
                                    {convocatoria.descripcion && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-500">Descripción:</p>
                                            <p className="text-gray-700 break-words whitespace-pre-line text-justify">
                                                {convocatoria.descripcion}
                                            </p>
                                        </div>
                                    )}

                                    {/* Documentos asociados */}
                                    {convocatoria.documentos_convocatoria && convocatoria.documentos_convocatoria.length > 0 ? (
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium text-gray-500 mb-2">Documentos:</h3>
                                            {convocatoria.documentos_convocatoria.map((documento) => (
                                                <div
                                                    key={documento.id_documento}
                                                    className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                                                >
                                                    <a
                                                        href={documento.archivo_url}
                                                        download={documento.archivo.split('/').pop()}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-2 w-full inline-flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm transition-colors"
                                                    >
                                                        <EyeIcon className="h-4 w-4" />
                                                        Ver convocatoria
                                                    </a>
                                                    <button
                                                        onClick={() => confirmarPostulacion(convocatoria.id_convocatoria)}
                                                        disabled={postulando === convocatoria.id_convocatoria || convocatoria.estado_convocatoria === 'Cerrada'}
                                                        className="mt-2 w-full inline-flex items-center justify-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {postulando === convocatoria.id_convocatoria ? (
                                                            <>
                                                                <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                                                Postulando...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ArrowRightIcon className="h-4 w-4" />
                                                                Postularse
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2">No hay documentos asociados</p>
                                            <button
                                                onClick={() => confirmarPostulacion(convocatoria.id_convocatoria)}
                                                disabled={postulando === convocatoria.id_convocatoria || convocatoria.estado_convocatoria === 'Cerrada'}
                                                className="w-full inline-flex items-center justify-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {postulando === convocatoria.id_convocatoria ? (
                                                    <>
                                                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                                        Postulando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <ArrowRightIcon className="h-4 w-4" />
                                                        Postularse
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListaConvocatorias;