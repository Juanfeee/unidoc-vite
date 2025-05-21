// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

// Definición de tipos para los roles de usuario

type Props = {
  children: ReactNode;
  allowedRoles?: string[]; // para roles específicos
};

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const token = Cookies.get("token");

  let role: string | undefined;
  
  if (token) {
    // Decodificar el token y tipar la estructura esperada
    const decoded = jwtDecode<{ rol: string }>(token);
    role = decoded.rol;

    // Ahora puedes usar `role` con confianza
    console.log("Rol del usuario:", role);
  } else {
    console.error("Token no encontrado");
  }
  if (!token) {
    // Borrar el sessionStorage y Cookies
    Cookies.remove("rol");
    Cookies.remove("token");
    sessionStorage.clear();
    return <Navigate to="/" replace />;
  }

  // Verificación de roles si se especifican allowedRoles
  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    // Redirigir a página de acceso denegado
    return <Navigate to="/acceso-denegado" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
