import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { aptitudSchema } from "../../../validaciones/aptitudSchema";
import axiosInstance from "../../../utils/axiosConfig";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { ButtonRegresar } from "../../../componentes/formularios/ButtonRegresar";
import { InputLabel } from "../../../componentes/formularios/InputLabel";
import TextInput from "../../../componentes/formularios/TextInput";
import TextArea from "../../../componentes/formularios/TextArea";
import InputErrors from "../../../componentes/formularios/InputErrors";
import { ButtonPrimary } from "../../../componentes/formularios/ButtonPrimary";
import { RolesValidos } from "../../../types/roles";
import { jwtDecode } from "jwt-decode";

type Inputs = {
  nombre_aptitud: string;
  descripcion_aptitud: string;
};

const EditarAptitud = () => {
  const token = Cookies.get("token");
  if (!token) throw new Error("No authentication token found");
  const decoded = jwtDecode<{ rol: RolesValidos }>(token);
  const rol = decoded.rol;

  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(aptitudSchema),
  });

  useEffect(() => {
    const fetchAptitud = async () => {
      try {
        const ENDPOINTS = {
          Aspirante: `${import.meta.env.VITE_API_URL}${
            import.meta.env.VITE_ENDPOINT_OBTENER_APTITUDES_ID_ASPIRANTE
          }`,
          Docente: `${import.meta.env.VITE_API_URL}${
            import.meta.env.VITE_ENDPOINT_OBTENER_APTITUDES_ID_DOCENTE
          }`,
        };
        const endpoint = ENDPOINTS[rol];
        const response = await axiosInstance.get(`${endpoint}/${id}`);

        if (response.data?.aptitud) {
          setValue("nombre_aptitud", response.data.aptitud.nombre_aptitud);
          setValue(
            "descripcion_aptitud",
            response.data.aptitud.descripcion_aptitud
          );
        }
      } catch (error) {
        console.error("Error al obtener la aptitud:", error);
        toast.error("Error al cargar los datos de la aptitud");
      }
    };

    fetchAptitud();
  }, [id, setValue]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);
    try {
      const ENDPOINTS = {
        Aspirante: `${import.meta.env.VITE_API_URL}${
          import.meta.env.VITE_ENDPOINT_ACTUALIZAR_APTITUDES_ASPIRANTE
        }`,
        Docente: `${import.meta.env.VITE_API_URL}${
          import.meta.env.VITE_ENDPOINT_ACTUALIZAR_APTITUDES_DOCENTE
        }`,
      };
      const endpoint = ENDPOINTS[rol];
      await toast.promise(axiosInstance.put(`${endpoint}/${id}`, data), {
        pending: "Actualizando aptitud...",
        success: {
          render() {
            setTimeout(() => {
              window.location.href = "/index";
            }, 1500);
            return "Aptitud actualizada correctamente";
          },
        },
        error: "Error al actualizar la aptitud",
      });
    } catch (error) {
      console.error("Error en la actualización:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col bg-white p-8 rounded-xl shadow-md sm:w-xl max-w-4xl gap-y-4">
      <div className="flex gap-4 items-center">
        <Link to="/index">
          <ButtonRegresar />
        </Link>
        <h4 className="font-bold text-xl">Editar aptitud</h4>
      </div>

      <form
        className="grid grid-cols-1 gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <InputLabel htmlFor="Aptitud" value="Aptitud" />
          <TextInput
            id="Aptitud"
            placeholder="Título de aptitud..."
            {...register("nombre_aptitud")}
          />
          <InputErrors errors={errors} name="nombre_aptitud" />
        </div>

        <div>
          <InputLabel htmlFor="Descripcion" value="Descripción" />
          <TextArea
            id="Descripcion"
            placeholder="Descripción de la aptitud..."
            {...register("descripcion_aptitud")}
          />
          <InputErrors errors={errors} name="descripcion_aptitud" />
        </div>

        <div className="flex justify-center">
          <ButtonPrimary
            value={isSubmitting ? "Actualizando..." : "Actualizar aptitud"}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default EditarAptitud;
