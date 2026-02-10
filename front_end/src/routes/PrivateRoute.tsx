import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // Ou um spinner

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
