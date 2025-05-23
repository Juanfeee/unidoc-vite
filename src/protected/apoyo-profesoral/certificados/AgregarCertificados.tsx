import { Link, useNavigate, useParams } from "react-router";
import { ButtonPrimary } from "../../../componentes/formularios/ButtonPrimary";
import { ButtonRegresar } from "../../../componentes/formularios/ButtonRegresar";
import InputErrors from "../../../componentes/formularios/InputErrors";
import { InputLabel } from "../../../componentes/formularios/InputLabel";
import TextInput from "../../../componentes/formularios/TextInput";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { certificadosSchema } from "../../../validaciones/apoyo-profesoral/certificadosSchema";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosConfig";
import AsyncSelect from "react-select/async";

type Inputs = {
  institucion: string;
  titulo_estudio: string;
  fecha_inicio: string;
  fecha_fin?: string;
  docentes: number[];
};
type Docente = {
  id: number;
  nombre_completo: string;
  email: string;
  numero_identificacion: string;
};

type DocenteOption = {
  value: number;
  label: string;
};

const AgregarCertificados = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Función para redirigir navegaciones
  const [isCertificadoRegistered, setIsCertificadoRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el envío del formulario
  const [selectedDocentes, setSelectedDocentes] = useState<DocenteOption[]>([]);
  const [isLoadingDocentes, setIsLoadingDocentes] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(certificadosSchema), // Esquema de validación usando Zod
  });

  const cargarDocentes = async () => {
    try {
      setIsLoadingDocentes(true);
      const response = await axiosInstance.get(
        "apoyoProfesoral/listar-docentes"
      );
      console.log("Docentes:", response.data.data);
      return response.data.data.map((docente: Docente) => ({
        value: docente.id,
        label: `${docente.nombre_completo} (${docente.numero_identificacion})`,
      }));
    } catch (error) {
      console.error("Error cargando docentes:", error);
      toast.error("Error al cargar la lista de docentes");
      return [];
    } finally {
      setIsLoadingDocentes(false);
    }
  };

  const onSubmit = async (data: Inputs) => {
    setIsSubmitting(true); // Cambia el estado a enviando
    const url = "apoyoProfesoral/crear-certificados-masivos";
    const formData = {
      institucion: data.institucion,
      titulo_estudio: data.titulo_estudio,
      fecha_inicio: data.fecha_inicio,
      fecha_fin: data.fecha_fin || null,
      docentes: data.docentes, // esto ya es un array de números
    };
    try {
      await toast.promise(axiosInstance.post(url, formData), {
        pending: "Creando certificado...",
        success: {
          render() {
            setTimeout(() => {
              // window.location.href = "/talento-humano";
            }, 1500);
            return "Certificado creada con éxito";
          },
          autoClose: 1500,
        },
        error: "Error al crear la certificado",
      });
    } catch (error) {
      console.error("Error al crear certificado:", error);
    } finally {
      setIsSubmitting(false); // Cambia el estado a no enviando
    }
  };
  const handleDocentesChange = (selectedOptions: any) => {
    setSelectedDocentes(selectedOptions || []);
    setValue(
      "docentes",
      (selectedOptions || []).map((opt: DocenteOption) => opt.value),
      {
        shouldValidate: true,
      }
    );
  };
  console.log("watch:", watch());

  return (
    <div className="flex flex-col bg-white p-8 rounded-xl shadow-md w-full max-w-4xl gap-y-4">
      <div className="flex gap-x-4 col-span-full items-center">
        <Link to={"/apoyo-profesoral"}>
          <ButtonRegresar /> {/* Botón para regresar */}
        </Link>
        <h3 className="font-bold text-3xl col-span-full">
          {isCertificadoRegistered
            ? "Editar certificado" // Muestra si está editando una contratación
            : "Agregar certificado"}{" "}
          {/* Muestra si está creando una nueva contratación */}
        </h3>
      </div>
      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        onSubmit={handleSubmit(onSubmit)} // Maneja el envío del formulario
      >
        {/* Institucion */}
        <div>
          <InputLabel htmlFor="institucion" value="Institución *" />
          <TextInput
            type="text"
            id="institucion"
            placeholder="Nombre de la institución"
            {...register("institucion")} // Registra el campo en el formulario
          />
          <InputErrors errors={errors} name="institucion" />
        </div>
        {/* Titulo estudio */}
        <div>
          <InputLabel htmlFor="titulo_estudio" value="Título de estudio *" />
          <TextInput
            type="text"
            id="titulo_estudio"
            placeholder="Nombre del título"
            {...register("titulo_estudio")}
          />
          <InputErrors errors={errors} name="titulo_estudio" />
        </div>

        {/* Fecha de inicio */}
        <div>
          <InputLabel htmlFor="fecha_inicio" value="Fecha de inicio *" />
          <TextInput
            type="date"
            id="fecha_inicio"
            {...register("fecha_inicio")}
          />
          <InputErrors errors={errors} name="fecha_inicio" />
        </div>
        {/* Docentes */}
        <div>
          <InputLabel htmlFor="docentes" value="Docentes *" />
          <AsyncSelect
            id="docentes"
            isMulti
            defaultOptions
            loadOptions={cargarDocentes}
            value={selectedDocentes}
            onChange={handleDocentesChange}
            placeholder="Busque y seleccione docentes..."
            loadingMessage={() => "Cargando docentes..."}
            noOptionsMessage={() => "No se encontraron docentes"}
            className="basic-multi-select"
            classNamePrefix="select"
            isLoading={isLoadingDocentes}
          />

          <InputErrors errors={errors} name="docentes" />
        </div>

        {/* Fecha de fin */}
        <div>
          <InputLabel htmlFor="fecha_fin" value="Fecha de fin *" />
          <TextInput type="date" id="fecha_fin" {...register("fecha_fin")} />
          <InputErrors errors={errors} name="fecha_fin" />
        </div>

        {/* Botón para agregar o actualizar contratación */}
        <div className="flex justify-center col-span-full">
          <ButtonPrimary
            value={
              isSubmitting
                ? "Procesando..."
                : isCertificadoRegistered
                ? "Actualizar certificación"
                : "Crear certificación"
            }
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default AgregarCertificados;
