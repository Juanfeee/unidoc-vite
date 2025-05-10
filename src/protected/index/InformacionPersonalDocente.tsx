import { useEffect, useState } from "react";
import { LabelText } from "../../componentes/formularios/LabelText";
import { Texto } from "../../componentes/formularios/Texto";
import axiosInstance from "../../utils/axiosConfig";
import Cookies from "js-cookie";
import { Link } from "react-router";
import { PlusIcon } from "@heroicons/react/24/outline";
import AptitudesCarga from "../../componentes/formularios/AptitudesCarga";

const InformacionPersonalDocente = () => {
  const [profileImage, setProfileImage] = useState<string>("https://img.freepik.com/...");
  const [datos, setDatos] = useState<any>();
  const [municipio, setMunicipio] = useState<any>([]);
  const [aptitudes, setAptitudes] = useState<any[]>([]);

  const URL = import.meta.env.VITE_API_URL;
  // Cargar la imagen de perfil al cargar el componente
  const fetchProfileImage = async () => {
    try {
      // 1. Intentar cargar desde localStorage primero
      const cachedImage = localStorage.getItem('profileImage');
      if (cachedImage) {
        setProfileImage(cachedImage);
      }

      // 2. Hacer petición al servidor
      const response = await axiosInstance.get('/auth/obtener-imagen-perfil', {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` }
      });

      // 3. Actualizar estado y localStorage
      if (response.data?.image) {
        setProfileImage(response.data.image);
        localStorage.setItem('profileImage', response.data.image);
      }

    }
    catch (error) {
      console.error('Error al obtener la imagen de perfil:', error);
      // Si hay error, se mantiene la imagen de cache (si existía)
    }
  };


  // Cargar los datos del docente al cargar el componente
  const fetchDatos = async () => {
    try {
      // 1. Intentar cargar desde localStorage primero
      const cachedData = localStorage.getItem('userData');
      if (cachedData) {
        setDatos(JSON.parse(cachedData));
      }

      // 2. Hacer petición al servidor para obtener los datos del usuario
      const response = await axiosInstance.get('/auth/obtener-usuario-autenticado');
      // 3. Si el usuario existe, actualizamos el estado y localStorage
      if (response.data?.user) {
        const user = response.data.user;
        console.log("user", user);
        setDatos(user);
        localStorage.setItem('userData', JSON.stringify(user));

        // 4. Verificamos si existe municipio_id y si es así, hacemos la petición para obtener el municipio
        const municipio = user.municipio_id;
        if (municipio) {
          try {
            const responseMunicipio = await axiosInstance.get(`${URL}/ubicaciones/municipio/${municipio}`);
            console.log("municipio", responseMunicipio.data);

            // 5. Almacenamos el municipio en localStorage si se obtiene correctamente
            localStorage.setItem('municipio', JSON.stringify(responseMunicipio.data));
            setMunicipio(responseMunicipio.data);

          } catch (municipioError) {
            console.error("Error al obtener el municipio:");
          }
        }
      }
    } catch (error) {
      console.error('Error al obtener los datos del docente:', error);
    }
  };




  // Cargar los datos de aptitudes al cargar el componente
  const fetchAptitudes = async () => {
    try {
      // 1. Intentar cargar desde localStorage primero
      const cachedAptitudes = localStorage.getItem('aptitudes');
      if (cachedAptitudes) {
        setAptitudes(JSON.parse(cachedAptitudes));
      }

      // 2. Hacer petición al servidor
      const response = await axiosInstance.get('/aspirante/obtener-aptitudes', {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` }
      });

      // 3. Actualizar estado y localStorage
      if (response.data?.aptitudes) {
        setAptitudes(response.data.aptitudes);
        localStorage.setItem('aptitudes', JSON.stringify(response.data.aptitudes));
      }

    } catch (error) {
      console.error('Error al obtener las aptitudes:', error);
      // Si hay error, se mantienen los datos de cache (si existían)
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchAptitudes(), fetchProfileImage(), fetchDatos()]);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);


  if (!datos) {
    return <div className="grid bg-white py-12 px-8 rounded-xl gap-7 items-center justify-center font-black"><span>Cargando...</span></div>;
  }

  console.log(aptitudes);
  return (
    <>
      <div className="flex flex-col w-full rounded-md lg:w-[800px] xl:w-[1000px] 2xl:w-[1200px] m-auto relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 bg-white py-12 px-8 rounded-xl gap-7">
          <div className="flex flex-col md:flex-row gap-y-2 col-span-full justify-between">
            <h2 className="font-bold text-3xl">Hoja de vida</h2>
            {/* <p className="font-medium text-lg">Estado de validación Académica: <span>a</span> </p> */}
          </div>
          <div className="grid items-center sm:grid-cols-2 col-span-full gap-y-4">
            <h3 className="col-span-full font-semibold text-lg">Datos personales</h3>
            <div className="flex gap-x-4 items-center">
              <img
                src={profileImage}
                alt="Foto de perfil del docente"
                className="size-14 object-cover rounded-full"
                onError={(e) => {
                  // Fallback si la imagen no carga
                  (e.target as HTMLImageElement).src = "https://img.freepik.com/fotos-premium/retrato-hombre-negocios-expresion-cara-seria-fondo-estudio-espacio-copia-bengala-persona-corporativa-enfoque-pensamiento-duda-mirada-facial-dilema-o-concentracion_590464-84924.jpg";
                }}
              />
              <Texto
                value={`${datos.primer_nombre} ${datos?.segundo_nombre} ${datos.primer_apellido} ${datos?.segundo_apellido}`}
              />
            </div>
            {/* <div className="flex sm:justify-end">
              <Puntaje
                value="0.0"
              />
            </div> */}

          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 col-span-full gap-x-8 gap-y-6 border-t-1 py-4 border-gray-200">
            <div>
              <LabelText
                value="Correo electrónico"
              />
              <Texto
                className="break-words"
                value={datos.email}
              />
            </div>
            <div>
              <LabelText
                value="Ubicación"
              />
              <Texto
                value={`${municipio.municipio_nombre
                }, ${municipio.departamento_nombre
                }`}
              />
            </div>
            {/* <div>
              <LabelText
                value="Facultades"
              />
              <Texto
                value="Facultad de Ingenieria, Facultad de Ciencias ambientales"
              />
            </div> */}
          </div>
          <div className="grid col-span-full gap-y-6 border-t-1 py-4 border-gray-200">
            <div className="flex items-center justify-between w-full">
              <Link to={"/agregar/aptitudes"}>
                <p className="flex items-center font-semibold gap-2 bg-[#266AAE] border-2 border-[#266AAE] rounded-md px-2 py-1  text-white  transition-all duration-300 ease-in-out">
                  Agregar aptitudes
                  <span>
                    <PlusIcon className="w-5 h-5 stroke-3" />
                  </span>
                </p>

              </Link>
            </div>
            <div className="col-span-full">
              <ul className="flex flex-wrap gap-2">
                {aptitudes.map((item, index) => (

                  <li key={index} className="flex items-center gap-2">
                    <AptitudesCarga
                      value={item.nombre_aptitud
                      }
                    />
                  </li>
                ))}

              </ul>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
export default InformacionPersonalDocente