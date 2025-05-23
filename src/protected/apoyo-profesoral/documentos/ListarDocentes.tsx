import { Link, Outlet } from "react-router";
import { ButtonRegresar } from "../../../componentes/formularios/ButtonRegresar";
import InputSearch from "../../../componentes/formularios/InputSearch";
import { DataTable } from "../../../componentes/tablas/DataTable";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ColumnDef } from "@tanstack/react-table";
import axiosInstance from "../../../utils/axiosConfig";
import { PencilIcon, VerDocumentos } from "../../../assets/icons/Iconos";

interface Docente {
  id: number;
  nombre_completo: string;
  numero_identificacion: string;
}

const ListarDocentes = () => {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDatos = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        "/apoyoProfesoral/listar-docentes"
      );
      console.log(response.data);
      setDocentes(response.data.data);
    } catch (error) {
      console.error("Error al obtener docentes:", error);
      toast.error("Error al cargar los docentes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const columns = useMemo<ColumnDef<Docente>[]>(
    () => [
      {
        accessorKey: "nombre_completo",
        header: "Nombre completo",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "numero_identificacion",
        header: "Número de identificación",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "email",
        header: "Correo electrónico",
        cell: (info) => info.getValue(),
      },
      {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => (
            <Link to={`documentos/${row.original.id}`}>
              <VerDocumentos
                texto="Ver documentos"
              />
            </Link>
        ),
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-4 h-full min-w-5xl max-w-6xl bg-white rounded-3xl p-8 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <Link to={"/apoyo-profesoral"}>
              <ButtonRegresar />
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Docentes
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
        data={docentes}
        columns={columns}
        globalFilter={globalFilter}
        loading={loading}
      />
    </div>
  );
};

export default ListarDocentes;
