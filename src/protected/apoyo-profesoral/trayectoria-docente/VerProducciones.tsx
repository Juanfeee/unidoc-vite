import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import axiosInstance from "../../../utils/axiosConfig";
import { toast } from "react-toastify";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../../componentes/tablas/DataTable";
import InputSearch from "../../../componentes/formularios/InputSearch";
import { VerDocumentos } from "../../../assets/icons/Iconos";

interface DocumentoExperiencia {
  id_documento: number;
  archivo: string;
  estado: string;
  archivo_url: string;
}

interface Experiencia {
  tipo_experiencia: string;
  institucion_experiencia: string;
  cargo: string;
  intensidad_horaria: number;
  fecha_inicio: string;
  fecha_finalizacion: string;
  documentos_experiencia?: DocumentoExperiencia[];
}

const VerExperiencia = () => {
  const { id } = useParams();
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchExperiencias = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/apoyoProfesoral/filtrar-docentes-experiencia-id/${id}`
      );
      setExperiencias(response.data.data);
    } catch (error) {
      console.error("Error al obtener experiencias:", error);
      toast.error("Error al cargar las experiencias");
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstadoDocumento = async (
    idDocumento: number,
    nuevoEstado: string
  ) => {
    try {
      const formData = new FormData();
      formData.append("estado", nuevoEstado);
      formData.append("_method", "PUT");

      await axiosInstance.post(
        `/apoyoProfesoral/actualizar-documento/${idDocumento}`,
        formData
      );

      toast.success("Estado actualizado correctamente");
      fetchExperiencias();
    } catch (error) {
      console.error("Error al actualizar el estado del documento:", error);
      toast.error("Error al actualizar el estado");
    }
  };

  useEffect(() => {
    fetchExperiencias();
  }, [id]);

  const columns = useMemo<ColumnDef<Experiencia>[]>(() => [
    {
      accessorKey: "tipo_experiencia",
      header: "Tipo de experiencia",
    },
    {
      accessorKey: "institucion_experiencia",
      header: "Institución",
    },
    {
      accessorKey: "cargo",
      header: "Cargo",
    },
    {
      accessorKey: "intensidad_horaria",
      header: "Intensidad horaria",
    },
    {
      accessorKey: "fecha_inicio",
      header: "Fecha de inicio",
    },
    {
      accessorKey: "fecha_finalizacion",
      header: "Fecha de finalización",
    },
    {
      accessorKey: "estado_documento",
      header: "Estado documento",
      cell: (info) => {
        const experiencia = info.row.original;
        return experiencia.documentos_experiencia?.[0]?.estado || "No disponible";
      },
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const experiencia = row.original;
        return (
          <div className="flex gap-2 flex-col">
            {experiencia.documentos_experiencia?.map((documento) => (
              <div
                key={documento.id_documento}
                className="flex items-center gap-2"
              >
                <select
                  value={documento.estado}
                  onChange={(e) =>
                    actualizarEstadoDocumento(
                      documento.id_documento,
                      e.target.value
                    )
                  }
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="rechazado">Rechazado</option>
                </select>
                <a
                  href={documento.archivo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  <VerDocumentos texto="Ver documento" />
                </a>
              </div>
            ))}
          </div>
        );
      },
    },
  ], []);

  return (
    <div className="flex flex-col gap-4 h-full min-w-5xl max-w-6xl bg-white rounded-3xl p-8 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Experiencia profesional
        </h1>
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
        data={experiencias}
        columns={columns}
        globalFilter={globalFilter}
        loading={loading}
      />
    </div>
  );
};

export default VerExperiencia;
