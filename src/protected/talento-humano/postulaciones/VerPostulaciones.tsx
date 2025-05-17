import InputSearch from "../../../componentes/formularios/InputSearch";
import { DataTable } from "../../../componentes/tablas/DataTable";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../utils/axiosConfig";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "react-toastify";
import axios from "axios";
import Cookie from "js-cookie";

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
  };
}

const VerPostulaciones = () => {
  const [postulaciones, setPostulaciones] = useState<Postulaciones[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDatos = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        "/talentoHumano/obtener-postulaciones"
      );
      setPostulaciones(response.data.postulaciones);
      console.log("postulaciones", response.data.postulaciones);
    } catch (error) {
      console.error("Error al obtener postulaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const handleEliminar = async (id: number) => {
    try {
      await axiosInstance.delete(`/talentoHumano/eliminar-postulacion/${id}`);

      // Actualizar estado de manera óptima
      setPostulaciones((prev) =>
        prev.filter((item) => item.id_postulacion !== id)
      );
      toast.success("Convocatoria eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);

      if (axios.isAxiosError(error)) {
        toast.error("Error al eliminar la convocatoria");
      }
    }
  };

  // Actualizar el estado de la postulación
  const handleActualizar = async (
    id: number,
    nuevoEstado: "Aceptada" | "Rechazada"
  ) => {
    try {
      await axiosInstance.put(`/talentoHumano/actualizar-postulacion/${id}`, {
        estado_postulacion: nuevoEstado,
      });

      // Actualizar estado de manera óptima
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

  // Ver hoja de vida del postulante en pdf
  const handleVerHojaVida = async (convocatoriaId: number, userId: number) => {
    const url = `${
      import.meta.env.VITE_API_URL
    }/talentoHumano/hoja-de-vida-pdf/${convocatoriaId}/${userId}`;
    console.log("URL de la hoja de vida:", url);
    try {
      const response = await axios.get(url, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${Cookie.get("token")}`,
        },
        withCredentials: true,
      });

      // Crear un blob a partir de la respuesta
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });

      // Crear una URL para el blob
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Abrir el PDF en una nueva pestaña
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Error al ver la hoja de vida:", error);
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
        header: "Nombre Convocatoria",
        size: 100,
      },
      {
        accessorKey: "estado_postulacion",
        header: "Estado Postulación",
        size: 50,
      },
      {
        accessorKey: "usuario_postulacion.numero_identificacion",
        header: "Identificación",
        size: 100,
      },
      {
        id: "nombrePostulante",
        header: "Nombre Postulante",
        accessorFn: (row) =>
          `${row.usuario_postulacion.primer_nombre} ${row.usuario_postulacion.primer_apellido}`,
        size: 200,
      },
      {
        accessorKey: "convocatoria_postulacion.estado_convocatoria",
        header: "Estado Convocatoria",
        size: 50,
      },
      {
        header: "Acciones",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={() =>
                handleVerHojaVida(
                  row.original.convocatoria_id,
                  row.original.user_id
                )
              }
            >
              Ver Hoja de Vida
            </button>
            <select
              className="border rounded px-2 py-1"
              onChange={(e) =>
                handleActualizar(
                  row.original.id_postulacion,
                  e.target.value as "Aceptada" | "Rechazada"
                )
              }
            >
              <option value="">Cambiar estado</option>
              <option value="Aceptada">Aceptar</option>
              <option value="Rechazada">Rechazar</option>
            </select>
            {/* <EliminarBoton
              id={row.original.id_postulacion}
              onConfirmDelete={handleEliminar}
            /> */}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-4 h-full min-w-5xl bg-white rounded-3xl p-8 min-h-screen">
      <h1 className="text-lg font-semibold">Postulaciones</h1>
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
