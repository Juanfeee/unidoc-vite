import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../utils/axiosConfig";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../../componentes/tablas/DataTable";
import { toast } from "react-toastify";
import axios from "axios";
import EliminarBoton from "../../../componentes/EliminarBoton";
import { Link } from "react-router-dom";
import { PencilIcon } from "../../../assets/icons/Iconos";
import InputSearch from "../../../componentes/formularios/InputSearch";
import { ButtonRegresar } from "../../../componentes/formularios/ButtonRegresar";

interface Contratacion {
    id_contratacion: number;
    user_id: number;
    tipo_contrato: string;
    area: string;
    fecha_inicio: string;
    fecha_fin: string;
    valor_contrato: number;
}

const VerContrataciones = () => {
    const [contrataciones, setContrataciones] = useState<Contratacion[]>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchDatos = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/talentoHumano/obtener-contrataciones");

            // Limpieza de datos para asegurar que usuario siempre tenga una estructura válida
            const datosLimpios = response.data.contrataciones.map((item: any) => ({
                ...item,
                usuario: item.usuario || { 
                    nombre: 'No especificado', 
                    apellido: '',
                    numero_identificacion: 'N/A'
                }
            }));

            setContrataciones(datosLimpios);
        } catch (error) {
            console.error("Error al obtener contrataciones:", error);
            toast.error("Error al cargar las contrataciones");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDatos();
    }, []);

    const handleEliminar = async (id: number) => {
        try {
            await axiosInstance.delete(`/talentoHumano/eliminar-contratacion/${id}`);
            setContrataciones(prev => prev.filter(item => item.id_contratacion !== id));
            toast.success("Contratación eliminada correctamente");
        } catch (error) {
            console.error("Error al eliminar contratación:", error);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Error al eliminar contratación");
            } else {
                toast.error("Error inesperado al eliminar");
            }
        }
    };

    const columns = useMemo<ColumnDef<Contratacion>[]>(
        () => [
            {
                header: "ID Contratación",
                accessorKey: "id_contratacion",
                size: 50,
            },
            {
                header: "ID Usuario",
                accessorKey: "user_id",
                size: 50,
            },
            {
                header: "Tipo de Contrato",
                accessorKey: "tipo_contrato",
                size: 100,
            },
            {
                header: "Área",
                accessorKey: "area",
                size: 100,
            },
            {
                header: "Inicio",
                accessorKey: "fecha_inicio",
                cell: ({ getValue }) => {
                    const value = getValue() as string;
                    return new Date(value).toLocaleDateString();
                },
                size: 80,
            },
            {
                header: "Fin",
                accessorKey: "fecha_fin",
                cell: ({ getValue }) => {
                    const value = getValue() as string;
                    return new Date(value).toLocaleDateString();
                },
                size: 80,
            },
            {
                header: "Valor",
                accessorKey: "valor_contrato",
                cell: ({ getValue }) => {
                    const value = getValue() as number;
                    return `$${value.toLocaleString()}`;
                },
                size: 100,
            },
            {
                header: "Acciones",
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <Link to={`apoyo-profesoral/documentos-docente/${row.original.id_contratacion}`}>
                            <PencilIcon />
                        </Link>
                        <EliminarBoton
                            id={row.original.id_contratacion}
                            onConfirmDelete={handleEliminar}
                        />
                    </div>
                ),
                size: 100,
            },
        ],
        []
    );

    return (
        <div className="flex flex-col gap-4 h-full min-w-5xl max-w-6xl bg-white rounded-3xl p-8 min-h-screen">
            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                        <Link to={"/talento-humano"}>
                            <ButtonRegresar />
                        </Link>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Contrataciones</h1>
                </div>
            </div>

            <div className="flex justify-between items-center w-full">
                <InputSearch
                    type="text"
                    placeholder="Buscar..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>

            <DataTable
                data={contrataciones}
                columns={columns}
                globalFilter={globalFilter}
                loading={loading}
            />
        </div>
    );
};

export default VerContrataciones;