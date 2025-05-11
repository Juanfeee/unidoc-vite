import { useEffect, useState } from "react";
import { LabelText } from "../../componentes/formularios/LabelText";
import { Texto } from "../../componentes/formularios/Texto";
import axiosInstance from "../../utils/axiosConfig";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router";
import { PlusIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import AptitudesCarga from "../../componentes/formularios/AptitudesCarga";
import { Popover } from "@headlessui/react";

const InformacionPersonalDocente = () => {
  const [profileImage, setProfileImage] = useState<string>("https://img.freepik.com/...");
  const [datos, setDatos] = useState<any>();
  const [municipio, setMunicipio] = useState<any>([]);
  const [aptitudes, setAptitudes] = useState<any[]>([]);
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_API_URL;

  // Obtener imagen de perfil
  const fetchProfileImage = async () => {
    try {
      const cachedImage = sessionStorage.getItem("profileImage");
      if (cachedImage) {
        setProfileImage(cachedImage);
      }

      const response = await axiosInstance.get("/aspirante/obtener-foto-perfil", {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });

      if (response.data?.image) {
        setProfileImage(response.data.image);
        sessionStorage.setItem("profileImage", response.data.image);
      }
    } catch (error) {
      console.error("Error al obtener la imagen de perfil:", error);
    }
  };

  // Obtener datos del usuario
  const fetchDatos = async () => {
    try {
      const cachedData = sessionStorage.getItem("userData");
      if (cachedData) {
        setDatos(JSON.parse(cachedData));
      }

      const response = await axiosInstance.get("/auth/obtener-usuario-autenticado");

      if (response.data?.user) {
        const user = response.data.user;
        setDatos(user);
        sessionStorage.setItem("userData", JSON.stringify(user));

        const municipio = user.municipio_id;
        if (municipio) {
          try {
            const responseMunicipio = await axiosInstance.get(`${URL}/ubicaciones/municipio/${municipio}`);
            sessionStorage.setItem("municipio", JSON.stringify(responseMunicipio.data));
            setMunicipio(responseMunicipio.data);
          } catch (municipioError) {
            console.error("Error al obtener el municipio:");
          }
        }
      }
    } catch (error) {
      console.error("Error al obtener los datos del docente:", error);
    }
  };


  // Obtener aptitudes
  const fetchAptitudes = async () => {
    try {
      const cachedAptitudes = sessionStorage.getItem("aptitudes");
      if (cachedAptitudes) {
        setAptitudes(JSON.parse(cachedAptitudes));
      }

      const response = await axiosInstance.get("/aspirante/obtener-aptitudes", {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });

      if (response.data?.aptitudes) {
        setAptitudes(response.data.aptitudes);
        sessionStorage.setItem("aptitudes", JSON.stringify(response.data.aptitudes));
      }
    } catch (error) {
      console.error("Error al obtener las aptitudes:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchAptitudes(), fetchProfileImage(), fetchDatos()]);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();
  }, []);

  if (!datos) {
    return (
      <div className="grid bg-white py-12 px-8 rounded-xl gap-7 items-center justify-center font-black">
        <span>Cargando...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col w-full rounded-md lg:w-[800px] xl:w-[1000px] 2xl:w-[1200px] m-auto relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 bg-white py-12 px-8 rounded-xl gap-7">
          <div className="flex flex-col md:flex-row gap-y-2 col-span-full justify-between">
            <h2 className="font-bold text-3xl">Hoja de vida</h2>
          </div>

          <div className="grid items-center sm:grid-cols-2 col-span-full gap-y-4">
            <h3 className="col-span-full font-semibold text-lg">Datos personales</h3>
            <div className="flex gap-x-4 items-center">
              <img
                src={profileImage}
                alt="Foto de perfil del docente"
                className="size-14 object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://img.freepik.com/fotos-premium/retrato-hombre-negocios-expresion-cara-seria-fondo-estudio-espacio-copia-bengala-persona-corporativa-enfoque-pensamiento-duda-mirada-facial-dilema-o-concentracion_590464-84924.jpg";
                }}
              />
              <Texto
                value={`${datos.primer_nombre} ${datos?.segundo_nombre} ${datos.primer_apellido} ${datos?.segundo_apellido}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 col-span-full gap-x-8 gap-y-6 border-t-1 py-4 border-gray-200">
            <div>
              <LabelText value="Correo electrónico" />
              <Texto className="break-words" value={datos.email} />
            </div>
            <div>
              <LabelText value="Ubicación" />
              <Texto value={`${municipio.municipio_nombre}, ${municipio.departamento_nombre}`} />
            </div>
          </div>


          <div className="grid col-span-full gap-y-6 border-t-1 py-4 border-gray-200">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <Link to={"/agregar/aptitudes"}>
                  <p className="flex items-center font-semibold gap-2 bg-[#266AAE] border-2 border-[#266AAE] rounded-md px-2 py-1 text-white transition-all duration-300 ease-in-out">
                    Agregar aptitudes
                    <span>
                      <PlusIcon className="w-5 h-5 stroke-3" />
                    </span>
                  </p>
                </Link>
                <Popover className="relative">
                  <Popover.Button className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none">
                    <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
                  </Popover.Button>
                  <Popover.Panel className="absolute z-10 w-48 py-1 mt-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="flex flex-col">
                      <Link
                        to="/editar/aptitud/${item.id}"
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Editar aptitudes
                      </Link>
                    </div>
                  </Popover.Panel>
                </Popover>
              </div>
            </div>

            <div className="col-span-full">
              <ul className="flex flex-wrap gap-2">
                {aptitudes.map((item, index) => (
                  <li key={index}>
                    <AptitudesCarga value={item.nombre_aptitud} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default InformacionPersonalDocente;
