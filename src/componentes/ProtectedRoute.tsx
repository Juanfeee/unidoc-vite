// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const token = Cookies.get("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
