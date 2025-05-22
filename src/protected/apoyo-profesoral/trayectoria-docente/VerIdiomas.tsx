import { useEffect, useMemo, useState } from "react";
import InputSearch from "../../../componentes/formularios/InputSearch";
import { DataTable } from "../../../componentes/tablas/DataTable";
import { useParams } from "react-router";
import axiosInstance from "../../../utils/axiosConfig";
import { toast } from "react-toastify";
import { ColumnDef } from "@tanstack/react-table";

interface Idiomas {
  id_idioma: number;
  idioma: string;
  institucion_idioma: string;
  fecha_certificado: string;
  nivel: string;
}

const VerIdiomas = () => {
  const { id } = useParams();
  const [idiomas, setIdiomas] = useState<Idiomas[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchIdiomas = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/apoyoProfesoral/filtrar-docentes-idioma-id/${id}`
      );
      console.log("idiomas", response.data.data);
      setIdiomas(response.data.data);
    } catch (error) {
      console.error("Error al obtener idiomas:", error);
      toast.error("Error al cargar los idiomas");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchIdiomas();
  }, []);

  const columns = useMemo<ColumnDef<Idiomas>[]>(
    () => [
      {
        accessorKey: "idioma",
        header: "Idioma",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "institucion_idioma",
        header: "Institución",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "fecha_certificado",
        header: "Fecha certificado",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "nivel",
        header: "Nivel",
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
            Idiomas
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
        data={idiomas}
        columns={columns}
        globalFilter={globalFilter}
        loading={loading}
      />
    </div>
  );
};
export default VerIdiomas;
