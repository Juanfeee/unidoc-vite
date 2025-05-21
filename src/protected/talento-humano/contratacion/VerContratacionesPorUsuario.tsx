import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../../utils/axiosConfig";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../../componentes/tablas/DataTable";
import { toast } from "react-toastify";
import { ButtonRegresar } from "../../../componentes/formularios/ButtonRegresar";
import EliminarBoton from "../../../componentes/EliminarBoton";
import { PencilIcon } from "../../../assets/icons/Iconos";

// Definición de la estructura de datos para una contratación
interface Contratacion {
  id_contratacion: number;
  user_id: number;
  tipo_contrato: string;
  area: string;
  fecha_inicio: string;
  fecha_fin: string;
  valor_contrato: number;
}

const VerContratacionesPorUsuario = () => {
  // Obtiene el `user_id` desde los parámetros de la URL
  const { user_id } = useParams<{ user_id: string }>();

  // Estados para almacenar contrataciones y manejar la carga
  const [contrataciones, setContrataciones] = useState<Contratacion[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener las contrataciones desde el backend
  const fetchDatos = async () => {
    try {
      setLoading(true); // Indica que los datos están en proceso de carga
      const response = await axiosInstance.get("/talentoHumano/obtener-contrataciones");
      const todasContrataciones = response.data.contrataciones;

      // Filtra las contrataciones por el `user_id` proporcionado en la URL
      const filtradas = todasContrataciones.filter(
        (contrato: Contratacion) => contrato.user_id === Number(user_id)
      );
      setContrataciones(filtradas); // Actualiza el estado con las contrataciones filtradas
    } catch (error) {
      console.error("Error al obtener contrataciones:", error);
      toast.error("Error al cargar las contrataciones"); // Muestra un mensaje de error
    } finally {
      setLoading(false); // Indica que la carga ha finalizado
    }
  };

  // Ejecuta la función fetchDatos al montar el componente y cuando cambia el `user_id`
  useEffect(() => {
    fetchDatos();
  }, [user_id]);

  // Función para manejar la eliminación de una contratación
  const handleEliminar = async (id: number) => {
    try {
      await axiosInstance.delete(`/talentoHumano/eliminar-contratacion/${id}`);
      // Filtra las contrataciones para eliminar la correspondiente al ID
      setContrataciones((prev) => prev.filter((item) => item.id_contratacion !== id));
      toast.success("Contratación eliminada correctamente"); // Muestra un mensaje de éxito
    } catch (error) {
      console.error("Error al eliminar contratación:", error);
      toast.error("Error al eliminar contratación"); // Muestra un mensaje de error
    }
  };

  // Define las columnas de la tabla
  const columns = useMemo<ColumnDef<Contratacion>[]>(
    () => [
      {
        header: "ID Contratación",
        accessorKey: "id_contratacion", // Accede al campo `id_contratacion`
      },
      {
        header: "ID Usuario",
        accessorKey: "user_id", // Accede al campo `user_id`
      },
      {
        header: "Tipo de Contrato",
        accessorKey: "tipo_contrato", // Accede al campo `tipo_contrato`
      },
      {
        header: "Área",
        accessorKey: "area", // Accede al campo `area`
      },
      {
        header: "Inicio",
        accessorKey: "fecha_inicio", // Accede al campo `fecha_inicio`
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return new Date(value).toLocaleDateString(); // Formatea la fecha
        },
      },
      {
        header: "Fin",
        accessorKey: "fecha_fin", // Accede al campo `fecha_fin`
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return new Date(value).toLocaleDateString(); // Formatea la fecha
        },
      },
      {
        header: "Valor",
        accessorKey: "valor_contrato", // Accede al campo `valor_contrato`
        cell: ({ getValue }) => {
          const value = getValue() as number;
          return `$${value.toLocaleString()}`; // Formatea el valor en formato de moneda
        },
      },
      {
        header: "Acciones",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            {/* Enlace para editar la contratación */}
            <Link to={`/talento-humano/contrataciones/contratacion/${row.original.id_contratacion}`}>
              <PencilIcon />
            </Link>
            {/* Botón para eliminar la contratación */}
            <EliminarBoton
              id={row.original.id_contratacion}
              onConfirmDelete={handleEliminar}
            />
          </div>
        ),
      },
    ],
    []
  );
  
  return (
    <div className="flex flex-col gap-4 h-full min-w-5xl max-w-6xl bg-white rounded-3xl p-8 min-h-screen">
      <div className="flex items-center gap-4">
        <Link to="/talento-humano/postulaciones">
          <ButtonRegresar />
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold">Contratato del docente</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : contrataciones.length === 0 ? (
        <p>No se encontraron contrataciones para este usuario.</p>
      ) : (
        <DataTable data={contrataciones} columns={columns} loading={loading} />
      )}
    </div>
  );
};

export default VerContratacionesPorUsuario;