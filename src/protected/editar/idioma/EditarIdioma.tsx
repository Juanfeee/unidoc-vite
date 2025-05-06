import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axiosInstance from "../../../utils/axiosConfig";
import { ButtonRegresar } from "../../../componentes/formularios/ButtonRegresar";
import { InputLabel } from "../../../componentes/formularios/InputLabel";
import { SelectForm } from "../../../componentes/formularios/SelectForm";
import InputErrors from "../../../componentes/formularios/InputErrors";
import TextInput from "../../../componentes/formularios/TextInput";
import { ButtonPrimary } from "../../../componentes/formularios/ButtonPrimary";
import { languageSchema } from "../../../validaciones/languageSchema";
import { AdjuntarArchivo } from "../../../componentes/formularios/AdjuntarArchivo";

type Inputs = {
    idioma: string;
    institucion_idioma: string;
    nivel: string;
    fecha_certificado: string;
    archivo: FileList;
};

const EditarIdioma = () => {
    const { id } = useParams();  // Obtener el ID del idioma a través de la URL
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(languageSchema),
    });


    console.log("Formulario", watch());

    useEffect(() => {
        const fetchIdioma = async () => {
            try {
                const token = Cookies.get("token");
                const { data } = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/aspirante/obtener-idioma/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Verificar los datos que llegan desde la API
                console.log("Datos del idioma:", data);

                setValue('idioma', data.idioma.idioma);
                setValue('institucion_idioma', data.idioma.institucion_idioma);
                setValue('nivel', data.idioma.nivel);
                setValue('fecha_certificado', data.idioma.fecha_certificado || '');

                // Verifica si los valores están correctos
                console.log(watch());
            } catch (error) {
                toast.error("Error al cargar los datos del idioma.");
            }
        };

        fetchIdioma();
    }, [id, setValue, watch]);

    const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append("idioma", data.idioma);
        formData.append("institucion_idioma", data.institucion_idioma);
        formData.append("nivel", data.nivel);
        formData.append("fecha_certificado", data.fecha_certificado || '');
        formData.append("archivo", data.archivo[0]);

        const token = Cookies.get("token");
        const url = `${import.meta.env.VITE_API_URL}/aspirante/actualizar-idioma/${id}`;

        const putPromise = axiosInstance.post(url, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
            timeout: 10000,
        });

        toast.promise(putPromise, {
            pending: "Actualizando datos...",
            success: {
                render() {
                    // Redirige después de actualizar
                    setTimeout(() => {
                        window.location.href = "/index";
                    }, 1500);
                    return "Datos actualizados correctamente";
                },
                autoClose: 1500,
            },
            error: {
                render({ data }) {
                    const error = data;
                    if (axios.isAxiosError(error)) {
                        if (error.code === "ECONNABORTED") {
                            return "Tiempo de espera agotado. Intenta de nuevo.";
                        } else if (error.response) {
                            const errores = error.response.data?.errors;
                            if (errores && typeof errores === 'object') {
                                const mensajes = Object.values(errores)
                                    .flat()
                                    .join('\n');
                                return `Errores del formulario:\n${mensajes}`;
                            }
                            return error.response.data?.message || "Error al actualizar los datos.";
                        } else if (error.request) {
                            return "No se recibió respuesta del servidor.";
                        }
                    }
                    return "Error inesperado al actualizar los datos.";
                },
                autoClose: 3000,
            },
        });
    };

    return (
        <>
            <form className='flex flex-col gap-y-4 rounded-md lg:w-[800px] xl:w-[1000px] 2xl:w-[1200px] m-auto relative'
                onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-col sm:grid grid-cols-3 gap-x-8 bg-white gap-y-6 py-12 px-8 rounded-xl'>
                    <div className='flex gap-x-4 col-span-full'>
                        <Link to={"/index"}>
                            <ButtonRegresar />
                        </Link>
                        <h3 className="font-bold text-3xl col-span-full">Editar idioma</h3>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 col-span-full gap-4'>
                        <div className='flex flex-col w-full'>
                            <InputLabel htmlFor='idioma' value="Idioma" />
                            <TextInput
                                id='idioma'
                                placeholder="Ingrese el idioma"
                                {...register('idioma')}
                            />
                            <InputErrors errors={errors} name="idioma" />
                        </div>

                        <div className='flex flex-col w-full'>
                            <InputLabel htmlFor='institucion' value="Institución" />
                            <TextInput
                                id='institucion_idioma'
                                placeholder="Nombre de la institución"
                                {...register('institucion_idioma')}
                            />
                            <InputErrors errors={errors} name="institucion" />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 col-span-full gap-4'>
                        <div className='flex flex-col w-full'>
                            <InputLabel htmlFor='nivel_idioma' value="Nivel de idioma" />
                            <SelectForm
                                id='nivel'
                                register={register('nivel')}
                                url='niveles-idioma'
                                data_url='nivel_idioma'
                            />
                            <InputErrors errors={errors} name="nivel_idioma" />
                        </div>

                        <div className='flex flex-col w-full'>
                            <InputLabel htmlFor='fecha_certificado' value="Fecha de certificado" />
                            <TextInput
                                type='date'
                                id='fecha_certificado'
                                {...register('fecha_certificado')}
                            />
                            <InputErrors errors={errors} name="fecha_certificado" />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="archivo" value="Archivo" />
                        <AdjuntarArchivo
                            id="archivo"
                            register={register('archivo')}
                        />
                        <InputErrors errors={errors} name="archivo" />
                    </div>
                    <div className='flex justify-center col-span-full' >
                        <ButtonPrimary value='Agregar estudio' />
                    </div>
                </div>
            </form>
        </>
    );
};

export default EditarIdioma;