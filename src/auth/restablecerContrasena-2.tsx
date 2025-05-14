import { SubmitHandler, useForm } from "react-hook-form"
import { ButtonPrimary } from "../componentes/formularios/ButtonPrimary"
import InputErrors from "../componentes/formularios/InputErrors"
import { InputLabel } from "../componentes/formularios/InputLabel"
import TextInput from "../componentes/formularios/TextInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { restablecerContrasenaSchema } from "../validaciones/restablecerContrasenaSchema"
import axios from "axios"
import { toast } from "react-toastify"
import Cookies from "js-cookie"
import { Link } from "react-router"

type Inputs = {
  email: string
  password: string
  password_confirmation: string
  token: string
}


const RestablecerContrasena2 = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(restablecerContrasenaSchema) });

  const url = import.meta.env.VITE_API_URL + "/auth/restablecer-contrasena";

  const onSubmit: SubmitHandler<Inputs> = async (data) => {

    const loginPromise = axios.post(url, data, {

      //Cabeceras de la peticion
      headers: {
        'Content-Type': 'application/json', // Tipo de contenido
        'Accept': 'application/json' // Aceptar respuesta en formato JSON
      },
      timeout: 210000 // 10 segundos timeout
    })

    // Manejo de la respuesta
    toast.promise(
      loginPromise, {
      pending: "Enviando correo...",
      success: {
        render({ data }) {
          const { token } = data.data;

          // Redirige después de un pequeño delay
          setTimeout(() => {
            window.location.href = "/";
          }, 500);

          return "¡Tu contraseña ha sido restablecida con éxito!";
        },
        autoClose: 500,
      },
      error: {
        render({ data }) {
          const error = data;
          if (axios.isAxiosError(error)) {
            if (error.code === "ECONNABORTED") {
              return "Tiempo de espera agotado. Intente nuevamente";
            } else if (error.response) {
              switch (error.response.status) {
                case 401:
                  return "Credenciales incorrectas";
                case 500:
                  return "Error en el servidor";
                default:
                  return error.response.data?.message || "Error al restablecer la contraseña";
              }
            } else if (error.request) {
              return "No se recibió respuesta del servidor";
            }
          }
          return "Error al restablecer la contraseña";
        },
        autoClose: 2000,

      }
    }
    );

  }

  return (
    <form className="flex flex-col items-center justify-center h-screen"


      onSubmit={handleSubmit(onSubmit)}>
      <div className="flex bg-white flex-col gap-4 px-8 py-4 w-[500px] min-h-[550px] shadow-lg justify-center relative rounded-3xl animacion-entrada " >
        <div className='flex flex-col gap-2 w-full' >
          < h3 className="font-bold text-2xl" > Restablecer contraseña </h3>
          <h3>Ok! <span className='text-yellow-500 font-bold'>Coloca</span> tu nueva contraseña y esta vez <span className='text-green-600 font-bold'>no la olvides!</span></h3>

        </div>
        < div className="" >
          <InputLabel htmlFor="password" value="Contraseña" />
          <TextInput
            id="password"
            type="password"
            placeholder="Contraseña..."
            {...register("password")}
          />
          < InputErrors errors={errors} name="password" />
        </div>
        < div className="" >
          <InputLabel htmlFor="password_confirmation" value="Confirmar contraseña" />
          <TextInput
            id="password_confirmation"
            type="password"
            placeholder="Confirmar contraseña..."
            {...register("password_confirmation")}
          />
          < InputErrors errors={errors} name="password_confirmation" />
        </div>
        <div className="">
          <ButtonPrimary
            className="w-full"
            value="Restablecer contraseña"
            type="submit"
          />
        </div>
        <p className="text-base text-gray-500 text-center">
          <Link to="/" className="text-blue-500 hover:text-blue-600">
            Volver a iniciar sesión
          </Link>
        </p>
        <div className='absolute size-full right-0 rotate-5 rounded-3xl -z-10  bg-blue-500'></div>
      </div >
    </form >

  )
}
export default RestablecerContrasena2