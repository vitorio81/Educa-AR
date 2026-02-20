import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    const searchParams = new URLSearchParams(location.search);

    const userId = searchParams.get("userId");
    const roomId = searchParams.get("roomId");
    const objectId = searchParams.get("objectId");

    if (userId && roomId && objectId) {
      return <Navigate to={`/login/${userId}/${roomId}/${objectId}`} replace />;
    }

    // fallback se não vier nada
    return <Navigate to="/login/0/0/0" replace />;
  }

  return children;
}
