import { Link, useParams } from "react-router";
import axiosInstance from "../../../utils/axiosConfig";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../../componentes/tablas/DataTable";
import InputSearch from "../../../componentes/formularios/InputSearch";
import { ButtonRegresar } from "../../../componentes/formularios/ButtonRegresar";

interface Estudios {
  id_estudio: number;
  tipo_estudio: string;
  institucion: string;
  graduado: string;
  fecha_graduacion: string;
  titulo_convalido: string;
  fecha_convalidacion: string;
  resolucion_convalidacion: string;
  posible_fecha_graduacion: string;
  titulo_estudio: string;
  fecha_inicio: string;
  fecha_fin: string;
}

const VerEstudios = () => {
  const { id } = useParams();
  const [estudios, setDocumentos] = useState<Estudios[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEstudios = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/apoyoProfesoral/filtrar-docentes-estudio-id/${id}`
      );
      console.log("estudios", response.data.data);
      setDocumentos(response.data.data);
    } catch (error) {
      console.error("Error al obtener estudios:", error);
      toast.error("Error al cargar los estudios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstudios();
  }, []);

  const columns = useMemo<ColumnDef<Estudios>[]>(
    () => [
      {
        accessorKey: "tipo_estudio",
        header: "Tipo de estudio",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "institucion",
        header: "Institución",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "titulo_estudio",
        header: "Título de estudio",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "fecha_inicio",
        header: "Fecha de inicio",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "fecha_fin",
        header: "Fecha de fin",
        cell: (info) => info.getValue(),
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-4 h-full min-w-5xl max-w-6xl bg-white rounded-3xl p-8 min-h-screen">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Estudios
          </h1>
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
        data={estudios}
        columns={columns}
        globalFilter={globalFilter}
        loading={loading}
      />
    </div>
  );
};
export default VerEstudios;
