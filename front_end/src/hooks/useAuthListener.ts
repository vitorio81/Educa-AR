import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export const useAuthListener = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = () => logout();

    window.addEventListener("logout", handleLogout);

    return () => window.removeEventListener("logout", handleLogout);
  }, [logout]);
};
