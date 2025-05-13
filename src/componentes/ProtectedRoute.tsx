// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ReactNode } from "react";

// Definición de tipos para los roles de usuario
type userRole = "Administrador" | "Aspirante" 

type Props = {
  children: ReactNode;
  allowedRoles?: string[]; // para roles específicos
};

const ProtectedRoute = ({ children, allowedRoles  }: Props) => {
  const token = Cookies.get("token");
  const role = Cookies.get("rol") as userRole | undefined; 


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
