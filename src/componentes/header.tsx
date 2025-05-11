"use client"

import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import Cookies from 'js-cookie'
import { Link, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import axiosInstance from '../utils/axiosConfig'

const Header = () => {


  const [profileImage, setProfileImage] = useState<string>("https://img.freepik.com/...");

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        // 1. Intentar cargar desde sessionStorage primero
        const cachedImage = sessionStorage.getItem('profileImage');
        if (cachedImage) {
          setProfileImage(cachedImage);
        }

        // 2. Hacer petición al servidor
        const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/aspirante/obtener-foto-perfil`, {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` }
        });

        // 3. Actualizar estado y sessionStorage
        const imageUrl = response.data?.fotoPerfil?.documentos_foto_perfil?.[0]?.archivo_url;
        if (imageUrl) {
          setProfileImage(imageUrl);
          sessionStorage.setItem('profileImage', imageUrl);
        }

      } catch (error) {
        console.error("Error al cargar foto:", error);
        // Si hay error, se mantiene la imagen de cache (si existía)
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
      const token = Cookies.get("token"); // Obtén el token

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/cerrar-sesion`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Aquí envías tu token
            'Content-Type': 'application/json',
          },
        }
      );
      Cookies.remove("token");
      //borrar todo el sessionStorage

      sessionStorage.clear();
      setTimeout(() => {
        toast.success("Sesión cerrada correctamente");
      }, 100);
      window.location.href = "/"; // Redirige a la página de inicio
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

const { pathname } = useLocation();
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const dropdownRef = useRef(null);

const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);


  return (
    <>
      <ToastContainer />
      <header className='flex bg-white text-xl font-medium sticky top-0 z-50 shadow-md h-16 w-full'>
        <div className='flex w-full max-w-[1200px] m-auto relative items-center justify-between px-4 md:px-8'>
          <div className='flex items-center gap-4'>
            <h1 className='font-bold text-2xl'>UniDoc</h1>
          </div>

          {/* Botón de hamburguesa solo en móviles */}
          <button className="md:hidden" onClick={toggleMobileMenu}>
            <span className="text-3xl">☰</span>
          </button>

          {/* Menú normal en desktop */}
          <nav className="hidden md:flex h-full">
            <ul className='flex items-center gap-8 text-base'>
              <li>
                <Link className={`hover:border-b-2 ${pathname === "/index" ? "border-b-2 border-blue-500" : ""}`} to="/index">
                  Inicio
                </Link>
              </li>
              <li>
                <Link className={`hover:border-b-2 ${pathname === "/datos-personales" ? "border-b-2 border-blue-500" : ""}`} to="/datos-personales">
                  Datos personales
                </Link>
              </li>
              <li>
                <Link className={`hover:border-b-2 ${pathname === "/normativas" ? "border-b-2 border-blue-500" : ""}`} to="/normativas">
                  Normativas
                </Link>
              </li>
              <li className="relative" ref={dropdownRef}>
                <div onClick={toggleDropdown} className="cursor-pointer flex items-center">
                  <img
                    src={profileImage}
                    alt="Perfil"
                    className="size-10 object-cover rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://img.freepik.com/fotos-premium/retrato-hombre-negocios-expresion-cara-seria-fondo-estudio-espacio-copia-bengala-persona-corporativa-enfoque-pensamiento-duda-mirada-facial-dilema-o-concentracion_590464-84924.jpg";
                    }}
                  />
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full w-48 bg-white rounded-md shadow-lg z-50 text-sm border border-gray-200">
                    <Link to="/configuracion" className="block px-4 py-2 hover:bg-gray-100 border-b border-gray-200" onClick={() => setIsDropdownOpen(false)}>
                      Configuración
                    </Link>
                    <button onClick={() => { logout(); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>

        {/* Menú móvil desplegable */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white border-t z-40 shadow-md md:hidden">
            <ul className="flex flex-col p-4 gap-4 text-base">
              <li>
                <Link to="/index" className={`${pathname === "/index" ? "font-bold text-blue-600" : ""}`} onClick={toggleMobileMenu}>
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/datos-personales" className={`${pathname === "/datos-personales" ? "font-bold text-blue-600" : ""}`} onClick={toggleMobileMenu}>
                  Datos personales
                </Link>
              </li>
              <li>
                <Link to="/normativas" className={`${pathname === "/normativas" ? "font-bold text-blue-600" : ""}`} onClick={toggleMobileMenu}>
                  Normativas
                </Link>
              </li>
              <li>
                <Link to="/configuracion" onClick={toggleMobileMenu}>
                  Configuración
                </Link>
              </li>
              <li>
                <button onClick={() => { logout(); toggleMobileMenu(); }} className="text-left text-red-600">
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        )}
      </header>
    </>
  )
}

export default Header