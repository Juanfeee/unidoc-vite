import InputSearch from "../../../componentes/formularios/InputSearch";
import { DataTable } from "../../../componentes/tablas/DataTable";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../utils/axiosConfig";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "react-toastify";
import axios from "axios";
import Cookie from "js-cookie";
import { Link } from "react-router-dom";
import { ButtonRegresar } from "../../../componentes/formularios/ButtonRegresar";

interface Postulaciones {
  id_postulacion: number;
  convocatoria_id: number;
  user_id: number;
  nombre_postulante: string;
  estado_postulacion: string;
  fecha_postulacion: string;
  usuario_postulacion: {
    primer_nombre: string;
    primer_apellido: string;
    numero_identificacion: string;
  };
  convocatoria_postulacion: {
    nombre_convocatoria: string;
    estado_convocatoria: string;
  };
}

interface Contratacion {
  id_contratacion: number;
  user_id: number;
  tipo_contrato: string;
  area: string;
  fecha_inicio: string;
  fecha_fin: string;
  valor_contrato: number;
}

const VerPostulaciones = () => {
  const [postulaciones, setPostulaciones] = useState<Postulaciones[]>([]);
  const [usuariosContratados, setUsuariosContratados] = useState<number[]>([]);
  const [contrataciones, setContrataciones] = useState<Contratacion[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDatos = async () => {
    try {
      setLoading(true);
      const [postulacionesRes, contratacionesRes] = await Promise.all([
        axiosInstance.get("/talentoHumano/obtener-postulaciones"),
        axiosInstance.get("/talentoHumano/obtener-contrataciones")
      ]);
      
      setPostulaciones(postulacionesRes.data.postulaciones);
      setContrataciones(contratacionesRes.data.contrataciones);
      
      const idsContratados = contratacionesRes.data.contrataciones.map((c: any) => c.user_id);
      setUsuariosContratados(idsContratados);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const handleActualizar = async (
    id: number,
    nuevoEstado: "Aceptada" | "Rechazada"
  ) => {
    try {
      await axiosInstance.put(`/talentoHumano/actualizar-postulacion/${id}`, {
        estado_postulacion: nuevoEstado,
      });

      setPostulaciones((prev) =>
        prev.map((item) =>
          item.id_postulacion === id
            ? { ...item, estado_postulacion: nuevoEstado }
            : item
        )
      );
      toast.success(`Postulación ${nuevoEstado.toLowerCase()} correctamente`);
    } catch (error) {
      console.error("Error al actualizar:", error);
      if (axios.isAxiosError(error)) {
        toast.error(`Error al ${nuevoEstado.toLowerCase()} la postulación`);
      }
    }
  };

  const handleVerHojaVida = async (convocatoriaId: number, userId: number) => {
    const url = `${import.meta.env.VITE_API_URL
      }/talentoHumano/hoja-de-vida-pdf/${convocatoriaId}/${userId}`;
    try {
      const response = await axios.get(url, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${Cookie.get("token")}`,
        },
        withCredentials: true,
      });

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Error al ver la hoja de vida:", error);
      toast.error("Error al cargar la hoja de vida");
    }
  };

  const columns = useMemo<ColumnDef<Postulaciones>[]>(
    () => [
      {
        accessorKey: "id_postulacion",
        header: "ID Postulación",
        size: 50,
      },
      {
        accessorKey: "convocatoria_postulacion.nombre_convocatoria",
        header: "Convocatoria",
        size: 100,
      },
      {
        accessorKey: "estado_postulacion",
        header: "Estado",
        size: 50,
      },
      {
        accessorKey: "usuario_postulacion.numero_identificacion",
        header: "Identificación",
        size: 100,
      },
      {
        id: "nombrePostulante",
        header: "Postulante",
        accessorFn: (row) =>
          `${row.usuario_postulacion.primer_nombre} ${row.usuario_postulacion.primer_apellido}`,
        size: 200,
      },
      {
        accessorKey: "convocatoria_postulacion.estado_convocatoria",
        header: "Estado Conv.",
        size: 50,
      },
      {
        header: "Acciones",
        cell: ({ row }) => {
          const yaContratado = usuariosContratados.includes(row.original.user_id);
          const contratoUsuario = contrataciones.find(
            (c) => c.user_id === row.original.user_id
          );
          
          return (
            <div className="flex space-x-2">
              <select
                className="border rounded px-2 py-1"
                onChange={(e) =>
                  handleActualizar(
                    row.original.id_postulacion,
                    e.target.value as "Aceptada" | "Rechazada"
                  )
                }
                value={row.original.estado_postulacion}
                disabled={yaContratado}
              >
                <option value="Aceptada">Aceptar</option>
                <option value="Rechazada">Rechazar</option>
              </select>

              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() =>
                  handleVerHojaVida(
                    row.original.convocatoria_id,
                    row.original.user_id
                  )
                }
              >
                Hoja de Vida
              </button>

              {row.original.estado_postulacion === "Aceptada" && (
                yaContratado ? (
                  <Link
                    to={`/talento-humano/contrataciones/contratacion/${contratoUsuario?.id_contratacion}`}
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    Ver Contrato
                  </Link>
                ) : (
                  <Link
                    to={`/talento-humano/contrataciones/contratacion/${row.original.user_id}`}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Contratar
                  </Link>
                )
              )}
            </div>
          );
        },
      },
    ],
    [usuariosContratados, contrataciones]
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Postulaciones</h1>
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
        data={postulaciones}
        columns={columns}
        globalFilter={globalFilter}
        loading={loading}
      />
    </div>
  );
};

export default VerPostulaciones;