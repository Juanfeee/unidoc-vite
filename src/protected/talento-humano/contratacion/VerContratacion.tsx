import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../utils/axiosConfig";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../../componentes/tablas/DataTable";
import { toast } from "react-toastify";
import axios from "axios";
import EliminarBoton from "../../../componentes/EliminarBoton";
import { Link } from "react-router-dom";
import { PencilIcon } from "../../../assets/icons/Iconos";
import InputSearch from "../../../componentes/formularios/InputSearch";
import { ButtonRegresar } from "../../../componentes/formularios/ButtonRegresar";

// Define la estructura de los datos de contratación
interface UsuarioContratacion {
  primer_nombre: string;
  primer_apellido: string;
  numero_identificacion: string;
}

interface Contratacion {
  id_contratacion: number;
  user_id: number;
  tipo_contrato: string;
  area: string;
  fecha_inicio: string;
  fecha_fin: string;
  valor_contrato: number;
  usuario_contratacion?: UsuarioContratacion;
}
const VerContrataciones = () => {
  const [contrataciones, setContrataciones] = useState<Contratacion[]>([]); // Estado para almacenar las contrataciones
  const [globalFilter, setGlobalFilter] = useState(""); // Estado para manejar el filtro global
  const [loading, setLoading] = useState(true); // Estado para manejar el indicador de carga

  // Función para obtener las contrataciones desde el backend
  const fetchDatos = async () => {
    try {
      setLoading(true); // Indica que los datos se están cargando
      const response = await axiosInstance.get(
        "/talentoHumano/obtener-contrataciones"
      );

      // Limpieza de datos para asegurar una estructura consistente
      const datosLimpios = response.data.contrataciones.map((item: any) => ({
        ...item,
        usuario: item.usuario || {
          nombre: "No especificado",
          apellido: "",
          numero_identificacion: "N/A",
        },
      }));

      setContrataciones(datosLimpios); // Actualiza el estado con los datos procesados
    } catch (error) {
      console.error("Error al obtener contrataciones:", error);
      toast.error("Error al cargar las contrataciones"); // Muestra un mensaje de error
    } finally {
      setLoading(false); // Indica que la carga ha terminado
    }
  };

  // Llama a la función fetchDatos cuando el componente se monta
  useEffect(() => {
    fetchDatos();
  }, []);

  // Función para manejar la eliminación de una contratación
  const handleEliminar = async (id: number) => {
    try {
      await axiosInstance.delete(`/talentoHumano/eliminar-contratacion/${id}`);
      setContrataciones((prev) =>
        prev.filter((item) => item.id_contratacion !== id)
      ); // Actualiza el estado eliminando la contratación
      toast.success("Contratación eliminada correctamente"); // Muestra un mensaje de éxito
    } catch (error) {
      console.error("Error al eliminar contratación:", error);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Error al eliminar contratación"
        ); // Muestra el error desde el backend
      } else {
        toast.error("Error inesperado al eliminar"); // Muestra un error genérico
      }
    }
  };

  // Define las columnas de la tabla
  const columns = useMemo<ColumnDef<Contratacion>[]>(
    () => [
      {
        header: "Nombre Completo",
        accessorFn: (row) => {
          const nombre =
            row.usuario_contratacion?.primer_nombre || "No especificado";
          const apellido = row.usuario_contratacion?.primer_apellido || "";
          return `${nombre} ${apellido}`.trim();
        },
        size: 200,
      },
      {
        header: "Número Identificación",
        accessorFn: (row) =>
          row.usuario_contratacion?.numero_identificacion || "N/A",
        size: 150,
      },
      {
        header: "Área",
        accessorKey: "area", // Accede al campo `area`
        size: 100,
      },
      {
        header: "Inicio",
        accessorKey: "fecha_inicio", // Accede al campo `fecha_inicio`
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return new Date(value).toLocaleDateString(); // Formatea la fecha
        },
        size: 80,
      },
      {
        header: "Fin",
        accessorKey: "fecha_fin", // Accede al campo `fecha_fin`
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return new Date(value).toLocaleDateString(); // Formatea la fecha
        },
        size: 80,
      },
      {
        header: "Valor",
        accessorKey: "valor_contrato", // Accede al campo `valor_contrato`
        cell: ({ getValue }) => {
          const value = getValue() as number;
          return `$${value.toLocaleString()}`; // Formatea el valor como moneda
        },
        size: 100,
      },
      {
        header: "Acciones",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <Link
              to={`apoyo-profesoral/documentos-docente/${row.original.id_contratacion}`}
            >
              <PencilIcon />
            </Link>
            {/* Botón para eliminar la contratación */}
            <EliminarBoton
              id={row.original.id_contratacion}
              onConfirmDelete={handleEliminar}
            />
          </div>
        ),
        size: 100,
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-4 h-full min-w-5xl max-w-6xl bg-white rounded-3xl p-8 min-h-screen">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <Link to={"/talento-humano"}>
              <ButtonRegresar /> {/* Botón para regresar */}
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Contrataciones
          </h1>
        </div>
      </div>

      {/* Campo de búsqueda */}
      <div className="flex justify-between items-center w-full">
        <InputSearch
          type="text"
          placeholder="Buscar..." // Placeholder para el campo de búsqueda
          value={globalFilter} // Valor del filtro global
          onChange={(e) => setGlobalFilter(e.target.value)} // Actualiza el filtro global
        />
      </div>

      {/* Tabla de datos */}
      <DataTable
        data={contrataciones} // Datos de la tabla
        columns={columns} // Columnas de la tabla
        globalFilter={globalFilter} // Filtro global
        loading={loading} // Indicador de carga
      />
    </div>
  );
};

export default VerContrataciones;
