"use client"

import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import Cookies from 'js-cookie'
import { Link, useLocation } from 'react-router-dom' 



const Header = () => {

  const { pathname } = useLocation();

  //Cerrar sesion
  //asyn es una funcion que se ejecuta de manera asincrona, es decir, no bloquea el hilo principal de ejecucion
  //await es una palabra reservada que se utiliza para esperar a que una promesa se resuelva antes de continuar con la ejecucion del codigo
  const logout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/cerrar-sesion`,
        {},
        {
          withCredentials: true,
        }
      );
      // Eliminar el token de la cookie
      Cookies.remove("token");
      // Redirigir al usuario a la página de inicio de sesión o a otra página
      setTimeout(() => {
        toast.success("Sesión cerrada correctamente");
      }, 100); // muestra brevemente antes de salir
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };



  return (
    <>
      <ToastContainer />
      <header className='flex bg-white text-xl font-medium sticky top-0 z-50 shadow-md h-16'>
        <div className='flex w-[500px] md:w-[800px]  xl:w-[1000px] 2xl:w-[1200px] m-auto relative items-center justify-between size-full px-8'>
          <div className='flex items-center gap-4'>
            <h1 className='font-bold text-2xl'>UniDoc</h1>
          </div>
          <nav className="flex h-full" >
            <ul className='flex items-center justify-center gap-8 text-base'>
              <li className='h-full flex items-center justify-center' >
                <Link
                  className={`flex items-center justify-center hover:border-b-2 ${pathname === "/" ? "border-b-2" : ""
                    }`}
                  to="/"
                >
                  Inicio
                </Link>
              </li>
              <li className='h-full flex items-center justify-center' >
                <Link
                  className={`flex items-center justify-center hover:border-b-2 ${pathname === "/datosPersona" ? "border-b-2" : ""
                    }`}
                  to="/datos-personales"
                >
                  Datos personales
                </Link>
              </li>
              <li className='h-full flex items-center justify-center' >
                <button onClick={() => logout()}>
                  Salir
                </button>
              </li>
              {/* <li className='h-full flex items-center justify-center'>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="flex items-center hover:border-b-2">
                    Trayectoria
                    <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <div className="py-1">
                    <MenuItem>
                      <Link
                        href="/agregar/estudio"
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                      >
                        Agregar estudio academico
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/agregar/experiencia"
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                      >
                        Agregar experiencia laboral

                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/agregar/produccion"
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                      >
                        Agregar produccion academica
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/agregar/idioma"
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                      >
                        Agregar idioma
                      </Link>
                    </MenuItem>

                  </div>
                </MenuItems>
              </Menu>
            </li> */}
              <li>
                <Link
                  className={`flex items-center justify-center hover:border-b-2 ${pathname === "/documentosSoporte" ? "border-b-2" : ""
                    }`}
                  to="/index"
                >
                  <img src="https://img.freepik.com/fotos-premium/retrato-hombre-negocios-expresion-cara-seria-fondo-estudio-espacio-copia-bengala-persona-corporativa-enfoque-pensamiento-duda-mirada-facial-dilema-o-concentracion_590464-84924.jpg" alt=""
                    className='size-12 rounded-full object-cover' />
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  )
}
export default Header