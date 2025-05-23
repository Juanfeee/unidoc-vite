import axiosInstance from "../../../utils/axiosConfig";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../../componentes/tablas/DataTable";
import InputSearch from "../../../componentes/formularios/InputSearch";
import { VerDocumentos } from "../../../assets/icons/Iconos";

interface DocumentoEstudio {
  id_documento: number;
  archivo: string;
  estado: string;
  archivo_url: string;
}

interface Estudio {
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
  documentos_estudio: DocumentoEstudio[];
  created_at: string;
}


const VerEstudios = ({ idDocente }: { idDocente: string }) => {
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEstudios = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/apoyoProfesoral/filtrar-docentes-estudio-id/${idDocente}`
      );
      setEstudios(response.data.data);
    } catch (error) {
      console.error("Error al obtener estudios:", error);
      toast.error("Error al cargar los estudios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstudios();
  }, [idDocente]);

  // Actualizar el estado del documento solo se muestra cuando el documento tiene un estado pendiente
  const actualizarEstadoDocumento = async (
    idDocumento: number,
    nuevoEstado: string
  ) => {
    try {
      const formData = new FormData();
      formData.append("estado", nuevoEstado);
      formData.append("_method", "PUT");

      await axiosInstance.post(
        `apoyoProfesoral/actualizar-documento/${idDocumento}`,
        formData
      );

      toast.success("Estado actualizado correctamente");
      fetchEstudios();
    } catch (error) {
      console.error("Error al actualizar el estado del documento:", error);
    }
  };

  const columns = useMemo<ColumnDef<Estudio>[]>(
    () => [
      {
        accessorKey: "tipo_estudio",
        header: "Tipo de estudio",
      },
      {
        accessorKey: "institucion",
        header: "Institución",
      },
      {
        accessorKey: "titulo_estudio",
        header: "Título de estudio",
      },
      {
        accessorKey: "estado_documento",
        header: "Estado documento",
        cell: (info) => {
          const estudio = info.row.original;
          return estudio.documentos_estudio?.[0]?.estado || "No disponible";
        },
      },
      {
        accessorKey: "fecha_inicio",
        header: "Fecha de inicio",
      },
      {
        accessorKey: "fecha_fin",
        header: "Fecha de fin",
      },
      {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => {
          const estudio = row.original;
          return (
            <div className="flex  gap-2">
              {estudio.documentos_estudio?.map((documento) => (
                <div
                  key={documento.id_documento}
                  className="flex items-center justify-center gap-1"
                >
                  <div className=" gap-2 ">
                    <select
                      value={documento.estado}
                      onChange={(e) =>
                        actualizarEstadoDocumento(
                          documento.id_documento,
                          e.target.value
                        )
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="aprobado">Aprobado</option>
                      <option value="rechazado">Rechazado</option>
                    </select>
                  </div>
                  <div className="gap-2">
                    <a
                      href={documento.archivo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      <VerDocumentos texto="Ver documento" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-4 h-full min-w-5xl max-w-6xl bg-white rounded-3xl p-8 min-h-screen">
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
