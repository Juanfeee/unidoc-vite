import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../utils/axiosConfig";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../../componentes/tablas/DataTable";
import { ButtonTable } from "../../../componentes/formularios/ButtonTabla";
import { toast } from "react-toastify";
import axios from "axios";
import EliminarBoton from "../../../componentes/EliminarBoton";
import { Link } from "react-router";
import { PencilIcon } from "../../../assets/icons/Iconos";
import InputSearch from "../../../componentes/formularios/InputSearch";

interface Convocatoria {
  id_convocatoria: number;
  nombre_convocatoria: string;
  tipo: string;
  estado_convocatoria: string;
  fecha_publicacion: string;
  fecha_cierre: string;
}

const VerConvocatoria = () => {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);


  const fetchDatos = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        "/talentoHumano/obtener-convocatorias"
      );
      setConvocatorias(response.data.convocatorias);
    } catch (error) {
      console.error("Error al obtener convocatorias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);


  const handleEliminar = async (id: number) => {
    try {
      await axiosInstance.delete(`/talentoHumano/eliminar-convocatoria/${id}`);

      // Actualizar estado de manera óptima
      setConvocatorias((prev) =>
        prev.filter((item) => item.id_convocatoria !== id)
      );

      // Opcional: Mostrar notificación más elegante que alert()
      toast.success("Convocatoria eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);

      // Manejo de errores más robusto
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error al eliminar");
      } else {
        toast.error("Error inesperado al eliminar");
      }
    }
  };

  const columns = useMemo<ColumnDef<Convocatoria>[]>(
    () => [
      {
        header: "Nombre",
        accessorKey: "nombre_convocatoria",
      },
      {
        header: "Tipo",
        accessorKey: "tipo",
      },
      {
        header: "Estado",
        accessorKey: "estado_convocatoria",
      },
      {
        header: "Publicación",
        accessorKey: "fecha_publicacion",
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return new Date(value).toLocaleDateString();
        },
      },
      {
        header: "Cierre",
        accessorKey: "fecha_cierre",
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return new Date(value).toLocaleDateString();
        },
      },
      {
        header: "Acciones",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <Link
              to={`convocatoria/${row.original.id_convocatoria}
            `}
            >
              <PencilIcon />
            </Link>
            <EliminarBoton
              id={row.original.id_convocatoria}
              onConfirmDelete={handleEliminar}
            />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-4 h-full min-w-5xl max-w-6xl bg-white rounded-3xl p-8 min-h-screen">
      <h1 className="text-lg font-semibold">Convocatorias</h1>

      <div className="flex justify-between items-center w-full">
        <InputSearch
          type="text"
          placeholder="Buscar..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <Link to="convocatoria">
          <ButtonTable value="Agregar Convocatoria" />
        </Link>
      </div>

        <DataTable
          data={convocatorias}
          columns={columns}
          globalFilter={globalFilter}
          loading={loading}
        />

    </div>
  );
};

export default VerConvocatoria;
