import { useEffect, useState } from "react";
import { LabelText } from "../../componentes/formularios/LabelText";
import { Puntaje } from "../../componentes/formularios/puntaje";
import { Texto } from "../../componentes/formularios/Texto";
import axiosInstance from "../../utils/axiosConfig";
import Cookies from "js-cookie";

const InformacionPersonalDocente = () => {
  const [profileImage, setProfileImage] = useState<string>("https://img.freepik.com/...");
  const [datos, setDatos] = useState<any>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        // 1. Intentar cargar desde localStorage primero
        const cachedImage = localStorage.getItem('profileImage');
        if (cachedImage) {
          setProfileImage(cachedImage);
        }
  
        // 2. Hacer petición al servidor
        const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/aspirante/obtener-foto-perfil`, {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` }
        });
  
        // 3. Actualizar estado y localStorage
        const imageUrl = response.data?.fotoPerfil?.documentos_foto_perfil?.[0]?.archivo_url;
        if (imageUrl) {
          setProfileImage(imageUrl);
          localStorage.setItem('profileImage', imageUrl);
        }
  
      } catch (error) {
        console.error("Error al cargar foto:", error);
        // Si hay error, se mantiene la imagen de cache (si existía)
      }
    };
    
    fetchProfileImage();
  }, []);

  // Cargar los datos del docente al cargar el componente
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        // 1. Intentar cargar desde localStorage primero
        const cachedData = localStorage.getItem('userData');
        if (cachedData) {
          setDatos(JSON.parse(cachedData));
        }
  
        // 2. Hacer petición al servidor
        const response = await axiosInstance.get('/auth/obtener-usuario-autenticado');
        
        // 3. Actualizar estado y localStorage
        if (response.data?.user) {
          setDatos(response.data.user);
          localStorage.setItem('userData', JSON.stringify(response.data.user));
        }
  
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        // Si hay error, se mantienen los datos de cache (si existían)
      }
    };
  
    fetchDatos();
  }, []);

  if (!datos) {
    return <div className="grid bg-white py-12 px-8 rounded-xl gap-7 items-center justify-center font-black"><span>Cargando...</span></div>;
  }
  return (
    <>
      <div className="flex flex-col w-full rounded-md lg:w-[800px] xl:w-[1000px] 2xl:w-[1200px] m-auto relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 bg-white py-12 px-8 rounded-xl gap-7">
          <div className="flex flex-col md:flex-row gap-y-2 col-span-full justify-between">
            <h2 className="font-bold text-3xl">Hoja de vida</h2>
            <p className="font-medium text-lg">Estado de validación Académica: <span>a</span> </p>
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
            <div className="flex sm:justify-end">
              <Puntaje
                value="0.0"
              />
            </div>

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
                value="Popayán, Cauca"
              />
            </div>
            <div>
              <LabelText
                value="Facultades"
              />
              <Texto
                value="Facultad de Ingenieria, Facultad de Ciencias ambientales"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default InformacionPersonalDocente