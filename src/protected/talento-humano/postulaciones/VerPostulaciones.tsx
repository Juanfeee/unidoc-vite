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

// Interfaz para definir la estructura de los datos de las postulaciones
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

// Interfaz para definir la estructura de los datos de contrataciones
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
  // Estado para almacenar las postulaciones
  const [postulaciones, setPostulaciones] = useState<Postulaciones[]>([]);
  // Estado para almacenar los IDs de los usuarios ya contratados
  const [usuariosContratados, setUsuariosContratados] = useState<number[]>([]);
  // Estado para almacenar las contrataciones
  const [contrataciones, setContrataciones] = useState<Contratacion[]>([]);
  // Estado para manejar el filtro global de búsqueda
  const [globalFilter, setGlobalFilter] = useState("");
  // Estado para manejar el indicador de carga
  const [loading, setLoading] = useState(true);

  // Función para obtener datos de postulaciones y contrataciones
  const fetchDatos = async () => {
    try {
      setLoading(true); // Indica que los datos están en proceso de carga
      const [postulacionesRes, contratacionesRes] = await Promise.all([
        axiosInstance.get("/talentoHumano/obtener-postulaciones"),
        axiosInstance.get("/talentoHumano/obtener-contrataciones")
      ]);

      // Actualiza el estado con los datos obtenidos
      setPostulaciones(postulacionesRes.data.postulaciones);
      setContrataciones(contratacionesRes.data.contrataciones);

      // Extrae los IDs de los usuarios ya contratados
      const idsContratados = contratacionesRes.data.contrataciones.map((c: any) => c.user_id);
      setUsuariosContratados(idsContratados);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      toast.error("Error al cargar los datos"); // Muestra un mensaje de error
    } finally {
      setLoading(false); // Indica que la carga ha finalizado
    }
  };

  // Llama a la función fetchDatos al montar el componente
  useEffect(() => {
    fetchDatos();
  }, []);

  // Función para actualizar el estado de una postulación
  const handleActualizar = async (
    id: number,
    nuevoEstado: "Aceptada" | "Rechazada"
  ) => {
    try {
      await axiosInstance.put(`/talentoHumano/actualizar-postulacion/${id}`, {
        estado_postulacion: nuevoEstado,
      });

      // Actualiza el estado de la postulación en el frontend
      setPostulaciones((prev) =>
        prev.map((item) =>
          item.id_postulacion === id
            ? { ...item, estado_postulacion: nuevoEstado }
            : item
        )
      );
      toast.success(`Postulación ${nuevoEstado.toLowerCase()} correctamente`); // Muestra un mensaje de éxito
    } catch (error) {
      console.error("Error al actualizar:", error);
      if (axios.isAxiosError(error)) {
        toast.error(`Error al ${nuevoEstado.toLowerCase()} la postulación`); // Muestra un mensaje de error
      }
    }
  };

  // Función para ver la hoja de vida de un postulante en formato PDF
  const handleVerHojaVida = async (convocatoriaId: number, userId: number) => {
    const url = `${import.meta.env.VITE_API_URL
      }/talentoHumano/hoja-de-vida-pdf/${convocatoriaId}/${userId}`;
    try {
      const response = await axios.get(url, {
        responseType: "blob", // Indica que la respuesta es un archivo binario
        headers: {
          Authorization: `Bearer ${Cookie.get("token")}`, // Incluye el token de autorización
        },
        withCredentials: true,
      });

      // Crea un objeto URL para abrir el PDF en una nueva pestaña
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Error al ver la hoja de vida:", error);
      toast.error("Error al cargar la hoja de vida"); // Muestra un mensaje de error
    }
  };

  // Define las columnas de la tabla
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
          const VerContratacionesPorUsuario = contrataciones.find(
            (c) => c.user_id === row.original.user_id
          );

          return (
            <div className="flex space-x-2">
              {/* Selector para aceptar o rechazar postulaciones */}
              <select
                className="border rounded px-2 py-1"
                onChange={(e) =>
                  handleActualizar(
                    row.original.id_postulacion,
                    e.target.value as "Aceptada" | "Rechazada"
                  )
                }
                value={row.original.estado_postulacion}
                disabled={yaContratado} // Deshabilita si el usuario ya está contratado
              >
                <option value="Aceptada">Aceptar</option>
                <option value="Rechazada">Rechazar</option>
              </select>

              {/* Botón para visualizar la hoja de vida */}
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

              {/* Botón para contratar o ver contrato */}
              {row.original.estado_postulacion === "Aceptada" && (
                yaContratado ? (
                  <Link
                    to={`/talento-humano/contrataciones/usuario/${row.original.user_id}`}
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

  // Renderiza el contenido del componente
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

      {/* Campo de búsqueda */}
      <div className="flex justify-between items-center w-full">
        <InputSearch
          type="text"
          placeholder="Buscar..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      {/* Tabla de datos */}
      <DataTable
        data={postulaciones} // Datos de la tabla
        columns={columns} // Columnas de la tabla
        globalFilter={globalFilter} // Filtro global
        loading={loading} // Estado de carga
      />
    </div>
  );
};

export default VerPostulaciones;