import { useForm } from "react-hook-form";
import { ButtonPrimary } from "../../../componentes/formularios/ButtonPrimary";
import InputErrors from "../../../componentes/formularios/InputErrors";
import { InputLabel } from "../../../componentes/formularios/InputLabel";
import TextInput from "../../../componentes/formularios/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { contratacionSchema } from "../../../validaciones/talento-humano.ts/contratacionSchema";
import TextArea from "../../../componentes/formularios/TextArea";
import { Link, useParams } from "react-router-dom";
import { ButtonRegresar } from "../../../componentes/formularios/ButtonRegresar";
import { SelectLocales } from "../../../componentes/formularios/SelectsLocales";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosConfig";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

type Inputs = {
    tipo_contrato: string;
    area: string;
    fecha_inicio: string;
    fecha_fin: string;
    valor_contrato: number;
    observaciones?: string;
};

const AgregarContratacion = () => {
    const { userId } = useParams<{ userId: string }>(); // Obtener el userId desde los parámetros de la URL
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        console.log("userId recibido desde useParams:", userId);
    }, [userId]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(contratacionSchema),
    });

    const onSubmit = async (data: Inputs) => {
        if (!userId) {
            toast.error("No se proporcionó un ID de usuario válido en la URL.");
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("tipo_contrato", data.tipo_contrato);
        formData.append("area", data.area);
        formData.append("fecha_inicio", data.fecha_inicio);
        formData.append("fecha_fin", data.fecha_fin);
        formData.append("valor_contrato", data.valor_contrato.toString());
        if (data.observaciones) {
            formData.append("observaciones", data.observaciones);
        }

        const url = `${import.meta.env.VITE_API_URL}/talento-humano/crear-contratacion/${userId}`;

        const token = Cookies.get("token");
        try {
            await toast.promise(
                axiosInstance.post(url, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: 10000,
                }),
                {
                    pending: "Creando contratación...",
                    success: {
                        render() {
                            return "Contratación creada con éxito";
                        },
                        autoClose: 1500,
                    },
                    error: "Error al crear la contratación",
                }
            );
        } catch (error) {
            console.error("Error al crear la contratación:", error);
            toast.error("Ocurrió un error al crear la contratación.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col bg-white p-8 rounded-xl shadow-md w-full max-w-4xl gap-y-4">
            <div className="flex gap-x-4 col-span-full items-center">
                <Link to={"/talento-humano"}>
                    <ButtonRegresar />
                </Link>
                <h3 className="font-bold text-3xl col-span-full">
                    Agregar Contratación
                </h3>
            </div>
            <form
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                {/* Tipo de Contrato */}
                <div>
                    <InputLabel htmlFor="tipo_contrato" value="Tipo de Contrato" />
                    <SelectLocales
                        id="tipo_contrato"
                        register={register("tipo_contrato")}
                    />
                    <InputErrors errors={errors} name="tipo_contrato" />
                </div>

                {/* Área */}
                <div>
                    <InputLabel htmlFor="area" value="Área de Contratación" />
                    <SelectLocales id="area" register={register("area")} />
                    <InputErrors errors={errors} name="area" />
                </div>

                {/* Fecha de Inicio */}
                <div>
                    <InputLabel htmlFor="fecha_inicio" value="Fecha de Inicio" />
                    <TextInput
                        id="fecha_inicio"
                        type="date"
                        {...register("fecha_inicio")}
                    />
                    <InputErrors errors={errors} name="fecha_inicio" />
                </div>

                {/* Fecha de Fin */}
                <div>
                    <InputLabel htmlFor="fecha_fin" value="Fecha de Fin" />
                    <TextInput id="fecha_fin" type="date" {...register("fecha_fin")} />
                    <InputErrors errors={errors} name="fecha_fin" />
                </div>

                {/* Valor del Contrato */}
                <div>
                    <InputLabel htmlFor="valor_contrato" value="Valor del Contrato" />
                    <TextInput
                        id="valor_contrato"
                        type="number"
                        placeholder="Valor en pesos..."
                        {...register("valor_contrato")}
                    />
                    <InputErrors errors={errors} name="valor_contrato" />
                </div>

                {/* Observaciones */}
                <div className="col-span-full">
                    <InputLabel htmlFor="observaciones" value="Observaciones" />
                    <TextArea
                        id="observaciones"
                        placeholder="Ingrese observaciones..."
                        {...register("observaciones")}
                    />
                    <InputErrors errors={errors} name="observaciones" />
                </div>

                {/* Botón */}
                <div className="flex justify-center col-span-full">
                    <ButtonPrimary
                        value={isSubmitting ? "Enviando..." : "Agregar Contratación"}
                        disabled={isSubmitting}
                    />
                </div>
            </form>
        </div>
    );
};

export default AgregarContratacion;

