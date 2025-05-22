import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import axiosInstance from "../../../utils/axiosConfig";
import { toast } from "react-toastify";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../../componentes/tablas/DataTable";
import InputSearch from "../../../componentes/formularios/InputSearch";

interface Producciones {
  id_produccion_academica: number;
  ambito_divulgacion_id: number;
  titulo: string;
  numero_autores: number;
  medio_divulgacion: string;
  fecha_divulgacion: string;
}

const VerProducciones = ( ) => {
  const { id } = useParams();
  const [producciones, setProducciones] = useState<Producciones[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducciones = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/apoyoProfesoral/filtrar-docentes-produccion/${id}`
      );
      console.log("producciones", response.data.data);
      setProducciones(response.data.data);
    } catch (error) {
      console.error("Error al obtener producciones:", error);
      toast.error("Error al cargar las producciones");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducciones();
  }, []);

  const columns = useMemo<ColumnDef<Producciones>[]>(
    () => [
      {
        accessorKey: "titulo",
        header: "Título",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "medio_divulgacion",
        header: "Medio de divulgación",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "fecha_divulgacion",
        header: "Fecha de divulgación",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "numero_autores",
        header: "Número de autores",
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
            Producciones académicas
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
        data={producciones}
        columns={columns}
        globalFilter={globalFilter}
        loading={loading}
      />
    </div>
  );
};
export default VerProducciones;
