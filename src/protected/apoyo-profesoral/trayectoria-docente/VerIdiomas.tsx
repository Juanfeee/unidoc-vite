import { useEffect, useMemo, useState } from "react";
import InputSearch from "../../../componentes/formularios/InputSearch";
import { DataTable } from "../../../componentes/tablas/DataTable";
import { useParams } from "react-router";
import axiosInstance from "../../../utils/axiosConfig";
import { toast } from "react-toastify";
import { ColumnDef } from "@tanstack/react-table";
import { VerDocumentos } from "../../../assets/icons/Iconos";

interface DocumentoIdioma {
  id_documento: number;
  archivo: string;
  estado: string;
  archivo_url: string;
}

interface Idiomas {
  id_idioma: number;
  idioma: string;
  institucion_idioma: string;
  fecha_certificado: string;
  nivel: string;
  documentos_idioma?: DocumentoIdioma[];
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
  }, [id]);

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
      fetchIdiomas();
    } catch (error) {
      console.error("Error al actualizar el estado del documento:", error);
      toast.error("Error al actualizar el estado");
    }
  };

  const columns = useMemo<ColumnDef<Idiomas>[]>(
    () => [
      {
        accessorKey: "idioma",
        header: "Idioma",
      },
      {
        accessorKey: "institucion_idioma",
        header: "Institución",
      },
      {
        accessorKey: "fecha_certificado",
        header: "Fecha certificado",
      },
      {
        accessorKey: "nivel",
        header: "Nivel",
      },
      {
        accessorKey: "estado_documento",
        header: "Estado documento",
        cell: (info) => {
          const idioma = info.row.original;
          return idioma.documentos_idioma?.[0]?.estado || "No disponible";
        },
      },
      {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => {
          const idioma = row.original;
          return (
            <div className="flex gap-2">
              {idioma.documentos_idioma?.map((documento) => (
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
                    <VerDocumentos texto="Ver certificado" />
                  </a>
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
