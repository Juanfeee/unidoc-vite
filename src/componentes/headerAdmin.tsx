"use client"

import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import Cookies from 'js-cookie'
import { Link, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'


const HeaderAdmin = () => {




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
      Cookies.remove("rol");
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
                <Link className={`hover:border-b-2 ${pathname === "/index" ? "border-b-2 border-blue-500" : ""}`} to="/dashboard">
                  Inicio
                </Link>
              </li>
              <li>
                <button onClick={() => { logout(); toggleMobileMenu(); }} className="text-left text-red-600">
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Menú móvil desplegable */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white border-t z-40 shadow-md md:hidden">
            <ul className="flex flex-col p-4 gap-4 text-base">
              <li>
                <Link className={`hover:border-b-2 ${pathname === "/index" ? "border-b-2 border-blue-500" : ""}`} to="/dashboard">
                  Inicio
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

export default HeaderAdmin