"use client"

import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import Cookies from 'js-cookie'
import { Link, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import axiosInstance from '../utils/axiosConfig'

const Header = () => {
  const { pathname } = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [profileImage, setProfileImage] = useState<string>("https://img.freepik.com/...");

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/aspirante/obtener-foto-perfil`, {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` }
        });

        // Acceso directo a la URL sin tipo definido
        const imageUrl = response.data?.fotoPerfil?.documentos_foto_perfil?.[0]?.archivo_url;
        if (imageUrl) setProfileImage(imageUrl);

      } catch (error) {
        console.error("Error al cargar foto:", error);
      }
    };
    fetchProfileImage();
  }, []);

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/cerrar-sesion`,
        {},
        {
          withCredentials: true,
        }
      );
      Cookies.remove("token");
      setTimeout(() => {
        toast.success("Sesión cerrada correctamente");
      }, 100);
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <ToastContainer />
      <header className='flex bg-white text-xl font-medium sticky top-0 z-50 shadow-md h-16 w-full'>
        <div className='flex w-[500px] md:w-[800px] xl:w-[1000px] 2xl:w-[1200px] m-auto relative items-center justify-between size-full px-8'>
          <div className='flex items-center gap-4'>
            <h1 className='font-bold text-2xl'>UniDoc</h1>
          </div>
          <nav className="flex h-full">
            <ul className='flex items-center justify-center gap-8 text-base'>
              <li className='h-full flex items-center justify-center'>
                <Link
                  className={`flex items-center justify-center hover:border-b-2 ${pathname === "/" ? "border-b-2 border-blue-500" : ""}`}
                  to="/index"
                >
                  Inicio
                </Link>
              </li>
              <li className='h-full flex items-center justify-center'>
                <Link
                  className={`flex items-center justify-center hover:border-b-2 ${pathname === "/datos-personales" ? "border-b-2 border-blue-500" : ""}`}
                  to="/datos-personales"
                >
                  Datos personales
                </Link>
              </li>

              <li className="relative h-full flex items-center" ref={dropdownRef}>
                <div
                  className="cursor-pointer flex items-center"
                  onClick={toggleDropdown}
                >
                  <img
                    src={profileImage}
                    alt="Foto de perfil del docente"
                    className="size-10 object-cover rounded-full"
                    onError={(e) => {
                      // Fallback si la imagen no carga
                      (e.target as HTMLImageElement).src = "https://img.freepik.com/fotos-premium/retrato-hombre-negocios-expresion-cara-seria-fondo-estudio-espacio-copia-bengala-persona-corporativa-enfoque-pensamiento-duda-mirada-facial-dilema-o-concentracion_590464-84924.jpg";
                    }}
                  />
                </div>
                {/* Menú desplegable */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full w-48 bg-white rounded-md shadow-lg z-50 text-sm border border-gray-200">
                    <Link
                      to="/perfil"
                      className="block px-4 py-2 hover:bg-gray-100 border-b border-gray-200 rounded-t-md"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Mi perfil
                    </Link>
                    <Link
                      to="/configuracion"
                      className="block px-4 py-2 hover:bg-gray-100 border-b border-gray-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Configuración
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-md text-red-600"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  )
}

export default Header