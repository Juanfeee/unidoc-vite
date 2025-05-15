"use client";

import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { Link, useLocation} from "react-router-dom";
import { useState } from "react";

const HeaderTalentoHumano = () => {
  const { pathname } = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);



  const logout = async () => {
    try {
      const token = Cookies.get("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/cerrar-sesion`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Limpiar todos los datos de sesión
      Cookies.remove("token");
      Cookies.remove("rol");
      sessionStorage.clear();

      // Feedback al usuario
      toast.success("Sesión cerrada correctamente");

      // Redirigir después de un breve retraso
      setTimeout(() => {

        window.location.href = "/";
        
      }, 500);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Ocurrió un error al cerrar sesión");
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="flex bg-white text-xl font-medium sticky top-0 z-50 shadow-md h-16 w-full">
        <div className="flex w-full max-w-[1200px] m-auto relative items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-2xl">UniDoc-TalentoHumano</h1>
          </div>

          {/* Botón de hamburguesa solo en móviles */}
          <button
            className="md:hidden p-2 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Menú móvil"
          >
            <span className="text-3xl">☰</span>
          </button>

          {/* Menú normal en desktop */}
          <nav className="hidden md:flex h-full">
            <ul className="flex items-center gap-8 text-base">
              <li>
                <Link className={`hover:border-b-2 ${pathname === "/index" ? "border-b-2 border-blue-500" : ""}`} to="/dashboard">
                  Inicio
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Menú móvil desplegable */}
        {isMobileMenuOpen && (
          <div className="fixed top-16 left-0 w-full bg-white border-t z-40 shadow-lg md:hidden animate-slideDown">
            <ul className="flex flex-col p-4 gap-4 text-base">
              <li>
                <Link
                  className={`block py-2 px-4 hover:bg-blue-50 rounded ${
                    pathname === "/dashboard"
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                  }`}
                  to="/dashboard"
                  onClick={toggleMobileMenu}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    logout();
                    toggleMobileMenu();
                  }}
                  className="block w-full text-left py-2 px-4 text-red-600 hover:bg-red-50 rounded"
                >
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        )}
      </header>
    </>
  );
};

export default HeaderTalentoHumano;
