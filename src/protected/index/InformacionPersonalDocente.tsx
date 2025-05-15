import { useEffect, useState } from "react";
import { LabelText } from "../../componentes/formularios/LabelText";
import { Texto } from "../../componentes/formularios/Texto";
import axiosInstance from "../../utils/axiosConfig";
import Cookies from "js-cookie";
import { Link } from "react-router";
import { PlusIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import AptitudesCarga from "../../componentes/formularios/AptitudesCarga";

const InformacionPersonalDocente = () => {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const [datos, setDatos] = useState<any>();
  const [municipio, setMunicipio] = useState<any>([]);
  const [aptitudes, setAptitudes] = useState<any[]>([]);
  const URL = import.meta.env.VITE_API_URL;

  // Obtener imagen de perfil
  const fetchProfileImage = async () => {
    try {
      // 2. Hacer petición al servidor
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/aspirante/obtener-foto-perfil`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );

      const documentos = response.data.fotoPerfil?.documentos_foto_perfil;

      if (documentos && documentos.length > 0) {
        const imageUrl = documentos[0].archivo_url;
        setProfileImageUrl(imageUrl);
      }
    } catch (error) {
      console.error("Error al obtener la imagen de perfil:", error);
    }
  };

  // Obtener datos del usuario
  const fetchDatos = async () => {
    try {
      // 2. Hacer petición al servidor para obtener los datos del usuario
      const response = await axiosInstance.get(
        "/auth/obtener-usuario-autenticado"
      );

      // 3. Si el usuario existe, actualizamos el estado y sessionStorage
      const user = response.data.user;
      setDatos(user);

      // 4. Verificamos si existe municipio_id y si es así, hacemos la petición para obtener el municipio
      const municipio = user.municipio_id;
      if (municipio) {
        try {
          const responseMunicipio = await axiosInstance.get(
            `${URL}/ubicaciones/municipio/${municipio}`
          );
          setMunicipio(responseMunicipio.data);
        } catch (municipioError) {
          console.error("Error al obtener el municipio:");
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
        sessionStorage.setItem(
          "aptitudes",
          JSON.stringify(response.data.aptitudes)
        );
      }
    } catch (error) {
      console.error("Error al obtener las aptitudes:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchAptitudes(),
          fetchProfileImage(),
          fetchDatos(),
        ]);
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
          <div className="flex  col-span-full md:flex-row gap-y-2 justify-between">
            <h2 className="font-bold text-3xl">Hoja de vida</h2>
          </div>

          <div className="grid items-center sm:grid-cols-2 col-span-full gap-y-4">
            <h3 className="col-span-full font-semibold text-lg">
              Datos personales
            </h3>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 size-14 rounded-full overflow-hidden border border-gray-200">
                <img
                  className="w-full h-full object-cover"
                  src={
                    profileImageUrl ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt="Perfil"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                  }}
                />
              </div>
              <Texto
                value={`${datos.primer_nombre} ${datos?.segundo_nombre || ""} ${
                  datos.primer_apellido
                } ${datos?.segundo_apellido || ""}`}
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
              <LabelText value="Correo electrónico" />
              <Texto className="break-words" value={datos.email} />
            </div>
            <div>
              <LabelText value="Ubicación" />
              <Texto
                value={`${municipio.municipio_nombre || ""}, ${
                  municipio.departamento_nombre || ""
                }`}
              />
            </div>
          </div>

          <div className="grid col-span-full gap-y-6 border-t-1 py-4 border-gray-200">
            <div className="flex col-span-full items-center justify-between">
              <div className="flex items-center justify-around gap-4">
                <Link to={"/agregar/aptitudes"}>
                  <p className="flex items-center font-semibold gap-2 bg-[#266AAE] border-2 border-[#266AAE] rounded-md px-2 py-1 text-white transition-all duration-300 ease-in-out">
                    Agregar aptitudes
                    <span>
                      <PlusIcon className="w-5 h-5 stroke-3" />
                    </span>
                  </p>
                </Link>
              </div>
              <div className="flex items-center justify-around gap-4">
                <div className="flex items-center justify-around gap-4">
                  <Link to={"/editar/aptitud/${item.id}"}>
                    <p className="flex items-center font-semibold gap-2 bg-[#266AAE] border-2 border-[#266AAE] rounded-md px-2 py-1 text-white transition-all duration-300 ease-in-out">
                      <span>
                        <EllipsisVerticalIcon className="w-5 h-5 stroke-3" />
                      </span>
                    </p>
                  </Link>
                </div>
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
